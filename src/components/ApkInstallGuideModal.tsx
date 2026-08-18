import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { Logo } from './Logo';

interface ApkInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
}

export const ApkInstallGuideModal: React.FC<ApkInstallGuideModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const t = translations[currentLang];

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-amber-500/25 rounded-3xl p-6 shadow-2xl shadow-amber-950/30 overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Logo size="md" showText={false} currentLang={currentLang} />
          <div>
            <h3 className="font-serif font-bold text-lg text-amber-200 tracking-wide">
              {t.installTitle}
            </h3>
            <p className="text-xs text-slate-400">{t.installSubtitle}</p>
          </div>
        </div>

        {/* Direct Install Button (If PWA prompt is ready) */}
        {deferredPrompt && !isInstalled && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 flex items-center justify-between shadow-xl shadow-amber-600/20">
            <div>
              <p className="font-bold text-sm">One-Click Direct Install Ready</p>
              <p className="text-xs text-slate-900 font-medium">Install LinkBridge directly to your phone menu</p>
            </div>
            <button
              onClick={handleNativeInstall}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold rounded-xl text-xs shadow-lg transition-all"
            >
              Install Now
            </button>
          </div>
        )}

        {/* Android Installation Guide */}
        <div className="space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Smartphone className="w-4 h-4" />
              <span>Android (Google Chrome)</span>
            </div>
            <ol className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  1
                </span>
                <span>{t.androidStep1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  2
                </span>
                <span>{t.androidStep2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  3
                </span>
                <span>{t.androidStep3}</span>
              </li>
            </ol>
          </div>

          {/* iOS Safari Guide */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Smartphone className="w-4 h-4" />
              <span>Apple iPhone / iPad (Safari)</span>
            </div>
            <ol className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  1
                </span>
                <span>{t.iosStep1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  2
                </span>
                <span>{t.iosStep2}</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-600/20 hover:brightness-110 transition-all"
          >
            {t.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
};
