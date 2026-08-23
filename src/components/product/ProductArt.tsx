'use client';

import React from 'react';
import { asset } from '../../lib/asset';

/**
 * تصویر محصول، با جای‌گزین برندشده.
 *
 * برای محصولاتی که هنوز آرت‌ورک واقعی ندارند، به‌جای تصویر شکسته یک
 * پنل برندشده رندر می‌شود: زمینه‌ی مشکی، هاله‌ی رنگ برند و نام لاتین —
 * همان زبان بصری کارت‌های محصول ققنوس. وقتی تصویر واقعی رسید، فقط
 * `media.cover` پر می‌شود و این کامپوننت خودش کنار می‌رود.
 */
export function ProductArt({
  src,
  accent,
  brand,
  title,
  className = '',
  layer = 'backdrop',
}: {
  src?: string;
  accent: string;
  brand: string;
  title: string;
  className?: string;
  /** backdrop = لایه‌ی پس‌زمینه‌ی محو · cutout = لایه‌ی جلو و واضح */
  layer?: 'backdrop' | 'cutout';
}) {
  const [failed, setFailed] = React.useState(false);
  const hasArt = Boolean(src) && !failed;

  if (hasArt) {
    return (
      <img
        src={asset(src)}
        alt={layer === 'cutout' ? '' : title}
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  /* لایه‌ی پس‌زمینه: فقط هاله‌ی رنگ برند */
  if (layer === 'backdrop') {
    return (
      <div
        className={className}
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 42%, ${accent}55 0%, ${accent}18 45%, transparent 78%)`,
        }}
      />
    );
  }

  /* لایه‌ی جلو: نام برند در قابی با درخشش رنگ خودش */
  return (
    <div className="relative flex items-center justify-center w-full h-full" aria-hidden="true">
      <div
        className="relative flex flex-col items-center justify-center gap-1 px-6 py-5 rounded-2xl border backdrop-blur-sm"
        style={{
          borderColor: `${accent}66`,
          /* از توکن می‌خواند نه رنگ ثابت — استایل درون‌خطی را CSS
             نمی‌تواند بازنویسی کند و این پنل در حالت روشن تیره
             می‌ماند. */
          background: 'var(--art-panel-bg)',
          boxShadow: `0 0 34px -6px ${accent}88, inset 0 0 22px -10px ${accent}`,
        }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: `${accent}` }}
        >
          {brand}
        </span>
        <span className="text-white font-extrabold text-lg leading-tight">{title}</span>
      </div>
    </div>
  );
}
