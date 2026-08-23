import React from 'react';
import { PhoenixLogo } from './PhoenixLogo';
import { ShieldCheck, Zap, Headphones, ArrowUp, Send, Instagram, MessageCircle, Heart, Ticket, UserCheck, Activity, Sparkles, CheckCircle } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenUserPanel?: (tab: 'profile' | 'orders' | 'tickets' | 'wallet') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenUserPanel }) => {
  const scrollToTop = () => {
    soundEngine.playFireIgnite();
    const heroSection = document.getElementById('hero-section') || document.body;
    heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-amber-500/20 bg-gradient-to-b from-[#090514] via-[#06030c] to-[#020105] text-right pt-16 pb-12 select-none overflow-hidden">
      
      {/* Top Animated Laser Beam Light */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 via-orange-500 to-transparent opacity-80 animate-pulse" />
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-24 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Top Feature Guarantee Strip with Fluid Hover Motion */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onMouseEnter={() => soundEngine.playHover()}
            className="group p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-amber-400/50 hover:bg-white/[0.06] flex items-center gap-4 transition-all duration-300 hover:-translate-y-1.5 shadow-lg cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-orange-400 animate-pulse" />
            </div>
            <div>
              <h5 className="text-sm font-black text-white mb-0.5 group-hover:text-amber-300 transition-colors">تحویل تمام‌اتوماتیک آنی</h5>
              <p className="text-xs text-zinc-400">ارسال مشخصات اکانت بلافاصله پس از پرداخت</p>
            </div>
          </div>

          <div 
            onMouseEnter={() => soundEngine.playHover()}
            className="group p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-emerald-400/50 hover:bg-white/[0.06] flex items-center gap-4 transition-all duration-300 hover:-translate-y-1.5 shadow-lg cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h5 className="text-sm font-black text-white mb-0.5 group-hover:text-emerald-300 transition-colors">گارانتی تعویض مادام‌العمر</h5>
              <p className="text-xs text-zinc-400">تضمین اصالت قانونی و عدم بن شدن</p>
            </div>
          </div>

          <div 
            onMouseEnter={() => soundEngine.playHover()}
            className="group p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-rose-400/50 hover:bg-white/[0.06] flex items-center gap-4 transition-all duration-300 hover:-translate-y-1.5 shadow-lg cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h5 className="text-sm font-black text-white mb-0.5 group-hover:text-rose-300 transition-colors">پشتیبانی ۲۴ ساعته</h5>
              <p className="text-xs text-zinc-400">پاسخگویی سریع در تلگرام و تیکت سایت</p>
            </div>
          </div>

          <div 
            onMouseEnter={() => soundEngine.playHover()}
            className="group p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-purple-400/50 hover:bg-white/[0.06] flex items-center gap-4 transition-all duration-300 hover:-translate-y-1.5 shadow-lg cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h5 className="text-sm font-black text-white mb-0.5 group-hover:text-purple-300 transition-colors">باشگاه مشتریان وفادار</h5>
              <p className="text-xs text-zinc-400">تخفیف‌های ویژه و کش‌بک در هر سفارش</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand & Description */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <PhoenixLogo size={46} showText={true} animateGlow={true} />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
            فروشگاه سینماتیک ققنوس شاپ، مرجع تخصصی خرید اکانت‌های قانونی گیمینگ، اشتراک‌های پریمیوم هوش مصنوعی (ChatGPT, Midjourney, Cursor) و گیفت‌کارت‌های بین‌المللی با بهترین قیمت در ایران.
          </p>
          
          {/* Social Icons with Motion */}
          <div className="flex items-center gap-2.5 pt-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                soundEngine.playClick();
              }}
              className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-300 flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-cyan-400/50 hover:scale-110 shadow-md"
              title="تلگرام ققنوس شاپ"
            >
              <Send className="w-4 h-4 text-cyan-400" />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                soundEngine.playClick();
              }}
              className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-300 flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-rose-400/50 hover:scale-110 shadow-md"
              title="اینستاگرام ققنوس شاپ"
            >
              <Instagram className="w-4 h-4 text-rose-400" />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                soundEngine.playClick();
              }}
              className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-purple-500/20 text-zinc-300 hover:text-purple-300 flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-purple-400/50 hover:scale-110 shadow-md"
              title="دیسکورد ققنوس شاپ"
            >
              <MessageCircle className="w-4 h-4 text-purple-400" />
            </a>

            {/* Live Server Status Ping */}
            <div className="mr-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>پینگ ۲۰ms • سرورها ۱۰۰٪ آنلاین</span>
            </div>
          </div>
        </div>

        {/* Quick Links 1 */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>دسترسی سریع</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li>
              <button 
                onClick={() => {
                  soundEngine.playClick();
                  onNavigateSection('ai-assistants-section');
                }} 
                className="hover:text-amber-400 transition-colors hover:translate-x-[-4px] inline-flex items-center gap-1"
              >
                مرکز هوش مصنوعی (AI Models)
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  soundEngine.playClick();
                  onNavigateSection('gamer-journey-section');
                }} 
                className="hover:text-amber-400 transition-colors hover:translate-x-[-4px] inline-flex items-center gap-1"
              >
                مسیر لول‌آپ گیمر ⚔️
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  soundEngine.playClick();
                  onNavigateSection('hot-deals');
                }} 
                className="hover:text-amber-400 transition-colors hover:translate-x-[-4px] inline-flex items-center gap-1"
              >
                پیشنهادات داغ و تخفیف‌ها
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  soundEngine.playClick();
                  onNavigateSection('categories');
                }} 
                className="hover:text-amber-400 transition-colors hover:translate-x-[-4px] inline-flex items-center gap-1"
              >
                اکانت‌های قانونی بازی‌ها
              </button>
            </li>
          </ul>
        </div>

        {/* User Account & Support */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>پنل کاربری و پشتیبانی</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            {onOpenUserPanel && (
              <>
                <li>
                  <button 
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenUserPanel('profile');
                    }} 
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 hover:translate-x-[-4px]"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>حساب کاربری و موجودی</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenUserPanel('tickets');
                    }} 
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 hover:translate-x-[-4px]"
                  >
                    <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ارسال تیکت پشتیبانی ۲۴/۷</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenUserPanel('orders');
                    }} 
                    className="hover:text-amber-400 transition-colors hover:translate-x-[-4px]"
                  >
                    پیگیری سفارشات و لایسنس‌ها
                  </button>
                </li>
              </>
            )}
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  soundEngine.playClick();
                }} 
                className="hover:text-amber-400 transition-colors hover:translate-x-[-4px] inline-block"
              >
                شرایط گارانتی و تعویض
              </a>
            </li>
          </ul>
        </div>

        {/* Trust Badges */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>نمادهای اعتماد الکترونیکی</span>
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center hover:border-amber-400/40 transition-all hover:scale-105">
              <span className="text-[10px] text-zinc-400 block mb-1">اینماد الکترونیکی</span>
              <span className="text-xs font-bold text-amber-400">⭐⭐⭐⭐⭐</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center hover:border-emerald-400/40 transition-all hover:scale-105">
              <span className="text-[10px] text-zinc-400 block mb-1">درگاه پرداخت امن</span>
              <span className="text-xs font-bold text-emerald-400">بانک سامان</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Back to Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div>
          تمامی حقوق مادی و معنوی متعلق به فروشگاه <span className="text-zinc-200 font-black">ققنوس شاپ (Phoenix Shop)</span> می‌باشد • طراحی سینماتیک با افکت‌های ۳D
        </div>

        <button
          onClick={scrollToTop}
          onMouseEnter={() => soundEngine.playHover()}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
        >
          <span>بازگشت به ابتدای صفحه</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
