'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { sound } from '../../lib/sound';

/**
 * تعویض شب و روز.
 *
 * حالت پیش‌فرض شب است — همان چیزی که هویت این فروشگاه رویش ساخته
 * شده. ولی انتخاب کاربر روی آن می‌نشیند و در حافظه می‌ماند.
 *
 * خودِ سوییچ عمداً ساده است: تمام جسارت طرح در حالت روشن خرج شده
 * (نئون‌هایی که به سایه‌ی رنگی تبدیل می‌شوند)، و یک کلید پرزرق‌وبرق
 * کنارش فقط سر و صدا اضافه می‌کرد.
 *
 * مقدار اولیه را اسکریپت درون‌خطیِ لایوت پیش از رنگ‌آمیزی صفحه
 * می‌نویسد؛ اینجا فقط همان را می‌خوانیم. برای همین تا mount نشدن،
 * چیزی رندر نمی‌شود — وگرنه HTMLِ سرور با حالت واقعی نمی‌خواند.
 */

type Theme = 'dark' | 'light';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme as Theme | undefined;
    setTheme(current === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    sound.click();
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem('phoenix.theme', next);
    } catch {
      /* حالت خصوصی — انتخاب فقط در همین نشست می‌ماند */
    }
  };

  // تا وقتی حالت واقعی معلوم نشده، جای دکمه را نگه می‌داریم
  if (theme === null) {
    return <span className="thm thm--ghost" aria-hidden="true" />;
  }

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggle}
      onMouseEnter={() => sound.hover()}
      className={`thm ${isLight ? 'is-light' : ''}`}
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? 'رفتن به حالت شب' : 'رفتن به حالت روز'}
      title={isLight ? 'حالت شب' : 'حالت روز'}
    >
      <span className="thm__track" aria-hidden="true">
        <Moon className="thm__icon thm__icon--moon" />
        <Sun className="thm__icon thm__icon--sun" />
        <span className="thm__knob" />
      </span>
    </button>
  );
}
