'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Zap, Headphones, ArrowUp, Send, Instagram,
  MessageCircle, Heart, Ticket, UserCheck, Sparkles, CheckCircle,
} from 'lucide-react';
import { sound } from '../../lib/sound';

/**
 * فوتر — پورت مستقیم طراحی نسخه‌ی قبلی.
 * کلاس‌ها عیناً همان‌اند؛ فقط ناوبری به next/link رفته و
 * `border-white/8` که Tailwind تولیدش نمی‌کرد به مقدار دلخواه تبدیل شد.
 */

const PROMISES = [
  {
    icon: Zap,
    title: 'تحویل تمام‌اتوماتیک آنی',
    text: 'ارسال مشخصات اکانت بلافاصله پس از پرداخت',
    ring: 'hover:border-amber-400/50',
    box: 'bg-orange-500/10 border-orange-500/30',
    ic: 'text-orange-400 animate-pulse',
    hov: 'group-hover:text-amber-300',
  },
  {
    icon: ShieldCheck,
    title: 'گارانتی تعویض مادام‌العمر',
    text: 'تضمین اصالت قانونی و عدم مسدود شدن',
    ring: 'hover:border-emerald-400/50',
    box: 'bg-emerald-500/10 border-emerald-500/30',
    ic: 'text-emerald-400',
    hov: 'group-hover:text-emerald-300',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی ۲۴ ساعته',
    text: 'پاسخگویی سریع در تلگرام و تیکت سایت',
    ring: 'hover:border-rose-400/50',
    box: 'bg-rose-500/10 border-rose-500/30',
    ic: 'text-rose-400',
    hov: 'group-hover:text-rose-300',
  },
  {
    icon: Heart,
    title: 'باشگاه مشتریان وفادار',
    text: 'تخفیف‌های ویژه و کش‌بک در هر سفارش',
    ring: 'hover:border-purple-400/50',
    box: 'bg-purple-500/10 border-purple-500/30',
    ic: 'text-purple-400',
    hov: 'group-hover:text-purple-300',
  },
];

const SOCIALS = [
  { icon: Send, title: 'تلگرام فونیکس شاپ', cls: 'hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-400/50', ic: 'text-cyan-400' },
  { icon: Instagram, title: 'اینستاگرام فونیکس شاپ', cls: 'hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/50', ic: 'text-rose-400' },
  { icon: MessageCircle, title: 'دیسکورد فونیکس شاپ', cls: 'hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-400/50', ic: 'text-purple-400' },
];

const linkCls =
  'hover:text-amber-400 transition-colors hover:translate-x-[-4px] inline-flex items-center gap-1.5';

export function SiteFooter() {
  const scrollToTop = () => {
    sound.phoenix();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-amber-500/20 bg-gradient-to-b from-[#090514] via-[#06030c] to-[#020105] text-right pt-16 pb-12 select-none overflow-hidden">
      {/* پرتو نور بالای فوتر */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 animate-pulse" />
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-24 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* نوار تعهدها */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/[0.08]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROMISES.map(({ icon: Icon, title, text, ring, box, ic, hov }) => (
            <div
              key={title}
              onMouseEnter={() => sound.hover()}
              className={`group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] ${ring} hover:bg-white/[0.06] flex items-center gap-4 transition-all duration-300 hover:-translate-y-1.5 shadow-lg cursor-pointer`}
            >
              <div className={`w-12 h-12 rounded-xl ${box} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${ic}`} />
              </div>
              <div>
                <h5 className={`text-sm font-black text-white mb-0.5 ${hov} transition-colors`}>{title}</h5>
                <p className="text-xs text-zinc-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* لینک‌های اصلی */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-x-5 gap-y-8 [&>*:first-child]:col-span-2 md:[&>*:first-child]:col-span-1">
        {/* برند */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <img
              src="/brand/phoenix-logo.png"
              alt=""
              draggable={false}
              className="w-12 h-12 object-contain select-none drop-shadow-[0_0_12px_rgba(255,65,108,0.5)]"
            />
            <span className="flex flex-col leading-none">
              <span className="text-white font-extrabold text-base tracking-wider">
                PHOENIX <span className="text-[#ff7a18]">SHOP</span>
              </span>
              <span className="text-[10px] text-zinc-400 mt-1">مرکز گیم و AI اورجینال</span>
            </span>
          </Link>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
            اشتراک‌هایی که از ایران نمی‌شود خرید، اینجا با کارت بانکی خودت خریده
            می‌شوند. روی حساب شخصی خودت فعال می‌شوند، رمزت را هیچ‌وقت نمی‌خواهیم،
            و تا آخرین روز اشتراک پشتش هستیم.
          </p>

          <div className="flex items-center gap-2.5 pt-2 flex-wrap">
            {SOCIALS.map(({ icon: Icon, title, cls, ic }) => (
              <a
                key={title}
                href="#"
                onClick={(e) => { e.preventDefault(); sound.click(); }}
                className={`w-10 h-10 rounded-2xl bg-white/5 text-zinc-300 flex items-center justify-center transition-all duration-300 border border-white/10 hover:scale-110 shadow-md ${cls}`}
                title={title}
              >
                <Icon className={`w-4 h-4 ${ic}`} />
              </a>
            ))}

            <div className="mr-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>سرورها آنلاین</span>
            </div>
          </div>
        </div>

        {/* دسترسی سریع و پنل کاربری — روی موبایل کنار هم، نه زیر هم.
            هر دو فهرست لینک کوتاه‌اند و در نصف عرض جا می‌شوند؛ زیر هم
            گذاشتنشان فقط فوتر را دو برابر بلند می‌کرد. */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>دسترسی سریع</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li><Link href="/shop/ai" className={linkCls} onClick={() => sound.click()}>مرکز هوش مصنوعی</Link></li>
            <li><Link href="/#vip-journey" className={linkCls} onClick={() => sound.click()}>باشگاه مشتریان</Link></li>
            <li><Link href="/#hot-deals" className={linkCls} onClick={() => sound.click()}>پیشنهادهای داغ</Link></li>
            <li><Link href="/shop/gaming" className={linkCls} onClick={() => sound.click()}>اکانت‌های قانونی بازی</Link></li>
            <li><Link href="/blog" className={linkCls} onClick={() => sound.click()}>مقالات و راهنماها</Link></li>
          </ul>
        </div>

        {/* پنل کاربری */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>پنل کاربری و پشتیبانی</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li>
              <Link href="/account/overview" className={linkCls} onClick={() => sound.click()}>
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>حساب کاربری و موجودی</span>
              </Link>
            </li>
            <li>
              <Link href="/account/tickets" className={linkCls} onClick={() => sound.click()}>
                <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                <span>ارسال تیکت پشتیبانی ۲۴/۷</span>
              </Link>
            </li>
            <li><Link href="/account/orders" className={linkCls} onClick={() => sound.click()}>پیگیری سفارش‌ها و لایسنس‌ها</Link></li>
            <li><Link href="/rules" className={linkCls} onClick={() => sound.click()}>شرایط گارانتی و تعویض</Link></li>
          </ul>
        </div>

        {/* نمادهای اعتماد */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>نمادهای اعتماد</span>
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center hover:border-amber-400/40 transition-all hover:scale-105">
              <span className="text-[10px] text-zinc-400 block mb-1">نماد الکترونیکی</span>
              <span className="text-xs font-bold text-amber-400">در حال دریافت</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center hover:border-emerald-400/40 transition-all hover:scale-105">
              <span className="text-[10px] text-zinc-400 block mb-1">درگاه پرداخت</span>
              <span className="text-xs font-bold text-emerald-400">بانکی امن</span>
            </div>
          </div>
        </div>
      </div>

      {/* پاورقی */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div>
          تمامی حقوق متعلق به{' '}
          <span className="text-zinc-200 font-black">فونیکس شاپ (Phoenix Shop)</span> است
        </div>

        <button
          onClick={scrollToTop}
          onMouseEnter={() => sound.hover()}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
        >
          <span>بازگشت به ابتدای صفحه</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
