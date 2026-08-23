'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { ARTICLES, type ArticleTopic } from '../../data/articles';
import { sound } from '../../lib/sound';

/**
 * مقالات آموزشی.
 *
 * آخرین سکشن صفحه به‌عمد: کسی که تا اینجا آمده و هنوز نخریده، احتمالاً
 * هنوز نمی‌داند کدام محصول به کارش می‌آید. مقاله همان چیزی است که
 * جوابش را می‌دهد.
 */

type Filter = ArticleTopic | 'all';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'ai', label: 'هوش مصنوعی' },
  { id: 'gaming', label: 'گیم' },
  { id: 'creative', label: 'طراحی و ادیت' },
  { id: 'guide', label: 'راهنما' },
];

export function ArticlesSection() {
  const [filter, setFilter] = useState<Filter>('all');

  const shown = useMemo(
    () => (filter === 'all' ? ARTICLES : ARTICLES.filter((a) => a.topic === filter)),
    [filter]
  );

  return (
    <section
      id="articles"
      className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-100"
    >
      {/* سربرگ */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>مقالات و راهنماها</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
          بخوان، بعد بخر
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
          این‌ها را نوشته‌ایم که کمتر بفروشیم و درست‌تر بفروشیم — جواب همان
          سؤال‌هایی که قبل از پرداخت از خودت می‌پرسی.
        </p>
      </div>

      {/* فیلتر موضوع */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => { sound.click(); setFilter(f.id); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              filter === f.id
                ? 'bg-amber-500 text-black border-amber-400 shadow'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* کارت‌های مقاله */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="group relative flex flex-col gap-3 p-5 rounded-3xl
                       bg-[#0e0a1b]/95 border border-white/[0.08]
                       hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
            style={{ ['--art-accent' as string]: a.accent }}
          >
            {/* هاله‌ی نوری روی هاور */}
            <span
              className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-0
                         group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `${a.accent}30` }}
              aria-hidden="true"
            />

            {/* کاور مقاله */}
            {a.cover && (
              <span className="relative -mx-2 -mt-2 mb-1 block h-32 rounded-2xl overflow-hidden bg-[#0a0713]">
                <img
                  src={a.cover}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-55 group-hover:opacity-80
                             group-hover:scale-105 transition-all duration-500 ease-out"
                />
                {/* محو شدن به سمت کارت، تا تصویر بریده به نظر نرسد */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, #0e0a1b 4%, transparent 60%)' }}
                />
              </span>
            )}

            <span className="relative flex items-center justify-between gap-2">
              <span
                className="px-2.5 py-0.5 rounded-lg text-[10px] font-black"
                style={{ background: `${a.accent}22`, color: a.accent }}
              >
                {a.topicLabel}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <Clock className="w-3 h-3" />
                <span className="num-en">{a.readMinutes.toLocaleString('fa-IR')}</span> دقیقه
              </span>
            </span>

            <h3 className="relative text-sm font-black text-white leading-relaxed group-hover:text-amber-300 transition-colors">
              {a.title}
            </h3>

            <p className="relative text-[11px] text-zinc-400 leading-relaxed flex-1">
              {a.excerpt}
            </p>

            <span className="relative flex items-center justify-between gap-2 pt-3 border-t border-white/[0.08]">
              <span className="text-[10px] text-zinc-600">{a.publishedAt}</span>
              <span
                className="flex items-center gap-1 text-[11px] font-bold transition-transform group-hover:-translate-x-1"
                style={{ color: a.accent }}
              >
                خواندن
                <ArrowLeft className="w-3 h-3" />
              </span>
            </span>

            {/* نوار نور پایین کارت */}
            <span
              className="absolute bottom-0 inset-x-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(to left, transparent, ${a.accent}, transparent)` }}
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
