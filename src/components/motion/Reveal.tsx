'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ---------------------------------------------------------------
   ریویل اسکرول

   عمداً IntersectionObserver است نه ScrollTrigger: این کامپوننت روی
   ده‌ها المان صفحه می‌نشیند و ساختن ده‌ها ScrollTrigger برای یک محو
   ساده، هزینه‌ی بی‌دلیلی روی هر فریم اسکرول می‌گذارد. IO در ترد
   جداگانه کار می‌کند و صفر هزینه‌ی فریم دارد.

   یک‌طرفه است: وقتی چیزی دیده شد، با اسکرول به عقب دوباره محو نمی‌شود.
   محوشدن دوباره‌ی محتوایی که کاربر همین حالا خوانده، آزاردهنده است.
--------------------------------------------------------------- */

type Direction = 'up' | 'right' | 'left' | 'scale' | 'none';

interface RevealProps {
  children: React.ReactNode;
  /** تأخیر بر حسب میلی‌ثانیه — برای استگر کردن چند المان کنار هم */
  delay?: number;
  direction?: Direction;
  /** چند درصد المان باید دیده شود تا فعال شود */
  threshold?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  threshold = 0.12,
  as: Tag = 'div',
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // زیر کاهش موشن، محتوا بلافاصله و بدون حرکت نمایش داده می‌شود
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return React.createElement(
    Tag,
    {
      ref,
      className: `reveal-on-scroll reveal--${direction} ${shown ? 'is-shown' : ''} ${className}`.trim(),
      style: { transitionDelay: `${delay}ms` } as React.CSSProperties,
    },
    children
  );
}

/**
 * استگر — بچه‌ها را یکی‌یکی با فاصله وارد می‌کند.
 * به‌جای اینکه هر کارت را دستی Reveal کنیم و delay بدهیم.
 */
export function RevealGroup({
  children,
  step = 70,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode;
  step?: number;
  direction?: Direction;
  className?: string;
}) {
  return (
    <>
      {React.Children.map(children, (child, i) => (
        <Reveal delay={i * step} direction={direction} className={className}>
          {child}
        </Reveal>
      ))}
    </>
  );
}
