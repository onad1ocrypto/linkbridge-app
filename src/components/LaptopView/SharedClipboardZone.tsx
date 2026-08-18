import React, { useState } from 'react';
import {
  Clipboard,
  Send,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Sparkles,
  Clock,
} from 'lucide-react';
import { ClipboardItem } from '../../types';
import { sounds } from '../../utils/audio';

interface SharedClipboardZoneProps {
  clipboard: ClipboardItem[];
  onSendClipboard: (text: string) => void;
  notes: string;
  onUpdateNotes: (notes: string) => void;
}

export const SharedClipboardZone: React.FC<SharedClipboardZoneProps> = ({
  clipboard,
  onSendClipboard,
  notes,
  onUpdateNotes,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendClipboard(inputText.trim());
    setInputText('');
    sounds.playClick();
  };

  const copyToLocal = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sounds.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isUrl = (str: string) => {
    try {
      return str.startsWith('http://') || str.startsWith('https://');
    } catch {
      return false;
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Live Shared Clipboard Stream */}
      <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clipboard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Papan Klip Bersama (Live Clipboard)
              </h4>
              <p className="text-[11px] text-slate-400">
                Teks atau tautan yang disalin di HP langsung muncul di sini
              </p>
            </div>
          </div>
        </div>

        {/* Input box to send text to phone */}
        <form onSubmit={handleSend} className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ketik teks atau tautan untuk dikirim ke HP..."
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim</span>
          </button>
        </form>

        {/* Clipboard Feed */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1">
          {clipboard.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center text-slate-500 text-xs">
              Belum ada riwayat clipboard. Salin teks dari HP atau ketik di atas untuk mengirim.
            </div>
          ) : (
            clipboard.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-200 font-mono break-all line-clamp-3 select-all">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatTime(item.timestamp)}
                    </span>
                    <span>•</span>
                    <span className="text-indigo-400 font-medium">Dari {item.senderName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isUrl(item.text) && (
                    <a
                      href={item.text}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors"
                      title="Buka Tautan di Tab Baru"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => copyToLocal(item.text, item.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Salin ke Clipboard Laptop"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Live Collaborative Notes */}
      <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Catatan Bersama (Live Scratchpad)
              </h4>
              <p className="text-[11px] text-slate-400">
                Ketik di sini atau di HP, tersinkronisasi dua arah secara real-time
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-3 h-3" />
            Auto-Sync
          </span>
        </div>

        <textarea
          value={notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="Tulis draf, todo list, atau ide cepat di sini..."
          className="flex-1 w-full min-h-[220px] p-3 bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none font-sans leading-relaxed"
        />

        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
          <span>{notes.length} karakter</span>
          <button
            onClick={() => copyToLocal(notes, 'all_notes')}
            className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            {copiedId === 'all_notes' ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Salin Seluruh Catatan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
