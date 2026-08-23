'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Check, Copy, Flag, Gift, Lock, Sparkles, Trophy, Zap } from 'lucide-react';
import { useCart } from '../../app/providers';
import { sound } from '../../lib/sound';
import { LevelUpGame } from './LevelUpGame';

/**
 * باشگاه مشتریان — پورت طراحی نسخه‌ی قبلی، با چهار سطح لویالتی.
 *
 * یک تفاوت عمدی با نسخه‌ی اصلی: آنجا مبلغ خرید یک اسلایدر دستی بود که
 * کاربر خودش جابه‌جا می‌کرد. حالا از جمع واقعی سبد خوانده می‌شود — با هر
 * چیزی که اضافه می‌کنی نوار همان لحظه جلو می‌رود. همین چیزی است که یک
 * «بازی» را از یک جدول تزئینی جدا می‌کند.
 */

const fmt = (n: number) => n.toLocaleString('fa-IR');

interface Stage {
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

const STAGES: Stage[] = [
  {
    level: 1,
    name: 'سطح برنزی — شروع پرواز',
    enName: 'Bronze Pilot',
    badge: 'خرید تا ۱ میلیون',
    icon: '🥉',
    minSpend: 0,
    maxSpend: 1_000_000,
    cashbackPercent: 0,
    discountCode: 'PHOENIX20',
    discountPercent: 20,
    deliverySpeed: 'زیر ۲ دقیقه',
    color: '#f59e0b',
    gradient: 'from-amber-600 to-orange-700',
    borderColor: 'border-amber-600/40',
    perks: [
      'صدور آنی کد فعال‌سازی یا لایسنس',
      'پشتیبانی تیکتی و آنلاین در تمام روزهای هفته',
      'گارانتی تعویض و بازگشت وجه در صورت مشکل',
      'کوپن تخفیف خوش‌آمدگویی',
    ],
    exclusiveBonus: 'دسترسی به تمام سرویس‌ها با پایین‌ترین کارمزد',
  },
  {
    level: 2,
    name: 'سطح نقره‌ای — خریدار وفادار',
    enName: 'Silver Explorer',
    badge: 'خرید ۱ تا ۳ میلیون',
    icon: '🥈',
    minSpend: 1_000_000,
    maxSpend: 3_000_000,
    cashbackPercent: 5,
    discountCode: 'PHOENIX-VIP5',
    discountPercent: 5,
    deliverySpeed: 'زیر ۱ دقیقه',
    color: '#94a3b8',
    gradient: 'from-slate-400 to-zinc-600',
    borderColor: 'border-slate-400/40',
    perks: [
      'کش‌بک نقدی مستقیم به کیف پول روی تمام سفارش‌ها',
      'کد تخفیف اختصاصی دائمی برای خریدهای بعدی',
      'اولویت بالا در صف پردازش و ارسال لایسنس',
      'عضویت در کانال تخفیف‌های ویژه‌ی هفتگی',
    ],
    exclusiveBonus: 'اعتبار هدیه‌ی نقدی در کیف پول برای هر خرید',
  },
  {
    level: 3,
    name: 'سطح طلایی — پرو گیمر',
    enName: 'Gold Pro Gamer',
    badge: 'خرید ۳ تا ۷ میلیون',
    icon: '🥇',
    minSpend: 3_000_000,
    maxSpend: 7_000_000,
    cashbackPercent: 10,
    discountCode: 'VIP10',
    discountPercent: 10,
    deliverySpeed: 'زیر ۴۵ ثانیه',
    color: '#eab308',
    gradient: 'from-yellow-400 to-amber-600',
    borderColor: 'border-yellow-400/50',
    perks: [
      'کش‌بک نقدی روی هر سفارش به کیف پول',
      'پشتیبانی ویژه با اولویت بدون معطلی',
      'اکانت‌های کاملاً اختصاصی با تضمین عدم قطعی',
      'لایسنس هدیه‌ی ماهانه و کوپن تخفیف',
    ],
    exclusiveBonus: 'پشتیبانی مستقیم ویژه و بازگشت بخشی از مبلغ خرید',
  },
  {
    level: 4,
    name: 'الماس فونیکس',
    enName: 'Phoenix Diamond Elite',
    badge: 'خرید بالای ۷ میلیون',
    icon: '💎',
    minSpend: 7_000_000,
    maxSpend: 15_000_000,
    cashbackPercent: 15,
    discountCode: 'PHOENIX-DIAMOND',
    discountPercent: 15,
    deliverySpeed: 'تحویل اختصاصی زیر ۲۰ ثانیه',
    color: '#38bdf8',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    borderColor: 'border-cyan-400/60',
    perks: [
      'تخفیف دائمی روی تمام محصولات بدون سقف',
      'تحویل اختصاصی فوق‌سریع با سرور جدا',
      'مدیر حساب اختصاصی و پشتیبانی مستقیم',
      'دسترسی زودهنگام به پیش‌فروش‌ها',
    ],
    exclusiveBonus: 'حداکثر تخفیف دائمی به‌همراه مدیر حساب اختصاصی',
  },
];

export function PurchaseJourneyGame() {
  const { subtotal, openCart } = useCart();
  const [copied, setCopied] = useState<string | null>(null);

  /* سطح فعلی از جمع سبد — نه از اسلایدر دستی */
  const currentIndex = STAGES.reduce(
    (acc, st, i) => (subtotal >= st.minSpend ? i : acc),
    0
  );
  const current = STAGES[currentIndex];
  const next = STAGES[currentIndex + 1];
  const remaining = next ? next.minSpend - subtotal : 0;

  const progress = next
    ? Math.min(100, ((subtotal - current.minSpend) / (next.minSpend - current.minSpend)) * 100)
    : 100;

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      sound.success();
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* کلیپ‌بورد ممکن است بدون تعامل کاربر رد شود؛
         کد روی صفحه دیده می‌شود و دستی قابل کپی است */
    }
  };

  /* پرچم‌هایی که در بازی زده شده‌اند. سطحی که با خرید واقعی باز شده
     همیشه روشن است؛ بازی فقط می‌تواند سطح‌های بعدی را «پیش‌نمایش» کند،
     نه اینکه سطحی را که خریده‌ای خاموش کند. */
  const [flagged, setFlagged] = useState<boolean[]>([false, false, false, false]);

  const onFlag = useCallback((i: number) => {
    setFlagged((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }, []);

  /* چند سطح با خرید واقعی باز شده — برای نشانه‌های نوار بازی */
  const unlockedByCart = useMemo(
    () => STAGES.filter((st) => subtotal >= st.minSpend).length,
    [subtotal]
  );

  return (
    <section id="vip-journey" className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-100">
      {/* سربرگ */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4">
          <Trophy className="w-3.5 h-3.5" />
          <span>باشگاه مشتریان فونیکس</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
          هر خرید، یک لول بالاتر
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
          نوار پایین از روی سبد فعلی حساب می‌شود. هر چیزی اضافه کنی، همین‌جا و
          همین لحظه جلو می‌رود — لازم نیست جایی ثبت‌نام کنی تا ببینی کجایی.
        </p>
      </div>

      {/* بازی و کارت‌ها کنار هم، نه زیر هم.

          قبلاً بازی بالا بود و کارت‌ها پایین، و رابطه‌شان دیده نمی‌شد:
          پرچم که رد می‌شد، کارتی روشن می‌شد که اصلاً در قاب نبود. حالا
          هر دو هم‌زمان در دیدند و علت و معلول کنار هم می‌افتند. */}
      <div className="pj__split">
        <div className="pj__game">
          <LevelUpGame onFlag={onFlag} unlockedByCart={unlockedByCart} />

          {/* چهار بولت زیر بازی — نشان می‌دهد چند پرچم رد شده */}
          <div className="pj__bullets">
            {STAGES.map((st, i) => (
              <span
                key={st.level}
                className={`pj__bullet ${flagged[i] ? 'is-on' : ''}`}
                style={{ ['--b-color' as string]: st.color }}
                title={st.name}
              >
                <i />
              </span>
            ))}
          </div>

          {/* نوار پیشرفت زیر بازی می‌نشیند، نه در سکشن جدا.

             دو دلیل: ستون بازی کوتاه‌تر از ستون کارت‌هاست و زیرش فضای
             مرده می‌ماند؛ و مفهوماً هم اینجا جایش است — بازی پیشرفت
             نمادین را نشان می‌دهد و این نوار پیشرفت واقعی را. */}
          <div className="p-4 rounded-2xl bg-[#0d091a]/90 border border-white/10 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">{current.icon}</span>
                <div>
                  <div className="text-sm font-black text-white">{current.name}</div>
                  <div className="text-[11px] text-zinc-500">{current.enName}</div>
                </div>
              </div>

              {next ? (
                <div className="text-xs text-zinc-400 mr-auto sm:mr-0">
                  <b className="text-amber-300 num-en">{fmt(remaining)}</b> تومان تا {next.name}
                </div>
              ) : (
                <div className="text-xs text-cyan-300 font-bold mr-auto sm:mr-0">
                  بالاترین سطح باشگاه — همه‌ی مزایا فعال است
                </div>
              )}
            </div>

            <div
              className="h-2.5 rounded-full bg-black/50 border border-white/5 overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full bg-gradient-to-r ${current.gradient} transition-all duration-700 ease-out`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-zinc-500">
              <span>
                مجموع سبد شما: <b className="text-zinc-300 num-en">{fmt(subtotal)}</b> تومان
              </span>
              {subtotal === 0 && (
                <button
                  type="button"
                  onClick={openCart}
                  className="text-amber-300 underline hover:text-amber-200"
                >
                  سبد خالی است
                </button>
              )}
            </div>
          </div>
        </div>

        {/* نیمه‌ی دوم: چهار سطح باشگاه */}
        <div className="pj__cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STAGES.map((st, i) => {
          const boughtUnlock = subtotal >= st.minSpend;
          /* پرچم بازی سطح را «نمایش» می‌دهد؛ باز شدن واقعی همچنان با خرید
             است. تفاوتشان روی کارت با یک برچسب مشخص می‌شود تا کسی فکر
             نکند با بازی کردن تخفیف گرفته. */
          const previewed = flagged[i] && !boughtUnlock;
          const unlocked = boughtUnlock || previewed;
          const isCurrent = i === currentIndex;

          return (
            <div
              key={st.level}
              className={`relative flex flex-col rounded-3xl p-5 bg-gradient-to-b from-[#140b24] via-[#0d0718] to-[#08040f] border transition-all duration-500 ${
                isCurrent
                  ? `${st.borderColor} shadow-[0_18px_45px_rgba(0,0,0,0.85)] -translate-y-1.5`
                  : 'border-white/[0.08]'
              } ${unlocked ? 'opacity-100' : 'opacity-55'}`}
            >
              {/* هاله‌ی رنگ سطح */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                style={{ background: `${st.color}33` }}
                aria-hidden="true"
              />

              {isCurrent && (
                <span className="absolute top-4 left-4 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-white backdrop-blur-sm">
                  سطح فعلی
                </span>
              )}

              {previewed && !isCurrent && (
                <span className="absolute top-4 left-4 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-bold text-rose-200 backdrop-blur-sm">
                  پرچمش را زدی
                </span>
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl" aria-hidden="true">{st.icon}</span>
                  <span
                    className={`w-8 h-8 rounded-xl grid place-items-center border ${
                      boughtUnlock
                        ? 'border-emerald-500/40 bg-emerald-500/15'
                        : previewed
                          ? 'border-rose-500/40 bg-rose-500/15'
                          : 'border-white/10 bg-white/5'
                    }`}
                  >
                    {boughtUnlock
                      ? <Check className="w-4 h-4 text-emerald-400" />
                      : previewed
                        ? <Flag className="w-3.5 h-3.5 text-rose-300" />
                        : <Lock className="w-3.5 h-3.5 text-zinc-500" />}
                  </span>
                </div>

                <h3 className="text-sm font-black text-white mb-0.5">{st.name}</h3>
                <div className="text-[11px] text-zinc-500 mb-1">{st.enName}</div>
                <div className="text-[11px] font-bold mb-4" style={{ color: st.color }}>
                  {st.badge}
                </div>

                {/* آمار سطح */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
                    <div className="text-[9px] text-zinc-500 mb-0.5">کش‌بک</div>
                    <div className="text-xs font-black num-en" style={{ color: st.color }}>
                      {st.cashbackPercent > 0 ? `${fmt(st.cashbackPercent)}٪` : '—'}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
                    <div className="text-[9px] text-zinc-500 mb-0.5">تحویل</div>
                    <div className="text-[10px] font-bold text-emerald-300 flex items-center justify-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" />
                      {st.deliverySpeed}
                    </div>
                  </div>
                </div>

                {/* مزایا */}
                <ul className="space-y-1.5 mb-4">
                  {st.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-1.5 text-[11px] text-zinc-400 leading-relaxed">
                      <Check className="w-3 h-3 mt-0.5 shrink-0" style={{ color: st.color }} />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                {/* پاداش اختصاصی */}
                <div
                  className="p-2.5 rounded-xl border text-[10px] leading-relaxed mb-3"
                  style={{ background: `${st.color}14`, borderColor: `${st.color}40`, color: st.color }}
                >
                  <Sparkles className="w-3 h-3 inline-block ml-1" />
                  {st.exclusiveBonus}
                </div>

                {/* کد تخفیف */}
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => copy(st.discountCode)}
                  className={`w-full py-2 rounded-xl border border-dashed text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    unlocked
                      ? 'cursor-pointer hover:bg-white/5'
                      : 'cursor-not-allowed opacity-50 border-solid'
                  }`}
                  style={{ borderColor: `${st.color}66`, color: st.color }}
                >
                  {copied === st.discountCode ? (
                    <><Check className="w-3 h-3" /> کپی شد</>
                  ) : unlocked ? (
                    <><Copy className="w-3 h-3" /> <span className="code-en">{st.discountCode}</span></>
                  ) : (
                    <><Gift className="w-3 h-3" /> با خرید بیشتر باز می‌شود</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
        </div>
      </div>

      <p className="flex items-start gap-2 mt-6 text-[11px] text-zinc-500 max-w-3xl">
        <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
        <span>کدهای تخفیف در مرحله‌ی پرداخت اعمال می‌شوند و با گارانتی محصول تداخلی ندارند.</span>
      </p>
    </section>
  );
}
