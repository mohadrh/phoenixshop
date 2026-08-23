'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bot, Gamepad2, GraduationCap, Palette, Phone, Send,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIES, PRODUCTS, type CategorySlug } from '../../data/catalog';
import { NUMBER_OFFERS } from '../../data/numbers';
import { sound } from '../../lib/sound';

/**
 * نوار دسته‌بندی — پایین‌ترین ردیف هیرو.
 *
 * کارش یک چیز است: کسی که تازه رسیده، در همان نگاه اول بفهمد اینجا
 * چه چیزهایی هست. هیرو یک محصول را نشان می‌دهد و آن یک محصول تصویر
 * غلطی از تنوع فروشگاه می‌دهد.
 *
 * قبل از رسیدن به خوشه‌ی دکمه‌های دسته محو می‌شود، نه اینکه از زیرشان
 * رد شود — دو چیز متحرک که روی هم بیفتند، هر دو ناخوانا می‌شوند.
 *
 * حرکتش با CSS است و فهرست دو بار رندر می‌شود تا حلقه بدون پرش
 * بسته شود.
 */

const ICONS: Record<CategorySlug, LucideIcon> = {
  ai: Bot,
  creative: Palette,
  social: Send,
  education: GraduationCap,
  gaming: Gamepad2,
};

interface DockItem {
  href: string;
  label: string;
  count: number;
  Icon: LucideIcon;
  accent: string;
}

const ITEMS: DockItem[] = [
  ...[...CATEGORIES].sort((a, b) => a.order - b.order).map((c) => ({
    href: `/shop/${c.slug}`,
    label: c.title,
    count: PRODUCTS.filter((p) => p.category === c.slug).length,
    Icon: ICONS[c.slug],
    accent: c.accent,
  })),
  {
    href: '/numbers',
    label: 'شماره مجازی',
    count: NUMBER_OFFERS.filter((o) => o.stock > 0).length,
    Icon: Phone,
    accent: '#4aa3e8',
  },
];

export function HeroCategoryDock() {
  // دو بار رندر — تا حلقه‌ی بی‌درز
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="hdock" aria-label="دسته‌بندی محصولات">
      <div className="hdock__track">
        {loop.map((it, i) => {
          const dup = i >= ITEMS.length;
          return (
            <Link
              key={`${it.href}-${i}`}
              href={it.href}
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
              aria-hidden={dup}
              inert={dup || undefined}
              className="hdock__item"
              style={{ ['--d-accent' as string]: it.accent }}
            >
              <span className="hdock__icon"><it.Icon className="w-3.5 h-3.5" /></span>
              <span className="hdock__body">
                <b>{it.label}</b>
                <small className="num-en">{it.count.toLocaleString('fa-IR')}</small>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
