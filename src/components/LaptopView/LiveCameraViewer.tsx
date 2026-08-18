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

interface LiveCameraViewerProps {
  cameraFrame: string | null;
  cameraActive: boolean;
  onSendControl: (action: 'start' | 'stop' | 'toggle_flash' | 'flip_camera') => void;
}

export const LiveCameraViewer: React.FC<LiveCameraViewerProps> = ({
  cameraFrame,
  cameraActive,
  onSendControl,
}) => {
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
      className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/95 max-h-none' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Live Stream Kamera HP / Scanner Dokumen
            </h4>
            <p className="text-[11px] text-slate-400">
              Jadikan kamera HP sebagai webcam nirkabel atau scanner dokumen beresolusi tinggi
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
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                title="Ganti Filter Mode (Normal / Scanner Dokumen / Kontras Tinggi)"
              >
                <Scan className="w-3.5 h-3.5 text-cyan-400" />
                <span className="capitalize">{filterMode}</span>
              </button>
              <button
                onClick={handleDownloadSnapshot}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan Gambar</span>
              </button>
            </>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Video / Snapshot Feed Viewport */}
      <div className="relative flex-1 min-h-[300px] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
        {cameraFrame ? (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <img
              src={cameraFrame}
              alt="Live Feed HP"
              className="max-h-full max-w-full object-contain rounded-lg shadow-lg transition-all"
              style={{ filter: getFilterStyle() }}
            />
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE FEED DARI HP</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 max-w-md">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-3">
              <Smartphone className="w-6 h-6" />
            </div>
            <h5 className="text-xs font-semibold text-slate-300 mb-1">
              Kamera HP Belum Aktif
            </h5>
            <p className="text-[11px] text-slate-400 mb-4">
              Buka aplikasi di HP, pilih tab <strong>"Kamera Streamer"</strong>, lalu ketuk "Mulai Kamera" untuk menampilkan live feed di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
