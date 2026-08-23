'use client';

import React from 'react';
import { sound } from '../../lib/sound';

/**
 * ناوبری هیرو — خوشه‌ی دکمه‌های دسته، شیشه‌ای.
 *
 * چیدمان واقعی دسته حفظ شده: مثلث بالا، دایره راست، ضربدر پایین،
 * مربع چپ. هر دکمه یک کار ناوبری انجام می‌دهد، نه صرفاً تزئین:
 *
 *   △  اسلاید اول
 *   ○  اسلاید بعدی      (در RTL سمت راست = جلو رفتن)
 *   ✕  توقف / ادامه‌ی چرخش خودکار
 *   □  اسلاید قبلی
 *
 * شمارنده و نام اسلاید حذف شدند: کاربر اسلاید نمی‌شمارد و نام همان
 * چیزی است که تیتر هیرو درشت‌تر می‌گوید. خودِ چهار شکل کافی‌اند.
 *
 * هیچ بدنه‌ای در کار نیست — نه قرص، نه دایره، نه پس‌زمینه. فقط خودِ
 * چهار شکل، شیشه‌ای و نئونی، شناور در فضا. هر پس‌زمینه‌ای اینجا با
 * تصویر هیرو رقابت می‌کرد؛ شکلِ تنها این مشکل را ندارد و در عین حال
 * بلافاصله «دسته‌ی بازی» خوانده می‌شود.
 *
 * استایلش در controller.css است چون درخشش چندلایه و انکسار شیشه با
 * کلاس‌های ابزاری قابل نوشتن نیست.
 */

type Action = 'first' | 'next' | 'toggle' | 'prev';
type Shape = 'triangle' | 'circle' | 'cross' | 'square';

const BUTTONS: {
  action: Action;
  shape: Shape;
  label: string;
  color: string;
  /** موقعیت روی خوشه — درصدی، مثل خود دسته */
  style: React.CSSProperties;
}[] = [
  { action: 'first',  shape: 'triangle', label: 'اسلاید اول', color: '#40e2a0', style: { top: '17%', left: '50%' } },
  { action: 'next',   shape: 'circle',   label: 'بعدی',       color: '#ff6666', style: { top: '50%', left: '83%' } },
  { action: 'toggle', shape: 'cross',    label: 'توقف',       color: '#7cb2e8', style: { top: '83%', left: '50%' } },
  { action: 'prev',   shape: 'square',   label: 'قبلی',       color: '#ff69f8', style: { top: '50%', left: '17%' } },
];

/* SVG فقط خط نئون و یک پرکردن بسیار کم‌رنگ است. جنس شیشه از یک لایه‌ی
   جدا با clip-path و backdrop-filter می‌آید، نه از خود SVG — چون
   backdrop-filter روی مسیر SVG کار نمی‌کند و بدون شکستِ پس‌زمینه،
   «شفاف» با «شیشه‌ای» فرق نمی‌کند. */
function Glyph({ shape }: { shape: Shape }) {
  const common = {
    fill: 'currentColor',
    fillOpacity: 0.07,
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  };

  if (shape === 'cross') {
    return (
      <svg viewBox="0 0 26 26" aria-hidden="true" className="ctrl__svg">
        <path d="M6 6l14 14M20 6L6 20" stroke="currentColor" strokeWidth="3"
              strokeLinecap="round" fill="none" />
      </svg>
    );
  }
  if (shape === 'triangle') {
    return (
      <svg viewBox="0 0 26 26" aria-hidden="true" className="ctrl__svg">
        <path d="M13 4.5l9.2 16.4H3.8L13 4.5z" {...common} />
      </svg>
    );
  }
  if (shape === 'circle') {
    return (
      <svg viewBox="0 0 26 26" aria-hidden="true" className="ctrl__svg">
        <circle cx="13" cy="13" r="8.6" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 26 26" aria-hidden="true" className="ctrl__svg">
      <rect x="4.6" y="4.6" width="16.8" height="16.8" rx="2.6" {...common} />
    </svg>
  );
}

export function ControllerNav({
  active,
  paused,
  onSelect,
  onTogglePause,
}: {
  active: number;
  paused: boolean;
  onSelect: (i: number) => void;
  onTogglePause: () => void;
}) {
  const [pressed, setPressed] = React.useState<Action | null>(null);

  const run = (action: Action) => {
    sound.click();
    if (action === 'first') onSelect(0);
    if (action === 'next') onSelect(active + 1);
    if (action === 'prev') onSelect(active - 1);
    if (action === 'toggle') onTogglePause();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="ctrl"
      >
        {BUTTONS.map((b) => {
          const isToggle = b.action === 'toggle';
          return (
            <div key={b.action} className="ctrl__slot" style={b.style}>
              <button
                type="button"
                onClick={() => run(b.action)}
                onMouseEnter={() => sound.hover()}
                onPointerDown={() => setPressed(b.action)}
                onPointerUp={() => setPressed(null)}
                onPointerLeave={() => setPressed(null)}
                aria-label={isToggle ? (paused ? 'ادامه‌ی چرخش' : 'توقف چرخش') : b.label}
                className={`ctrl__btn ${pressed === b.action ? 'is-down' : ''}`}
                style={{ ['--btn-color' as string]: b.color }}
              >
                <span className="ctrl__glyph">
                  {/* بدنه‌ی شیشه — پشت خط نئون می‌نشیند و آنچه را پشت
                      سرش هست می‌شکند. با clip-path به شکل خود دکمه
                      بریده می‌شود تا backdrop-filter فقط داخل شکل
                      اعمال شود. */}
                  <span className={`ctrl__glass ctrl__glass--${b.shape}`} aria-hidden="true" />
                  <Glyph shape={b.shape} />
                </span>
                <span className="ctrl__tip">
                  {isToggle ? (paused ? 'ادامه' : 'توقف') : b.label}
                </span>
              </button>
            </div>
          );
        })}

      </div>
    </div>
  );
}
