'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownLeft, ArrowUpRight, Bell, Clock, CreditCard, Lock,
  Package, RefreshCw, ShieldCheck, Sparkles, User, Wallet,
} from 'lucide-react';
import {
  ORDERS, ORDER_STATUS_META, PROFILE, SUBSCRIPTIONS,
  SUBSCRIPTION_DAYS_LEFT, SUBSCRIPTION_PROGRESS, VAULT,
  WALLET_TX, WALLET_TX_META,
} from '../../../data/account';
import { sound } from '../../../lib/sound';

const fmt = (n: number) => n.toLocaleString('fa-IR');

/* ============================================================
   داشبورد
   ============================================================ */

export function OverviewPanel({ onGo }: { onGo: (tab: string) => void }) {
  const needsAction = ORDERS.find((o) => o.status === 'needs_input');
  const expiringSoon = SUBSCRIPTIONS
    .filter((s) => (SUBSCRIPTION_DAYS_LEFT[s.id] ?? 999) <= 30)
    .sort((a, b) => (SUBSCRIPTION_DAYS_LEFT[a.id] ?? 0) - (SUBSCRIPTION_DAYS_LEFT[b.id] ?? 0));

  return (
    <div className="ov">
      {/* بلوک اول: چیزی که همین حالا نیاز به کار شما دارد */}
      {needsAction && (
        <div className="ov__action">
          <Bell className="ov__action-icon" />
          <div>
            <b>یک سفارش منتظر شماست</b>
            <small>{needsAction.note}</small>
          </div>
          <button type="button" className="btn btn--primary" onClick={() => onGo('orders')}>
            اصلاح کنم
          </button>
        </div>
      )}

      {expiringSoon.length > 0 && (
        <div className="ov__action ov__action--warn">
          <Clock className="ov__action-icon" />
          <div>
            <b>اشتراک نزدیک به انقضا</b>
            <small>
              {expiringSoon[0].productTitle} تا{' '}
              <span className="num-en">{fmt(SUBSCRIPTION_DAYS_LEFT[expiringSoon[0].id])}</span> روز دیگر تمام می‌شود.
            </small>
          </div>
          <button type="button" className="btn btn--soft" onClick={() => onGo('subscriptions')}>
            تمدید
          </button>
        </div>
      )}

      <div className="ov__stats">
        {[
          { icon: Package, label: 'سفارش‌ها', value: fmt(ORDERS.length), tab: 'orders' },
          { icon: ShieldCheck, label: 'در گاوصندوق', value: fmt(VAULT.length), tab: 'vault' },
          { icon: RefreshCw, label: 'اشتراک فعال', value: fmt(SUBSCRIPTIONS.length), tab: 'subscriptions' },
          { icon: Wallet, label: 'موجودی کیف پول', value: fmt(PROFILE.walletBalance), tab: 'wallet' },
        ].map(({ icon: Icon, label, value, tab }) => (
          <button key={label} type="button" className="ov__stat" onClick={() => onGo(tab)}>
            <Icon className="ov__stat-icon" />
            <span className="ov__stat-value num-en">{value}</span>
            <span className="ov__stat-label">{label}</span>
          </button>
        ))}
      </div>

      <section className="ov__section">
        <div className="ov__section-head">
          <h2>آخرین سفارش‌ها</h2>
          <button type="button" onClick={() => onGo('orders')}>همه</button>
        </div>
        <ul className="ov__orders">
          {ORDERS.slice(0, 3).map((o) => {
            const meta = ORDER_STATUS_META[o.status];
            return (
              <li key={o.id}>
                <span className={`acc__ticket-status is-${meta.tone}`}>{meta.label}</span>
                <span className="ov__order-title">{o.lines[0].productTitle}</span>
                <span className="ov__order-meta num-en">{o.createdAt}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="ov__tier">
        <Sparkles className="ov__tier-icon" />
        <div>
          <b>سطح {PROFILE.tierLabel}</b>
          <small>
            مجموع خرید <span className="num-en">{fmt(PROFILE.totalSpent)}</span> تومان ·{' '}
            <span className="num-en">{fmt(PROFILE.points)}</span> امتیاز
          </small>
        </div>
        <Link href="/#vip-journey" className="btn btn--soft">مزایای باشگاه</Link>
      </section>
    </div>
  );
}

/* ============================================================
   اشتراک‌ها
   ============================================================ */

export function SubscriptionsPanel() {
  return SUBSCRIPTIONS.length === 0 ? (
    <EmptyState icon={RefreshCw} title="اشتراک فعالی ندارید" text="بعد از خرید اولین اشتراک، اینجا نمایش داده می‌شود." />
  ) : (
    <ul className="sub__list">
      {SUBSCRIPTIONS.map((s) => {
        const progress = SUBSCRIPTION_PROGRESS[s.id] ?? 0;
        const daysLeft = SUBSCRIPTION_DAYS_LEFT[s.id] ?? 0;
        const soon = daysLeft <= 30;

        return (
          <li key={s.id} className="sub__item">
            <header className="sub__head">
              <span className="vault__brand" style={{ background: `${s.accent}22`, color: s.accent }}>
                {s.brand.slice(0, 2).toUpperCase()}
              </span>
              <div className="vault__title-box">
                <h3 className="vault__title">{s.productTitle}</h3>
                <span className="vault__sub">{s.variantLabel}</span>
              </div>
              <span className={`sub__days ${soon ? 'is-soon' : ''}`}>
                <span className="num-en">{fmt(daysLeft)}</span> روز مانده
              </span>
            </header>

            <div className="sub__track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <span className="sub__fill" style={{ width: `${progress}%`, background: s.accent }} />
            </div>

            <footer className="sub__foot">
              <span className="sub__dates num-en">{s.startedAt} — {s.endsAt}</span>
              <Link
                href={`/product/${s.productSlug}`}
                className={soon ? 'btn btn--primary' : 'btn btn--soft'}
                onClick={() => sound.click()}
              >
                تمدید اشتراک
              </Link>
            </footer>
          </li>
        );
      })}
    </ul>
  );
}

/* ============================================================
   کیف پول
   ============================================================ */

export function WalletPanel() {
  return (
    <div className="wal">
      <div className="wal__balance">
        <span className="wal__balance-label">موجودی کیف پول</span>
        <span className="wal__balance-value num-en">
          {fmt(PROFILE.walletBalance)} <small>تومان</small>
        </span>
        <button type="button" className="btn btn--primary" onClick={() => sound.click()}>
          <CreditCard className="btn__icon" />
          افزایش موجودی
        </button>
      </div>

      <h2 className="pd__section-title wal__title">تراکنش‌ها</h2>

      <ul className="wal__list">
        {WALLET_TX.map((t) => {
          const meta = WALLET_TX_META[t.kind];
          const positive = t.amount > 0;
          return (
            <li key={t.id} className="wal__tx">
              <span className={`wal__tx-icon ${positive ? 'is-in' : 'is-out'}`}>
                {positive ? <ArrowDownLeft /> : <ArrowUpRight />}
              </span>
              <div className="wal__tx-body">
                <b>{t.description}</b>
                <small>
                  <span className={`acc__ticket-status is-${meta.tone}`}>{meta.label}</span>
                  {' '}{t.createdAt}
                </small>
              </div>
              <span className={`wal__tx-amount num-en ${positive ? 'is-in' : 'is-out'}`}>
                {positive ? '+' : '−'}{fmt(Math.abs(t.amount))}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ============================================================
   گارانتی
   ============================================================ */

export function WarrantyPanel({ onGoVault }: { onGoVault: () => void }) {
  return (
    <div className="war">
      <div className="acc__notice">
        <ShieldCheck className="acc__notice-icon" />
        <p>
          برای ثبت درخواست گارانتی، از گاوصندوق روی «این اکانت مشکل دارد» بزنید —
          اطلاعات سفارش خودکار پر می‌شود و لازم نیست چیزی را دوباره بنویسید.
        </p>
      </div>

      <div className="war__grid">
        {VAULT.map((v) => (
          <div key={v.id} className="war__card">
            <span className="vault__brand" style={{ background: `${v.accent}22`, color: v.accent }}>
              {v.brand.slice(0, 2).toUpperCase()}
            </span>
            <b>{v.productTitle}</b>
            <small>گارانتی تا {v.warrantyEndsAt}</small>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn--primary" onClick={onGoVault}>
        رفتن به گاوصندوق
      </button>
    </div>
  );
}

/* ============================================================
   تنظیمات
   ============================================================ */

export function SettingsPanel() {
  const [notify, setNotify] = useState({ sms: true, email: false, expiry: true });

  return (
    <div className="set">
      <section className="set__group">
        <h2 className="pd__section-title"><User className="set__group-icon" /> پروفایل</h2>
        <div className="set__rows">
          <Row label="نام" value={PROFILE.name} />
          <Row label="شماره موبایل" value={PROFILE.phone} mono />
          <Row label="ایمیل" value={PROFILE.email} mono />
          <Row label="عضو از" value={PROFILE.joinedAt} />
        </div>
      </section>

      <section className="set__group">
        <h2 className="pd__section-title"><Bell className="set__group-icon" /> اعلان‌ها</h2>
        <div className="set__rows">
          {([
            ['sms', 'پیامک وضعیت سفارش'],
            ['email', 'ایمیل خبرنامه و تخفیف‌ها'],
            ['expiry', 'یادآور انقضای اشتراک'],
          ] as const).map(([key, label]) => (
            <label key={key} className="set__toggle">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={notify[key]}
                onChange={(e) => {
                  sound.click();
                  setNotify((s) => ({ ...s, [key]: e.target.checked }));
                }}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="set__group">
        <h2 className="pd__section-title"><Lock className="set__group-icon" /> امنیت</h2>
        <p className="set__security">
          ورود به حساب فقط با کد یکبارمصرف پیامکی انجام می‌شود؛ رمز عبوری وجود ندارد
          که لو برود. اگر شماره‌تان را عوض کردید، از پشتیبانی درخواست تغییر بدهید.
        </p>
      </section>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="set__row">
      <span className="set__row-label">{label}</span>
      <span className={`set__row-value ${mono ? 'num-en' : ''}`}>{value}</span>
    </div>
  );
}

function EmptyState({
  icon: Icon, title, text,
}: { icon: React.ElementType; title: string; text: string }) {
  const I = Icon as React.ComponentType<{ className?: string }>;
  return (
    <div className="cf__empty">
      <I className="cf__empty-icon" />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
