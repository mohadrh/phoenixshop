'use client';

import React, { useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { CartDrawer } from './CartDrawer';
import { AiChat } from './AiChat';
import { SiteFooter } from './SiteFooter';
import { PhoenixScrollToTop } from '../PhoenixScrollToTop';
import { JetFlightOverlay } from '../three/JetFlightOverlay';
import { PhoenixCanvasBackground } from './PhoenixCanvasBackground';
import { SearchModal, useSearchShortcut } from './SearchModal';
import { ShoppingAssistant } from './ShoppingAssistant';

/**
 * پوسته‌ی همیشه‌حاضر سایت.
 *
 * چون در لایوت ریشه نصب شده، ققنوس و چت روی هر روتی هستند — حتی ۴۰۴.
 * تنها استثنا خودِ صفحه‌ی ۴۰۴ است که نوبار و فوتر را کنار می‌زند تا
 * توهم «از بازی خارج شدی» را نشکند.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Ctrl+K از هر جای سایت جست‌وجو را باز می‌کند
  useSearchShortcut(useCallback(() => setSearchOpen(true), []));

  // در چک‌اوت، نوبارِ شلوغ حواس را از پرداخت پرت می‌کند
  const isCheckout = pathname?.startsWith('/checkout') ?? false;

  return (
    <>
      {/* پس‌زمینه‌ی زنده — پشت همه‌چیز، روی هر صفحه */}
      <PhoenixCanvasBackground />

      {!isCheckout && (
        <Navbar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenAssistant={() => setAssistantOpen(true)}
        />
      )}

      {children}

      {!isCheckout && <SiteFooter />}

      {/* روی همه‌ی صفحات */}
      <PhoenixScrollToTop />
      <AiChat />

      {/* اورلی پرواز سوخو — یک نمونه برای کل اپ */}
      <JetFlightOverlay />

      <CartDrawer />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* دستیار خرید — از منو باز می‌شود */}
      <ShoppingAssistant open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </>
  );
}
