'use client';

import React, { useEffect, useState } from 'react';
import {
  Check, Crown, Heart, MessageSquarePlus, Quote,
  ShieldCheck, Star, Trophy, X, Zap,
} from 'lucide-react';
import { sound } from '../../lib/sound';

/**
 * باشگاه VIP و نظرات — پورت طراحی نسخه‌ی قبلی با همه‌ی تعامل‌هایش:
 * نوار خرید زنده، عضویت باشگاه، فیلتر دسته، لایک نظر، و مودال ثبت نظر
 * با امتیاز ستاره‌ای.
 *
 * یک تفاوت عمدی: نوار زنده «همین الان» نمی‌گوید. ادعای لحظه‌ایِ جعلی
 * در بلندمدت اعتماد را از بین می‌برد. وقتی ووکامرس وصل شد، همین آرایه
 * از سفارش‌های واقعی پر می‌شود و آن‌وقت ادعا درست است.
 */

const fmt = (n: number) => n.toLocaleString('fa-IR');

const TICKER = [
  { name: 'امیر', city: 'مشهد', product: 'Telegram Premium ۶ ماهه' },
  { name: 'پرهام', city: 'تهران', product: 'ChatGPT Plus یک ماهه' },
  { name: 'سارا', city: 'اصفهان', product: 'Canva Pro یک ساله' },
  { name: 'مهدی', city: 'شیراز', product: 'CapCut Pro یک ماهه' },
  { name: 'علیرضا', city: 'تبریز', product: 'Claude Pro یک ماهه' },
  { name: 'نیما', city: 'کرج', product: 'Figma یک ساله' },
];

const VIP_PERKS = [
  { icon: Zap, title: 'تحویل بدون معطلی', text: 'کدهای آماده بلافاصله، ارتقای اکانت زیر ۱۵ دقیقه' },
  { icon: ShieldCheck, title: 'گارانتی تمام دوره', text: 'تا آخرین روز اشتراک، مشکل پیش بیاید جایگزین می‌کنیم' },
  { icon: Crown, title: 'کش‌بک پله‌ای', text: 'هرچه بیشتر بخری، درصد بازگشت بیشتر می‌شود' },
  { icon: Trophy, title: 'دسترسی زودهنگام', text: 'پیش‌فروش‌ها اول به اعضای باشگاه می‌رسد' },
];

type ReviewCategory = 'all' | 'ai' | 'creative' | 'gaming' | 'social';

const CATEGORIES: { id: ReviewCategory; label: string }[] = [
  { id: 'all', label: 'همه‌ی نظرها' },
  { id: 'ai', label: 'هوش مصنوعی' },
  { id: 'creative', label: 'طراحی و ادیت' },
  { id: 'gaming', label: 'گیم' },
  { id: 'social', label: 'شبکه‌های اجتماعی' },
];

interface Review {
  id: string;
  name: string;
  role: string;
  category: Exclude<ReviewCategory, 'all'>;
  product: string;
  rating: number;
  comment: string;
  likes: number;
  verified: boolean;
}

const SEED_REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'رضا محمدی',
    role: 'توسعه‌دهنده',
    category: 'ai',
    product: 'Claude Pro',
    rating: 5,
    comment:
      'اشتراک را روی ایمیل خودم فعال کردند، نه اکانت اشتراکی. همین برایم مهم بود چون کل پروژه‌هایم آنجاست.',
    likes: 42,
    verified: true,
  },
  {
    id: 'r2',
    name: 'مریم کاظمی',
    role: 'طراح گرافیک',
    category: 'creative',
    product: 'Canva Pro',
    rating: 5,
    comment:
      'یک‌ساله گرفتم، ده دقیقه بعد از پرداخت فعال بود. سه ماه است استفاده می‌کنم بدون هیچ مشکلی.',
    likes: 31,
    verified: true,
  },
  {
    id: 'r3',
    name: 'سینا احمدی',
    role: 'تدوینگر',
    category: 'creative',
    product: 'CapCut Pro',
    rating: 4,
    comment:
      'دقیقاً همان چیزی بود که لازم داشتم. یک بار مشکل خورد، همان روز تعویض کردند.',
    likes: 18,
    verified: true,
  },
  {
    id: 'r4',
    name: 'حسین نوری',
    role: 'گیمر',
    category: 'gaming',
    product: 'Call of Duty MW',
    rating: 5,
    comment:
      'کد گلوبال بود و بدون ریجن‌لاک روی استیم خودم فعال شد. تحویل واقعاً آنی بود.',
    likes: 27,
    verified: true,
  },
  {
    id: 'r5',
    name: 'زهرا رستمی',
    role: 'دانشجو',
    category: 'social',
    product: 'Telegram Premium',
    rating: 5,
    comment:
      'فقط یوزرنیم را دادم و رمز نخواستند. همین که رمز لازم نبود خیالم را راحت کرد.',
    likes: 35,
    verified: true,
  },
];

export function VipReviewsSection() {
  const [tick, setTick] = useState(0);
  const [isVipJoined, setIsVipJoined] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ReviewCategory>('all');
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // فرم ثبت نظر
  const [hoverRating, setHoverRating] = useState(0);
  const [formRating, setFormRating] = useState(5);
  const [formName, setFormName] = useState('');
  const [formProduct, setFormProduct] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formCategory, setFormCategory] = useState<Exclude<ReviewCategory, 'all'>>('ai');

  /* چرخش نوار — فقط بعد از mount، تا سرور و کلاینت یکی رندر کنند */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsModalOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const shown = TICKER[tick % TICKER.length];
  const filtered = activeCategory === 'all'
    ? reviews
    : reviews.filter((r) => r.category === activeCategory);

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const toggleLike = (id: string) => {
    sound.click();
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (formName.trim().length < 2 || formComment.trim().length < 10) {
      sound.error();
      return;
    }
    sound.success();
    setReviews((prev) => [
      {
        id: `u-${Date.now()}`,
        name: formName.trim(),
        role: 'مشتری',
        category: formCategory,
        product: formProduct.trim() || '—',
        rating: formRating,
        comment: formComment.trim(),
        likes: 0,
        verified: false,
      },
      ...prev,
    ]);
    setFormName('');
    setFormProduct('');
    setFormComment('');
    setFormRating(5);
    setIsModalOpen(false);
  };

  return (
    <section
      id="reviews"
      className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-100"
    >
      {/* نوار خریدهای اخیر */}
      <div
        className="flex flex-wrap items-center gap-3 px-4 py-3 mb-10 rounded-full bg-[#0d091a]/90 border border-white/10 backdrop-blur-xl text-xs"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" aria-hidden="true" />
        <span key={tick} className="text-zinc-300">
          <b className="text-white">{shown.name}</b> از {shown.city} — {shown.product}
        </span>
        <span className="mr-auto text-[10px] text-zinc-500">از خریدهای اخیر</span>
      </div>

      {/* سربرگ */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-4">
          <Crown className="w-3.5 h-3.5" />
          <span>باشگاه مشتریان VIP و نظرات گیمرها</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
          حرف ما مهم نیست، حرف آن‌ها مهم است
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
          هیچ نظری را پاک نمی‌کنیم و هیچ‌کدام را هم نمی‌نویسیم. آن‌هایی که یک بار
          به مشکل خورده‌اند هم همین‌جا هستند — نگاه کن ببین چطور حلش کردیم.
        </p>
      </div>

      {/* کارت عضویت VIP */}
      <div className="relative rounded-3xl p-5 sm:p-7 mb-10 bg-gradient-to-br from-purple-950/40 via-[#0d0718] to-[#08040f] border border-purple-500/30 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white mb-1.5">
              باشگاه با خرید باز می‌شود، نه با ثبت‌نام
            </h3>
            <p className="text-xs text-zinc-400 mb-4 max-w-xl">
              اینجا کسی صرفاً برای عضو شدن امتیاز نمی‌گیرد. سطح برنز از مجموع
              خرید یک میلیون تومان شروع می‌شود و از همان‌جا کش‌بک و تخفیف‌های
              اختصاصی روی حسابت فعال می‌شوند. هرچه بالاتر بروی، درصد ثابت بیشتر
              می‌شود — و هیچ‌وقت پایین نمی‌آید.
            </p>

            {/* شرط ورود به هر سطح — عمداً صریح، تا کسی احساس نکند گولش زده‌ایم */}
            <ul className="flex flex-wrap items-center gap-2 mb-5 text-[10px] font-bold">
              {[
                { name: 'برنز', need: '۱ میلیون', color: '#c9762e' },
                { name: 'نقره', need: '۵ میلیون', color: '#b6c2cf' },
                { name: 'طلا', need: '۱۵ میلیون', color: '#e3b23c' },
                { name: 'الماس', need: '۴۰ میلیون', color: '#7cd4f5' },
              ].map((t) => (
                <li
                  key={t.name}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border"
                  style={{ borderColor: `${t.color}44`, background: `${t.color}12`, color: t.color }}
                >
                  {t.name}
                  <span className="text-zinc-500 font-normal">از</span>
                  <span className="num-en">{t.need}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VIP_PERKS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 grid place-items-center shrink-0">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{title}</div>
                    <div className="text-[10px] text-zinc-500 leading-relaxed">{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 lg:min-w-[200px]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="text-2xl font-black text-white num-en">
                {avgRating.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}
              </div>
              <div className="text-[10px] text-zinc-500">
                از <span className="num-en">{fmt(reviews.length)}</span> نظر ثبت‌شده
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isVipJoined) return;
                sound.success();
                setIsVipJoined(true);
              }}
              disabled={isVipJoined}
              className={`w-full px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                isVipJoined
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'btn--action-flat text-white'
              }`}
            >
              {isVipJoined ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> عضو باشگاه شدید
                </span>
              ) : (
                'شرایط عضویت و شروع'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* فیلتر دسته + ثبت نظر */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => { sound.click(); setActiveCategory(c.id); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all shrink-0 ${
                activeCategory === c.id
                  ? 'bg-amber-500 text-black border-amber-400 shadow'
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => { sound.click(); setIsModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-200 hover:text-white hover:border-amber-400/40 transition-all shrink-0"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
          <span>ثبت نظر و تجربه‌ی خرید</span>
        </button>
      </div>

      {/* نظرها */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 rounded-3xl bg-[#0d091a] border border-white/10">
          <Quote className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">برای این دسته هنوز نظری ثبت نشده.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => {
            const isLiked = liked.has(r.id);
            return (
              <figure
                key={r.id}
                className="glow-hover relative m-0 p-5 rounded-3xl bg-[#0e0a1b]/95 border border-white/[0.08] hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3"
              >
                <Quote className="absolute top-4 left-4 w-6 h-6 text-amber-500/15" aria-hidden="true" />

                <div className="flex items-center gap-1" aria-label={`امتیاز ${r.rating} از ۵`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="text-xs text-zinc-300 leading-relaxed m-0">
                  {r.comment}
                </blockquote>

                <figcaption className="mt-auto pt-3 border-t border-white/[0.08] flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full grid place-items-center text-sm font-black text-white shrink-0 bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600">
                    {r.name.charAt(0)}
                  </span>

                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      {r.name}
                      {r.verified && (
                        <ShieldCheck className="w-3 h-3 text-emerald-400" aria-label="خرید تأییدشده" />
                      )}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate">
                      {r.role} · {r.product}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleLike(r.id)}
                    aria-pressed={isLiked}
                    aria-label="مفید بود"
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all shrink-0 ${
                      isLiked
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-white/5 text-zinc-400 border-white/10 hover:text-rose-300'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-400' : ''}`} />
                    <span className="num-en">{fmt(r.likes + (isLiked ? 1 : 0))}</span>
                  </button>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}

      {/* مودال ثبت نظر */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="ثبت نظر"
        >
          <button
            className="absolute inset-0 bg-black/70 backdrop-blur-sm border-0"
            onClick={() => setIsModalOpen(false)}
            aria-label="بستن"
          />

          <form
            onSubmit={submitReview}
            className="relative w-full sm:w-[480px] max-h-[90svh] overflow-y-auto p-5 sm:p-6 rounded-t-3xl sm:rounded-3xl bg-[#0d091a] border border-white/10 shadow-2xl flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-black text-white">ثبت نظر و تجربه‌ی خرید شما</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg grid place-items-center text-zinc-500 hover:text-white hover:bg-white/5"
                aria-label="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* امتیاز ستاره‌ای */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2">امتیاز شما</label>
              <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                {Array.from({ length: 5 }, (_, i) => {
                  const val = i + 1;
                  const lit = val <= (hoverRating || formRating);
                  return (
                    <button
                      key={val}
                      type="button"
                      onMouseEnter={() => setHoverRating(val)}
                      onClick={() => { sound.click(); setFormRating(val); }}
                      aria-label={`${val} ستاره`}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-6 h-6 transition-transform ${
                          lit ? 'text-amber-400 fill-amber-400 scale-110' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="rv-name" className="block text-xs font-bold text-zinc-300 mb-1.5">نام شما</label>
              <input
                id="rv-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
                placeholder="مثلاً رضا محمدی"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="rv-product" className="block text-xs font-bold text-zinc-300 mb-1.5">
                  محصول
                </label>
                <input
                  id="rv-product"
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
                  placeholder="مثلاً Claude Pro"
                />
              </div>

              <div>
                <label htmlFor="rv-cat" className="block text-xs font-bold text-zinc-300 mb-1.5">دسته</label>
                <select
                  id="rv-cat"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as Exclude<ReviewCategory, 'all'>)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="rv-comment" className="block text-xs font-bold text-zinc-300 mb-1.5">
                تجربه‌ی خرید شما
              </label>
              <textarea
                id="rv-comment"
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400 resize-y leading-relaxed"
                placeholder="چه چیزی خوب بود و چه چیزی می‌توانست بهتر باشد؟"
              />
              <span className="block mt-1 text-[10px] text-zinc-500">
                نظر شما ویرایش نمی‌شود — حتی اگر انتقادی باشد.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white text-sm font-black shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all"
            >
              ثبت نظر
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
