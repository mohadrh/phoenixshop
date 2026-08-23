import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Copy, 
  Key, 
  Phone, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export const OrderTrackingPage: React.FC = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    soundEngine.playClick(750, 0.05);
    setHasSearched(true);
  };

  const handleCopyLicense = (code: string) => {
    soundEngine.playClick(600, 0.04);
    navigator.clipboard?.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-4xl mx-auto select-none">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
          <Package className="w-3.5 h-3.5 text-emerald-400" />
          <span>رهگیری و استعلام لحظه‌ای لایسنس</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
          پیگیری وضعیت سفارش
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          شماره سفارش یا شماره موبایلی که با آن خرید کرده‌اید را وارد کنید تا وضعیت لایسنس نمایش داده شود.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="مثلا: PHX-94821 یا شماره موبایل 0912..."
            className="w-full bg-[#0e0a1c] border border-white/15 rounded-2xl py-3.5 px-5 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 text-right shadow-2xl"
            dir="rtl"
          />
          <Search className="w-5 h-5 text-zinc-400 absolute top-4 right-4" />
          <button
            type="submit"
            className="absolute left-2 top-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-md hover:scale-105 transition-transform"
          >
            استعلام لایسنس
          </button>
        </div>
      </form>

      {/* Result Card Showcase */}
      {hasSearched ? (
        <div className="rounded-3xl bg-[#0e0a1d]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-right space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تحویل داده شده (موفق)</span>
            </span>
            <div>
              <span className="text-xs text-zinc-400 block">شناسه پیگیری سفارش:</span>
              <span className="text-sm font-bold text-white font-mono">{trackingCode || 'PHX-882194'}</span>
            </div>
          </div>

          {/* Timeline Stages */}
          <div className="grid grid-cols-3 gap-2 text-center py-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-emerald-500/30">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-black flex items-center justify-center mx-auto mb-1">✓</span>
              <span className="text-xs font-bold text-white block">پرداخت موفق</span>
              <span className="text-[10px] text-zinc-400">درگاه شاپرک</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-emerald-500/30">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-black flex items-center justify-center mx-auto mb-1">✓</span>
              <span className="text-xs font-bold text-white block">تولید لایسنس</span>
              <span className="text-[10px] text-zinc-400">سیستم خودکار ققنوس</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-emerald-500/30">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-black flex items-center justify-center mx-auto mb-1">✓</span>
              <span className="text-xs font-bold text-white block">ارسال به کاربر</span>
              <span className="text-[10px] text-zinc-400">پیامک و پنل کاربری</span>
            </div>
          </div>

          {/* License Code Box */}
          <div className="p-5 rounded-2xl bg-black/60 border border-amber-400/40 space-y-2">
            <span className="text-xs font-bold text-amber-300 block">کد لایسنس صادر شده:</span>
            <div className="flex items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <button
                onClick={() => handleCopyLicense('PHX-GPT4O-PRO-2026-VIP-9941')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? 'کپی شد!' : 'کپی لایسنس'}</span>
              </button>
              <span className="font-mono text-sm font-black text-amber-300">
                PHX-GPT4O-PRO-2026-VIP-9941
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              کد فوق را در بخش فعال‌سازی حساب خود وارد کنید یا در صورت نیاز به راهنمایی با پشتیبانی تماس بگیرید.
            </p>
          </div>

        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-[#0e0a1c] border border-white/10 text-center space-y-3">
          <Package className="w-12 h-12 text-zinc-500 mx-auto" />
          <h3 className="text-base font-bold text-white">برای مشاهده سفارش، کد پیگیری را در کادر بالا وارد کنید</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">کد پیگیری پس از پرداخت از طریق پیامک برای شما ارسال شده است.</p>
        </div>
      )}

    </div>
  );
};
