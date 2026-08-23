'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Home, RotateCcw, Search } from 'lucide-react';
import { PhoenixMark } from '../brand/PhoenixMark';
import { asset } from '../../lib/asset';

/**
 * صفحه‌ی ۴۰۴ سینمایی.
 *
 * قاب: بازیکن حذف شده و از بازی خارج شده. ویدیو تمام‌صفحه پشت
 * یک لایه‌ی HUD پخش می‌شود؛ متن همیشه روی زمینه‌ی تیره‌شده می‌نشیند
 * تا صرف‌نظر از فریمِ در حال پخش، خوانا بماند.
 */
export function NotFoundScene() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // autoplay بی‌صدا در همه‌ی مرورگرها مجاز است؛ اگر باز هم رد شد،
    // پوستر می‌ماند و صفحه بدون ویدیو کامل کار می‌کند.
    v.play().catch(() => {});

    const onReady = () => setReady(true);
    v.addEventListener('canplay', onReady, { once: true });
    return () => v.removeEventListener('canplay', onReady);
  }, []);

  // شمارنده‌ی «زمان خارج از بازی» — جزئیاتی که قاب را باور‌پذیر می‌کند
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <main className="nf" dir="rtl">
      <video
        ref={videoRef}
        className={`nf__video ${ready ? 'is-ready' : ''}`}
        src={asset('/video/game-over.mp4')}
        poster="/video/game-over-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="nf__grade" aria-hidden="true" />
      <div className="nf__scanlines" aria-hidden="true" />
      <div className="nf__vignette" aria-hidden="true" />

      {/* ---------- HUD ---------- */}
      <div className="nf__hud" aria-hidden="true">
        <span className="nf__hud-corner nf__hud-corner--tl" />
        <span className="nf__hud-corner nf__hud-corner--tr" />
        <span className="nf__hud-corner nf__hud-corner--bl" />
        <span className="nf__hud-corner nf__hud-corner--br" />

        <div className="nf__hud-top">
          <span className="nf__hud-stat">
            <i className="nf__dot nf__dot--red" />
            GAME OVER
          </span>
          <span className="nf__hud-stat num-en">ERR 404</span>
          <span className="nf__hud-stat num-en">{mm}:{ss}</span>
        </div>
      </div>

      {/* ---------- محتوا ---------- */}
      <div className="nf__content">
        <span className="nf__kicker">
          <i className="nf__dot nf__dot--red" />
          شما از بازی خارج شدید
        </span>

        <h1 className="nf__title">
          <span className="nf__code num-en">۴۰۴</span>
          این صفحه در دسترس نیست
        </h1>

        <p className="nf__text">
          آدرسی که دنبالش بودید وجود ندارد، یا جابه‌جا شده. نگران نباشید —
          هیچ‌کدام از سفارش‌ها و اکانت‌های شما تحت تأثیر قرار نگرفته.
        </p>

        <div className="nf__actions">
          <Link href="/" className="btn btn--primary nf__respawn">
            <RotateCcw className="btn__icon" />
            بازگشت به بازی
          </Link>
          <Link href="/shop" className="btn btn--ghost">
            <Search className="btn__icon" />
            فروشگاه
          </Link>
          <Link href="/account/overview" className="btn btn--ghost">
            <Home className="btn__icon" />
            پنل کاربری
          </Link>
        </div>

        <div className="nf__brand">
          <PhoenixMark className="nf__brand-mark" />
          <span>فونیکس شاپ</span>
        </div>
      </div>
    </main>
  );
}
