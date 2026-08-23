import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * اسکرول نرم سراسری.
 *
 * دو نکته‌ی حیاتی که اگر رعایت نشن، ScrollTrigger و Lenis همدیگه رو خراب می‌کنن:
 *  ۱. Lenis باید بعد از هر فریم به ScrollTrigger خبر بده (`ScrollTrigger.update`).
 *  ۲. حلقه‌ی Lenis باید روی ticker خود GSAP سوار بشه، نه rAF جدا — وگرنه
 *     دو حلقه‌ی مستقل داریم و انیمیشن‌ها یک فریم عقب‌تر از اسکرول می‌مونن.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // روی دستگاه‌هایی که کاربر کاهش موشن خواسته، اسکرول بومی دست‌نخورده می‌مونه
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // لمس دست‌نخورده می‌مونه: اسکرول بومی موبایل از هر تقلیدی بهتره
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
