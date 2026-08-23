'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../data/catalog';
import { ProductCard } from '../product/ProductCard';
import { sound } from '../../lib/sound';
import { SectionFilter, applyScope, type SectionScope } from './SectionFilter';

/**
 * ریل محصولات — یک ردیف که ورق می‌خورد.
 *
 * به‌جای شبکه‌ای که ده‌ها کارت را یک‌جا می‌ریزد، یک ردیف نشان می‌دهد و
 * بقیه با ورق زدن می‌آید. صفحه کوتاه‌تر می‌ماند و کاربر غرق نمی‌شود.
 *
 * پیمایش با scroll-snap بومی انجام می‌شود نه ترنسفورم دستی: روی موبایل
 * کشیدن با انگشت همان لحظه کار می‌کند و صفحه‌کلید و اسکرین‌ریدر هم
 * بدون کار اضافه درست رفتار می‌کنند.
 */

export function ProductRail({
  title,
  subtitle,
  badge,
  products,
  href,
  accent = '#e8862e',
  filterable = true,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  href?: string;
  accent?: string;
  /** بعضی ریل‌ها ذاتاً تک‌دسته‌اند و فیلتر برایشان بی‌معنی است */
  filterable?: boolean;
}) {
  const [scope, setScope] = useState<SectionScope>('all');

  /* شماره مجازی محصول کاتالوگ نیست، پس در این ریل‌ها گزینه نمی‌شود */
  const shown = filterable ? applyScope(products, scope) : products;
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [paused, setPaused] = useState(false);

  /* در RTL مقدار scrollLeft منفی است — همین باعث می‌شود منطق
     ساده‌ی «۰ یعنی ابتدا» اشتباه از آب دربیاید. با قدرمطلق کار می‌کنیم. */
  const syncEdges = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const pos = Math.abs(el.scrollLeft);
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(pos < 8);
    setAtEnd(pos > max - 8);
  }, []);

  useEffect(() => {
    syncEdges();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      el.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [syncEdges, shown.length]);

  /* ورق زدن مشترک بین دکمه‌ها و چرخش خودکار. صدا فقط وقتی پخش می‌شود
     که خود کاربر زده باشد — ریلی که هر ده ثانیه بوق بزند آزاردهنده است. */
  const shift = (dir: 1 | -1, quiet = false) => {
    const el = railRef.current;
    if (!el) return;
    if (!quiet) sound.click();
    /* در RTL محور اسکرول برعکس است: رفتن به جلو یعنی scrollLeft منفی‌تر.
       بدون این وارونگی، دکمه‌ی «بعدی» به صفر گیر می‌کرد و ریل اصلاً
       تکان نمی‌خورد. */
    const rtl = getComputedStyle(el).direction === 'rtl';
    // یک صفحه = عرض قاب منهای کمی، تا کارت بعدی نیمه‌دیده بماند
    const step = (el.clientWidth - 80) * dir * (rtl ? -1 : 1);
    el.scrollBy({ left: step, behavior: 'smooth' });
  };

  const page = (dir: 1 | -1) => shift(dir);

  /* ---------------------------------------------------------------
     چرخش خودکار.

     عمداً کند است: ده ثانیه روی هر صفحه. ریلی که تند ورق بخورد کاربر
     را وادار می‌کند دنبالش بدود، و درست همان لحظه‌ای که می‌خواهد روی
     کارتی کلیک کند از زیر دستش می‌رود.

     با هاور، فوکوس صفحه‌کلید، لمس، یا وقتی سکشن بیرون از دید است
     متوقف می‌شود — و زیر prefers-reduced-motion اصلاً شروع نمی‌کند.
  --------------------------------------------------------------- */
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = railRef.current;
    if (!el) return;

    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { threshold: 0.35 }
    );
    io.observe(el);

    const id = setInterval(() => {
      if (!visible || document.hidden) return;
      const pos = Math.abs(el.scrollLeft);
      const max = el.scrollWidth - el.clientWidth;
      // به انتها که رسید، آرام برمی‌گردد سر جای اول
      if (pos > max - 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        shift(1, true);
      }
    }, 10000);

    return () => { clearInterval(id); io.disconnect(); };
  }, [paused]); // eslint-disable-line react-hooks/exhaustive-deps

  if (products.length === 0) return null;

  return (
    <section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-100">
      {/* سربرگ */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
        <div className="text-center sm:text-right mx-auto sm:mx-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
            {badge && (
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black"
                style={{ background: `${accent}22`, color: accent }}
              >
                {badge}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
          </div>
          {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}

          {filterable && (
            <div className="mt-3">
              <SectionFilter value={scope} onChange={setScope} exclude={['numbers']} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          {href && (
            <Link
              href={href}
              onClick={() => sound.click()}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10
                         text-[11px] font-bold text-zinc-300 hover:text-amber-300 hover:border-amber-400/40 transition-all"
            >
              دیدن همه
              <ArrowLeft className="w-3 h-3" />
            </Link>
          )}

          {/* دکمه‌های ورق زدن — در RTL جهت‌ها معکوس‌اند */}
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={atStart}
            aria-label="قبلی"
            className="w-9 h-9 rounded-xl grid place-items-center bg-white/5 border border-white/10
                       text-zinc-300 hover:text-white hover:border-white/25 transition-all
                       disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={atEnd}
            aria-label="بعدی"
            className="w-9 h-9 rounded-xl grid place-items-center bg-white/5 border border-white/10
                       text-zinc-300 hover:text-white hover:border-white/25 transition-all
                       disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ریل */}
      <div
        ref={railRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onPointerDown={() => setPaused(true)}
        /* pt به کارت جا می‌دهد تا روی هاور بالا بیاید بدون اینکه لبه‌ی
           بالای ریل ببُردش — بدون آن، بالای کارت زیر تیتر گم می‌شد. */
        className="flex gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-smooth pt-3 pb-4
                   [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        {shown.length === 0 && (
          <p className="secfil-empty w-full">
            در این دسته الان چیزی نداریم.
          </p>
        )}

        {shown.map((p) => (
          <div
            key={p.id}
            className="snap-start shrink-0 w-[248px] sm:w-[270px]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
