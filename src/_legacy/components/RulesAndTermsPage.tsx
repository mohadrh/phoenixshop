import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  RotateCcw, 
  Lock, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export const RulesAndTermsPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    soundEngine.playClick(600, 0.04);
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const sections = [
    {
      title: '۱. اصالت لایسنس‌ها و ضمانت قانونی ۱۰۰٪',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      content: 'تمامی لایسنس‌ها، اکانت‌ها و اشتراک‌های ارائه‌شده در ققنوس شاپ به صورت ۱۰۰٪ ارجینال، قانونی و از طریق کارگزاری‌های معتبر بین‌المللی پرداخت و تهیه شده‌اند. ما هیچ‌گونه اکانت کرکی، اشتراکی ناامن یا هک‌شده ارائه نمی‌دهیم.',
    },
    {
      title: '۲. پروتکل تحویل آنی و زمان‌بندی سفارش‌ها',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      content: 'سیستم هوشمند توزیع اتوماتیک ققنوس شاپ ۹۵٪ سفارشات را به محض تکمیل پرداخت شاپرک زیر ۲ دقیقه از طریق پیامک، ایمیل و پنل کاربری صادر و ارسال می‌نماید. در موارد نادر استعلام ریجن، حداکثر زمان تحویل ۱۵ الی ۳۰ دقیقه خواهد بود.',
    },
    {
      title: '۳. شرایط گارانتی تعویض و پشتیبانی مادام‌العمر',
      icon: <CheckCircle2 className="w-5 h-5 text-purple-400" />,
      content: 'اکانت‌های قانونی ظرفیت ۲ و اشتراک‌های هوش مصنوعی اختصاصی دارای گارانتی تعویض کامل در صورت بروز هرگونه اختلال خارج از اراده کاربر هستند. پشتیبانی فنی ۲۴ ساعته از طریق سیستم تیکت سایت و تلگرام پاسخگوی خریداران است.',
    },
    {
      title: '۴. رویه استرداد وجه و ضمانت بازگشت (Refund Policy)',
      icon: <RotateCcw className="w-5 h-5 text-rose-400" />,
      content: 'در صورتی که به هر دلیل فنی امکان صدور یا فعال‌سازی لایسنس وجود نداشته باشد، وجه پرداختی طی حداکثر ۲ ساعت کاری به همان شماره شبا یا کارت مبدا واریزکننده بدون هیچ‌گونه کارمزدی مسترد خواهد شد.',
    },
    {
      title: '۵. امنیت اطلاعات و حریم خصوصی کاربران',
      icon: <Lock className="w-5 h-5 text-blue-400" />,
      content: 'ققنوس شاپ متعهد به حفظ کامل اطلاعات حساب کاربری و شماره تماس مشتریان است و هیچ‌گونه اطلاعات پرداختی یا گذرواژه‌ای خارج از سرورهای رمزنگاری‌شده ذخیره نمی‌گردد.',
    },
  ];

  const faqs = [
    {
      q: 'آیا اکانت‌های هوش مصنوعی (ChatGPT Plus، Midjourney) روی ایمیل شخصی خودمان فعال می‌شوند؟',
      a: 'بله، اکتیو کد یا لایسنس اختصاصی مستقیماً روی ایمیل خود کاربر یا یک حساب ۱۰۰٪ اختصاصی با دسترسی کامل به پسورد و امکان تغییر آن تحویل داده می‌شود.',
    },
    {
      q: 'تفاوت ظرفیت ۲ و ظرفیت ۳ در اکانت‌های بازی پلی‌استیشن و ایکس‌باکس چیست؟',
      a: 'ظرفیت ۲ به شما اجازه می‌دهد روی اکانت شخصی خودتان هم به صورت آفلاین و هم آنلاین بدون قطعی با گارانتی مادام‌العمر بازی کنید. ظرفیت ۳ نیازمند اتصال کنسول به اینترنت در حین بازی است.',
    },
    {
      q: 'اگر کد فعال‌سازی پیامک نشد چه کار کنم؟',
      a: 'بلافاصله می‌توانید وارد «پنل کاربری» شوید و در بخش «سفارش‌های من» لایسنس خود را مشاهده کنید یا در بخش «پیگیری سفارش» کد رهگیری خود را وارد نمایید.',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-5xl mx-auto select-none">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3">
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span>شفافیت و حقوق مشتریان ققنوس شاپ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
          قوانین، مقررات و شرایط گارانتی
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
          تعهدات ققنوس شاپ در ارائه خدمات قانونی، پشتیبانی ۲۴ ساعته و حفظ کامل حقوق خریداران
        </p>
      </div>

      {/* Rules Accordions / Cards */}
      <div className="space-y-4 mb-12">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-3xl bg-[#0e0a1c]/95 border border-white/10 text-right backdrop-blur-xl shadow-lg space-y-2"
          >
            <div className="flex items-center gap-3 justify-end">
              <h3 className="text-base font-extrabold text-white">{sec.title}</h3>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                {sec.icon}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pr-11">
              {sec.content}
            </p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="rounded-3xl bg-[#0e0a1c]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="text-right mb-6">
          <div className="flex items-center gap-2 justify-end text-amber-400 font-black text-lg">
            <span>سوالات متداول حقوقی و فنی</span>
            <HelpCircle className="w-5 h-5" />
          </div>
          <p className="text-xs text-zinc-400 mt-1">پاسخ به پرتکرارترین پرسش‌های کاربران پیرامون لایسنس‌ها</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden text-right transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-amber-300"
                >
                  <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  <span>{faq.q}</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
