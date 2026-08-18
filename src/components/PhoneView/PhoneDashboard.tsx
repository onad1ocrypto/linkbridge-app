import React, { useState } from 'react';
import {
  MousePointer2,
  Keyboard,
  Upload,
  Clipboard,
  Presentation,
  Camera,
  QrCode,
  Download,
  Share2,
  BellRing,
  Battery,
  BatteryCharging,
  Sparkles,
} from 'lucide-react';
import { PhoneTrackpad } from './PhoneTrackpad';
import { PhoneKeyboardMedia } from './PhoneKeyboardMedia';
import { PhoneFileSender } from './PhoneFileSender';
import { PhoneClipboard } from './PhoneClipboard';
import { PhonePresentationRemote } from './PhonePresentationRemote';
import { PhoneCameraStreamer } from './PhoneCameraStreamer';
import { DeviceInfo, FileTransferItem, ClipboardItem } from '../../types';
import { Language, translations } from '../../utils/i18n';

interface PhoneDashboardProps {
  roomId: string;
  onChangeRoom?: (roomId: string) => void;
  peerDevices: DeviceInfo[];
  files: FileTransferItem[];
  onUploadFile: (file: File) => Promise<any>;
  uploadProgress: number | null;
  clipboard: ClipboardItem[];
  onSendClipboard: (text: string) => void;
  notes: string;
  onUpdateNotes: (notes: string) => void;
  onSendMouseMove: (dx: number, dy: number) => void;
  onSendMouseClick: (button: 'left' | 'right' | 'middle', isDown?: boolean) => void;
  onSendMouseScroll: (scrollX: number, scrollY: number) => void;
  onSendKeyboardInput: (text: string) => void;
  onSendKeyAction: (key: string, modifiers?: any) => void;
  onSendMediaControl: (action: any) => void;
  onSendPresentationAction: (action: any, laserData?: any) => void;
  onSendCameraFrame: (frameData: string) => void;
  onSendCameraControl: (action: any) => void;
  onOpenPairing: () => void;
  onOpenApkGuide: () => void;
  onPingPeers: () => void;
  isAlerting: boolean;
  currentLang?: Language;
}

export const PhoneDashboard: React.FC<PhoneDashboardProps> = ({
  roomId,
  onChangeRoom,
  peerDevices,
  files,
  onUploadFile,
  uploadProgress,
  clipboard,
  onSendClipboard,
  notes,
  onUpdateNotes,
  onSendMouseMove,
  onSendMouseClick,
  onSendMouseScroll,
  onSendKeyboardInput,
  onSendKeyAction,
  onSendMediaControl,
  onSendPresentationAction,
  onSendCameraFrame,
  onSendCameraControl,
  onOpenPairing,
  onOpenApkGuide,
  onPingPeers,
  isAlerting,
  currentLang = 'en',
}) => {
  const [mobileTab, setMobileTab] = useState<
    'trackpad' | 'keyboard' | 'files' | 'clipboard' | 'presentation' | 'camera'
  >('trackpad');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const t = translations[currentLang];
  const connectedLaptop = peerDevices.find((d) => d.deviceType === 'laptop');

  const handleJoinPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() && onChangeRoom) {
      onChangeRoom(pinInput.trim().toUpperCase());
      setIsChangingPin(false);
      setPinInput('');
    }
  };

  return (
    <div
      className={`min-h-[calc(100vh-60px)] flex flex-col justify-between max-w-lg mx-auto p-3.5 pb-24 transition-colors ${
        isAlerting ? 'bg-rose-950/40 animate-pulse' : ''
      }`}
    >
      {/* Phone Header Status Strip */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0e1017] border border-amber-500/25 mb-3 text-xs shadow-md shadow-amber-950/20">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              connectedLaptop ? 'bg-emerald-400 animate-pulse ring-2 ring-emerald-500/20' : 'bg-amber-400'
            }`}
          />
          <div>
            <span className="text-slate-200 font-bold block leading-none">
              {connectedLaptop ? connectedLaptop.deviceName : t.waitingForLaptop}
            </span>
            <span className="text-[10px] text-slate-400">
              {connectedLaptop ? t.connected : t.tapToSyncPin}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsChangingPin(!isChangingPin)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-amber-600 text-[11px] text-amber-300 active:text-slate-950 font-mono font-bold border border-amber-500/30 flex items-center gap-1 shadow-sm"
          >
            <span>{roomId}</span>
          </button>
          <button
            onClick={onOpenApkGuide}
            className="p-1 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-1.5 font-bold shadow-sm"
          >
            APK
          </button>
        </div>
      </div>

      {/* Quick PIN Switcher Overlay Banner */}
      {isChangingPin && (
        <div className="bg-[#0e1017] border border-amber-500/40 rounded-2xl p-3.5 mb-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
            <span className="text-amber-200 font-bold">{t.enterRoomPin}</span>
            <button
              onClick={() => setIsChangingPin(false)}
              className="text-slate-400 hover:text-slate-200 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleJoinPin} className="flex gap-2">
            <input
              type="text"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.toUpperCase())}
              placeholder="e.g. LINK-4821"
              className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl text-xs text-slate-100 font-mono focus:outline-none uppercase"
            />
            <button
              type="submit"
              disabled={!pinInput.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-amber-600/20"
            >
              {t.connect}
            </button>
          </form>
        </div>
      )}

      {/* Not Connected Helper Banner */}
      {!connectedLaptop && !isChangingPin && (
        <div
          onClick={() => setIsChangingPin(true)}
          className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-3 mb-3 flex items-center justify-between cursor-pointer active:scale-98 transition-all shadow-md shadow-amber-950/20"
        >
          <div className="text-xs">
            <p className="text-amber-300 font-bold">{t.laptopNotConnected}</p>
            <p className="text-[11px] text-amber-200/80">
              {t.tapToSyncPin}
            </p>
          </div>
          <span className="text-xs bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl shrink-0 shadow-sm">
            {t.syncPin}
          </span>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="flex-1">
        {mobileTab === 'trackpad' && (
          <PhoneTrackpad
            onSendMouseMove={onSendMouseMove}
            onSendMouseClick={onSendMouseClick}
            onSendMouseScroll={onSendMouseScroll}
            currentLang={currentLang}
          />
        )}

        {mobileTab === 'keyboard' && (
          <PhoneKeyboardMedia
            onSendKeyboardInput={onSendKeyboardInput}
            onSendKeyAction={onSendKeyAction}
            onSendMediaControl={onSendMediaControl}
            currentLang={currentLang}
          />
        )}

        {mobileTab === 'files' && (
          <PhoneFileSender
            files={files}
            onUploadFile={onUploadFile}
            uploadProgress={uploadProgress}
            currentLang={currentLang}
          />
        )}

        {mobileTab === 'clipboard' && (
          <PhoneClipboard
            clipboard={clipboard}
            onSendClipboard={onSendClipboard}
            notes={notes}
            onUpdateNotes={onUpdateNotes}
            currentLang={currentLang}
          />
        )}

        {mobileTab === 'presentation' && (
          <PhonePresentationRemote
            onSendPresentationAction={onSendPresentationAction}
            currentLang={currentLang}
          />
        )}

        {mobileTab === 'camera' && (
          <PhoneCameraStreamer
            onSendCameraFrame={onSendCameraFrame}
            onSendCameraControl={onSendCameraControl}
            onUploadFile={onUploadFile}
            currentLang={currentLang}
          />
        )}
      </div>

      {/* Ergonomic Mobile Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d11]/95 backdrop-blur-xl border-t border-amber-950/40 px-2 py-2 flex justify-around items-center max-w-lg mx-auto shadow-2xl">
        <button
          onClick={() => setMobileTab('trackpad')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            mobileTab === 'trackpad'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MousePointer2 className="w-4 h-4" />
          <span className="text-[10px]">{t.tabTrackpad}</span>
        </button>

        <button
          onClick={() => setMobileTab('keyboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            mobileTab === 'keyboard'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span className="text-[10px]">{t.tabKeyboard}</span>
        </button>

        <button
          onClick={() => setMobileTab('files')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            mobileTab === 'files'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span className="text-[10px]">{t.tabFiles} ({files.length})</span>
        </button>

        <button
          onClick={() => setMobileTab('clipboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            mobileTab === 'clipboard'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span className="text-[10px]">{t.tabClipboard}</span>
        </button>

        <button
          onClick={() => setMobileTab('presentation')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            mobileTab === 'presentation'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span className="text-[10px]">{t.tabPresentation}</span>
        </button>

        <button
          onClick={() => setMobileTab('camera')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            mobileTab === 'camera'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span className="text-[10px]">{t.tabCamera}</span>
        </button>
      </div>
    </div>
  );
};
