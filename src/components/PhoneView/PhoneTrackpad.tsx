import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MousePointer,
  Sliders,
  Move,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  Gauge,
  Sparkles,
  Zap,
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface PhoneTrackpadProps {
  onSendMouseMove: (dx: number, dy: number) => void;
  onSendMouseClick: (button: 'left' | 'right' | 'middle', isDown?: boolean) => void;
  onSendMouseScroll: (scrollX: number, scrollY: number) => void;
  currentLang?: Language;
}

export const PhoneTrackpad: React.FC<PhoneTrackpadProps> = ({
  onSendMouseMove,
  onSendMouseClick,
  onSendMouseScroll,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;

  // Sensitivity: Default calibrated to balanced (0.8x)
  const [sensitivity, setSensitivity] = useState<number>(() => {
    const saved = localStorage.getItem('linkbridge_trackpad_sens');
    return saved ? parseFloat(saved) : 0.8;
  });

  const [showSettings, setShowSettings] = useState(false);
  const [isDragLock, setIsDragLock] = useState(false);
  const [activeTouches, setActiveTouches] = useState(0);
  const [isScrollingStrip, setIsScrollingStrip] = useState(false);
  const [scrollThumbPos, setScrollThumbPos] = useState<number>(50); // percentage

  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const touchMovedRef = useRef<boolean>(false);
  const scrollStripLastYRef = useRef<number | null>(null);
  const scrollStripElRef = useRef<HTMLDivElement>(null);

  // Save sensitivity
  const handleSensitivityChange = (val: number) => {
    setSensitivity(val);
    localStorage.setItem('linkbridge_trackpad_sens', val.toString());
  };

  const triggerHaptic = (ms: number = 15) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // ignore
      }
    }
  };

  // --- Smooth Calibrated Mouse Movement ---
  const processMovement = useCallback(
    (currentX: number, currentY: number) => {
      if (!lastPosRef.current) {
        lastPosRef.current = { x: currentX, y: currentY };
        return;
      }

      const rawDx = currentX - lastPosRef.current.x;
      const rawDy = currentY - lastPosRef.current.y;
      const distance = Math.hypot(rawDx, rawDy);

      // Deadzone filter for micro jitters
      if (distance < 0.8) return;

      touchMovedRef.current = true;

      // Dynamic acceleration curve
      let speedFactor = 0.11;
      if (distance > 15) {
        speedFactor = 0.2;
      } else if (distance > 4) {
        speedFactor = 0.15;
      }

      // Compute calibrated delta
      const dx = rawDx * speedFactor * sensitivity;
      const dy = rawDy * speedFactor * sensitivity;

      // Send normalized delta to laptop
      onSendMouseMove(dx, dy);

      lastPosRef.current = { x: currentX, y: currentY };
    },
    [sensitivity, onSendMouseMove]
  );

  // --- Touch Event Handlers ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setActiveTouches(e.touches.length);
    touchStartTimeRef.current = Date.now();
    touchMovedRef.current = false;

    if (e.touches.length === 1) {
      lastPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2) {
      lastPosRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      processMovement(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      // 2-finger scroll
      if (!lastPosRef.current) {
        lastPosRef.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
        return;
      }
      const currentY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const dy = currentY - lastPosRef.current.y;
      if (Math.abs(dy) > 2) {
        onSendMouseScroll(0, -dy * 1.5 * sensitivity);
        lastPosRef.current.y = currentY;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const elapsed = Date.now() - touchStartTimeRef.current;
    if (!touchMovedRef.current && elapsed < 280) {
      if (activeTouches === 1) {
        onSendMouseClick('left');
        triggerHaptic(20);
        sounds.playClick();
      } else if (activeTouches === 2) {
        onSendMouseClick('right');
        triggerHaptic(30);
        sounds.playClick();
      }
    }

    lastPosRef.current = null;
    setActiveTouches(e.touches.length);
  };

  // --- Pointer Fallback for mouse/trackpad simulator ---
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return; // Handled by touch events
    touchStartTimeRef.current = Date.now();
    touchMovedRef.current = false;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (e.buttons > 0) {
      processMovement(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const elapsed = Date.now() - touchStartTimeRef.current;
    if (!touchMovedRef.current && elapsed < 280) {
      onSendMouseClick('left');
      triggerHaptic(20);
      sounds.playClick();
    }
    lastPosRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }
  };

  // --- Dedicated Scroll Strip Drag Interaction ---
  const handleScrollStripPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScrollingStrip(true);
    scrollStripLastYRef.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    triggerHaptic(15);
    updateScrollThumb(e.clientY);
  };

  const handleScrollStripPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrollingStrip || scrollStripLastYRef.current === null) return;
    const dy = e.clientY - scrollStripLastYRef.current;
    if (Math.abs(dy) >= 1) {
      // Natural scrolling multiplier
      onSendMouseScroll(0, dy * 2.8 * sensitivity);
      scrollStripLastYRef.current = e.clientY;
      triggerHaptic(10);
      updateScrollThumb(e.clientY);
    }
  };

  const handleScrollStripPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScrollingStrip(false);
    scrollStripLastYRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }
  };

  const updateScrollThumb = (clientY: number) => {
    if (!scrollStripElRef.current) return;
    const rect = scrollStripElRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const percentage = Math.max(10, Math.min(90, (relativeY / rect.height) * 100));
    setScrollThumbPos(percentage);
  };

  const handleStepScroll = (direction: 'up' | 'down') => {
    const scrollAmount = direction === 'up' ? -120 : 120;
    onSendMouseScroll(0, scrollAmount);
    triggerHaptic(25);
    sounds.playClick();
  };

  // Drag Lock Mode (Mouse Down Hold)
  const toggleDragLock = () => {
    const nextState = !isDragLock;
    setIsDragLock(nextState);
    onSendMouseClick('left', nextState);
    triggerHaptic(40);
    sounds.playClick();
  };

  const handleLeftClick = () => {
    onSendMouseClick('left');
    triggerHaptic(25);
    sounds.playClick();
  };

  const handleRightClick = () => {
    onSendMouseClick('right');
    triggerHaptic(30);
    sounds.playClick();
  };

  return (
    <div className="flex flex-col h-full space-y-2.5 select-none touch-none">
      {/* Top Trackpad Header & Sensitivity Quick Toggle */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
            <MousePointer className="w-3.5 h-3.5 text-amber-400" />
            {t.trackpadTitle}
          </span>
          <span className="text-[10px] text-amber-400 font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            {sensitivity.toFixed(1)}x {t.sensitivity}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleDragLock}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
              isDragLock
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-950/20'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {isDragLock ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{isDragLock ? t.dragLocked : t.dragLock}</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-xl border transition-all ${
              showSettings
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-300'
            }`}
            title="Adjust Sensitivity"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sensitivity Slider Drawer with Presets */}
      {showSettings && (
        <div className="p-3.5 bg-[#0e1017] border border-amber-500/30 rounded-2xl space-y-3 text-xs shadow-xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between text-slate-200">
            <span className="flex items-center gap-1.5 font-semibold text-amber-200">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              {t.sensitivity}:
            </span>
            <span className="font-mono text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded-lg border border-amber-500/25">
              {sensitivity.toFixed(1)}x
            </span>
          </div>

          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={sensitivity}
            onChange={(e) => handleSensitivityChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              { label: t.smoothSens, val: 0.5 },
              { label: t.normalSens, val: 0.8 },
              { label: t.fastSens, val: 1.2 },
              { label: t.highSens, val: 1.6 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => {
                  handleSensitivityChange(p.val);
                  triggerHaptic(15);
                }}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                  Math.abs(sensitivity - p.val) < 0.05
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Touchpad Surface & Scroll Wheel Area */}
      <div className="flex-1 flex gap-2.5 min-h-[300px]">
        {/* Main Swipe Surface */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`flex-1 rounded-3xl bg-gradient-to-b from-[#0e111a] via-[#090a0f] to-[#07080b] border-2 transition-all flex flex-col items-center justify-center relative overflow-hidden shadow-2xl ${
            isDragLock
              ? 'border-amber-500/70 bg-amber-950/20'
              : 'border-amber-500/25 hover:border-amber-500/45 active:border-amber-400'
          }`}
        >
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgb(245 158 11 / 0.7) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="text-center pointer-events-none opacity-45 space-y-1.5 px-4">
            <Move className="w-9 h-9 mx-auto text-amber-400 animate-pulse" />
            <p className="text-xs text-amber-100 font-bold tracking-wide">
              {t.touchpadArea}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {t.trackpadGuide}
            </p>
          </div>
        </div>

        {/* Dedicated Interactive Vertical Scroll Strip */}
        <div
          ref={scrollStripElRef}
          onPointerDown={handleScrollStripPointerDown}
          onPointerMove={handleScrollStripPointerMove}
          onPointerUp={handleScrollStripPointerUp}
          onPointerCancel={handleScrollStripPointerUp}
          className={`w-14 bg-[#0e1017] border-2 rounded-3xl flex flex-col justify-between items-center py-2.5 shrink-0 shadow-lg relative touch-none transition-colors ${
            isScrollingStrip
              ? 'border-amber-400 bg-amber-950/25'
              : 'border-amber-500/25 hover:border-amber-500/40'
          }`}
        >
          {/* Page Up Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStepScroll('up');
            }}
            className="p-2 rounded-xl bg-slate-900 active:bg-amber-500 text-slate-300 active:text-slate-950 transition-all border border-slate-800 shadow-sm z-10"
            title="Scroll Up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Scroll Track & Dynamic Floating Thumb */}
          <div className="flex-1 w-full flex flex-col items-center justify-center relative my-2 pointer-events-none">
            {/* Center Track Line */}
            <div className="w-1 h-full bg-slate-800/80 rounded-full" />

            {/* Glowing Scroll Indicator Thumb */}
            <div
              className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-md shadow-amber-500/50 flex items-center justify-center transition-all pointer-events-none"
              style={{
                top: `${Math.max(10, Math.min(85, scrollThumbPos))}%`,
                transform: 'translateY(-50%)',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-slate-950" />
            </div>

            <div className="absolute text-[8px] font-extrabold uppercase tracking-widest text-amber-300/80 [writing-mode:vertical-lr] rotate-180 select-none">
              {t.scroll}
            </div>
          </div>

          {/* Page Down Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStepScroll('down');
            }}
            className="p-2 rounded-xl bg-slate-900 active:bg-amber-500 text-slate-300 active:text-slate-950 transition-all border border-slate-800 shadow-sm z-10"
            title="Scroll Down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tactile Bottom Mouse Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-0.5">
        <button
          onClick={handleLeftClick}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800 active:bg-amber-500 border border-amber-500/25 active:border-amber-400 text-amber-200 active:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{t.leftClick}</span>
        </button>

        <button
          onClick={handleRightClick}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800 active:bg-amber-500 border border-amber-500/25 active:border-amber-400 text-amber-200 active:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{t.rightClick}</span>
        </button>
      </div>
    </div>
  );
};
