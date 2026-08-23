'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarClock, Check, Copy, Infinity as InfinityIcon,
  Inbox, Phone, RefreshCw, Timer, Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getCountry, type NumberKind } from '../../../data/numbers';
import { sound } from '../../../lib/sound';

/**
 * شماره‌های من.
 *
 * شماره‌ی مجازی برخلاف بقیه‌ی محصولات با تحویل تمام نمی‌شود — بعد از
 * خرید هنوز باید پیامک بیاید. پس این پنل دو کار دارد که هیچ پنل دیگری
 * ندارد: نشان دادن پیامک‌های رسیده، و شمارش معکوس تا انقضای شماره.
 *
 * شمارنده روی سرور رندر نمی‌شود؛ زمان سرور با ساعت مرورگر نمی‌خواند و
 * hydrate را می‌شکند.
 */

const KIND_META: Record<NumberKind, { label: string; Icon: LucideIcon; accent: string }> = {
  once: { label: 'یک‌بار مصرف', Icon: Zap, accent: '#2ecc8f' },
  rental: { label: 'اجاره‌ای', Icon: CalendarClock, accent: '#4a7cf7' },
  permanent: { label: 'دائمی', Icon: InfinityIcon, accent: '#a855f7' },
};

interface Sms {
  from: string;
  code: string;
  at: string;
}

interface MyNumber {
  id: string;
  number: string;
  countryCode: string;
  kind: NumberKind;
  service: string;
  /** میلی‌ثانیه از epoch — برای یک‌بارمصرف چند دقیقه، برای اجاره‌ای روزها */
  expiresAt: number | null;
  messages: Sms[];
}

/* نمونه‌های نمایشی تا وقتی بک‌اند وصل شود. شکلشان همانی است که
   API برمی‌گرداند، پس جایگزینی‌شان یک خط است. */
const DEMO: MyNumber[] = [
  {
    id: 'n1',
    number: '+1 209 555 0148',
    countryCode: 'us',
    kind: 'once',
    service: 'ChatGPT',
    expiresAt: Date.now() + 7 * 60 * 1000,
    messages: [{ from: 'OpenAI', code: '408 512', at: 'یک دقیقه پیش' }],
  },
  {
    id: 'n2',
    number: '+44 7700 900321',
    countryCode: 'gb',
    kind: 'rental',
    service: 'Telegram',
    expiresAt: Date.now() + 18 * 24 * 60 * 60 * 1000,
    messages: [
      { from: 'Telegram', code: '55214', at: 'دیروز' },
      { from: 'Telegram', code: '90277', at: 'سه روز پیش' },
    ],
  },
  {
    id: 'n3',
    number: '+1 415 555 0102',
    countryCode: 'us',
    kind: 'permanent',
    service: 'همه‌ی سرویس‌ها',
    expiresAt: null,
    messages: [],
  },
];

function useTick() {
  const [, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
}

function remaining(expiresAt: number | null, mounted: boolean) {
  if (expiresAt === null) return { text: 'بدون انقضا', urgent: false };
  if (!mounted) return { text: '—', urgent: false };

  const left = expiresAt - Date.now();
  if (left <= 0) return { text: 'منقضی شده', urgent: false, dead: true };

  const mins = Math.floor(left / 60000);
  if (mins < 60) {
    const s = Math.floor((left % 60000) / 1000);
    return {
      text: `${mins.toLocaleString('fa-IR')}:${s.toLocaleString('fa-IR', { minimumIntegerDigits: 2, useGrouping: false })}`,
      urgent: true,
    };
  }
  const days = Math.floor(mins / (60 * 24));
  if (days >= 1) return { text: `${days.toLocaleString('fa-IR')} روز`, urgent: days <= 2 };
  return { text: `${Math.floor(mins / 60).toLocaleString('fa-IR')} ساعت`, urgent: true };
}

export function NumbersPanel() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);
  useTick();

  const copy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text.replace(/\s/g, ''));
    sound.success();
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1800);
  };

  return (
    <div className="numpanel">
      <div className="acc__notice">
        <Phone className="acc__notice-icon" />
        <p>
          پیامک‌ها همین‌جا نمایش داده می‌شوند و نیازی به جای دیگری نیست.
          برای شماره‌های یک‌بارمصرف مهلت کوتاه است — تا وقتی مهلت تمام نشده
          کد را بردارید.
        </p>
      </div>

      <ul className="numpanel__list">
        {DEMO.map((n) => {
          const meta = KIND_META[n.kind];
          const c = getCountry(n.countryCode);
          const left = remaining(n.expiresAt, mounted);
          return (
            <li
              key={n.id}
              className={`numpanel__card ${left.dead ? 'is-dead' : ''}`}
              style={{ ['--n-accent' as string]: meta.accent }}
            >
              <header className="numpanel__head">
                <span className="numpanel__kind">
                  <meta.Icon className="w-3.5 h-3.5" />
                  {meta.label}
                </span>

                <span className={`numpanel__left ${left.urgent ? 'is-urgent' : ''}`}>
                  <Timer className="w-3 h-3" />
                  <span className="num-en">{left.text}</span>
                </span>
              </header>

              <div className="numpanel__number">
                <span className="numpanel__flag" aria-hidden="true">{c?.flag}</span>
                <b className="code-en">{n.number}</b>
                <button
                  type="button"
                  className="numpanel__copy"
                  onClick={() => copy(n.number, n.id)}
                  aria-label="کپی شماره"
                >
                  {copied === n.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="numpanel__meta">
                {c?.name} · {c?.operator} · برای <b>{n.service}</b>
              </p>

              {/* پیامک‌های رسیده */}
              {n.messages.length > 0 ? (
                <ul className="numpanel__sms">
                  {n.messages.map((m, i) => (
                    <li key={i}>
                      <span className="numpanel__sms-from">{m.from}</span>
                      <b className="numpanel__sms-code code-en">{m.code}</b>
                      <span className="numpanel__sms-at">{m.at}</span>
                      <button
                        type="button"
                        className="numpanel__copy"
                        onClick={() => copy(m.code, `${n.id}-${i}`)}
                        aria-label="کپی کد"
                      >
                        {copied === `${n.id}-${i}`
                          ? <Check className="w-3.5 h-3.5" />
                          : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="numpanel__waiting">
                  <Inbox className="w-3.5 h-3.5" />
                  هنوز پیامکی نرسیده. شماره را در سرویس وارد کنید و کد اینجا می‌آید.
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="numpanel__foot">
        <Link href="/numbers" className="btn btn--action">
          <RefreshCw className="btn__icon" />
          گرفتن شماره‌ی تازه
        </Link>
      </div>
    </div>
  );
}
