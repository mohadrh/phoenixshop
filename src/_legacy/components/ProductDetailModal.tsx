import React, { useState } from 'react';
import { Product, Platform } from '../types';
import { 
  X, 
  ShoppingCart, 
  ShieldCheck, 
  Zap, 
  Star, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Flame, 
  Sparkles,
  Clock,
  Key,
  Globe,
  Radio
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedAccountType?: string, selectedPlatform?: Platform, e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  // Category-specific options
  const [selectedCapacity, setSelectedCapacity] = useState<string>('ظرفیت ۲ کامل (آنلاین و آفلاین)');
  const [selectedDuration, setSelectedDuration] = useState<string>('اشتراک ۱ ماهه');
  const [selectedPlanType, setSelectedPlanType] = useState<string>('اکانت قانونی روی ایمیل شما');
  const [selectedGiftAmount, setSelectedGiftAmount] = useState<string>('$20 دلار');
  const [selectedRegion, setSelectedRegion] = useState<string>('گلوبال (تمام ریجن‌ها)');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | undefined>(product?.platforms[0]);
  const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'guide'>('info');

  if (!product) return null;

  // Calculate dynamic price based on options
  const basePrice = product.price;
  let dynamicPrice = basePrice;
  let selectedSummary = '';

  if (product.category === 'gaming') {
    if (selectedCapacity.includes('ظرفیت ۱')) {
      dynamicPrice = Math.round(basePrice * 0.45);
    } else if (selectedCapacity.includes('ظرفیت ۳')) {
      dynamicPrice = Math.round(basePrice * 0.75);
    } else {
      dynamicPrice = basePrice;
    }
    selectedSummary = `${selectedCapacity} • ${selectedRegion} • ${selectedPlatform || 'PS5'}`;
  } else if (product.category === 'ai' || product.category === 'currency') {
    if (selectedDuration.includes('۳ ماهه')) {
      dynamicPrice = Math.round(basePrice * 2.7);
    } else if (selectedDuration.includes('۶ ماهه')) {
      dynamicPrice = Math.round(basePrice * 5.1);
    } else if (selectedDuration.includes('۱ ساله')) {
      dynamicPrice = Math.round(basePrice * 9.2);
    } else {
      dynamicPrice = basePrice;
    }
    selectedSummary = `${selectedDuration} • ${selectedPlanType}`;
  } else if (product.category === 'giftcard') {
    if (selectedGiftAmount.includes('$50')) {
      dynamicPrice = Math.round(basePrice * 2.5);
    } else if (selectedGiftAmount.includes('$100')) {
      dynamicPrice = Math.round(basePrice * 5.0);
    } else if (selectedGiftAmount.includes('$10')) {
      dynamicPrice = Math.round(basePrice * 0.5);
    } else {
      dynamicPrice = basePrice;
    }
    selectedSummary = `${selectedGiftAmount} • ${selectedRegion}`;
  }

  const capacityOptions = [
    { id: 'cap2', name: 'ظرفیت ۲ کامل (آنلاین و آفلاین)', tag: 'محبوب‌ترین', desc: 'امکان بازی روی یوزر شخصی شما بدون محدودیت و با تمام اچیومنت‌ها' },
    { id: 'cap3', name: 'ظرفیت ۳ آنلاین', tag: 'اقتصادی', desc: 'امکان بازی روی یوزر ارسالی در حالت آنلاین با قابلیت مولتی‌پلیر کامل' },
    { id: 'cap1', name: 'ظرفیت ۱ آفلاین', tag: 'ارزان‌ترین', desc: 'فقط برای بازی بخش داستانی و سینگل‌پلیر در حالت آفلاین' },
  ];

  const durationOptions = [
    { id: 'dur1', label: 'اشتراک ۱ ماهه', discount: 'پایه' },
    { id: 'dur3', label: 'اشتراک ۳ ماهه', discount: '۱۰٪ تخفیف' },
    { id: 'dur6', label: 'اشتراک ۶ ماهه', discount: '۱۵٪ تخفیف' },
    { id: 'dur12', label: 'اشتراک ۱ ساله', discount: '۲۵٪ ویژه' },
  ];

  const planTypeOptions = [
    'اکانت قانونی روی ایمیل شما (اختصاصی)',
    'لایسنس کد فعال‌سازی اورجینال (Auto-Key)',
    'اکانت آماده تحویل زیر ۳۰ ثانیه',
  ];

  const giftAmounts = ['$10 دلار', '$20 دلار', '$50 دلار', '$100 دلار'];
  const regions = ['گلوبال (تمام ریجن‌ها)', 'ریجن آمریکا (US)', 'ریجن ترکیه (TR)', 'ریجن اوکراین (UA)'];

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const customizedProduct: Product = {
      ...product,
      price: dynamicPrice,
      accountType: selectedSummary || product.accountType,
    };
    onAddToCart(customizedProduct, selectedSummary, selectedPlatform, e);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 lg:p-8 flex items-center justify-center select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl glass-card rounded-3xl overflow-hidden border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-[#0c0919] text-right my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick(400, 0.05);
            onClose();
          }}
          className="absolute top-4 left-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner Area */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-gradient-to-t from-[#0c0919] to-transparent shrink-0">
          <img
            src={product.backdropImage}
            alt={product.title}
            className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0919] via-[#0c0919]/50 to-transparent" />

          {/* Overlapping Character Cutout in Modal Banner */}
          <div className="absolute bottom-0 right-6 z-10 h-full flex items-end">
            <img
              src={product.characterImage || product.backdropImage}
              alt={product.title}
              className="max-h-[92%] w-auto object-contain filter contrast-[1.1] drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
            />
          </div>

          {/* Title and Badges */}
          <div className="absolute bottom-5 left-6 right-36 sm:right-64 z-20 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {product.deliveryTime}
              </span>
              {product.isHot && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-orange-500 text-white flex items-center gap-1 shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>داغ‌ترین پیشنهاد</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
              {product.title}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              {product.englishTitle}
            </p>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-end gap-2 border-b border-white/10 px-6 pt-2 bg-black/30 shrink-0">
          <button
            onClick={() => {
              soundEngine.playClick(600, 0.04);
              setActiveTab('info');
            }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'info' ? 'border-amber-500 text-amber-300' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            شخصی‌سازی پلن و ظرفیت
          </button>
          {product.systemRequirements && (
            <button
              onClick={() => {
                soundEngine.playClick(650, 0.04);
                setActiveTab('specs');
              }}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'specs' ? 'border-amber-500 text-amber-300' : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              سیستم مورد نیاز
            </button>
          )}
          <button
            onClick={() => {
              soundEngine.playClick(700, 0.04);
              setActiveTab('guide');
            }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'guide' ? 'border-amber-500 text-amber-300' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            گارانتی و فعال‌سازی
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {activeTab === 'info' && (
            <div className="space-y-5">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {product.description}
              </p>

              {/* DYNAMIC CATEGORY OPTIONS */}
              {/* 1. GAMING SPECIFIC: CAPACITY & REGION */}
              {product.category === 'gaming' && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-300 block">انتخاب نوع ظرفیت لایسنس:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {capacityOptions.map((cap) => (
                        <div
                          key={cap.id}
                          onClick={() => {
                            soundEngine.playClick(650, 0.04);
                            setSelectedCapacity(cap.name);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            selectedCapacity === cap.name
                              ? 'bg-amber-500/15 border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                              : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className="text-white">{cap.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-amber-300 font-normal">
                              {cap.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-tight">
                            {cap.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Region selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ریجن فعال‌سازی:</span>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {regions.map((reg) => (
                        <button
                          key={reg}
                          onClick={() => setSelectedRegion(reg)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            selectedRegion === reg
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                              : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {reg}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. AI SUBSCRIPTION SPECIFIC: DURATION & PLAN TYPE */}
              {(product.category === 'ai' || product.category === 'currency') && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-300 block">مدت زمان اشتراک:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {durationOptions.map((dur) => (
                        <button
                          key={dur.id}
                          onClick={() => {
                            soundEngine.playClick(650, 0.04);
                            setSelectedDuration(dur.label);
                          }}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            selectedDuration === dur.label
                              ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                              : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-bold">{dur.label}</div>
                          <span className="text-[10px] text-purple-300">{dur.discount}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-300 block">نوع تحویل و اتصال اکانت:</label>
                    <div className="space-y-2">
                      {planTypeOptions.map((pt, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedPlanType(pt)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            selectedPlanType === pt
                              ? 'bg-emerald-500/15 border-emerald-500/60 text-white'
                              : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span>{pt}</span>
                          {selectedPlanType === pt && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. GIFT CARD SPECIFIC: AMOUNT */}
              {product.category === 'giftcard' && (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-zinc-300 block">مبلغ گیفت کارت:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {giftAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setSelectedGiftAmount(amt)}
                        className={`p-3 rounded-xl border text-center font-mono font-bold text-sm transition-all ${
                          selectedGiftAmount === amt
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                            : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Platform Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-zinc-300 block">پلتفرم‌های پشتیبانی شده:</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.platforms.map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setSelectedPlatform(plat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedPlatform === plat
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                          : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-zinc-300">ویژگی‌های تضمینی ققنوس شاپ:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && product.systemRequirements && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">مشخصات پیشنهادی سیستم (PC Specs):</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="glass-card p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                  <Monitor className="w-6 h-6 text-amber-400" />
                  <div>
                    <span className="text-[11px] text-zinc-400 block">سیستم عامل (OS):</span>
                    <span className="text-xs font-bold text-white">{product.systemRequirements.os}</span>
                  </div>
                </div>
                <div className="glass-card p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-cyan-400" />
                  <div>
                    <span className="text-[11px] text-zinc-400 block">کارت گرافیک (GPU):</span>
                    <span className="text-xs font-bold text-white">{product.systemRequirements.gpu}</span>
                  </div>
                </div>
                <div className="glass-card p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-rose-400" />
                  <div>
                    <span className="text-[11px] text-zinc-400 block">حافظه رم (RAM):</span>
                    <span className="text-xs font-bold text-white">{product.systemRequirements.ram}</span>
                  </div>
                </div>
                <div className="glass-card p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                  <HardDrive className="w-6 h-6 text-emerald-400" />
                  <div>
                    <span className="text-[11px] text-zinc-400 block">فضای دیسک (Storage):</span>
                    <span className="text-xs font-bold text-white">{product.systemRequirements.storage}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-amber-300 mb-1">تحویل و فعال‌سازی فوری</h5>
                  <p className="text-[11px] text-zinc-300">
                    بلافاصله پس از پرداخت در درگاه بانکی، نام کاربری، پسورد اختصاصی یا کد فعال‌سازی در پنل کاربری شما و از طریق پیامک ارسال می‌شود.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-emerald-300 mb-1">گارانتی تعویض مادام‌العمر ققنوس</h5>
                  <p className="text-[11px] text-zinc-300">
                    تمام اکانت‌های ققنوس شاپ از منابع رسمی و با ویزاکارت‌های معتبر خریداری شده‌اند و دارای گارانتی تعویض و عدم قفل شدن می‌باشند.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Bar */}
        <div className="p-5 border-t border-white/10 bg-black/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          <button
            onClick={handleAddToCartClick}
            onMouseEnter={() => soundEngine.playHover()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-extrabold text-sm shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>افزودن به سبد خرید (پرواز Su-57 🚀)</span>
          </button>

          <div className="flex items-baseline gap-2">
            <span className="text-xs text-zinc-400">قیمت بر اساس تنظیمات انتخابی:</span>
            <span className="text-2xl font-black text-amber-400 font-mono" style={{ fontFamily: 'var(--font-vazir)' }}>
              {dynamicPrice.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs text-zinc-400">تومان</span>
          </div>
        </div>
      </div>
    </div>
  );
};
