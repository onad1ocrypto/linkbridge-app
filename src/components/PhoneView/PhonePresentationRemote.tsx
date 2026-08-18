import React, { useState, useEffect, useRef } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  Clock,
  EyeOff,
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface PhonePresentationRemoteProps {
  onSendPresentationAction: (
    action: 'next' | 'prev' | 'first' | 'last' | 'blank' | 'laser',
    laserData?: { x: number; y: number; active: boolean }
  ) => void;
  currentLang?: Language;
}

export const PhonePresentationRemote: React.FC<PhonePresentationRemoteProps> = ({
  onSendPresentationAction,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 50, y: 50 });

  const laserPadRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = (ms: number = 30) => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // ignore
      }
    }
  };

  // Presentation timer tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    onSendPresentationAction('next');
    triggerHaptic(40);
    sounds.playClick();
  };

  const handlePrev = () => {
    onSendPresentationAction('prev');
    triggerHaptic(30);
    sounds.playClick();
  };

  const handleLaserTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!laserPadRef.current) return;
    const rect = laserPadRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setLaserPos({ x, y });

    onSendPresentationAction('laser', { x, y, active: true });
  };

  const handleLaserEnd = () => {
    onSendPresentationAction('laser', { ...laserPos, active: false });
  };

  return (
    <div className="space-y-4 select-none">
      {/* Presentation Timer Bar */}
      <div className="bg-[#0e1017] border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between shadow-xl shadow-amber-950/10">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-xl font-bold font-mono text-amber-200">
              {formatTimer(seconds)}
            </div>
            <span className="text-[10px] text-slate-400">{t.presentationTimer}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsTimerRunning(!isTimerRunning);
              sounds.playClick();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 hover:text-white transition-colors"
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setSeconds(0);
              setIsTimerRunning(false);
              sounds.playClick();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Big Slide Navigation Triggers */}
      <div className="grid grid-cols-2 gap-3.5">
        <button
          onClick={handlePrev}
          className="h-32 rounded-3xl bg-[#0e1017] hover:bg-[#131622] active:scale-95 border-2 border-amber-500/25 active:border-amber-400 text-amber-200 font-bold flex flex-col items-center justify-center gap-2 shadow-xl shadow-amber-950/20 transition-all"
        >
          <ChevronLeft className="w-8 h-8 text-amber-400" />
          <span className="text-sm">{t.slidePrev}</span>
        </button>

        <button
          onClick={handleNext}
          className="h-32 rounded-3xl bg-gradient-to-br from-amber-600 to-yellow-600 active:scale-95 text-slate-950 font-black flex flex-col items-center justify-center gap-2 shadow-xl shadow-amber-600/25 border-2 border-amber-400/40 transition-all"
        >
          <ChevronRight className="w-8 h-8 text-slate-950" />
          <span className="text-sm">{t.slideNext}</span>
        </button>
      </div>

      {/* Laser Pointer Touchpad Area */}
      <div className="bg-[#0e1017] border border-amber-500/20 rounded-3xl p-4 space-y-2.5 shadow-xl shadow-amber-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>{t.virtualLaser}</span>
          </div>
          <span className="text-[10px] text-slate-400">{t.laserDesc}</span>
        </div>

        <div
          ref={laserPadRef}
          onTouchStart={handleLaserTouch}
          onTouchMove={handleLaserTouch}
          onTouchEnd={handleLaserEnd}
          onTouchCancel={handleLaserEnd}
          className="h-40 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/30 relative flex items-center justify-center overflow-hidden cursor-crosshair active:border-rose-500 transition-colors"
        >
          {/* Simulated Laser Dot in Pad */}
          <div
            className="absolute w-5 h-5 rounded-full bg-rose-500 border-2 border-white shadow-[0_0_12px_#f43f5e] pointer-events-none transition-all duration-75"
            style={{
              left: `${laserPos.x}%`,
              top: `${laserPos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />

          <div className="text-center pointer-events-none opacity-40 space-y-1">
            <Sparkles className="w-6 h-6 mx-auto text-amber-400" />
            <p className="text-xs text-amber-200 font-medium">
              {t.laserTouchHint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
