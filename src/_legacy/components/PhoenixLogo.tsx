import React from 'react';

interface PhoenixLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  animateGlow?: boolean;
  onClick?: () => void;
}

/**
 * 3D Glass-Ribbon Fire Phoenix
 * Modeled precisely after the luxury iridescent phoenix emblem:
 * - Left wing: Swirling golden amber & flame orange glass ribbons
 * - Right wing: Majestic magenta, violet & orchid purple crystal curves
 * - Center: Slender crowned bird with sharp beak and flowing tail wisps
 */
export const PhoenixLogo: React.FC<PhoenixLogoProps> = ({
  size = 48,
  className = '',
  showText = true,
  animateGlow = false,
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {/* Iridescent Ambient Aura (Amber on left, Magenta/Violet on right) */}
        <div 
          className={`absolute inset-0 rounded-full blur-lg pointer-events-none transition-all duration-500 ${
            animateGlow ? 'opacity-90 scale-135 animate-pulse' : 'opacity-65 group-hover:opacity-100 group-hover:scale-120'
          }`}
          style={{
            background: 'radial-gradient(circle at 35% 50%, rgba(245, 158, 11, 0.45) 0%, rgba(217, 70, 239, 0.35) 45%, rgba(124, 58, 237, 0.25) 75%, transparent 100%)',
          }}
        />

        {/* 3D Glass Ribbon Phoenix Vector Art */}
        <svg
          viewBox="0 0 300 300"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-[0_0_12px_rgba(245,158,11,0.7)] drop-shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Left Wing Warm Gold/Amber Glass Gradients */}
            <linearGradient id="amberGoldRibbon1" x1="20%" y1="90%" x2="40%" y2="10%">
              <stop offset="0%" stopColor="#c2410c" />
              <stop offset="30%" stopColor="#ea580c" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="90%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            <linearGradient id="amberGoldRibbon2" x1="10%" y1="80%" x2="50%" y2="20%">
              <stop offset="0%" stopColor="#9a3412" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="80%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="amberGoldRibbon3" x1="0%" y1="50%" x2="60%" y2="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            {/* Right Wing Vibrant Violet/Magenta Glass Gradients */}
            <linearGradient id="magentaVioletRibbon1" x1="40%" y1="90%" x2="90%" y2="10%">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="25%" stopColor="#7c3aed" />
              <stop offset="55%" stopColor="#c026d3" />
              <stop offset="85%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fbcfe8" />
            </linearGradient>

            <linearGradient id="magentaVioletRibbon2" x1="30%" y1="70%" x2="85%" y2="20%">
              <stop offset="0%" stopColor="#581c87" />
              <stop offset="35%" stopColor="#9333ea" />
              <stop offset="70%" stopColor="#db2777" />
              <stop offset="95%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="magentaVioletRibbon3" x1="45%" y1="80%" x2="95%" y2="35%">
              <stop offset="0%" stopColor="#6b21a8" />
              <stop offset="40%" stopColor="#a855f7" />
              <stop offset="80%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>

            {/* Central Head & Neck Gradient */}
            <linearGradient id="phoenixHeadBody" x1="30%" y1="20%" x2="65%" y2="80%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="25%" stopColor="#e11d48" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="80%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Tail Wisps Gradient */}
            <linearGradient id="phoenixTailFlow" x1="50%" y1="40%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="40%" stopColor="#d946ef" />
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.2" />
            </linearGradient>

            {/* Specular Highlight Filter */}
            <filter id="glassSpecular" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* === LEFT WING: SWIRLING GOLDEN-AMBER GLASS RIBBONS === */}
          <g filter="url(#glassSpecular)">
            {/* Left Outermost Sweeping Amber Wing Ribbon */}
            <path
              d="M125 135 C105 110, 80 75, 112 55 C114 53, 110 58, 102 65 C82 82, 72 108, 85 136 C92 152, 108 165, 126 150 C130 145, 128 140, 125 135 Z"
              fill="url(#amberGoldRibbon1)"
            />

            {/* Left Main Crescent Ribbon Tip */}
            <path
              d="M112 55 C116 52, 105 60, 95 72 C78 92, 75 118, 92 142 C82 128, 80 102, 98 80 C108 68, 116 58, 112 55 Z"
              fill="url(#amberGoldRibbon2)"
            />

            {/* Left Lower Fiery Ribbon Feather */}
            <path
              d="M102 125 C78 115, 60 120, 52 135 C68 132, 85 138, 106 152 C95 142, 86 132, 102 125 Z"
              fill="url(#amberGoldRibbon3)"
              opacity="0.85"
            />

            {/* Left Inner Swirl */}
            <path
              d="M120 108 C104 95, 96 108, 105 125 C112 138, 124 142, 132 130 C125 122, 115 118, 120 108 Z"
              fill="url(#amberGoldRibbon1)"
              opacity="0.9"
            />
          </g>

          {/* === RIGHT WING: MAJESTIC MAGENTA-PURPLE GLASS RIBBONS === */}
          <g filter="url(#glassSpecular)">
            {/* Right Tallest Arching Wing Ribbon */}
            <path
              d="M152 140 C175 115, 205 70, 185 45 C183 43, 188 50, 196 60 C218 88, 224 125, 195 160 C178 180, 155 188, 142 165 C145 155, 150 148, 152 140 Z"
              fill="url(#magentaVioletRibbon1)"
            />

            {/* Right Outer Feather Ribbon */}
            <path
              d="M185 45 C190 48, 206 68, 218 95 C230 122, 222 148, 202 168 C215 145, 218 118, 206 90 C196 68, 186 52, 185 45 Z"
              fill="url(#magentaVioletRibbon2)"
            />

            {/* Right Wing Upper Delicate Whisps */}
            <path
              d="M175 35 C180 42, 185 58, 178 72 C174 60, 172 48, 175 35 Z"
              fill="#fbcfe8"
              opacity="0.75"
            />

            {/* Right Secondary Sweeping Ribbon */}
            <path
              d="M160 148 C185 138, 212 145, 230 162 C210 162, 188 160, 165 175 C158 165, 158 155, 160 148 Z"
              fill="url(#magentaVioletRibbon3)"
              opacity="0.9"
            />

            {/* Right Lower Trailing Feather Curve */}
            <path
              d="M175 172 C202 178, 218 195, 225 212 C208 205, 190 195, 168 190 C170 182, 172 176, 175 172 Z"
              fill="url(#magentaVioletRibbon1)"
              opacity="0.8"
            />
          </g>

          {/* === CENTER BIRD: HEAD, PROUD CREST, SLEEK NECK & CHEST === */}
          <g filter="url(#glassSpecular)">
            {/* Graceful S-Neck & Body Core */}
            <path
              d="M135 98 C128 92, 122 102, 126 112 C132 125, 142 138, 142 155 C142 175, 130 195, 145 215 C140 198, 148 180, 150 162 C152 142, 142 125, 135 110 C132 104, 134 100, 135 98 Z"
              fill="url(#phoenixHeadBody)"
            />

            {/* Head, Beak & Crown Crest */}
            <path
              d="M125 102 C120 100, 112 106, 108 108 C116 112, 122 110, 128 116 C124 108, 120 102, 125 102 Z"
              fill="#fb7185"
            />
            {/* Crown Crest swooping back */}
            <path
              d="M128 98 C135 92, 145 90, 152 95 C145 96, 138 98, 132 105 C130 100, 128 98, 128 98 Z"
              fill="#f43f5e"
            />
            {/* Beak Sharp Tip */}
            <path
              d="M110 106 L104 108 L112 111 Z"
              fill="#fde047"
            />
            {/* Radiant Eye */}
            <circle cx="120" cy="106" r="1.8" fill="#ffffff" />
            <circle cx="120" cy="106" r="0.8" fill="#4c1d95" />
          </g>

          {/* === TAIL PLUMES & FLOWING EMBERS === */}
          <g>
            {/* Main Long Center Tail Plume */}
            <path
              d="M145 210 C146 228, 142 245, 138 258 C144 245, 148 228, 148 210 Z"
              fill="url(#phoenixTailFlow)"
            />
            {/* Left Tail Wisp (Amber) */}
            <path
              d="M140 215 C135 228, 130 238, 125 245 C132 235, 138 225, 142 215 Z"
              fill="#f59e0b"
              opacity="0.7"
            />
            {/* Right Tail Wisp (Purple) */}
            <path
              d="M148 212 C155 226, 160 238, 165 248 C158 236, 152 224, 148 212 Z"
              fill="#a855f7"
              opacity="0.8"
            />
          </g>

          {/* Glass Ribbons Gleam Highlights */}
          <path
            d="M95 72 C80 92, 78 116, 92 138"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M195 62 C215 88, 220 120, 198 152"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M128 114 C134 126, 144 140, 144 158"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-right leading-none">
          <div className="flex items-center gap-1.5 font-black tracking-wider text-lg" style={{ fontFamily: 'var(--font-cinzel), var(--font-vazir)' }}>
            <span className="text-white">PHOENIX</span>
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,122,24,0.6)] font-black">SHOP</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-bold tracking-normal mt-0.5" style={{ fontFamily: 'var(--font-vazir)' }}>
            فروشگاه تخصصی گیم و هوش مصنوعی
          </span>
        </div>
      )}
    </div>
  );
};
