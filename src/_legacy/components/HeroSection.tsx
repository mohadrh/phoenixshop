import React, { useState, useEffect, useRef } from 'react';
import { HeroSlide, Product } from '../types';
import { HERO_SLIDES, PRODUCTS_CATALOG } from '../data/products';
import { ShieldCheck, Zap, Sparkles, ChevronLeft, ChevronRight, ShoppingCart, Play, CheckCircle2, Orbit, Tv } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { MobileHeroGalaxySphere } from './MobileHeroGalaxySphere';

interface HeroSectionProps {
  onAddToCart: (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenQuickView: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAddToCart,
  onOpenQuickView,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isGalaxyMode, setIsGalaxyMode] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = HERO_SLIDES[currentIndex];

  // Mouse parallax handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e) return;
    const clientX = e.clientX ?? 0;
    const clientY = e.clientY ?? 0;
    const innerWidth = window.innerWidth || 1;
    const innerHeight = window.innerHeight || 1;
    const x = (clientX / innerWidth - 0.5) * 25;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMouseOffset({ x, y });
  };

  // Auto carousel rotation
  useEffect(() => {
    if (isGalaxyMode) return;
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [currentIndex, isGalaxyMode]);

  const handleSlideChange = (index: number) => {
    soundEngine.playFireIgnite();
    setCurrentIndex(index);
  };

  // Match hero slide to product catalog for add to cart
  const currentProduct = PRODUCTS_CATALOG.find(p => p.id.includes(currentSlide.id.split('-')[0])) || PRODUCTS_CATALOG[0];

  return (
    <section
      id="hero-section"
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] sm:min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-28 sm:pt-32 pb-12 select-none"
    >
      {/* View Mode Switcher Pill (Cinematic 🎬 vs 3D Galaxy Sphere 🪐) */}
      <div className="relative z-30 mb-2 flex items-center justify-center">
        <div className="p-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl flex items-center gap-1 shadow-lg">
          <button
            onClick={() => {
              soundEngine.playClick(600, 0.04);
              setIsGalaxyMode(false);
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              !isGalaxyMode
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>نمای سینماتیک</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick(750, 0.05);
              setIsGalaxyMode(true);
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isGalaxyMode
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Orbit className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>منظومه ۳ بعدی (موبایل و کروی)</span>
          </button>
        </div>
      </div>

      {/* Conditionally Render either the 3D Solar System Sphere or the Cinematic Hero */}
      {isGalaxyMode ? (
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4">
          <MobileHeroGalaxySphere
            onAddToCart={onAddToCart}
            onOpenQuickView={onOpenQuickView}
          />
        </div>
      ) : (
        <>
          {/* 1. Cinematic Background Layer with dynamic crossfade */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {HERO_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                  idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                style={{
                  transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 8s linear',
                  transform: idx === currentIndex ? `scale(1.04) translate(${mouseOffset.x * -0.3}px, ${mouseOffset.y * -0.3}px)` : 'scale(1.1)',
                }}
              >
                <img
                  src={slide.backdropImage}
                  alt={slide.englishTitle}
                  className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.18] saturate-[1.25]"
                />
                {/* Cinematic Vignette & Shadow Masks */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06040b] via-[#06040b]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#06040b]/90 via-[#06040b]/40 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#06040b_90%)]" />
              </div>
            ))}
          </div>

          {/* 2. Main Content Container */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
            
            {/* RIGHT SIDE (in RTL): Display Typography & CTAs (Cols 1-7) */}
            <div className="lg:col-span-7 flex flex-col justify-center text-right space-y-4 order-2 lg:order-1 pt-2 lg:pt-0">
              
              {/* Version / Release Telemetry Badge */}
              <div className="flex items-center gap-3 justify-end flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {currentSlide.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/40 text-zinc-400 border border-white/5 backdrop-blur-md">
                  {currentSlide.version}
                </span>
              </div>

              {/* Epic Persian Title */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.2]" style={{ fontFamily: 'var(--font-vazir)' }}>
                  {currentSlide.title} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 drop-shadow-[0_0_35px_rgba(255,100,50,0.4)]">
                    {currentSlide.highlightText}
                  </span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-widest text-zinc-400 uppercase pt-0.5" style={{ fontFamily: 'var(--font-cinzel), sans-serif' }}>
                  {currentSlide.englishTitle}
                </p>
              </div>

              {/* Subtitle & Description */}
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed text-justify sm:text-right font-normal">
                {currentSlide.description}
              </p>

              {/* Feature Badges / Warranty Pills */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end pt-1">
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{currentSlide.warranty}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>تحویل فوری و اتوماتیک</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-400" />
                  <span>پشتیبانی ۲۴ ساعته</span>
                </div>
              </div>

              {/* Pricing & Action Bar */}
              <div className="p-3.5 sm:p-4 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                
                {/* 1. Price Module */}
                <div className="flex items-center sm:items-start flex-col text-right w-full sm:w-auto pb-2 sm:pb-0 border-b sm:border-b-0 sm:border-l border-white/10 sm:pl-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400">قیمت نهایی لایسنس:</span>
                    {currentSlide.originalPrice && (
                      <span className="text-[10px] text-zinc-500 line-through">
                        {currentSlide.originalPrice.toLocaleString('fa-IR')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono" style={{ fontFamily: 'var(--font-vazir)' }}>
                      {currentSlide.price.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-xs text-zinc-400 font-bold">تومان</span>
                  </div>
                </div>

                {/* 2. Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Quick View Button */}
                  <button
                    onClick={() => {
                      soundEngine.playClick(650, 0.04);
                      onOpenQuickView(currentProduct);
                    }}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="px-4 py-3 rounded-2xl glass-card text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm hover:bg-white/10 border border-white/15 transition-all duration-300 flex items-center justify-center gap-2 shrink-0"
                  >
                    <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>بررسی جزئیات</span>
                  </button>

                  {/* Main Buy Button with Su-57 Jet Launch Trigger */}
                  <button
                    onClick={(e) => {
                      onAddToCart(currentProduct, e);
                    }}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="flex-1 sm:flex-none px-5 sm:px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_45px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden shrink-0"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out skew-x-12" />
                    <ShoppingCart className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    <span>خرید و دریافت آنی (Su-57 🚀)</span>
                  </button>
                </div>
              </div>

              {/* Supported Platform Badges */}
              <div className="flex items-center gap-2 justify-end pt-1 text-zinc-400 text-xs">
                <span className="text-zinc-500 text-[11px]">پلتفرم‌های پشتیبانی شده:</span>
                {currentSlide.platforms.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-zinc-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* LEFT SIDE (in RTL): Layered Floating Character with 3D Cursor Parallax (Cols 8-12) */}
            <div className="lg:col-span-5 relative flex items-center justify-center order-1 lg:order-2">
              <div 
                className="relative w-full max-w-md h-[300px] sm:h-[420px] lg:h-[480px] flex items-center justify-center transition-transform duration-300 ease-out"
                style={{
                  transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px) rotateY(${mouseOffset.x * 0.4}deg)`,
                }}
              >
                {/* Luminous Holographic Portal Ring */}
                <div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-50"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,100,20,0.5) 0%, rgba(220,38,127,0.3) 45%, rgba(138,43,226,0.15) 70%, transparent 85%)',
                  }}
                />

                {/* Glowing polygon backdrop badge */}
                <div className="absolute inset-6 rounded-3xl bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-purple-600/10 border border-white/10 backdrop-blur-sm -rotate-3 transition-transform duration-700 group-hover:rotate-0" />

                {/* 3D Character Cutout Image */}
                <img
                  key={currentSlide.id}
                  src={currentSlide.characterImage}
                  alt={currentSlide.englishTitle}
                  className="relative z-10 max-h-full w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-700 filter contrast-[1.1] brightness-[1.05]"
                  style={{
                    filter: 'drop-shadow(0 0 25px rgba(255,120,40,0.25)) drop-shadow(0 25px 35px rgba(0,0,0,0.85))',
                  }}
                />
              </div>
            </div>

          </div>

          {/* 3. Bottom Carousel Slider Dots & Navigation Arrows */}
          <div className="relative z-20 mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => handleSlideChange((currentIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10"
              aria-label="اسلاید قبلی"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleSlideChange(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === currentIndex
                      ? 'w-8 bg-gradient-to-r from-amber-400 to-rose-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`اسلاید ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => handleSlideChange((currentIndex + 1) % HERO_SLIDES.length)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10"
              aria-label="اسلاید بعدی"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </section>
  );
};
