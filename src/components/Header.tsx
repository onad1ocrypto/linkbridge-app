import React, { useState } from 'react';
import {
  Laptop,
  Smartphone,
  QrCode,
  Download,
  Volume2,
  VolumeX,
  Layers,
  Activity,
  Battery,
  BatteryCharging,
  Share2,
  Check,
  Globe,
  BellRing,
  Cpu,
} from 'lucide-react';
import { DeviceType, DeviceInfo } from '../types';
import { sounds } from '../utils/audio';
import { Language, translations } from '../utils/i18n';
import { Logo } from './Logo';

interface HeaderProps {
  role: DeviceType;
  onRoleChange: (role: DeviceType) => void;
  roomId: string;
  shareUrl?: string;
  isConnected: boolean;
  latency: number;
  devices: DeviceInfo[];
  peerDevices: DeviceInfo[];
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenPairing: () => void;
  onOpenApkGuide: () => void;
  onOpenDesktopAgent?: () => void;
  onPingPeers: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onRoleChange,
  roomId,
  shareUrl,
  isConnected,
  latency,
  peerDevices,
  currentLang,
  onLanguageChange,
  onOpenPairing,
  onOpenApkGuide,
  onOpenDesktopAgent,
  onPingPeers,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = translations[currentLang];

  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sounds.playClick();
  };

  const copyShareLink = () => {
    const url =
      shareUrl ||
      `${window.location.origin}${window.location.pathname}?room=${roomId}&role=phone`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    sounds.playClick();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
    { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-950/40 bg-[#0c0d11]/90 backdrop-blur-xl px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 select-none shadow-2xl">
      {/* Brand & Room Info with LinkBridge Motto */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Logo size="md" showText={true} currentLang={currentLang} />

        {/* Room Code Badge */}
        <button
          onClick={onOpenPairing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-amber-500/25 text-xs text-slate-200 transition-all font-mono font-medium shadow-md shadow-amber-950/20 group"
          title={t.scanQrTitle}
        >
          <QrCode className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-slate-400 text-[10px] tracking-wider">{t.room}:</span>
          <span className="text-amber-300 font-bold tracking-wider">{roomId}</span>
        </button>
      </div>

      {/* Center: Device Connection Status */}
      <div className="hidden xl:flex items-center gap-3">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border backdrop-blur-sm ${
            isConnected
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
            }`}
          />
          <span className="text-[11px] font-medium">
            {isConnected ? `${t.connected} (${latency}ms)` : t.disconnected}
          </span>
        </div>

        {peerDevices.length > 0 ? (
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>
              {t.connected}:{' '}
              <strong className="text-slate-100">{peerDevices[0].deviceName}</strong>
            </span>
            {peerDevices[0].batteryLevel !== undefined && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400 ml-1">
                {peerDevices[0].isCharging ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {peerDevices[0].batteryLevel}%
              </span>
            )}
            <button
              onClick={onPingPeers}
              className="ml-1 text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <BellRing className="w-3 h-3" />
              <span>{t.ringPhone}</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400/70 animate-pulse" />
            <span className="text-[11px] text-slate-400">{t.waitingForPhone}</span>
          </div>
        )}
      </div>

      {/* Right Controls: Role Switcher, Language Selector, APK & Sound */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors shadow-sm"
            title="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
              {currentLang.toUpperCase()}
            </span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-amber-500/30 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
              <div className="text-[10px] font-bold text-amber-400/80 px-2.5 py-1 uppercase tracking-wider border-b border-slate-800 mb-1">
                Select Language
              </div>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    onLanguageChange(l.code);
                    setLangMenuOpen(false);
                    sounds.playClick();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all ${
                    currentLang === l.code
                      ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </div>
                  {currentLang === l.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role Selector Tabs */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs shadow-inner">
          <button
            onClick={() => onRoleChange('laptop')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all ${
              role === 'laptop'
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.laptopMode}</span>
          </button>
          <button
            onClick={() => onRoleChange('phone')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all ${
              role === 'phone'
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.phoneMode}</span>
          </button>
          <button
            onClick={() => onRoleChange('simulator')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all ${
              role === 'simulator'
                ? 'bg-slate-700 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Side-by-side simulator for testing on a single screen"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.simulatorMode}</span>
          </button>
        </div>

        {/* Share Link */}
        <button
          onClick={copyShareLink}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 transition-all shadow-sm"
          title="Copy link to open on phone"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-emerald-400 font-semibold">{t.copied}</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>

        {/* Native OS Agent Modal Button */}
        {onOpenDesktopAgent && (
          <button
            onClick={onOpenDesktopAgent}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-amber-300 flex items-center gap-1.5 transition-all font-semibold shadow-sm"
            title="Native OS Remote Mouse Companion"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">OS Mouse</span>
          </button>
        )}

        {/* APK / PWA Install Guide */}
        <button
          onClick={onOpenApkGuide}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-1.5 transition-all font-semibold shadow-sm"
          title={t.installTitle}
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{t.installApk}</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors shadow-sm"
          title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
      </div>
    </header>
  );
};
