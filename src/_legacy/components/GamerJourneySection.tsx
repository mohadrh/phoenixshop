import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowLeft, 
  Trophy, 
  Play, 
  Pause, 
  RotateCcw,
  Star,
  Flame,
  Check,
  Gift,
  Coins,
  KeyRound,
  Shield,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { MarioGameCharacter } from './MarioGameCharacter';

interface JourneyStep {
  id: number;
  stageNumber: string;
  stageName: string;
  badge: string;
  themeColor: string;
  glowColor: string;
  itemType: 'mushroom' | 'key' | 'block' | 'star';
  itemName: string;
  title: string;
  subtitle: string;
  description: string;
  xpReward: number;
  timeEstimate: string;
  interactiveOptions: {
    label: string;
    detail: string;
  }[];
  instantStatus: {
    tag: string;
    msg: string;
    sub: string;
  };
}

const JOURNEY_STAGES: JourneyStep[] = [
  {
    id: 1,
    stageNumber: 'STAGE 1-1',
    stageName: 'مرحله ۱: انتخاب سرویس دلخواه',
    badge: 'POWER-UP 🍄',
    themeColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    itemType: 'mushroom',
    itemName: 'معجون قدرت و انتخاب سرویس',
    title: 'جستجو و انتخاب سرویس یا بازی مدنظر',
    subtitle: 'شخصی‌سازی آنی ریجن، نوع لایسنس و مدت زمان اشتراک',
    description: 'از هوش مصنوعی ChatGPT و اکانت قانونی استیم، اسپاتیفای و پلی‌استیشن تا جدیدترین بازی‌ها؛ در ۳ ثانیه بهترین قیمت بازار ایران را انتخاب کن.',
    xpReward: 250,
    timeEstimate: '۳۰ ثانیه',
    interactiveOptions: [
      { label: 'اشتراک ChatGPT Plus (GPT-4o)', detail: 'فعال‌سازی ۱ ماهه قانونی روی ایمیل' },
      { label: 'اکانت بازی GTA VI ظرفیت ۲', detail: 'گارانتی مادام‌العمر با قابلیت آنلاین' },
      { label: 'اسپاتیفای ۱ ساله قانونی Family', detail: 'بدون قطعی با ریجن اختصاصی' },
      { label: 'گیفت کارت ۵۰ دلاری استیم گلوبال', detail: 'تحویل کد ارجینال بدون کارمزد' },
    ],
    instantStatus: {
      tag: 'انتخاب تایید شد 🎯',
      msg: 'محصول با ضمانت ۱۰۰٪ قانونی در صف پرداخت قرار گرفت.',
      sub: 'پایین‌ترین کارمزد و تحویل سریع ققنوس شاپ',
    },
  },
  {
    id: 2,
    stageNumber: 'STAGE 1-2',
    stageName: 'مرحله ۲: پرداخت امن و سریع',
    badge: 'CHECKPOINT 🪙',
    themeColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    itemType: 'key',
    itemName: 'کلید طلایی تراکنش امن',
    title: 'تایید و پرداخت با منعطف‌ترین متدها',
    subtitle: 'درگاه شاپرک • کارت‌به‌کارت هوشمند • تتر و کریپتو USDT',
    description: 'امکان پرداخت بدون دردسر با ۳ شیوه معتبر: درگاه مستقیم بانکی با نماد اعتماد، کارت به کارت با ثبت خودکار فیش، یا تتر بدون کارمزد.',
    xpReward: 500,
    timeEstimate: '۱ دقیقه',
    interactiveOptions: [
      { label: '💳 درگاه پرداخت آنلاین شاپرک', detail: 'سریع‌ترین متد با تمام کارت‌های عضو شتاب' },
      { label: '🏦 کارت‌به‌کارت آنی با تایید فیش', detail: 'تایید خودکار توسط هوش مصنوعی زیر ۱ دقیقه' },
      { label: '🪙 ارز دیجیتال تتر (USDT / TON)', detail: 'پرداخت امن بدون مالیات و کارمزد شبکه' },
    ],
    instantStatus: {
      tag: 'تراکنش موفق 🔒',
      msg: 'رسید پرداخت الکترونیکی صادر و ثبت شد.',
      sub: 'کد پیگیری رسمی به شماره همراه شما پیامک گردید.',
    },
  },
  {
    id: 3,
    stageNumber: 'STAGE 1-3',
    stageName: 'مرحله ۳: صدور خودکار لایسنس',
    badge: 'MYSTERY BOX 📦',
    themeColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    itemType: 'block',
    itemName: 'جعبه شگفت‌انگیز کد فعال‌سازی',
    title: 'تولید و ارسال فوری اطلاعات اکانت',
    subtitle: 'ارسال آنی توسط ربات هوشمند ققنوس زیر ۲ دقیقه',
    description: 'سیستم هوشمند توزیع اتوماتیک لایسنس بلافاصله کد فعال‌سازی یا مشخصات ورود را از طریق پیامک، ایمیل و پنل کاربری برای شما می‌فرستد.',
    xpReward: 750,
    timeEstimate: 'زیر ۲ دقیقه',
    interactiveOptions: [
      { label: 'ارسال مستقیم کد لایسنس به SMS', detail: 'تحویل پیامکی بدون نیاز به اتصال اینترنت' },
      { label: 'لینک فعال‌سازی اتوماتیک روی ایمیل', detail: 'راهنمای مرحله‌به‌مرحله تصویری فعال‌سازی' },
      { label: 'کپی فوری مشخصات در پنل کاربری', detail: 'مشاهده نام کاربری و پسورد اختصاصی' },
    ],
    instantStatus: {
      tag: 'کد آماده شد 🚀',
      msg: 'لایسنس: PHX-AI98-SPOTIFY-2026-VIP',
      sub: 'فعال‌سازی قانونی با پشتیبانی ۲۴ ساعته ققنوس',
    },
  },
  {
    id: 4,
    stageNumber: 'STAGE 1-4',
    stageName: 'مرحله ۴: فعال‌سازی و پرچم پیروزی',
    badge: 'LEVEL COMPLETE ⭐',
    themeColor: '#10b981',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    itemType: 'star',
    itemName: 'ستاره پیروزی و عضویت VIP',
    title: 'آنلاک دسترسی و شروع تجربه پرمیوم',
    subtitle: 'پشتیبانی مادام‌العمر و دریافت امتیازات باشگاه گیمرها',
    description: 'وارد بازی یا سرویس هوش مصنوعی‌ات شو و بدون قطعی و لیمیت لذت ببر. تیم فنی ققنوس تا آخرین روز همراه شماست.',
    xpReward: 1000,
    timeEstimate: 'مادام‌العمر',
    interactiveOptions: [
      { label: 'شروع گفتگو با مدل چندوجهی GPT-4o', detail: 'بدون فیلتر و بدون محدودیت سرعت' },
      { label: 'دانلود پرسرعت بازی از سرور رسمی', detail: 'پینگ عالی و دسترسی به تمام مپ‌های آنلاین' },
      { label: 'پخش موسیقی Hi-Fi در اسپاتیفای', detail: 'کیفیت ۳۲۰Kbps بدون تبلیغات آزاردهنده' },
    ],
    instantStatus: {
      tag: 'فعال‌سازی نهایی شد 🏆',
      msg: 'اکانت شما با بالاترین سطح دسترسی VIP ارتقا یافت!',
      sub: 'امتیاز باشگاه گیمرها: +1000 XP و کوپن تخفیف ۱۰٪',
    },
  },
];

interface GamerJourneySectionProps {
  onOpenCart: () => void;
  onOpenUserPanel: () => void;
}

export const GamerJourneySection: React.FC<GamerJourneySectionProps> = ({
  onOpenCart,
  onOpenUserPanel,
}) => {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [selectedItemOption, setSelectedItemOption] = useState<{ [key: number]: number }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const sectionRef = useRef<HTMLElement | null>(null);

  // Auto-play timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setActiveStageId((prev) => {
          const next = prev >= 4 ? 1 : prev + 1;
          soundEngine.playCoin();
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleStageSelect = (stageId: number) => {
    soundEngine.playMarioJump();
    setActiveStageId(stageId);
  };

  const handleNextStage = () => {
    soundEngine.playLevelUp();
    setActiveStageId((prev) => (prev >= 4 ? 1 : prev + 1));
  };

  const activeStage = JOURNEY_STAGES.find((s) => s.id === activeStageId) || JOURNEY_STAGES[0];

  return (
    <section
      id="gamer-journey-section"
      ref={sectionRef}
      className="relative py-12 md:py-16 px-4 md:px-8 max-w-7xl mx-auto select-none"
    >
      {/* Background Decorative Energy Flares */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Titles */}
      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Gamepad2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>مسیر تعاملی گیمر (S-Curve Road Map)</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2" style={{ fontFamily: 'var(--font-cinzel), var(--font-vazir)' }}>
          <span>مراحل خرید تا فعال‌سازی؛ </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]">
            مثل بازی و روان
          </span>
        </h2>

        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          با ماریو در جاده پیچ‌درپیچ حرکت کن، خط‌چین‌های نوری را روشن کن و لایسنس اختصاصی‌ات را آنی تحویل بگیر
        </p>

        {/* Global Stage Controllers */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => {
              soundEngine.playClick(600, 0.05);
              setIsAutoPlaying(!isAutoPlaying);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isAutoPlaying
                ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-white/5 text-zinc-300 hover:text-white border-white/10 hover:bg-white/10'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlaying ? 'توقف پیمایش خودکار' : 'پیمایش خودکار مسیر'}</span>
          </button>

          <button
            onClick={handleNextStage}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-transform"
          >
            <span>گام بعدی</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* S-SHAPED INTERACTIVE GAMING MAP CONTAINER */}
      <div className="relative z-10 rounded-3xl bg-[#090714]/90 border border-white/10 p-5 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Winding S-Road Visualization for Desktop and Mobile */}
        <div className="space-y-12 relative">
          
          {JOURNEY_STAGES.map((stage, index) => {
            const isCurrent = activeStageId === stage.id;
            const isCompleted = activeStageId > stage.id;
            const isEven = index % 2 === 1; // Zig-zag / S-curve alternation

            return (
              <div key={stage.id} className="relative">
                
                {/* Connecting S-Curve Road Line to next stage */}
                {index < JOURNEY_STAGES.length - 1 && (
                  <div 
                    className={`hidden md:block absolute top-28 h-20 w-3/4 pointer-events-none z-0 ${
                      isEven ? 'right-10 border-r-2 border-b-2 rounded-br-3xl' : 'left-10 border-l-2 border-b-2 rounded-bl-3xl'
                    } ${
                      isCompleted ? 'border-amber-400 border-dashed shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'border-white/10 border-dashed'
                    }`}
                  />
                )}

                {/* Stage Item Card Grid (Alternating S-curve alignment) */}
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Stage Island Platform & Mario Character */}
                  <div className={`lg:col-span-5 flex flex-col items-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div
                      onClick={() => handleStageSelect(stage.id)}
                      className={`group cursor-pointer relative p-6 rounded-3xl border transition-all duration-400 w-full max-w-sm flex flex-col items-center text-center ${
                        isCurrent
                          ? 'bg-gradient-to-b from-[#1c1236] to-[#0d091a] border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_35px_rgba(245,158,11,0.35)] scale-102'
                          : isCompleted
                          ? 'bg-[#100c1e] border-emerald-500/40 opacity-90'
                          : 'bg-[#0c0916] border-white/10 hover:border-white/25 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* Floating Stage Node Badge */}
                      <div className="flex items-center justify-between w-full mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          isCurrent ? 'bg-amber-400 text-black' : isCompleted ? 'bg-emerald-500 text-black' : 'bg-white/10 text-zinc-400'
                        }`}>
                          {stage.stageNumber}
                        </span>

                        <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>{stage.timeEstimate}</span>
                        </span>
                      </div>

                      {/* 3D Mario / Character on the active platform */}
                      <div className="h-28 flex items-center justify-center relative my-1">
                        {isCurrent ? (
                          <div className="relative">
                            <MarioGameCharacter size={90} isJumping={true} />
                            <div className="absolute -bottom-2 inset-x-0 h-3 bg-amber-400/30 rounded-full blur-md animate-pulse" />
                          </div>
                        ) : (
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/10"
                            style={{ background: `${stage.themeColor}20` }}
                          >
                            {stage.itemType === 'mushroom' && '🍄'}
                            {stage.itemType === 'key' && '🪙'}
                            {stage.itemType === 'block' && '📦'}
                            {stage.itemType === 'star' && '⭐'}
                          </div>
                        )}
                      </div>

                      {/* Stage Name & Power-up Tag */}
                      <span className="text-xs font-bold text-amber-300 mt-2">
                        {stage.badge}
                      </span>
                      <h4 className="text-base font-black text-white mt-1">
                        {stage.stageName}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                        {stage.itemName}
                      </p>

                      {/* Completion status check */}
                      {isCompleted && (
                        <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>مرحله تکمیل شد (+{stage.xpReward} XP)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stage Quest Details & Interactive Options */}
                  <div className={`lg:col-span-7 space-y-4 text-right ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="p-5 sm:p-6 rounded-3xl bg-black/50 border border-white/10 backdrop-blur-md">
                      
                      {/* Quest Title & Subtitle */}
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span>پاداش مرحله: +{stage.xpReward} XP</span>
                        </div>
                        <h3 className="text-lg font-black text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
                          {stage.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                        {stage.description}
                      </p>

                      {/* Interactive Selection Radios */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-zinc-400 block mb-1">
                          گزینه‌های دردسترس در این مرحله:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {stage.interactiveOptions.map((opt, optIdx) => {
                            const isOptSelected = selectedItemOption[stage.id] === optIdx;
                            return (
                              <button
                                key={opt.label}
                                onClick={() => {
                                  soundEngine.playClick(700, 0.04);
                                  setSelectedItemOption((prev) => ({ ...prev, [stage.id]: optIdx }));
                                }}
                                className={`p-2.5 rounded-xl border text-right transition-all text-xs flex flex-col justify-between gap-1 ${
                                  isOptSelected
                                    ? 'bg-amber-500/15 border-amber-400 text-white shadow-sm'
                                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-bold text-white text-xs">{opt.label}</span>
                                  {isOptSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                                </div>
                                <span className="text-[10px] text-zinc-400">{opt.detail}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Instant Live Terminal Status Box */}
                      <div className="mt-4 p-3 rounded-2xl bg-[#080511] border border-amber-500/20 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (stage.id === 1 || stage.id === 2) onOpenCart();
                              if (stage.id === 3 || stage.id === 4) onOpenUserPanel();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <span>مشاهده</span>
                            <ExternalLink className="w-3 h-3 text-amber-400" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-black text-amber-300 block">{stage.instantStatus.tag}</span>
                          <span className="text-[10px] text-zinc-400">{stage.instantStatus.msg}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
