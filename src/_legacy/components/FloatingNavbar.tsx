import React, { useState } from 'react';
import { PhoenixLogo } from './PhoenixLogo';
import { 
  ShoppingBag, 
  Search, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Compass, 
  AlertCircle, 
  User, 
  MessageSquare, 
  Ticket,
  Store,
  FileText,
  Package
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface FloatingNavbarProps {
  cartCount: number;
  currentPage: 'home' | 'shop' | 'product-detail' | 'rules' | 'tracking';
  onNavigatePage: (page: 'home' | 'shop' | 'rules' | 'tracking') => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenUserPanel: (tab?: 'profile' | 'orders' | 'tickets' | 'wallet') => void;
  onNavigateSection: (sectionId: string) => void;
  onToggle404: () => void;
  is404Active: boolean;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  cartCount,
  currentPage,
  onNavigatePage,
  onOpenCart,
  onOpenSearch,
  onOpenUserPanel,
  onNavigateSection,
  onToggle404,
  is404Active,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSoundToggle = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const navPages: { id: 'home' | 'shop' | 'rules' | 'tracking'; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'صفحه اصلی', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'shop', label: 'فروشگاه و فیلترها', icon: <Store className="w-3.5 h-3.5 text-purple-400" />, badge: 'فول' },
    { id: 'rules', label: 'قوانین و گارانتی', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'tracking', label: 'پیگیری سفارش', icon: <Package className="w-3.5 h-3.5 text-blue-400" /> },
  ];

  return (
    <>
      <header className="fixed top-3 left-0 right-0 z-40 flex justify-center px-3 sm:px-6 transition-all duration-300">
        <nav 
          className="glass-pill flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 py-2 rounded-full w-full max-w-6xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-2xl"
          style={{ background: 'rgba(10, 8, 19, 0.85)' }}
        >
          {/* Logo Brand */}
          <button
            onClick={() => {
              soundEngine.playClick(800, 0.05);
              if (is404Active) onToggle404();
              onNavigatePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 focus:outline-none group text-right shrink-0"
            title="ققنوس شاپ | بازگشت به بالا"
          >
            <PhoenixLogo size={34} showText={false} animateGlow={true} />
            <div className="hidden sm:flex flex-col text-right leading-none">
              <span className="text-white font-extrabold text-sm tracking-wider" style={{ fontFamily: 'var(--font-cinzel), var(--font-vazir)' }}>
                PHOENIX <span className="text-[#ff7a18]">SHOP</span>
              </span>
              <span className="text-[9px] text-zinc-400 font-medium mt-0.5">مرکز گیم و AI اورجینال</span>
            </div>
          </button>

          {/* Desktop Navigation Links (Pages) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navPages.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playClick(650, 0.04);
                    if (is404Active) onToggle404();
                    onNavigatePage(item.id);
                  }}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                      isActive ? 'bg-black text-amber-300' : 'bg-gradient-to-r from-purple-500 to-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* 404 Video Simulator Button */}
            <button
              onClick={() => {
                soundEngine.playFireIgnite();
                onToggle404();
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-300 flex items-center gap-1 ${
                is404Active 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
              title="مشاهده صفحه 404 سینماتیک با ویدیوی اختصاصی نبرد"
            >
              <AlertCircle className="w-3 h-3 text-red-400" />
              <span>{is404Active ? 'خروج از ۴۰۴' : '۴۰۴'}</span>
            </button>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* User Dashboard & Ticket Button */}
            <button
              onClick={() => {
                soundEngine.playClick(750, 0.05);
                onOpenUserPanel('profile');
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all shadow-sm"
              title="پنل کاربری و تیکت‌های پشتیبانی"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">پنل کاربری</span>
            </button>

            {/* Search Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenSearch();
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/5 shrink-0"
              title="جستجوی سریع محصولات"
              aria-label="جستجو"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Sound Synthesizer Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 border shrink-0 ${
                !isMuted 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
              title={isMuted ? 'فعال‌سازی افکت‌های صوتی و امبینت گیمینگ' : 'قطع صدا'}
              aria-label="صدا"
            >
              {!isMuted ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffa100]" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Cart Button with ID for Su-57 Fighter Jet Targeting */}
            <button
              id="navbar-cart-button"
              onClick={() => {
                soundEngine.playClick(500, 0.1);
                onOpenCart();
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="relative px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.45)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] transition-all duration-300 flex items-center gap-1.5 sm:gap-2 active:scale-95 shrink-0"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">سبد خرید</span>
              {cartCount > 0 ? (
                <span className="w-5 h-5 rounded-full bg-white text-orange-600 font-extrabold text-[11px] flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              ) : (
                <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center">
                  ۰
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 text-zinc-300 flex items-center justify-center"
              aria-label="منو موبایل"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-16 z-50 glass-card rounded-2xl p-4 shadow-2xl border border-white/10 bg-[#0d0918]/95 backdrop-blur-2xl">
          <div className="flex flex-col gap-2">
            {navPages.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playClick();
                  setMobileMenuOpen(false);
                  if (is404Active) onToggle404();
                  onNavigatePage(item.id);
                }}
                className={`text-right px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                  currentPage === item.id
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-zinc-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={() => {
                soundEngine.playClick();
                setMobileMenuOpen(false);
                onOpenUserPanel('tickets');
              }}
              className="text-right px-4 py-2.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-sm font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                <span>پنل کاربری و تیکت پشتیبانی</span>
              </div>
              <span className="text-xs font-bold">۲۴/۷</span>
            </button>
            
            <button
              onClick={() => {
                soundEngine.playFireIgnite();
                setMobileMenuOpen(false);
                onToggle404();
              }}
              className="text-right px-4 py-2.5 rounded-xl bg-red-500/10 text-red-300 border border-red-500/30 text-sm font-medium flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{is404Active ? 'خروج از صفحه ۴۰۴' : 'مشاهده صفحه ۴۰۴ سینماتیک با ویدیو نبرد'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
