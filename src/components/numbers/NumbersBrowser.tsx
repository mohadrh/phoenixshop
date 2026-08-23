'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CalendarClock, Check, Globe, Infinity as InfinityIcon,
  Phone, Search, ShieldCheck, Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  NUMBER_COUNTRIES, NUMBER_KINDS, NUMBER_SERVICES, SERVICE_GROUPS,
  getCountry, offersFor, type NumberKind, type ServiceGroup,
} from '../../data/numbers';
import { sound } from '../../lib/sound';

/**
 * مرورگر شماره‌ی مجازی.
 *
 * سه فیلتر دارد و ترتیبشان عمدی است: اول نوع، بعد سرویس، آخر کشور.
 * کاربر معمولاً می‌داند «برای تلگرام لازم دارم» و «یک‌بار کافی است»،
 * ولی کشور برایش فرق نمی‌کند تا وقتی قیمت‌ها را ببیند. پس کشور آخرین
 * تصمیم است، نه اولین.
 *
 * فهرست نهایی بر اساس قیمت مرتب می‌شود و ناموجودها ته صف می‌روند —
 * نه حذف، چون نبودنشان هم اطلاعات است.
 */

const ICONS: Record<NumberKind, LucideIcon> = {
  once: Zap,
  rental: CalendarClock,
  permanent: InfinityIcon,
};

const fmt = (n: number) => n.toLocaleString('fa-IR');

const norm = (s: string) =>
  s.replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').toLowerCase().trim();

export function NumbersBrowser() {
  return (
    <Suspense fallback={<main className="nb" dir="rtl" aria-busy="true" />}>
      <NumbersBrowserInner />
    </Suspense>
  );
}

function NumbersBrowserInner() {
  const params = useSearchParams();

  const [kind, setKind] = useState<NumberKind>(
    (params?.get('kind') as NumberKind) || 'once'
  );
  const [service, setService] = useState<string>(params?.get('service') || '');
  const [group, setGroup] = useState<ServiceGroup | 'all'>('all');
  const [country, setCountry] = useState<string>('');
  const [query, setQuery] = useState('');

  const activeKind = NUMBER_KINDS.find((k) => k.id === kind)!;

  const services = useMemo(() => {
    const q = norm(query);
    return NUMBER_SERVICES.filter(
      (s) => (group === 'all' || s.group === group) && (!q || norm(s.name).includes(q))
    );
  }, [group, query]);

  const rows = useMemo(() => {
    const list = offersFor(kind, service || undefined, country || undefined);
    /* ناموجودها می‌مانند ولی ته صف: «نداریم» هم جواب است، و حذفشان
       باعث می‌شود کاربر فکر کند اصلاً چنین ترکیبی وجود ندارد. */
    return [...list].sort((a, b) => {
      if ((a.stock > 0) !== (b.stock > 0)) return a.stock > 0 ? -1 : 1;
      return a.price - b.price;
    });
  }, [kind, service, country]);

  const selectedService = NUMBER_SERVICES.find((s) => s.id === service);

  return (
    <main className="nb" dir="rtl">
      {/* ---------- سربرگ ---------- */}
      <header className="nb__head">
        <span className="nb__eyebrow">
          <Phone className="w-3.5 h-3.5" />
          شماره مجازی
        </span>
        <h1 className="nb__title">شماره‌ی واقعی از کشوری که لازم داری</h1>
        <p className="nb__lead">
          پیامک فعال‌سازی را همین‌جا در پنل می‌بینی. شماره‌ی خودت هیچ‌جا وارد
          نمی‌شود و هیچ اطلاعاتی از حسابی که می‌سازی نزد ما نمی‌ماند.
        </p>
      </header>

      {/* ---------- گام یک: نوع ---------- */}
      <section className="nb__step" aria-label="نوع شماره">
        <h2 className="nb__step-title"><span className="num-en">۱</span> نوع شماره</h2>

        <div className="nb__kinds">
          {NUMBER_KINDS.map((k) => {
            const Icon = ICONS[k.id];
            const on = kind === k.id;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => { sound.click(); setKind(k.id); }}
                aria-pressed={on}
                className={`nb__kind ${on ? 'is-on' : ''}`}
                style={{ ['--k-accent' as string]: k.accent }}
              >
                <span className="nb__kind-icon"><Icon className="w-4 h-4" /></span>
                <span className="nb__kind-body">
                  <b>{k.title}</b>
                  <small>{k.tagline}</small>
                </span>
                {on && <Check className="nb__kind-check" />}
              </button>
            );
          })}
        </div>

        <p className="nb__limit" style={{ ['--k-accent' as string]: activeKind.accent }}>
          <ShieldCheck className="w-4 h-4 shrink-0" />
          {activeKind.limit}
        </p>
      </section>

      {/* ---------- گام دو: سرویس ---------- */}
      <section className="nb__step" aria-label="سرویس">
        <h2 className="nb__step-title"><span className="num-en">۲</span> برای کدام سرویس؟</h2>

        <div className="nb__search">
          <Search className="nb__search-icon" />
          <input
            className="nb__search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اسم سرویس را بنویس…"
            aria-label="جست‌وجوی سرویس"
          />
        </div>

        <div className="nb__groups">
          {SERVICE_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => { sound.click(); setGroup(g.id); }}
              className={`nb__chip ${group === g.id ? 'is-on' : ''}`}
            >
              {g.title}
            </button>
          ))}
        </div>

        <div className="nb__services">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { sound.click(); setService(service === s.id ? '' : s.id); }}
              onMouseEnter={() => sound.hover()}
              aria-pressed={service === s.id}
              className={`nb__service ${service === s.id ? 'is-on' : ''}`}
              style={{ ['--s-accent' as string]: s.accent }}
            >
              <span className="nb__service-mark">{s.mark}</span>
              <span className="nb__service-name">{s.name}</span>
            </button>
          ))}
          {services.length === 0 && (
            <p className="nb__empty">سرویسی با این نام نداریم.</p>
          )}
        </div>
      </section>

      {/* ---------- گام سه: کشور و نتیجه ---------- */}
      <section className="nb__step" aria-label="کشور و قیمت">
        <h2 className="nb__step-title">
          <span className="num-en">۳</span> کشور و قیمت
          {selectedService && <em className="nb__step-note">برای {selectedService.name}</em>}
        </h2>

        <div className="nb__groups">
          <button
            type="button"
            onClick={() => { sound.click(); setCountry(''); }}
            className={`nb__chip ${country === '' ? 'is-on' : ''}`}
          >
            <Globe className="w-3 h-3" /> همه
          </button>
          {NUMBER_COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => { sound.click(); setCountry(country === c.code ? '' : c.code); }}
              className={`nb__chip ${country === c.code ? 'is-on' : ''}`}
            >
              <span aria-hidden="true">{c.flag}</span> {c.name}
            </button>
          ))}
        </div>

        <p className="nb__count">
          <b className="num-en">{fmt(rows.filter((r) => r.stock > 0).length)}</b> گزینه‌ی موجود
        </p>

        <ul className="nb__rows">
          {rows.map((o, i) => {
            const c = getCountry(o.countryCode)!;
            const s = NUMBER_SERVICES.find((x) => x.id === o.serviceId)!;
            const out = o.stock === 0;
            return (
              <li
                key={`${o.serviceId}-${o.countryCode}-${o.kind}-${i}`}
                className={`nb__row ${out ? 'is-out' : ''}`}
                style={{ ['--s-accent' as string]: s.accent }}
              >
                <span className="nb__row-service">
                  <span className="nb__row-mark">{s.mark}</span>
                  <b>{s.name}</b>
                </span>

                <span className="nb__row-country">
                  <span aria-hidden="true">{c.flag}</span>
                  <span>{c.name}</span>
                  <small className="code-en">{c.operator}</small>
                </span>

                <span className="nb__row-stock">
                  {out ? (
                    <em>ناموجود</em>
                  ) : (
                    <>
                      <i className="nb__dot" />
                      <span className="num-en">{fmt(o.stock)}</span> عدد
                    </>
                  )}
                </span>

                <span className="nb__row-price num-en">
                  {fmt(o.price)} <small>تومان</small>
                </span>

                <button
                  type="button"
                  className="btn btn--primary nb__row-buy"
                  disabled={out}
                  onClick={() => sound.addToCart()}
                >
                  {kind === 'once' ? 'دریافت شماره' : 'خرید'}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
