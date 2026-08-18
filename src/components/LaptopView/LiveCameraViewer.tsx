import React, { useState } from 'react';
import {
  Camera,
  Maximize2,
  Minimize2,
  Download,
  Scan,
  RefreshCw,
  Smartphone,
  Eye,
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface LiveCameraViewerProps {
  cameraFrame: string | null;
  cameraActive: boolean;
  onSendControl: (action: 'start' | 'stop' | 'toggle_flash' | 'flip_camera') => void;
  currentLang?: Language;
}

export const LiveCameraViewer: React.FC<LiveCameraViewerProps> = ({
  cameraFrame,
  cameraActive,
  onSendControl,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filterMode, setFilterMode] = useState<'normal' | 'scanner' | 'high_contrast'>('normal');

  const handleDownloadSnapshot = () => {
    if (!cameraFrame) return;
    const a = document.createElement('a');
    a.href = cameraFrame;
    a.download = `LinkBridge_Camera_${Date.now()}.png`;
    a.click();
    sounds.playClick();
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'scanner':
        return 'grayscale(100%) contrast(175%) brightness(110%)';
      case 'high_contrast':
        return 'contrast(150%) saturate(120%)';
      default:
        return 'none';
    }
  };

  return (
    <div
      className={`bg-[#0e1017] border border-amber-500/20 rounded-3xl p-5 flex flex-col shadow-xl shadow-amber-950/10 ${
        isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/95 max-h-none' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
              {t.cameraViewerTitle}
            </h4>
            <p className="text-[11px] text-slate-400">
              {t.cameraViewerDesc}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {cameraFrame && (
            <>
              <button
                onClick={() =>
                  setFilterMode((m) =>
                    m === 'normal' ? 'scanner' : m === 'scanner' ? 'high_contrast' : 'normal'
                  )
                }
                className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 transition-colors border border-slate-800"
                title="Filter (Normal / Scanner / Contrast)"
              >
                <Scan className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize text-[11px]">{filterMode}</span>
              </button>
              <button
                onClick={handleDownloadSnapshot}
                className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.download}</span>
              </button>
            </>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors border border-slate-800"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Video Feed Stage */}
      <div className="relative w-full h-[400px] bg-slate-950 rounded-2xl border border-amber-500/20 flex items-center justify-center overflow-hidden shadow-inner">
        {cameraFrame ? (
          <img
            src={cameraFrame}
            alt="Phone Camera Stream"
            style={{ filter: getFilterStyle() }}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-slate-500 p-6 text-center">
            <div className="p-4 rounded-2xl bg-amber-500/5 text-amber-400/50 border border-amber-500/10">
              <Smartphone className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">
                {t.cameraOffline}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {t.cameraDesc}
              </p>
            </div>
          </div>
        )}

        {/* Live Indicator HUD */}
        {cameraFrame && (
          <div className="absolute top-3 left-3 bg-red-600/90 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{t.streamingLive}</span>
          </div>
        )}
      </div>
    </div>
  );
};
