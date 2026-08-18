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
import { Language, translations } from '../../utils/i18n';

interface PhoneClipboardProps {
  clipboard: ClipboardItem[];
  onSendClipboard: (text: string) => void;
  notes: string;
  onUpdateNotes: (notes: string) => void;
  currentLang?: Language;
}

export const PhoneClipboard: React.FC<PhoneClipboardProps> = ({
  clipboard,
  onSendClipboard,
  notes,
  onUpdateNotes,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;
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
      <div className="bg-[#0e1017] border border-amber-500/20 rounded-2xl p-4 space-y-2.5 shadow-xl shadow-amber-950/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-200">{t.sendToClipboard}</span>
          <button
            type="button"
            onClick={handlePasteFromSystem}
            className="text-[11px] text-amber-300 font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-1 active:scale-95 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{t.pasteFromDevice}</span>
          </button>
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
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
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/20 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.send}</span>
          </button>
        </form>
      </div>

      {/* Shared Scratchpad Notes */}
      <div className="bg-[#0e1017] border border-amber-500/20 rounded-2xl p-4 space-y-2 shadow-xl shadow-amber-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.sharedNotes}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{t.autoSync}</span>
          </span>
        </div>

        <textarea
          value={notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder={t.notesPlaceholder}
          className="w-full h-24 p-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
        />
      </div>

      {/* Shared Clipboard Feed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
          <span className="text-amber-200">{t.clipboardHistory}</span>
          <span>{clipboard.length} items</span>
        </div>

        {clipboard.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#0c0d11] border border-amber-500/15 text-center text-slate-500 text-xs">
            {t.noClipboardYet}
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {clipboard.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#0e1017] border border-amber-500/20 flex items-start justify-between gap-2 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-amber-400 font-semibold block mb-0.5">
                    {item.senderName}
                  </span>
                  <p className="text-xs text-slate-200 font-mono break-all">{item.text}</p>
                </div>

                <button
                  onClick={() => copyToLocal(item.text, item.id)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 active:bg-amber-500 active:text-slate-950 shrink-0 transition-colors"
                  title={t.copy}
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
