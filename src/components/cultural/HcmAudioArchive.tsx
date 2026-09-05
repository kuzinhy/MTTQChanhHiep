import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Radio,
  FileText,
  Clock,
  Sparkles,
  Building,
  Edit3
} from 'lucide-react';
import { HISTORICAL_AUDIOS, HistoricalAudio } from '../../data/hcmVerifiedMuseumData';
import { loadStoredAudios, saveStoredAudios } from '../../lib/hcmDataStore';
import { DongSonDrumIcon, ChimHacIcon, HoaSenIcon } from './TraditionalMotifs';
import { UniversalHcmEditorModal } from './UniversalHcmEditorModal';

interface HcmAudioArchiveProps {
  isResearchMode: boolean;
  isAdmin?: boolean;
}

export const HcmAudioArchive: React.FC<HcmAudioArchiveProps> = ({ isResearchMode, isAdmin = false }) => {
  const [audioList, setAudioList] = useState<HistoricalAudio[]>(() => loadStoredAudios());
  const [selectedAudio, setSelectedAudio] = useState<HistoricalAudio>(() => audioList[0] || HISTORICAL_AUDIOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(35);

  // Admin Edit Modal state
  const [editingAudio, setEditingAudio] = useState<HistoricalAudio | null>(null);

  useEffect(() => {
    setAudioList(loadStoredAudios());
  }, []);

  const handleSaveAudio = (updated: HistoricalAudio) => {
    const updatedList = audioList.map((a) => (a.id === updated.id ? updated : a));
    setAudioList(updatedList);
    saveStoredAudios(updatedList);
    setSelectedAudio(updated);
    setEditingAudio(null);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Universal Direct Editor Modal for Admin Editing Audios */}
      {editingAudio && (
        <UniversalHcmEditorModal
          isOpen={!!editingAudio}
          onClose={() => setEditingAudio(null)}
          itemType="audio"
          itemData={editingAudio}
          onSave={handleSaveAudio}
        />
      )}

      {/* Header Giới thiệu - Tone Hồng Cánh Sen */}
      <div className="bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 p-5 sm:p-6 rounded-3xl border-2 border-rose-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-rose-950 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-rose-700" />
            <span>Phòng Tư Liệu Âm Thanh Gốc Của Chủ Tịch Hồ Chí Minh</span>
          </h2>
          <p className="text-xs text-rose-800/80 mt-1">
            Bản ghi âm giọng nói ấm áp của Bác được bảo tồn chính thức tại Đài Tiếng nói Việt Nam và Trung tâm Lưu trữ Quốc gia III kèm bản transcript chữ viết toàn văn.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
          <Radio className="w-4 h-4 text-rose-700 animate-pulse" />
          <span>Âm thanh lưu trữ lịch sử</span>
        </div>
      </div>

      {/* Bố Cục 2 Cột */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột Trái: Danh sách bản ghi âm */}
        <div className="lg:col-span-5 space-y-3">
          {audioList.map((item) => {
            const isSelected = selectedAudio.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedAudio(item);
                  setIsPlaying(false);
                  setPlaybackProgress(0);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-gradient-to-br from-rose-800 via-pink-700 to-rose-900 text-white border-amber-300 shadow-md ring-2 ring-amber-300/30'
                    : 'bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 border-rose-200 text-rose-950 hover:border-rose-400 hover:shadow-xs'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-amber-300 text-rose-950 shadow-md'
                      : 'bg-rose-100 text-rose-900 border border-rose-200'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isSelected ? 'text-amber-200' : 'text-rose-700'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{item.dateStr}</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isSelected
                          ? 'bg-rose-950/60 text-amber-100'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{item.duration}</span>
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm line-clamp-1 mb-1 leading-snug">
                    {item.title}
                  </h3>

                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-rose-100' : 'text-rose-900/80'
                    }`}
                  >
                    {item.historicalNote}
                  </p>

                  {isAdmin && (
                    <div className="mt-2 pt-2 border-t border-rose-300/20 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAudio(item);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                          isSelected
                            ? 'bg-amber-300 text-rose-950 hover:bg-amber-200'
                            : 'bg-rose-100 text-rose-900 hover:bg-rose-200 border border-rose-300'
                        }`}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Sửa ghi âm</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cột Phải: Trình Phát Âm Thanh Số & Transcript Văn Bản */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 shadow-md space-y-6 sticky top-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-4">
              <span className="px-3 py-1 rounded-full bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider">
                {selectedAudio.dateStr} • {selectedAudio.duration}
              </span>

              {isAdmin && (
                <button
                  onClick={() => setEditingAudio(selectedAudio)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 text-rose-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-300 transition shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa tư liệu này</span>
                </button>
              )}
            </div>

            <h3 className="text-xl font-serif font-extrabold text-rose-950 leading-tight">
              {selectedAudio.title}
            </h3>

            {/* Trình Phát Audio Mô Phỏng */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white space-y-4 shadow-inner border border-rose-300/40">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-amber-300 hover:bg-amber-200 text-rose-950 font-bold flex items-center justify-center transition shadow-md cursor-pointer shrink-0"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                <div className="flex-1 space-y-1.5">
                  <div className="w-full bg-rose-950/60 h-2.5 rounded-full overflow-hidden border border-rose-300/30">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-200 h-full transition-all duration-300"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-amber-200">
                    <span>01:12</span>
                    <span>{selectedAudio.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transcript Bảng Chữ Viết Toàn Văn */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-700" />
                <span>Transcript Chữ Viết Toàn Văn Lời Bác Hồ</span>
              </h4>

              <div className="p-5 rounded-2xl bg-white border border-rose-200 font-serif text-xs sm:text-sm text-rose-950 leading-relaxed space-y-3 max-h-72 overflow-y-auto">
                <p className="italic font-bold text-rose-900 border-b border-rose-100 pb-2">
                  " {selectedAudio.transcript} "
                </p>
                <p className="text-xs font-sans text-rose-800">
                  <b>Chú thích lưu trữ:</b> {selectedAudio.historicalNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
