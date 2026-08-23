import React, { useState } from 'react';
import { Product } from '../types';
import { 
  ShieldCheck, 
  Zap, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingCart, 
  Flame, 
  Cpu, 
  HelpCircle, 
  MessageSquare, 
  Check, 
  Share2, 
  Heart,
  ExternalLink,
  Lock,
  Tag
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => void;
  onSelectProduct: (product: Product) => void;
  onBackToShop: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onAddToCart,
  onSelectProduct,
  onBackToShop,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<'1month' | '3months' | '1year'>('1month');
  const [selectedRegion, setSelectedRegion] = useState<string>('گلوبال (Global)');
  const [activeTab, setActiveTab] = useState<'features' | 'activation' | 'specs' | 'reviews'>('features');
  const [isCopied, setIsCopied] = useState(false);

  // Price multiplier according to duration
  const priceMultiplier = selectedDuration === '1month' ? 1 : selectedDuration === '3months' ? 2.8 : 9.5;
  const currentPrice = Math.round(product.price * priceMultiplier);
  const currentOriginalPrice = product.originalPrice ? Math.round(product.originalPrice * priceMultiplier) : undefined;

  const handleShare = () => {
    soundEngine.playClick(600, 0.04);
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto select-none">
      
      {/* Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleShare}
          className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-zinc-300 flex items-center gap-1.5 border border-white/10"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isCopied ? 'لینک کپی شد!' : 'اشتراک‌گذاری'}</span>
        </button>

        <button
          onClick={onBackToShop}
          className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>بازگشت به لیست محصولات</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Showcase Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* RIGHT (in RTL): Product Info & Buying Config Box (Col 1-7) */}
        <div className="lg:col-span-7 space-y-6 text-right order-2 lg:order-1">
          
          {/* Badges */}
          <div className="flex items-center gap-2 justify-end flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{product.deliveryTime}</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              {product.accountType}
            </span>
            {product.discountPercent && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm">
                {product.discountPercent}٪ تخفیف ویژه
              </span>
            )}
          </div>

          {/* Titles */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight" style={{ fontFamily: 'var(--font-vazir)' }}>
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-400 uppercase mt-1 font-mono">
              {product.englishTitle}
            </p>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-4 justify-end text-xs text-zinc-300 pb-2 border-b border-white/10">
            <span className="text-zinc-500">({product.reviewsCount} نظر ثبت شده خریداران تایید شده)</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <span>{product.rating}</span>
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed text-justify sm:text-right">
            {product.description}
          </p>

          {/* Configuration Options (Duration & Region) */}
          <div className="p-5 rounded-3xl bg-[#0e0a1d]/90 border border-white/10 space-y-4">
            
            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">انتخاب مدت زمان اشتراک / لایسنس:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '1month', label: '۱ ماهه' },
                  { id: '3months', label: '۳ ماهه (۵٪ تخفیف)' },
                  { id: '1year', label: '۱ ساله (۲۰٪ تخفیف)' },
                ].map((dur) => (
                  <button
                    key={dur.id}
                    onClick={() => {
                      soundEngine.playClick(700, 0.04);
                      setSelectedDuration(dur.id as any);
                    }}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border ${
                      selectedDuration === dur.id
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                        : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">انتخاب ریجن اکانت:</label>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {['گلوبال (Global)', 'ترکیه (TR)', 'آمریکا (US)', 'امارات (UAE)'].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => {
                      soundEngine.playClick(650, 0.04);
                      setSelectedRegion(reg);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedRegion === reg
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Calculation & Su-57 Takeoff Buy Button */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Buy Button */}
              <button
                onClick={(e) => {
                  onAddToCart(
                    {
                      ...product,
                      price: currentPrice,
                      originalPrice: currentOriginalPrice,
                    },
                    e
                  );
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:shadow-[0_0_40px_rgba(245,158,11,0.9)] hover:scale-105 active:scale-95 transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>خرید با پرواز سوخو-57 🚀</span>
              </button>

              {/* Price Details */}
              <div className="flex flex-col items-end">
                {currentOriginalPrice && (
                  <span className="text-xs text-zinc-500 line-through">
                    {currentOriginalPrice.toLocaleString('fa-IR')}
                  </span>
                )}
                <div className="flex items-baseline gap-1.5 text-white font-extrabold text-2xl">
                  <span className="text-amber-400 font-mono">
                    {currentPrice.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-xs text-zinc-400 font-bold">تومان</span>
                </div>
              </div>
            </div>

          </div>

          {/* Warranty & Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-right">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">گارانتی ۱۰۰٪</span>
                <span className="text-[10px] text-zinc-400">ضمانت تعویض مادام‌العمر</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-right">
              <Zap className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">تحویل آنی ۲ دقیقه‌ای</span>
                <span className="text-[10px] text-zinc-400">ارسال خودکار کد با SMS</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-right">
              <Lock className="w-6 h-6 text-purple-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">پرداخت امن شاپرک</span>
                <span className="text-[10px] text-zinc-400">تایید شده با نماد اعتماد</span>
              </div>
            </div>
          </div>

        </div>

        {/* LEFT (in RTL): Product Media Banner (Col 8-12) */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#1b1430] to-[#090614] border border-white/15 p-6 flex flex-col items-center justify-center shadow-2xl h-[360px] sm:h-[480px]">
            <img
              src={product.backdropImage}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 max-h-full flex items-center justify-center">
              <img
                src={product.characterImage || product.backdropImage}
                alt={product.title}
                className="max-h-[340px] w-auto object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
              />
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED INFORMATION TABS */}
      <div className="rounded-3xl bg-[#0e0a1d]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl mb-12">
        
        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto no-scrollbar justify-end">
          {[
            { id: 'features', label: 'ویژگی‌ها و امکانات' },
            { id: 'activation', label: 'راهنمای فعال‌سازی تصویری' },
            { id: 'specs', label: 'مشخصات و سازگاری' },
            { id: 'reviews', label: `نظرات (${product.reviewsCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick(650, 0.04);
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="text-right">
          {activeTab === 'features' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white">امکانات و مزایای برجسته لایسنس:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-2">
                    <span className="text-xs text-zinc-200">{feat}</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activation' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white">مراحل فعال‌سازی در ۳ گام ساده:</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-amber-300 block">گام اول: دریافت کد لایسنس</span>
                    <span className="text-xs text-zinc-400">بلافاصله پس از پرداخت کد پیامک می‌شود و در پنل کاربری قابل مشاهده است.</span>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">۱</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-amber-300 block">گام دوم: وارد کردن در پنل رسمی</span>
                    <span className="text-xs text-zinc-400">کد دریافتی را در بخش Redeem یا Redeem Code حساب خود وارد کنید.</span>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">۲</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-amber-300 block">گام سوم: لذت بردن از دسترسی نامحدود</span>
                    <span className="text-xs text-zinc-400">اشتراک شما با گارانتی مادام‌العمر ققنوس شاپ بلافاصله فعال می‌شود.</span>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">۳</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white">سازگاری و پلتفرم‌های پشتیبانی شده:</h3>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {product.platforms.map((p) => (
                  <span key={p} className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-white">
                    {p}
                  </span>
                ))}
              </div>
              {product.systemRequirements && (
                <div className="mt-4 p-4 rounded-2xl bg-black/50 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">سیستم عامل</span>
                    <span className="text-xs font-bold text-zinc-200">{product.systemRequirements.os}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">کارت گرافیک</span>
                    <span className="text-xs font-bold text-zinc-200">{product.systemRequirements.gpu}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">رم (RAM)</span>
                    <span className="text-xs font-bold text-zinc-200">{product.systemRequirements.ram}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">فضای دیسک</span>
                    <span className="text-xs font-bold text-zinc-200">{product.systemRequirements.storage}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white">تجربه خریداران تایید شده:</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-right">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold">★★★★★</span>
                    <span className="font-bold text-white">امیرحسین رضایی (خریدار تایید شده)</span>
                  </div>
                  <p className="text-xs text-zinc-300">تحویل واقعاً زیر ۱ دقیقه بود و روی ایمیل شخصی خودم بدون هیچ مشکلی فعال شد. ممنون از ققنوس شاپ.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-right">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold">★★★★★</span>
                    <span className="font-bold text-white">سارا مقدم (خریدار تایید شده)</span>
                  </div>
                  <p className="text-xs text-zinc-300">پشتیبانی تلگرام و تیکت سایت خیلی سریع پاسخ دادن. کیفیت سرویس عالیه.</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* RELATED PRODUCTS CAROUSEL */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-white text-right">محصولات مشابه و پیشنهادی</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={onAddToCart}
                onOpenQuickView={() => onSelectProduct(p)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
