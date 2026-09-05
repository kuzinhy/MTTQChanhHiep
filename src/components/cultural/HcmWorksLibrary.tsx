import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Calendar,
  MapPin,
  Feather,
  Bookmark,
  FolderArchive,
  Download,
  Sparkles,
  Layers,
  ArrowUpRight,
  FileText,
  Edit3
} from 'lucide-react';
import {
  HISTORICAL_WORKS,
  HistoricalWork,
  HCM_TOAN_TAP_FULL_VOLUMES,
  HcmVolumeData,
  GOOGLE_DRIVE_HCM_TOAN_TAP_URL
} from '../../data/hcmVerifiedMuseumData';
import { loadStoredWorks, saveStoredWorks } from '../../lib/hcmDataStore';
import { DongSonDrumIcon, ChimHacIcon, HoaSenIcon } from './TraditionalMotifs';
import { UniversalHcmEditorModal } from './UniversalHcmEditorModal';

interface HcmWorksLibraryProps {
  isResearchMode: boolean;
  isAdmin?: boolean;
}

export const HcmWorksLibrary: React.FC<HcmWorksLibraryProps> = ({ isResearchMode, isAdmin = false }) => {
  const [worksList, setWorksList] = useState<HistoricalWork[]>(() => loadStoredWorks());
  const [activeTab, setActiveTab] = useState<'volumes' | 'works'>('volumes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for 15 volumes
  const [selectedVolume, setSelectedVolume] = useState<HcmVolumeData>(HCM_TOAN_TAP_FULL_VOLUMES[0]);
  
  // State for 15 works
  const [selectedWork, setSelectedWork] = useState<HistoricalWork>(() => worksList[0] || HISTORICAL_WORKS[0]);
  
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Admin Edit Modal State
  const [editingWork, setEditingWork] = useState<HistoricalWork | null>(null);

  useEffect(() => {
    setWorksList(loadStoredWorks());
  }, []);

  const handleSaveWork = (updated: HistoricalWork) => {
    const updatedList = worksList.map((w) => (w.id === updated.id ? updated : w));
    setWorksList(updatedList);
    saveStoredWorks(updatedList);
    setSelectedWork(updated);
    setEditingWork(null);
  };

  // Filter 15 Volumes
  const filteredVolumes = useMemo(() => {
    if (!searchQuery.trim()) return HCM_TOAN_TAP_FULL_VOLUMES;
    const q = searchQuery.toLowerCase();
    return HCM_TOAN_TAP_FULL_VOLUMES.filter(
      (vol) =>
        vol.title.toLowerCase().includes(q) ||
        vol.description.toLowerCase().includes(q) ||
        vol.timeRange.toLowerCase().includes(q) ||
        vol.historicalPeriod.toLowerCase().includes(q) ||
        vol.majorWorks.some((w) => w.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Filter 15 Works
  const filteredWorks = useMemo(() => {
    if (!searchQuery.trim()) return worksList;
    const q = searchQuery.toLowerCase();
    return worksList.filter((work) => {
      return (
        work.title.toLowerCase().includes(q) ||
        (work.penName && work.penName.toLowerCase().includes(q)) ||
        work.year.includes(q) ||
        work.summary.toLowerCase().includes(q) ||
        work.keyIdeas.some((idea) => idea.toLowerCase().includes(q))
      );
    });
  }, [worksList, searchQuery]);

  const handleCopyCitationWork = (work: HistoricalWork) => {
    const citation = `Hồ Chí Minh: "${work.title}" (${work.year}), in trong Hồ Chí Minh Toàn tập, Tập ${work.volume}, tr. ${work.pageRange}, NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.`;
    navigator.clipboard.writeText(citation);
    setCopiedId(`work-${work.id}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyCitationVolume = (vol: HcmVolumeData) => {
    navigator.clipboard.writeText(vol.citation);
    setCopiedId(`vol-${vol.volume}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyDriveLink = () => {
    navigator.clipboard.writeText(GOOGLE_DRIVE_HCM_TOAN_TAP_URL);
    setCopiedId('drive-link');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Universal Direct Editor Modal for Admin Editing Works */}
      {editingWork && (
        <UniversalHcmEditorModal
          isOpen={!!editingWork}
          onClose={() => setEditingWork(null)}
          itemType="work"
          itemData={editingWork}
          onSave={handleSaveWork}
        />
      )}

      {/* BANNER DRIVE LƯU TRỮ CHÍNH THỨC TRỌN BỘ 15 TẬP - TONE HỒNG CÁNH SEN */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white p-6 sm:p-8 border-2 border-rose-300/40 shadow-xl space-y-4">
        <div className="absolute top-0 right-0 p-6 opacity-15 pointer-events-none">
          <DongSonDrumIcon size={240} />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-100 text-xs font-bold uppercase tracking-wider">
              <FolderArchive className="w-4 h-4 text-amber-300" />
              <span>Kho Tư Liệu Số Hóa Toàn Tập (Trọn Bộ 15 Tập - NXB Chính Trị Quốc Gia Sự Thật)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
              Thư Viện Tác Phẩm Hồ Chí Minh Toàn Tập
            </h1>

            <p className="text-xs sm:text-sm text-rose-50 leading-relaxed font-normal">
              Đã số hóa hoàn chỉnh tư liệu trọn bộ 15 tập sách Hồ Chí Minh Toàn tập. Phục vụ tra cứu học thuật, trích dẫn văn kiện và học tập chuyên đề cho 21 khu phố Phường Chánh Hiệp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={GOOGLE_DRIVE_HCM_TOAN_TAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-rose-950 font-extrabold text-xs sm:text-sm hover:brightness-110 transition shadow-md flex items-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4 text-rose-950" />
              <span>Mở Kho Google Drive Trọn Bộ 15 Tập</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <button
              onClick={handleCopyDriveLink}
              className="px-4 py-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 text-amber-200 border border-rose-300/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedId === 'drive-link' ? (
                <>
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Đã sao chép Link Drive</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép Link Drive</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* THANH CHUYỂN ĐỔI TAB & BỘ TÌM KIẾM */}
      <div className="bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 p-4 rounded-3xl border-2 border-rose-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* TAB SWITCHER */}
        <div className="flex items-center gap-2 bg-rose-100/80 p-1 rounded-2xl border border-rose-200">
          <button
            onClick={() => setActiveTab('volumes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'volumes'
                ? 'bg-gradient-to-r from-rose-700 via-pink-600 to-rose-800 text-white shadow-xs'
                : 'text-rose-900 hover:bg-rose-200/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Trọn Bộ 15 Tập (Drive Online)</span>
          </button>

          <button
            onClick={() => setActiveTab('works')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'works'
                ? 'bg-gradient-to-r from-rose-700 via-pink-600 to-rose-800 text-white shadow-xs'
                : 'text-rose-900 hover:bg-rose-200/60'
            }`}
          >
            <Feather className="w-4 h-4" />
            <span>15 Tác Phẩm Kinh Điển Tiêu Biểu</span>
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700" />
          <input
            type="text"
            placeholder={
              activeTab === 'volumes'
                ? 'Tìm theo tập, thời gian, tác phẩm...'
                : 'Tìm theo tên tác phẩm, năm, bút danh...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-950 font-medium"
          />
        </div>
      </div>

      {/* NO SẢN PHẨM PHÙ HỢP TÌM KIẾM */}
      {activeTab === 'volumes' && filteredVolumes.length === 0 && (
        <div className="p-8 text-center text-rose-800 bg-rose-50 rounded-2xl border border-rose-200 text-xs">
          Không tìm thấy tập sách phù hợp với từ khóa "{searchQuery}".
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 1: TRỌN BỘ 15 TẬP HỒ CHÍ MINH TOÀN TẬP */}
      {/* ========================================================== */}
      {activeTab === 'volumes' && filteredVolumes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI: DANH SÁCH 15 TẬP (40%) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredVolumes.map((vol) => {
              const isSelected = selectedVolume.volume === vol.volume;
              return (
                <div
                  key={vol.volume}
                  onClick={() => setSelectedVolume(vol)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-gradient-to-br from-rose-800 via-pink-700 to-rose-900 text-white border-amber-300 shadow-md ring-2 ring-amber-300/30'
                      : 'bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 border-rose-200 text-rose-950 hover:border-rose-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-serif font-extrabold text-xs ${
                        isSelected
                          ? 'bg-amber-300 text-rose-950'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      TẬP {vol.volume < 10 ? `0${vol.volume}` : vol.volume}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-amber-100' : 'text-rose-700'
                      }`}
                    >
                      {vol.timeRange}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-xs sm:text-sm leading-snug mb-1">
                    {vol.title}
                  </h4>

                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-rose-100' : 'text-rose-900/80'
                    }`}
                  >
                    {vol.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CỘT PHẢI: CHI TIẾT TẬP SÁCH ĐANG CHỌN (60%) */}
          <div className="lg:col-span-7">
            {selectedVolume && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 shadow-md space-y-6 sticky top-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-4">
                  <span className="px-3 py-1 rounded-full bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider">
                    TẬP {selectedVolume.volume < 10 ? `0${selectedVolume.volume}` : selectedVolume.volume}: {selectedVolume.timeRange}
                  </span>

                  <a
                    href={selectedVolume.driveFolderUrl || GOOGLE_DRIVE_HCM_TOAN_TAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-rose-950 font-bold text-xs hover:brightness-110 transition shadow-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-rose-950" />
                    <span>Mở PDF Tập {selectedVolume.volume} trên Drive</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-extrabold text-rose-950 leading-tight">
                    {selectedVolume.title}
                  </h3>
                  <p className="text-xs font-bold text-rose-800">
                    Giai đoạn lịch sử: {selectedVolume.historicalPeriod}
                  </p>
                </div>

                {/* Mô tả tập */}
                <div className="p-4 rounded-2xl bg-white border border-rose-200 text-xs sm:text-sm text-rose-950 leading-relaxed font-normal">
                  {selectedVolume.description}
                </div>

                {/* Danh mục văn kiện / tác phẩm tiêu biểu trong tập */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-rose-700" />
                    <span>Tác phẩm &amp; Văn kiện tiêu biểu trong Tập {selectedVolume.volume}</span>
                  </h4>

                  <div className="grid grid-cols-1 gap-2">
                    {selectedVolume.majorWorks.map((workTitle, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-rose-200 text-xs text-rose-950 font-medium flex items-center gap-2.5 shadow-2xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-900 font-bold text-[11px] flex items-center justify-center shrink-0 border border-rose-200">
                          {idx + 1}
                        </span>
                        <span>{workTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trích dẫn học thuật */}
                <div className="pt-4 border-t border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-900 uppercase">
                      Trích dẫn học thuật chuẩn (NXB Chính trị quốc gia Sự thật)
                    </span>
                    <button
                      onClick={() => handleCopyCitationVolume(selectedVolume)}
                      className="text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === `vol-${selectedVolume.volume}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép trích dẫn</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-mono italic">
                    {selectedVolume.citation}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: 15 TÁC PHẨM KINHI ĐIỂN TIÊU BIỂU */}
      {/* ========================================================== */}
      {activeTab === 'works' && filteredWorks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI: DANH SÁCH 15 TÁC PHẨM (40%) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredWorks.map((work) => {
              const isSelected = selectedWork.id === work.id;
              return (
                <div
                  key={work.id}
                  onClick={() => setSelectedWork(work)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-gradient-to-br from-rose-800 via-pink-700 to-rose-900 text-white border-amber-300 shadow-md ring-2 ring-amber-300/30'
                      : 'bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 border-rose-200 text-rose-950 hover:border-rose-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-serif font-extrabold text-xs ${
                        isSelected
                          ? 'bg-amber-300 text-rose-950'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {work.year}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-amber-100' : 'text-rose-700'
                      }`}
                    >
                      Tập {work.volume} (Tr. {work.pageRange})
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-xs sm:text-sm leading-snug mb-1">
                    {work.title}
                  </h4>

                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-rose-100' : 'text-rose-900/80'
                    }`}
                  >
                    {work.summary}
                  </p>

                  {isAdmin && (
                    <div className="mt-2 pt-2 border-t border-rose-300/20 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingWork(work);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                          isSelected
                            ? 'bg-amber-300 text-rose-950 hover:bg-amber-200'
                            : 'bg-rose-100 text-rose-900 hover:bg-rose-200 border border-rose-300'
                        }`}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Sửa tác phẩm</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CỘT PHẢI: CHI TIẾT TÁC PHẨM ĐANG CHỌN (60%) */}
          <div className="lg:col-span-7">
            {selectedWork && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 shadow-md space-y-6 sticky top-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-4">
                  <span className="px-3 py-1 rounded-full bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider">
                    {selectedWork.year} • TẬP {selectedWork.volume} (TR. {selectedWork.pageRange})
                  </span>

                  {isAdmin && (
                    <button
                      onClick={() => setEditingWork(selectedWork)}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 text-rose-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-300 transition shadow-xs cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Chỉnh sửa tác phẩm này</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-extrabold text-rose-950 leading-tight">
                    {selectedWork.title}
                  </h3>
                  {selectedWork.penName && (
                    <p className="text-xs font-bold text-rose-800">
                      Bút danh / Tác giả: {selectedWork.penName}
                    </p>
                  )}
                </div>

                {/* Hoàn cảnh ra đời & Tóm tắt */}
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1">
                    <h5 className="text-xs font-bold text-rose-900 uppercase">Tóm tắt nội dung:</h5>
                    <p className="text-xs sm:text-sm text-rose-950 leading-relaxed">
                      {selectedWork.summary}
                    </p>
                  </div>

                  {selectedWork.historicalContext && (
                    <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1">
                      <h5 className="text-xs font-bold text-rose-900 uppercase">Hoàn cảnh ra đời:</h5>
                      <p className="text-xs sm:text-sm text-rose-950 leading-relaxed font-serif">
                        {selectedWork.historicalContext}
                      </p>
                    </div>
                  )}
                </div>

                {/* Các tư tưởng & Luận điểm Then chốt */}
                {selectedWork.keyIdeas && selectedWork.keyIdeas.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Luận điểm &amp; Ý tưởng lý luận cốt lõi</span>
                    </h4>

                    <div className="grid grid-cols-1 gap-2">
                      {selectedWork.keyIdeas.map((idea, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-white border border-rose-200 text-xs text-rose-950 font-medium flex items-start gap-2.5 shadow-2xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-amber-300">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{idea}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trích dẫn học thuật */}
                <div className="pt-4 border-t border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-900 uppercase">
                      Trích dẫn học thuật chuẩn mực
                    </span>
                    <button
                      onClick={() => handleCopyCitationWork(selectedWork)}
                      className="text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === `work-${selectedWork.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép trích dẫn</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-mono italic">
                    Hồ Chí Minh: "{selectedWork.title}" ({selectedWork.year}), in trong Hồ Chí Minh Toàn tập, Tập {selectedWork.volume}, tr. {selectedWork.pageRange}, NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
