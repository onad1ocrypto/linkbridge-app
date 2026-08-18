import React from 'react';
import { LaptopDashboard } from './LaptopView/LaptopDashboard';
import { PhoneDashboard } from './PhoneView/PhoneDashboard';
import { Laptop, Smartphone, Info, Sparkles } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface SimulatorViewProps {
  laptopProps: any;
  phoneProps: any;
  currentLang?: Language;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  laptopProps,
  phoneProps,
  currentLang = 'en',
}) => {
  const t = translations[currentLang];

  return (
    <div className="p-3 sm:p-6 space-y-4 max-w-7xl mx-auto">
      {/* Simulation Info Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/25 flex items-center justify-between text-xs text-amber-200/90 shadow-lg shadow-amber-950/10">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>{t.simulatorMode}:</strong> You can test real-time cross-device interactions (Laptop on left and Phone on right) side-by-side on a single screen!
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Laptop Screen (7 cols) */}
        <div className="lg:col-span-7 bg-[#0c0d11]/80 border border-amber-500/20 rounded-3xl p-2 sm:p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/80 px-2">
            <Laptop className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-200">
              {t.laptopMode}
            </span>
          </div>
          <LaptopDashboard {...laptopProps} currentLang={currentLang} />
        </div>

        {/* Right Side: Smartphone Frame Mockup (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 self-start px-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-200">
              {t.phoneMode}
            </span>
          </div>

          {/* Smartphone Bezel */}
          <div className="w-full max-w-[360px] bg-slate-900 border-4 border-slate-800 rounded-[44px] p-3 shadow-2xl relative overflow-hidden ring-1 ring-amber-500/20">
            {/* Speaker & Camera notch */}
            <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
              <div className="w-8 h-1 rounded-full bg-slate-800" />
            </div>

            {/* Inner Phone Screen */}
            <div className="bg-[#090a0f] rounded-[32px] overflow-hidden min-h-[580px] border border-amber-500/15">
              <PhoneDashboard {...phoneProps} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
