'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Bot, Check, Cpu, ShieldCheck, Sparkles, Zap,
} from 'lucide-react';
import { getProductBySlug, getLowestPrice } from '../../data/catalog';
import { sound } from '../../lib/sound';

/**
 * مرکز فرماندهی دستیارهای هوشمند — پورت طراحی نسخه‌ی قبلی.
 *
 * ستون انتخاب مدل در سمت راست، پنل جزئیات با بنچمارک و کاربردها در
 * سمت چپ. تفاوت با نسخه‌ی اصلی: قیمت و موجودی از کاتالوگ خوانده
 * می‌شود نه از داده‌ی تکراری، پس هیچ‌وقت با صفحه‌ی محصول ناهم‌خوان
 * نمی‌شود. مدل‌هایی که هنوز در کاتالوگ نیستند اینجا هم ظاهر نمی‌شوند.
 */

const fmt = (n: number) => n.toLocaleString('fa-IR');

interface AiModel {
  id: string;
  /** slug محصول در کاتالوگ — منبع قیمت و لینک */
  slug: string;
  name: string;
  subName: string;
  icon: string;
  badge: string;
  accent: string;
  activationType: string;
  description: string;
  useCases: string[];
  benchmarks: { label: string; value: string; strong?: boolean }[];
}

const MODELS: AiModel[] = [
  {
    id: 'chatgpt',
    slug: 'chatgpt',
    name: 'ChatGPT',
    subName: 'OpenAI · Go و Plus',
    icon: '◎',
    badge: 'اگر فقط یکی می‌خری',
    accent: '#10a37f',
    activationType: 'ارتقا روی ایمیل شخصی شما',
    description:
      'کاری نیست که نتواند. اگر تازه شروع کرده‌ای یا نمی‌دانی دقیقاً چه می‌خواهی، از اینجا شروع کن — تنها مدلی است که هم می‌نویسد، هم کد اجرا می‌کند، هم تصویر می‌سازد و هم صدایت را می‌شنود.',
    useCases: [
      'نوشتن و بازنویسی متن فارسی و انگلیسی',
      'خواندن PDF و اکسل و جواب دادن از رویشان',
      'ساخت تصویر، وسط همان گفتگو',
      'گفتگوی صوتی زنده، بدون تایپ',
    ],
    benchmarks: [
      { label: 'نگارش فارسی', value: 'روان و طبیعی', strong: true },
      { label: 'کدنویسی', value: 'خوب، همراه با اجرای کد' },
      { label: 'تصویر', value: 'می‌سازد', strong: true },
      { label: 'بهترین وقتِ خریدش', value: 'وقتی یک ابزار برای همه‌کار می‌خواهی' },
    ],
  },
  {
    id: 'claude-pro',
    slug: 'claude-pro',
    name: 'Claude Pro',
    subName: 'Anthropic',
    icon: '✳',
    badge: 'اگر متن و کدت بلند است',
    accent: '#e8862e',
    activationType: 'ارتقای مستقیم روی اکانت شخصی',
    description:
      'وقتی چیزی که می‌دهی طولانی است — یک قرارداد، یک پایان‌نامه، یک پروژه‌ی چندفایلی — این همان مدلی است که تا آخرش را یادش می‌ماند و اول و آخر متن را به هم ربط می‌دهد.',
    useCases: [
      'بازنویسی پروژه‌های چندفایلی، بدون گم کردن رشته',
      'خواندن سند صدصفحه‌ای و جواب دقیق از داخلش',
      'نوشتن فارسی که ترجمه به نظر نمی‌رسد',
      'خلاصه‌سازی بدون جا انداختن نکته',
    ],
    benchmarks: [
      { label: 'نگارش فارسی', value: 'بهترین لحن', strong: true },
      { label: 'کدنویسی', value: 'در سطح بالا', strong: true },
      { label: 'حافظه‌ی گفتگو', value: 'بسیار بلند', strong: true },
      { label: 'بهترین وقتِ خریدش', value: 'وقتی کارت با متن بلند سروکار دارد' },
    ],
  },
  {
    id: 'gemini-pro',
    slug: 'gemini-pro',
    name: 'Gemini Pro',
    subName: 'Google',
    icon: '✦',
    badge: 'کم‌هزینه‌ترین',
    accent: '#4a7cf7',
    activationType: 'پلن اختصاصی یا فمیلی',
    description:
      'ارزان‌ترین راه برای داشتن یک مدل جدی. به جست‌وجوی گوگل نزدیک است، پس وقتی جواب باید تازه باشد — قیمت، خبر، آمار امسال — کمتر از بقیه از خودش درمی‌آورد.',
    useCases: [
      'جست‌وجو و منابع روز، با ارجاع',
      'ترجمه‌ی متن تخصصی',
      'خواندن متن از عکس‌های بی‌کیفیت',
      'کار داخل Docs و Gmail',
    ],
    benchmarks: [
      { label: 'نگارش فارسی', value: 'خوب' },
      { label: 'اتصال به منابع روز', value: 'قوی‌ترین', strong: true },
      { label: 'خواندن تصویر', value: 'دقیق', strong: true },
      { label: 'بهترین وقتِ خریدش', value: 'وقتی بودجه تنگ است ولی کیفیت می‌خواهی' },
    ],
  },
  {
    id: 'cursor-pro',
    slug: 'cursor-pro',
    name: 'Cursor',
    subName: 'Anysphere · ادیتور کد',
    icon: '⌘',
    badge: 'برای برنامه‌نویس',
    accent: '#a855f7',
    activationType: 'اکانت آماده، تحویل فوری',
    description:
      'این یکی چت نیست، ادیتور است. فرق اصلی‌اش با بقیه این است که خودش فایل‌های پروژه‌ات را می‌خواند و ویرایش می‌کند — دیگر لازم نیست کد را کپی کنی و برگردانی.',
    useCases: [
      'ویرایش مستقیم فایل‌های پروژه',
      'فهمیدن کدی که خودت ننوشته‌ای',
      'ریفکتور چندفایلی با یک دستور',
      'دیباگ همراه با اجرای واقعی',
    ],
    benchmarks: [
      { label: 'کدنویسی', value: 'تخصصی', strong: true },
      { label: 'کار با پروژه‌ی واقعی', value: 'مستقیم روی فایل', strong: true },
      { label: 'نگارش فارسی', value: 'در حد نیاز' },
      { label: 'بهترین وقتِ خریدش', value: 'وقتی روزت داخل ادیتور می‌گذرد' },
    ],
  },
];

/* ---------------------------------------------------------------
   جدول مقایسه.

   ستون انتخاب مدل جزئیات یک مدل را نشان می‌دهد؛ این جدول کار دیگری
   می‌کند: کنار هم گذاشتن. کسی که هنوز تصمیم نگرفته، با دیدن یک ردیف
   زودتر به جواب می‌رسد تا با خواندن چهار توضیح.
--------------------------------------------------------------- */

const COMPARE: { row: string; values: Record<string, string> }[] = [
  {
    row: 'بهترین برای',
    values: {
      chatgpt: 'همه‌کاره',
      'claude-pro': 'متن و کد بلند',
      'gemini-pro': 'جست‌وجو و ترجمه',
      'cursor-pro': 'برنامه‌نویسی',
    },
  },
  {
    row: 'نگارش فارسی',
    values: {
      chatgpt: 'روان',
      'claude-pro': 'بهترین',
      'gemini-pro': 'خوب',
      'cursor-pro': 'در حد نیاز',
    },
  },
  {
    row: 'تولید تصویر',
    values: {
      chatgpt: 'دارد',
      'claude-pro': 'ندارد',
      'gemini-pro': 'دارد',
      'cursor-pro': 'ندارد',
    },
  },
  {
    row: 'منابع روز اینترنت',
    values: {
      chatgpt: 'دارد',
      'claude-pro': 'دارد',
      'gemini-pro': 'قوی‌ترین',
      'cursor-pro': 'محدود',
    },
  },
  {
    row: 'کار مستقیم روی فایل پروژه',
    values: {
      chatgpt: 'خیر',
      'claude-pro': 'خیر',
      'gemini-pro': 'خیر',
      'cursor-pro': 'بله',
    },
  },
];

export function AICommandCenter() {
  const [selectedId, setSelectedId] = useState(MODELS[0].id);
  const model = MODELS.find((m) => m.id === selectedId) ?? MODELS[0];
  const product = getProductBySlug(model.slug);

  return (
    <section
      id="ai-center"
      className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-100"
    >
      {/* سربرگ */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4">
          <Cpu className="w-3.5 h-3.5" />
          <span>مرکز فرماندهی دستیارهای هوشمند</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
          می‌خوای بدونی کدام AI بیشتر به کارت می‌خوره؟
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
          هیچ‌کدام از بقیه بهتر نیست؛ هرکدام کار خودش را بهتر بلد است. بگو
          می‌خواهی چه کار کنی، جوابش همین پایین است.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
        {/* ---------- ستون انتخاب مدل ---------- */}
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:sticky lg:top-24 lg:self-start [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {MODELS.map((m) => {
            const isActive = m.id === selectedId;
            const p = getProductBySlug(m.slug);
            return (
              <button
                key={m.id}
                onClick={() => { sound.click(); setSelectedId(m.id); }}
                onMouseEnter={() => sound.hover()}
                className={`glow-hover shrink-0 lg:shrink w-64 lg:w-full text-right p-4 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-white/[0.07] shadow-[0_10px_30px_rgba(0,0,0,0.5)] -translate-y-0.5'
                    : 'bg-[#0d091a]/80 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
                style={{
                  ['--glow-accent' as string]: m.accent,
                  ...(isActive ? { borderColor: `${m.accent}88` } : null),
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="w-9 h-9 rounded-xl grid place-items-center text-lg font-black shrink-0"
                    style={{ background: `${m.accent}22`, color: m.accent }}
                    aria-hidden="true"
                  >
                    {m.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-white truncate">{m.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{m.subName}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold border"
                    style={{ background: `${m.accent}18`, borderColor: `${m.accent}44`, color: m.accent }}
                  >
                    {m.badge}
                  </span>
                  {p && (
                    <span className="text-[11px] font-black text-amber-300 num-en">
                      از {fmt(getLowestPrice(p))}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          <Link
            href="/shop/ai"
            onClick={() => sound.click()}
            className="shrink-0 lg:shrink w-64 lg:w-full p-4 rounded-2xl bg-white/[0.03] border border-dashed border-white/15 text-center text-xs text-zinc-400 hover:text-amber-300 hover:border-amber-400/40 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>دیدن همه‌ی محصولات هوش مصنوعی</span>
          </Link>
        </div>

        {/* ---------- پنل جزئیات ---------- */}
        <div
          className="relative rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-[#140b24] via-[#0d0718] to-[#08040f] border overflow-hidden"
          style={{ borderColor: `${model.accent}44` }}
        >
          {/* هاله‌ی رنگ مدل */}
          <div
            className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: `${model.accent}22` }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            {/* سربرگ مدل */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 mb-5 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span
                  className="w-12 h-12 rounded-2xl grid place-items-center text-2xl font-black shrink-0"
                  style={{ background: `${model.accent}22`, color: model.accent }}
                  aria-hidden="true"
                >
                  {model.icon}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">{model.name}</h3>
                  <div className="text-[11px] text-zinc-500">{model.subName}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                  <Zap className="w-3 h-3" />
                  {product?.deliveryEstimate ?? 'تحویل سریع'}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  {product?.warrantyLabel ?? 'گارانتی تمام دوره'}
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6">{model.description}</p>

            {/* نوع فعال‌سازی */}
            <div
              className="flex items-start gap-2 p-3 rounded-2xl border text-xs mb-6"
              style={{ background: `${model.accent}12`, borderColor: `${model.accent}38`, color: model.accent }}
            >
              <Bot className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{model.activationType}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* کاربردها */}
              <div>
                <h4 className="text-xs font-black text-white mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: model.accent }} />
                  <span>برای چه کاری خوب است</span>
                </h4>
                <ul className="space-y-2">
                  {model.useCases.map((u) => (
                    <li key={u} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: model.accent }} />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* بنچمارک */}
              <div>
                <h4 className="text-xs font-black text-white mb-3 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" style={{ color: model.accent }} />
                  <span>مشخصات کلیدی</span>
                </h4>
                <dl className="space-y-0">
                  {model.benchmarks.map((b) => (
                    <div
                      key={b.label}
                      className="flex items-baseline justify-between gap-3 py-2 border-b border-dashed border-white/[0.08] last:border-0"
                    >
                      <dt className="text-[11px] text-zinc-500 shrink-0">{b.label}</dt>
                      <dd
                        className={`text-xs text-left ${b.strong ? 'font-bold' : 'text-zinc-300'}`}
                        style={b.strong ? { color: model.accent } : undefined}
                      >
                        {b.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* کنش */}
            {product && (
              <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/[0.08]">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] text-zinc-500">شروع از</span>
                  <b className="text-xl font-black text-amber-300 num-en">
                    {fmt(getLowestPrice(product))}
                  </b>
                  <span className="text-[11px] text-zinc-400">تومان</span>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  onClick={() => sound.click()}
                  onMouseEnter={() => sound.hover()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.65)] active:scale-95 transition-all"
                >
                  <span>مشاهده و خرید</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- جدول مقایسه ---------- */}
      <div className="mt-8">
        <h3 className="text-center text-sm font-black text-white mb-1">
          یا همه را کنار هم ببین
        </h3>
        <p className="text-center text-[11px] text-zinc-500 mb-5">
          سطری که به کارت می‌آید را پیدا کن، ستونش جواب توست.
        </p>

        {/* روی موبایل جدول خودش می‌لغزد، نه کل صفحه */}
        <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#0d091a]/70
                        [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full">
          <table className="w-full min-w-[620px] border-collapse text-right">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="p-3.5 text-[11px] font-bold text-zinc-500 text-right w-[190px]">
                  &nbsp;
                </th>
                {MODELS.map((m) => (
                  <th key={m.id} className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => { sound.click(); setSelectedId(m.id); }}
                      onMouseEnter={() => sound.hover()}
                      className="inline-flex flex-col items-center gap-1 transition-transform hover:-translate-y-0.5"
                    >
                      <span
                        className="w-8 h-8 rounded-xl grid place-items-center text-base font-black"
                        style={{ background: `${m.accent}1f`, color: m.accent }}
                      >
                        {m.icon}
                      </span>
                      <span
                        className={`text-[11px] font-black transition-colors ${
                          selectedId === m.id ? 'text-white' : 'text-zinc-400'
                        }`}
                      >
                        {m.name}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((c) => (
                <tr key={c.row} className="border-b border-white/[0.05] last:border-0">
                  <th scope="row" className="p-3.5 text-[11px] font-bold text-zinc-400 text-right">
                    {c.row}
                  </th>
                  {MODELS.map((m) => {
                    const v = c.values[m.id] ?? '—';
                    const isBest = ['بهترین', 'قوی‌ترین', 'تخصصی', 'همه‌کاره', 'بله'].includes(v);
                    return (
                      <td
                        key={m.id}
                        className={`p-3.5 text-center text-[11px] transition-colors ${
                          selectedId === m.id ? 'bg-white/[0.04]' : ''
                        } ${isBest ? 'font-black' : 'text-zinc-400'}`}
                        style={isBest ? { color: m.accent } : undefined}
                      >
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
