import React, { useState } from 'react';
import {
  Clipboard,
  Send,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { ClipboardItem } from '../../types';
import { sounds } from '../../utils/audio';

interface PhoneClipboardProps {
  clipboard: ClipboardItem[];
  onSendClipboard: (text: string) => void;
  notes: string;
  onUpdateNotes: (notes: string) => void;
}

export const PhoneClipboard: React.FC<PhoneClipboardProps> = ({
  clipboard,
  onSendClipboard,
  notes,
  onUpdateNotes,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const triggerHaptic = (ms: number = 20) => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendClipboard(inputText.trim());
    setInputText('');
    triggerHaptic(30);
    sounds.playClick();
  };

  const handlePasteFromSystem = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onSendClipboard(text);
          triggerHaptic(40);
          sounds.playFileSent();
        }
      }
    } catch (e) {
      console.warn('Clipboard read permission denied', e);
    }
  };

  const copyToLocal = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerHaptic(25);
    sounds.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Send Text / Fast Paste Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Kirim ke Clipboard Laptop</span>
          <button
            type="button"
            onClick={handlePasteFromSystem}
            className="text-[11px] text-cyan-400 font-semibold px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-1 active:scale-95"
          >
            <Sparkles className="w-3 h-3" />
            <span>Tempel dari HP</span>
          </button>
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ketik atau tempel teks/link..."
            className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim</span>
          </button>
        </form>
      </div>

      {/* Synchronized Collaborative Note Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Catatan Bersama Real-Time</span>
          </div>
          <span className="text-[10px] text-slate-400">Tersinkron dengan Laptop</span>
        </div>
        <textarea
          value={notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="Ketik catatan di HP atau Laptop..."
          className="w-full h-24 p-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none font-sans"
        />
      </div>

      {/* Feed of Clipboard Items */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Riwayat Clipboard ({clipboard.length})
        </h4>

        {clipboard.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
            Belum ada clipboard. Ketik teks di atas untuk mengirim ke laptop.
          </div>
        ) : (
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {clipboard.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-3 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-200 font-mono break-all line-clamp-3 select-all">
                    {item.text}
                  </p>
                  <span className="text-[10px] text-indigo-400 font-medium mt-1 block">
                    Dari {item.senderName}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => copyToLocal(item.text, item.id)}
                    className="p-2 rounded-xl bg-slate-800 active:bg-cyan-600 text-slate-300 active:text-white transition-colors"
                    title="Salin"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
