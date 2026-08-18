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

interface PhoneCameraStreamerProps {
  onSendCameraFrame: (frameData: string) => void;
  onSendCameraControl: (action: 'start' | 'stop' | 'toggle_flash' | 'flip_camera') => void;
  onUploadFile: (file: File) => Promise<any>;
}

export const PhoneCameraStreamer: React.FC<PhoneCameraStreamerProps> = ({
  onSendCameraFrame,
  onSendCameraControl,
  onUploadFile,
}) => {
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
        const file = new File([blob], `Kamera_HP_${Date.now()}.jpg`, { type: 'image/jpeg' });
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
      <div className="relative w-full h-[280px] rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
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
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Kamera Nirkabel HP</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Streaming video langsung dari kamera HP Anda ke layar laptop untuk scanner dokumen atau webcam
            </p>
          </div>
        )}

        {/* Live indicator overlay */}
        {isStreaming && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>STREAMING KE LAPTOP</span>
          </div>
        )}

        {/* Snapshot Success Toast */}
        {snapshotTaken && (
          <div className="absolute inset-0 m-auto w-max h-max px-4 py-2 rounded-xl bg-emerald-600/90 text-white text-xs font-bold flex items-center gap-2 shadow-2xl backdrop-blur-sm animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Foto Terkirim ke Laptop!</span>
          </div>
        )}
      </div>

      {/* Main Control Actions */}
      <div className="grid grid-cols-2 gap-3">
        {!isStreaming ? (
          <button
            onClick={() => startCamera()}
            className="col-span-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>Mulai Streaming Kamera</span>
          </button>
        ) : (
          <>
            <button
              onClick={takeSnapshot}
              className="py-3.5 px-4 rounded-xl bg-cyan-600 active:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
            >
              <Camera className="w-4 h-4" />
              <span>Ambil & Kirim Foto</span>
            </button>

            <button
              onClick={stopCamera}
              className="py-3.5 px-4 rounded-xl bg-rose-600/20 active:bg-rose-600 text-rose-300 active:text-white border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" />
              <span>Hentikan Kamera</span>
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
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Balik Kamera ({facingMode === 'environment' ? 'Belakang' : 'Depan'})</span>
          </button>
        </div>
      )}
    </div>
  );
};
