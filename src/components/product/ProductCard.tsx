'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Star, Zap, Flame, Eye } from 'lucide-react';
import { useCart, useFlight } from '../../app/providers';
import { getDefaultVariant, needsCustomerInput, type Product } from '../../data/catalog';
import { VariantSheet } from './VariantSheet';
import { ProductArt } from './ProductArt';
import { sound } from '../../lib/sound';

/**
 * کارت محصول — پورت مستقیم طراحی نسخه‌ی قبلی.
 *
 * کلاس‌ها عیناً از نسخه‌ی اصلی برداشته شده‌اند، با یک استثنا: چند مقدار
 * آنجا وجود خارجی نداشتند و Tailwind هرگز تولیدشان نمی‌کرد —
 * `scale-108`، `scale-106`، `duration-400` و `border-white/8`.
 * به معادل مقدار-دلخواهشان تبدیل شدند تا افکتی که قرار بوده دیده شود،
 * واقعاً دیده شود.
 */
export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const { launch } = useFlight();
  const [sheetOpen, setSheetOpen] = useState(false);

  const variant = getDefaultVariant(product);
  const isHot = product.badges.includes('hot');
  const isSpecial = product.badges.includes('limited') || product.badges.includes('new');

  const discount =
    variant.compareAt && variant.compareAt > variant.price
      ? Math.round((1 - variant.price / variant.compareAt) * 100)
      : null;

  /* فقط مسیرهایی که واقعاً فایل دارند آرت حساب می‌شوند. بقیه به پنل
     برندشده می‌افتند تا کارت شکسته به نظر نرسد. */
  const hasArt = Boolean(product.media.cover);
  const art = hasArt ? product.media.cover : undefined;
  const cutout = product.media.cutout ?? art;

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (product.variants.length > 1 || needsCustomerInput(product)) {
      setSheetOpen(true);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    launch({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    add(product, variant);
  };

  const borderTone = isHot
    ? 'border-orange-500/20 hover:border-orange-500/60 hover:shadow-[0_15px_40px_rgba(249,115,22,0.25)]'
    : isSpecial
    ? 'border-purple-500/20 hover:border-purple-500/60 hover:shadow-[0_15px_40px_rgba(168,85,247,0.25)]'
    : 'border-white/[0.08] hover:border-amber-400/50 hover:shadow-[0_15px_40px_rgba(245,158,11,0.2)]';

  return (
    <>
      <div
        onClick={() => router.push(`/product/${product.slug}`)}
        className={`glow-hover group relative flex flex-col justify-between rounded-3xl p-3.5 sm:p-4 transition-all duration-[400ms] hover:-translate-y-2 cursor-pointer bg-[#0e0a1b]/95 border ${borderTone}`}
        style={{ ['--glow-accent' as string]: product.media.accent }}
      >
        {/* بنر تصویر */}
        <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1c1433] to-[#07050e] flex items-center justify-center">
          <ProductArt
            src={art}
            accent={product.media.accent}
            brand={product.brand}
            title={product.englishTitle}
            layer="backdrop"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-[1.08] transition-all duration-500 ease-out"
          />

          {/* جاروب نور روی هاور */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          <div className="relative z-10 w-full h-full flex items-end justify-center p-2">
            <ProductArt
              src={cutout}
              accent={product.media.accent}
              brand={product.brand}
              title={product.englishTitle}
              layer="cutout"
              className="max-h-[92%] w-auto object-contain filter contrast-[1.08] drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] group-hover:scale-[1.06] group-hover:-translate-y-1.5 transition-transform duration-[400ms] ease-out"
            />
          </div>

          {/* قرص شناور مشاهده و بررسی */}
          <div className="absolute bottom-3 inset-x-3 z-20 flex justify-center pointer-events-none">
            <div className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 text-amber-300 text-xs font-bold border border-amber-400/40 shadow-[0_4px_20px_rgba(0,0,0,0.7)] backdrop-blur-md">
              <Eye className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>مشاهده و بررسی</span>
            </div>
          </div>

          {/* بج‌ها */}
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
            {discount && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/70 text-amber-200 border border-amber-300/40 backdrop-blur-md shadow-md">
                {discount.toLocaleString('fa-IR')}٪ تخفیف
              </span>
            )}
            {isHot && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white flex items-center gap-0.5 shadow-md">
                <Flame className="w-3 h-3 fill-white" />
              </span>
            )}
          </div>

          <div className="absolute top-2.5 left-2.5 z-20">
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/70 text-emerald-300 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              <span>{product.deliveryEstimate}</span>
            </span>
          </div>
        </div>

        {/* اطلاعات محصول */}
        <div className="py-3 text-right space-y-1.5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold text-white text-[11px]">
                  {product.rating.toLocaleString('fa-IR')}
                </span>
                <span className="text-zinc-500 text-[10px]">
                  ({product.reviewsCount.toLocaleString('fa-IR')})
                </span>
              </div>
              <span className="text-zinc-500 text-[11px] font-mono">
                {product.platforms?.[0] ?? product.brand}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mt-1">
              {product.englishTitle}
            </h4>
            <p className="text-[11px] text-zinc-400 line-clamp-1">{product.shortDescription}</p>
          </div>

          {/* پلتفرم‌ها */}
          <div className="flex items-center gap-1 justify-end flex-wrap pt-1">
            {(product.platforms ?? []).slice(0, 3).map((plat) => (
              <span
                key={plat}
                className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5"
              >
                {plat}
              </span>
            ))}
          </div>
        </div>

        {/* پاورقی: قیمت و دکمه‌ی افزودن */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <button
            onClick={handleAdd}
            onMouseEnter={() => sound.hover()}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-amber-500 hover:to-rose-600 text-white flex items-center justify-center border border-white/10 transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]"
            title="افزودن با پرواز جت سوخو-۵۷ به سبد خرید"
            aria-label={`افزودن ${product.title} به سبد`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex flex-col items-end">
            {variant.compareAt && (
              <span className="text-[10px] text-zinc-500 line-through">
                {variant.compareAt.toLocaleString('fa-IR')}
              </span>
            )}
            <div className="flex items-baseline gap-1 text-white font-extrabold text-sm sm:text-base">
              <span className="text-white group-hover:text-amber-300 transition-colors font-mono">
                {variant.price.toLocaleString('fa-IR')}
              </span>
              <span className="text-[10px] text-zinc-400 font-normal">تومان</span>
            </div>
          </div>
        </div>
      </div>

      {sheetOpen && (
        <VariantSheet
          product={product}
          onClose={() => setSheetOpen(false)}
          onConfirm={(v, inputs, origin) => {
            if (origin) launch(origin);
            add(product, v, inputs);
            setSheetOpen(false);
          }}
        />
      )}
    </>
  );
}
