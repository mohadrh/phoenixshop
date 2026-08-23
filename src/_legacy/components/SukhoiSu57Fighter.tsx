import React from 'react';

interface SukhoiSu57Props {
  className?: string;
  size?: number;
  afterburnerIntensity?: number; // 0 to 1
  rollAngle?: number; // degrees
  showSonicShockwave?: boolean;
}

/**
 * Ultra High-Detail Sukhoi Su-57 Felon 5th-Gen Stealth Air Superiority Fighter
 * Features:
 * - 3D stealth facet polygon gradients
 * - AL-41F1 3D TVC (Thrust Vectoring Control) twin supersonic plasma afterburners
 * - Prandtl-Glauert vapor cone compression sonic booms
 * - LEVCON (Leading Edge Vortex Controllers) & Wingtip Plasma Trails
 * - HUD laser reflection & Titanium carbon-composite textures
 */
export const SukhoiSu57Fighter: React.FC<SukhoiSu57Props> = ({
  className = '',
  size = 140,
  afterburnerIntensity = 1,
  rollAngle = 0,
  showSonicShockwave = true,
}) => {
  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rollAngle}deg)`,
        filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(56,189,248,0.5))',
      }}
    >
      {/* 1. Supersonic Prandtl-Glauert Vapor Cone Shockwave Rings */}
      {showSonicShockwave && afterburnerIntensity > 0.4 && (
        <>
          <div
            className="absolute inset-x-[-20%] top-[35%] h-[40%] rounded-full border-2 border-cyan-300/70 bg-gradient-to-b from-cyan-400/25 via-blue-500/10 to-transparent blur-[1px] animate-ping pointer-events-none"
            style={{ animationDuration: '0.8s' }}
          />
          <div
            className="absolute inset-x-[-10%] top-[45%] h-[30%] rounded-full border border-white/60 bg-cyan-400/20 blur-[0.5px] animate-pulse pointer-events-none"
            style={{ animationDuration: '0.4s' }}
          />
        </>
      )}

      {/* 2. Supersonic AL-41F1 Dual TVC Plasma Afterburners */}
      {afterburnerIntensity > 0 && (
        <div className="absolute inset-x-0 bottom-[-28%] flex justify-center gap-[26%] z-0 pointer-events-none">
          {/* Left Engine Plasma Cone */}
          <div className="relative flex flex-col items-center">
            {/* Outer Diamond Shock Wave Flame */}
            <div
              className="w-5 h-20 bg-gradient-to-b from-white via-cyan-300 via-orange-500 to-transparent rounded-full blur-[1px] animate-pulse"
              style={{
                boxShadow: '0 0 25px #38bdf8, 0 0 45px #f97316, 0 0 60px #ef4444',
                opacity: afterburnerIntensity,
              }}
            />
            {/* Mach Diamonds Inner Shock Nodes */}
            <div className="absolute top-1 w-2 h-3 bg-white rounded-full blur-[0.3px]" />
            <div className="absolute top-6 w-1.5 h-2 bg-cyan-200 rounded-full blur-[0.3px]" />
            <div className="absolute top-11 w-1 h-1.5 bg-orange-300 rounded-full blur-[0.3px]" />
          </div>

          {/* Right Engine Plasma Cone */}
          <div className="relative flex flex-col items-center">
            {/* Outer Diamond Shock Wave Flame */}
            <div
              className="w-5 h-20 bg-gradient-to-b from-white via-cyan-300 via-orange-500 to-transparent rounded-full blur-[1px] animate-pulse"
              style={{
                boxShadow: '0 0 25px #38bdf8, 0 0 45px #f97316, 0 0 60px #ef4444',
                opacity: afterburnerIntensity,
              }}
            />
            {/* Mach Diamonds Inner Shock Nodes */}
            <div className="absolute top-1 w-2 h-3 bg-white rounded-full blur-[0.3px]" />
            <div className="absolute top-6 w-1.5 h-2 bg-cyan-200 rounded-full blur-[0.3px]" />
            <div className="absolute top-11 w-1 h-1.5 bg-orange-300 rounded-full blur-[0.3px]" />
          </div>
        </div>
      )}

      {/* 3. High-Fidelity Vector Su-57 Felon Airframe */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full relative z-10 filter contrast-125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Titanium Composite Stealth Gradient */}
          <linearGradient id="su57BodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="25%" stopColor="#94a3b8" />
            <stop offset="55%" stopColor="#475569" />
            <stop offset="85%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Russian Digital Splinter Blue/Cyan Camo */}
          <linearGradient id="su57SplinterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#0284c7" />
            <stop offset="70%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Gold-Coated Radar-Absorbent Cockpit Canopy */}
          <linearGradient id="su57GoldCanopy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0369a1" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="1" />
          </linearGradient>

          {/* Engine Exhaust Ceramic Nozzles */}
          <linearGradient id="su57NozzleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="80%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          <filter id="su57Shadow">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.9" />
          </filter>
        </defs>

        {/* --- Main Aerodynamic Titanium Airframe & Blended Wing Body --- */}
        <path
          d="M250 25 
             L272 105 L298 165 L465 295 L448 345 L325 335 
             L318 405 L288 405 L276 360 L224 360 L212 405 L182 405 L175 335 
             L52 345 L35 295 L202 165 L228 105 Z"
          fill="url(#su57BodyGrad)"
          stroke="#94a3b8"
          strokeWidth="2.5"
          filter="url(#su57Shadow)"
        />

        {/* --- LEVCON (Leading Edge Vortex Controller) Movable Slats --- */}
        <polygon points="250,95 285,155 250,150" fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />
        <polygon points="250,95 215,155 250,150" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />

        {/* --- Digital Splinter Camouflage Geometric Stealth Facets --- */}
        {/* Forward Fuselage Splinter */}
        <polygon points="250,45 268,105 232,105" fill="url(#su57SplinterGrad)" />
        <polygon points="250,110 286,160 214,160" fill="url(#su57SplinterGrad)" />

        {/* Right Wing Digital Polygonal Camo */}
        <polygon points="298,170 445,290 415,335 320,265" fill="url(#su57SplinterGrad)" />
        <polygon points="330,220 400,260 360,300" fill="#0284c7" opacity="0.8" />
        <polygon points="410,295 450,290 435,325" fill="#38bdf8" />

        {/* Left Wing Digital Polygonal Camo */}
        <polygon points="202,170 55,290 85,335 180,265" fill="url(#su57SplinterGrad)" />
        <polygon points="170,220 100,260 140,300" fill="#0284c7" opacity="0.8" />
        <polygon points="90,295 50,290 65,325" fill="#38bdf8" />

        {/* Central Weapons Bay Doors (Stealth Serrated Sawtooth Edges) */}
        <path
          d="M238 185 L262 185 L262 335 L250 342 L238 335 Z"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <line x1="250" y1="185" x2="250" y2="340" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />

        {/* --- Twin Engine Nacelles & 3D TVC Vectoring Nozzles --- */}
        {/* Left Engine */}
        <rect x="186" y="310" width="32" height="95" rx="7" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        <path d="M188 385 L216 385 L213 410 L191 410 Z" fill="url(#su57NozzleGrad)" stroke="#f97316" strokeWidth="1.5" />
        
        {/* Right Engine */}
        <rect x="282" y="310" width="32" height="95" rx="7" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        <path d="M284 385 L312 385 L309 410 L287 410 Z" fill="url(#su57NozzleGrad)" stroke="#f97316" strokeWidth="1.5" />

        {/* Center Tail "Stinger" Radar Housing */}
        <path d="M244 340 L256 340 L253 395 L247 395 Z" fill="#334155" stroke="#94a3b8" strokeWidth="1" />

        {/* --- Gold/Cyan Stealth Bubble Cockpit & HUD (Heads Up Display) --- */}
        <path
          d="M250 85 Q264 135 261 185 Q250 200 239 185 Q236 135 250 85 Z"
          fill="url(#su57GoldCanopy)"
          stroke="#e2e8f0"
          strokeWidth="1.5"
        />
        {/* Pilot Helmet & HUD Reticle Reflection */}
        <ellipse cx="250" cy="145" rx="4.5" ry="6" fill="#0f172a" />
        <line x1="246" y1="120" x2="254" y2="120" stroke="#4ade80" strokeWidth="1.5" opacity="0.9" />
        <circle cx="250" cy="120" r="2.5" stroke="#4ade80" strokeWidth="0.8" fill="none" opacity="0.9" />

        {/* Wingtip Formation Lights / Red Stars */}
        <polygon
          points="430,305 434,315 444,315 436,322 439,332 430,326 421,332 424,322 416,315 426,315"
          fill="#ef4444"
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        <polygon
          points="70,305 74,315 84,315 76,322 79,332 70,326 61,332 64,322 56,315 66,315"
          fill="#ef4444"
          stroke="#ffffff"
          strokeWidth="0.8"
        />

        {/* Wingtip Plasma Vortex Emitter Trails */}
        <circle cx="455" cy="295" r="2" fill="#38bdf8" className="animate-ping" />
        <circle cx="45" cy="295" r="2" fill="#38bdf8" className="animate-ping" />
      </svg>
    </div>
  );
};

