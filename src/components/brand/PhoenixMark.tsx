import React, { useId } from 'react';

/**
 * نشان ققنوس — SVG درون‌خطی، نه تصویر.
 *
 * دلیلش: بال‌ها باید مستقل از بدن انیمیت شوند و گرادیانت باید با توکن‌های
 * برند هماهنگ بماند. با PNG هیچ‌کدام ممکن نیست.
 *
 * هر نمونه شناسه‌ی گرادیانت خودش را لازم دارد؛ چند ققنوس روی یک صفحه
 * (نوبار + دکمه‌ی بازگشت + فوتر) وگرنه شناسه‌ی تکراری می‌سازند و مرورگر
 * همه را به اولی وصل می‌کند.
 *
 * شناسه از useId می‌آید نه از شمارنده‌ی ماژول: شمارنده روی سرور بین
 * درخواست‌ها ادامه پیدا می‌کند ولی روی کلاینت از صفر شروع می‌شود، و
 * همین اختلاف باعث hydration mismatch می‌شد. دو نقطه‌ی خروجی useId
 * هم حذف می‌شود چون در url(#…) معتبر نیست.
 */
export const PhoenixMark: React.FC<{ className?: string; animated?: boolean }> = ({
  className,
  animated = true,
}) => {
  const id = `phxGrad${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg
      className={className}
      viewBox="0 0 300 252"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="8%" y1="10%" x2="92%" y2="90%">
          <stop offset="0%" stopColor="#f5a623" />
          <stop offset="28%" stopColor="#ef5f3c" />
          <stop offset="58%" stopColor="#e0257f" />
          <stop offset="82%" stopColor="#c02fb8" />
          <stop offset="100%" stopColor="#8b3fd4" />
        </linearGradient>
      </defs>

      <g
        stroke={`url(#${id})`}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <g className={animated ? 'phx-wing phx-wing--left' : undefined}>
          <path d="M138 96C118 62 88 36 46 26c14 34 34 60 62 78" />
          <path d="M136 116C112 92 82 76 44 68c18 30 44 50 78 60" />
          <path d="M134 136C110 124 78 118 44 118c22 22 52 34 84 36" />
        </g>
        <g className={animated ? 'phx-wing phx-wing--right' : undefined}>
          <path d="M166 96c20-34 50-60 92-70-14 34-34 60-62 78" />
          <path d="M168 116c24-24 54-40 92-48-18 30-44 50-78 60" />
          <path d="M170 136c24-12 56-18 90-18-22 22-52 34-84 36" />
        </g>
        <path d="M152 62c-8 6-12 14-10 22 3 10 12 14 22 12" />
        <path d="M164 96c-4 22-2 44 6 64 6 16 4 30-8 42" />
        <path d="M150 108c-6 26-4 50 4 72 6 16 2 30-12 40" />
        <path d="M162 226c-14-6-24-18-28-32" />
      </g>
    </svg>
  );
};
