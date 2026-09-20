import React, { useState } from 'react';
import { 
  CHANH_HIEP_DRIVE_FOLDERS, 
  DEFAULT_DRIVE_FOLDER_URL, 
  DriveFolderItem 
} from '../../lib/googleDriveService';
import { 
  Folder, 
  FolderOpen, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Award, 
  FileText, 
  BookOpen, 
  Heart, 
  Flame, 
  Database, 
  CloudUpload,
  HardDrive
} from 'lucide-react';
import { motion } from 'motion/react';

interface ChanhHiepDriveFolderBarProps {
  selectedFolderCode?: string;
  onSelectFolder?: (folder: DriveFolderItem) => void;
  compact?: boolean;
  className?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-4 h-4 text-amber-600" />,
  Award: <Award className="w-4 h-4 text-rose-600" />,
  BookOpen: <BookOpen className="w-4 h-4 text-indigo-600" />,
  Heart: <Heart className="w-4 h-4 text-pink-600" />,
  Flame: <Flame className="w-4 h-4 text-emerald-600" />,
  Database: <Database className="w-4 h-4 text-sky-600" />,
  CloudUpload: <CloudUpload className="w-4 h-4 text-purple-600" />
};

export const ChanhHiepDriveFolderBar: React.FC<ChanhHiepDriveFolderBarProps> = ({
  selectedFolderCode,
  onSelectFolder,
  compact = false,
  className = ''
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyLink = (folder: DriveFolderItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(folder.url);
    setCopiedCode(folder.code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-4 text-white border border-blue-800/40 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-800/40 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600/30 border border-blue-400/40 rounded-xl text-cyan-300">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-white tracking-wide">
                CƠ CHẾ LƯU TRỮ GOOGLE DRIVE CHÁNH HIỆP
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                7 Thư mục chuẩn
              </span>
            </div>
            <p className="text-[11px] text-blue-200">
              Đường dẫn: <span className="font-mono text-cyan-300">Drive của tôi &gt; DuAn &gt; ChanhHiep</span>
            </p>
          </div>
        </div>

        <a
          href={DEFAULT_DRIVE_FOLDER_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-cyan-500/20 active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Mở Thư mục Tổng trên Drive</span>
          <ExternalLink className="w-3 h-3 text-cyan-200" />
        </a>
      </div>

      {/* Grid of Folders */}
      <div className={`grid gap-2 ${compact ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
        {CHANH_HIEP_DRIVE_FOLDERS.map((folder) => {
          const isSelected = selectedFolderCode === folder.code;
          const isCopied = copiedCode === folder.code;

          return (
            <div
              key={folder.code}
              onClick={() => onSelectFolder && onSelectFolder(folder)}
              className={`group relative p-2.5 rounded-xl border transition-all ${
                onSelectFolder ? 'cursor-pointer hover:scale-[1.01]' : ''
              } ${
                isSelected
                  ? 'bg-blue-600/30 border-cyan-400 ring-2 ring-cyan-400/40 shadow-md'
                  : 'bg-slate-800/60 hover:bg-slate-800/90 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 shrink-0">
                    {ICON_MAP[folder.iconName] || <Folder className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate group-hover:text-cyan-300 transition-colors">
                      {folder.name}
                    </p>
                    <span className="text-[9.5px] text-slate-400 block font-mono">
                      /{folder.code}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(folder, e)}
                    className="p-1 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-all"
                    title="Sao chép liên kết thư mục này"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <a
                    href={folder.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 hover:bg-slate-700 rounded-md text-slate-400 hover:text-cyan-300 transition-all"
                    title="Mở thư mục này trên Google Drive"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {!compact && (
                <p className="text-[10px] text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {folder.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
