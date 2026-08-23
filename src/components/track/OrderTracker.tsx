'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Clock, Package, Search, Truck, XCircle } from 'lucide-react';
import { Su57Showcase } from '../three/Su57Showcase';
import { getOrder, type Order } from '../../lib/orders';

/* ---------------------------------------------------------------
   ماشین حالت سفارش — همان چیزی که در سند معماری تعریف شد.
   وقتی ووکامرس وصل شود، `status` از API می‌آید و بقیه دست نمی‌خورد.
--------------------------------------------------------------- */

type Status = 'awaiting_payment' | 'paid' | 'fulfilling' | 'delivered' | 'needs_input' | 'failed';

const STEPS: { id: Status; label: string; note: string }[] = [
  { id: 'paid', label: 'پرداخت تأیید شد', note: 'مبلغ با موفقیت دریافت شد' },
  { id: 'fulfilling', label: 'در حال آماده‌سازی', note: 'سفارش در صف تحویل قرار گرفت' },
  { id: 'delivered', label: 'تحویل شد', note: 'کد یا مشخصات اکانت در گاوصندوق شماست' },
];

const DEMO: Record<string, { status: Status; product: string; date: string; note?: string }> = {
  'PHX-482913': {
    status: 'delivered',
    product: 'تلگرام پریمیوم شش ماهه',
    date: '۲۵ مرداد ۱۴۰۵',
  },
  'PHX-481022': {
    status: 'fulfilling',
    product: 'کلاد پرو یک ماهه',
    date: '۲۸ مرداد ۱۴۰۵',
  },
  'PHX-479551': {
    status: 'needs_input',
    product: 'کنوا پرو یک ساله',
    date: '۲۸ مرداد ۱۴۰۵',
    note: 'ایمیلی که وارد کرده‌اید معتبر نیست. لطفاً از پنل کاربری اصلاحش کنید.',
  },
};

/* useSearchParams نیاز به مرز Suspense دارد تا صفحه ایستا بماند */
export function OrderTracker() {
  return (
    <Suspense fallback={<main className="doc" dir="rtl" aria-busy="true" />}>
      <OrderTrackerInner />
    </Suspense>
  );
}

function OrderTrackerInner() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<
    | { found: true; code: string; data: (typeof DEMO)[string]; order?: Order }
    | { found: false }
    | null
  >(null);

  /* جست‌وجو اول در سفارش‌های واقعیِ همین مرورگر انجام می‌شود، بعد در
     نمونه‌های نمایشی. این‌طور کسی که همین الان خرید کرده، سفارش خودش
     را می‌بیند نه یک نمونه‌ی ساختگی. */
  const lookup = (key: string) => {
    const real = getOrder(key);
    if (real) {
      setResult({
        found: true,
        code: key,
        data: {
          status: real.status,
          product: real.items.map((i) => i.title).join('، '),
          date: new Date(real.createdAt).toLocaleDateString('fa-IR'),
          note: real.note,
        },
        order: real,
      });
      return;
    }
    const demo = DEMO[key];
    setResult(demo ? { found: true, code: key, data: demo } : { found: false });
  };

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(code.trim().toUpperCase());
  };

  /* ?code=... از صفحه‌ی موفقیت پرداخت می‌آید */
  const params = useSearchParams();
  useEffect(() => {
    const c = params?.get('code');
    if (!c) return;
    setCode(c);
    lookup(c.trim().toUpperCase());
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const stepIndex = result?.found
    ? STEPS.findIndex((s) => s.id === result.data.status)
    : -1;

  return (
    <main className="doc" dir="rtl">
      <div className="doc__inner doc__inner--narrow">
        <header className="doc__head">
          <span className="sec__kicker">استعلام لحظه‌ای</span>
          <h1 className="doc__title">پیگیری سفارش</h1>
          <p className="doc__lead">
            شماره‌ی پیگیری سفارش را وارد کنید تا وضعیت دقیقش را ببینید.
            برای دیدن کامل سفارش‌ها، وارد <Link href="/account/orders">پنل کاربری</Link> شوید.
          </p>
        </header>

        {/* جنگنده — همان چیزی که موقع افزودن به سبد پرواز می‌کند.
            اینجا نشستنش معنی دارد: سفارش «در پرواز» است تا تحویل. */}
        <Su57Showcase
          height={300}
          caption="سفارش‌ها همین‌طور می‌آیند: سریع، مستقیم، بدون توقف"
        />

        <form className="trk__form" onSubmit={search}>
          <div className="cf__search">
            <Search className="cf__search-icon" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثلاً PHX-482913"
              dir="ltr"
              aria-label="شماره‌ی پیگیری"
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={!code.trim()}>
            استعلام
          </button>
        </form>

        <p className="trk__hint">
          برای آزمایش می‌توانید یکی از این‌ها را وارد کنید:{' '}
          {Object.keys(DEMO).map((k, i) => (
            <React.Fragment key={k}>
              {i > 0 && ' · '}
              <button type="button" className="trk__sample code-en" onClick={() => setCode(k)}>{k}</button>
            </React.Fragment>
          ))}
        </p>

        {/* ---------- نتیجه ---------- */}
        {result && !result.found && (
          <div className="trk__notfound">
            <XCircle className="trk__notfound-icon" />
            <h2>سفارشی با این شماره پیدا نشد</h2>
            <p>شماره را دوباره بررسی کنید، یا از پنل کاربری فهرست کامل سفارش‌ها را ببینید.</p>
            <Link href="/account/orders" className="btn btn--soft">رفتن به سفارش‌ها</Link>
          </div>
        )}

        {result?.found && (
          <div className="trk__result">
            <header className="trk__result-head">
              <div>
                <span className="trk__code code-en">{result.code}</span>
                <h2 className="trk__product">{result.data.product}</h2>
                <span className="trk__date">ثبت‌شده در {result.data.date}</span>
              </div>
              <span className={`trk__status trk__status--${result.data.status}`}>
                {result.data.status === 'delivered' && <><Check /> تحویل شد</>}
                {result.data.status === 'fulfilling' && <><Truck /> در حال آماده‌سازی</>}
                {result.data.status === 'needs_input' && <><Clock /> نیازمند اصلاح</>}
                {result.data.status === 'failed' && <><XCircle /> ناموفق</>}
                {(result.data.status === 'paid' || result.data.status === 'awaiting_payment') && (
                  <><Package /> در انتظار</>
                )}
              </span>
            </header>

            {result.data.note && (
              <p className="trk__note">{result.data.note}</p>
            )}

            <ol className="trk__steps">
              {STEPS.map((s, i) => {
                const done = stepIndex >= 0 && i <= stepIndex;
                const blocked = result.data.status === 'needs_input' && i > 0;
                return (
                  <li
                    key={s.id}
                    className={`trk__step ${done && !blocked ? 'is-done' : ''} ${blocked && i === 1 ? 'is-blocked' : ''}`}
                  >
                    <span className="trk__step-dot">
                      {done && !blocked ? <Check /> : <span className="trk__step-num num-en">{(i + 1).toLocaleString('fa-IR')}</span>}
                    </span>
                    <div>
                      <b>{s.label}</b>
                      <small>{s.note}</small>
                    </div>
                  </li>
                );
              })}
            </ol>

            {result.data.status === 'delivered' && (
              <Link href="/account/vault" className="btn btn--primary trk__cta">
                مشاهده در گاوصندوق
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
