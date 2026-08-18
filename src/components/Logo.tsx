import React, { useState } from 'react';
import { Language, translations } from '../utils/i18n';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  currentLang?: Language;
  motto?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  currentLang = 'en',
  motto,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const t = translations[currentLang] || translations.en;
  const displayMotto = motto || t.tagline || 'Seamless Device Ecosystem';

  const containerSizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
  };

  const roundedClasses = {
    sm: 'rounded-xl',
    md: 'rounded-2xl',
    lg: 'rounded-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Luxury Golden Emblem (100% Guaranteed Crisp Vector + Image Fallback) */}
      <div
        className={`relative ${containerSizes[size]} ${roundedClasses[size]} overflow-hidden shadow-xl shadow-amber-950/40 border-2 border-amber-500/40 shrink-0 bg-gradient-to-br from-[#16171d] via-[#0d0e14] to-[#08090d] ring-1 ring-amber-400/30 flex items-center justify-center p-1 group`}
      >
        {!imgFailed ? (
          <img
            src="/logo.jpg"
            alt="LinkBridge"
            className="w-full h-full object-cover object-center rounded-xl transform group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgFailed(true)}
          />
        ) : (
          /* High-Definition Luxury Vector Emblem */
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            <defs>
              {/* Luxury Gold Gradients */}
              <linearGradient id="goldArch" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              <linearGradient id="silverBeam" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>

              <radialGradient id="glowCenter" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Ambient Glow */}
            <circle cx="50" cy="50" r="44" fill="url(#glowCenter)" />

            {/* Geometric Outer Hex-Ring */}
            <circle
              cx="50"
              cy="50"
              r="43"
              stroke="url(#goldArch)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.6"
            />

            {/* Golden Bridge Suspended Arches */}
            <path
              d="M16 68 Q 50 24 84 68"
              stroke="url(#goldArch)"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <path
              d="M24 72 Q 50 36 76 72"
              stroke="url(#silverBeam)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Vertical Suspension Cables */}
            <line x1="32" y1="52" x2="32" y2="70" stroke="#fef08a" strokeWidth="1.2" opacity="0.7" />
            <line x1="42" y1="42" x2="42" y2="70" stroke="#fef08a" strokeWidth="1.2" opacity="0.8" />
            <line x1="50" y1="38" x2="50" y2="70" stroke="#ffffff" strokeWidth="1.6" />
            <line x1="58" y1="42" x2="58" y2="70" stroke="#fef08a" strokeWidth="1.2" opacity="0.8" />
            <line x1="68" y1="52" x2="68" y2="70" stroke="#fef08a" strokeWidth="1.2" opacity="0.7" />

            {/* Bridge Deck Base Platform */}
            <path
              d="M12 72 L88 72"
              stroke="url(#goldArch)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Monogram 'L' & 'B' Luxury Crest in Center */}
            <text
              x="50"
              y="32"
              textAnchor="middle"
              fill="url(#goldArch)"
              fontSize="16"
              fontWeight="900"
              fontFamily="serif"
              letterSpacing="2"
            >
              LB
            </text>

            {/* Center Sync Pulse Diamond */}
            <polygon
              points="50,66 54,70 50,74 46,70"
              fill="#fef08a"
              filter="drop-shadow(0 0 4px #fbbf24)"
            />
          </svg>
        )}

        {/* Specular Rim highlight */}
        <div
          className={`absolute inset-0 ring-1 ring-inset ring-amber-300/30 ${roundedClasses[size]} pointer-events-none`}
        />
      </div>

      {/* Elegant Serif & Metallic Branding */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="font-serif tracking-[0.16em] sm:tracking-[0.18em] font-extrabold text-base sm:text-xl bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-md">
              LINKBRIDGE
            </span>
          </div>
          {/* LinkBridge Motto */}
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] font-sans font-bold text-amber-400/90 -mt-0.5 leading-tight">
            {displayMotto}
          </span>
        </div>
      )}
    </div>
  );
};
