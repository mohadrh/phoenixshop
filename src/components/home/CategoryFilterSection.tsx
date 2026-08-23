'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import {
  GraduationCap, Share2, Bot, Gamepad2, Palette,
  Sparkles, Search, Layers, ArrowLeft, Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  CATEGORIES, PRODUCTS, getLowestPrice,
  type CategorySlug, type Product,
} from '../../data/catalog';
import { ProductCard } from '../product/ProductCard';
import { sound } from '../../lib/sound';
import { asset } from '../../lib/asset';

/**
 * پورتال دسته‌بندی و فیلتر — پورت مستقیم طراحی نسخه‌ی قبلی.
 *
 * تب‌های قرصی، نوار جست‌وجو و پلتفرم، و شبکه‌ی کارت‌ها عیناً همان‌اند.
 * دسته‌ها به تاکسونومی پنج‌تایی جدید نگاشت شده‌اند و فیلتر پلتفرم از
 * روی پلتفرم‌های واقعی محصولات ساخته می‌شود، نه فهرست دستی.
 */

type Tab = CategorySlug | 'all';
type Sort = 'hot' | 'price_asc' | 'price_desc' | 'rating';

/* ---------------------------------------------------------------
   دو دنیای جدا.

   بازی و هوش مصنوعی دو نیت خرید کاملاً متفاوت‌اند و قاطی کردنشان
   در یک شبکه، هر دو گروه را گیج می‌کرد: کسی که دنبال اکانت پلی‌استیشن
   است کاری با Figma ندارد و برعکس.

   پس اول دنیا انتخاب می‌شود، بعد زیردسته‌ها باز می‌شوند. تا وقتی
   دنیایی انتخاب نشده، هیچ محصولی نشان داده نمی‌شود — این عمدی است و
   کاربر را وادار به یک تصمیم ساده‌ی دوگزینه‌ای می‌کند.
--------------------------------------------------------------- */
type World = 'ai' | 'gaming';

/** زیردسته‌های هر دنیا. دنیای هوش مصنوعی چهار دسته‌ی واقعی دارد. */
const WORLD_CATEGORIES: Record<World, CategorySlug[]> = {
  ai: ['ai', 'creative', 'social', 'education'],
  gaming: ['gaming'],
};

const WORLDS: {
  id: World;
  /** لوگوتایپ انگلیسی — همان زبانی که روی خود محصولات است */
  wordmark: string;
  title: string;
  unit: string;
  accent: string;
  /** دو رنگ بدنه‌ی کارت */
  from: string;
  to: string;
  /** کاراکتر — از لبه‌ی بالای کارت می‌زند بیرون */
  art: string;
  /** ارتفاع کاراکتر نسبت به کارت؛ هر تصویر تناسب خودش را دارد */
  artScale: number;
}[] = [
  {
    id: 'gaming',
    wordmark: 'GAMING',
    title: 'اکانت قانونی پلی‌استیشن',
    unit: 'عنوان',
    accent: '#f59440',
    from: '#93481c',
    to: '#331409',
    art: '/hero/cutout/battlefield-soldier.webp',
    artScale: 1.42,
  },
  {
    id: 'ai',
    wordmark: 'AI TOOLS',
    title: 'اشتراک هوش مصنوعی و نرم‌افزار',
    unit: 'اشتراک',
    accent: '#a855f7',
    from: '#4a2f7a',
    to: '#241546',
    art: '/products/cutout/app-tiles.webp',
    /* کاشی‌ها پهن‌اند نه بلند (۷۸۰×۶۰۲)، پس برخلاف کاراکتر تمام‌قدِ
       کارت کناری با ضریب کمتری بسته می‌شوند وگرنه از دو طرف می‌زند بیرون */
    artScale: 1.15,
  },
];

const ICONS: Record<CategorySlug, LucideIcon> = {
  ai: Bot,
  creative: Palette,
  social: Share2,
  education: GraduationCap,
  gaming: Gamepad2,
};

const norm = (s: string) =>
  s.replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/‌/g, ' ').toLowerCase().trim();

export function CategoryFilterSection() {
  const [world, setWorld] = useState<World | null>(null);
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<string>('all');
  const [sort, setSort] = useState<Sort>('hot');
  /* صفحه‌ی اصلی ویترین است نه انبار. هشت کارت اول را نشان می‌دهیم و
     بقیه فقط اگر کاربر خودش خواست باز می‌شوند — این‌طور اسکرول صفحه
     کوتاه می‌ماند و سکشن‌های بعدی زودتر دیده می‌شوند. */
  const PAGE = 8;
  const [shown, setShown] = useState(PAGE);

  /** محصولات دنیای فعلی — پایه‌ی همه‌ی شمارش‌ها و فیلترها */
  const worldProducts = useMemo(
    () => (world ? PRODUCTS.filter((p) => WORLD_CATEGORIES[world].includes(p.category)) : []),
    [world]
  );

  /* فهرست پلتفرم‌ها از خود کاتالوگ می‌آید — اگر محصولی با پلتفرم تازه
     اضافه شود، خودش در فیلتر ظاهر می‌شود. */
  const platforms = useMemo(() => {
    const set = new Set<string>();
    worldProducts.forEach((p) => p.platforms?.forEach((x) => set.add(x)));
    return ['all', ...Array.from(set).slice(0, 5)];
  }, [worldProducts]);

  const tabs = useMemo<{ id: Tab; title: string; Icon: LucideIcon; count: number }[]>(
    () => {
      if (!world) return [];
      const slugs = WORLD_CATEGORIES[world];
      const cats = CATEGORIES.filter((c) => slugs.includes(c.slug));
      const list = cats.map((c) => ({
        id: c.slug as Tab,
        title: c.title,
        Icon: ICONS[c.slug],
        count: worldProducts.filter((p) => p.category === c.slug).length,
      }));
      /* وقتی دنیا فقط یک دسته دارد، تبِ «همه» تکراری است */
      if (list.length < 2) return list;
      return [
        { id: 'all' as Tab, title: 'همه', Icon: Layers, count: worldProducts.length },
        ...list,
      ];
    },
    [world, worldProducts]
  );

  /* هر بار فیلتر عوض شد از هشت‌تای اول شروع کن — وگرنه کاربر بعد از
     تغییر دسته با فهرستی بازشده از دسته‌ی قبلی روبه‌رو می‌شود. */
  useEffect(() => { setShown(PAGE); }, [world, tab, query, platform, sort]);

  /* عوض کردن دنیا، فیلترهای دنیای قبلی را بی‌معنا می‌کند */
  useEffect(() => { setTab('all'); setPlatform('all'); setQuery(''); }, [world]);

  const results = useMemo(() => {
    const q = norm(query);

    const filtered = worldProducts.filter((p: Product) => {
      if (tab !== 'all' && p.category !== tab) return false;
      if (platform !== 'all' && !(p.platforms ?? []).includes(platform)) return false;
      if (q) {
        const hay = norm([p.title, p.englishTitle, p.brand, p.shortDescription].join(' '));
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price_asc') return getLowestPrice(a) - getLowestPrice(b);
      if (sort === 'price_desc') return getLowestPrice(b) - getLowestPrice(a);
      if (sort === 'rating') return b.rating - a.rating;
      const aHot = a.badges.includes('hot') ? 1 : 0;
      const bHot = b.badges.includes('hot') ? 1 : 0;
      if (aHot !== bHot) return bHot - aHot;
      return b.salesCount - a.salesCount;
    });
  }, [worldProducts, tab, query, platform, sort]);

  const reset = () => {
    setQuery('');
    setPlatform('all');
    setTab('all');
  };

  return (
    <section
      id="categories"
      className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-100"
    >
      {/* سربرگ */}
      <div className="flex flex-col items-center text-center gap-3 mb-8">
        <div>
          <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>هر چیزی که می‌فروشیم، یک‌جا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            دنبال چی می‌گردی؟
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl mx-auto">
            دسته را بزن یا اسمش را تایپ کن. اگر هنوز نمی‌دانی، از دستیار خرید
            بالای صفحه شروع کن.
          </p>
        </div>

        {world && (
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-amber-300">
              {results.length.toLocaleString('fa-IR')} محصول موجود
            </span>
          </div>
        )}
      </div>

      {/* ---------- انتخاب دنیا ---------- */}
      {/* دو بنر افقی کوتاه، نه تمام‌عرض. کاراکتر از لبه‌ی بالا می‌زند
          بیرون — همان چیزی که کارت را از یک مستطیل رنگی جدا می‌کند. */}
      <div className="wsel" role="group" aria-label="انتخاب دنیا">
        {WORLDS.map((w) => {
          const isActive = world === w.id;
          const dimmed = world !== null && !isActive;
          const count = PRODUCTS.filter((p) => WORLD_CATEGORIES[w.id].includes(p.category)).length;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => { sound.click(); setWorld(isActive ? null : w.id); }}
              onMouseEnter={() => sound.hover()}
              aria-pressed={isActive}
              className={`wsel__card ${isActive ? 'is-active' : ''} ${dimmed ? 'is-dimmed' : ''}`}
              style={{
                ['--w-accent' as string]: w.accent,
                ['--w-from' as string]: w.from,
                ['--w-to' as string]: w.to,
              }}
            >
              {/* بدنه‌ی رنگی — این یکی بریده می‌شود، کاراکتر نه */}
              <span className="wsel__plate" aria-hidden="true">
                <span className="wsel__sheen" />
              </span>

              {/* کاراکتر */}
              {/* اگر فایل کاراکتر هنوز نرسیده، کارت بدون تصویر نماند —
                  ققنوس برند جایگزین می‌شود */}
              <img
                src={asset(w.art)}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="wsel__art"
                style={{ ['--art-scale' as string]: String(w.artScale) }}
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.dataset.fallback) return;
                  img.dataset.fallback = '1';
                  img.src = '/brand/phoenix-logo.png';
                }}
              />

              <span className="wsel__body">
                <span className="wsel__wordmark">{w.wordmark}</span>
                <span className="wsel__title">{w.title}</span>
                <span className="wsel__count">
                  <b className="num-en">{count.toLocaleString('fa-IR')}</b> {w.unit}
                  <ArrowLeft className="wsel__arrow" />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* تا وقتی دنیا انتخاب نشده، شبکه‌ی محصولات باز نمی‌شود */}
      {!world && (
        <p className="text-center text-xs text-zinc-500 pb-4">
          یکی از این دو را بزن تا زیردسته‌ها و محصولاتش باز شود.
        </p>
      )}

      {world && (
      <>
      {/* تب‌های قرصی دسته */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {tabs.map(({ id, title, Icon, count }) => {
          const isSelected = tab === id;
          return (
            <button
              key={id}
              onClick={() => { sound.click(); setTab(id); }}
              onMouseEnter={() => sound.hover()}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 border shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-[1.02]'
                  : 'bg-[#0d091a]/80 text-zinc-300 border-white/10 hover:border-white/20 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-amber-400'}`} />
              <span>{title}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-black/30 text-amber-200' : 'bg-white/10 text-zinc-400'
                }`}
              >
                {count.toLocaleString('fa-IR')}
              </span>
            </button>
          );
        })}
      </div>

      {/* نوار جست‌وجو و فیلتر */}
      <div className="p-3.5 rounded-2xl bg-[#0d091a]/90 border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg backdrop-blur-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جست‌وجوی نام محصول، برند یا اشتراک…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors text-right"
            dir="rtl"
            aria-label="جست‌وجو در محصولات"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            {platforms.map((plat) => (
              <button
                key={plat}
                onClick={() => { sound.click(); setPlatform(plat); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  platform === plat
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {plat === 'all' ? 'همه پلتفرم‌ها' : plat}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="bg-black/40 border border-white/10 text-xs text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
            aria-label="مرتب‌سازی"
          >
            <option value="hot">محبوب‌ترین و داغ‌ترین</option>
            <option value="price_asc">ارزان‌ترین قیمت</option>
            <option value="price_desc">گران‌ترین قیمت</option>
            <option value="rating">بالاترین امتیاز</option>
          </select>
        </div>
      </div>

      {/* شبکه‌ی کارت‌ها */}
      {results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {results.slice(0, shown).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* ادامه‌ی فهرست — یا باز کردن هشت‌تای بعدی، یا رفتن به فروشگاه */}
          <div className="mt-10 flex flex-col items-center gap-4">
            {shown < results.length && (
              <button
                type="button"
                onClick={() => { sound.click(); setShown((n) => n + PAGE); }}
                onMouseEnter={() => sound.hover()}
                className="btn-reveal"
              >
                <span className="btn-reveal__glow" aria-hidden="true" />
                <Plus className="btn-reveal__icon" />
                <span>
                  نمایش{' '}
                  <b className="num-en">
                    {Math.min(PAGE, results.length - shown).toLocaleString('fa-IR')}
                  </b>{' '}
                  محصول بیشتر
                </span>
                <span className="btn-reveal__count num-en">
                  {(results.length - shown).toLocaleString('fa-IR')}
                </span>
              </button>
            )}

            <Link
              href="/shop"
              onClick={() => sound.click()}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-amber-300 transition-colors"
            >
              یا مستقیم برو به فروشگاه کامل
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#0d091a] border border-white/10 space-y-4">
          <Search className="w-12 h-12 text-zinc-500 mx-auto opacity-50 animate-bounce" />
          <h4 className="text-base font-bold text-white">محصولی با این مشخصات یافت نشد</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            لطفاً عبارت جست‌وجو یا فیلتر پلتفرم را تغییر دهید یا از سایر دسته‌بندی‌ها دیدن کنید.
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
          >
            نمایش همه محصولات
          </button>
        </div>
      )}
      </>
      )}
    </section>
  );
}
