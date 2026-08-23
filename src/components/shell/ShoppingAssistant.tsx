'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Check, Code2, Gamepad2, GraduationCap, Palette,
  PenLine, RotateCcw, Send, Sparkles, Video, Wallet, Wand2, X,
} from 'lucide-react';
import { PRODUCTS, getLowestPrice, type Product } from '../../data/catalog';
import { sound } from '../../lib/sound';

/**
 * دستیار خرید — پاپ‌آپ راهنما، از داخل منو باز می‌شود.
 *
 * قبلاً همین کار را دکمه‌ی شناور گوشه‌ی صفحه می‌کرد و کسی هم نمی‌زدش:
 * هیچ نشانه‌ای نبود که پشتش راهنمایی خرید است، نه پشتیبانی. حالا در
 * منو نشسته با اسم صریح، و به‌جای چت آزاد دو سؤال بسته می‌پرسد —
 * چه کاری، چه بودجه‌ای — و بعد جواب می‌دهد.
 *
 * تطبیق کاملاً محلی است. هیچ درخواستی به شبکه نمی‌رود، پس پاسخ آنی
 * است و باز کردن دستیار روی هیچ صفحه‌ای هزینه‌ای اضافه نمی‌کند.
 */

const fmt = (n: number) => n.toLocaleString('fa-IR');

/* ---------------------------------------------------------------
   گام یک — کار
--------------------------------------------------------------- */

interface Goal {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  accent: string;
  match: (p: Product) => boolean;
  /** جمله‌ای که در گام آخر توضیح می‌دهد چرا این‌ها پیشنهاد شده‌اند */
  reason: string;
}

const GOALS: Goal[] = [
  {
    id: 'write',
    label: 'نوشتن، ترجمه و تحقیق',
    hint: 'مقاله، پایان‌نامه، ایمیل کاری',
    icon: <PenLine className="w-5 h-5" />,
    accent: '#e8862e',
    match: (p) => p.category === 'ai' && p.id !== 'cursor-pro',
    reason: 'برای متن فارسی و تحقیق، مدل‌های گفتگویی بهترین نتیجه را می‌دهند.',
  },
  {
    id: 'code',
    label: 'کدنویسی و برنامه‌نویسی',
    hint: 'تکمیل کد، دیباگ، ریفکتور',
    icon: <Code2 className="w-5 h-5" />,
    accent: '#4a7cf7',
    match: (p) => p.id === 'cursor-pro' || p.id === 'claude-pro' || p.id === 'chatgpt',
    reason: 'این‌ها روی کد آموزش دیده‌اند و مستقیم داخل ادیتور کار می‌کنند.',
  },
  {
    id: 'video',
    label: 'ادیت ویدیو و کلیپ',
    hint: 'ریلز، یوتیوب، تدوین موبایل',
    icon: <Video className="w-5 h-5" />,
    accent: '#de2e6b',
    match: (p) => p.id === 'capcut-pro' || p.id === 'canva-pro',
    reason: 'برای محتوای شبکه‌های اجتماعی، این دو کوتاه‌ترین مسیر تا خروجی‌اند.',
  },
  {
    id: 'design',
    label: 'طراحی و گرافیک',
    hint: 'بنر، لوگو، رابط کاربری',
    icon: <Palette className="w-5 h-5" />,
    accent: '#a855f7',
    match: (p) => p.category === 'creative',
    reason: 'ابزارهای طراحی با کتابخانه‌ی آماده، کار را از صفر شروع نمی‌کنند.',
  },
  {
    id: 'game',
    label: 'بازی کردن',
    hint: 'اکانت قانونی پلی‌استیشن',
    icon: <Gamepad2 className="w-5 h-5" />,
    accent: '#8b3fd4',
    match: (p) => p.category === 'gaming',
    reason: 'همه‌ی این‌ها اکانت قانونی‌اند و گارانتی فعال دارند.',
  },
  {
    id: 'learn',
    label: 'یادگیری زبان',
    hint: 'انگلیسی و زبان‌های دیگر',
    icon: <GraduationCap className="w-5 h-5" />,
    accent: '#2ecc8f',
    match: (p) => p.category === 'education',
    reason: 'اشتراک کامل، بدون تبلیغ و بدون محدودیت جان.',
  },
  {
    id: 'social',
    label: 'تلگرام و شبکه‌های اجتماعی',
    hint: 'پریمیوم، استوری، حجم بیشتر',
    icon: <Send className="w-5 h-5" />,
    accent: '#4aa3e8',
    match: (p) => p.category === 'social',
    reason: 'مستقیم روی یوزرنیم خودت فعال می‌شود، بدون رمز و بدون لاگین.',
  },
];

/* ---------------------------------------------------------------
   گام دو — بودجه
--------------------------------------------------------------- */

interface Budget {
  id: string;
  label: string;
  max: number;
}

const BUDGETS: Budget[] = [
  { id: 'b1', label: 'زیر ۵۰۰ هزار تومان', max: 500_000 },
  { id: 'b2', label: '۵۰۰ هزار تا ۲ میلیون', max: 2_000_000 },
  { id: 'b3', label: '۲ تا ۵ میلیون', max: 5_000_000 },
  { id: 'b4', label: 'سقف ندارم، بهترین را می‌خواهم', max: Infinity },
];

export function ShoppingAssistant({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);

  // با Esc بسته شود و پشت پاپ‌آپ اسکرول نکند
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  /* هر بار که بسته می‌شود از اول شروع کند — کسی که فردا برمی‌گردد
     احتمالاً دنبال چیز دیگری است، نه ادامه‌ی جست‌وجوی دیروز. */
  useEffect(() => {
    if (open) return;
    setStep(1);
    setGoal(null);
    setBudget(null);
  }, [open]);

  const restart = () => {
    sound.click();
    setStep(1);
    setGoal(null);
    setBudget(null);
  };

  const results = useMemo(() => {
    if (!goal || !budget) return [];
    const pool = PRODUCTS.filter(goal.match);
    const inBudget = pool.filter((p) => getLowestPrice(p) <= budget.max);
    /* اگر هیچ‌چیز داخل بودجه نبود دست خالی برنمی‌گردیم — همان دسته را
       نشان می‌دهیم و پایین‌تر صادقانه می‌گوییم چرا. */
    const list = inBudget.length > 0 ? inBudget : pool;
    return [...list].sort((a, b) => b.salesCount - a.salesCount).slice(0, 4);
  }, [goal, budget]);

  const overBudget = Boolean(
    budget && results.length > 0 && getLowestPrice(results[0]) > budget.max
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="دستیار خرید"
    >
      {/* پرده */}
      <button
        type="button"
        aria-label="بستن"
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-default"
      />

      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl
                      bg-[#0c0817] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
        {/* هاله‌ی بالای پاپ‌آپ */}
        <span
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-48 rounded-full
                     bg-amber-500/20 blur-[80px] pointer-events-none"
          aria-hidden="true"
        />

        {/* سربرگ */}
        <header className="relative flex items-center gap-3 p-5 border-b border-white/[0.08]">
          <span className="w-11 h-11 rounded-2xl grid place-items-center shrink-0
                           bg-gradient-to-br from-amber-500 to-rose-600 shadow-[0_0_22px_rgba(245,158,11,0.45)]">
            <Wand2 className="w-5 h-5 text-white" />
          </span>
          <div className="flex-1 min-w-0">
            <b className="block text-sm font-black text-white">دستیار خرید</b>
            <small className="text-[11px] text-zinc-400">
              دو سؤال، بعد دقیقاً می‌گوییم کدام به کارت می‌آید
            </small>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="w-8 h-8 rounded-full grid place-items-center shrink-0 bg-white/5 border border-white/10
                       text-zinc-400 hover:text-white hover:border-white/25 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* نوار گام */}
        <div className="relative flex items-center gap-2 px-5 pt-5">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                s <= step ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="relative p-5">
          {/* ---------- گام ۱ ---------- */}
          {step === 1 && (
            <>
              <h3 className="text-base font-black text-white mb-1">
                می‌خواهی چه کاری انجام دهی؟
              </h3>
              <p className="text-[11px] text-zinc-400 mb-4">
                اسم محصول را نمی‌پرسیم — کارت را بگو، خودمان پیدایش می‌کنیم.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => { sound.click(); setGoal(g); setStep(2); }}
                    onMouseEnter={() => sound.hover()}
                    className="group flex items-center gap-3 p-3.5 rounded-2xl text-right
                               bg-white/[0.03] border border-white/[0.08]
                               hover:border-white/25 hover:bg-white/[0.06]
                               transition-all duration-200 active:scale-[0.98]"
                  >
                    <span
                      className="w-10 h-10 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: `${g.accent}1f`, color: g.accent }}
                    >
                      {g.icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <b className="block text-xs font-black text-white">{g.label}</b>
                      <small className="block text-[10px] text-zinc-500 truncate">{g.hint}</small>
                    </span>
                    <ArrowLeft className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ---------- گام ۲ ---------- */}
          {step === 2 && goal && (
            <>
              <h3 className="text-base font-black text-white mb-1">بودجه‌ات چقدر است؟</h3>
              <p className="text-[11px] text-zinc-400 mb-4">
                برای «{goal.label}» — اگر مطمئن نیستی، گزینه‌ی آخر را بزن.
              </p>

              <div className="flex flex-col gap-2.5">
                {BUDGETS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => { sound.click(); setBudget(b); setStep(3); }}
                    onMouseEnter={() => sound.hover()}
                    className="group flex items-center gap-3 p-3.5 rounded-2xl text-right
                               bg-white/[0.03] border border-white/[0.08]
                               hover:border-amber-400/40 hover:bg-white/[0.06]
                               transition-all duration-200 active:scale-[0.98]"
                  >
                    <Wallet className="w-4 h-4 text-amber-400 shrink-0" />
                    <b className="flex-1 text-xs font-bold text-zinc-100">{b.label}</b>
                    <ArrowLeft className="w-3.5 h-3.5 text-zinc-600 group-hover:text-amber-300 transition-colors" />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => { sound.click(); setStep(1); }}
                className="mt-5 flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                برگرد به سؤال قبل
              </button>
            </>
          )}

          {/* ---------- گام ۳ ---------- */}
          {step === 3 && goal && budget && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-black text-white">پیشنهاد ما</h3>
              </div>
              <p className="text-[11px] text-zinc-400 mb-4">{goal.reason}</p>

              {overBudget && (
                <p className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200 leading-relaxed">
                  در این بودجه چیزی برای این کار نداریم. ارزان‌ترین گزینه‌های موجود را
                  آورده‌ایم تا خودت تصمیم بگیری.
                </p>
              )}

              <div className="flex flex-col gap-2.5">
                {results.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={() => { sound.click(); onClose(); }}
                    onMouseEnter={() => sound.hover()}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl overflow-hidden
                               bg-white/[0.03] border border-white/[0.08]
                               hover:border-white/25 transition-all duration-200"
                  >
                    {/* هاله‌ی نوری روی هاور */}
                    <span
                      className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0
                                 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `${p.media.accent}33` }}
                      aria-hidden="true"
                    />

                    {i === 0 && (
                      <span
                        className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-l from-transparent via-amber-400 to-transparent"
                        aria-hidden="true"
                      />
                    )}

                    <span
                      className="relative w-10 h-10 rounded-xl grid place-items-center shrink-0 text-[11px] font-black"
                      style={{ background: `${p.media.accent}22`, color: p.media.accent }}
                    >
                      {i === 0 ? <Check className="w-4 h-4" /> : fmt(i + 1)}
                    </span>

                    <span className="relative flex-1 min-w-0">
                      <b className="block text-xs font-black text-white truncate">{p.englishTitle}</b>
                      <small className="block text-[10px] text-zinc-500 truncate">
                        {p.shortDescription}
                      </small>
                    </span>

                    <span className="relative text-left shrink-0">
                      <b className="block text-xs font-black text-amber-300 num-en">
                        {fmt(getLowestPrice(p))}
                      </b>
                      <small className="block text-[9px] text-zinc-600">تومان، از</small>
                    </span>
                  </Link>
                ))}

                {results.length === 0 && (
                  <p className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] text-zinc-400 text-center">
                    برای این ترکیب چیزی نداریم. سؤال اول را عوض کن یا از پشتیبانی بپرس.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={restart}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10
                             text-[11px] font-bold text-zinc-300 hover:text-white hover:border-white/25 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  از اول
                </button>
                <Link
                  href="/shop"
                  onClick={() => { sound.click(); onClose(); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                             bg-gradient-to-r from-amber-500 to-rose-600 text-white text-[11px] font-black
                             shadow-[0_0_18px_rgba(245,158,11,0.4)] hover:shadow-[0_0_26px_rgba(245,158,11,0.6)]
                             active:scale-95 transition-all"
                >
                  دیدن همه‌ی محصولات
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
