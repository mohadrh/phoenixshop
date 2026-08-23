import React from 'react';

interface MarioGameCharacterProps {
  size?: number;
  state?: 'idle' | 'running' | 'jumping' | 'celebrating';
  direction?: 'left' | 'right';
  className?: string;
}

export const MarioGameCharacter: React.FC<MarioGameCharacterProps> = ({
  size = 64,
  state = 'idle',
  direction = 'right',
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-300 ${
        direction === 'left' ? '-scale-x-100' : 'scale-x-100'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 3D Mario Cutout Visual with dynamic jumping / running animation */}
      <div className={`relative w-full h-full flex items-center justify-center ${
        state === 'jumping'
          ? 'animate-bounce drop-shadow-[0_15px_20px_rgba(239,68,68,0.5)]'
          : state === 'running'
          ? 'drop-shadow-[0_8px_15px_rgba(0,0,0,0.6)]'
          : state === 'celebrating'
          ? 'animate-pulse drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]'
          : 'drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]'
      }`}>
        {/* SVG/Layered High-Res 3D Mario Asset */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter contrast-[1.08]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for 3D Mario Hat & Clothes */}
            <linearGradient id="marioRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="50%" stopColor="#e52521" />
              <stop offset="100%" stopColor="#9e0c09" />
            </linearGradient>

            <linearGradient id="marioBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#0066cc" />
              <stop offset="100%" stopColor="#003366" />
            </linearGradient>

            <linearGradient id="marioSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="60%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>

            <linearGradient id="marioGloveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <linearGradient id="marioShoeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#854d0e" />
              <stop offset="60%" stopColor="#582f0e" />
              <stop offset="100%" stopColor="#2e1404" />
            </linearGradient>

            <linearGradient id="goldButtonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>

          {/* Shadow beneath Mario */}
          <ellipse cx="50" cy="94" rx="24" ry="5" fill="#000000" opacity="0.4" />

          {/* Shoes */}
          <ellipse cx="34" cy="88" rx="12" ry="7" fill="url(#marioShoeGrad)" />
          <ellipse cx="66" cy="88" rx="12" ry="7" fill="url(#marioShoeGrad)" />

          {/* Blue Overalls Leg / Pants */}
          <path d="M30 68 C30 82 46 84 46 72 L46 64 C46 64 30 64 30 68 Z" fill="url(#marioBlueGrad)" />
          <path d="M70 68 C70 82 54 84 54 72 L54 64 C54 64 70 64 70 68 Z" fill="url(#marioBlueGrad)" />

          {/* Red Shirt Body & Arms */}
          <path d="M22 48 Q20 62 26 70 Q35 70 34 52 Z" fill="url(#marioRedGrad)" />
          <path d="M78 48 Q80 62 74 70 Q65 70 66 52 Z" fill="url(#marioRedGrad)" />
          <rect x="32" y="44" width="36" height="24" rx="8" fill="url(#marioRedGrad)" />

          {/* Blue Overalls Torso */}
          <path d="M34 52 L66 52 L64 74 L36 74 Z" fill="url(#marioBlueGrad)" />
          {/* Overalls Straps */}
          <path d="M36 46 L43 46 L42 66 L35 66 Z" fill="url(#marioBlueGrad)" />
          <path d="M64 46 L57 46 L58 66 L65 66 Z" fill="url(#marioBlueGrad)" />

          {/* Yellow Buttons on Overalls */}
          <circle cx="39" cy="58" r="3.2" fill="url(#goldButtonGrad)" stroke="#854d0e" strokeWidth="0.6" />
          <circle cx="61" cy="58" r="3.2" fill="url(#goldButtonGrad)" stroke="#854d0e" strokeWidth="0.6" />

          {/* White Gloves */}
          <circle cx="20" cy="68" r="7" fill="url(#marioGloveGrad)" stroke="#94a3b8" strokeWidth="0.8" />
          {/* Fist punching up if jumping */}
          {state === 'jumping' ? (
            <circle cx="82" cy="24" r="8" fill="url(#marioGloveGrad)" stroke="#94a3b8" strokeWidth="0.8" />
          ) : (
            <circle cx="80" cy="68" r="7" fill="url(#marioGloveGrad)" stroke="#94a3b8" strokeWidth="0.8" />
          )}

          {/* Head & Skin */}
          <circle cx="50" cy="36" r="16" fill="url(#marioSkinGrad)" />
          {/* Nose */}
          <ellipse cx="56" cy="36" rx="7" ry="5.5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.5" />
          {/* Eyes */}
          <ellipse cx="53" cy="30" rx="3" ry="4.5" fill="#ffffff" />
          <ellipse cx="54" cy="30" rx="1.8" ry="3" fill="#0284c7" />
          <circle cx="55" cy="29" r="0.8" fill="#ffffff" />

          {/* Iconic Mustache */}
          <path
            d="M44 41 C46 38 52 38 56 40 C60 38 66 38 68 41 C67 44 60 45 56 43 C52 45 45 44 44 41 Z"
            fill="#1e1b18"
          />

          {/* Sideburns & Ear */}
          <path d="M38 34 C36 34 35 38 38 41 C39 39 39 36 38 34 Z" fill="#451a03" />
          <ellipse cx="38" cy="36" rx="3.5" ry="4.5" fill="url(#marioSkinGrad)" />

          {/* Red Mario Cap with Visor */}
          <path
            d="M32 30 C32 16 68 16 68 30 C68 31 32 31 32 30 Z"
            fill="url(#marioRedGrad)"
          />
          {/* Cap Visor (Brim) */}
          <path
            d="M46 29 C52 28 68 28 74 32 C70 34 50 34 46 29 Z"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="0.6"
          />

          {/* White Emblem with Red 'M' */}
          <circle cx="50" cy="22" r="5.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
          <path
            d="M47.2 24.8 L47.2 20.2 L49 22.8 L51 22.8 L52.8 20.2 L52.8 24.8"
            stroke="#dc2626"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Floating XP / Coin / Star Particle above Mario */}
        {state === 'celebrating' && (
          <div className="absolute -top-6 animate-bounce bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-[0_0_12px_#f59e0b] border border-white">
            ⭐ 1UP!
          </div>
        )}
      </div>
    </div>
  );
};
