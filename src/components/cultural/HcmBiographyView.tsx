import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Award,
  ChevronRight,
  Clock,
  MapPin,
  FileText,
  BookmarkCheck,
  Search,
  Filter,
  ArrowUpRight,
  Info,
  Sparkles,
  Layers,
  Quote,
  Eye,
  X,
  Edit3
} from 'lucide-react';
import {
  BiographyChapter,
  loadStoredChapters,
  saveStoredChapters,
  loadStoredEvents,
  saveStoredEvents,
  EventCardSchema
} from '../../data/hcmGovernanceSchema';
import { HISTORICAL_EVENTS, HistoricalEvent } from '../../data/hcmVerifiedMuseumData';
import { DongSonDrumIcon, ChimHacIcon, HoaSenIcon } from './TraditionalMotifs';
import { UniversalHcmEditorModal } from './UniversalHcmEditorModal';

interface HcmBiographyViewProps {
  isResearchMode: boolean;
  onToggleResearchMode?: () => void;
  onNavigateTab?: (tabId: string) => void;
  isAdmin?: boolean;
}

export const HcmBiographyView: React.FC<HcmBiographyViewProps> = ({
  isResearchMode,
  onToggleResearchMode,
  onNavigateTab,
  isAdmin = false
}) => {
  const [chapters, setChapters] = useState<BiographyChapter[]>(() => loadStoredChapters());
  const [governanceEvents, setGovernanceEvents] = useState<EventCardSchema[]>(() => loadStoredEvents());
  const [selectedChapterId, setSelectedChapterId] = useState<string>('chap-01');
  const [activeChapterModal, setActiveChapterModal] = useState<BiographyChapter | null>(null);
  const [selectedEventModal, setSelectedEventModal] = useState<HistoricalEvent | EventCardSchema | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Universal Editor Modal state for Admin direct editing
  const [editingType, setEditingType] = useState<'chapter' | 'event' | null>(null);
  const [editingData, setEditingData] = useState<any>(null);

  useEffect(() => {
    // Keep chapters synchronized if modified in Admin
    setChapters(loadStoredChapters());
    setGovernanceEvents(loadStoredEvents());
  }, []);

  const handleSaveItem = (updatedItem: any) => {
    if (editingType === 'chapter') {
      const updatedList = chapters.map((chap) =>
        chap.id === updatedItem.id ? updatedItem : chap
      );
      setChapters(updatedList);
      saveStoredChapters(updatedList);
    } else if (editingType === 'event') {
      const updatedList = governanceEvents.map((ev) =>
        ev.id === updatedItem.id ? updatedItem : ev
      );
      setGovernanceEvents(updatedList);
      saveStoredEvents(updatedList);
    }
    setEditingType(null);
    setEditingData(null);
  };

  const activeChapter = useMemo(() => {
    return chapters.find((c) => c.id === selectedChapterId) || chapters[0];
  }, [chapters, selectedChapterId]);

  // Filter events related to the active chapter period
  const chapterEvents = useMemo(() => {
    if (!activeChapter) return [];
    
    // Combine museum data and governance data
    const allEvents = [...HISTORICAL_EVENTS, ...governanceEvents];
    
    // Match events based on chapter order and time periods
    return allEvents.filter((ev) => {
      // Need to normalize date access for both EventCardSchema and HistoricalEvent
      const year = 'date_start' in ev ? new Date(ev.date_start).getFullYear() : (ev as any).year;
      
      if (activeChapter.order === 1) return year >= 1890 && year <= 1911;
      if (activeChapter.order === 2) return year >= 1911 && year <= 1920;
      if (activeChapter.order === 3) return year >= 1921 && year <= 1930;
      if (activeChapter.order === 4) return year >= 1930 && year <= 1945;
      if (activeChapter.order === 5) return year >= 1945 && year <= 1954;
      if (activeChapter.order === 6) return year >= 1954 && year <= 1969;
      return true;
    });
  }, [activeChapter, governanceEvents]);

  // Filter chapters by search query if typed
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    const q = searchQuery.toLowerCase();
    return chapters.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.timeRange.toLowerCase().includes(q)
    );
  }, [chapters, searchQuery]);

  return (
    <div className="space-y-8 py-2">
      {/* Universal Direct Editor Modal for Admins */}
      {editingType && editingData && (
        <UniversalHcmEditorModal
          isOpen={!!editingType}
          onClose={() => {
            setEditingType(null);
            setEditingData(null);
          }}
          itemType={editingType}
          itemData={editingData}
          onSave={handleSaveItem}
        />
      )}

      {/* ========================================================== */}
      {/* SECTION VIII.1: HEADER HERO PHÂN HỆ TIỂU SỬ - TONE HỒNG CÁNH SEN */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white p-6 sm:p-8 lg:p-10 shadow-xl border-2 border-rose-300/40">
        <div className="absolute top-0 right-0 p-6 opacity-15 pointer-events-none">
          <DongSonDrumIcon size={260} />
        </div>

        <div className="relative z-10 space-y-5">
          {/* Top Metadata Accreditation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-300/30 pb-4">
            <div className="flex items-center gap-2">
              <HoaSenIcon className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-100 text-xs font-bold uppercase tracking-wider">
                THẨM ĐỊNH NGUỒN CẤP A (CỔNG TTĐT TP.HCM)
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-amber-200">
              <a
                href="https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1.5 underline underline-offset-2 transition-colors font-bold"
              >
                <span>hochiminhcity.gov.vn/cuoc-doi-su-nghiep</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Title & Introduction */}
          <div className="space-y-3 max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
              Cuộc Đời Và Sự Nghiệp Lãnh Tụ Hồ Chí Minh (06 Chương Cốt Lõi)
            </h1>

            <p className="text-sm sm:text-base text-rose-50 font-normal leading-relaxed">
              Toàn bộ nội dung lịch sử được biên tập chính xác 100% theo tư liệu chính thống công bố trên Cổng thông tin điện tử Thành phố Hồ Chí Minh. Nội dung bao gồm 06 chương trình bày theo thứ tự niên biểu chuẩn mực, tích hợp timeline và tư liệu đính kèm.
            </p>
          </div>

          {/* Quick Jump Chapter Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-amber-200 uppercase tracking-wider mr-1">
              Chọn chương:
            </span>
            {chapters.map((chap) => (
              <button
                key={chap.id}
                onClick={() => setSelectedChapterId(chap.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedChapterId === chap.id
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-rose-950 shadow-md ring-2 ring-amber-200'
                    : 'bg-rose-950/40 hover:bg-rose-950/60 text-rose-100 border border-rose-300/30'
                }`}
              >
                <span>Chương 0{chap.order}</span>
                <span className="hidden md:inline text-[11px] opacity-90">({chap.timeRange})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SECTION VIII.2: BỘ TÌM KIẾM & CHẾ ĐỘ NGHIÊN CỨU */}
      {/* ========================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 p-4 rounded-2xl border-2 border-rose-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700" />
          <input
            type="text"
            placeholder="Tra cứu từ khóa trong 06 chương Cuộc đời – Sự nghiệp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white border border-rose-200 text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
          />
        </div>

        <button
          onClick={onToggleResearchMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
            isResearchMode
              ? 'bg-amber-300 text-rose-950 border-amber-200 shadow-sm'
              : 'bg-rose-100 text-rose-900 border-rose-200 hover:bg-rose-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-700" />
          <span>Chế độ Nghiên cứu học thuật: {isResearchMode ? 'ĐANG BẬT' : 'TẮT'}</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* SECTION VIII.3: CHI TIẾT CHƯƠNG ĐANG CHỌN */}
      {/* ========================================================== */}
      {activeChapter && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: DANH SÁCH 06 CHƯƠNG (35%) */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-sm font-bold text-rose-900 uppercase tracking-wider flex items-center gap-2 px-1">
              <Layers className="w-4 h-4 text-rose-700" />
              <span>06 Chương Lịch Sử Chuẩn Mực</span>
            </h2>

            <div className="space-y-3">
              {filteredChapters.map((chap) => {
                const isSelected = selectedChapterId === chap.id;
                return (
                  <div
                    key={chap.id}
                    onClick={() => setSelectedChapterId(chap.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-gradient-to-br from-rose-800 via-pink-700 to-rose-900 text-white border-amber-300 shadow-lg ring-2 ring-amber-300/30'
                        : 'bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 border-rose-200 text-rose-950 hover:border-rose-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md font-serif font-extrabold text-xs ${
                          isSelected
                            ? 'bg-amber-300 text-rose-950'
                            : 'bg-rose-100 text-rose-900 border border-rose-200'
                        }`}
                      >
                        Chương 0{chap.order}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-amber-200' : 'text-rose-700'
                        }`}
                      >
                        {chap.timeRange}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-sm sm:text-base mb-1.5 leading-snug">
                      {chap.title}
                    </h3>

                    <p
                      className={`text-xs line-clamp-2 leading-relaxed ${
                        isSelected ? 'text-rose-100' : 'text-rose-900/80'
                      }`}
                    >
                      {chap.summary}
                    </p>

                    {/* Admin Edit Chapter button */}
                    {isAdmin && (
                      <div className="mt-3 pt-2 border-t border-rose-300/20 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingType('chapter');
                            setEditingData(chap);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                            isSelected
                              ? 'bg-amber-300 text-rose-950 hover:bg-amber-200'
                              : 'bg-rose-100 text-rose-900 hover:bg-rose-200 border border-rose-300'
                          }`}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Sửa chương</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI: NỘI DUNG CHI TIẾT & SỰ KIỆN NỔI BẬT (65%) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 shadow-md space-y-6">
              {/* Header chương */}
              <div className="border-b border-rose-200 pb-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider">
                    CHƯƠNG 0{activeChapter.order}: {activeChapter.timeRange}
                  </span>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setEditingType('chapter');
                          setEditingData(activeChapter);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 text-rose-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-300 transition shadow-xs cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa nội dung chương</span>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveChapterModal(activeChapter)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-100 text-rose-900 font-bold text-xs hover:bg-rose-200 transition flex items-center gap-1 border border-rose-300 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-rose-700" />
                      <span>Đọc toàn văn chương</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-rose-950 leading-tight">
                  {activeChapter.title}
                </h2>
              </div>

              {/* Tóm tắt chương */}
              <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-rose-700" />
                  <span>Tóm tắt luận điểm chính</span>
                </h4>
                <p className="text-xs sm:text-sm text-rose-950 leading-relaxed font-normal">
                  {activeChapter.summary}
                </p>
              </div>

              {/* Danh mục cột mốc tiêu biểu */}
              {activeChapter.keyMilestones && activeChapter.keyMilestones.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Các mốc lịch sử then chốt trong chương</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeChapter.keyMilestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-rose-200 text-xs text-rose-950 font-medium flex items-start gap-2 shadow-2xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-rose-200">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Danh sách thẻ sự kiện đính kèm */}
              <div className="space-y-3 pt-4 border-t border-rose-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-700" />
                    <span>Sự kiện lịch sử trong thời kỳ này ({chapterEvents.length})</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {chapterEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEventModal(ev)}
                      className="p-4 rounded-2xl bg-white border-2 border-rose-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold border border-rose-200">
                          {'dateLabel' in ev ? ev.dateLabel : ev.date_display}
                        </span>
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-600" />
                          {'locationName' in ev ? ev.locationName : ev.location}
                        </span>
                      </div>

                      <h5 className="font-serif font-bold text-xs sm:text-sm text-rose-950 group-hover:text-rose-700 transition-colors leading-snug">
                        {ev.title}
                      </h5>

                      <p className="text-xs text-rose-900/80 line-clamp-2 leading-relaxed">
                        {ev.summary}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-rose-800">
                        <span>Xem chi tiết tư liệu</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Đọc Toàn Văn Chương */}
      <AnimatePresence>
        {activeChapterModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-rose-950/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-gradient-to-b from-white via-rose-50/50 to-amber-50/30 rounded-3xl border-2 border-rose-300 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-5 bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white flex items-center justify-between shadow-md">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                    Chương 0{activeChapterModal.order}: {activeChapterModal.timeRange}
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-bold">
                    {activeChapterModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveChapterModal(null)}
                  className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-rose-950 leading-relaxed font-serif">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-rose-950 font-sans italic">
                  <b>Tóm tắt chương:</b> {activeChapterModal.summary}
                </div>
                <div className="whitespace-pre-line text-justify leading-loose">
                  {activeChapterModal.full_text}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Xem Chi Tiết Thẻ Sự Kiện */}
      <AnimatePresence>
        {selectedEventModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-rose-950/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-gradient-to-b from-white via-rose-50/50 to-amber-50/30 rounded-3xl border-2 border-rose-300 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-5 bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white flex items-center justify-between shadow-md">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                    Sự Kiện Lịch Sử Thẩm Định
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-bold">
                    {selectedEventModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEventModal(null)}
                  className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-rose-950 leading-relaxed">
                <div className="flex items-center gap-4 text-xs font-bold text-rose-800">
                  <span>Thời gian: {'dateLabel' in selectedEventModal ? selectedEventModal.dateLabel : selectedEventModal.date_display}</span>
                  <span>•</span>
                  <span>Địa điểm: {'locationName' in selectedEventModal ? selectedEventModal.locationName : selectedEventModal.location}</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-rose-200 text-rose-950 font-medium">
                  {selectedEventModal.summary}
                </div>

                {'full_content' in selectedEventModal && selectedEventModal.full_content && (
                  <div className="p-4 rounded-xl bg-white border border-rose-200 whitespace-pre-line">
                    {selectedEventModal.full_content}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
