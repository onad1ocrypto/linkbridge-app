import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Copy,
  Check,
  Smartphone,
  Laptop,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Wifi,
  Globe,
  ExternalLink,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language, translations } from '../utils/i18n';
import { Logo } from './Logo';

interface PairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  shareUrl?: string;
  currentLang: Language;
  onChangeRoom: (newRoomId: string) => void;
  onSwitchToPhone: () => void;
}

export const PairingModal: React.FC<PairingModalProps> = ({
  isOpen,
  onClose,
  roomId,
  shareUrl,
  currentLang,
  onChangeRoom,
  onSwitchToPhone,
}) => {
  const [customRoom, setCustomRoom] = useState(roomId);
  const [copied, setCopied] = useState(false);

  const t = translations[currentLang] || translations.en;

  if (!isOpen) return null;

  const currentOrigin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://linkbridge.app';
  const currentPath =
    typeof window !== 'undefined'
      ? window.location.pathname
      : '/';

  const phoneUrl =
    shareUrl ||
    `${currentOrigin}${currentPath}?room=${roomId}&role=phone`;

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneUrl);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRoom.trim()) {
      onChangeRoom(customRoom.trim().toUpperCase());
      sounds.playClick();
    }
  };

  const handleGenerateRandom = () => {
    const randomCode = `LINK-${Math.floor(1000 + Math.random() * 9000)}`;
    setCustomRoom(randomCode);
    onChangeRoom(randomCode);
    sounds.playClick();
  };

  const handleOpenNewTab = () => {
    window.open(phoneUrl, '_blank');
    sounds.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-amber-500/25 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-950/30 overflow-hidden text-slate-100 max-h-[92vh] overflow-y-auto space-y-4">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <Logo size="md" showText={false} currentLang={currentLang} />
          <div>
            <h3 className="font-serif font-bold text-lg text-amber-200 tracking-wide">
              {t.scanQrTitle}
            </h3>
            <p className="text-xs text-slate-400">{t.scanQrSubtitle}</p>
          </div>
        </div>

        {/* QR Code Container with Gold Accent Border */}
        <div className="flex flex-col items-center justify-center bg-white p-5 rounded-2xl shadow-xl border-2 border-amber-400/40">
          <QRCodeSVG
            value={phoneUrl}
            size={185}
            level="M"
            includeMargin={true}
            className="rounded-xl"
          />
          <div className="mt-2 text-center text-slate-900 text-xs font-bold font-sans">
            {t.scanInstruction}
          </div>
          <div className="mt-1 font-mono text-[10px] text-slate-500 max-w-xs truncate">
            {phoneUrl}
          </div>
        </div>

        {/* PIN Code Box */}
        <div className="bg-slate-950/90 border border-amber-500/25 rounded-2xl p-3.5 space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-200">{t.roomPinLabel}</span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {t.autoSync}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-2xl font-black tracking-widest text-amber-300 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-amber-500/30 select-all shadow-sm">
              {roomId}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-600/20"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.linkCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.copyPhoneLink}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instant Testing Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={handleOpenNewTab}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>Buka Remote di Tab Baru</span>
          </button>

          <button
            onClick={() => {
              onSwitchToPhone();
              onClose();
            }}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Ganti Layar ke Mode HP</span>
          </button>
        </div>

        {/* Network & FAQ Info Box */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Wifi className="w-4 h-4" />
            <span>Apakah Pengaruh Jaringan?</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-300">
            <strong>Tidak harus 1 Wi-Fi yang sama!</strong> LinkBridge bekerja melalui cloud relay & WebRTC P2P global. Pastikan kedua perangkat terhubung ke internet (bisa Wi-Fi atau Paket Data 4G/5G) dan berada di kode Room PIN yang sama (<strong>{roomId}</strong>).
          </p>
        </div>

        {/* Custom Room PIN Form */}
        <form onSubmit={handleApplyRoom} className="space-y-2 pt-1">
          <label className="block text-xs font-medium text-slate-400">
            {t.customPinLabel}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customRoom}
              onChange={(e) => setCustomRoom(e.target.value.toUpperCase())}
              placeholder="LINK-XXXX"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-sm focus:outline-none focus:border-amber-500/50 uppercase"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              {t.apply}
            </button>
            <button
              type="button"
              onClick={handleGenerateRandom}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors"
              title="Acak PIN"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
