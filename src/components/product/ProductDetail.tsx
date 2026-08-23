'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle, Check, ChevronLeft, Info, ShieldCheck,
  ShoppingBag, Star, Tag, Zap,
} from 'lucide-react';
import { useCart, useFlight } from '../../app/providers';
import {
  CATEGORIES, PRODUCTS, getDefaultVariant, getProductTags,
  type Product, type Variant,
} from '../../data/catalog';
import { ProductCard } from './ProductCard';
import { ProductArt } from './ProductArt';

const fmt = (n: number) => n.toLocaleString('fa-IR');

const FULFILLMENT_NOTE: Record<Product['fulfillment'], string> = {
  stock_code: 'کد فعال‌سازی از انبار، بلافاصله پس از پرداخت تحویل می‌شود.',
  stock_account: 'مشخصات اکانت از انبار تخصیص داده و بلافاصله تحویل می‌شود.',
  upgrade_on_user: 'اشتراک روی حساب شخصی خودتان فعال می‌شود؛ رمز عبورتان هرگز لازم نیست.',
  api_topup: 'به‌صورت خودکار روی حسابی که مشخص می‌کنید اعمال می‌شود.',
  manual: 'پس از پرداخت، اپراتور سفارش را در بازه‌ی اعلام‌شده تکمیل می‌کند.',
};

export function ProductDetail({ product }: { product: Product }) {
  const { add, openCart } = useCart();
  const { launch } = useFlight();

  const [variant, setVariant] = useState<Variant>(getDefaultVariant(product));
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [added, setAdded] = useState(false);

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const tags = getProductTags(product);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const errorFor = (key: string) => {
    const field = product.requiredInputs.find((f) => f.key === key)!;
    const v = (values[key] ?? '').trim();
    if (!v) return 'این فیلد لازم است';
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'ایمیل معتبر نیست';
    if (field.pattern && !new RegExp(field.pattern).test(v)) return 'قالب واردشده درست نیست';
    return null;
  };

  const valid = product.requiredInputs.every((f) => !errorFor(f.key));
  const outOfStock = variant.stock !== null && variant.stock <= 0;

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!valid) {
      setTouched(Object.fromEntries(product.requiredInputs.map((f) => [f.key, true])));
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    launch({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    add(product, variant, values);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <main className="pd" dir="rtl">
      <div className="pd__inner">
        <nav className="shop__crumbs" aria-label="مسیر">
          <Link href="/">خانه</Link>
          <ChevronLeft className="shop__crumb-sep" />
          <Link href="/shop">فروشگاه</Link>
          {category && (
            <>
              <ChevronLeft className="shop__crumb-sep" />
              <Link href={`/shop/${category.slug}`}>{category.title}</Link>
            </>
          )}
          <ChevronLeft className="shop__crumb-sep" />
          <span aria-current="page">{product.title}</span>
        </nav>

        <div className="pd__grid">
          {/* ---------- ستون راست: اطلاعات ---------- */}
          <div className="pd__main">
            {/* تصویر محصول — تا امروز اصلاً اینجا نبود و صفحه فقط متن بود.
                همان دو لایه‌ی کارت محصول: پس‌زمینه‌ی محو، کاتاوت روی آن. */}
            <figure className="pd__art">
              <ProductArt
                src={product.media.cover ?? product.media.thumbnail}
                accent={product.media.accent}
                brand={product.brand}
                title={product.englishTitle}
                className="pd__art-backdrop"
                layer="backdrop"
              />
              <div className="pd__art-front">
                <ProductArt
                  src={product.media.cutout ?? product.media.thumbnail}
                  accent={product.media.accent}
                  brand={product.brand}
                  title={product.englishTitle}
                  className="pd__art-img"
                  layer="cutout"
                />
              </div>
              <span
                className="pd__art-glow"
                style={{ background: `radial-gradient(circle, ${product.media.accent}44, transparent 70%)` }}
                aria-hidden="true"
              />
            </figure>

            <span className="pd__brand">{product.brand}</span>
            <h1 className="pd__title">{product.title}</h1>
            <p className="pd__en">{product.englishTitle}</p>

            <div className="pd__meta">
              <span className="pc__rating">
                <Star className="pc__rating-icon" />
                <b className="num-en">{product.rating.toLocaleString('fa-IR')}</b>
                <small className="num-en">({fmt(product.reviewsCount)} نظر)</small>
              </span>
              <span className="pd__sales num-en">{fmt(product.salesCount)} فروش موفق</span>
            </div>

            <p className="pd__desc">{product.description}</p>

            {/* برچسب‌ها — هر کدام به فروشگاه با همان فیلتر می‌رود */}
            {tags.length > 0 && (
              <ul className="pd__tags" aria-label="برچسب‌ها">
                {tags.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/shop?tag=${t.slug}`}
                      className="pd__tag"
                      title={t.hint ?? t.label}
                    >
                      <Tag className="pd__tag-icon" />
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="pd__features">
              <h2 className="pd__section-title">این اشتراک شامل چیست</h2>
              <ul>
                {product.features.map((f) => (
                  <li key={f}>
                    <Check className="pd__feature-check" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {product.notes && product.notes.length > 0 && (
              <div className="pd__notes">
                {product.notes.map((n) => (
                  <p key={n}>
                    <Info className="pd__note-icon" />
                    {n}
                  </p>
                ))}
              </div>
            )}

            {product.faq && product.faq.length > 0 && (
              <div className="pd__faq">
                <h2 className="pd__section-title">سوالات پرتکرار</h2>
                {product.faq.map((f) => (
                  <details key={f.q} className="pd__faq-item">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            )}
          </div>

          {/* ---------- ستون چپ: خرید ---------- */}
          <aside className="pd__buy">
            <div className="pd__buy-card">
              {product.variants.length > 1 && (
                <div className="vs__field">
                  <span className="vs__label">انتخاب گزینه</span>
                  <div className="vs__variants">
                    {product.variants.map((v) => {
                      const out = v.stock !== null && v.stock <= 0;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={out}
                          onClick={() => setVariant(v)}
                          className={`vs__variant ${variant.id === v.id ? 'is-active' : ''}`}
                        >
                          <span className="vs__variant-label">{v.label}</span>
                          <span className="vs__variant-price num-en">{fmt(v.price)}</span>
                          {out
                            ? <span className="vs__variant-stock">ناموجود</span>
                            : v.stock !== null && v.stock <= 5 && (
                                <span className="vs__variant-stock num-en">{fmt(v.stock)} عدد مانده</span>
                              )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ورودی‌های لازم — قبل از پرداخت، نه بعدش */}
              {product.requiredInputs.map((f) => {
                const err = touched[f.key] ? errorFor(f.key) : null;
                return (
                  <div key={f.key} className="vs__field">
                    <label className="vs__label" htmlFor={`pd-${f.key}`}>{f.label}</label>
                    <input
                      id={`pd-${f.key}`}
                      type={f.type === 'email' ? 'email' : 'text'}
                      className={`vs__input ${err ? 'is-error' : ''}`}
                      value={values[f.key] ?? ''}
                      placeholder={f.example}
                      dir="ltr"
                      onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                      onBlur={() => setTouched((s) => ({ ...s, [f.key]: true }))}
                      aria-invalid={!!err}
                    />
                    <span className={`vs__hint ${err ? 'is-error' : ''}`}>
                      {err ? <><AlertCircle className="vs__hint-icon" />{err}</> : f.hint}
                    </span>
                  </div>
                );
              })}

              <div className="pd__price">
                {variant.compareAt && <s className="num-en">{fmt(variant.compareAt)}</s>}
                <span className="num-en">
                  <b>{fmt(variant.price)}</b> تومان
                </span>
              </div>

              <button
                type="button"
                className={`btn btn--primary pd__add ${added ? 'is-added' : ''}`}
                onClick={handleAdd}
                disabled={outOfStock}
              >
                {added ? <><Check className="btn__icon" /> به سبد اضافه شد</>
                       : <><ShoppingBag className="btn__icon" /> {outOfStock ? 'ناموجود' : 'افزودن به سبد'}</>}
              </button>

              {added && (
                <button type="button" className="pd__view-cart" onClick={openCart}>
                  مشاهده‌ی سبد و ادامه‌ی خرید
                </button>
              )}

              <ul className="pd__assurances">
                <li><Zap className="pd__assurance-icon pd__assurance-icon--amber" />{product.deliveryEstimate}</li>
                <li><ShieldCheck className="pd__assurance-icon pd__assurance-icon--green" />{product.warrantyLabel}</li>
              </ul>

              <p className="pd__fulfillment">
                <Info className="pd__note-icon" />
                {FULFILLMENT_NOTE[product.fulfillment]}
              </p>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="pd__related">
            <h2 className="sec__title">از همین دسته</h2>
            <div className="cf__grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
