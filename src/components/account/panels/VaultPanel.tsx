'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle, Check, Copy, Eye, EyeOff, Package,
  Search, ShieldCheck, Vault,
} from 'lucide-react';
import { VAULT, type VaultItem } from '../../../data/account';
import { sound } from '../../../lib/sound';

const KIND_LABEL: Record<VaultItem['kind'], string> = {
  code: 'کد فعال‌سازی',
  account: 'مشخصات اکانت',
  upgrade: 'ارتقای حساب',
};

/** روزهای باقی‌مانده‌ی گارانتی — در نسخه‌ی واقعی از تاریخ میلادی محاسبه می‌شود */
const WARRANTY_DAYS: Record<string, number> = { 'v-1': 148, 'v-2': 12 };

const norm = (s: string) =>
  s.replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').toLowerCase().trim();

export function VaultPanel({ onClaim }: { onClaim: (item: VaultItem) => void }) {
  const [query, setQuery] = useState('');
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  const items = useMemo(() => {
    const q = norm(query);
    if (!q) return VAULT;
    return VAULT.filter((i) =>
      norm([i.productTitle, i.variantLabel, i.brand, i.orderId].join(' ')).includes(q)
    );
  }, [query]);

  const toggleReveal = (key: string) => {
    sound.click();
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      sound.success();
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // کلیپ‌بورد ممکن است رد شود؛ مقدار روی صفحه دیده می‌شود و دستی قابل کپی است
    }
  };

  return (
    <div className="vault">
      <div className="acc__notice">
        <Vault className="acc__notice-icon" />
        <p>
          هرچه تا امروز خریده‌اید اینجاست و برای همیشه می‌ماند. رمزها پنهان‌اند و
          فقط با کلیک خودتان نمایش داده می‌شوند.
        </p>
      </div>

      <div className="cf__search vault__search">
        <Search className="cf__search-icon" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جست‌وجو در خریدها…"
          aria-label="جست‌وجو در گاوصندوق"
        />
      </div>

      {items.length === 0 ? (
        <div className="cf__empty">
          <Package className="cf__empty-icon" />
          <h3>{query ? 'چیزی پیدا نشد' : 'گاوصندوق خالی است'}</h3>
          <p>{query ? 'عبارت دیگری امتحان کنید.' : 'بعد از اولین خرید، همه‌چیز اینجا ظاهر می‌شود.'}</p>
        </div>
      ) : (
        <ul className="vault__list">
          {items.map((item) => {
            const daysLeft = WARRANTY_DAYS[item.id] ?? 0;
            const expiring = daysLeft > 0 && daysLeft <= 14;
            const expired = daysLeft <= 0;

            return (
              <li key={item.id} className="vault__item">
                <header className="vault__head">
                  <span
                    className="vault__brand"
                    style={{ background: `${item.accent}22`, color: item.accent }}
                  >
                    {item.brand.slice(0, 2).toUpperCase()}
                  </span>

                  <div className="vault__title-box">
                    <h3 className="vault__title">{item.productTitle}</h3>
                    <span className="vault__sub">
                      {item.variantLabel} · {KIND_LABEL[item.kind]} ·{' '}
                      <span className="code-en">{item.orderId}</span>
                    </span>
                  </div>

                  <span
                    className={`vault__warranty ${expired ? 'is-expired' : expiring ? 'is-expiring' : ''}`}
                  >
                    <ShieldCheck className="vault__warranty-icon" />
                    {expired
                      ? 'گارانتی تمام شده'
                      : <>{daysLeft.toLocaleString('fa-IR')} روز گارانتی</>}
                  </span>
                </header>

                <div className="vault__secrets">
                  {item.secrets.map((s, i) => {
                    const key = `${item.id}:${i}`;
                    const isRevealed = !s.masked || revealed.has(key);
                    return (
                      <div key={key} className="vault__secret">
                        <span className="vault__secret-label">{s.label}</span>

                        <code className={`vault__secret-value ${isRevealed ? '' : 'is-masked'}`}>
                          {isRevealed ? s.value : '•'.repeat(Math.min(18, s.value.length))}
                        </code>

                        <div className="vault__secret-actions">
                          {s.masked && (
                            <button
                              type="button"
                              onClick={() => toggleReveal(key)}
                              aria-label={isRevealed ? 'پنهان کردن' : 'نمایش'}
                              className="vault__icon-btn"
                            >
                              {isRevealed ? <EyeOff /> : <Eye />}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => copy(key, s.value)}
                            aria-label={`کپی ${s.label}`}
                            className="vault__icon-btn"
                          >
                            {copied === key ? <Check className="is-ok" /> : <Copy />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {item.notes && (
                  <p className="vault__note">
                    <AlertCircle className="vault__note-icon" />
                    {item.notes}
                  </p>
                )}

                <footer className="vault__foot">
                  <span className="vault__delivered">تحویل در {item.deliveredAt}</span>
                  <button
                    type="button"
                    className="btn btn--soft vault__claim"
                    onClick={() => { sound.click(); onClaim(item); }}
                    disabled={expired}
                  >
                    {expired ? 'گارانتی منقضی شده' : 'این اکانت مشکل دارد'}
                  </button>
                </footer>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
