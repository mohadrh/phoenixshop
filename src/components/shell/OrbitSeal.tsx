'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { sound } from '../../lib/sound';

/**
 * مُهر چرخان — متن دور یک دایره که آرام می‌گردد.
 *
 * سه تصمیم که شکل این کامپوننت را تعیین کرده‌اند:
 *
 * ۱. حروف تک‌تک چیده می‌شوند، نه با <textPath>.
 *    راه متعارف این کار textPath است و اول همان را نوشتم، ولی در
 *    موتور رندرِ این محیط اصلاً چیده نمی‌شد — هر ۳۸ حرف روی مبدأِ
 *    svg جمع می‌شدند و حلقه خالی می‌ماند. یک نمونه‌ی مینیمالِ
 *    دست‌نویس هم همین رفتار را داشت، پس مشکل از مارک‌آپ نبود.
 *    چرخاندن هر حرف حول مرکز همان نتیجه را می‌دهد و همه‌جا کار
 *    می‌کند، چون فقط به transform تکیه دارد.
 *
 * ۲. متن عمداً لاتین است. گلیف‌های چسبانِ فارسی وقتی حرف‌به‌حرف جدا
 *    و چرخانده شوند از هم می‌پاشند — «شاپ» می‌شود چهار حرفِ بی‌ربط.
 *    همان وردمارک لاتینی که نوبار و فوتر دارند اینجا هم استفاده
 *    می‌شود.
 *
 * ۳. پیکان مرکزی خلافِ حلقه می‌چرخد تا همیشه رو به بالا بماند؛
 *    وگرنه حس می‌شود روی یک صفحه‌ی چرخان چسبانده شده.
 *
 * چون تزئینی است، کل SVG از دسترس صفحه‌خوان خارج شده و فقط لینک
 * برچسب واقعی دارد.
 */

/* فاصله‌ی انتهایی عمدی است: بدون آن، آخرین ★ به اولین ★ می‌چسبد. */
const SEAL_TEXT = '★ PHOENIX SHOP ★ GAMING & AI ★ 24/7 ';

/* در واحدهای viewBox (۲۰۰×۲۰۰) */
const RADIUS = 76;
const CENTER = 100;

export function OrbitSeal() {
  const chars = [...SEAL_TEXT];
  const stepDeg = 360 / chars.length;

  return (
    <Link
      href="/shop"
      className="oseal"
      aria-label="رفتن به فروشگاه"
      onMouseEnter={() => sound.hover()}
      onClick={() => sound.click()}
    >
      <svg className="oseal__ring" viewBox="0 0 200 200" aria-hidden="true">
        {chars.map((ch, i) => (
          <text
            key={i}
            className="oseal__char"
            x={CENTER}
            y={CENTER - RADIUS}
            /* هر حرف دور مرکز می‌چرخد تا سر جای خودش روی دایره
               بنشیند. چون خودِ حرف هم با همان زاویه می‌چرخد،
               پایه‌اش رو به مرکز می‌ماند و متن روی منحنی خوانده
               می‌شود. */
            transform={`rotate(${i * stepDeg} ${CENTER} ${CENTER})`}
          >
            {ch}
          </text>
        ))}
      </svg>

      <span className="oseal__core" aria-hidden="true">
        <ArrowUpLeft className="oseal__arrow" />
      </span>
    </Link>
  );
}
