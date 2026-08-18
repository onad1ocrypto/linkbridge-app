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

interface PhoneKeyboardMediaProps {
  onSendKeyboardInput: (text: string) => void;
  onSendKeyAction: (key: string, modifiers?: any) => void;
  onSendMediaControl: (
    action: 'play_pause' | 'volume_up' | 'volume_down' | 'mute' | 'next' | 'previous' | 'fullscreen'
  ) => void;
}

export const PhoneKeyboardMedia: React.FC<PhoneKeyboardMediaProps> = ({
  onSendKeyboardInput,
  onSendKeyAction,
  onSendMediaControl,
}) => {
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
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">Kirim Teks Langsung ke Laptop</span>
        </div>

        <form onSubmit={handleSendText} className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Ketik teks di sini lalu kirim..."
            className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim</span>
          </button>
        </form>
      </div>

      {/* Media Controller Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Kontrol Media & Volume</span>
          <span className="text-[10px] text-cyan-400 font-medium">YouTube / Video Player</span>
        </div>

        {/* Media Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => handleMedia('volume_down')}
            className="py-2.5 rounded-xl bg-slate-800/80 active:bg-slate-700 text-slate-300 flex flex-col items-center gap-1 text-[10px]"
          >
            <Volume1 className="w-4 h-4" />
            <span>Vol -</span>
          </button>

          <button
            onClick={() => handleMedia('previous')}
            className="py-2.5 rounded-xl bg-slate-800/80 active:bg-slate-700 text-slate-300 flex flex-col items-center gap-1 text-[10px]"
          >
            <SkipBack className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <button
            onClick={() => handleMedia('play_pause')}
            className="py-2.5 rounded-xl bg-cyan-600 active:bg-cyan-500 text-white flex flex-col items-center gap-1 text-[10px] font-bold shadow-md shadow-cyan-600/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => handleMedia('next')}
            className="py-2.5 rounded-xl bg-slate-800/80 active:bg-slate-700 text-slate-300 flex flex-col items-center gap-1 text-[10px]"
          >
            <SkipForward className="w-4 h-4" />
            <span>Next</span>
          </button>

          <button
            onClick={() => handleMedia('volume_up')}
            className="py-2.5 rounded-xl bg-slate-800/80 active:bg-slate-700 text-slate-300 flex flex-col items-center gap-1 text-[10px]"
          >
            <Volume2 className="w-4 h-4" />
            <span>Vol +</span>
          </button>
        </div>

        {/* Sub Media Controls */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleMedia('mute')}
            className="py-2 rounded-lg bg-slate-950 border border-slate-800 active:bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-1.5"
          >
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            <span>Mute Suara</span>
          </button>
          <button
            onClick={() => handleMedia('fullscreen')}
            className="py-2 rounded-lg bg-slate-950 border border-slate-800 active:bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Layar Penuh (F)</span>
          </button>
        </div>
      </div>

      {/* Function & Shortcut Keys */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <span className="text-xs font-bold text-slate-200 block">Tombol Pintas & Navigasi</span>

        {/* Row 1: Common Keys */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleKey('Enter')}
            className="py-2.5 rounded-xl bg-indigo-600 active:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>Enter</span>
          </button>
          <button
            onClick={() => handleKey('Backspace')}
            className="py-2.5 rounded-xl bg-slate-800 active:bg-slate-700 text-slate-200 text-xs flex items-center justify-center gap-1"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
          <button
            onClick={() => handleKey('Space')}
            className="py-2.5 rounded-xl bg-slate-800 active:bg-slate-700 text-slate-200 text-xs flex items-center justify-center gap-1"
          >
            <Space className="w-3.5 h-3.5" />
            <span>Spasi</span>
          </button>
          <button
            onClick={() => handleKey('Escape')}
            className="py-2.5 rounded-xl bg-slate-800 active:bg-slate-700 text-slate-200 text-xs flex items-center justify-center"
          >
            <span>Esc</span>
          </button>
        </div>

        {/* Row 2: Shortcuts */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          <button
            onClick={() => handleKey('c', { ctrl: true })}
            className="py-2 rounded-lg bg-slate-950 border border-slate-800 active:bg-slate-800 text-slate-300 font-mono"
          >
            Ctrl+C
          </button>
          <button
            onClick={() => handleKey('v', { ctrl: true })}
            className="py-2 rounded-lg bg-slate-950 border border-slate-800 active:bg-slate-800 text-slate-300 font-mono"
          >
            Ctrl+V
          </button>
          <button
            onClick={() => handleKey('z', { ctrl: true })}
            className="py-2 rounded-lg bg-slate-950 border border-slate-800 active:bg-slate-800 text-slate-300 font-mono"
          >
            Ctrl+Z
          </button>
          <button
            onClick={() => handleKey('Tab')}
            className="py-2 rounded-lg bg-slate-950 border border-slate-800 active:bg-slate-800 text-slate-300 font-mono"
          >
            Tab
          </button>
        </div>

        {/* Directional Pad */}
        <div className="flex justify-center pt-1">
          <div className="grid grid-cols-3 gap-1.5 w-44">
            <div />
            <button
              onClick={() => handleKey('ArrowUp')}
              className="p-2.5 rounded-xl bg-slate-800 active:bg-cyan-600 text-slate-200 active:text-white flex items-center justify-center"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div />
            <button
              onClick={() => handleKey('ArrowLeft')}
              className="p-2.5 rounded-xl bg-slate-800 active:bg-cyan-600 text-slate-200 active:text-white flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleKey('ArrowDown')}
              className="p-2.5 rounded-xl bg-slate-800 active:bg-cyan-600 text-slate-200 active:text-white flex items-center justify-center"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleKey('ArrowRight')}
              className="p-2.5 rounded-xl bg-slate-800 active:bg-cyan-600 text-slate-200 active:text-white flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
