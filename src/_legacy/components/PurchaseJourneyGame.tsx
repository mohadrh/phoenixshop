import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowLeft, 
  Trophy, 
  Star, 
  Flame, 
  Check, 
  Gift, 
  Coins, 
  Crown,
  Lock,
  Unlock,
  Copy,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface PurchaseJourneyGameProps {
  onOpenCart?: () => void;
  onApplyDiscountCode?: (code: string) => void;
}

interface LoyaltyStage {
  level: number;
  name: string;
  enName: string;
  badge: string;
  icon: string;
  minSpend: number;
  maxSpend: number;
  cashbackPercent: number;
  discountCode: string;
  discountPercent: number;
  deliverySpeed: string;
  color: string;
  gradient: string;
  borderColor: string;
  perks: string[];
  exclusiveBonus: string;
}

const LOYALTY_STAGES: LoyaltyStage[] = [
  {
    level: 1,
    name: 'مرحله ۱: سطح برنزی (شروع پرواز)',
    enName: 'Bronze Pilot',
    badge: 'خرید تا ۱ میلیون',
    icon: '🥉',
    minSpend: 0,
    maxSpend: 1000000,
    cashbackPercent: 0,
    discountCode: 'PHOENIX20',
    discountPercent: 20,
    deliverySpeed: 'زیر ۲ دقیقه',
    color: '#f59e0b',
    gradient: 'from-amber-600 to-orange-700',
    borderColor: 'border-amber-600/40',
    perks: [
      'صدور آنی کد فعال‌سازی یا لایسنس توسط ربات هوشمند',
      'پشتیبانی تیکتی و آنلاین ۲۴/۷ در تمام روزهای هفته',
      'گارانتی تعویض و بازگشت وجه ۱۰۰٪ در صورت هرگونه مشکل',
      'کوپن تخفیف خوش‌آمدگویی ۲۰ هزار تومانی (PHOENIX20)',
    ],
    exclusiveBonus: 'دسترسی به تمام بازی‌ها و سرویس‌های هوش مصنوعی با پایین‌ترین کارمزد',
  },
  {
    level: 2,
    name: 'مرحله ۲: سطح نقره‌ای (خریدار وفادار)',
    enName: 'Silver Explorer',
    badge: 'خرید ۱ تا ۳ میلیون',
    icon: '🥈',
    minSpend: 1000000,
    maxSpend: 3000000,
    cashbackPercent: 5,
    discountCode: 'PHOENIX-VIP5',
    discountPercent: 5,
    deliverySpeed: 'زیر ۱ دقیقه',
    color: '#94a3b8',
    gradient: 'from-slate-400 to-zinc-600',
    borderColor: 'border-slate-400/40',
    perks: [
      'دریافت ۵٪ کش‌بک نقدی مستقیم به کیف پول روی تمام سفارش‌ها',
      'کد تخفیف اختصاصی ۵٪ دائمی برای تمام خریدهای بعدی (PHOENIX-VIP5)',
      'اولویت بالا در صف پردازش سرور و ارسال لایسنس زیر ۱ دقیقه',
      'عضویت در کانال اختصاصی تخفیف‌های ویژه هفتگی ققنوس',
    ],
    exclusiveBonus: 'کسب ۵٪ اعتبار هدیه نقدی در کیف پول برای هر خرید',
  },
  {
    level: 3,
    name: 'مرحله ۳: سطح طلایی (پرو گیمر و VIP)',
    enName: 'Gold Pro Gamer',
    badge: 'خرید ۳ تا ۷ میلیون',
    icon: '🥇',
    minSpend: 3000000,
    maxSpend: 7000000,
    cashbackPercent: 10,
    discountCode: 'VIP10',
    discountPercent: 10,
    deliverySpeed: 'زیر ۴۵ ثانیه',
    color: '#eab308',
    gradient: 'from-yellow-400 to-amber-600',
    borderColor: 'border-yellow-400/50',
    perks: [
      '۱۰٪ کش‌بک نقدی فوق‌العاده روی هر سفارش به کیف پول',
      'پشتیبانی VIP مستقیم در تلگرام و واتساپ با اولویت بدون معطلی',
      'اکانت‌های کاملاً اختصاصی پرایوت با تضمین مادام‌العمر عدم قطعی',
      'دریافت لایسنس‌های هدیه ماهانه و کوپن ۱۰٪ تخفیف (VIP10)',
    ],
    exclusiveBonus: 'پشتیبانی مستقیم VIP در تلگرام و بازگشت ۱۰٪ مبلغ خرید',
  },
  {
    level: 4,
    name: 'مرحله ۴: الماس ققنوس (Phoenix Elite)',
    enName: 'Phoenix Diamond Elite',
    badge: 'خرید بالای ۷ میلیون',
    icon: '💎',
    minSpend: 7000000,
    maxSpend: 15000000,
    cashbackPercent: 15,
    discountCode: 'PHOENIX-DIAMOND',
    discountPercent: 15,
    deliverySpeed: 'تحویل اختصاصی زیر ۲۰ ثانیه',
    color: '#38bdf8',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    borderColor: 'border-cyan-400/60',
    perks: [
      '۱۵٪ تخفیف دائمی و مادام‌العمر روی تمام محصولات بدون سقف',
      'تحویل اختصاصی فوق‌سریع کمتر از ۲۰ ثانیه با سرور اختصاصی',
      'مدیر حساب اختصاصی (Account Manager) و پشتیبانی تلفنی مستقیم',
      'دسترسی زودهنگام (Early Access) به پیش‌فروش بازی‌ها و هوش مصنوعی',
    ],
    exclusiveBonus: 'حداکثر تخفیف مادام‌العمر ۱۵٪ + مدیر حساب و پشتیبانی اختصاصی',
  },
];

export const PurchaseJourneyGame: React.FC<PurchaseJourneyGameProps> = ({
  onOpenCart,
  onApplyDiscountCode,
}) => {
  const [currentSpend, setCurrentSpend] = useState<number>(2400000);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Determine active stage based on simulated spend amount
  const getStageForSpend = (spend: number): LoyaltyStage => {
    if (spend >= 7000000) return LOYALTY_STAGES[3];
    if (spend >= 3000000) return LOYALTY_STAGES[2];
    if (spend >= 1000000) return LOYALTY_STAGES[1];
    return LOYALTY_STAGES[0];
  };

  const activeStage = getStageForSpend(currentSpend);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const oldStage = getStageForSpend(currentSpend);
    const newStage = getStageForSpend(val);
    
    if (newStage.level !== oldStage.level) {
      soundEngine.playLevelUp();
    } else {
      soundEngine.playClick(600, 0.02);
    }
    setCurrentSpend(val);
  };

  const handleSelectStageDirect = (stage: LoyaltyStage) => {
    soundEngine.playLevelUp();
    setCurrentSpend(stage.minSpend === 0 ? 500000 : stage.minSpend + 500000);
  };

  const handleCopyCode = (code: string) => {
    soundEngine.playSuccess();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    if (onApplyDiscountCode) {
      onApplyDiscountCode(code);
    }
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // Next level progress calculation
  const nextStage = LOYALTY_STAGES.find(s => s.level === activeStage.level + 1);
  const progressToNext = nextStage 
    ? Math.min(100, Math.max(0, ((currentSpend - activeStage.minSpend) / (nextStage.minSpend - activeStage.minSpend)) * 100))
    : 100;

  const cashbackAmount = Math.round((currentSpend * activeStage.cashbackPercent) / 100);

  return (
    <section id="loyalty-game-section" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-zinc-100">
      
      {/* Title & Introduction */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>باشگاه ۴ مرحله‌ای خریداران و وفاداری ققنوس</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-vazir)' }}>
          با هر خرید لول‌آپ شو و راحتی‌های VIP رو آنلاک کن!
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          شبیه‌ساز هوشمند ارتقای سطح: مشخص کن چقدر خرید می‌کنی تا ببینی وارد کدوم مرحله میشی و چه تخفیف‌ها، کش‌بک‌های نقدی و پشتیبانی‌های پرسرعتی بهت تعلق می‌گیره.
        </p>
      </div>

      {/* 4 Interactive Level Stage Nodes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {LOYALTY_STAGES.map((stage) => {
          const isCurrent = activeStage.level === stage.level;
          const isPassed = activeStage.level > stage.level;

          return (
            <button
              key={stage.level}
              onClick={() => handleSelectStageDirect(stage)}
              className={`relative text-right p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-b from-[#1c1236] via-[#100a20] to-[#080512] border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-103 ring-2 ring-amber-400/50'
                  : isPassed
                  ? 'bg-[#0d091a]/90 border-emerald-500/30 hover:border-emerald-500/60'
                  : 'bg-[#080510]/80 border-white/10 hover:border-white/20 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Top Row: Icon & Status Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stage.icon}</span>
                {isCurrent ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black animate-pulse">
                    سطح فعلی شما
                  </span>
                ) : isPassed ? (
                  <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>آنلاک شده</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-zinc-500 text-[10px] font-medium">
                    <Lock className="w-3 h-3" />
                    <span>قفل</span>
                  </span>
                )}
              </div>

              {/* Stage Names */}
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white mb-0.5 line-clamp-1">
                  {stage.name.split(':')[1] || stage.name}
                </h4>
                <span className="text-[10px] font-mono text-zinc-400 block mb-2">
                  {stage.badge}
                </span>
              </div>

              {/* Reward Highlights */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-bold">
                <span className="text-zinc-300">کش‌بک:</span>
                <span className={`font-mono ${stage.cashbackPercent > 0 ? 'text-amber-400' : 'text-zinc-500'}`}>
                  {stage.cashbackPercent > 0 ? `${stage.cashbackPercent}٪ نقدی` : 'عضویت پایه'}
                </span>
              </div>

              {/* Active bottom border glow */}
              {isCurrent && (
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Playground HUD Box */}
      <div className="rounded-3xl bg-[#0c081c]/95 border border-amber-500/30 p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-6">
        
        {/* Spend Simulator Slider */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#140e29] border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>شبیه‌ساز مجموع خرید شما:</span>
            </label>
            <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-black text-amber-300 bg-black/40 px-3 py-1 rounded-xl border border-white/10">
              <span>{currentSpend.toLocaleString('fa-IR')}</span>
              <span className="text-xs text-zinc-400 font-sans font-normal">تومان</span>
            </div>
          </div>

          <input
            type="range"
            min={200000}
            max={10000000}
            step={200000}
            value={currentSpend}
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-black/50 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
            <span>۲۰۰ هزار تومان</span>
            <span>۳ میلیون (نقره‌ای)</span>
            <span>۷ میلیون (طلایی)</span>
            <span>۱۰ میلیون (الماس)</span>
          </div>
        </div>

        {/* Active Stage Details & Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
          
          {/* Left Column: Stage Status & Cashback Box */}
          <div className="md:col-span-1 p-5 rounded-2xl bg-gradient-to-b from-[#191033] to-[#0b0717] border border-amber-500/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase mb-1">
                <Crown className="w-4 h-4" />
                <span>وضعیت اکانت شما</span>
              </div>
              <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                <span>{activeStage.icon}</span>
                <span>{activeStage.enName}</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                سرعت تحویل لایسنس: <strong className="text-emerald-400">{activeStage.deliverySpeed}</strong>
              </p>
            </div>

            {/* Cashback Calculation Box */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[11px] text-zinc-400 block">پاداش و کش‌بک نقدی این سطح:</span>
              <div className="flex items-baseline gap-1 text-emerald-400 font-mono font-black text-lg">
                <span>{cashbackAmount > 0 ? cashbackAmount.toLocaleString('fa-IR') : '۰'}</span>
                <span className="text-xs font-sans text-zinc-400">تومان به کیف پول</span>
              </div>
              <span className="text-[10px] text-zinc-500 block">
                {activeStage.cashbackPercent > 0 ? `(معادل ${activeStage.cashbackPercent}٪ از هر خرید)` : 'خرید بیشتر برای فعال‌سازی کش‌بک'}
              </span>
            </div>

            {/* Claim / Copy Coupon Code */}
            <div className="space-y-2">
              <span className="text-[11px] text-zinc-300 font-bold block">کد تخفیف آنلاک شده شما:</span>
              <button
                onClick={() => handleCopyCode(activeStage.discountCode)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-mono font-bold text-xs flex items-center justify-between shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode === activeStage.discountCode ? 'کپی و اعمال شد!' : 'کپی و اعمال کوپن'}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-black/30 text-amber-200">
                  {activeStage.discountCode}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Perks and Ease of Access List */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-[#120c24] border border-white/10 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>امکانات، راحتی‌ها و پاداش‌های این مرحله:</span>
              </h4>

              <div className="space-y-2.5">
                {activeStage.perks.map((perk, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Level Progression Banner */}
            {nextStage ? (
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-300">
                    فاصله تا مرحله بعد ({nextStage.name.split(':')[1]}):
                  </span>
                  <span className="text-amber-400 font-mono">
                    {(nextStage.minSpend - currentSpend > 0 ? nextStage.minSpend - currentSpend : 0).toLocaleString('fa-IR')} تومان خرید دیگر
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2">
                <Crown className="w-4 h-4 text-cyan-400" />
                <span>تبریک! شما در بالاترین سطح باشگاه الماس ققنوس قرار دارید و از تمامی امکانات برخوردارید.</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </section>
  );
};
