'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle, ArrowRight, Check, CreditCard, ExternalLink, Loader2, Lock,
  RotateCcw, ShieldCheck, ShoppingBag, Smartphone, Wallet, XCircle, Zap,
} from 'lucide-react';
import { useCart } from '../../app/providers';
import { PROFILE } from '../../data/account';
import { sound } from '../../lib/sound';
import { newOrderCode, saveOrder, scheduleFulfilment, type Order } from '../../lib/orders';
import { PhoenixMark } from '../brand/PhoenixMark';

const fmt = (n: number) => n.toLocaleString('fa-IR');

/* جریان کامل خرید.

   دو گام میانی که قبلاً نبودند و بدون آن‌ها خرید «واقعی» به نظر
   نمی‌رسید: رفتن به درگاه و برگشتن از آن. پرداخت آنلاین هیچ‌وقت
   یک کلیک و تمام نیست — کاربر از سایت بیرون می‌رود، برمی‌گردد، و
   تازه آن‌جا تراکنش تأیید می‌شود. */
type Step = 'identify' | 'review' | 'pay' | 'gateway' | 'verify' | 'done' | 'failed';

const STEPS: { id: Step; label: string }[] = [
  { id: 'identify', label: 'تأیید هویت' },
  { id: 'review', label: 'بازبینی' },
  { id: 'pay', label: 'پرداخت' },
];

/** درگاه‌های داخلی. کارمزد ندارند — نمایشش فقط برای شفافیت است. */
const GATEWAYS = [
  { id: 'zarinpal', label: 'زرین‌پال', note: 'همه‌ی کارت‌های عضو شتاب' },
  { id: 'idpay', label: 'آیدی‌پی', note: 'پرداخت امن شتابی' },
];

export function CheckoutFlow() {
  const { lines, subtotal, count, setQuantity, remove } = useCart();

  const [step, setStep] = useState<Step>('identify');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState<number | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [gateway, setGateway] = useState(GATEWAYS[0].id);
  const [orderId, setOrderId] = useState('');
  const [refId, setRefId] = useState('');
  const [error, setError] = useState('');
  /* پر کردن ورودی‌های جاافتاده، همین‌جا در گام بازبینی */
  const [fixes, setFixes] = useState<Record<string, Record<string, string>>>({});
  const timers = useRef<number[]>([]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const discount = couponApplied ? Math.round(subtotal * (couponApplied / 100)) : 0;
  const walletUsed = useWallet ? Math.min(PROFILE.walletBalance, subtotal - discount) : 0;
  const payable = Math.max(0, subtotal - discount - walletUsed);

  /* ---------------------------------------------------------------
     ورودی‌های لازم.

     هر محصول می‌تواند قبل از پرداخت چیزی بخواهد — ایمیل حساب، یوزرنیم
     تلگرام. اگر خطی از سبد آن را نداشته باشد، پرداخت نباید انجام شود:
     بعد از پرداخت هیچ اطلاعاتی از مشتری نمی‌گیریم، پس فرصت اصلاح
     همین‌جاست و بس.
  --------------------------------------------------------------- */

  const valueFor = (lineKey: string, field: string, current: Record<string, string>) =>
    (fixes[lineKey]?.[field] ?? current[field] ?? '').trim();

  const fieldError = (
    field: { key: string; label: string; type: string; pattern?: string },
    raw: string
  ) => {
    if (!raw) return 'این فیلد لازم است';
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw)) return 'ایمیل معتبر نیست';
    if (field.pattern && !new RegExp(field.pattern).test(raw)) return 'قالب واردشده درست نیست';
    return '';
  };

  /** خط‌هایی که هنوز ورودی لازمشان کامل نیست */
  const incomplete = useMemo(
    () =>
      lines.filter((l) =>
        l.product.requiredInputs.some(
          (f) => fieldError(f, valueFor(l.key, f.key, l.inputs)) !== ''
        )
      ),
    [lines, fixes]
  );

  /* ---------- سبد خالی ---------- */
  if (count === 0 && step !== 'done') {
    return (
      <main className="co" dir="rtl">
        <div className="co__empty">
          <ShoppingBag className="cf__empty-icon" />
          <h1>سبد خرید خالی است</h1>
          <p>برای ادامه، اول چیزی به سبد اضافه کنید.</p>
          <Link href="/shop" className="btn btn--primary">رفتن به فروشگاه</Link>
        </div>
      </main>
    );
  }

  const sendOtp = () => {
    if (!/^09\d{9}$/.test(phone.replace(/\s/g, ''))) {
      setError('شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.');
      sound.error();
      return;
    }
    setError('');
    setOtpSent(true);
    sound.success();
  };

  const verifyOtp = () => {
    // در نسخه‌ی واقعی، اعتبارسنجی سمت سرور انجام می‌شود
    if (otp.trim().length !== 5) {
      setError('کد پنج‌رقمی پیامک‌شده را وارد کنید.');
      sound.error();
      return;
    }
    setError('');
    sound.success();
    setStep('review');
  };

  const applyCoupon = () => {
    const map: Record<string, number> = {
      'PHX-SILVER': 5, 'PHX-GOLD': 10, 'PHX-ELITE': 15,
    };
    const pct = map[coupon.trim().toUpperCase()];
    if (!pct) {
      setError('این کد تخفیف معتبر نیست یا برای سطح شما فعال نشده.');
      sound.error();
      return;
    }
    setError('');
    setCouponApplied(pct);
    sound.success();
  };

  const setFix = (lineKey: string, field: string, v: string) =>
    setFixes((prev) => ({ ...prev, [lineKey]: { ...(prev[lineKey] ?? {}), [field]: v } }));

  /** ورودی نهایی هر خط — مقدار اصلاح‌شده روی مقدار اولیه می‌نشیند */
  const finalInputs = (lineKey: string, current: Record<string, string>) => ({
    ...current,
    ...(fixes[lineKey] ?? {}),
  });

  const goToPay = () => {
    if (incomplete.length > 0) {
      setError('برای ادامه، اطلاعات خواسته‌شده‌ی محصولات مشخص‌شده را کامل کنید.');
      sound.error();
      return;
    }
    setError('');
    setStep('pay');
  };

  /* ---------------------------------------------------------------
     پرداخت.

     مسیر واقعی چهار مرحله دارد و همه‌شان اینجا مدل شده‌اند:

       ۱. سفارش با وضعیت awaiting_payment ثبت می‌شود.
       ۲. کاربر به درگاه می‌رود (اینجا شبیه‌سازی، در نسخه‌ی واقعی
          redirect به آدرسی که درگاه برمی‌گرداند).
       ۳. کاربر با یک توکن برمی‌گردد و سرور تراکنش را «تأیید» می‌کند.
          این مرحله حذف‌شدنی نیست: بدون آن، هر کسی می‌تواند با دست‌کاری
          آدرس برگشت وانمود کند پرداخت کرده.
       ۴. سفارش paid می‌شود و به صف تحویل می‌رود.

     برای وصل کردن درگاه واقعی فقط دو نقطه عوض می‌شود: جایی که
     redirect انجام می‌شود، و جایی که verify صدا زده می‌شود.
  --------------------------------------------------------------- */

  const buildOrder = (code: string): Order => ({
    code,
    createdAt: Date.now(),
    status: 'awaiting_payment',
    phone,
    gateway,
    subtotal,
    discount,
    walletUsed,
    payable,
    items: lines.map((l) => ({
      productId: l.product.id,
      title: l.product.title,
      variantLabel: l.variant.label,
      quantity: l.quantity,
      price: l.variant.price,
      inputs: finalInputs(l.key, l.inputs),
      deliveryEstimate: l.product.deliveryEstimate,
    })),
  });

  const pay = () => {
    const code = newOrderCode();
    setOrderId(code);
    saveOrder(buildOrder(code));
    sound.click();
    setStep('gateway');

    // رفتن به درگاه — در نسخه‌ی واقعی اینجا window.location عوض می‌شود
    timers.current.push(
      window.setTimeout(() => setStep('verify'), 2200) as unknown as number
    );

    // برگشت از درگاه و تأیید تراکنش
    timers.current.push(
      window.setTimeout(() => {
        const ref = String(Math.floor(10 ** 9 + Math.random() * 8 * 10 ** 9));
        setRefId(ref);
        saveOrder({ ...buildOrder(code), status: 'paid', refId: ref });
        scheduleFulfilment(code);
        sound.success();
        setStep('done');
      }, 4200) as unknown as number
    );
  };

  /** مسیر شکست — برای دیدن رفتار سایت وقتی تراکنش ناموفق است */
  const failPayment = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (orderId) saveOrder({ ...buildOrder(orderId), status: 'failed', note: 'تراکنش از سمت درگاه تأیید نشد.' });
    sound.error();
    setStep('failed');
  };

  const retryPayment = () => {
    setError('');
    setStep('pay');
  };

  /* ---------- در حال رفتن به درگاه ---------- */
  if (step === 'gateway' || step === 'verify') {
    const atGateway = step === 'gateway';
    return (
      <main className="co" dir="rtl">
        <div className="co__done co__pending">
          <span className="co__spinner" aria-hidden="true"><Loader2 /></span>
          <h1>{atGateway ? 'در حال انتقال به درگاه پرداخت' : 'در حال تأیید تراکنش'}</h1>
          <p className="co__done-note">
            {atGateway ? (
              <>
                مبلغ <b className="num-en">{fmt(payable)}</b> تومان از طریق{' '}
                <b>{GATEWAYS.find((g) => g.id === gateway)?.label}</b> پرداخت می‌شود.
                این صفحه را نبندید.
              </>
            ) : (
              <>
                از درگاه برگشتید. تا وقتی تراکنش از سمت سرور تأیید نشده، سفارش
                نهایی نمی‌شود — چند ثانیه طول می‌کشد.
              </>
            )}
          </p>

          <ol className="co__hops" aria-label="مراحل پرداخت">
            <li className="is-done"><Check /> ثبت سفارش</li>
            <li className={atGateway ? 'is-active' : 'is-done'}>
              {atGateway ? <Loader2 className="co__hop-spin" /> : <Check />} پرداخت در درگاه
            </li>
            <li className={atGateway ? '' : 'is-active'}>
              {atGateway ? <span className="co__hop-dot" /> : <Loader2 className="co__hop-spin" />} تأیید تراکنش
            </li>
            <li><span className="co__hop-dot" /> تحویل</li>
          </ol>

          <p className="co__legal">
            شماره‌ی پیگیری شما <b className="num-en">{orderId}</b> است. اگر این
            صفحه بسته شد، با همین شماره در <Link href="/track">پیگیری سفارش</Link>
            {' '}وضعیتش را ببینید.
          </p>

          {/* برای بررسی رفتار سایت در حالت شکست */}
          <button type="button" className="co__link co__fail-link" onClick={failPayment}>
            شبیه‌سازی پرداخت ناموفق
          </button>
        </div>
      </main>
    );
  }

  /* ---------- پرداخت ناموفق ---------- */
  if (step === 'failed') {
    return (
      <main className="co" dir="rtl">
        <div className="co__done co__failed">
          <span className="co__done-mark co__done-mark--fail"><XCircle /></span>
          <h1>پرداخت انجام نشد</h1>
          <p className="co__done-note">
            تراکنش از سمت درگاه تأیید نشد. اگر مبلغی از حسابتان کم شده، حداکثر
            تا ۷۲ ساعت خودکار برمی‌گردد — سبد خریدتان هم دست‌نخورده باقی مانده.
          </p>
          <p className="co__legal">
            شماره‌ی پیگیری این تلاش: <b className="num-en">{orderId}</b>
          </p>
          <div className="co__done-actions">
            <button type="button" className="btn btn--primary" onClick={retryPayment}>
              <RotateCcw className="btn__icon" />
              تلاش دوباره
            </button>
            <Link href="/account/tickets" className="btn btn--ghost">ثبت تیکت پشتیبانی</Link>
          </div>
        </div>
      </main>
    );
  }

  /* ---------- نتیجه ---------- */
  if (step === 'done') {
    return (
      <main className="co" dir="rtl">
        <div className="co__done">
          <span className="co__done-mark"><Check /></span>
          <h1>پرداخت با موفقیت انجام شد</h1>
          <p>
            شماره‌ی پیگیری: <b className="num-en">{orderId}</b>
          </p>
          {refId && (
            <p className="co__refid">
              شناسه‌ی تراکنش درگاه: <b className="num-en">{refId}</b>
            </p>
          )}
          <p className="co__done-note">
            کدهای آماده همین حالا در گاوصندوق شماست. اشتراک‌هایی که روی حساب
            شخصی فعال می‌شوند، در زمان اعلام‌شده تکمیل و با پیامک اطلاع داده می‌شوند.
          </p>
          <div className="co__done-actions">
            <Link href="/account/vault" className="btn btn--primary">مشاهده در گاوصندوق</Link>
            <Link href={`/track?code=${orderId}`} className="btn btn--ghost">
              پیگیری سفارش
              <ExternalLink className="btn__icon" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <main className="co" dir="rtl">
      <div className="co__inner">
        {/* ---------- سربرگ سبک ---------- */}
        <header className="co__head">
          <Link href="/" className="co__brand">
            <PhoenixMark className="co__brand-mark" />
            <span>فونیکس شاپ</span>
          </Link>
          <span className="co__secure">
            <Lock className="co__secure-icon" />
            اتصال امن
          </span>
        </header>

        {/* ---------- مسیر گام‌ها ----------

            هر حالت بصری از یک عدد می‌آید: stepIndex. گره‌های قبلی
            تیک می‌خورند، گره‌ی جاری نبض می‌زند، و ریل تا همان‌جا پر
            می‌شود. هیچ کلاسِ وضعیتِ دستی جای دیگری ست نمی‌شود. */}
        <div
          className="cop"
          style={{
            /* درصد پرشدگی تا مرکز گره‌ی جاری. با یک گام، تقسیم بر
               صفر می‌شد؛ آن حالت را صفر می‌گیریم. */
            ['--cop-p' as string]:
              STEPS.length > 1
                ? `${(stepIndex / (STEPS.length - 1)) * 100}%`
                : '100%',
            /* ریل باید از مرکز اولین گره تا مرکز آخری برسد، و مرکز
               هر گره یک‌دومِ عرضِ ستون خودش است. تعداد گام‌ها را از
               اینجا می‌دهیم تا CSS عدد ثابت نداشته باشد. */
            ['--cop-count' as string]: STEPS.length,
          }}
        >
          <span className="cop__rail" aria-hidden="true">
            <span className="cop__fill" />
          </span>

          <ol
            className="cop__list"
            role="list"
            aria-label={`مرحله ${stepIndex + 1} از ${STEPS.length}`}
          >
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                className={`cop__node ${
                  i < stepIndex ? 'is-done' : i === stepIndex ? 'is-current' : ''
                }`}
                aria-current={i === stepIndex ? 'step' : undefined}
              >
                <span className="cop__dot" aria-hidden="true">
                  <span className="cop__num num-en">
                    {(i + 1).toLocaleString('fa-IR')}
                  </span>
                  <svg viewBox="0 0 24 24" className="cop__tick" focusable="false">
                    <path d="m5.5 12.6 4.3 4.3L18.5 7.6" />
                  </svg>
                </span>
                <span className="cop__name">{s.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="co__grid">
          <div className="co__main">
            {error && (
              <p className="co__error">
                <AlertCircle className="ord__alert-icon" />
                {error}
              </p>
            )}

            {/* ============ گام ۱: هویت ============ */}
            {step === 'identify' && (
              <section className="co__card">
                <h2 className="pd__section-title">
                  <Smartphone className="set__group-icon" /> شماره موبایل شما
                </h2>
                <p className="co__hint">
                  سفارش و کدها به این شماره پیامک می‌شوند. رمز عبوری وجود ندارد —
                  ورود فقط با کد یکبارمصرف است.
                </p>

                <div className="vs__field">
                  <label className="vs__label" htmlFor="co-phone">شماره موبایل</label>
                  <input
                    id="co-phone"
                    className="vs__input"
                    dir="ltr"
                    inputMode="numeric"
                    placeholder="09121234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                  />
                </div>

                {otpSent && (
                  <div className="vs__field">
                    <label className="vs__label" htmlFor="co-otp">کد پنج‌رقمی پیامک‌شده</label>
                    <input
                      id="co-otp"
                      className="vs__input"
                      dir="ltr"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="- - - - -"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <span className="vs__hint">
                      کد را دریافت نکردید؟ <button type="button" className="co__link" onClick={sendOtp}>ارسال دوباره</button>
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn--primary co__next"
                  onClick={otpSent ? verifyOtp : sendOtp}
                >
                  {otpSent ? 'تأیید و ادامه' : 'ارسال کد'}
                  <ArrowRight className="btn__icon" />
                </button>
              </section>
            )}

            {/* ============ گام ۲: بازبینی ============ */}
            {step === 'review' && (
              <section className="co__card">
                <h2 className="pd__section-title">
                  <ShieldCheck className="set__group-icon" /> بازبینی سفارش
                </h2>
                <p className="co__hint">
                  اطلاعاتی که وارد کرده‌اید اینجا نمایش داده می‌شود. بعد از پرداخت
                  دیگر قابل تغییر نیست — پس همین حالا بررسی کنید.
                </p>

                {incomplete.length > 0 && (
                  <p className="co__alert">
                    <AlertCircle className="co__alert-icon" />
                    برای <b>{incomplete.length.toLocaleString('fa-IR')}</b> محصول هنوز
                    اطلاعات لازم را نداریم. بعد از پرداخت دیگر چیزی از شما نمی‌پرسیم،
                    پس همین‌جا کاملش کنید.
                  </p>
                )}

                <ul className="co__lines">
                  {lines.map((l) => (
                    <li key={l.key} className="co__line">
                      <div className="co__line-body">
                        <b>{l.product.title}</b>
                        <small>{l.variant.label}</small>

                        {/* ورودی‌های لازم — قابل اصلاح همین‌جا */}
                        {l.product.requiredInputs.map((f) => {
                          const val = fixes[l.key]?.[f.key] ?? l.inputs[f.key] ?? '';
                          const err = fieldError(f, val.trim());
                          return (
                            <span key={f.key} className="co__line-field">
                              <label htmlFor={`co-${l.key}-${f.key}`}>{f.label}</label>
                              <input
                                id={`co-${l.key}-${f.key}`}
                                className={`vs__input ${err ? 'is-error' : ''}`}
                                dir="ltr"
                                type={f.type === 'email' ? 'email' : 'text'}
                                value={val}
                                placeholder={f.example}
                                onChange={(e) => setFix(l.key, f.key, e.target.value)}
                                aria-invalid={!!err}
                              />
                              <small className={err ? 'is-error' : ''}>
                                {err || f.hint || 'ثبت شد'}
                              </small>
                            </span>
                          );
                        })}

                        <span className="co__line-delivery">
                          <Zap className="co__line-icon" />
                          {l.product.deliveryEstimate}
                        </span>
                      </div>

                      <div className="co__line-side">
                        <div className="cart__qty">
                          <button onClick={() => setQuantity(l.key, 1)} aria-label="افزایش">+</button>
                          <span className="num-en">{fmt(l.quantity)}</span>
                          <button onClick={() => setQuantity(l.key, -1)} aria-label="کاهش">−</button>
                        </div>
                        <span className="co__line-price num-en">
                          {fmt(l.variant.price * l.quantity)}
                        </span>
                        <button className="co__remove" onClick={() => remove(l.key)}>حذف</button>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="btn btn--primary co__next"
                  onClick={goToPay}
                  disabled={incomplete.length > 0}
                >
                  ادامه به پرداخت
                  <ArrowRight className="btn__icon" />
                </button>
              </section>
            )}

            {/* ============ گام ۳: پرداخت ============ */}
            {step === 'pay' && (
              <section className="co__card">
                <h2 className="pd__section-title">
                  <CreditCard className="set__group-icon" /> روش پرداخت
                </h2>

                <div className="co__gateways">
                  {GATEWAYS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGateway(g.id)}
                      className={`co__gateway ${gateway === g.id ? 'is-active' : ''}`}
                    >
                      <span className="co__gateway-radio" />
                      <span>
                        <b>{g.label}</b>
                        <small>{g.note}</small>
                      </span>
                    </button>
                  ))}
                </div>

                {PROFILE.walletBalance > 0 && (
                  <label className="co__wallet">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                    />
                    <Wallet className="co__wallet-icon" />
                    <span>
                      استفاده از موجودی کیف پول
                      <b className="num-en"> {fmt(PROFILE.walletBalance)} تومان</b>
                    </span>
                  </label>
                )}

                <button type="button" className="btn btn--primary co__next" onClick={pay}>
                  <Lock className="btn__icon" />
                  پرداخت <span className="num-en">{fmt(payable)}</span> تومان
                </button>

                <p className="co__legal">
                  با پرداخت، <Link href="/rules">قوانین و شرایط گارانتی</Link> را می‌پذیرید.
                </p>
              </section>
            )}
          </div>

          {/* ---------- خلاصه ---------- */}
          <aside className="co__summary">
            <h2 className="co__summary-title">خلاصه‌ی سفارش</h2>

            <div className="co__row">
              <span>جمع کالاها <span className="num-en">({fmt(count)})</span></span>
              <span className="num-en">{fmt(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="co__row co__row--ok">
                <span>تخفیف <span className="num-en">({fmt(couponApplied!)}٪)</span></span>
                <span className="num-en">−{fmt(discount)}</span>
              </div>
            )}

            {walletUsed > 0 && (
              <div className="co__row co__row--ok">
                <span>از کیف پول</span>
                <span className="num-en">−{fmt(walletUsed)}</span>
              </div>
            )}

            <div className="co__coupon">
              <input
                className="vs__input"
                dir="ltr"
                placeholder="کد تخفیف"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                disabled={couponApplied !== null}
              />
              <button
                type="button"
                className="btn btn--soft"
                onClick={applyCoupon}
                disabled={!coupon.trim() || couponApplied !== null}
              >
                {couponApplied !== null ? 'اعمال شد' : 'اعمال'}
              </button>
            </div>

            <div className="co__total">
              <span>قابل پرداخت</span>
              <b className="num-en">{fmt(payable)} <small>تومان</small></b>
            </div>

            <ul className="pd__assurances co__assurances">
              <li><Zap className="pd__assurance-icon pd__assurance-icon--amber" />تحویل بلافاصله پس از تأیید</li>
              <li><ShieldCheck className="pd__assurance-icon pd__assurance-icon--green" />گارانتی تمام دوره</li>
              <li><Lock className="pd__assurance-icon" />اطلاعات کارت نزد ما ذخیره نمی‌شود</li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
