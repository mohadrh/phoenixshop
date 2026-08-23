import React from 'react';
import { Product } from '../types';
import { Flame, Plus, Zap, Sparkles, Check, Heart, ShieldAlert, ArrowLeft, Clock } from 'lucide-react';
import { PhoenixLogo } from './PhoenixLogo';
import { soundEngine } from '../utils/soundEngine';

interface HotDealsSectionProps {
  products: Product[];
  onAddToCart: (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenQuickView: (product: Product) => void;
}

export const HotDealsSection: React.FC<HotDealsSectionProps> = ({
  products,
  onAddToCart,
  onOpenQuickView,
}) => {
  // Filter for hot / featured games
  const hotProducts = products.filter(p => p.isHot || p.isSpecialOffer).slice(0, 4);

  return (
    <section id="hot-deals-section" className="relative z-10 py-16 md:py-24 text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Sticky Section Header Bar */}
        <div className="sticky top-20 z-30 mb-8 p-4 sm:p-5 rounded-2xl bg-[#090616]/95 border border-amber-500/30 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-600 p-0.5 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <div className="w-full h-full bg-[#0d091e] rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  پیشنهادات آتشین و تخفیف‌های ویژه ۲۴ ساعته
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                  تخفیف تا ۴۲٪
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                اکانت‌های قانونی و لایسنس‌های اورجینال با بیشترین تخفیف و تضمین تعویض مادام‌العمر
              </p>
            </div>
          </div>

          {/* Live Countdown Timer Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono mr-auto sm:mr-0">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400 text-[11px]">فرصت باقی‌مانده:</span>
            <span className="font-bold text-amber-300">۰۷:۴۲:۱۹</span>
          </div>
        </div>

        {/* Grid of 4 High-End Luxury Fiery Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hotProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-3xl p-4 bg-gradient-to-b from-[#140b24] via-[#0d0718] to-[#08040f] border border-orange-500/30 hover:border-orange-400 shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_45px_rgba(249,115,22,0.35)] transition-all duration-500 hover:-translate-y-2.5 cursor-pointer overflow-hidden hot-fire-glow"
                onClick={() => onOpenQuickView(product)}
              >
                {/* 1. Realistic Burning Flame & Magma Glow Behind the Card */}
                <div className="absolute -bottom-10 inset-x-0 h-32 bg-gradient-to-t from-orange-600/35 via-rose-600/20 to-transparent blur-2xl pointer-events-none group-hover:h-48 group-hover:from-orange-500/55 transition-all duration-700" />
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/30 via-orange-600/20 to-transparent blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                
                {/* 2. Fiery Embers Sparks Animation Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Top Row: Fiery Discount Pill & Instant Delivery Badge */}
                <div className="relative z-10 flex items-center justify-between mb-3">
                  {product.discountPercent ? (
                    <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-mono font-black text-xs shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
                      <span>{product.discountPercent}٪- تخفیف</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold text-xs">
                      پیشنهاد داغ
                    </span>
                  )}

                  <div className="flex items-center gap-1 text-[10px] text-amber-300 font-black bg-black/60 px-2.5 py-1 rounded-xl border border-amber-400/40 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                    <span>تحویل آنی</span>
                  </div>
                </div>

                {/* Product Poster Image with Fiery Aura */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3.5 bg-black/50 border border-orange-500/20 group-hover:border-orange-400/50 transition-colors">
                  <img
                    src={product.backdropImage}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />
                  {/* Fiery Gradient Overlay on Poster */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0718] via-orange-950/20 to-transparent opacity-85" />
                  
                  {/* Floating Character Cutout with Fire Backlight */}
                  {product.characterImage && (
                    <img
                      src={product.characterImage}
                      alt={product.title}
                      className="absolute bottom-0 right-2 h-36 object-contain filter drop-shadow-[0_10px_20px_rgba(249,115,22,0.6)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-112 group-hover:translate-y-[-6px]"
                    />
                  )}

                  {/* Hot Deal Flame Flare in image bottom */}
                  <div className="absolute bottom-1 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/70 text-orange-400 border border-orange-500/30 text-[10px] font-bold backdrop-blur-sm">
                    <Flame className="w-3 h-3 fill-orange-400" />
                    <span>فروش ویژه</span>
                  </div>
                </div>

                {/* Product Title & Info */}
                <div className="relative z-10 space-y-1.5 mb-4">
                  <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate" style={{ fontFamily: 'var(--font-vazir)' }}>
                    {product.title}
                  </h3>
                  <div className="text-[11px] font-mono text-zinc-400 truncate">
                    {product.englishTitle}
                  </div>
                </div>

                {/* Price & Purchase Action */}
                <div className="relative z-10 pt-3 border-t border-orange-500/20 flex items-center justify-between">
                  <div>
                    {product.originalPrice && (
                      <div className="text-[10px] text-zinc-500 line-through font-mono">
                        {product.originalPrice.toLocaleString('fa-IR')} ت
                      </div>
                    )}
                    <div className="text-sm font-black text-amber-300 font-mono">
                      {product.price.toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-zinc-400">تومان</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playCoin();
                      onAddToCart(product, e);
                    }}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 text-white hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] active:scale-95 transition-all cursor-pointer border border-amber-300/30"
                    title="افزودن با پرواز جت سوخو-57 به سبد خرید"
                    aria-label="افزودن به سبد خرید"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                {/* Bottom Fiery Light Bar */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 opacity-80 group-hover:opacity-100 group-hover:h-1.5 transition-all" />

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
