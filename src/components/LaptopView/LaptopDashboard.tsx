import React, { useState } from 'react';
import {
  FileText,
  Clipboard,
  MousePointer2,
  Camera,
  Presentation,
  QrCode,
  Smartphone,
  Battery,
  BatteryCharging,
  BellRing,
  Download,
  Share2,
  Sparkles,
  Keyboard,
} from 'lucide-react';
import { FileTransferZone } from './FileTransferZone';
import { SharedClipboardZone } from './SharedClipboardZone';
import { RemoteWorkspaceCanvas } from './RemoteWorkspaceCanvas';
import { LiveCameraViewer } from './LiveCameraViewer';
import { PresentationViewer } from './PresentationViewer';
import { LaptopMediaAndTypingZone } from './LaptopMediaAndTypingZone';
import { DeviceInfo, FileTransferItem, ClipboardItem, ActiveTab } from '../../types';
import { Language, translations } from '../../utils/i18n';

interface LaptopDashboardProps {
  roomId: string;
  peerDevices: DeviceInfo[];
  files: FileTransferItem[];
  onUploadFile: (file: File) => Promise<any>;
  uploadProgress: number | null;
  clipboard: ClipboardItem[];
  onSendClipboard: (text: string) => void;
  notes: string;
  onUpdateNotes: (notes: string) => void;
  remoteMouse: {
    x: number;
    y: number;
    isDown: boolean;
    button?: string;
    lastAction?: string;
    scrollY: number;
    scrollDeltaY?: number;
    timestamp: number;
  };
  presentationState: {
    slideIndex: number;
    laserActive: boolean;
    laserX: number;
    laserY: number;
  };
  onSendSlideAction: (action: 'next' | 'prev' | 'first') => void;
  mediaState?: {
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
    trackIndex: number;
    lastAction?: string;
    timestamp: number;
  };
  keyboardState?: {
    lastTyped: string;
    activeKeyAction?: string;
    history: string[];
    timestamp: number;
  };
  cameraFrame: string | null;
  cameraActive: boolean;
  onSendCameraControl: (action: 'start' | 'stop' | 'toggle_flash' | 'flip_camera') => void;
  onOpenPairing: () => void;
  onOpenApkGuide: () => void;
  onOpenDesktopAgent?: () => void;
  onPingPeers: () => void;
  currentLang?: Language;
}

export const LaptopDashboard: React.FC<LaptopDashboardProps> = ({
  roomId,
  peerDevices,
  files,
  onUploadFile,
  uploadProgress,
  clipboard,
  onSendClipboard,
  notes,
  onUpdateNotes,
  remoteMouse,
  presentationState,
  onSendSlideAction,
  mediaState = { isPlaying: false, volume: 70, isMuted: false, trackIndex: 0, timestamp: 0 },
  keyboardState = { lastTyped: '', history: [], timestamp: 0 },
  cameraFrame,
  cameraActive,
  onSendCameraControl,
  onOpenPairing,
  onOpenApkGuide,
  onOpenDesktopAgent,
  onPingPeers,
  currentLang = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('trackpad');
  const connectedPhone =
    peerDevices.find((d) => d.deviceType === 'phone' || d.deviceType === 'simulator') ||
    peerDevices[0];

  const t = translations[currentLang] || translations.en;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Banner / Device Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Connection & QR Trigger Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0e1017] to-slate-950 border border-amber-500/20 flex items-center justify-between shadow-lg shadow-amber-950/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-200/80 uppercase tracking-wider">{t.roomPinLabel}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30">
                ACTIVE
              </span>
            </div>
            <div className="text-2xl font-black font-mono tracking-widest text-amber-300">
              {roomId}
            </div>
            <p className="text-[11px] text-slate-400">{t.scanInstruction}</p>
          </div>
          <button
            onClick={onOpenPairing}
            className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 text-amber-400 border border-amber-500/30 flex flex-col items-center gap-1 transition-all shadow-sm group"
            title={t.scanQrTitle}
          >
            <QrCode className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-amber-300">{t.pairingCode}</span>
          </button>
        </div>

        {/* HP Connected Status Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0e1017] to-slate-950 border border-amber-500/20 flex items-center justify-between shadow-lg shadow-amber-950/10">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.device} Status</span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  connectedPhone ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-sm font-bold text-slate-100">
                {connectedPhone ? connectedPhone.deviceName : t.waitingForPhone}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              {connectedPhone ? (
                <>
                  <span className="text-emerald-400 font-medium">{t.connected}</span>
                  {connectedPhone.batteryLevel !== undefined && (
                    <span className="flex items-center gap-1 text-slate-300 ml-1 font-mono">
                      {connectedPhone.isCharging ? (
                        <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Battery className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {connectedPhone.batteryLevel}%
                    </span>
                  )}
                </>
              ) : (
                <span>{t.scanInstruction}</span>
              )}
            </div>
          </div>
          {connectedPhone ? (
            <button
              onClick={onPingPeers}
              className="p-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex flex-col items-center gap-1 transition-all shadow-sm"
              title={t.ringPhone}
            >
              <BellRing className="w-5 h-5" />
              <span className="text-[10px] font-bold">{t.ringPhone}</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-800/50 text-slate-500 border border-slate-800">
              <Smartphone className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Quick APK / PWA Install Guide Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#10131d] to-slate-950 border border-amber-500/20 flex items-center justify-between shadow-lg shadow-amber-950/10">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-300/90 uppercase tracking-wider">WebAPK / PWA</span>
            <h4 className="text-sm font-bold text-slate-100">{t.installTitle}</h4>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              {t.installSubtitle}
            </p>
          </div>
          <button
            onClick={onOpenApkGuide}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/20 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{t.installApk}</span>
          </button>
        </div>
      </div>

      {/* Feature Navigation Tabs (Now Fully Aligned with HP Features!) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-amber-950/30 scrollbar-none">
        <button
          onClick={() => setActiveTab('trackpad')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'trackpad'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-600/20'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80'
          }`}
        >
          <MousePointer2 className="w-4 h-4" />
          <span>{t.tabTrackpad}</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'media'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-600/20'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>{t.tabKeyboard || 'Type & Media'}</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'files'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-600/20'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.tabFiles} ({files.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('clipboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'clipboard'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-600/20'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80'
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span>{t.tabClipboard} ({clipboard.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('presentation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'presentation'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-600/20'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>{t.tabPresentation}</span>
        </button>

        <button
          onClick={() => setActiveTab('camera')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'camera'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-md shadow-amber-600/20'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{t.tabCamera}</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'trackpad' && (
          <RemoteWorkspaceCanvas
            remoteMouse={remoteMouse}
            peerConnected={!!connectedPhone}
            onOpenDesktopAgent={onOpenDesktopAgent}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'media' && (
          <LaptopMediaAndTypingZone
            mediaState={mediaState}
            keyboardState={keyboardState}
            peerConnected={!!connectedPhone}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'files' && (
          <FileTransferZone
            files={files}
            onUploadFile={onUploadFile}
            uploadProgress={uploadProgress}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'clipboard' && (
          <SharedClipboardZone
            clipboard={clipboard}
            onSendClipboard={onSendClipboard}
            notes={notes}
            onUpdateNotes={onUpdateNotes}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'presentation' && (
          <PresentationViewer
            presentationState={presentationState}
            onSendSlideAction={onSendSlideAction}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'camera' && (
          <LiveCameraViewer
            cameraFrame={cameraFrame}
            cameraActive={cameraActive}
            onSendControl={onSendCameraControl}
            currentLang={currentLang}
          />
        )}
      </div>
    </div>
  );
};
