import React, { useState } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PresentationViewerProps {
  presentationState: {
    slideIndex: number;
    laserActive: boolean;
    laserX: number;
    laserY: number;
  };
  onSendSlideAction: (action: 'next' | 'prev' | 'first') => void;
}

const SAMPLE_SLIDES = [
  {
    title: 'LinkBridge: Konektivitas HP ↔ Laptop',
    subtitle: 'Solusi Cerdas Kolaborasi Antar Perangkat Tanpa Kabel',
    points: [
      '⚡ Transfer file instan berkecepatan tinggi tanpa batasan kabel',
      '🖱️ Jadikan smartphone sebagai remote mouse, trackpad, dan keyboard',
      '📋 Shared Clipboard tersinkronisasi otomatis dua arah',
      '🎯 Remote Presenter PowerPoint & Laser Pointer nirkabel',
    ],
    bg: 'from-slate-900 via-indigo-950/70 to-slate-950',
  },
  {
    title: 'Kecepatan & Privasi Tanpa Cloud Pihak Ketiga',
    subtitle: 'Komunikasi Peer-to-Peer & Enkripsi Lokal',
    points: [
      '🔒 Data ditransfer langsung antar browser melalui jaringan lokal / WebSocket aman',
      '📱 Kompatibel dengan Android, iOS, Windows, Mac, dan Linux',
      '📦 Dapat di-install langsung sebagai APK PWA di HP Anda',
      '🔋 Hemat daya baterai dengan arsitektur event-driven efisien',
    ],
    bg: 'from-slate-900 via-cyan-950/70 to-slate-950',
  },
  {
    title: 'Fitur Presenter & Kamera Streamer',
    subtitle: 'Tingkatkan Produktivitas Kerja & Presentasi Anda',
    points: [
      '🎯 Kendalikan slide dari panggung menggunakan tombol HP',
      '🔴 Virtual Laser Pointer gyro bergerak mulus di layar proyektor',
      '📷 Pindai dokumen fisik atau gunakan HP sebagai webcam cadangan',
      '🔔 Bunyikan HP jika terselip di bawah meja atau tas kerja',
    ],
    bg: 'from-slate-900 via-emerald-950/70 to-slate-950',
  },
  {
    title: 'Terima Kasih!',
    subtitle: 'Mulai hubungkan perangkat Anda sekarang',
    points: [
      '🚀 Buka LinkBridge di browser laptop Anda',
      '📱 Scan QR Code menggunakan kamera HP',
      '✨ Nikmati ekosistem terhubung tanpa batas',
    ],
    bg: 'from-slate-900 via-purple-950/70 to-slate-950',
  },
];

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  presentationState,
  onSendSlideAction,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const currentSlide =
    SAMPLE_SLIDES[presentationState.slideIndex % SAMPLE_SLIDES.length];

  return (
    <div
      className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black rounded-none p-6' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Layar Presentasi Slide (Dikontrol dari HP)
            </h4>
            <p className="text-[11px] text-slate-400">
              Gunakan tab "Presenter Remote" di HP untuk mengganti slide & mengarahkan laser
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Slide {(presentationState.slideIndex % SAMPLE_SLIDES.length) + 1} /{' '}
            {SAMPLE_SLIDES.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSendSlideAction('prev')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Slide Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSendSlideAction('next')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Slide Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide Display Container */}
      <div
        className={`relative flex-1 min-h-[320px] rounded-xl overflow-hidden bg-gradient-to-br ${currentSlide.bg} border border-slate-800 p-8 flex flex-col justify-between shadow-2xl select-none`}
      >
        {/* Virtual Laser Pointer from HP */}
        {presentationState.laserActive && (
          <div
            className="absolute z-40 pointer-events-none transition-all duration-75 ease-out"
            style={{
              left: `${presentationState.laserX}%`,
              top: `${presentationState.laserY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/80 animate-ping opacity-75" />
              <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-red-400 border border-white" />
            </div>
          </div>
        )}

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-semibold backdrop-blur-md mb-4 border border-white/10">
            <Sparkles className="w-3 h-3" />
            <span>Slide Mode Proyeksi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            {currentSlide.title}
          </h2>
          <p className="text-sm text-cyan-200/80 font-medium mb-6">
            {currentSlide.subtitle}
          </p>

          <ul className="space-y-3 max-w-xl">
            {currentSlide.points.map((pt, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-slate-200 flex items-start gap-2.5 bg-black/20 p-2.5 rounded-lg backdrop-blur-sm border border-white/5"
              >
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-white/10">
          <span>LinkBridge Wireless Clicker System</span>
          <span className="font-mono">
            Slide {(presentationState.slideIndex % SAMPLE_SLIDES.length) + 1} of {SAMPLE_SLIDES.length}
          </span>
        </div>
      </div>
    </div>
  );
};
