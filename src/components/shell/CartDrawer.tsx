'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, X, Zap } from 'lucide-react';
import { useCart } from '../../app/providers';

const fmt = (n: number) => n.toLocaleString('fa-IR');

export function CartDrawer() {
  const { lines, isOpen, closeCart, setQuantity, remove, subtotal, count } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  /* قفل فوکوس و بازگرداندنش — بدون این، کاربر صفحه‌کلید بعد از بستن
     کشو سر جای نامعلومی می‌افتد و اسکرین‌ریدر پشت کشو گیر می‌کند. */
  useEffect(() => {
    if (!isOpen) return;
    lastFocused.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lastFocused.current?.focus();
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="cart" role="dialog" aria-modal="true" aria-label="سبد خرید">
      <button className="cart__scrim" onClick={closeCart} aria-label="بستن سبد" />

      <div ref={panelRef} className="cart__panel" tabIndex={-1}>
        <header className="cart__head">
          <h2 className="cart__title">
            <ShoppingBag className="cart__title-icon" />
            سبد خرید
            {count > 0 && <span className="cart__title-count num-en">{fmt(count)}</span>}
          </h2>
          <button className="cart__close" onClick={closeCart} aria-label="بستن">
            <X />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="cart__empty">
            <ShoppingBag className="cart__empty-icon" />
            <p className="cart__empty-title">سبد خالی است</p>
            <p className="cart__empty-text">
              هنوز چیزی انتخاب نکرده‌اید. از فروشگاه شروع کنید.
            </p>
            <Link href="/shop" className="btn btn--primary" onClick={closeCart}>
              رفتن به فروشگاه
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart__lines">
              {lines.map((l) => (
                <li key={l.key} className="cart__line">
                  <div className="cart__line-media" style={{ background: `${l.product.media.accent}22` }}>
                    <span className="cart__line-brand">{l.product.brand.slice(0, 2)}</span>
                  </div>

                  <div className="cart__line-body">
                    <span className="cart__line-title">{l.product.title}</span>
                    <span className="cart__line-variant">{l.variant.label}</span>

                    {/* ورودی‌هایی که مشتری قبل از پرداخت داده — اینجا دیده می‌شوند
                        تا اگر اشتباه بود، قبل از درگاه اصلاح شود */}
                    {Object.entries(l.inputs).length > 0 && (
                      <span className="cart__line-inputs">
                        {Object.values(l.inputs).join(' · ')}
                      </span>
                    )}

                    <div className="cart__line-foot">
                      <div className="cart__qty">
                        <button onClick={() => setQuantity(l.key, 1)} aria-label="افزایش">
                          <Plus />
                        </button>
                        <span className="num-en">{fmt(l.quantity)}</span>
                        <button onClick={() => setQuantity(l.key, -1)} aria-label="کاهش">
                          <Minus />
                        </button>
                      </div>

                      <span className="cart__line-price num-en">
                        {fmt(l.variant.price * l.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    className="cart__line-remove"
                    onClick={() => remove(l.key)}
                    aria-label={`حذف ${l.product.title}`}
                  >
                    <Trash2 />
                  </button>
                </li>
              ))}
            </ul>

            <footer className="cart__foot">
              <div className="cart__note">
                <Zap className="cart__note-icon" />
                <span>تحویل بلافاصله پس از تأیید پرداخت</span>
              </div>

              <div className="cart__total">
                <span>جمع کل</span>
                <b className="num-en">{fmt(subtotal)} <small>تومان</small></b>
              </div>

              <Link href="/checkout" className="btn btn--primary cart__checkout" onClick={closeCart}>
                ادامه‌ی خرید و پرداخت
              </Link>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
