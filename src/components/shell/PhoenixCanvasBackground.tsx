'use client';

import React, { useEffect, useRef } from 'react';

/* ============================================================
   پس‌زمینه‌ی زنده‌ی فونیکس

   یک صورت‌فلکی از ذرات که شکل ققنوس را می‌سازد، با اسکرول چهار فاز
   را طی می‌کند و با موس واکنش نشان می‌دهد:

     ۰٫۰۰ – ۰٫۲۲   اوج‌گیری — بال‌ها آرام می‌زنند
     ۰٫۲۲ – ۰٫۶۵   اشتعال — ذرات مثل جرقه بیرون می‌پاشند، اخگر بالا می‌آید
     ۰٫۵۸ – ۰٫۸۲   بازآرایی — ذرات دوباره جمع می‌شوند
     ۰٫۸۲ – ۱٫۰۰   صعود — کل صورت‌فلکی از بالای قاب بیرون می‌رود

   Canvas 2D است نه WebGL: برای این تعداد ذره سریع‌تر است، روی هر
   دستگاهی کار می‌کند، و زمینه‌ی گرافیکی اشغال نمی‌کند تا صحنه‌ی
   سه‌بعدی Su-57 بتواند از آن استفاده کند.
   ============================================================ */

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  size: number;
  /* اندیس در پالت، نه خود رنگ — تا با تعویض شب و روز رنگ عوض شود
     بدون اینکه ذرات از نو ساخته شوند. */
  colorIndex: number;
  alpha: number;
  phase: number;
  speed: number;
  /** بردار پاشش در فاز اشتعال */
  burstX: number;
  burstY: number;
  /** مختصات نهایی بعد از پیچش — برای هم‌راستا ماندن خطوط انرژی */
  drawY?: number;
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

/** پالت از روی گرادیانت لوگو */
const PALETTE = ['#f5a623', '#ef5f3c', '#e0257f', '#c02fb8', '#8b3fd4', '#6366f1'];

/* همان شش رنگ، ولی برای کاغذ: روشنایی پایین‌تر و اشباع بالاتر.
   رنگ روشن روی سفید ناپدید می‌شود — رنگ باید تیره‌تر از زمینه باشد
   تا دیده شود، نه روشن‌تر. ترتیب یکی است، پس هر ذره در هر دو حالت
   خانواده‌ی رنگی خودش را نگه می‌دارد. */
const PALETTE_LIGHT = ['#b45309', '#c2410c', '#be185d', '#a21caf', '#6d28d9', '#4338ca'];
const EMBER_COLORS = ['#ff6a1a', '#ff2d6f'];

export function PhoenixCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let embers: Ember[] = [];
    let frame = 0;

    /* ---------- ساخت شکل ققنوس ---------- */
    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // تعداد ذره با عرض صفحه مقیاس می‌گیرد — روی موبایل کمتر
      const count = Math.max(90, Math.min(230, Math.floor(width / 7)));
      const cx = width * 0.5;
      const cy = height * 0.45;
      const scale = Math.min(width, height) * 0.38;

      particles = Array.from({ length: count }, (_, i) => {
        const t = (i / count) * Math.PI * 2;
        const side = i % 2 === 0 ? 1 : -1;

        // فرمول پارامتری بال و بدنه
        const span = Math.sin(t * 1.5) * scale;
        const lift =
          -Math.cos(t) * (scale * 0.65) - Math.abs(Math.sin(t * 2)) * (scale * 0.25);

        const px = cx + side * (Math.abs(span) + Math.random() * 20);
        const py = cy + lift + (Math.random() - 0.5) * 25;

        const angle = Math.atan2(py - cy, px - cx);

        return {
          originX: px,
          originY: py,
          x: px,
          y: py,
          size: Math.random() * 2.4 + 1.1,
          colorIndex: i % PALETTE.length,
          alpha: Math.random() * 0.55 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.01,
          burstX: Math.cos(angle) * (60 + Math.random() * 120),
          burstY: Math.sin(angle) * (60 + Math.random() * 120),
        };
      });

      embers = Array.from({ length: reduce ? 0 : 70 }, () => spawnEmber(true));
    };

    const spawnEmber = (scatter = false): Ember => ({
      x: Math.random() * width,
      y: scatter ? Math.random() * height : height + 20,
      vx: (Math.random() - 0.5) * 1.4,
      vy: -(Math.random() * 2.2 + 1.2),
      size: Math.random() * 2.6 + 0.9,
      color: EMBER_COLORS[Math.random() > 0.4 ? 0 : 1],
      life: 0,
      maxLife: 140 + Math.random() * 90,
    });

    build();

    /* ---------- حلقه‌ی رندر ---------- */
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const scroll = scrollRef.current;
      const mouse = mouseRef.current;
      const light = document.documentElement.dataset.theme === 'light';

      // شدت آتش — سینوسی بین ۰٫۲۲ و ۰٫۶۵ اسکرول
      const fire = Math.max(
        0,
        Math.sin(Math.PI * Math.min(1, Math.max(0, (scroll - 0.22) / 0.43)))
      );
      const reassembling = scroll >= 0.58 && scroll < 0.82;
      const reassembly = reassembling ? Math.sin(Math.PI * ((scroll - 0.58) / 0.24)) : 0;
      /* رانش اسکرول: ذرات با اسکرول جابه‌جا می‌شوند ولی از صفحه بیرون
         نمی‌روند — با پیچش عمودی از بالا دوباره از پایین وارد می‌شوند.
         قبلاً ascent یک‌طرفه بود و ته صفحه هیچ ذره‌ای نمی‌ماند. */
      const drift = scroll * height * 1.6;
      /* حرکت مستقل از اسکرول، تا وقتی کاربر ثابت ایستاده هم صحنه زنده بماند */
      const idle = frame * 0.22;

      /* ۱. هاله‌ی محیطی */
      const gx = width * 0.5;
      const gy = height * 0.45 - (drift % height) * 0.25;
      const grad = ctx.createRadialGradient(gx, gy, 40, gx, gy, Math.max(width, height) * 0.65);

      if (fire > 0.1) {
        grad.addColorStop(0, `rgba(255, 60, 20, ${0.13 * fire})`);
        grad.addColorStop(0.4, `rgba(220, 20, 80, ${0.09 * fire})`);
        grad.addColorStop(1, 'rgba(8, 6, 13, 0)');
      } else {
        grad.addColorStop(0, 'rgba(255, 120, 40, 0.075)');
        grad.addColorStop(0.35, 'rgba(180, 30, 140, 0.055)');
        grad.addColorStop(0.7, 'rgba(100, 30, 200, 0.035)');
        grad.addColorStop(1, 'rgba(8, 6, 13, 0)');
      }
      ctx.globalAlpha = light ? 0.35 : 1;
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      /* ۲. خطوط انرژی بین ذرات نزدیک */
      const flap = Math.sin(frame * 0.035) * (18 + fire * 24);

      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i += 3) {
        const a = particles[i];
        for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
          const b = particles[j];
          const ay = a.drawY ?? a.y;
          const by = b.drawY ?? b.y;
          const d = Math.hypot(a.x - b.x, ay - by);
          if (d < 75) {
            const linkA = (1 - d / 75) * (1 - fire * 0.55);
            ctx.strokeStyle = light
              ? `rgba(120, 60, 160, ${linkA * 0.30})`
              : `rgba(255, 120, 180, ${linkA * 0.24})`;
            ctx.beginPath();
            ctx.moveTo(a.x, ay);
            ctx.lineTo(b.x, by);
            ctx.stroke();
          }
        }
      }

      /* ۳. ذرات ققنوس */
      // انحراف موس — ذرات کمی از مکان‌نما فرار می‌کنند
      const mx = (mouse.x - 0.5) * 44;
      const my = (mouse.y - 0.5) * 30;

      /* lighter رنگ‌ها را روی هم جمع می‌کند و فقط روی زمینه‌ی تیره
         معنی دارد — روی کاغذ سفید، هر رنگ روشنی سفید می‌شود و ذره
         ناپدید. در حالت روشن به ترکیب معمولی برمی‌گردیم و در عوض
         رنگ‌ها را تیره‌تر می‌کنیم. */
      ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';

      particles.forEach((p, i) => {
        p.phase += p.speed;

        const flapDir = i % 2 === 0 ? 1 : -1;
        const targetX = p.originX + Math.sin(p.phase * 0.7) * 15 - mx + p.burstX * fire;
        const targetY =
          p.originY + flapDir * Math.sin(p.phase) * flap - my + p.burstY * fire
          + (reassembling ? Math.sin(frame * 0.05 + i) * 26 * reassembly : 0);

        // میان‌یابی نرم — ذره هرگز نمی‌پرد
        p.x += (targetX - p.x) * 0.06;
        p.y += (targetY - p.y) * 0.06;

        /* پیچش: هرچه از بالای قاب بیرون رفت از پایین برمی‌گردد. حاشیه‌ی
           ۱۲۰ پیکسلی می‌گذاریم تا ذره وسط قاب ناگهان ظاهر نشود. */
        const span = height + 240;
        let drawY = (p.y - drift - idle + 120) % span;
        if (drawY < 0) drawY += span;
        drawY -= 120;

        const size = p.size * (1 + fire * 0.7);

        // محو شدن نرم فقط در دو لبه، نه در انتهای صفحه
        const edge = Math.min(1, Math.min(drawY + 120, height + 120 - drawY) / 110);
        const alpha = p.alpha * Math.max(0, edge);
        if (alpha <= 0.01) return;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = (light ? PALETTE_LIGHT : PALETTE)[p.colorIndex];
        ctx.beginPath();
        ctx.arc(p.x, drawY, size, 0, Math.PI * 2);
        ctx.fill();

        // مختصات رسم‌شده را نگه می‌داریم تا خطوط انرژی با آن هم‌راستا بمانند
        p.drawY = drawY;
      });

      /* ۴. اخگرها — فقط در فاز آتش دیده می‌شوند */
      if (fire > 0.05) {
        embers.forEach((e, idx) => {
          e.life++;
          e.x += e.vx;
          e.y += e.vy;
          e.vy -= 0.006; // شتاب رو به بالا، مثل هوای گرم

          /* اخگر مرده را همین‌جا جایگزین می‌کنیم و از رسمش می‌گذریم.
             قبلاً بعد از جایگزینی همچنان با همان مرجع قدیمی رسم می‌شد و
             چون عمرش گذشته بود t منفی می‌شد — یعنی شعاع منفی و خطای
             IndexSizeError در arc. */
          if (e.life > e.maxLife || e.y < -30) {
            embers[idx] = spawnEmber();
            return;
          }

          const t = 1 - e.life / e.maxLife;
          ctx.globalAlpha = t * 0.8 * fire;
          ctx.fillStyle = e.color;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size * t, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      rafRef.current = requestAnimationFrame(render);
    };

    /* ---------- رویدادها ---------- */
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / (window.innerWidth || 1),
        y: e.clientY / (window.innerHeight || 1),
      };
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', build);
    if (!reduce) window.addEventListener('mousemove', onMouse, { passive: true });

    // زیر کاهش موشن یک فریم ثابت کشیده می‌شود، نه حلقه
    if (reduce) render();
    else rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', build);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="phx-bg" aria-hidden="true" />;
}
