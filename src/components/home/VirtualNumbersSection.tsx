'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarClock, Infinity as InfinityIcon, Phone, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  NUMBER_KINDS, NUMBER_SERVICES, cheapestFor, type NumberKind,
} from '../../data/numbers';
import { sound } from '../../lib/sound';

/**
 * شماره‌ی مجازی — خلاصه‌ی صفحه‌ی اصلی.
 *
 * این سکشن کل فهرست را نشان نمی‌دهد. سه نوع شماره را معرفی می‌کند و
 * چند سرویس پرتقاضا را با ارزان‌ترین قیمتشان — بقیه در صفحه‌ی خودش.
 *
 * نوع شماره محور اصلی است نه سرویس، چون تفاوت یک‌بارمصرف و دائمی
 * تفاوت قیمت نیست، تفاوت کاربرد است: یکی برای ثبت‌نام امروز خوب است
 * و آن یکی برای حسابی که سال بعد هم می‌خواهی بازیابی‌اش کنی.
 */

const ICONS: Record<NumberKind, LucideIcon> = {
  once: Zap,
  rental: CalendarClock,
  permanent: InfinityIcon,
};

const fmt = (n: number) => n.toLocaleString('fa-IR');

export function VirtualNumbersSection() {
  const [kind, setKind] = useState<NumberKind>('once');
  const active = NUMBER_KINDS.find((k) => k.id === kind)!;
  const popular = NUMBER_SERVICES.filter((s) => s.popular);

  return (
    <section
      id="numbers"
      className="vnum relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-100"
    >
      {/* سربرگ */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-bold mb-4">
          <Phone className="w-3.5 h-3.5" />
          <span>شماره مجازی</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
          شماره‌ی واقعی از هر کشوری، بدون شماره‌ی خودت
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          شماره‌ی خودت را جایی وارد نکن. برای ساختن حساب در سرویس‌هایی که
          ایران را قبول نمی‌کنند، یک شماره‌ی واقعی از کشور دیگر بگیر.
        </p>
      </div>

      {/* انتخاب نوع */}
      <div className="mrail grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {NUMBER_KINDS.map((k) => {
          const Icon = ICONS[k.id];
          const on = kind === k.id;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => { sound.click(); setKind(k.id); }}
              onMouseEnter={() => sound.hover()}
              aria-pressed={on}
              className={`glow-hover group relative text-right p-4 rounded-2xl border transition-all duration-300
                          ${on
                            ? 'bg-white/[0.07] -translate-y-1 shadow-[0_14px_34px_rgba(0,0,0,0.55)]'
                            : 'bg-[#0d091a]/80 border-white/[0.08] hover:border-white/20 hover:-translate-y-0.5'}`}
              style={{
                ['--glow-accent' as string]: k.accent,
                ...(on ? { borderColor: `${k.accent}88` } : null),
              }}
            >
              <span className="flex items-center gap-2.5 mb-1.5">
                <span
                  className="w-9 h-9 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: `${k.accent}1f`, color: k.accent }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <b className="text-sm font-black text-white">{k.title}</b>
              </span>
              <span className="block text-[11px] text-zinc-400">{k.tagline}</span>
            </button>
          );
        })}
      </div>

      {/* محدودیت نوع انتخاب‌شده — قبل از خرید گفته می‌شود، نه بعدش */}
      <p
        className="flex items-start gap-2 p-3.5 rounded-2xl mb-8 text-[11px] leading-relaxed"
        /* رنگ متن از توکن می‌آید نه ثابت — با رنگ ثابتِ روشن، این
           متن روی کاغذ اصلاً خوانده نمی‌شد. */
        style={{
          background: `${active.accent}12`,
          border: `1px solid ${active.accent}38`,
          color: 'var(--text-secondary)',
        }}
      >
        <span
          className="w-4 h-4 rounded-full grid place-items-center shrink-0 mt-0.5 text-[9px] font-black"
          style={{ background: active.accent, color: '#08040f' }}
        >
          !
        </span>
        {active.limit}
      </p>

      {/* سرویس‌های پرتقاضا */}
      <div className="mrail grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mb-8">
        {popular.map((s) => {
          const price = cheapestFor(kind, s.id);
          return (
            <Link
              key={s.id}
              href={`/numbers?service=${s.id}&kind=${kind}`}
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
              className="glow-hover group relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl
                         bg-[#0e0a1b]/95 border border-white/[0.08]
                         hover:border-white/25 hover:-translate-y-1 transition-all duration-300"
              style={{ ['--glow-accent' as string]: s.accent }}
            >
              <span
                className="w-8 h-8 rounded-xl grid place-items-center text-sm font-black shrink-0
                           transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${s.accent}1f`, color: s.accent }}
              >
                {s.mark}
              </span>
              <b className="text-[11px] font-black text-white text-center leading-tight">{s.name}</b>
              {price !== null ? (
                <span className="text-[9px] text-zinc-400">
                  از <b className="num-en text-zinc-200">{fmt(price)}</b>
                </span>
              ) : (
                <span className="text-[9px] text-zinc-600">ناموجود</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* رفتن به صفحه‌ی کامل */}
      <div className="flex justify-center">
        <Link
          href="/numbers"
          onClick={() => sound.click()}
          onMouseEnter={() => sound.hover()}
          className="btn btn--action"
        >
          همه‌ی سرویس‌ها و کشورها
          <ArrowLeft className="btn__icon" />
        </Link>
      </div>
    </section>
  );
}
