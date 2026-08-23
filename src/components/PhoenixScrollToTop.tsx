'use client';

import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../lib/sound';
import { asset } from '../lib/asset';

/** مدت صعود — برابر با طول انیمیشن phoenixFlightUp در استایل اصلی */
const FLIGHT_MS = 900;
const SHOW_AFTER = 420;

/**
 * ققنوس بازگشت به بالا.
 *
 * بدون دایره و بدون قاب — فقط خود لوگو، همان‌طور که در نسخه‌ی اصلی بود.
 * صعود از کلاس `animate-phoenix-flight-up` استایل اصلی استفاده می‌کند:
 * مسیر کاملاً عمودی، بزرگ‌شونده تا ۱٫۸ برابر، با درخششی که در اوج
 * به سفید می‌رسد.
 */
export const PhoenixScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [flying, setFlying] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const launch = () => {
    if (flying) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    sound.phoenix();
    setFlying(true);

    /* اسکرول را خودمان با همان منحنی صعود جلو می‌بریم؛
       scrollTo({behavior:'smooth'}) زمان‌بندی مستقل دارد و هماهنگ نمی‌ماند. */
    const startY = window.scrollY;
    const t0 = performance.now();
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / FLIGHT_MS);
      window.scrollTo(0, startY * (1 - ease(t)));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else setFlying(false);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <>
      {/* ققنوسِ در حال صعود — روی کل صفحه */}
      {flying && (
        <div
          className="fixed inset-0 z-[600] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* دنباله‌ی موشک — دقیقاً زیر مرکز ققنوس */}
          <span
            className="phx-rocket-trail absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-[3px] h-[150vh] origin-bottom rounded-full blur-[2px]"
            style={{
              marginInlineStart: '2.6rem',
              /* هم‌رنگ گرادیانت کنش اصلی: کهربایی در پای شعله، سرخابی
                 در میانه، بنفش در انتها که محو می‌شود */
              background:
                'linear-gradient(to top, rgba(245,158,11,0) 0%, rgba(245,158,11,0.9) 8%, rgba(217,70,239,0.55) 45%, rgba(168,85,247,0) 100%)',
            }}
          />
          <img
            src={asset('/brand/phoenix-logo.png')}
            alt=""
            draggable={false}
            className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-20 h-20 sm:w-24 sm:h-24 object-contain animate-phoenix-flight-up"
          />
        </div>
      )}

      <button
        type="button"
        onClick={launch}
        onMouseEnter={() => sound.hover()}
        aria-label="بازگشت به بالای صفحه"
        className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[100] p-0 border-0 bg-transparent cursor-pointer transition-all duration-300 ease-out ${
          visible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-5 pointer-events-none'
        } ${flying ? 'opacity-0' : ''}`}
      >
        <img
          src={asset('/brand/phoenix-logo.png')}
          alt=""
          draggable={false}
          className="phx-idle w-20 h-20 sm:w-24 sm:h-24 object-contain select-none drop-shadow-[0_0_18px_rgba(255,65,108,0.65)] transition-transform duration-300 hover:scale-110"
        />
      </button>
    </>
  );
};
