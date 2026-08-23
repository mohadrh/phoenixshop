'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Check, ChevronDown, Package } from 'lucide-react';
import { ORDERS, ORDER_STATUS_META, type Order } from '../../../data/account';
import { sound } from '../../../lib/sound';

const fmt = (n: number) => n.toLocaleString('fa-IR');

export function OrdersPanel() {
  const [open, setOpen] = useState<string | null>(
    // سفارشی که منتظر اصلاح است، از ابتدا باز — کاربر نباید دنبالش بگردد
    ORDERS.find((o) => o.status === 'needs_input')?.id ?? null
  );
  const [fixValues, setFixValues] = useState<Record<string, string>>({});
  const [fixed, setFixed] = useState<Set<string>>(new Set());

  const submitFix = (order: Order) => {
    const v = (fixValues[order.id] ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      sound.error();
      return;
    }
    sound.success();
    setFixed((s) => new Set(s).add(order.id));
  };

  return (
    <ul className="ord__list">
      {ORDERS.map((o) => {
        const meta = ORDER_STATUS_META[o.status];
        const isOpen = open === o.id;
        const isFixed = fixed.has(o.id);

        return (
          <li key={o.id} className={`ord__item ${isOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="ord__head"
              aria-expanded={isOpen}
              onClick={() => { sound.click(); setOpen(isOpen ? null : o.id); }}
            >
              <span className={`acc__ticket-status is-${meta.tone}`}>
                {isFixed && o.status === 'needs_input' ? 'اصلاح شد' : meta.label}
              </span>

              <span className="ord__head-body">
                <span className="ord__head-title">
                  {o.lines.map((l) => l.productTitle).join('، ')}
                </span>
                <span className="ord__head-meta">
                  <span className="code-en">{o.id}</span>
                  <span>·</span>
                  <span>{o.createdAt}</span>
                  <span>·</span>
                  <span className="num-en">{fmt(o.total)} تومان</span>
                </span>
              </span>

              <ChevronDown className="ord__chevron" />
            </button>

            {isOpen && (
              <div className="ord__body">
                {o.note && !isFixed && (
                  <p className="ord__alert">
                    <AlertCircle className="ord__alert-icon" />
                    {o.note}
                  </p>
                )}

                <ul className="ord__lines">
                  {o.lines.map((l, i) => (
                    <li key={i} className="ord__line">
                      <div>
                        <b>{l.productTitle}</b>
                        <small>{l.variantLabel}</small>
                        {l.inputs && (
                          <span className="ord__inputs num-en">
                            {Object.values(l.inputs).join(' · ')}
                          </span>
                        )}
                      </div>
                      <span className="ord__line-price num-en">
                        {fmt(l.price)} × {fmt(l.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* اصلاح ورودی — تنها جایی که بعد از پرداخت ورودی گرفته می‌شود،
                    و فقط چون ورودی قبلی رد شده است */}
                {o.status === 'needs_input' && !isFixed && (
                  <div className="ord__fix">
                    <label htmlFor={`fix-${o.id}`} className="vs__label">
                      ایمیل صحیح را وارد کنید
                    </label>
                    <div className="ord__fix-row">
                      <input
                        id={`fix-${o.id}`}
                        type="email"
                        dir="ltr"
                        className="vs__input"
                        placeholder="name@example.com"
                        value={fixValues[o.id] ?? ''}
                        onChange={(e) =>
                          setFixValues((s) => ({ ...s, [o.id]: e.target.value }))
                        }
                      />
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => submitFix(o)}
                      >
                        ثبت اصلاح
                      </button>
                    </div>
                  </div>
                )}

                {isFixed && (
                  <p className="ord__fixed">
                    <Check className="ord__fixed-icon" />
                    اطلاعات اصلاح شد. فعال‌سازی از سر گرفته می‌شود و نتیجه با پیامک اطلاع داده خواهد شد.
                  </p>
                )}

                {o.status === 'delivered' && (
                  <Link href="/account/vault" className="btn btn--soft ord__cta">
                    <Package className="btn__icon" />
                    مشاهده در گاوصندوق
                  </Link>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
