import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  SkipForward,
  SkipBack,
  Maximize,
  Keyboard,
  Type,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Music,
  Radio,
  Tv,
  Film,
  Zap,
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';
import confetti from 'canvas-confetti';

interface LaptopMediaAndTypingZoneProps {
  mediaState: {
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
    trackIndex: number;
    lastAction?: string;
    timestamp: number;
  };
  keyboardState: {
    lastTyped: string;
    activeKeyAction?: string;
    history: string[];
    timestamp: number;
  };
  peerConnected: boolean;
  currentLang?: Language;
}

export const LaptopMediaAndTypingZone: React.FC<LaptopMediaAndTypingZoneProps> = ({
  mediaState,
  keyboardState,
  peerConnected,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;

  const [localPlaying, setLocalPlaying] = useState(false);
  const [localVolume, setLocalVolume] = useState(70);
  const [localMuted, setLocalMuted] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [receivedText, setReceivedText] = useState(
    currentLang === 'id'
      ? 'Selamat datang di LinkBridge Live Typing Receiver!'
      : currentLang === 'zh'
      ? '欢迎使用 LinkBridge 实时打字接收器！'
      : currentLang === 'vi'
      ? 'Chào mừng đến với Bộ nhận gõ phím trực tiếp LinkBridge!'
      : 'Welcome to LinkBridge Live Typing Stream Receiver!'
  );
  const [recentKey, setRecentKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const demoTracks = [
    {
      title: 'Cosmic Ambient Flow (4K Ultra HD)',
      artist: 'LinkBridge Studio',
      duration: '3:45',
      genre: 'Chill Synthwave',
      coverGradient: 'from-amber-600 via-yellow-600 to-amber-900',
    },
    {
      title: 'Cyberpunk Skyline Neon Beats',
      artist: 'Digital Nexus',
      duration: '4:12',
      genre: 'Lo-Fi Electronic',
      coverGradient: 'from-cyan-600 via-indigo-600 to-purple-900',
    },
    {
      title: 'Midnight Coding Symphony',
      artist: 'Aura Soundscapes',
      duration: '5:20',
      genre: 'Deep Focus Ambient',
      coverGradient: 'from-purple-600 via-pink-600 to-slate-900',
    },
  ];

  // Sync Media State from HP Remote
  useEffect(() => {
    if (mediaState.timestamp > 0) {
      if (mediaState.lastAction === 'play_pause') {
        setLocalPlaying((p) => !p);
      } else if (mediaState.lastAction === 'volume_up') {
        setLocalVolume((v) => Math.min(100, v + 10));
        setLocalMuted(false);
      } else if (mediaState.lastAction === 'volume_down') {
        setLocalVolume((v) => Math.max(0, v - 10));
      } else if (mediaState.lastAction === 'mute') {
        setLocalMuted((m) => !m);
      } else if (mediaState.lastAction === 'next') {
        setCurrentTrackIdx((i) => (i + 1) % demoTracks.length);
      } else if (mediaState.lastAction === 'previous') {
        setCurrentTrackIdx((i) => (i - 1 + demoTracks.length) % demoTracks.length);
      }
    }
  }, [mediaState.timestamp, mediaState.lastAction]);

  // Sync Keyboard Live Typing from HP
  useEffect(() => {
    if (keyboardState.timestamp > 0) {
      if (keyboardState.lastTyped) {
        setReceivedText((prev) => prev + keyboardState.lastTyped);
        sounds.playClick();
      }

      if (keyboardState.activeKeyAction) {
        setRecentKey(keyboardState.activeKeyAction);
        const action = keyboardState.activeKeyAction.toLowerCase();
        if (action === 'enter') {
          setReceivedText((prev) => prev + '\n');
        } else if (action === 'backspace') {
          setReceivedText((prev) => prev.slice(0, -1));
        } else if (action === 'space') {
          setReceivedText((prev) => prev + ' ');
        }
        setTimeout(() => setRecentKey(null), 1000);
      }
    }
  }, [keyboardState.timestamp]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(receivedText);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const activeTrack = demoTracks[currentTrackIdx];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-slate-950 border border-amber-500/25 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-amber-200">
              {t.tabKeyboard} (Live Receiver)
            </h3>
            <p className="text-xs text-slate-400">
              {t.mediaPlayerDesc}
            </p>
          </div>
        </div>

        {recentKey && (
          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Key Pressed: {recentKey.toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side (7 cols): Interactive Media Player Simulator */}
        <div className="lg:col-span-7 bg-[#0c0d12] border border-amber-500/25 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-amber-400" />
              {t.mediaPlayerSim}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
              Track {currentTrackIdx + 1} of {demoTracks.length}
            </span>
          </div>

          {/* Virtual Video / Album Art Canvas */}
          <div
            className={`w-full h-52 rounded-2xl bg-gradient-to-br ${activeTrack.coverGradient} border border-white/10 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner transition-all duration-500`}
          >
            {/* Animated Equalizer Waveform when playing */}
            {localPlaying && (
              <div className="absolute inset-0 opacity-20 flex items-end justify-center gap-1.5 p-4 pointer-events-none">
                {[40, 75, 100, 60, 90, 45, 80, 95, 70, 50, 85, 60].map((h, idx) => (
                  <div
                    key={idx}
                    className="w-2.5 bg-white rounded-t-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDuration: `${0.4 + (idx % 4) * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 mb-3 shadow-xl">
              <Film className={`w-8 h-8 text-amber-300 ${localPlaying ? 'animate-spin' : ''}`} />
            </div>

            <h4 className="font-serif font-bold text-base text-white drop-shadow-md">
              {activeTrack.title}
            </h4>
            <p className="text-xs text-amber-200/90 font-medium">{activeTrack.artist}</p>
          </div>

          {/* Playback Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300 ${
                  localPlaying ? 'w-3/5 animate-pulse' : 'w-1/4'
                }`}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>{localPlaying ? '01:45' : '00:00'}</span>
              <span>{activeTrack.duration}</span>
            </div>
          </div>

          {/* Player Controls & Volume HUD */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            {/* Volume indicator */}
            <div className="flex items-center gap-2">
              {localMuted || localVolume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : localVolume < 50 ? (
                <Volume1 className="w-4 h-4 text-amber-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-400" />
              )}
              <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    localMuted ? 'bg-rose-500' : 'bg-amber-400'
                  } transition-all`}
                  style={{ width: `${localMuted ? 0 : localVolume}%` }}
                />
              </div>
              <span className="font-mono text-xs text-amber-300 font-bold">
                {localMuted ? t.mute.toUpperCase() : `${localVolume}%`}
              </span>
            </div>

            {/* Play/Pause & Skip Status */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTrackIdx((i) => (i - 1 + demoTracks.length) % demoTracks.length)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition-colors"
                title={t.prev}
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setLocalPlaying(!localPlaying)}
                className={`p-2.5 rounded-xl border transition-all ${
                  localPlaying
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 font-bold'
                    : 'bg-slate-900 text-amber-300 border-slate-800 hover:bg-slate-800'
                }`}
                title={localPlaying ? t.pause : t.play}
              >
                {localPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => setCurrentTrackIdx((i) => (i + 1) % demoTracks.length)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition-colors"
                title={t.next}
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side (5 cols): Live Typing Receiver Terminal */}
        <div className="lg:col-span-5 bg-[#0c0d12] border border-amber-500/25 rounded-3xl p-5 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-amber-400" />
              {t.liveTypingReceiver}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Zap className="w-3 h-3" /> Live Keystrokes
            </span>
          </div>

          {/* Terminal Display */}
          <div className="flex-1 min-h-[220px] bg-slate-950 rounded-2xl border border-slate-800/90 p-4 font-mono text-xs text-amber-200/90 flex flex-col justify-between shadow-inner relative overflow-hidden">
            <div className="space-y-2 overflow-y-auto max-h-[180px]">
              <div className="text-[10px] text-slate-500 border-b border-slate-800/80 pb-1 flex justify-between">
                <span>TERMINAL RECEIVER</span>
                <span>{receivedText.length} chars</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed break-words font-sans text-sm text-slate-100">
                {receivedText}
                <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{t.waitingForTyping}</span>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-600/20"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.copyIncomingText}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setReceivedText('')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              title={t.clearHistory}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
