'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  CATEGORIES, PRODUCTS, TAGS, TAG_GROUP_LABELS, getLowestPrice, getTag,
  type CategorySlug, type Product, type TagGroup,
} from '../../data/catalog';
import { ProductCard } from '../product/ProductCard';

type Sort = 'hot' | 'price_asc' | 'price_desc' | 'rating' | 'new';
type Delivery = 'all' | 'instant' | 'auto';

const norm = (s: string) =>
  s.replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/‌/g, ' ').toLowerCase().trim();

const deliveryOf = (p: Product) =>
  p.fulfillment === 'stock_code' || p.fulfillment === 'stock_account' ? 'instant' : 'auto';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'hot', label: 'محبوب‌ترین' },
  { id: 'new', label: 'جدیدترین' },
  { id: 'price_asc', label: 'ارزان‌ترین' },
  { id: 'price_desc', label: 'گران‌ترین' },
  { id: 'rating', label: 'بالاترین امتیاز' },
];

/**
 * پوسته‌ی Suspense.
 *
 * useSearchParams باعث می‌شود صفحه از رندر ایستا خارج شود مگر اینکه
 * زیر یک مرز Suspense باشد. مرز را همین‌جا می‌گذاریم تا صفحه‌های
 * /shop و /shop/[category] بدون هیچ کار اضافه‌ای ایستا بمانند.
 */
export function ShopBrowser(props: { initialCategory?: CategorySlug }) {
  return (
    <Suspense fallback={<div className="shop" aria-busy="true" />}>
      <ShopBrowserInner {...props} />
    </Suspense>
  );
}

function ShopBrowserInner({ initialCategory }: { initialCategory?: CategorySlug }) {
  const [category, setCategory] = useState<CategorySlug | 'all'>(initialCategory ?? 'all');
  const [query, setQuery] = useState('');
  const [delivery, setDelivery] = useState<Delivery>('all');
  const [sort, setSort] = useState<Sort>('hot');
  const [warrantyOnly, setWarrantyOnly] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  /* ?tag=... از صفحه‌ی محصول می‌آید — کلیک روی یک برچسب باید مستقیم
     همان فیلتر را باز کند، نه فروشگاه خالی. */
  const params = useSearchParams();
  useEffect(() => {
    const t = params?.get('tag');
    if (t && getTag(t)) setActiveTags([t]);
  }, [params]);

  const toggleTag = (slug: string) =>
    setActiveTags((prev) =>
      prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug]
    );

  /* فقط برچسب‌هایی که واقعاً روی محصولی هستند نمایش داده می‌شوند —
     فیلتری که همیشه صفر نتیجه بدهد بدتر از نبودنش است. */
  const tagsInUse = useMemo(() => {
    const used = new Set<string>();
    PRODUCTS.forEach((p) => p.tags?.forEach((t) => used.add(t)));
    const groups: { group: TagGroup; label: string; tags: typeof TAGS }[] = [];
    /* گروه delivery عمداً نیست: بالاتر یک فیلتر «نوع تحویل» مستقل
       وجود دارد و دو کنترل هم‌نام کنار هم فقط گیج‌کننده است. */
    (['status', 'genre', 'usage'] as TagGroup[]).forEach((g) => {
      const list = TAGS.filter((t) => t.group === g && used.has(t.slug));
      if (list.length) groups.push({ group: g, label: TAG_GROUP_LABELS[g], tags: list });
    });
    return groups;
  }, []);

  const activeCat = CATEGORIES.find((c) => c.slug === category);

  const results = useMemo(() => {
    const q = norm(query);

    const filtered = PRODUCTS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (delivery !== 'all' && deliveryOf(p) !== delivery) return false;
      if (warrantyOnly && p.warrantyLabel.includes('بدون')) return false;
      // همه‌ی برچسب‌های انتخاب‌شده باید روی محصول باشند، نه یکی از آن‌ها
      if (activeTags.length && !activeTags.every((t) => p.tags?.includes(t))) return false;
      if (q && !norm([p.title, p.englishTitle, p.brand, p.shortDescription].join(' ')).includes(q)) {
        return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price_asc') return getLowestPrice(a) - getLowestPrice(b);
      if (sort === 'price_desc') return getLowestPrice(b) - getLowestPrice(a);
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'new') {
        const an = a.badges.includes('new') ? 1 : 0;
        const bn = b.badges.includes('new') ? 1 : 0;
        return bn - an;
      }
      return b.salesCount - a.salesCount;
    });
  }, [category, query, delivery, sort, warrantyOnly, activeTags]);

  const activeFilters =
    (category !== 'all' ? 1 : 0) + (delivery !== 'all' ? 1 : 0) + (warrantyOnly ? 1 : 0) +
    (query ? 1 : 0) + activeTags.length;

  const clearAll = () => {
    setCategory('all');
    setQuery('');
    setDelivery('all');
    setWarrantyOnly(false);
    setActiveTags([]);
  };

  return (
    <main className="shop" dir="rtl">
      <div className="shop__inner">
        {/* ---------- سربرگ ---------- */}
        <header className="shop__head">
          <nav className="shop__crumbs" aria-label="مسیر">
            <Link href="/">خانه</Link>
            <ChevronLeft className="shop__crumb-sep" />
            <Link href="/shop">فروشگاه</Link>
            {activeCat && (
              <>
                <ChevronLeft className="shop__crumb-sep" />
                <span aria-current="page">{activeCat.title}</span>
              </>
            )}
          </nav>

          <h1 className="shop__title">{activeCat ? activeCat.title : 'همه‌ی محصولات'}</h1>
          <p className="shop__lead">
            {activeCat
              ? activeCat.tagline
              : 'اشتراک‌های بین‌المللی و اکانت‌های گیم، با پرداخت ریالی و گارانتی تمام دوره.'}
          </p>
        </header>

        <div className="shop__layout">
          {/* ---------- فیلترهای کناری ---------- */}
          <aside className="shop__filters" aria-label="فیلترها">
            <div className="shop__filter-head">
              <span><SlidersHorizontal className="shop__filter-icon" /> فیلترها</span>
              {activeFilters > 0 && (
                <button type="button" className="shop__clear" onClick={clearAll}>
                  <X className="shop__clear-icon" />
                  پاک کردن
                </button>
              )}
            </div>

            <div className="shop__group">
              <span className="shop__group-title">دسته‌بندی</span>
              <button
                onClick={() => setCategory('all')}
                className={`shop__opt ${category === 'all' ? 'is-active' : ''}`}
              >
                همه‌ی دسته‌ها
                <span className="num-en">{PRODUCTS.length.toLocaleString('fa-IR')}</span>
              </button>
              {CATEGORIES.map((c) => {
                const n = PRODUCTS.filter((p) => p.category === c.slug).length;
                return (
                  <button
                    key={c.slug}
                    onClick={() => setCategory(c.slug)}
                    className={`shop__opt ${category === c.slug ? 'is-active' : ''}`}
                  >
                    <span className="shop__opt-dot" style={{ background: c.accent }} />
                    {c.title}
                    <span className="num-en">{n.toLocaleString('fa-IR')}</span>
                  </button>
                );
              })}
            </div>

            <div className="shop__group">
              <span className="shop__group-title">نوع تحویل</span>
              {([
                { id: 'all', label: 'فرقی ندارد' },
                { id: 'instant', label: 'آنی — کد آماده' },
                { id: 'auto', label: 'خودکار — روی حساب شما' },
              ] as const).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDelivery(d.id)}
                  className={`shop__opt ${delivery === d.id ? 'is-active' : ''}`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="shop__group">
              <label className="shop__check">
                <input
                  type="checkbox"
                  checked={warrantyOnly}
                  onChange={(e) => setWarrantyOnly(e.target.checked)}
                />
                <span>فقط محصولات گارانتی‌دار</span>
              </label>
            </div>

            {/* ---------- برچسب‌ها ---------- */}
            {tagsInUse.map((g) => (
              <div key={g.group} className="shop__group">
                <h3 className="shop__group-title">{g.label}</h3>
                <div className="shop__tags">
                  {g.tags.map((t) => {
                    const on = activeTags.includes(t.slug);
                    return (
                      <button
                        key={t.slug}
                        type="button"
                        onClick={() => toggleTag(t.slug)}
                        aria-pressed={on}
                        title={t.hint ?? t.label}
                        className={`shop__tag ${on ? 'is-on' : ''}`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          {/* ---------- نتایج ---------- */}
          <div className="shop__results">
            <div className="shop__bar">
              <div className="cf__search">
                <Search className="cf__search-icon" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جست‌وجو در محصولات…"
                  aria-label="جست‌وجو"
                />
              </div>

              <div className="shop__bar-right">
                <span className="shop__count num-en" aria-live="polite">
                  {results.length.toLocaleString('fa-IR')} محصول
                </span>
                <select
                  className="cf__sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  aria-label="مرتب‌سازی"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="cf__grid">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="cf__empty">
                <Search className="cf__empty-icon" />
                <h3>محصولی پیدا نشد</h3>
                <p>فیلترها را تغییر دهید یا عبارت دیگری جست‌وجو کنید.</p>
                <button type="button" className="btn btn--soft" onClick={clearAll}>
                  پاک کردن همه‌ی فیلترها
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
