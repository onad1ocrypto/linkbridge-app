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

interface PhonePresentationRemoteProps {
  onSendPresentationAction: (
    action: 'next' | 'prev' | 'first' | 'last' | 'blank' | 'laser',
    laserData?: { x: number; y: number; active: boolean }
  ) => void;
}

export const PhonePresentationRemote: React.FC<PhonePresentationRemoteProps> = ({
  onSendPresentationAction,
}) => {
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
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-xl font-bold font-mono text-purple-300">
              {formatTimer(seconds)}
            </div>
            <span className="text-[10px] text-slate-400">Pengatur Waktu Presentasi</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsTimerRunning(!isTimerRunning);
              triggerHaptic(20);
            }}
            className={`p-2 rounded-xl text-white font-bold transition-all ${
              isTimerRunning
                ? 'bg-amber-600 active:bg-amber-500'
                : 'bg-emerald-600 active:bg-emerald-500'
            }`}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setSeconds(0);
              setIsTimerRunning(false);
              triggerHaptic(20);
            }}
            className="p-2 rounded-xl bg-slate-800 active:bg-slate-700 text-slate-300"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gigantic Next / Previous Clicker Buttons */}
      <div className="grid grid-cols-2 gap-3 min-h-[160px]">
        <button
          onClick={handlePrev}
          className="rounded-2xl bg-slate-900 active:bg-slate-800 border-2 border-slate-800 active:border-purple-500/50 text-slate-200 active:scale-95 flex flex-col items-center justify-center gap-2 shadow-lg transition-all p-4"
        >
          <ChevronLeft className="w-10 h-10 text-slate-400" />
          <span className="font-bold text-sm">Slide Sebelumnya</span>
        </button>

        <button
          onClick={handleNext}
          className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 active:from-purple-500 active:to-indigo-500 text-white active:scale-95 flex flex-col items-center justify-center gap-2 shadow-xl shadow-purple-600/30 border border-purple-400/30 transition-all p-4"
        >
          <ChevronRight className="w-10 h-10 text-white" />
          <span className="font-bold text-base">Slide Berikutnya</span>
        </button>
      </div>

      {/* Virtual Laser Pointer Trackpad */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <Flame className="w-4 h-4" />
            <span>Virtual Laser Pointer</span>
          </div>
          <span className="text-[10px] text-slate-400">Sentuh & Geser untuk Menyorot Layar</span>
        </div>

        <div
          ref={laserPadRef}
          onTouchStart={(e) => {
            setLaserActive(true);
            triggerHaptic(20);
            handleLaserTouch(e);
          }}
          onTouchMove={handleLaserTouch}
          onTouchEnd={() => {
            setLaserActive(false);
            handleLaserEnd();
          }}
          onTouchCancel={() => {
            setLaserActive(false);
            handleLaserEnd();
          }}
          className="w-full h-32 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center cursor-crosshair active:border-rose-500/50"
        >
          {laserActive ? (
            <div
              className="absolute w-6 h-6 rounded-full bg-rose-500 shadow-lg shadow-rose-500/80 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${laserPos.x}%`, top: `${laserPos.y}%` }}
            />
          ) : (
            <div className="text-center text-slate-500 text-xs">
              Tahan & Geser jari di sini untuk menyalakan laser merah di layar laptop
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
