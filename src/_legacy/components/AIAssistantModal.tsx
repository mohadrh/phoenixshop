import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS_CATALOG } from '../data/products';
import { 
  Sparkles, 
  X, 
  Bot, 
  Gamepad2, 
  DollarSign, 
  Cpu, 
  ArrowLeft, 
  Check, 
  ShoppingCart,
  Flame
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onOpenQuickView,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 'results'>(1);
  const [platformChoice, setPlatformChoice] = useState<string>('PC');
  const [genreChoice, setGenreChoice] = useState<string>('action');
  const [budgetChoice, setBudgetChoice] = useState<number>(2000000);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  if (!isOpen) return null;

  const handleComputeRecommendations = () => {
    soundEngine.playFireIgnite();
    
    // Filter matching products
    const matches = PRODUCTS_CATALOG.filter((p) => {
      if (genreChoice === 'ai' && p.category === 'ai') return true;
      if (genreChoice === 'giftcard' && p.category === 'giftcard') return true;
      if (p.category === 'gaming') return true;
      return true;
    }).slice(0, 3);

    setRecommendations(matches);
    setStep('results');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl glass-card rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-[#0e0a1b]/98 text-right p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
              مشاور هوشمند گیمینگ و هوش مصنوعی ققنوس
            </h3>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Step 1: Choose Platform */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-bold">مرحله ۱ از ۳</span>
              <h4 className="text-base font-bold text-white">برای کدام دستگاه یا پلتفرم به دنبال سرویس هستید؟</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'PC', label: 'کامپیوتر / PC' },
                { id: 'PS5', label: 'پلی‌استیشن ۵' },
                { id: 'Xbox', label: 'ایکس‌باکس' },
                { id: 'Web', label: 'وب و موبایل (AI)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPlatformChoice(item.id)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    platformChoice === item.id
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm block">{item.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                setStep(2);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ff7a18] to-[#ff2e7e] text-white font-bold text-xs"
            >
              مرحله بعد: انتخاب سبک یا کاربرد
            </button>
          </div>
        )}

        {/* Step 2: Choose Genre / Interest */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-bold">مرحله ۲ از ۳</span>
              <h4 className="text-base font-bold text-white">چه نوع تجربه‌ای مد نظرتان است؟</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'action', label: 'بازی‌های اکشن و شوتر حماسی', desc: 'مثل GTA VI, Modern Warfare, Black Flag' },
                { id: 'ai', label: 'اشتراک هوش مصنوعی و کدنویسی', desc: 'مثل ChatGPT Plus, Midjourney, Cursor' },
                { id: 'giftcard', label: 'گیفت کارت و شارژ اکانت', desc: 'مثل Steam Wallet, PSN, Game Pass' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setGenreChoice(item.id)}
                  className={`p-4 rounded-2xl border text-right transition-all ${
                    genreChoice === item.id
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs font-bold block mb-1 text-white">{item.label}</span>
                  <span className="text-[10px] text-zinc-400 block">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl bg-white/10 text-zinc-300 text-xs font-semibold"
              >
                بازگشت
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setStep(3);
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#ff7a18] to-[#ff2e7e] text-white font-bold text-xs"
              >
                مرحله بعد: تعیین سقف بودجه
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Budget Slider */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-bold">مرحله ۳ از ۳</span>
              <h4 className="text-base font-bold text-white">سقف بودجه مد نظرتان چقدر است؟</h4>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span>تا سقف:</span>
                <span className="text-amber-400 font-bold text-sm">
                  {budgetChoice.toLocaleString('fa-IR')} تومان
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={5000000}
                step={200000}
                value={budgetChoice}
                onChange={(e) => setBudgetChoice(Number(e.target.value))}
                className="w-full accent-[#ff7a18] cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-2xl bg-white/10 text-zinc-300 text-xs font-semibold"
              >
                بازگشت
              </button>
              <button
                onClick={handleComputeRecommendations}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#ff7a18] via-[#ff2e7e] to-[#8a2be2] text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>تحلیل هوشمند و نمایش بهترین گزینه‌ها</span>
              </button>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {step === 'results' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-amber-400 hover:underline"
              >
                تنظیم مجدد فیلترها
              </button>
              <h4 className="text-sm font-black text-white">بهترین پیشنهادات هوشمند ققنوس شاپ:</h4>
            </div>

            <div className="space-y-3">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl p-3.5 border border-white/10 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-colors"
                >
                  <img
                    src={item.backdropImage}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs sm:text-sm font-bold text-white truncate" style={{ fontFamily: 'var(--font-vazir)' }}>
                      {item.title}
                    </h5>
                    <span className="text-[10px] text-zinc-400 block truncate">{item.accountType}</span>
                    <span className="text-xs font-bold text-amber-400">
                      {item.price.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onOpenQuickView(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] text-zinc-200"
                    >
                      بررسی
                    </button>
                    <button
                      onClick={() => {
                        soundEngine.playFireIgnite();
                        onAddToCart(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[11px] font-bold shadow-sm"
                    >
                      خرید آنی
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
