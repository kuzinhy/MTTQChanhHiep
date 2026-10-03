import React from 'react';
import { Layers, ChevronRight, Play, Sparkles } from 'lucide-react';

interface ProcedureGuideCardProps {
  onOpen: () => void;
}

export const ProcedureGuideCard: React.FC<ProcedureGuideCardProps> = ({ onOpen }) => {
  return (
    <div 
      onClick={onOpen}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700/90 via-blue-600/85 to-sky-600/80 backdrop-blur-md border border-sky-300/40 p-4 sm:p-5 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 hover:border-sky-200 transition-all duration-300 group cursor-pointer select-none"
    >
      {/* Light Cyan Soft Blur Glow */}
      <div className="absolute -right-10 -top-10 w-44 h-44 bg-sky-300/20 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-300/30 transition-all duration-500" />
      <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
        
        {/* Left Info: Icon & Text */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs border border-white/40 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6 text-sky-100" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-sky-900/40 text-sky-100 border border-sky-200/40">
                MÔ PHỎNG QUY TRÌNH SỐ
              </span>
              <span className="text-[11px] text-sky-100/80 font-medium hidden sm:inline">
                5 bước chuẩn hóa
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug truncate group-hover:text-sky-100 transition-colors">
              Quy trình Thủ tục Hành chính – Bộ phận Một cửa
            </h3>
            
            <p className="text-xs text-blue-100/90 font-medium line-clamp-1">
              Trực quan hóa từng bước thực hiện, quầy tiếp nhận và checklist hồ sơ cần chuẩn bị.
            </p>
          </div>
        </div>

        {/* Right Action Button */}
        <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white hover:bg-sky-50 text-blue-800 hover:text-blue-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer group-hover:shadow-lg active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current text-blue-700" />
            <span>Xem mô phỏng</span>
            <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
