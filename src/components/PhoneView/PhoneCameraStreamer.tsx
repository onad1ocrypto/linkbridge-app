import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  Zap,
  Play,
  Square,
  Sparkles,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface PhoneCameraStreamerProps {
  onSendCameraFrame: (frameData: string) => void;
  onSendCameraControl: (action: 'start' | 'stop' | 'toggle_flash' | 'flip_camera') => void;
  onUploadFile: (file: File) => Promise<any>;
  currentLang?: Language;
}

export const PhoneCameraStreamer: React.FC<PhoneCameraStreamerProps> = ({
  onSendCameraFrame,
  onSendCameraControl,
  onUploadFile,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<any>(null);

  const triggerHaptic = (ms: number = 25) => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // ignore
      }
    }
  };

  const startCamera = async (mode = facingMode) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsStreaming(true);
      setHasPermission(true);
      onSendCameraControl('start');
      triggerHaptic(30);
      sounds.playConnect();

      // Send video frames periodically to laptop (every 180ms)
      if (intervalRef.current) clearInterval(intervalRef.current);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      intervalRef.current = setInterval(() => {
        if (videoRef.current && ctx && videoRef.current.videoWidth > 0) {
          canvas.width = 360;
          canvas.height = (360 * videoRef.current.videoHeight) / videoRef.current.videoWidth;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          onSendCameraFrame(dataUrl);
        }
      }, 180);
    } catch (err) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    onSendCameraControl('stop');
    triggerHaptic(20);
  };

  const flipCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    if (isStreaming) {
      startCamera(next);
    }
  };

  const takeSnapshot = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], `LinkBridge_Camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
        await onUploadFile(file);
        setSnapshotTaken(true);
        triggerHaptic(60);
        sounds.playFileSent();
        setTimeout(() => setSnapshotTaken(false), 2500);
      }
    }, 'image/jpeg', 0.9);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4 select-none">
      {/* Video Viewfinder Container */}
      <div className="relative w-full h-[280px] rounded-3xl bg-slate-950 border-2 border-amber-500/20 overflow-hidden flex items-center justify-center shadow-inner">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''} ${
            !isStreaming ? 'hidden' : ''
          }`}
        />

        {!isStreaming && (
          <div className="text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-amber-200">{t.cameraTitle}</h4>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              {t.cameraDesc}
            </p>
          </div>
        )}

        {/* Live indicator overlay */}
        {isStreaming && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-amber-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>{t.streamingLive}</span>
          </div>
        )}

        {/* Snapshot Success Toast */}
        {snapshotTaken && (
          <div className="absolute inset-0 m-auto w-max h-max px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-2xl backdrop-blur-sm animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.snapshotSent}</span>
          </div>
        )}
      </div>

      {/* Main Control Actions */}
      <div className="grid grid-cols-2 gap-3">
        {!isStreaming ? (
          <button
            onClick={() => startCamera()}
            className="col-span-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t.startStreaming}</span>
          </button>
        ) : (
          <>
            <button
              onClick={takeSnapshot}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
            >
              <Camera className="w-4 h-4" />
              <span>{t.takeSnapshot}</span>
            </button>

            <button
              onClick={stopCamera}
              className="py-3.5 px-4 rounded-2xl bg-rose-950/40 active:bg-rose-900 text-rose-300 active:text-white border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" />
              <span>{t.stopStreaming}</span>
            </button>
          </>
        )}
      </div>

      {/* Secondary Controls (Flip Camera) */}
      {isStreaming && (
        <div className="flex justify-center">
          <button
            onClick={flipCamera}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 active:bg-slate-800 text-slate-300 text-xs flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.flipCamera}</span>
          </button>
        </div>
      )}
    </div>
  );
};
