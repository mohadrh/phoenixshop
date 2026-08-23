'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Timer } from 'lucide-react';
import { PRODUCTS, getDefaultVariant, type Product } from '../../data/catalog';
import { ProductCard } from '../product/ProductCard';

/**
 * چرخ‌فلک تخفیف‌های روز.
 *
 * برخلاف نوار قبلی که همه‌ی کارت‌ها را هم‌اندازه از یک طرف به طرف دیگر
 * می‌برد، اینجا کارت‌ها روی یک قوس می‌نشینند: هرچه به مرکز نزدیک‌تر،
 * بزرگ‌تر و روشن‌تر و جلوتر. دو سر محو می‌شوند. یعنی همیشه یک کارت
 * «الان» است و بقیه در حاشیه — چشم می‌داند کجا را نگاه کند.
 *
 * چرا با JavaScript و نه CSS: اندازه، چرخش و شفافیت هر کارت تابعی از
 * فاصله‌اش تا مرکز است، و آن فاصله هر فریم عوض می‌شود. CSS چنین
 * وابستگی‌ای را بیان نمی‌کند.
 *
 * ولی setState هر فریم هم در کار نیست — آن یعنی صدها رندر React در
 * ثانیه. ترنسفورم‌ها مستقیم روی DOM نوشته می‌شوند و React از حلقه
 * بیرون می‌ماند.
 */

const CARD_W = 258;   // عرض کارت
const GAP = 30;       // فاصله‌ی لبه تا لبه
const SPEED = 24;     // پیکسل بر ثانیه — عمداً کند

/* ---------------------------------------------------------------
   شمارش معکوس تا پایان روز.

   تخفیف‌ها یک‌روزه‌اند و نیمه‌شب برمی‌گردند سر جای اول. تا حالا متن
   این را ادعا می‌کرد بدون اینکه چیزی پشتش باشد؛ حالا عدد واقعی است
   و خودش تا صفر می‌رود.

   ساعت روی سرور رندر نمی‌شود: با SSR، زمانِ سرور در HTML می‌نشیند و
   موقع hydrate با ساعت مرورگر نمی‌خواند. تا اولین افکت، جای عدد خالی
   می‌ماند.
--------------------------------------------------------------- */
function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(msUntilMidnight());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (left === null) return null;
  const total = Math.max(0, Math.floor(left / 1000));
  const pad = (n: number) => n.toLocaleString('fa-IR', { minimumIntegerDigits: 2, useGrouping: false });
  return {
    h: pad(Math.floor(total / 3600)),
    m: pad(Math.floor((total % 3600) / 60)),
    s: pad(total % 60),
  };
}

function discountOf(p: Product) {
  const v = getDefaultVariant(p);
  if (!v.compareAt || v.compareAt <= v.price) return 0;
  return Math.round((1 - v.price / v.compareAt) * 100);
}

export function DealsMarquee() {
  const deals = useMemo(
    () =>
      PRODUCTS
        .filter((p) => discountOf(p) > 0)
        .sort((a, b) => discountOf(b) - discountOf(a))
        .slice(0, 10),
    []
  );

  const countdown = useCountdown();
  const stageRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pausedRef = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || deals.length === 0) return;

    const step = CARD_W + GAP;
    const span = deals.length * step;   // طول یک دور کامل
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let offset = 0;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    /* وقتی سکشن بیرون از دید است، محاسبه‌ی هر فریم فقط باتری می‌سوزاند */
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { threshold: 0.05 }
    );
    io.observe(stage);

    const layout = () => {
      const half = stage.clientWidth / 2;

      slotsRef.current.forEach((el, i) => {
        if (!el) return;

        /* موقعیت روی حلقه، بعد به بازه‌ی [-span/2, span/2] برده می‌شود
           تا کارتی که از یک سر بیرون رفته از سر دیگر وارد شود. پرشی
           دیده نمی‌شود چون در آن نقطه شفافیتش صفر است. */
        let dx = i * step - offset;
        dx = ((dx % span) + span) % span;
        if (dx > span / 2) dx -= span;

        // فاصله تا مرکز، بر حسب «تعداد کارت»
        const d = Math.abs(dx) / step;

        /* قوس: مرکز بالاتر می‌ایستد و دو طرف پایین می‌روند. توان دو
           باعث می‌شود افت نزدیک مرکز ملایم و در حاشیه تند باشد —
           با رابطه‌ی خطی، قوس شبیه سطح شیب‌دار می‌شود نه کمان. */
        const lift = Math.min(d * d * 15, 86);

        // کارت مرکزی از بغل‌دستی‌هایش بزرگ‌تر
        const scale = Math.max(0.72, 1.15 - d * 0.155);

        // چرخش سه‌بعدی — همان حس کاورفلو
        const rotY = Math.max(-28, Math.min(28, -(dx / step) * 14));

        // محو شدن دو سر
        const opacity = Math.max(0, 1 - Math.max(0, d - 0.55) * 0.44);

        el.style.transform =
          `translate3d(${half + dx - CARD_W / 2}px, ${lift}px, 0) ` +
          `rotateY(${rotY}deg) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(100 - Math.round(d * 10));
        // کارت نیمه‌محو نباید کلیک را بدزدد
        el.style.pointerEvents = opacity < 0.3 ? 'none' : 'auto';
      });
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!pausedRef.current && visible && !document.hidden && !reduced) {
        offset += SPEED * dt;
        if (offset > span) offset -= span;
      }
      layout();
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', layout);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', layout);
    };
  }, [deals.length]);

  if (deals.length === 0) return null;

  return (
    <section className="dmq" aria-label="تخفیف‌های امروز">
      {/* سربرگ */}
      <header className="dmq__head">
        <span className="dmq__eyebrow">
          <Timer className="dmq__eyebrow-icon" />
          هر روز تازه می‌شود
        </span>
        <h2 className="dmq__title">تخفیف‌های امروز</h2>

        {/* عدد واقعی، نه وعده. نیمه‌شب که شد، قیمت‌ها برمی‌گردند. */}
        <div className="dmq__clock" role="timer" aria-live="off">
          <span className="dmq__clock-label">تا پایان تخفیف</span>
          <span className="dmq__clock-digits num-en" aria-hidden={!countdown}>
            {countdown ? (
              <>
                <b>{countdown.h}</b><i>:</i><b>{countdown.m}</b><i>:</i><b>{countdown.s}</b>
              </>
            ) : (
              <>
                <b>‏‏‎ ‎‏‏</b><i>:</i><b>‏‏‎ ‎‏‏</b><i>:</i><b>‏‏‎ ‎‏‏</b>
              </>
            )}
          </span>
        </div>
      </header>

      <div
        ref={stageRef}
        className="dmq__stage"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onFocusCapture={() => { pausedRef.current = true; }}
        onBlurCapture={() => { pausedRef.current = false; }}
      >
        {deals.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => { slotsRef.current[i] = el; }}
            className="dmq__slot"
            style={{ ['--deal-accent' as string]: p.media.accent }}
          >
            <span className="dmq__neon" aria-hidden="true" />
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
