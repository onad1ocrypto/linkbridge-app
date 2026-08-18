import React from 'react';
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
  const t = translations[currentLang] || translations.en;
  const displayMotto = motto || t.tagline || 'Seamless Device Ecosystem';

  const imageSizes = {
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
      {/* Luxury Emblem Image Container (Crisp & High Visibility) */}
      <div
        className={`relative ${imageSizes[size]} ${roundedClasses[size]} overflow-hidden shadow-xl shadow-amber-950/40 border-2 border-amber-500/40 shrink-0 bg-[#0c0d12] ring-1 ring-amber-400/30 flex items-center justify-center p-0.5`}
      >
        <img
          src="/logo.jpg"
          alt="LinkBridge Logo"
          className="w-full h-full object-cover object-center rounded-xl transform hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to stylized emblem if image fails to load
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-900 text-slate-950 font-serif font-black text-base sm:text-xl tracking-tighter">
                  LB
                </div>
              `;
            }
          }}
        />
        {/* Subtle golden specular rim */}
        <div className={`absolute inset-0 ring-1 ring-inset ring-amber-300/30 ${roundedClasses[size]} pointer-events-none`} />
      </div>

      {/* Elegant Serif & Metallic Branding */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="font-serif tracking-[0.16em] sm:tracking-[0.18em] font-extrabold text-base sm:text-xl bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-md">
              LINKBRIDGE
            </span>
          </div>
          {/* LinkBridge Motto (Replaced 'BY SASAM') */}
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] font-sans font-bold text-amber-400/90 -mt-0.5 leading-tight">
            {displayMotto}
          </span>
        </div>
      )}
    </div>
  );
};
