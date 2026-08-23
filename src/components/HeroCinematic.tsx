'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { HERO_SLIDES } from '../data/heroSlides';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { sound } from '../lib/sound';
import { ControllerNav } from './ui/ControllerNav';
import { HeroCategoryDock } from './home/HeroCategoryDock';

/* ---------------------------------------------------------------
   دامنه‌ی پارالاکس — طبق مشخصات
   پس‌زمینه ۶ پیکسل هم‌جهت، کاراکتر ۲۲ پیکسل خلاف جهت.
   لایه‌ی میانی ۱۲ پیکسل، تا پله‌ی عمق پیوسته باشه.
--------------------------------------------------------------- */
const DEPTH = {
  backdrop: 6,
  mid: 12,
  cutout: -22, // منفی = خلاف جهت حرکت موس
} as const;

const SLIDE_DURATION = 7200;
const LERP = 0.075; // هرچه کمتر، دنبال‌کردن موس نرم‌تر

export const HeroCinematic: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const cutoutRef = useRef<HTMLDivElement>(null);

  /* موقعیت هدف و موقعیت فعلی — در ref نگه داشته می‌شن تا
     حرکت موس باعث رندر مجدد React نشه. ۶۰ فریم در ثانیه رندر = جنک. */
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const slide = HERO_SLIDES[index];

  /* ---------- احترام به prefers-reduced-motion ---------- */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /* ---------- حلقه‌ی پارالاکس ---------- */
  useEffect(() => {
    if (reduceMotion) return;

    const tick = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * LERP;
      c.y += (t.y - c.y) * LERP;

      // زیر یک‌دهم پیکسل، نوشتن در DOM بی‌فایده‌ست
      if (Math.abs(t.x - c.x) > 0.05 || Math.abs(t.y - c.y) > 0.05) {
        if (backdropRef.current) {
          backdropRef.current.style.transform =
            `translate3d(${c.x * DEPTH.backdrop}px, ${c.y * DEPTH.backdrop}px, 0)`;
        }
        if (midRef.current) {
          midRef.current.style.transform =
            `translate3d(${c.x * DEPTH.mid}px, ${c.y * DEPTH.mid}px, 0)`;
        }
        if (cutoutRef.current) {
          // چرخش خفیف حول محور عمودی، تا کاراکتر حجم پیدا کنه
          cutoutRef.current.style.transform =
            `translate3d(${c.x * DEPTH.cutout}px, ${c.y * DEPTH.cutout}px, 0) ` +
            `rotateY(${c.x * -3.5}deg) rotateX(${c.y * 2}deg)`;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [reduceMotion]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    // لمس هم pointermove تولید می‌کنه — بدون این شرط، کاراکتر با هر تاچ می‌پره
    if (e.pointerType !== 'mouse') return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    // نرمال‌سازی به بازه‌ی ۱- تا ۱+
    target.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    target.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, []);

  const handlePointerLeave = useCallback(() => {
    target.current.x = 0;
    target.current.y = 0;
  }, []);

  /* ---------- چرخش خودکار اسلایدها ---------- */
  useEffect(() => {
    if (isPaused || reduceMotion) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), SLIDE_DURATION);
    return () => clearTimeout(id);
  }, [index, isPaused, reduceMotion]);

  const goTo = (i: number) => setIndex((i + HERO_SLIDES.length) % HERO_SLIDES.length);

  /* ---------- ناوبری با صفحه‌کلید ---------- */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // در RTL جهت فلش‌ها معکوس می‌شه
    if (e.key === 'ArrowLeft') goTo(index + 1);
    if (e.key === 'ArrowRight') goTo(index - 1);
  };

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      aria-roledescription="carousel"
      aria-label="محصولات ویژه"
      tabIndex={0}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      className="hero"
    >
      {/* ============ لایه ۱ — پس‌زمینه، Ken Burns + پارالاکس ۶px ============ */}
      <div ref={backdropRef} className="hero__backdrop-layer">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`hero__backdrop ${i === index ? 'is-active' : ''}`}
            aria-hidden={i !== index}
          >
            <img
              src={s.backdrop}
              alt=""
              className="hero__backdrop-img"
              loading={i === 0 ? 'eager' : 'lazy'}
              // نوار واترمارک پایین تصاویر منبع بریده می‌شه
              style={{ objectPosition: 'center 42%' }}
              onError={(e) => {
                /* اسلایدهایی که هنوز آرت‌ورک ندارند به یک زمینه‌ی
                   برندشده با رنگ خودشان می‌افتند، نه تصویر شکسته. */
                const el = e.currentTarget;
                el.style.display = 'none';
                const host = el.parentElement;
                if (host && !host.dataset.fallback) {
                  host.dataset.fallback = '1';
                  host.style.background =
                    `radial-gradient(ellipse 80% 70% at 50% 40%, ${s.tint}44 0%, ${s.tint}14 45%, transparent 78%), #08060d`;
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* ============ لایه ۲ — جو، نور و ماسک‌های سینمایی، پارالاکس ۱۲px ============ */}
      <div ref={midRef} className="hero__mid-layer" aria-hidden="true">
        <div
          className="hero__tint-glow"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 30% 45%, ${slide.tint}22 0%, transparent 70%)`,
          }}
        />
        <div className="hero__scanlines" />
      </div>

      {/* ماسک‌های ثابت — نباید با موس حرکت کنن، وگرنه لبه‌ی صفحه لو می‌ره */}
      <div className="hero__vignette" aria-hidden="true" />
      <div className="hero__fade-bottom" aria-hidden="true" />
      <div className="hero__fade-side" aria-hidden="true" />

      {/* نوار دسته‌بندی — پایین‌ترین ردیف هیرو */}
      <div className="hero__dock">
        <HeroCategoryDock />
      </div>

      {/* ناوبری — خوشه‌ی دسته، پایین سمت چپ قاب */}
      <div className="hero__controller">
        <ControllerNav
          active={index}
          paused={isPaused}
          onSelect={goTo}
          onTogglePause={() => setIsPaused((v) => !v)}
        />
      </div>

      {/* ============ محتوا ============ */}
      <div className="hero__grid">
        {/* ---- ستون راست (RTL): تایپوگرافی و کنش ---- */}
        <div className="hero__content" key={slide.id}>
          <div className="hero__tags reveal" style={{ '--d': '0ms' } as React.CSSProperties}>
            <span className={`hero__kind hero__kind--${slide.kind}`}>{slide.kindLabel}</span>
            {slide.badge && <span className="hero__badge">{slide.badge}</span>}
            <span className="hero__kicker-text">
              <span className="hero__kicker-dot" />
              {slide.kicker}
            </span>
          </div>

          {/* نام انگلیسی بالا می‌آید و تیتر اصلی می‌شود: کسی که دنبال
              Battlefield است همان را در ذهنش دارد، نه «بتلفیلد». خط
              فارسی زیرش می‌نشیند و کار توضیح را می‌کند. */}
          <h1 className="hero__title">
            <span className="reveal-mask">
              <span className="reveal-inner hero__title-en"
                    style={{ '--d': '90ms' } as React.CSSProperties}>
                {slide.englishTitle}
              </span>
            </span>
          </h1>

          <p className="hero__fa reveal" style={{ '--d': '200ms' } as React.CSSProperties}>
            <span>{slide.titleLead}</span>{' '}
            <span className="hero__fa-accent">{slide.titleAccent}</span>
          </p>

          <p className="hero__desc reveal" style={{ '--d': '400ms' } as React.CSSProperties}>
            {slide.description}
          </p>

          {/* سه نکته‌ی کوتاه — چیزی که خریدار واقعاً دنبالش است */}
          <ul className="hero__highlights reveal" style={{ '--d': '480ms' } as React.CSSProperties}>
            {slide.highlights.map((h) => (
              <li key={h}>
                <Check className="hero__highlight-icon" />
                {h}
              </li>
            ))}
          </ul>

          {/* کنش — معرفی، نه فروش. قیمت در صفحه‌ی محصول است. */}
          <div className="hero__cta reveal" style={{ '--d': '580ms' } as React.CSSProperties}>
            <Link
              href={slide.href}
              className="hero__cta-main"
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
            >
              {/* لکه‌های رنگی شناور پشت متن. داخل یک ظرف با ماسک
                  می‌نشینند تا از گوشه‌های گرد بیرون نزنند — بدون ماسک،
                  بلورشان از لبه‌ی دکمه بیرون می‌ریزد. */}
              <span className="hero__cta-blobs" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <i key={i} className={`hero__cta-blob b${i + 1}`} />
                ))}
              </span>

              <span className="hero__cta-label">
                {slide.ctaLabel}
                <ArrowLeft className="hero__cta-icon" />
              </span>
            </Link>
            {/* دکمه‌ی دوم عمداً به «همه‌ی محصولات» نمی‌رود: آن مقصد همان
                کاری است که منو و بخش دسته‌بندی‌ها می‌کنند، و کاربر را از
                مسیری که هیرو ساخته بیرون می‌انداخت. حالا به دسته‌ی خودِ
                همین اسلاید می‌رود — ادامه‌ی همان علاقه، نه پرش از آن. */}
            <Link
              href={`/shop/${slide.kind}`}
              className="hero__cta-alt"
              onClick={() => sound.click()}
            >
              <Sparkles className="hero__cta-alt-icon" />
              بقیه‌ی {slide.kindLabel}
            </Link>
          </div>
        </div>

        {/* ---- ستون چپ (RTL): کاراکتر، پارالاکس ۲۲px خلاف جهت ---- */}
        <div className="hero__character">
          <div className="hero__character-stage" ref={cutoutRef}>
            <div
              className="hero__character-glow"
              style={{
                background: `radial-gradient(circle, ${slide.tint}44 0%, ${slide.tint}18 45%, transparent 72%)`,
              }}
              aria-hidden="true"
            />
            {slide.cutout && (
              <img
                key={slide.cutout}
                src={slide.cutout}
                alt={slide.englishTitle}
                className={`hero__character-img hero__character-img--${slide.cutoutKind ?? 'character'}`}
                onError={(e) => {
                  // تا وقتی PNG شفاف نرسیده، هیرو بدون این لایه سالم می‌مونه
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ============ ناوبری ============ */}

    </section>
  );
};