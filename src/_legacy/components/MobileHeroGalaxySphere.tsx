import React, { useEffect, useRef, useState } from 'react';
import { Product } from '../types';
import { PRODUCTS_CATALOG } from '../data/products';
import { Sparkles, ShoppingCart, Eye, Star, Zap, Flame, Compass, RotateCw } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface MobileHeroGalaxySphereProps {
  onAddToCart: (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenQuickView: (product: Product) => void;
}

interface OrbitingProductItem {
  product: Product;
  baseAngle: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  speed: number;
  color: string;
}

export const MobileHeroGalaxySphere: React.FC<MobileHeroGalaxySphereProps> = ({
  onAddToCart,
  onOpenQuickView,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS_CATALOG[0]);
  const [orbitAngle, setOrbitAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastTouchX, setLastTouchX] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Selected standout products for the solar system
  const featuredProducts: OrbitingProductItem[] = [
    {
      product: PRODUCTS_CATALOG.find(p => p.id === 'chatgpt-plus') || PRODUCTS_CATALOG[0],
      baseAngle: 0,
      orbitRadiusX: 135,
      orbitRadiusY: 55,
      speed: 0.008,
      color: '#10a37f',
    },
    {
      product: PRODUCTS_CATALOG.find(p => p.id === 'gta-6') || PRODUCTS_CATALOG[1],
      baseAngle: (Math.PI * 2) / 5 * 1,
      orbitRadiusX: 145,
      orbitRadiusY: 60,
      speed: 0.008,
      color: '#f59e0b',
    },
    {
      product: PRODUCTS_CATALOG.find(p => p.id === 'steam-wallet-usd') || PRODUCTS_CATALOG[2],
      baseAngle: (Math.PI * 2) / 5 * 2,
      orbitRadiusX: 130,
      orbitRadiusY: 50,
      speed: 0.008,
      color: '#38bdf8',
    },
    {
      product: PRODUCTS_CATALOG.find(p => p.id === 'claude-pro') || PRODUCTS_CATALOG[3],
      baseAngle: (Math.PI * 2) / 5 * 3,
      orbitRadiusX: 140,
      orbitRadiusY: 58,
      speed: 0.008,
      color: '#d97706',
    },
    {
      product: PRODUCTS_CATALOG.find(p => p.id === 'ps-plus-deluxe') || PRODUCTS_CATALOG[4],
      baseAngle: (Math.PI * 2) / 5 * 4,
      orbitRadiusX: 135,
      orbitRadiusY: 55,
      speed: 0.008,
      color: '#3b82f6',
    },
  ];

  // Particle Sphere WebGL/Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || 340);
    let height = (canvas.height = canvas.offsetHeight || 340);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 340;
      height = canvas.height = canvas.offsetHeight || 340;
    };

    window.addEventListener('resize', handleResize);

    // Generate 3D Spherical Dotted Point Cloud (دون دون‌های معلق کروی)
    const particleCount = 180;
    const sphereRadius = Math.min(width, height) * 0.38;
    const particles: { x: number; y: number; z: number; size: number; alpha: number; color: string }[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Uniform spherical coordinates distribution
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.sqrt(Math.PI * particleCount) * theta;

      const x = sphereRadius * Math.sin(theta) * Math.cos(phi);
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      const z = sphereRadius * Math.cos(theta);

      const colorPalette = ['#f59e0b', '#fb923c', '#f43f5e', '#a855f7', '#38bdf8'];
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

      particles.push({
        x,
        y,
        z,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        color,
      });
    }

    let rotX = 0.2;
    let rotY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotY += 0.005;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Orbit Ellipse Rings
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 135, 55, Math.PI / 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 145, 60, -Math.PI / 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Render 3D Dotted Sphere Particles
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Sort by Z for depth
      const projected = particles.map((p) => {
        // Rotate around Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;

        // Rotate around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 300;
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        return {
          projX,
          projY,
          scale,
          z: z2,
          size: p.size * scale,
          alpha: p.alpha * (scale * 0.9),
          color: p.color,
        };
      });

      projected.sort((a, b) => a.z - b.z);

      projected.forEach((p) => {
        if (p.scale <= 0) return;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
        ctx.shadowBlur = 8 * p.scale;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      // Central Luminous Core
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 45);
      coreGrad.addColorStop(0, 'rgba(255, 180, 50, 0.8)');
      coreGrad.addColorStop(0.4, 'rgba(244, 63, 94, 0.4)');
      coreGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.15)');
      coreGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#f59e0b';
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Orbit rotation loop
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 0.006) % (Math.PI * 2));
    }, 25);
    return () => clearInterval(interval);
  }, [isDragging]);

  // Touch Drag to Spin the Solar System
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setLastTouchX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - lastTouchX;
    setOrbitAngle((prev) => prev - deltaX * 0.015);
    setLastTouchX(currentX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full overflow-hidden pt-4 pb-6 px-4 flex flex-col items-center">
      {/* Title & Micro-badges */}
      <div className="text-center mb-3 relative z-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold mb-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>منظومه تعاملی محصولات برتر ۳ بعدی</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight" style={{ fontFamily: 'var(--font-vazir)' }}>
          <span>کهکشان هوش مصنوعی و </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500">
            گیمینگ ققنوس
          </span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          برای چرخش منظومه لمس و بکشید • روی هر سیاره ضربه بزنید
        </p>
      </div>

      {/* 3D Solar System Sphere Stage */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-sm h-[320px] flex items-center justify-center select-none"
      >
        {/* Background 3D Dotted Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Orbiting Satellite Products */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {featuredProducts.map((item, index) => {
            const currentAngle = item.baseAngle + orbitAngle;
            // 3D Elliptical Orbit Math
            const x = Math.cos(currentAngle) * item.orbitRadiusX;
            const y = Math.sin(currentAngle) * item.orbitRadiusY;
            const z = Math.sin(currentAngle); // Depth from -1 to 1

            // Scale & Opacity based on depth
            const scale = 0.72 + (z + 1) * 0.22; // 0.72 to 1.16
            const zIndex = Math.round((z + 1) * 50);
            const isFront = z > -0.2;
            const isCurrent = selectedProduct.id === item.product.id;

            return (
              <div
                key={item.product.id}
                onClick={() => {
                  soundEngine.playClick(720, 0.04);
                  setSelectedProduct(item.product);
                }}
                className={`absolute cursor-pointer pointer-events-auto transition-transform duration-150 ease-out`}
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${scale})`,
                  zIndex,
                  opacity: isFront ? 1 : 0.65,
                }}
              >
                <div
                  className={`relative p-2 rounded-2xl backdrop-blur-xl border flex flex-col items-center gap-1 shadow-2xl transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#18112e]/95 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-110'
                      : 'bg-[#0e0a1b]/80 border-white/15 hover:border-white/40'
                  }`}
                  style={{ width: '82px' }}
                >
                  {/* Glowing Orbit Planet Ring */}
                  <div
                    className="w-12 h-12 rounded-xl overflow-hidden bg-black/50 p-1 flex items-center justify-center relative shadow-inner"
                    style={{
                      border: `1.5px solid ${item.color}80`,
                      boxShadow: `0 0 12px ${item.color}40`,
                    }}
                  >
                    <img
                      src={item.product.characterImage || item.product.backdropImage}
                      alt={item.product.title}
                      className="max-h-full max-w-full object-contain filter drop-shadow"
                    />
                  </div>

                  <span className="text-[10px] font-extrabold text-white text-center line-clamp-1 leading-tight w-full">
                    {item.product.title.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-amber-300 font-bold">
                    {item.product.price.toLocaleString('fa-IR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Sun / Phoenix Core Energy Sphere */}
        <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 p-0.5 shadow-[0_0_35px_rgba(245,158,11,0.8)] animate-pulse flex items-center justify-center pointer-events-none">
          <div className="w-full h-full rounded-full bg-[#0d091b] flex items-center justify-center relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 blur-[2px] animate-spin" style={{ animationDuration: '6s' }} />
            <div className="absolute w-4 h-4 rounded-full bg-white blur-[1px] opacity-90" />
          </div>
        </div>
      </div>

      {/* Selected Orbit Product Card Details & Direct Buy Bar */}
      <div className="relative z-20 w-full max-w-md mt-2 rounded-3xl bg-[#110c22]/95 border border-amber-500/30 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3">
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenQuickView(selectedProduct)}
              className="p-2.5 rounded-xl bg-white/10 text-zinc-300 hover:text-white border border-white/10"
              title="مشاهده مشخصات"
            >
              <Eye className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={(e) => onAddToCart(selectedProduct, e)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95 transition-transform"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>خرید فوری (Su-57)</span>
            </button>
          </div>

          {/* Product Title & Price info */}
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-amber-400 text-[11px] mb-0.5">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold">{selectedProduct.rating}</span>
              <span className="text-zinc-500 text-[10px]">({selectedProduct.deliveryTime})</span>
            </div>
            <h4 className="text-sm font-extrabold text-white line-clamp-1" style={{ fontFamily: 'var(--font-vazir)' }}>
              {selectedProduct.title}
            </h4>
            <div className="flex items-baseline gap-1 justify-end mt-0.5">
              <span className="text-sm font-black text-amber-300 font-mono">
                {selectedProduct.price.toLocaleString('fa-IR')}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">تومان</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
