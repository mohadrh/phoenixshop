'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Flame, Plus, Sparkles } from 'lucide-react';
import { PRODUCTS, getDefaultVariant, needsCustomerInput, type Product } from '../../data/catalog';
import { useCart, useFlight } from '../../app/providers';
import { VariantSheet } from '../product/VariantSheet';
import { ProductArt } from '../product/ProductArt';
import { sound } from '../../lib/sound';
import { SectionFilter, applyScope, type SectionScope } from './SectionFilter';

/**
 * پیشنهادهای آتشین — پورت مستقیم طراحی نسخه‌ی قبلی.
 *
 * نوار سربرگ چسبان، چهار کارت با هاله‌ی آتش، پوستر با کاراکتر شناور
 * و نوار نور پایین کارت — همه عیناً همان‌اند. `scale-112` که Tailwind
 * هرگز تولیدش نمی‌کرد به مقدار دلخواه تبدیل شد.
 */

const fmt = (n: number) => n.toLocaleString('fa-IR');

function discountOf(p: Product) {
  const v = getDefaultVariant(p);
  if (!v.compareAt || v.compareAt <= v.price) return 0;
  return Math.round((1 - v.price / v.compareAt) * 100);
}

/* مخزن کامل نگه داشته می‌شود و برشِ چهارتایی بعد از فیلتر انجام
   می‌شود — وگرنه با انتخاب یک دسته، همان چهارتای اولِ کل فهرست
   فیلتر می‌شد و اغلب هیچ‌چیز نمی‌ماند. */
const DEAL_POOL = PRODUCTS
  .filter((p) => discountOf(p) > 0 || p.badges.includes('hot'))
  .sort((a, b) => discountOf(b) - discountOf(a));

/** پایان فرصت: امشب نیمه‌شب. سرور و کلاینت باید یک عدد بدهند، پس
    مقدار اولیه null است و تایمر فقط بعد از mount شروع می‌شود. */
function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      setLeft(Math.max(0, end.getTime() - now.getTime()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (left === null) return null;
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

export function HotDealsSection() {
  const router = useRouter();
  const { add } = useCart();
  const { launch } = useFlight();
  const [sheetFor, setSheetFor] = useState<Product | null>(null);
  const [scope, setScope] = useState<SectionScope>('all');

  const deals = applyScope(DEAL_POOL, scope).slice(0, 4);
  const maxDiscount = Math.max(0, ...deals.map(discountOf));
  const countdown = useCountdown();

  const handleAdd = (p: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (p.variants.length > 1 || needsCustomerInput(p)) {
      setSheetFor(p);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    launch({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    add(p, getDefaultVariant(p));
  };

  return (
    <section id="hot-deals" className="relative z-10 py-16 md:py-24 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* نوار سربرگ چسبان */}
        <div className="sticky top-20 z-30 mb-8 p-4 sm:p-5 rounded-2xl bg-[#090616]/95 border border-amber-500/30 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 mx-auto sm:mx-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-600 p-0.5 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <div className="w-full h-full bg-[#0d091e] rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  تا وقتی هست
                </h2>
                {maxDiscount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                    تخفیف تا {fmt(maxDiscount)}٪
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
این قیمت‌ها تا پایان شمارش معکوس‌اند. بعدش برمی‌گردند سر جای اول.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs mr-auto sm:mr-0">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400 text-[11px]">فرصت باقی‌مانده:</span>
            <span className="font-bold text-amber-300">{countdown ?? '––:––:––'}</span>
          </div>
        </div>

        {/* فیلتر دسته */}
        <div className="mb-6">
          <SectionFilter value={scope} onChange={setScope} exclude={['numbers']} />
        </div>

        {deals.length === 0 && (
          <p className="secfil-empty">در این دسته الان تخفیفی نداریم.</p>
        )}

        {/* چهار کارت آتشین */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((product) => {
            const v = getDefaultVariant(product);
            const off = discountOf(product);

            return (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.slug}`)}
                className="group relative flex flex-col justify-between rounded-3xl p-4 bg-gradient-to-b from-[#140b24] via-[#0d0718] to-[#08040f] border border-orange-500/30 hover:border-orange-400 shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_45px_rgba(249,115,22,0.35)] transition-all duration-500 hover:-translate-y-2.5 cursor-pointer overflow-hidden hot-fire-glow"
              >
                {/* هاله و شعله‌ی پشت کارت */}
                <div className="absolute -bottom-10 inset-x-0 h-32 bg-gradient-to-t from-orange-600/35 via-rose-600/20 to-transparent blur-2xl pointer-events-none group-hover:h-48 group-hover:from-orange-500/55 transition-all duration-700" />
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/30 via-orange-600/20 to-transparent blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

                {/* ردیف بالا: تخفیف و تحویل */}
                <div className="relative z-10 flex items-center justify-between mb-3 gap-2">
                  {off > 0 ? (
                    <span className="px-2.5 py-1 rounded-xl bg-black/70 text-amber-200 border border-amber-300/40 backdrop-blur-md font-black text-xs flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-300 animate-pulse" />
                      <span>{fmt(off)}٪ تخفیف</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold text-xs">
                      پیشنهاد داغ
                    </span>
                  )}

                  <div className="flex items-center gap-1 text-[10px] text-amber-300 font-black bg-black/60 px-2.5 py-1 rounded-xl border border-amber-400/40 backdrop-blur-md whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{product.deliveryEstimate}</span>
                  </div>
                </div>

                {/* پوستر با هاله‌ی آتش */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3.5 bg-black/50 border border-orange-500/20 group-hover:border-orange-400/50 transition-colors">
                  <ProductArt
                    src={product.media.cover}
                    accent={product.media.accent}
                    brand={product.brand}
                    title={product.englishTitle}
                    layer="backdrop"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0718] via-orange-950/20 to-transparent opacity-85 pointer-events-none" />

                  {product.media.cutout && (
                    <img
                      src={product.media.cutout}
                      alt=""
                      className="absolute bottom-0 right-2 h-36 object-contain filter drop-shadow-[0_10px_20px_rgba(249,115,22,0.6)] transition-transform duration-500 group-hover:scale-[1.12] group-hover:-translate-y-1.5"
                    />
                  )}

                  <div className="absolute bottom-1 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/70 text-orange-400 border border-orange-500/30 text-[10px] font-bold backdrop-blur-sm">
                    <Flame className="w-3 h-3 fill-orange-400" />
                    <span>فروش ویژه</span>
                  </div>
                </div>

                {/* نام محصول */}
                <div className="relative z-10 space-y-1.5 mb-4">
                  <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                    {product.englishTitle}
                  </h3>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {product.shortDescription}
                  </div>
                </div>

                {/* قیمت و خرید */}
                <div className="relative z-10 pt-3 border-t border-orange-500/20 flex items-center justify-between">
                  <div>
                    {v.compareAt && (
                      <div className="text-[10px] text-zinc-500 line-through num-en">
                        {fmt(v.compareAt)} ت
                      </div>
                    )}
                    <div className="text-sm font-black text-amber-300 num-en">
                      {fmt(v.price)}
                      <span className="text-[10px] font-normal text-zinc-400"> تومان</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleAdd(product, e)}
                    onMouseEnter={() => sound.hover()}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 text-white hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] active:scale-95 transition-all cursor-pointer border border-amber-300/30"
                    title="افزودن با پرواز جت سوخو-۵۷ به سبد خرید"
                    aria-label={`افزودن ${product.title} به سبد خرید`}
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                {/* نوار نور پایین کارت */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 opacity-80 group-hover:opacity-100 group-hover:h-1.5 transition-all" />
              </div>
            );
          })}
        </div>
      </div>

      {sheetFor && (
        <VariantSheet
          product={sheetFor}
          onClose={() => setSheetFor(null)}
          onConfirm={(v, inputs, origin) => {
            if (origin) launch(origin);
            add(sheetFor, v, inputs);
            setSheetFor(null);
          }}
        />
      )}
    </section>
  );
}
