'use client';

import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, Vault, RefreshCw, Wallet,
  LifeBuoy, ShieldCheck, Settings, Plus, Clock, ChevronLeft,
  Phone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NewTicketFlow } from './NewTicketFlow';
import { TicketThread } from './TicketThread';
import { NumbersPanel } from './panels/NumbersPanel';
import { listTickets, unreadCount, type Ticket } from '../../lib/tickets';
import { VaultPanel } from './panels/VaultPanel';
import { OrdersPanel } from './panels/OrdersPanel';
import {
  OverviewPanel, SubscriptionsPanel, WalletPanel,
  WarrantyPanel, SettingsPanel,
} from './panels/SimplePanels';
import { PROFILE } from '../../data/account';
import { sound } from '../../lib/sound';

/* مسیرها یک‌به‌یک با روت‌های Next.js آینده منطبق‌اند:
   /account/overview ، /account/orders ، ... */
export type AccountTab =
  | 'overview' | 'orders' | 'vault' | 'numbers' | 'subscriptions'
  | 'wallet' | 'tickets' | 'warranty' | 'settings';

/* آیکن‌ها باید LucideIcon باشند نه React.ElementType — یونیونِ عریضِ
   ElementType پراپ‌ها را به never تحلیل می‌برد و className رد می‌شود. */
const NAV: { key: AccountTab; label: string; icon: LucideIcon; path: string }[] = [
  { key: 'overview',      label: 'داشبورد',        icon: LayoutDashboard, path: '/account/overview' },
  { key: 'orders',        label: 'سفارش‌ها',       icon: Package,         path: '/account/orders' },
  { key: 'vault',         label: 'گاوصندوق',       icon: Vault,           path: '/account/vault' },
  { key: 'numbers',       label: 'شماره‌های من',   icon: Phone,           path: '/account/numbers' },
  { key: 'subscriptions', label: 'اشتراک‌ها',      icon: RefreshCw,       path: '/account/subscriptions' },
  { key: 'wallet',        label: 'کیف پول',        icon: Wallet,          path: '/account/wallet' },
  { key: 'tickets',       label: 'تیکت‌ها',        icon: LifeBuoy,        path: '/account/tickets' },
  { key: 'warranty',      label: 'گارانتی',        icon: ShieldCheck,     path: '/account/warranty' },
  { key: 'settings',      label: 'تنظیمات',        icon: Settings,        path: '/account/settings' },
];

const DEMO_ORDERS = [
  { id: 'PHX-482913', label: 'تلگرام پریمیوم ۶ ماهه — ۲۵ مرداد' },
  { id: 'PHX-481022', label: 'کلاد پرو یک ماهه — ۱۹ مرداد' },
  { id: 'PHX-479551', label: 'کنوا پرو یک ساله — ۱۲ مرداد' },
];

const DEMO_TICKETS = [
  {
    id: 'PHX-338201',
    subject: 'ایمیل اکانت کنوا را اشتباه وارد کردم',
    category: 'فعال‌سازی',
    status: 'answered' as const,
    updatedAt: '۲ ساعت پیش',
    unread: true,
  },
  {
    id: 'PHX-337740',
    subject: 'تمدید اشتراک اسپاتیفای',
    category: 'حساب کاربری',
    status: 'closed' as const,
    updatedAt: '۴ روز پیش',
    unread: false,
  },
];

const STATUS_META = {
  open:     { label: 'در انتظار پاسخ', cls: 'is-open' },
  answered: { label: 'پاسخ داده شد',   cls: 'is-answered' },
  closed:   { label: 'بسته شده',       cls: 'is-closed' },
};

interface AccountPageProps {
  initialTab?: AccountTab;
}

export const AccountPage: React.FC<AccountPageProps> = ({ initialTab = 'overview' }) => {
  const [tab, setTab] = useState<AccountTab>(initialTab);
  const [composing, setComposing] = useState(false);
  /** موضوع از پیش پرشده وقتی از گاوصندوق درخواست گارانتی می‌آید */
  const [claimSubject, setClaimSubject] = useState('');
  const [openTicket, setOpenTicket] = useState<string | null>(null);

  /* فهرست تیکت‌ها از حافظه خوانده می‌شود، نه از داده‌ی نمایشی. هر دو
     ثانیه تازه می‌شود تا پاسخ خودکار پشتیبانی بدون رفرش دیده شود. */
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const sync = () => { setTickets(listTickets()); setUnread(unreadCount()); };
    sync();
    const t = setInterval(sync, 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { sound.init(); }, []);

  const active = NAV.find((n) => n.key === tab)!;

  return (
    <div className="acc" dir="rtl">
      <div className="acc__shell">
        {/* ---------- ناوبری کناری ---------- */}
        <aside className="acc__side" aria-label="ناوبری حساب کاربری">
          <div className="acc__user">
            <div className="acc__avatar" aria-hidden="true">{PROFILE.name.charAt(0)}</div>
            <div className="acc__user-meta">
              <span className="acc__user-name">{PROFILE.name}</span>
              <span className="acc__user-tier">
                <ShieldCheck className="acc__tier-icon" />
                عضو {PROFILE.tierLabel}
              </span>
            </div>
          </div>

          <nav className="acc__nav">
            {NAV.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                className={`acc__nav-item ${tab === key ? 'is-active' : ''}`}
                onClick={() => { setTab(key); setComposing(false); }}
                aria-current={tab === key ? 'page' : undefined}
              >
                <Icon className="acc__nav-icon" />
                <span>{label}</span>
                {key === 'tickets' && unread > 0 && (
                  <span className="acc__badge num-en">{unread.toLocaleString('fa-IR')}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* ---------- محتوا ---------- */}
        <main className="acc__main">
          <header className="acc__head">
            <div>
              <nav className="acc__crumbs" aria-label="مسیر">
                <span>حساب کاربری</span>
                <ChevronLeft className="acc__crumb-sep" />
                <span className="acc__crumb-current">{active.label}</span>
              </nav>
              <h1 className="acc__title">{active.label}</h1>
            </div>

            {tab === 'tickets' && !composing && (
              <button type="button" className="btn btn--primary" onClick={() => setComposing(true)}>
                <Plus className="btn__icon" />
                تیکت جدید
              </button>
            )}
          </header>

          {/* ===== تیکت‌ها ===== */}
          {tab === 'tickets' && (
            composing ? (
              <NewTicketFlow
                orders={DEMO_ORDERS}
                initialSubject={claimSubject}
                onCancel={() => { setComposing(false); setClaimSubject(''); }}
                onSubmitted={() => { setTickets(listTickets()); }}
              />
            ) : openTicket ? (
              <TicketThread id={openTicket} onBack={() => setOpenTicket(null)} />
            ) : (
              <>
                <div className="acc__notice">
                  <LifeBuoy className="acc__notice-icon" />
                  <p>
                    قبل از ثبت تیکت، موضوعتان را بنویسید — اگر پاسخ آماده‌ای داشته باشیم
                    بلافاصله نشانتان می‌دهیم و لازم نیست منتظر بمانید.
                  </p>
                </div>

                {tickets.length === 0 && (
                  <p className="tk__hint acc__tickets-empty">
                    هنوز تیکتی ثبت نکرده‌اید. نمونه‌های زیر فقط برای نشان دادن
                    شکل کار است.
                  </p>
                )}

                <ul className="acc__tickets">
                  {/* تیکت‌های واقعی این مرورگر */}
                  {tickets.map((t) => {
                    const meta = STATUS_META[t.status] ?? STATUS_META.open;
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          className="acc__ticket"
                          onClick={() => setOpenTicket(t.id)}
                        >
                          <span className={`acc__ticket-status ${meta.cls}`}>{meta.label}</span>
                          <span className="acc__ticket-body">
                            <span className="acc__ticket-subject">
                              {t.subject}
                              {t.unread && <span className="acc__dot" aria-label="پاسخ خوانده‌نشده" />}
                            </span>
                            <span className="acc__ticket-meta">
                              <span className="code-en">{t.id}</span>
                              <span>·</span>
                              <span>{t.category}</span>
                              <span>·</span>
                              <span className="acc__ticket-time">
                                <Clock className="acc__ticket-clock" />
                                {new Date(t.updatedAt).toLocaleDateString('fa-IR')}
                              </span>
                            </span>
                          </span>
                          <ChevronLeft className="acc__ticket-chevron" />
                        </button>
                      </li>
                    );
                  })}

                  {/* نمونه‌های نمایشی — تا صفحه در نگاه اول خالی نباشد */}
                  {DEMO_TICKETS.map((t) => {
                    const meta = STATUS_META[t.status];
                    return (
                      <li key={t.id}>
                        <button type="button" className="acc__ticket acc__ticket--demo" disabled>
                          <span className={`acc__ticket-status ${meta.cls}`}>{meta.label}</span>
                          <span className="acc__ticket-body">
                            <span className="acc__ticket-subject">
                              {t.subject}
                              {t.unread && <span className="acc__dot" aria-label="پاسخ خوانده‌نشده" />}
                            </span>
                            <span className="acc__ticket-meta">
                              <span className="code-en">{t.id}</span>
                              <span>·</span>
                              <span>{t.category}</span>
                              <span>·</span>
                              <span className="acc__ticket-time">
                                <Clock className="acc__ticket-clock" />
                                {t.updatedAt}
                              </span>
                            </span>
                          </span>
                          <ChevronLeft className="acc__ticket-chevron" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )
          )}

          {tab === 'overview' && <OverviewPanel onGo={(t) => setTab(t as AccountTab)} />}

          {tab === 'orders' && <OrdersPanel />}

          {tab === 'numbers' && <NumbersPanel />}

          {/* از گاوصندوق می‌شود مستقیم تیکت گارانتی زد — موضوع از قبل پر می‌شود
              تا مشتری مجبور نباشد اطلاعات سفارش را دوباره پیدا کند */}
          {tab === 'vault' && (
            <VaultPanel
              onClaim={(item) => {
                setClaimSubject(`مشکل در ${item.productTitle} — سفارش ${item.orderId}`);
                setTab('tickets');
                setComposing(true);
              }}
            />
          )}

          {tab === 'subscriptions' && <SubscriptionsPanel />}
          {tab === 'wallet' && <WalletPanel />}
          {tab === 'warranty' && <WarrantyPanel onGoVault={() => setTab('vault')} />}
          {tab === 'settings' && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
};