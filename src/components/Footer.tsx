import React from 'react';
import { ShieldCheck, Wifi, Sparkles } from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { Logo } from './Logo';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <footer className="w-full border-t border-amber-950/30 bg-[#08090c] py-6 px-4 sm:px-8 mt-auto select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Left: Brand info & Copyright SASAM */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <Logo size="sm" showText={false} currentLang={currentLang} />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-serif tracking-widest font-bold text-amber-200/90 text-sm">
                LINKBRIDGE
              </span>
              <span className="text-[10px] text-amber-500/80 font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                v2.0
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5 font-medium tracking-wide">
              {t.copyright}
            </p>
          </div>
        </div>

        {/* Center: Badges & Features */}
        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-400/90 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Speed Cross-Device Relay</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>End-to-End Room Isolation</span>
          </div>
        </div>

        {/* Right: SASAM Trademark statement */}
        <div className="text-slate-400 text-[11px] text-center sm:text-right font-medium">
          Powered by <strong className="text-amber-300 font-semibold">SASAM</strong> Engineering
        </div>
      </div>
    </footer>
  );
};
