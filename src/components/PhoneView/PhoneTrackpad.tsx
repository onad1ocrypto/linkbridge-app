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

interface PhoneTrackpadProps {
  onSendMouseMove: (dx: number, dy: number) => void;
  onSendMouseClick: (button: 'left' | 'right' | 'middle', isDown?: boolean) => void;
  onSendMouseScroll: (scrollX: number, scrollY: number) => void;
}

export const PhoneTrackpad: React.FC<PhoneTrackpadProps> = ({
  onSendMouseMove,
  onSendMouseClick,
  onSendMouseScroll,
}) => {
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

      // Dynamic acceleration curve:
      // Small movements (< 4px) get 0.10 factor for pinpoint precision
      // Medium movements (4-15px) get 0.15 factor
      // Fast swipes (> 15px) get 0.20 factor with capping
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

  // --- Touch Event Handlers for Main Surface ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setActiveTouches(e.touches.length);
    touchStartTimeRef.current = Date.now();
    touchMovedRef.current = false;

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      lastPosRef.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      lastPosRef.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      processMovement(touch.clientX, touch.clientY);
    } else if (e.touches.length === 2) {
      // 2-Finger Smooth Vertical Scroll
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentMidY = (touch1.clientY + touch2.clientY) / 2;

      if (lastPosRef.current) {
        const rawDeltaY = currentMidY - lastPosRef.current.y;
        if (Math.abs(rawDeltaY) > 1.2) {
          touchMovedRef.current = true;
          // Natural inverted scroll factor
          const scrollStep = -rawDeltaY * 1.6 * sensitivity;
          onSendMouseScroll(0, scrollStep);
          triggerHaptic(8);
          lastPosRef.current = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: currentMidY,
          };
        }
      } else {
        lastPosRef.current = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: currentMidY,
        };
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setActiveTouches(e.touches.length);
    const duration = Date.now() - touchStartTimeRef.current;

    // Detect quick Tap (without noticeable drag)
    if (!touchMovedRef.current && duration < 280) {
      if (e.changedTouches.length === 1 && activeTouches <= 1) {
        // 1 Tap -> Left Click
        onSendMouseClick('left');
        triggerHaptic(25);
        sounds.playClick();
      } else if (e.changedTouches.length === 2 || activeTouches === 2) {
        // 2 Fingers Tap -> Right Click
        onSendMouseClick('right');
        triggerHaptic(40);
        sounds.playClick();
      }
    }

    if (e.touches.length === 0) {
      lastPosRef.current = null;
    }
  };

  // --- Pointer / Mouse fallback for desktop browser testing ---
  const isPointerDownRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return; // Handled by TouchEvent
    isPointerDownRef.current = true;
    touchStartTimeRef.current = Date.now();
    touchMovedRef.current = false;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (!isPointerDownRef.current) return;
    processMovement(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    isPointerDownRef.current = false;
    const duration = Date.now() - touchStartTimeRef.current;
    if (!touchMovedRef.current && duration < 250) {
      onSendMouseClick('left');
      sounds.playClick();
    }
    lastPosRef.current = null;
  };

  // --- Interactive Scroll Bar Strip Handlers ---
  const handleScrollStripPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScrollingStrip(true);
    scrollStripLastYRef.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    triggerHaptic(20);

    if (scrollStripElRef.current) {
      const rect = scrollStripElRef.current.getBoundingClientRect();
      const relativeY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setScrollThumbPos(relativeY);
    }
  };

  const handleScrollStripPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrollingStrip || scrollStripLastYRef.current === null) return;

    const deltaY = e.clientY - scrollStripLastYRef.current;
    if (Math.abs(deltaY) > 1) {
      // Natural scrolling multiplier
      const scrollStep = deltaY * 2.8 * sensitivity;
      onSendMouseScroll(0, scrollStep);
      triggerHaptic(10);
      scrollStripLastYRef.current = e.clientY;

      if (scrollStripElRef.current) {
        const rect = scrollStripElRef.current.getBoundingClientRect();
        const relativeY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        setScrollThumbPos(relativeY);
      }
    }
  };

  const handleScrollStripPointerUp = () => {
    setIsScrollingStrip(false);
    scrollStripLastYRef.current = null;
  };

  const handleStepScroll = (direction: 'up' | 'down') => {
    const amount = direction === 'up' ? -50 : 50;
    onSendMouseScroll(0, amount);
    triggerHaptic(25);
    sounds.playClick();
  };

  const handleLeftClick = () => {
    onSendMouseClick('left');
    triggerHaptic(30);
    sounds.playClick();
  };

  const handleRightClick = () => {
    onSendMouseClick('right');
    triggerHaptic(45);
    sounds.playClick();
  };

  const toggleDragLock = () => {
    const next = !isDragLock;
    setIsDragLock(next);
    onSendMouseClick('left', next);
    triggerHaptic(50);
    sounds.playClick();
  };

  return (
    <div className="flex flex-col h-full space-y-2.5 select-none touch-none">
      {/* Top Trackpad Header & Sensitivity Quick Toggle */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
            <MousePointer className="w-3.5 h-3.5 text-amber-400" />
            Wireless Trackpad
          </span>
          <span className="text-[10px] text-amber-400 font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            {sensitivity.toFixed(1)}x Sens
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
            <span className="text-[10px]">{isDragLock ? 'Drag Locked' : 'Drag'}</span>
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
              Kecepatan Kursor (Sensitivity):
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
              { label: 'Halus (0.5x)', val: 0.5 },
              { label: 'Normal (0.8x)', val: 0.8 },
              { label: 'Cepat (1.2x)', val: 1.2 },
              { label: 'Tinggi (1.6x)', val: 1.6 },
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
              Geser jari di sini untuk mengarahkan kursor
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              1 Ketukan = Klik Kiri • 2 Jari = Klik Kanan / Scroll
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
              SCROLL STRIP
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
          <span>Klik Kiri (Left)</span>
        </button>

        <button
          onClick={handleRightClick}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 hover:bg-slate-800 active:bg-amber-500 border border-amber-500/25 active:border-amber-400 text-amber-200 active:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Klik Kanan (Right)</span>
        </button>
      </div>
    </div>
  );
};
