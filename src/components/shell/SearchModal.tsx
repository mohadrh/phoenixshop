'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Command, CornerDownLeft, Search, Sparkles, X, Zap } from 'lucide-react';
import {
  CATEGORIES, PRODUCTS, getLowestPrice, type Product,
} from '../../data/catalog';
import { sound } from '../../lib/sound';

/**
 * جست‌وجوی سراسری.
 *
 * با Ctrl+K یا کلیک روی ذره‌بین نوبار باز می‌شود. ناوبری با فلش و
 * Enter کار می‌کند، چون کسی که میان‌بر صفحه‌کلید می‌زند انتظار ندارد
 * وسط کار دستش برود سراغ موس.
 */

const fmt = (n: number) => n.toLocaleString('fa-IR');

const norm = (s: string) =>
  s.replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/‌/g, ' ').toLowerCase().trim();

/** پیشنهادهای آماده وقتی هنوز چیزی تایپ نشده */
const QUICK = [
  'ChatGPT', 'Claude', 'Canva', 'CapCut', 'Telegram', 'گیم',
];

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter((p: Product) =>
      norm([p.title, p.englishTitle, p.brand, p.shortDescription].join(' ')).includes(q)
    ).slice(0, 8);
  }, [query]);

  const categoryHits = useMemo(() => {
    const q = norm(query);
    if (!q) return [];
    return CATEGORIES.filter((c) => norm(c.title).includes(q) || norm(c.tagline).includes(q));
  }, [query]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    if (!open) return;
    // تأخیر یک فریم تا مودال واقعاً در DOM باشد
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (p: Product) => {
    sound.click();
    onClose();
    setQuery('');
    router.push(`/product/${p.slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    }
    if (e.key === 'Enter' && results[cursor]) {
      e.preventDefault();
      go(results[cursor]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[420] flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="جست‌وجو"
    >
      <button
        className="absolute inset-0 bg-black/75 backdrop-blur-sm border-0"
        onClick={onClose}
        aria-label="بستن جست‌وجو"
      />

      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[#0d091a] border border-white/10 shadow-2xl overflow-hidden"
        onKeyDown={onKeyDown}
      >
        {/* ورودی */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08]">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام محصول، برند یا دسته…"
            className="flex-1 bg-transparent text-base text-white placeholder-zinc-500 focus:outline-none"
            aria-label="عبارت جست‌وجو"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg grid place-items-center text-zinc-500 hover:text-white hover:bg-white/5 shrink-0"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* پیشنهادهای سریع */}
        {!query && (
          <div className="px-5 py-3 flex items-center gap-2 flex-wrap border-b border-white/[0.06]">
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              جست‌وجوهای پرتکرار
            </span>
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-zinc-300 hover:border-amber-400/40 hover:text-amber-300 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* نتایج */}
        <div className="max-h-[52vh] overflow-y-auto">
          {categoryHits.length > 0 && (
            <div className="px-3 pt-3">
              <div className="px-2 pb-2 text-[10px] font-bold text-zinc-500">دسته‌بندی</div>
              {categoryHits.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => { sound.click(); onClose(); router.push(`/shop/${c.slug}`); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-right transition-colors"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.accent }} />
                  <span className="text-sm text-white">{c.title}</span>
                  <span className="text-[11px] text-zinc-500 mr-auto">{c.tagline}</span>
                </button>
              ))}
            </div>
          )}

          {results.length === 0 ? (
            <div className="py-14 text-center">
              <Search className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">چیزی با این عبارت پیدا نشد</p>
              <p className="text-[11px] text-zinc-600 mt-1">عبارت دیگری امتحان کنید</p>
            </div>
          ) : (
            <div className="p-3">
              {!query && (
                <div className="px-2 pb-2 text-[10px] font-bold text-zinc-500">محصولات پرفروش</div>
              )}
              {results.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => go(p)}
                  onMouseEnter={() => setCursor(i)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-right transition-colors ${
                    i === cursor ? 'bg-white/[0.07]' : 'hover:bg-white/5'
                  }`}
                >
                  <span
                    className="w-10 h-10 rounded-xl grid place-items-center text-[11px] font-black shrink-0"
                    style={{ background: `${p.media.accent}22`, color: p.media.accent }}
                  >
                    {p.brand.slice(0, 2).toUpperCase()}
                  </span>

                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-bold text-white truncate">{p.englishTitle}</span>
                    <span className="text-[11px] text-zinc-500 truncate">{p.shortDescription}</span>
                  </span>

                  <span className="flex flex-col items-end shrink-0">
                    <span className="text-xs font-black text-amber-300 num-en">
                      {fmt(getLowestPrice(p))}
                    </span>
                    <span className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" />
                      {p.deliveryEstimate}
                    </span>
                  </span>

                  {i === cursor && (
                    <CornerDownLeft className="w-3.5 h-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* پاورقی راهنما */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-white/[0.08] text-[10px] text-zinc-500">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↑↓</kbd>
              حرکت
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Enter</kbd>
              انتخاب
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Esc</kbd>
              بستن
            </span>
          </div>

          <button
            onClick={() => { sound.click(); onClose(); router.push('/shop'); }}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
          >
            همه‌ی محصولات
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** میان‌بر صفحه‌کلید — در SiteChrome نصب می‌شود */
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpen]);
}
