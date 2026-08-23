import React, { useState } from 'react';
import { Sparkles, Zap, ShieldCheck, CheckCircle2, Clock, Key, ArrowLeft, Bot, Terminal, Image as ImageIcon, Search, Cpu, Film } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { Product } from '../types';

interface AIModelSpec {
  id: string;
  name: string;
  subName: string;
  badge: string;
  badgeColor: string;
  description: string;
  startingPrice: number;
  icon: React.ReactNode;
  benchmarks: {
    title: string;
    score: number;
    detail: string;
  }[];
  useCases: string[];
  deliveryTime: string;
  activationType: string;
  accentColor: string;
  relatedProductId: string;
}

const AI_MODELS_DATA: AIModelSpec[] = [
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus (GPT-4o)',
    subName: 'قدرتمندترین مدل هوش مصنوعی چندوجهی OpenAI',
    badge: 'OMNI PRO 4o',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    description: 'دسترسی نامحدود به پیشرفته‌ترین مدل چندوجهی با قابلیت تولید تصویر DALL-E 3، وب بروزینگ زنده، تحلیل داده‌های پیشرفته و گفتگوی صوتی هوشمند.',
    startingPrice: 980000,
    icon: <Bot className="w-5 h-5 text-emerald-400" />,
    benchmarks: [
      { title: 'سرعت پردازش (Tokens/sec)', score: 98, detail: 'فوق‌العاده بالا (۳۴۰+ t/s)' },
      { title: 'کدنویسی و توسعه نرم‌افزار', score: 95, detail: 'پیشرفته (React, Python, C++)' },
      { title: 'حالت گفتگوی صوتی زنده (Voice)', score: 100, detail: 'فعال بدون محدودیت' },
      { title: 'دقت درک و نگارش زبان فارسی', score: 94, detail: 'عالی و روان' },
    ],
    useCases: [
      'تولید تصویر با DALL-E 3',
      'تولید کد و برنامه‌نویسی پروژه',
      'تحلیل فایل‌های PDF و اکسل',
      'گفتگوی صوتی هوشمند زنده',
    ],
    deliveryTime: 'تحویل آنلاین زیر ۲ دقیقه',
    activationType: 'فعال‌سازی قانونی روی ایمیل شخصی / اکانت اختصاصی',
    accentColor: '#10b981',
    relatedProductId: 'prod-chatgpt',
  },
  {
    id: 'claude-sonnet',
    name: 'Claude 3.5 Sonnet',
    subName: 'پادشاه کدنویسی، تحلیل داکیومنت و درک زبان فارسی',
    badge: 'ANTHROPIC TOP',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    description: 'برترین هوش مصنوعی جهان در بنچ‌مارک‌های کدنویسی و تحلیل متن با پنجره متنی ۲۰۰K توکن و ویژگی فوق‌العاده Artifacts برای رندر لحظه‌ای کد.',
    startingPrice: 1150000,
    icon: <Terminal className="w-5 h-5 text-amber-400" />,
    benchmarks: [
      { title: 'کدنویسی و معماری نرم‌افزار', score: 99, detail: 'رتبه ۱ جهانی در SWE-bench' },
      { title: 'پنجره متنی Context Window', score: 97, detail: '۲۰۰,۰۰۰ توکن (~۱۵۰ صفحه کتاب)' },
      { title: 'دقت تحلیل منطقی و استدلال', score: 96, detail: 'بالاترین ضریب اطمینان' },
      { title: 'رندر همزمان کامپوننت با Artifacts', score: 100, detail: 'پیش‌نمایش زنده در لحظه' },
    ],
    useCases: [
      'برنامه‌نویسی و ساخت اپلیکیشن کامل',
      'خلاصه‌سازی اسناد و کتاب‌های قطور',
      'نگارش مقالات علمی و پژوهشی',
      'تحلیل نمودارها و دیاگرام‌های پیچیده',
    ],
    deliveryTime: 'تحویل آنی زیر ۶۰ ثانیه',
    activationType: 'اکانت اختصاصی قانونی با پسورد شخصی و پشتیبانی کامل',
    accentColor: '#f59e0b',
    relatedProductId: 'prod-claude',
  },
  {
    id: 'midjourney-pro',
    name: 'Midjourney Pro v6.1',
    subName: 'تولید تصاویر سینمایی، فتورئالیستیک و لوگو با کیفیت 8K',
    badge: 'IMAGE GEN V6',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40',
    description: 'بی‌رقیب‌ترین موتور تولید عکس با هوش مصنوعی؛ بدون محدودیت در مد Relax و دارای ۳۰ ساعت حالت Fast GPU در ماه همراه با حالت Stealth مخفی‌کاری.',
    startingPrice: 1420000,
    icon: <ImageIcon className="w-5 h-5 text-fuchsia-400" />,
    benchmarks: [
      { title: 'کیفیت و رزولوشن خروجی (8K)', score: 99, detail: 'بافت فتورئالیستیک فوق‌العاده' },
      { title: 'کنترل پرامپت و حفظ کاراکتر', score: 94, detail: 'قابلیت صریح Character Ref (--cref)' },
      { title: 'سرعت رندر در مد Fast GPU', score: 96, detail: 'زیر ۳۰ ثانیه برای ۴ تصویر' },
      { title: 'حالت مخفی Stealth Mode', score: 100, detail: 'عدم نمایش تصاویر در گالری عمومی' },
    ],
    useCases: [
      'طراحی پوسترهای تبلیغاتی و سینمایی',
      'خلق کاراکترهای سه‌بعدی و گیمینگ',
      'تولید تصاویر کانسپت و فوتورئال',
      'طراحی لوگو، تایپوگرافی و آیکون',
    ],
    deliveryTime: 'تحویل فوری در ۳ دقیقه',
    activationType: 'اشتراک مستقیم سرور دیسکورد یا پنل وب رسمی',
    accentColor: '#d946ef',
    relatedProductId: 'prod-midjourney',
  },
  {
    id: 'perplexity-pro',
    name: 'Perplexity Pro',
    subName: 'موتور جستجوی هوشمند متصل به وب زنده با رفرنس معتبر',
    badge: 'LIVE SEARCH',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    description: 'جایگزین نهایی گوگل؛ پاسخ به سوالات پیچیده با ارجاع دقیق به منابع معتبر وب و دسترسی همزمان به مدل‌های GPT-4o، Claude 3.5 و Sonar.',
    startingPrice: 790000,
    icon: <Search className="w-5 h-5 text-cyan-400" />,
    benchmarks: [
      { title: 'دقت در نتایج وب زنده Real-time', score: 98, detail: 'دسترسی مستقیم به اخبار و مقالات امروز' },
      { title: 'سوئیچ بین مدل‌ها (Claude/GPT)', score: 100, detail: 'انتخاب موتور هوش مصنوعی دلخواه' },
      { title: 'تحلیل فایل و کوئری نامحدود Pro', score: 95, detail: 'بیش از ۶۰۰ سرچ Pro در روز' },
      { title: 'عدم توهم و فکت‌چکینگ خودکار', score: 96, detail: 'دارای لینک منابع معتبر' },
    ],
    useCases: [
      'پژوهش و تحقیق آکادمیک با منابع زنده',
      'تحلیل ترندهای بازار و بورس جهانی',
      'خلاصه‌سازی فوری اخبار روز دنیا',
      'دسترسی همزمان به تمام مدل‌های هوش مصنوعی',
    ],
    deliveryTime: 'تحویل آنلاین ۲ دقیقه‌ای',
    activationType: 'فعال‌سازی روی اکانت شما یا ارسال مشخصات کامل اختصاصی',
    accentColor: '#06b6d4',
    relatedProductId: 'prod-perplexity',
  },
  {
    id: 'cursor-ai',
    name: 'Cursor AI Pro',
    subName: 'محیط برنامه‌نویسی نسل بعد مجهز به ایجنت خودکار',
    badge: 'AI CODE AGENT',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
    description: 'ادیتور تخصصی VS Code تقویت شده با هوش مصنوعی برای ویرایش همزمان چندین فایل (Composer)، دیباگ خودکار و ساخت پروژه‌های کامل.',
    startingPrice: 1250000,
    icon: <Cpu className="w-5 h-5 text-indigo-400" />,
    benchmarks: [
      { title: 'ویرایش چند فایله Multi-File Edit', score: 99, detail: 'درک کامل ساختار کل رپازیتوری' },
      { title: 'سرعت تکمیل خودکار Tab Autocomplete', score: 98, detail: 'پیش‌بینی دقیق ۱۰ خط بعدی کد' },
      { title: 'پشتیبانی از مدل‌های Claude و GPT', score: 100, detail: '۵۰۰ درخواست Fast در ماه' },
      { title: 'کاهش خطاهای سینتکسی و باگ', score: 92, detail: 'دیباگ سریع با یک کلیک' },
    ],
    useCases: [
      'توسعه سریع فول‌استک وب و موبایل',
      'ریفکتور کدهای قدیمی و اسپاگتی',
      'نوشتن تست‌های اتوماتیک یونیت',
      'ساخت سریع فیچرهای کامل با پرامپت',
    ],
    deliveryTime: 'تحویل آنی زیر ۲ دقیقه',
    activationType: 'اکانت قانونی پرمیوم با ایمیل اختصاصی',
    accentColor: '#6366f1',
    relatedProductId: 'prod-cursor',
  },
  {
    id: 'runway-gen3',
    name: 'Runway Gen-3 Alpha',
    subName: 'تولید ویدیوهای سینمایی 4K با هوش مصنوعی فوق‌العاده',
    badge: 'CINEMA VIDEO',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    description: 'پیشرفته‌ترین پلتفرم خلق و ادیت ویدیو با هوش مصنوعی؛ کنترل دقیق دوربین، فیزیک واقع‌گرایانه و ساخت تیزرهای هالیوودی.',
    startingPrice: 1680000,
    icon: <Film className="w-5 h-5 text-rose-400" />,
    benchmarks: [
      { title: 'فیزیک حرکات و جلوه‌های نوری', score: 97, detail: 'حرکات سیال و فتورئال بدون موج‌زدگی' },
      { title: 'کنترل جهت و حرکت دوربین (Camera)', score: 99, detail: 'پن، زوم، تیلت و اوربیت ۳ بعدی' },
      { title: 'رزولوشن خروجی High-Res 4K', score: 95, detail: 'مناسب تیزر و تدوین حرفه‌ای' },
      { title: 'تولید از متن و تصویر (Text/Image)', score: 96, detail: 'انتقال حس و استایل کارگردانی' },
    ],
    useCases: [
      'ساخت تیزرهای تبلیغاتی و موزیک ویدیو',
      'خلق جلوه‌های ویژه بصری سینمایی',
      'تولید محتوای ویدیویی برای یوتیوب و اینستاگرام',
      'انیمیت کردن تصاویر ثابت و کانسپت آرت‌ها',
    ],
    deliveryTime: 'تحویل سریع در ۵ دقیقه',
    activationType: 'اشتراک استاندارد / نامحدود آنلاک شده',
    accentColor: '#f43f5e',
    relatedProductId: 'prod-runway',
  },
];

interface AICommandCenterSectionProps {
  onSelectProduct?: (product: Product) => void;
  onOpenQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => void;
  onAddToCartWithJet?: (product: Product, event: React.MouseEvent<HTMLButtonElement>) => void;
  productsCatalog?: Product[];
}

export const AICommandCenterSection: React.FC<AICommandCenterSectionProps> = ({
  onSelectProduct,
  onOpenQuickView,
  onAddToCart,
  onAddToCartWithJet,
  productsCatalog = [],
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>('chatgpt-plus');

  const selectedModel = AI_MODELS_DATA.find((m) => m.id === selectedModelId) || AI_MODELS_DATA[0];

  const handleSelectModel = (model: AIModelSpec) => {
    soundEngine.playClick(700, 0.05);
    setSelectedModelId(model.id);
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const matchedProduct = (productsCatalog || []).find(
      (p) => p.id === selectedModel.relatedProductId || p.englishTitle.toLowerCase().includes(selectedModel.id.split('-')[0])
    ) || {
      id: selectedModel.relatedProductId,
      title: selectedModel.name,
      englishTitle: selectedModel.name,
      category: 'ai',
      price: selectedModel.startingPrice,
      originalPrice: selectedModel.startingPrice * 1.25,
      deliveryTime: selectedModel.deliveryTime,
      stockStatus: 'in_stock',
      backdropImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      platforms: ['Web', 'iOS', 'Android'],
      accountType: selectedModel.activationType,
      rating: 4.9,
      reviewsCount: 312,
      description: selectedModel.description,
      features: selectedModel.useCases,
      tags: ['AI', 'OpenAI', 'Premium', 'License'],
    };

    if (onAddToCartWithJet) {
      onAddToCartWithJet(matchedProduct as Product, e);
    } else if (onAddToCart) {
      onAddToCart(matchedProduct as Product, e);
    }
  };

  return (
    <section id="ai-assistants-section" className="relative py-16 md:py-24 text-zinc-100">
      {/* Background Decorative Flares */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Sticky Section Header Bar */}
        <div className="sticky top-20 z-30 mb-8 p-4 sm:p-5 rounded-2xl bg-[#090616]/95 border border-purple-500/30 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-rose-600 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <div className="w-full h-full bg-[#0d091e] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  مرکز فرماندهی دستیارهای هوشمند
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/40">
                  AI Cockpit
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                فعال‌سازی ۱۰۰٪ قانونی برترین مدل‌های هوش مصنوعی دنیا با تحویل لحظه‌ای
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-amber-300 font-bold mr-auto sm:mr-0">
            <span>مدل‌های نسل جدید ۲۰۲۶</span>
          </div>
        </div>

      {/* Main Glassmorphism Command Center Frame with Dynamic Glowing Aura */}
      <div className="relative z-10 rounded-3xl bg-gradient-to-b from-[#0e081f] via-[#090514] to-[#05020c] border border-purple-500/30 p-4 sm:p-6 md:p-7 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] hover:border-purple-400/50 transition-all duration-500 overflow-hidden">
        
        {/* Active Model Spotlight Ambient Glow */}
        <div 
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: selectedModel.accentColor }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* LEFT COLUMN: ACTIVE MODEL DETAILS & BENCHMARK MATRIX (In RTL layout: left is col-span-7) */}
          <div className="lg:col-span-7 flex flex-col space-y-6 order-2 lg:order-1">
            {/* Header: Title & Starting Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg transition-transform duration-500 hover:scale-110 hover:rotate-3"
                  style={{
                    backgroundColor: `${selectedModel.accentColor}20`,
                    borderColor: `${selectedModel.accentColor}60`,
                    boxShadow: `0 0 25px ${selectedModel.accentColor}40`,
                  }}
                >
                  {selectedModel.icon}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-vazir)' }}>
                    <span>مشخصات لایسنس {selectedModel.name}</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{selectedModel.subName}</p>
                </div>
              </div>

              {/* Price Pill with Glowing Border */}
              <div className="self-start sm:self-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-xs text-zinc-400">شروع از</span>
                <span className="text-base font-black text-white">{selectedModel.startingPrice.toLocaleString('fa-IR')}</span>
                <span className="text-xs text-emerald-400">تومان</span>
              </div>
            </div>

            {/* Benchmark Matrix */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-amber-400 animate-pulse" />
                  <span>ماتریس قدرت و بنچ‌مارک‌های عملیاتی:</span>
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">بروزرسانی ماه جاری</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedModel.benchmarks.map((bench, idx) => (
                  <div key={idx} className="group/bench p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-bold group-hover/bench:text-white transition-colors">{bench.title}</span>
                      <span className="font-mono font-black text-amber-300">{bench.score}%</span>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${bench.score}%`,
                          background: `linear-gradient(90deg, #3b82f6, ${selectedModel.accentColor})`,
                          boxShadow: `0 0 12px ${selectedModel.accentColor}`,
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate font-mono">{bench.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Use-Cases Checkmark Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-xs md:text-sm font-bold text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>کاربردهای اصلی و سناریوهای مورد استفاده:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedModel.useCases.map((uc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{uc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee & Delivery Badges */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/20 via-rose-900/20 to-amber-900/20 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>ضمانت ۱۰۰٪ فعال‌سازی و اکانت قانونی</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                پشتیبانی کامل آنلاین + ضمانت تعویض اکانت و ریفاند در صورت هرگونه قطعی در سراسر دوره اشتراک
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-[11px] text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>زمان تحویل: <strong className="text-white font-medium">{selectedModel.deliveryTime}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>نوع فعال‌سازی: <strong className="text-white font-medium">{selectedModel.activationType}</strong></span>
                </div>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              onClick={handleCtaClick}
              onMouseEnter={() => soundEngine.playHover()}
              className="w-full py-4 px-6 rounded-2xl text-white font-black text-sm md:text-base flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(217,70,239,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
              }}
            >
              <span>مشاهده پلن‌ها و خرید اکانت {selectedModel.name}</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* RIGHT COLUMN: MODEL SELECTOR LIST (In RTL layout: right is col-span-5) */}
          <div className="lg:col-span-5 flex flex-col space-y-3.5 order-1 lg:order-2">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">انتخاب مدل هوش مصنوعی:</span>
              <span className="text-[11px] text-purple-400">کلیک برای مشاهده جزئیات</span>
            </div>

            <div className="flex flex-col space-y-2.5">
              {AI_MODELS_DATA.map((model) => {
                const isSelected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    onClick={() => handleSelectModel(model)}
                    onMouseEnter={() => soundEngine.playHover()}
                    className={`w-full text-right p-3.5 rounded-2xl border transition-all relative overflow-hidden flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-white/[0.08] border-purple-500/70 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15'
                    }`}
                  >
                    {/* Active Accent Border Indicator */}
                    {isSelected && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1.5"
                        style={{ backgroundColor: model.accentColor }}
                      />
                    )}

                    <div className="flex items-center gap-3 pr-1">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${model.accentColor}15`,
                          borderColor: `${model.accentColor}30`,
                        }}
                      >
                        {model.icon}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{model.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono font-bold ${model.badgeColor}`}>
                            {model.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{model.subName}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      {isSelected ? (
                        <span className="text-[11px] font-bold text-purple-400 bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/40">
                          انتخاب شده
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-zinc-300">
                          {model.startingPrice.toLocaleString('fa-IR')} ت
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
      </div>
    </section>
  );
};
