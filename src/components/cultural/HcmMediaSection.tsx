import React, { useState } from 'react';
import { Volume2, Film, Radio } from 'lucide-react';
import { HcmAudioArchive } from './HcmAudioArchive';
import { HcmVideoArchive } from './HcmVideoArchive';

interface HcmMediaSectionProps {
  isResearchMode: boolean;
  isAdmin?: boolean;
  defaultSubTab?: 'audio' | 'video';
}

export const HcmMediaSection: React.FC<HcmMediaSectionProps> = ({
  isResearchMode,
  isAdmin = false,
  defaultSubTab = 'audio'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'audio' | 'video'>(defaultSubTab);

  return (
    <div className="space-y-4">
      {/* Sub-tab Navigation Bar */}
      <div className="bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 p-2.5 sm:p-3 rounded-2xl shadow-md border border-rose-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shrink-0">
            {activeSubTab === 'audio' ? <Volume2 className="w-5 h-5" /> : <Film className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black font-serif tracking-tight text-white">
                Kho Media — Âm Thanh &amp; Thước Phim Tư Liệu
              </h2>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-amber-500 text-slate-950 rounded-md">
                Chính Thống
              </span>
            </div>
            <p className="text-[11px] text-rose-200/90 font-normal mt-0.5">
              Tích hợp ghi âm giọng nói Bác Hồ và hơn 100+ thước phim tư liệu lịch sử
            </p>
          </div>
        </div>

        {/* 2 Tabs Chức Năng Bấm Chuyển Đổi */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-rose-700/50 w-full sm:w-auto justify-stretch">
          <button
            onClick={() => setActiveSubTab('audio')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'audio'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-rose-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>01. Tư Liệu Âm Thanh</span>
          </button>

          <button
            onClick={() => setActiveSubTab('video')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'video'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-rose-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>02. Tư Liệu Video</span>
          </button>
        </div>
      </div>

      {/* Nội dung tương ứng với Subtab */}
      {activeSubTab === 'audio' ? (
        <HcmAudioArchive isResearchMode={isResearchMode} isAdmin={isAdmin} />
      ) : (
        <HcmVideoArchive isResearchMode={isResearchMode} isAdmin={isAdmin} />
      )}
    </div>
  );
};
