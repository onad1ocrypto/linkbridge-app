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
import { Language, translations } from '../../utils/i18n';

interface SharedClipboardZoneProps {
  clipboard: ClipboardItem[];
  onSendClipboard: (text: string) => void;
  notes: string;
  onUpdateNotes: (notes: string) => void;
  currentLang?: Language;
}

export const SharedClipboardZone: React.FC<SharedClipboardZoneProps> = ({
  clipboard,
  onSendClipboard,
  notes,
  onUpdateNotes,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;
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
      <div className="flex flex-col h-full bg-[#0e1017] border border-amber-500/20 rounded-3xl p-5 shadow-xl shadow-amber-950/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clipboard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
                {t.clipboardHistory}
              </h4>
              <p className="text-[11px] text-slate-400">
                {t.sendToClipboard}
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
            placeholder={t.inputPlaceholder}
            className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.send}</span>
          </button>
        </form>

        {/* Clipboard Feed */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1 scrollbar-thin">
          {clipboard.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-slate-400 text-xs">
              {t.noClipboardYet}
            </div>
          ) : (
            clipboard.map((item) => (
              <div
                key={item.id}
                className="group p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/30 transition-all flex items-start justify-between gap-3 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-amber-400">
                      {item.senderName}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 whitespace-pre-wrap break-words font-mono">
                    {item.text}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  {isUrl(item.text) && (
                    <a
                      href={item.text}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
                      title="Open URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => copyToLocal(item.text, item.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
                    title={t.copy}
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

      {/* Real-time Collaborative Scratchpad */}
      <div className="flex flex-col h-full bg-[#0e1017] border border-amber-500/20 rounded-3xl p-5 shadow-xl shadow-amber-950/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
                {t.sharedNotes}
              </h4>
              <p className="text-[11px] text-slate-400">{t.sharedNotesDesc}</p>
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{t.autoSync}</span>
          </span>
        </div>

        <div className="flex-1 flex flex-col">
          <textarea
            value={notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            className="flex-1 w-full min-h-[220px] p-3.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-sans scrollbar-thin"
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>{notes.length} characters</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(notes);
                sounds.playClick();
              }}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              {t.copyAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
