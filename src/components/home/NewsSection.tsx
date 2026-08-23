'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, BellRing, CalendarClock, Check, Send, Sparkles } from 'lucide-react';
import { sound } from '../../lib/sound';
import { asset } from '../../lib/asset';

/**
 * چی تو راهه — اخبار و عرضه‌های نزدیک.
 *
 * هدفش این است که کسی که امروز خرید نمی‌کند، دلیلی برای برگشتن داشته
 * باشد. زنگوله برای یادآوری عرضه، و کانال تلگرام برای کسی که ترجیح
 * می‌دهد خبر را همان‌جا بگیرد.
 *
 * هر خبر یک کاراکتر شفاف دارد که از بالای کارت بیرون می‌زند. ارتفاع
 * کارت دست‌نخورده می‌ماند: کاراکتر با موقعیت absolute بیرون از جریان
 * می‌نشیند، پس چیدمان را جابه‌جا نمی‌کند.
 */

const TELEGRAM = 'https://t.me/Ph0nixVpn_bot';

interface NewsItem {
  id: string;
  tag: 'عرضه' | 'ظرفیت' | 'اطلاعیه';
  title: string;
  note: string;
  when: string;
  /** آیا هنوز عرضه نشده — تعیین می‌کند زنگوله نمایش داده شود یا نه */
  upcoming: boolean;
  accent: string;
  /** کاراکتر شفاف که از کارت بیرون می‌زند */
  art: string;
  /** نشان‌واره‌ی پهن جای کاراکتر قدبلند بنشیند — اندازه‌اش فرق دارد */
  artKind?: 'character' | 'wordmark';
  href?: string;
}

const NEWS: NewsItem[] = [
  {
    id: 'bf6',
    tag: 'عرضه',
    title: 'Battlefield 6',
    note: 'ظرفیت‌ها باز شد. نقشه‌های بزرگ، شصت‌وچهار نفر، و ساختمان‌هایی که واقعاً فرو می‌ریزند.',
    when: 'همین حالا موجود',
    upcoming: false,
    accent: '#6ea8c7',
    art: '/hero/cutout/battlefield-soldier.webp',
    href: '/product/battlefield-6',
  },
  {
    id: 'gta6',
    tag: 'عرضه',
    title: 'Grand Theft Auto VI',
    note: 'هنوز خبری نیست، ولی وقتی ظرفیت باز شود چند ساعت بیشتر دوام نمی‌آورد. زنگوله را بزن تا اولین نفر باشی.',
    when: 'به‌زودی',
    upcoming: true,
    accent: '#d977b8',
    art: '/hero/cutout/gta-duo.webp',
  },
  {
    id: 'cod',
    tag: 'ظرفیت',
    title: 'Call of Duty: Modern Warfare',
    note: 'ظرفیت دو دوباره موجود شد. این یکی معمولاً همان هفته‌ی اول تمام می‌شود.',
    when: 'موجودی محدود',
    upcoming: false,
    accent: '#e8862e',
    art: '/hero/cutout/cod-soldier.webp',
    href: '/product/call-of-duty-modern-warfare',
  },
  {
    id: 'gemini',
    tag: 'اطلاعیه',
    title: 'پایان طرح رایگان Gemini',
    note: 'گوگل طرح هجده‌ماهه‌ی رایگان را بست. پلن‌های فعلی ما تا اتمام موجودی با همین قیمت می‌مانند.',
    when: 'خواندنش لازم است',
    upcoming: false,
    accent: '#4a7cf7',
    art: '/hero/cutout/gemini-wordmark.webp',
    artKind: 'wordmark',
    href: '/product/gemini-pro',
  },
];

export function NewsSection() {
  const [reminded, setReminded] = useState<Set<string>>(new Set());

  const toggleReminder = (id: string) => {
    sound.success();
    setReminded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      id="news"
      className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-100"
    >
      {/* سربرگ */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-4">
          <CalendarClock className="w-3.5 h-3.5" />
          <span>تقویم عرضه‌ها</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">چی تو راهه؟</h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
          ظرفیت بازی‌های بزرگ معمولاً روز اول تمام می‌شود. زنگوله را بزن تا لحظه‌ی
          باز شدن خبردار شوی — نه فردایش.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7">
        {/* ---------- فهرست اخبار ---------- */}
        {/* فاصله‌ی بیشتر از حد معمول: کاراکتر هر کارت روی هاور بزرگ
            می‌شود و با فاصله‌ی کم، تصویر کارت بغلی را قطع می‌کرد. */}
        <div className="mrail mrail--two-row flex flex-col gap-5">
          {NEWS.map((n) => {
            const isOn = reminded.has(n.id);
            return (
              <article
                key={n.id}
                className="news-card group"
                style={{ ['--news-accent' as string]: n.accent }}
              >
                {/* کاراکتر بیرون‌زده — بیرون از جریان، پس ارتفاع کارت ثابت می‌ماند */}
                <img
                  src={asset(n.art)}
                  alt=""
                  aria-hidden="true"
                  className={`news-card__art news-card__art--${n.artKind ?? 'character'}`}
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />

                <span className="news-card__tag">{n.tag}</span>

                <div className="news-card__body">
                  <h3 className="news-card__title">{n.title}</h3>
                  <p className="news-card__note">{n.note}</p>
                </div>

                <span className="news-card__when">{n.when}</span>

                {n.upcoming ? (
                  <button
                    type="button"
                    onClick={() => toggleReminder(n.id)}
                    onMouseEnter={() => sound.hover()}
                    aria-pressed={isOn}
                    className={`news-card__action ${isOn ? 'is-on' : ''}`}
                  >
                    {isOn ? (
                      <><Check className="w-3.5 h-3.5" /> یادآوری فعال شد</>
                    ) : (
                      <><Bell className="w-3.5 h-3.5" /> خبرم کن</>
                    )}
                  </button>
                ) : n.href ? (
                  <Link
                    href={n.href}
                    onClick={() => sound.click()}
                    className="news-card__action"
                  >
                    مشاهده
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>

        {/* ---------- کانال تلگرام ---------- */}
        <aside className="news-aside relative p-6 rounded-3xl bg-gradient-to-br from-sky-950/50 via-[#0d0718] to-[#08040f]
                          border border-sky-500/25 overflow-hidden flex flex-col">
          <span className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative">
            <span className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 grid place-items-center mb-4">
              <Send className="w-5 h-5 text-sky-400" />
            </span>

            <h3 className="text-base font-black text-white mb-2">
              خبرها اول اینجا می‌رسند
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-5">
              باز شدن ظرفیت‌ها، تخفیف‌های چندساعته و عرضه‌های جدید اول در کانال
              اعلام می‌شود. خرید هم مستقیم از خود ربات ممکن است.
            </p>

            <ul className="space-y-2 mb-6">
              {[
                'اطلاع فوری از باز شدن ظرفیت',
                'تخفیف‌هایی که فقط در کانال هست',
                'خرید مستقیم از ربات',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-[11px] text-zinc-300">
                  <Sparkles className="w-3 h-3 text-sky-400 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="btn-chrome mt-auto"
          >
            <span className="btn-chrome__shine" aria-hidden="true" />
            <BellRing className="btn-chrome__icon" />
            <span className="btn-chrome__label">دنبال کردن کانال تلگرام</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
