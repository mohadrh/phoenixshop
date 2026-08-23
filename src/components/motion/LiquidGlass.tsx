'use client';

import { useEffect } from 'react';

/**
 * شیشه‌ی مایع — انکسار نور روی کارت‌ها.
 *
 * دو چیز را دنبال می‌کند و به‌صورت متغیر CSS روی کارت می‌نویسد:
 * موقعیت نشانگر (برای لکه‌ی نور) و انحراف آن از مرکز (برای کج شدن
 * سه‌بعدی). خودِ ظاهر تماماً در CSS ساخته می‌شود؛ اینجا فقط عدد
 * می‌آید.
 *
 * سه تصمیم که شکل این فایل را تعیین کرده‌اند:
 *
 * ۱. یک شنونده روی document، نه یکی به‌ازای هر کارت. کارت‌ها در
 *    ده کامپوننت مختلف رندر می‌شوند و بعضی‌شان (چرخ‌فلک تخفیف‌ها)
 *    مدام ساخته و خراب می‌شوند. واگذاری از ریشه یعنی هیچ‌کدام لازم
 *    نیست چیزی درباره‌ی این افکت بدانند.
 *
 * ۲. نوشتن در rAF بسته‌بندی می‌شود. pointermove ده‌ها بار در ثانیه
 *    شلیک می‌کند و هر نوشتنِ متغیرِ CSS یک بازچینش سبک است؛ بدون
 *    بسته‌بندی، اسکرول روی موبایل تکان می‌خورد.
 *
 * ۳. متغیرها با پیشوند --lg- نوشته می‌شوند و CSS فقط زیر
 *    [data-theme='light'] از آن‌ها استفاده می‌کند. در حالت شب همان
 *    عددها نوشته می‌شوند ولی هیچ قانونی نمی‌خواندشان، پس ظاهر شب
 *    دست‌نخورده می‌ماند — و لازم نیست این کامپوننت اصلاً از تم خبر
 *    داشته باشد.
 */

const MAX_TILT = 6; // درجه — بیشتر از این، کارت شبیه اسباب‌بازی می‌شود

export function LiquidGlass() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frame = 0;
    let pending: { card: HTMLElement; px: number; py: number } | null = null;
    let current: HTMLElement | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { card, px, py } = pending;
      pending = null;

      card.style.setProperty('--lg-mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--lg-my', `${(py * 100).toFixed(1)}%`);
      card.style.setProperty('--lg-gloss', '1');

      if (!reduced) {
        /* محورها عمداً جابه‌جا و یکی منفی است: حرکت افقی نشانگر باید
           کارت را حول محور عمودی بچرخاند، نه افقی. */
        card.style.setProperty('--lg-rx', `${((px - 0.5) * MAX_TILT * 2).toFixed(2)}deg`);
        card.style.setProperty('--lg-ry', `${(-(py - 0.5) * MAX_TILT * 2).toFixed(2)}deg`);
      }
    };

    const reset = (card: HTMLElement) => {
      card.style.setProperty('--lg-gloss', '0');
      card.style.setProperty('--lg-rx', '0deg');
      card.style.setProperty('--lg-ry', '0deg');
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>('.glow-hover') ?? null;

      /* از کارت قبلی که خارج شدیم، باید به حالت اولش برگردد — وگرنه
         کجیِ آخرین لحظه روی کارت می‌ماند. */
      if (current && current !== card) reset(current);
      current = card;
      if (!card) return;

      const r = card.getBoundingClientRect();
      if (!r.width || !r.height) return;

      pending = {
        card,
        px: (e.clientX - r.left) / r.width,
        py: (e.clientY - r.top) / r.height,
      };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    /* لمس با انگشت نباید کارت را کج نگه دارد: انگشت که برداشته شد،
       هیچ pointermove دیگری نمی‌آید تا وضعیت را پاک کند. */
    const onLeave = () => {
      if (current) reset(current);
      current = null;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerup', onLeave, { passive: true });
    document.addEventListener('pointercancel', onLeave, { passive: true });
    window.addEventListener('blur', onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onLeave);
      document.removeEventListener('pointercancel', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return null;
}
