'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag, Search, Volume2, VolumeX, Menu, X,
  ShieldCheck, User, Ticket, Store, Package, HelpCircle, Wand2, Phone, BookOpen,
  ChevronDown,
  Bot, Palette, Send, GraduationCap, Gamepad2,
  Ghost,
} from 'lucide-react';
import { useCart, useFlight } from '../../app/providers';
import { sound } from '../../lib/sound';
import { CATEGORIES, PRODUCTS } from '../../data/catalog';
import { NUMBER_OFFERS } from '../../data/numbers';
import { ThemeToggle } from './ThemeToggle';
import type { CategorySlug } from '../../data/catalog';
import { asset } from '../../lib/asset';

/* آیکن هر دسته. عمداً آیکن است نه جلد محصول: جلد به موجود بودن
   تصویرِ یک محصول خاص وابسته است و اگر آن محصول تصویر نداشته باشد،
   خانه‌ی منو خالی می‌ماند — همان چیزی که در نسخه‌ی قبل افتاد. */
const SHOP_ICONS: Record<CategorySlug, typeof Store> = {
  ai: Bot,
  creative: Palette,
  social: Send,
  education: GraduationCap,
  gaming: Gamepad2,
};

/**
 * نوبار شناور — پورت مستقیم طراحی نسخه‌ی قبلی.
 *
 * کلاس‌ها عیناً همان‌اند. تنها تفاوت‌ها ساختاری‌اند و ناگزیر:
 * روتینگ به next/link رفته، و دکمه‌ی پنل کاربری طبق درخواست بعدی
 * فقط آیکن است. دکمه‌ی نمایش ۴۰۴ هم حالا یک لینک واقعی به روت است.
 */
export function Navbar({
  onOpenSearch,
  onOpenAssistant,
}: {
  onOpenSearch?: () => void;
  onOpenAssistant?: () => void;
}) {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const { registerCartAnchor } = useFlight();

  const [soundOn, setSoundOn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  /* زیرمنوی فروشگاه. با هاور باز می‌شود ولی با فوکوس صفحه‌کلید هم —
     منویی که فقط با ماوس باز شود برای کاربر کیبورد وجود ندارد. */
  const [shopOpen, setShopOpen] = useState(false);
  const cartRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    sound.init();
    return sound.subscribe(setSoundOn);
  }, []);

  /* موقعیت سبد را برای مقصد پرواز سوخو ثبت و روی اسکرول به‌روز نگه می‌داریم */
  const syncAnchor = useCallback(() => {
    const el = cartRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    registerCartAnchor({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }, [registerCartAnchor]);

  useEffect(() => {
    syncAnchor();
    window.addEventListener('scroll', syncAnchor, { passive: true });
    window.addEventListener('resize', syncAnchor);
    return () => {
      window.removeEventListener('scroll', syncAnchor);
      window.removeEventListener('resize', syncAnchor);
    };
  }, [syncAnchor]);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  /* زیرمنو از خود کاتالوگ ساخته می‌شود، نه فهرست دستی: دسته‌ی تازه
     که اضافه شود، خودش اینجا ظاهر می‌شود. */
  const shopMenu = [
    ...[...CATEGORIES].sort((a, b) => a.order - b.order).map((c) => {
      const inCat = PRODUCTS.filter((p) => p.category === c.slug);
      /* تصویر از پرفروش‌ترین محصول همان دسته می‌آید — یعنی همان چیزی
         که بیشتر مردم دنبالش‌اند، نه یک آیکن انتزاعی */
      return {
        href: `/shop/${c.slug}`,
        title: c.title,
        tagline: c.tagline,
        accent: c.accent,
        count: inCat.length,
        Icon: SHOP_ICONS[c.slug],
      };
    }),
    {
      href: '/numbers',
      title: 'شماره مجازی',
      tagline: 'یک‌بارمصرف، اجاره‌ای و دائمی از هشت کشور',
      accent: '#4aa3e8',
      count: NUMBER_OFFERS.filter((o) => o.stock > 0).length,
      Icon: Phone,
    },
  ];

  const navPages = [
    { href: '/shop', label: 'فروشگاه', full: 'فروشگاه و فیلترهای پیشرفته', icon: <Store className="w-3.5 h-3.5 text-purple-400" />, badge: 'فول' },
    { href: '/numbers', label: 'شماره مجازی', full: 'شماره مجازی برای ثبت‌نام', icon: <Phone className="w-3.5 h-3.5 text-sky-400" />, badge: 'جدید' },
    { href: '/track', label: 'پیگیری', full: 'پیگیری سفارش', icon: <Package className="w-3.5 h-3.5 text-blue-400" /> },
    { href: '/faq', label: 'سوالات متداول', full: 'سوالات متداول', icon: <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> },
    { href: '/blog', label: 'مقالات', full: 'مقالات و راهنماها', icon: <BookOpen className="w-3.5 h-3.5 text-amber-400" />, wide: true },
  ];

  return (
    <>
      <header className="fixed top-3 left-0 right-0 z-40 flex justify-center px-3 sm:px-6 transition-all duration-300">
        <nav
          className="glass-pill flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 py-2 rounded-full w-full max-w-6xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-2xl"
          /* رنگ از توکن می‌آید نه درون‌خطی — استایل درون‌خطی را CSS
             نمی‌تواند بازنویسی کند و نوبار در حالت روشن تیره می‌ماند. */
          style={{ background: 'var(--nav-bg)' }}
        >
          {/* برند */}
          <Link
            href="/"
            onClick={() => sound.click()}
            className="flex items-center gap-2.5 focus:outline-none group text-right shrink-0"
            title="فونیکس شاپ | بازگشت به بالا"
          >
            <img
              src={asset('/brand/phoenix-logo.png')}
              alt=""
              draggable={false}
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain select-none drop-shadow-[0_0_14px_rgba(255,65,108,0.6)] transition-transform duration-300 group-hover:scale-110"
            />
            <div className="hidden sm:flex flex-col text-right leading-none">
              <span className="text-white font-extrabold text-sm tracking-wider">
                PHOENIX <span className="text-[#ff7a18]">SHOP</span>
              </span>
              <span className="text-[9px] text-zinc-400 font-medium mt-0.5">
                گیم و AI
              </span>
            </div>
          </Link>

          {/* لینک‌های دسکتاپ */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navPages.map((item) => {
              const isActive = pathname === item.href;
              const hasMenu = item.href === '/shop';

              if (hasMenu) {
                return (
                  <div
                    key={item.href}
                    className="navshop"
                    onMouseEnter={() => { setShopOpen(true); sound.hover(); }}
                    onMouseLeave={() => setShopOpen(false)}
                    onFocusCapture={() => setShopOpen(true)}
                    onBlurCapture={(e) => {
                      // فقط وقتی فوکوس واقعاً از کل منو بیرون رفت
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setShopOpen(false);
                    }}
                  >
                    <Link
                      href={item.href}
                      title={item.full}
                      onClick={() => { sound.click(); setShopOpen(false); }}
                      aria-expanded={shopOpen}
                      className={`relative px-2.5 py-2 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                        pathname.startsWith('/shop') ? 'text-white' : 'text-zinc-400 hover:text-zinc-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
                      {pathname.startsWith('/shop') && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 inset-x-3 h-[2px] rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_rgba(245,158,11,0.9)]"
                        />
                      )}
                    </Link>

                    <div className={`navshop__panel ${shopOpen ? 'is-open' : ''}`}>
                      <div className="navshop__grid">
                        {shopMenu.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={() => { sound.click(); setShopOpen(false); }}
                            onMouseEnter={() => sound.hover()}
                            className="navshop__item"
                            style={{ ['--c-accent' as string]: c.accent }}
                          >
                            <span className="navshop__art">
                              <c.Icon className="w-6 h-6" />
                            </span>

                            <span className="navshop__body">
                              <b>{c.title}</b>
                              <small>{c.tagline}</small>
                            </span>

                            <span className="navshop__count num-en">
                              {c.count.toLocaleString('fa-IR')}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <Link
                        href="/shop"
                        onClick={() => { sound.click(); setShopOpen(false); }}
                        className="navshop__all"
                      >
                        دیدن همه‌ی محصولات با فیلتر پیشرفته
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.full}
                  onClick={() => sound.click()}
                  onMouseEnter={() => sound.hover()}
                  className={`relative px-2.5 py-2 text-xs font-bold transition-all duration-200 items-center gap-1.5 whitespace-nowrap ${
                    item.wide ? 'hidden xl:flex' : 'flex'
                  } ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-[1px] rounded-full font-bold leading-tight bg-gradient-to-r from-purple-500 to-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}

                  {/* حالت فعال: خط زیرین درخشان، نه قرص رنگی */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 inset-x-3 h-[2px] rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_rgba(245,158,11,0.9)]"
                    />
                  )}
                </Link>
              );
            })}

            {/* دستیار خرید — از منو باز می‌شود، نه از گوشه‌ی صفحه */}
            <button
              type="button"
              onClick={() => { sound.click(); onOpenAssistant?.(); }}
              onMouseEnter={() => sound.hover()}
              className="group relative mr-1 px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap
                         text-xs font-bold text-amber-200 bg-amber-500/10 border border-amber-500/30
                         hover:text-white hover:border-amber-400/60 hover:bg-amber-500/20
                         hover:shadow-[0_0_18px_rgba(245,158,11,0.35)] transition-all duration-200 active:scale-95"
              title="نمی‌دانی کدام را بخری؟ دو سؤال می‌پرسیم و پیشنهاد می‌دهیم"
            >
              <Wand2 className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
              <span>دستیار خرید</span>
            </button>
          </div>

          {/* کنش‌ها */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* پنل کاربری — فقط آیکن */}
            <Link
              href="/account"
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border border-white/10 flex items-center justify-center transition-all shadow-sm shrink-0"
              title="پنل کاربری و تیکت‌های پشتیبانی"
              aria-label="پنل کاربری"
            >
              <User className="w-4 h-4 text-amber-400" />
            </Link>

            {/* جست‌وجو */}
            <button
              type="button"
              onClick={() => { sound.click(); onOpenSearch?.(); }}
              onMouseEnter={() => sound.hover()}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/5 shrink-0"
              title="جست‌وجوی سریع محصولات — Ctrl+K"
              aria-label="جست‌وجو"
            >
              <Search className="w-4 h-4" />
            </button>

            <ThemeToggle />

            {/* صدا */}
            <button
              onClick={() => sound.toggle()}
              aria-pressed={soundOn}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 border shrink-0 ${
                soundOn
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
              title={soundOn ? 'قطع صدا' : 'فعال‌سازی افکت‌های صوتی'}
              aria-label="صدا"
            >
              {soundOn
                ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffa100]" />
                : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* سبد — هدف پرواز سوخو */}
            <button
              ref={cartRef}
              id="navbar-cart-button"
              onClick={() => { sound.click(); openCart(); }}
              onMouseEnter={() => sound.hover()}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white grid place-items-center shadow-[0_0_20px_rgba(245,158,11,0.45)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] transition-all duration-300 active:scale-95 shrink-0"
              aria-label={`سبد خرید، ${count} کالا`}
              title="سبد خرید"
            >
              <ShoppingBag className="w-4 h-4" />
              {/* شمارنده روی گوشه — متن دکمه حذف شد چون نوبار را سرریز می‌کرد */}
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-orange-600 font-extrabold text-[10px] flex items-center justify-center shadow-md ring-2 ring-[#0a0813]">
                  {count.toLocaleString('fa-IR')}
                </span>
              )}
            </button>

            {/* منوی موبایل */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 text-zinc-300 flex items-center justify-center"
              aria-expanded={mobileMenuOpen}
              aria-label="منو موبایل"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* کشوی موبایل */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-16 z-50 glass-card rounded-2xl p-4 shadow-2xl border border-white/10 bg-[#0d0918]/95 backdrop-blur-2xl">
          <div className="flex flex-col gap-2">
            {navPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => { sound.click(); setMobileMenuOpen(false); }}
                className={`relative text-right px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                  pathname === item.href
                    ? 'text-white bg-white/[0.06] border-r-2 border-amber-400'
                    : 'text-zinc-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.full}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => { sound.click(); setMobileMenuOpen(false); onOpenAssistant?.(); }}
              className="text-right px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-200 border border-amber-500/30
                         text-sm font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                <span>دستیار خرید</span>
              </div>
              <span className="text-[10px] font-bold text-amber-400">پیشنهاد هوشمند</span>
            </button>

            {/* میان‌بر صفحه‌ی ۴۰۴ — فقط برای دیدن و ویرایش طراحی‌اش.
                قبل از انتشار عمومی باید برداشته شود. */}
            <Link
              href="/preview-404"
              onClick={() => { sound.click(); setMobileMenuOpen(false); }}
              className="text-right px-4 py-2.5 rounded-xl bg-white/[0.04] text-zinc-400 border border-dashed border-white/15
                         text-sm font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Ghost className="w-4 h-4" />
                <span>صفحه‌ی ۴۰۴</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-600">پیش‌نمایش</span>
            </Link>

            <Link
              href="/account/tickets"
              onClick={() => { sound.click(); setMobileMenuOpen(false); }}
              className="text-right px-4 py-2.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-sm font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                <span>پنل کاربری و تیکت پشتیبانی</span>
              </div>
              <span className="text-xs font-bold">۲۴/۷</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
