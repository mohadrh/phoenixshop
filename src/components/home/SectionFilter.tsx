'use client';

import React from 'react';
import { Bot, Gamepad2, Layers, Phone, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CategorySlug, Product } from '../../data/catalog';
import { sound } from '../../lib/sound';

/**
 * فیلتر مشترک سکشن‌های کارت‌دار.
 *
 * یک جا تعریف می‌شود و همه‌ی سکشن‌ها همان را می‌گیرند — پیشنهادهای داغ،
 * پرفروش‌ها، تازه‌ها و ظرفیت محدود. اگر هر کدام فیلتر خودش را داشت،
 * کاربر باید در هر سکشن دوباره یاد می‌گرفت کجا را بزند.
 *
 * عمداً قرص‌های کوچک است نه تب‌های بزرگ: این فیلتر فرعی است و نباید
 * از خود کارت‌ها جا بگیرد.
 */

export type SectionScope = 'all' | 'gaming' | 'ai' | 'accounts' | 'numbers';

interface ScopeDef {
  id: SectionScope;
  label: string;
  Icon: LucideIcon;
  accent: string;
  /** کدام دسته‌ها زیر این گروه می‌آیند */
  match?: CategorySlug[];
}

export const SCOPES: ScopeDef[] = [
  { id: 'all',      label: 'همه',           Icon: Layers,    accent: '#e8862e' },
  { id: 'gaming',   label: 'گیم',           Icon: Gamepad2,  accent: '#a855f7', match: ['gaming'] },
  { id: 'ai',       label: 'هوش مصنوعی',    Icon: Bot,       accent: '#f59440', match: ['ai'] },
  { id: 'accounts', label: 'اکانت‌ها',       Icon: Sparkles,  accent: '#de2e6b', match: ['creative', 'social', 'education'] },
  /* شماره مجازی محصول کاتالوگ نیست و ماتریس خودش را دارد، پس اینجا
     فقط یک میان‌بر است نه فیلتر — کارت‌های این گروه از جای دیگری
     می‌آیند و سکشن خودش تصمیم می‌گیرد با آن چه کند. */
  { id: 'numbers',  label: 'شماره مجازی',   Icon: Phone,     accent: '#4aa3e8' },
];

/** فیلتر کردن یک فهرست محصول بر اساس دامنه‌ی انتخاب‌شده */
export function applyScope(products: Product[], scope: SectionScope): Product[] {
  if (scope === 'all') return products;
  const def = SCOPES.find((s) => s.id === scope);
  if (!def?.match) return [];
  return products.filter((p) => def.match!.includes(p.category));
}

export function SectionFilter({
  value,
  onChange,
  /** دامنه‌هایی که در این سکشن معنی ندارند */
  exclude = [],
}: {
  value: SectionScope;
  onChange: (s: SectionScope) => void;
  exclude?: SectionScope[];
}) {
  const shown = SCOPES.filter((s) => !exclude.includes(s.id));

  return (
    <div className="secfil" role="group" aria-label="فیلتر دسته">
      {shown.map(({ id, label, Icon, accent }) => {
        const on = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => { sound.click(); onChange(id); }}
            onMouseEnter={() => sound.hover()}
            aria-pressed={on}
            className={`secfil__chip ${on ? 'is-on' : ''}`}
            style={{ ['--f-accent' as string]: accent }}
          >
            <Icon className="secfil__icon" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
