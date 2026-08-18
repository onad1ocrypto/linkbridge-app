import React, { useState } from 'react';
import {
  Keyboard,
  Send,
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  CornerDownLeft,
  Delete,
  Space,
  Copy,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface PhoneKeyboardMediaProps {
  onSendKeyboardInput: (text: string) => void;
  onSendKeyAction: (key: string, modifiers?: any) => void;
  onSendMediaControl: (
    action: 'play_pause' | 'volume_up' | 'volume_down' | 'mute' | 'next' | 'previous' | 'fullscreen'
  ) => void;
  currentLang?: Language;
}

export const PhoneKeyboardMedia: React.FC<PhoneKeyboardMediaProps> = ({
  onSendKeyboardInput,
  onSendKeyAction,
  onSendMediaControl,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;
  const [textInput, setTextInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);

  const triggerHaptic = (ms: number = 20) => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onSendKeyboardInput(textInput.trim());
    setTextInput('');
    triggerHaptic(25);
    sounds.playClick();
  };

  const handleKey = (keyName: string, modifiers?: any) => {
    onSendKeyAction(keyName, modifiers);
    triggerHaptic(20);
    sounds.playClick();
  };

  const handleMedia = (
    action: 'play_pause' | 'volume_up' | 'volume_down' | 'mute' | 'next' | 'previous' | 'fullscreen'
  ) => {
    if (action === 'play_pause') setIsPlaying(!isPlaying);
    onSendMediaControl(action);
    triggerHaptic(30);
    sounds.playClick();
  };

  return (
    <div className="flex flex-col space-y-4 select-none">
      {/* Live Text Input Form */}
      <div className="bg-[#0e1017] border border-amber-500/20 rounded-2xl p-4 space-y-2.5 shadow-xl shadow-amber-950/10">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-200">{t.liveTextInput}</span>
        </div>

        <form onSubmit={handleSendText} className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t.typePlaceholder}
            className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/20 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.send}</span>
          </button>
        </form>
      </div>

      {/* Media Controller Section */}
      <div className="bg-[#0e1017] border border-amber-500/20 rounded-2xl p-4 space-y-3 shadow-xl shadow-amber-950/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-200">{t.mediaControls}</span>
          <span className="text-[10px] text-slate-400">{t.mediaDesc}</span>
        </div>

        {/* Volume & Mute Row */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleMedia('volume_down')}
            className="p-3 bg-slate-900 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-slate-200 flex flex-col items-center gap-1 transition-all"
          >
            <Volume1 className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-medium">{t.volDown}</span>
          </button>

          <button
            onClick={() => handleMedia('volume_up')}
            className="p-3 bg-slate-900 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-slate-200 flex flex-col items-center gap-1 transition-all"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-medium">{t.volUp}</span>
          </button>

          <button
            onClick={() => handleMedia('mute')}
            className="p-3 bg-slate-900 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-slate-200 flex flex-col items-center gap-1 transition-all"
          >
            <VolumeX className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-medium">{t.mute}</span>
          </button>

          <button
            onClick={() => handleMedia('fullscreen')}
            className="p-3 bg-slate-900 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-slate-200 flex flex-col items-center gap-1 transition-all"
          >
            <Maximize2 className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-medium">{t.fullscreen}</span>
          </button>
        </div>

        {/* Playback Controls Row */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={() => handleMedia('previous')}
            className="p-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-800 rounded-2xl text-slate-200 transition-all"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 text-slate-300" />
          </button>

          <button
            onClick={() => handleMedia('play_pause')}
            className="p-4 bg-gradient-to-r from-amber-600 to-yellow-500 active:scale-95 text-slate-950 rounded-2xl transition-all shadow-lg shadow-amber-600/25"
            title="Play / Pause"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current" />
            )}
          </button>

          <button
            onClick={() => handleMedia('next')}
            className="p-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-800 rounded-2xl text-slate-200 transition-all"
            title="Next"
          >
            <SkipForward className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Quick Action Keypad */}
      <div className="bg-[#0e1017] border border-amber-500/20 rounded-2xl p-4 space-y-3 shadow-xl shadow-amber-950/10">
        <span className="text-xs font-bold text-amber-200">{t.shortcutsTitle}</span>

        {/* Enter, Backspace, Space */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleKey('Enter')}
            className="py-2.5 px-3 bg-slate-900 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all"
          >
            <CornerDownLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.enter}</span>
          </button>

          <button
            onClick={() => handleKey('Backspace')}
            className="py-2.5 px-3 bg-slate-900 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all"
          >
            <Delete className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.backspace}</span>
          </button>

          <button
            onClick={() => handleKey(' ')}
            className="py-2.5 px-3 bg-slate-900 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all"
          >
            <Space className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.space}</span>
          </button>
        </div>

        {/* Arrow Keys D-Pad */}
        <div className="pt-2 flex flex-col items-center gap-1.5">
          <button
            onClick={() => handleKey('ArrowUp')}
            className="p-2.5 bg-slate-900 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => handleKey('ArrowLeft')}
              className="p-2.5 bg-slate-900 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleKey('ArrowDown')}
              className="p-2.5 bg-slate-900 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleKey('ArrowRight')}
              className="p-2.5 bg-slate-900 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
