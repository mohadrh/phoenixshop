'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LifeBuoy, MessageSquare, Search, Sparkles } from 'lucide-react';
import {
  HELP_ARTICLES, HELP_CATEGORIES, type HelpCategory,
} from '../../data/helpArticles';
import { sound } from '../../lib/sound';

/**
 * صفحه‌ی سوالات متداول.
 *
 * از همان پایگاه دانشی تغذیه می‌شود که فرم تیکت استفاده می‌کند — یعنی
 * هر مقاله‌ای که اینجا اضافه شود، همان لحظه در پیشنهاد حین نوشتن تیکت
 * هم ظاهر می‌شود. دو نسخه‌ی جدا از حقیقت نداریم.
 */

const norm = (s: string) =>
  s.replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/‌/g, ' ').toLowerCase().trim();

type Filter = HelpCategory | 'all';

export function FaqBrowser() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = norm(query);
    return HELP_ARTICLES.filter((a) => {
      if (filter !== 'all' && a.category !== filter) return false;
      if (!q) return true;
      return norm([a.title, a.answer, ...(a.steps ?? [])].join(' ')).includes(q);
    });
  }, [query, filter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: HELP_ARTICLES.length };
    HELP_ARTICLES.forEach((a) => {
      map[a.category] = (map[a.category] ?? 0) + 1;
    });
    return map;
  }, []);

  return (
    <main className="relative z-10 min-h-svh pt-28 pb-24 px-4 sm:px-6 lg:px-8 text-zinc-100">
      <div className="max-w-4xl mx-auto">
        {/* سربرگ */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-4">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>راهنما و پشتیبانی</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mb-3">سوالات متداول</h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            پاسخ پرتکرارترین سوال‌ها درباره‌ی تحویل، فعال‌سازی، گارانتی و پرداخت.
            اگر جوابت اینجا نبود، تیکت بزن — معمولاً زیر دو ساعت جواب می‌گیری.
          </p>
        </header>

        {/* جست‌وجو */}
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="سوالت را بنویس…"
            className="w-full bg-[#0d091a]/90 border border-white/10 rounded-2xl pr-11 pl-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors backdrop-blur-xl"
            aria-label="جست‌وجو در سوالات متداول"
          />
        </div>

        {/* فیلتر دسته */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {(['all', ...Object.keys(HELP_CATEGORIES)] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => { sound.click(); setFilter(f); }}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all shrink-0 flex items-center gap-1.5 ${
                filter === f
                  ? 'bg-amber-500 text-black border-amber-400 shadow'
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              <span>{f === 'all' ? 'همه' : HELP_CATEGORIES[f as HelpCategory]}</span>
              <span
                className={`text-[9px] px-1.5 rounded-full ${
                  filter === f ? 'bg-black/25 text-amber-200' : 'bg-white/10 text-zinc-500'
                }`}
              >
                {(counts[f] ?? 0).toLocaleString('fa-IR')}
              </span>
            </button>
          ))}
        </div>

        {/* فهرست سوال‌ها */}
        {results.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-[#0d091a] border border-white/10">
            <Search className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <h2 className="text-base font-bold text-white mb-1">پاسخی پیدا نشد</h2>
            <p className="text-xs text-zinc-500 mb-5">عبارت دیگری امتحان کن یا مستقیم تیکت بزن.</p>
            <Link
              href="/account/tickets"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white text-xs font-black"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              ثبت تیکت پشتیبانی
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {results.map((a) => {
              const isOpen = openId === a.id;
              return (
                <div
                  key={a.id}
                  className={`rounded-2xl bg-[#0e0a1b]/95 border overflow-hidden transition-colors ${
                    isOpen ? 'border-amber-400/40' : 'border-white/[0.08]'
                  }`}
                >
                  <button
                    onClick={() => { sound.click(); setOpenId(isOpen ? null : a.id); }}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-3 p-4 text-right hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-zinc-500 shrink-0">
                      {HELP_CATEGORIES[a.category]}
                    </span>
                    <span className="flex-1 text-sm text-white font-bold">{a.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4">
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">{a.answer}</p>

                      {a.steps && (
                        <ol className="space-y-2 mb-3 pr-4">
                          {a.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                              <span className="w-5 h-5 rounded-lg bg-amber-500/15 text-amber-300 text-[10px] font-black grid place-items-center shrink-0 mt-0.5">
                                {(i + 1).toLocaleString('fa-IR')}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}

                      <div className="pt-3 border-t border-white/[0.08] text-[10px] text-zinc-600">
                        {a.helpfulCount.toLocaleString('fa-IR')} نفر این پاسخ را مفید دانستند
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* هنوز جواب نگرفتی */}
        <div className="mt-10 p-6 rounded-3xl bg-gradient-to-br from-purple-950/30 via-[#0d0718] to-[#08040f] border border-purple-500/25 text-center">
          <Sparkles className="w-7 h-7 text-amber-400 mx-auto mb-3" />
          <h2 className="text-base font-black text-white mb-1.5">هنوز جوابت را نگرفتی؟</h2>
          <p className="text-xs text-zinc-400 mb-5 max-w-md mx-auto">
            موضوعت را در فرم تیکت بنویس — اگر پاسخ آماده‌ای داشته باشیم همان‌جا نشانت می‌دهیم،
            وگرنه تیکتت مستقیم به پشتیبانی می‌رود.
          </p>
          <Link
            href="/account/tickets"
            onClick={() => sound.click()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.65)] transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            ثبت تیکت پشتیبانی
          </Link>
        </div>
      </div>
    </main>
  );
}
