import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  File,
  CheckCircle2,
  Download,
  Package,
} from 'lucide-react';
import { FileTransferItem } from '../../types';
import { sounds } from '../../utils/audio';

interface PhoneFileSenderProps {
  files: FileTransferItem[];
  onUploadFile: (file: File) => Promise<any>;
  uploadProgress: number | null;
}

export const PhoneFileSender: React.FC<PhoneFileSenderProps> = ({
  files,
  onUploadFile,
  uploadProgress,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsUploading(true);
    try {
      for (let i = 0; i < fileList.length; i++) {
        await onUploadFile(fileList[i]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 select-none">
      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Action Buttons: Pick Files or Take Photo */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-4 rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 active:scale-95 text-white font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 border border-white/10 transition-all"
        >
          <Upload className="w-6 h-6" />
          <span>Kirim File / Foto</span>
          <span className="text-[10px] text-cyan-200 font-normal">Galeri & Dokumen</span>
        </button>

        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={isUploading}
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 active:scale-95 text-white font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 border border-white/10 transition-all"
        >
          <Camera className="w-6 h-6" />
          <span>Foto & Kirim Langsung</span>
          <span className="text-[10px] text-emerald-200 font-normal">Kamera HP</span>
        </button>
      </div>

      {/* Upload Progress Bar */}
      {uploadProgress !== null && (
        <div className="p-3 bg-slate-900 border border-cyan-500/40 rounded-xl space-y-1.5 animate-pulse">
          <div className="flex justify-between text-xs text-cyan-300 font-semibold">
            <span>Mengirim ke Laptop...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Transferred Files History */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Riwayat Transfer ({files.length})
          </h4>
          <span className="text-[10px] text-emerald-400 font-medium">Auto Sinkron</span>
        </div>

        {files.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
            Belum ada file yang terkirim. Tekan tombol di atas untuk mengirim file ke laptop.
          </div>
        ) : (
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {file.dataUrl && file.type.startsWith('image/') ? (
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      {file.name.endsWith('.apk') ? (
                        <Package className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <File className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>Dari {file.senderName}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={file.dataUrl || `/api/download/${file.id}`}
                  download={file.name}
                  onClick={() => sounds.playClick()}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-slate-300 active:text-white transition-colors shrink-0"
                  title="Unduh"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
