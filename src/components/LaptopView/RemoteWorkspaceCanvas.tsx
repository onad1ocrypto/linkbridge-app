import React, { useState, useEffect, useRef } from 'react';
import {
  MousePointer2,
  Sparkles,
  Volume2,
  CheckCircle,
  RotateCcw,
  Sliders,
  Type,
  Layers,
  ArrowDownCircle,
  ArrowUpCircle,
  Zap,
  Flame,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

interface RemoteWorkspaceCanvasProps {
  remoteMouse: {
    x: number;
    y: number;
    isDown: boolean;
    button?: string;
    lastAction?: string;
    scrollY?: number;
    scrollDeltaY?: number;
    timestamp: number;
  };
  peerConnected: boolean;
  onOpenDesktopAgent?: () => void;
}

export const RemoteWorkspaceCanvas: React.FC<RemoteWorkspaceCanvasProps> = ({
  remoteMouse,
  peerConnected,
  onOpenDesktopAgent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; time: number } | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [typedText, setTypedText] = useState(
    'Halo dari Laptop! Usap trackpad HP atau geser SCROLL strip di sebelah kanan.'
  );
  const [accentTheme, setAccentTheme] = useState('gold');
  const [scrollProgress, setScrollProgress] = useState(0); // 0 - 100%

  // Handle Real-Time Scroll from Phone
  useEffect(() => {
    if (remoteMouse.lastAction?.startsWith('scroll_') && scrollableContentRef.current) {
      const el = scrollableContentRef.current;
      const delta = (remoteMouse.scrollDeltaY || (remoteMouse.lastAction === 'scroll_down' ? 50 : -50));
      
      el.scrollBy({
        top: delta * 1.5,
        behavior: 'smooth',
      });
    }
  }, [remoteMouse.timestamp, remoteMouse.lastAction, remoteMouse.scrollDeltaY]);

  // Handle Scroll Progress update
  const handleScrollUpdate = () => {
    if (scrollableContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableContentRef.current;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll > 0) {
        setScrollProgress(Math.round((scrollTop / maxScroll) * 100));
      }
    }
  };

  // Trigger visual ripple on remote mouse click
  useEffect(() => {
    if (remoteMouse.lastAction?.startsWith('click')) {
      setClickEffect({
        x: remoteMouse.x,
        y: remoteMouse.y,
        time: Date.now(),
      });

      // Target 1 center detection
      const dist = Math.hypot(remoteMouse.x - 50, remoteMouse.y - 45);
      if (dist < 18) {
        handleTargetClick();
      }
    }
  }, [remoteMouse.timestamp]);

  const handleTargetClick = () => {
    setScore((s) => s + 1);
    sounds.playConnect();
    confetti({
      particleCount: 35,
      spread: 70,
      origin: { x: remoteMouse.x / 100, y: remoteMouse.y / 100 },
    });
  };

  const themes = [
    { id: 'gold', name: 'Luxury Gold', gradient: 'from-amber-600 via-amber-500 to-yellow-500' },
    { id: 'cyan', name: 'Cyber Cyan', gradient: 'from-cyan-600 via-teal-500 to-emerald-500' },
    { id: 'purple', name: 'Royal Violet', gradient: 'from-purple-600 via-indigo-500 to-blue-500' },
    { id: 'rose', name: 'Ruby Rose', gradient: 'from-rose-600 via-pink-500 to-amber-500' },
  ];

  const currentThemeObj = themes.find((t) => t.id === accentTheme) || themes[0];

  const cycleTheme = () => {
    const nextIdx = (themes.findIndex((t) => t.id === accentTheme) + 1) % themes.length;
    setAccentTheme(themes[nextIdx].id);
    sounds.playClick();
  };

  return (
    <div className="bg-[#0c0d12] border border-amber-500/25 rounded-3xl p-4 sm:p-5 flex flex-col shadow-2xl shadow-amber-950/20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-inner">
            <MousePointer2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-bold text-amber-200 tracking-wide flex items-center gap-2">
              Layar Uji Trackpad & Scroll Interaktif
            </h4>
            <p className="text-xs text-slate-400">
              Gerakkan jari di tab 'Trackpad' pada HP atau geser bilah SCROLL untuk menguji kursor & scroll halus
            </p>
          </div>
        </div>

        {/* Live Cursor Telemetry */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <div className="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-300">
            X: <strong className="text-amber-300">{remoteMouse.x.toFixed(0)}%</strong> Y:{' '}
            <strong className="text-amber-300">{remoteMouse.y.toFixed(0)}%</strong> • Scroll:{' '}
            <strong className="text-amber-400">{scrollProgress}%</strong>
          </div>

          <span
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 ${
              peerConnected
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-950/50 text-amber-300 border-amber-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                peerConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {peerConnected ? 'HP Tersambung' : 'Menunggu HP'}
          </span>
        </div>
      </div>

      {/* OS Level Remote Mouse Helper Prompt */}
      {onOpenDesktopAgent && (
        <div className="mb-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-amber-200">
              <strong>Ingin mengontrol kursor fisik OS di seluruh Windows/Mac (Game, PPT, Desktop)?</strong>
            </span>
          </div>
          <button
            onClick={onOpenDesktopAgent}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-600/20 self-start sm:self-auto shrink-0"
          >
            Aktifkan Native OS Agent
          </button>
        </div>
      )}

      {/* Main Virtual Stage with Real Scrollable Feed */}
      <div
        ref={containerRef}
        className="relative w-full h-[460px] bg-[#07080b] rounded-2xl border border-amber-500/20 overflow-hidden select-none shadow-inner"
      >
        {/* Background Decorative Grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(245 158 11 / 0.7) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Remote Virtual Pointer (Layered on top of content) */}
        <div
          className="absolute z-40 pointer-events-none transition-all duration-75 ease-out"
          style={{
            left: `${remoteMouse.x}%`,
            top: `${remoteMouse.y}%`,
            transform: 'translate(-4px, -4px)',
          }}
        >
          <div className="relative">
            <MousePointer2
              className={`w-7 h-7 fill-amber-400 text-slate-950 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)] transition-transform ${
                remoteMouse.isDown ? 'scale-90 fill-amber-200' : ''
              }`}
            />
            <span className="absolute -top-5 left-4 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-mono text-[9px] font-black tracking-tight shadow-md whitespace-nowrap">
              HP CURSOR
            </span>
          </div>
        </div>

        {/* Visual Click Ripple */}
        {clickEffect && (
          <div
            key={clickEffect.time}
            className="absolute z-30 pointer-events-none w-12 h-12 -ml-6 -mt-6 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-ping"
            style={{
              left: `${clickEffect.x}%`,
              top: `${clickEffect.y}%`,
            }}
          />
        )}

        {/* Floating Controls Overlay */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <button
            onClick={cycleTheme}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-all shadow-md"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Tema Warna</span>
          </button>

          <button
            onClick={() => sounds.playPingAlert()}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-all shadow-md"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Tes Audio</span>
          </button>
        </div>

        {/* Floating Scroll Indicator HUD */}
        <div className="absolute top-3 right-3 z-20 bg-slate-900/90 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-slate-300 flex items-center gap-2 shadow-lg">
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
            Scroll Posisi:
          </span>
          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span className="font-mono font-bold text-amber-400 text-[11px]">{scrollProgress}%</span>
        </div>

        {/* Scrollable Content Container (Controlled by Phone Scroll) */}
        <div
          ref={scrollableContentRef}
          onScroll={handleScrollUpdate}
          className="w-full h-full overflow-y-auto pt-16 pb-12 px-6 space-y-6 scroll-smooth"
        >
          {/* Section 1: Main Interactive Target */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-900/80 border border-amber-500/20 text-center space-y-3 shadow-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Uji Klik #1 (Skor: {score})</span>
            </div>

            <h3 className="font-serif font-bold text-lg text-slate-100">
              Arahkan Kursor & Ketuk di HP Anda
            </h3>
            <p className="text-xs text-slate-400 max-w-md">
              Arahkan kursor HP ke tombol bercahaya di bawah ini, lalu lakukan 1 ketukan pada trackpad HP untuk mengklik!
            </p>

            <button
              onClick={handleTargetClick}
              className={`px-7 py-3.5 rounded-2xl bg-gradient-to-r ${currentThemeObj.gradient} text-slate-950 font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/25`}
            >
              <Flame className="w-4 h-4" />
              <span>KLIK DISINI DARI HP (Skor: {score})</span>
            </button>
          </div>

          {/* Section 2: Interactive Feed Items (Revealed upon Scrolling) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold uppercase tracking-wider text-amber-300/90 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Dokumen & Kartu Uji Scroll (Scroll Down dari HP)
              </span>
              <span className="text-[11px] text-slate-500">Gulir ke bawah untuk melihat lebih banyak</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Koneksi Real-time Responsif</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sensitivitas kursor kini disesuaikan dengan akselerasi cerdas sehingga pergerakan mikro sangat presisi dan usapan cepat tetap terkendali.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Zap className="w-4 h-4" />
                  <span>Dukungan 2-Finger & Scroll Strip</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Anda dapat menggulir halaman laptop baik dengan 2 jari di area tengah trackpad HP, maupun dengan menggeser bilah 'SCROLL STRIP' di sisi kanan HP.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Target Uji Klik #2 di Bagian Bawah */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0e1017] to-slate-950 border border-amber-500/25 flex flex-col items-center justify-center text-center space-y-3 shadow-xl">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/25">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-amber-200">
              Target Uji Klik Bawah (Scroll Terverifikasi!)
            </h4>
            <p className="text-xs text-slate-400 max-w-sm">
              Jika Anda bisa melihat bagian ini, berarti fungsi scroll dari HP Anda telah bekerja dengan sempurna!
            </p>
            <button
              onClick={handleTargetClick}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verifikasi Scroll & Tambah Skor (+1)</span>
            </button>
          </div>

          {/* Bottom Interactive Text Receiver Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <Type className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-slate-300 truncate font-mono">{typedText}</p>
            </div>
            <button
              onClick={() => setTypedText('Teks direset pada ' + new Date().toLocaleTimeString())}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-amber-300 shrink-0 transition-colors border border-transparent hover:border-slate-700"
              title="Reset Teks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
