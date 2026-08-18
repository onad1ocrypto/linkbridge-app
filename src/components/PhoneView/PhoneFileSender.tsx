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
import { Language, translations } from '../../utils/i18n';

interface PhoneFileSenderProps {
  files: FileTransferItem[];
  onUploadFile: (file: File) => Promise<any>;
  uploadProgress: number | null;
  currentLang?: Language;
}

export const PhoneFileSender: React.FC<PhoneFileSenderProps> = ({
  files,
  onUploadFile,
  uploadProgress,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;
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
          className="p-4 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-600 active:scale-95 text-slate-950 font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-lg shadow-amber-600/20 border border-amber-400/30 transition-all"
        >
          <Upload className="w-6 h-6 text-slate-950" />
          <span>{t.sendToLaptop}</span>
          <span className="text-[10px] text-slate-900 font-normal">{t.galleryDocs}</span>
        </button>

        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={isUploading}
          className="p-4 rounded-2xl bg-[#0e1017] hover:bg-[#121520] active:scale-95 text-amber-200 font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-lg shadow-amber-950/20 border border-amber-500/25 transition-all"
        >
          <Camera className="w-6 h-6 text-amber-400" />
          <span>{t.takePhotoSend}</span>
          <span className="text-[10px] text-slate-400 font-normal">{t.cameraTitle}</span>
        </button>
      </div>

      {/* Upload Progress Bar */}
      {uploadProgress !== null && (
        <div className="p-3 bg-slate-900 border border-amber-500/40 rounded-xl space-y-1.5 animate-pulse">
          <div className="flex justify-between text-xs text-amber-300 font-semibold">
            <span>{t.sendingToLaptop}</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Transferred Files History */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
          <span className="text-amber-200">{t.transferHistory}</span>
          <span>{files.length} items</span>
        </div>

        {files.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#0c0d11] border border-amber-500/15 text-center text-slate-500 text-xs">
            {t.noFilesYet}
          </div>
        ) : (
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-xl bg-[#0e1017] border border-amber-500/20 flex items-center justify-between gap-2 shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {file.dataUrl && file.type.startsWith('image/') ? (
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="w-9 h-9 rounded-lg object-cover border border-amber-500/30 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                      <File className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {formatFileSize(file.size)} • {file.senderName}
                    </p>
                  </div>
                </div>

                <a
                  href={file.dataUrl || `/api/download/${file.id}`}
                  download={file.name}
                  onClick={() => sounds.playClick()}
                  className="p-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 hover:brightness-110 shrink-0 shadow-sm"
                  title={t.download}
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
