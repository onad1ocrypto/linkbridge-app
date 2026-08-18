import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  File,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Download,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Package,
  Sparkles,
} from 'lucide-react';
import { FileTransferItem } from '../../types';
import { sounds } from '../../utils/audio';
import { Language, translations } from '../../utils/i18n';

interface FileTransferZoneProps {
  files: FileTransferItem[];
  onUploadFile: (file: File) => Promise<any>;
  uploadProgress: number | null;
  currentLang?: Language;
}

export const FileTransferZone: React.FC<FileTransferZoneProps> = ({
  files,
  onUploadFile,
  uploadProgress,
  currentLang = 'en',
}) => {
  const t = translations[currentLang] || translations.en;
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileTransferItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      for (const file of droppedFiles) {
        try {
          await onUploadFile(file);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      for (const file of selectedFiles) {
        try {
          await onUploadFile(file);
        } catch (err) {
          console.error(err);
        }
      }
      e.target.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string, name: string) => {
    if (name.endsWith('.apk')) return <Package className="w-5 h-5 text-amber-400" />;
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-amber-400" />;
    if (mimeType.startsWith('video/')) return <Film className="w-5 h-5 text-yellow-400" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-5 h-5 text-amber-300" />;
    if (mimeType.includes('pdf') || mimeType.includes('text'))
      return <FileText className="w-5 h-5 text-amber-200" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Upload Zone with Luxury Border */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-7 transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
          isDragging
            ? 'border-amber-400 bg-amber-950/20 scale-[1.01]'
            : 'border-amber-500/25 hover:border-amber-400/50 bg-[#0e1017]/90 hover:bg-[#121520]'
        } shadow-xl shadow-amber-950/10`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/15 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
          <UploadCloud className="w-7 h-7 animate-pulse" />
        </div>

        <h4 className="text-sm font-serif font-bold text-amber-200 mb-1 tracking-wide">
          {t.dragDropFiles}
        </h4>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed">
          {t.browseFiles}
        </p>

        {uploadProgress !== null && (
          <div className="w-full max-w-xs mt-4">
            <div className="flex justify-between text-[11px] text-amber-300 font-bold mb-1">
              <span>{t.sendingToLaptop}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-200/90">
            {t.transferHistory} ({files.length})
          </h4>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{t.autoSync}</span>
          </span>
        </div>

        {files.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0c0d11]/80 border border-amber-500/15 text-center text-slate-400 text-xs shadow-inner">
            {t.noFilesYet}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative p-3.5 rounded-2xl bg-[#0e1017] hover:bg-[#131622] border border-amber-500/20 hover:border-amber-400/40 transition-all flex items-center justify-between gap-3 shadow-md shadow-amber-950/10"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {file.dataUrl && file.type.startsWith('image/') ? (
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      onClick={() => setPreviewFile(file)}
                      className="w-11 h-11 rounded-xl object-cover border border-amber-500/30 cursor-pointer hover:opacity-80 transition-opacity shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 border border-amber-500/20">
                      {getFileIcon(file.type, file.name)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-amber-300 transition-colors">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="truncate text-amber-500/80">From {file.senderName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {file.dataUrl && file.type.startsWith('image/') && (
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
                      title="Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                  <a
                    href={file.dataUrl || `/api/download/${file.id}`}
                    download={file.name}
                    onClick={() => sounds.playClick()}
                    className="p-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-bold hover:brightness-110 shadow-md shadow-amber-600/20 transition-all"
                    title={t.download}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewFile && previewFile.dataUrl && (
        <div
          onClick={() => setPreviewFile(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] bg-[#0e1017] border border-amber-500/30 rounded-3xl p-5 overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <img
              src={previewFile.dataUrl}
              alt={previewFile.name}
              className="max-h-[70vh] object-contain rounded-2xl mb-3 shadow-xl"
            />
            <div className="w-full flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold truncate text-amber-200">{previewFile.name}</span>
              <a
                href={previewFile.dataUrl}
                download={previewFile.name}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.download}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
