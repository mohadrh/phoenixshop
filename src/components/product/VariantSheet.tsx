'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, ShoppingBag, X } from 'lucide-react';
import { getDefaultVariant, type Product, type Variant } from '../../data/catalog';

const fmt = (n: number) => n.toLocaleString('fa-IR');

interface Props {
  product: Product;
  onClose: () => void;
  onConfirm: (
    variant: Variant,
    inputs: Record<string, string>,
    origin?: { x: number; y: number }
  ) => void;
}

/**
 * شیت انتخاب واریانت و گرفتن ورودی مشتری.
 *
 * قاعده‌ی سایت: هیچ ورودی‌ای بعد از پرداخت گرفته نمی‌شود. اگر محصولی
 * برای فعال‌سازی به ایمیل یا یوزرنیم نیاز دارد، همین‌جا و همین حالا
 * گرفته و اعتبارسنجی می‌شود — نه در چک‌اوت، نه بعد از درگاه.
 */
export function VariantSheet({ product, onClose, onConfirm }: Props) {
  const [variant, setVariant] = useState<Variant>(getDefaultVariant(product));
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  /* document روی سرور وجود ندارد، پس پورتال باید تا بعد از mount صبر کند */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const panelRef = useRef<HTMLFormElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const errorFor = (key: string) => {
    const field = product.requiredInputs.find((f) => f.key === key)!;
    const v = (values[key] ?? '').trim();
    if (!v) return 'این فیلد لازم است';
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      return 'ایمیل معتبر نیست';
    }
    if (field.pattern && !new RegExp(field.pattern).test(v)) {
      return 'قالب واردشده درست نیست';
    }
    return null;
  };

  const allValid = product.requiredInputs.every((f) => !errorFor(f.key));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) {
      setTouched(Object.fromEntries(product.requiredInputs.map((f) => [f.key, true])));
      return;
    }
    const r = confirmRef.current?.getBoundingClientRect();
    onConfirm(
      variant,
      values,
      r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined
    );
  };

  /* پورتال به body.

     پنل position: fixed است، ولی fixed وقتی نیایی transform یا filter
     داشته باشد به همان نیا گره می‌خورد نه به قاب مرورگر. کارت‌های
     «تا وقتی هست» روی هاور جابه‌جا می‌شوند و کارت‌های چرخ‌فلک هر فریم
     ترنسفورم می‌گیرند — نتیجه‌اش این بود که پنل داخل کارت گیر می‌کرد و
     overflow کارت نصفش را می‌برید.

     با پورتال، پنل از هر ظرفی بیرون می‌آید و واقعاً روی کل صفحه
     می‌نشیند. */
  if (!mounted) return null;

  return createPortal(
    <div className="vs" role="dialog" aria-modal="true" aria-label={`گزینه‌های ${product.title}`}>
      <button className="vs__scrim" onClick={onClose} aria-label="بستن" />

      <form ref={panelRef} className="vs__panel" tabIndex={-1} onSubmit={submit}>
        <header className="vs__head">
          <div>
            <span className="vs__brand">{product.brand}</span>
            <h3 className="vs__title">{product.title}</h3>
          </div>
          <button type="button" className="vs__close" onClick={onClose} aria-label="بستن">
            <X />
          </button>
        </header>

        {product.variants.length > 1 && (
          <fieldset className="vs__field">
            <legend className="vs__label">مدت اشتراک</legend>
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
                    {v.stock !== null && v.stock <= 5 && !out && (
                      <span className="vs__variant-stock num-en">{fmt(v.stock)} عدد مانده</span>
                    )}
                    {out && <span className="vs__variant-stock">ناموجود</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {product.requiredInputs.map((f) => {
          const err = touched[f.key] ? errorFor(f.key) : null;
          return (
            <div key={f.key} className="vs__field">
              <label className="vs__label" htmlFor={`vs-${f.key}`}>{f.label}</label>
              <input
                id={`vs-${f.key}`}
                type={f.type === 'email' ? 'email' : 'text'}
                className={`vs__input ${err ? 'is-error' : ''}`}
                value={values[f.key] ?? ''}
                placeholder={f.example}
                dir="ltr"
                onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                onBlur={() => setTouched((s) => ({ ...s, [f.key]: true }))}
                aria-invalid={!!err}
                aria-describedby={`vs-${f.key}-hint`}
              />
              <span id={`vs-${f.key}-hint`} className={`vs__hint ${err ? 'is-error' : ''}`}>
                {err ? <><AlertCircle className="vs__hint-icon" />{err}</> : f.hint}
              </span>
            </div>
          );
        })}

        <footer className="vs__foot">
          <div className="vs__total">
            <span>پرداختی</span>
            <b className="num-en">{fmt(variant.price)} <small>تومان</small></b>
          </div>
          <button ref={confirmRef} type="submit" className="btn btn--primary vs__confirm">
            <ShoppingBag className="btn__icon" />
            افزودن به سبد
          </button>
        </footer>
      </form>
    </div>,
    document.body
  );
}
