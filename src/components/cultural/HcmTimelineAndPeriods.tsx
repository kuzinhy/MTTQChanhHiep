import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  MapPin,
  ShieldCheck,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Sparkles,
  Quote,
  Edit3
} from 'lucide-react';
import {
  HISTORICAL_PERIODS,
  HISTORICAL_EVENTS,
  HistoricalPeriod,
  HistoricalEvent
} from '../../data/hcmVerifiedMuseumData';
import { EventCardSchema, loadStoredEvents, saveStoredEvents } from '../../data/hcmGovernanceSchema';
import { DongSonDrumIcon, ChimHacIcon, HoaSenIcon } from './TraditionalMotifs';
import { UniversalHcmEditorModal } from './UniversalHcmEditorModal';

interface HcmTimelineAndPeriodsProps {
  isResearchMode: boolean;
  onSelectEventLocation?: (coords: [number, number]) => void;
  isAdmin?: boolean;
}

export const HcmTimelineAndPeriods: React.FC<HcmTimelineAndPeriodsProps> = ({
  isResearchMode,
  onSelectEventLocation,
  isAdmin = false
}) => {
  const [eventsList, setEventsList] = useState<HistoricalEvent[]>(HISTORICAL_EVENTS);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(HISTORICAL_EVENTS[0]);

  // Admin Direct Editing state
  const [editingEvent, setEditingEvent] = useState<HistoricalEvent | null>(null);

  const handleSaveEvent = (updated: HistoricalEvent) => {
    const updatedList = eventsList.map((ev) => (ev.id === updated.id ? updated : ev));
    setEventsList(updatedList);
    setSelectedEvent(updated);
    setEditingEvent(null);
  };

  // Lọc sự kiện theo thời kỳ & từ khóa
  const filteredEvents = useMemo(() => {
    return eventsList.filter((ev) => {
      const matchPeriod = selectedPeriodId === 'ALL' || ev.periodId === selectedPeriodId;
      const matchSearch =
        !searchKeyword.trim() ||
        ev.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        ev.summary.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        ev.locationName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        ev.dateLabel.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchPeriod && matchSearch;
    });
  }, [eventsList, selectedPeriodId, searchKeyword]);

  const activePeriod = useMemo(() => {
    if (selectedPeriodId === 'ALL') return null;
    return HISTORICAL_PERIODS.find((p) => p.id === selectedPeriodId) || null;
  }, [selectedPeriodId]);

  return (
    <div className="space-y-6 py-2">
      {/* Universal Editor Modal for Events */}
      {editingEvent && (
        <UniversalHcmEditorModal
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          itemType="event"
          itemData={{
            ...editingEvent,
            date_display: editingEvent.dateLabel,
            location: editingEvent.locationName,
            full_content: editingEvent.historicalContext
          }}
          onSave={(updated) => {
            const mappedEvent: HistoricalEvent = {
              ...editingEvent,
              title: updated.title,
              dateLabel: updated.date_display || updated.dateLabel,
              locationName: updated.location || updated.locationName,
              summary: updated.summary,
              historicalContext: updated.full_content || updated.historicalContext
            };
            handleSaveEvent(mappedEvent);
          }}
        />
      )}

      {/* Header Điều Khiển & Bộ Lọc Thời Kỳ - Tone Hồng Cánh Sen */}
      <div className="bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 p-5 rounded-3xl border-2 border-rose-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-rose-950 flex items-center gap-2">
              <DongSonDrumIcon className="w-6 h-6 text-rose-700" />
              <span>Dòng Thời Gian Lịch Sử &amp; 08 Không Gian Triển Lãm (1890 – 1969)</span>
            </h2>
            <p className="text-xs text-rose-800/80 mt-0.5">
              100% sự kiện đã thẩm định theo *Hồ Chí Minh – Biên niên tiểu sử* &amp; *Hồ Chí Minh Toàn tập*
            </p>
          </div>

          {/* Ô Tìm Kiếm Nhanh */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700" />
            <input
              type="text"
              placeholder="Tìm sự kiện, địa danh, năm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-950 font-medium"
            />
          </div>
        </div>

        {/* Thanh Chọn 08 Thời Kỳ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedPeriodId('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedPeriodId === 'ALL'
                ? 'bg-gradient-to-r from-rose-700 via-pink-600 to-rose-800 text-white shadow-xs'
                : 'bg-rose-100 text-rose-900 border border-rose-200 hover:bg-rose-200'
            }`}
          >
            Tất cả 08 thời kỳ ({eventsList.length})
          </button>
          {HISTORICAL_PERIODS.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriodId(period.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedPeriodId === period.id
                  ? 'bg-gradient-to-r from-rose-700 via-pink-600 to-rose-800 text-white shadow-xs'
                  : 'bg-rose-100 text-rose-900 border border-rose-200 hover:bg-rose-200'
              }`}
            >
              <span>TK {period.periodNumber}:</span>
              <span>{period.timeRange}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Thông tin Thời Kỳ Đang Chọn */}
      {activePeriod && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-300 text-rose-950 font-serif font-extrabold text-xs">
              THỜI KỲ {activePeriod.periodNumber}: {activePeriod.timeRange}
            </span>
            <span className="text-xs text-amber-100 font-bold">
              {filteredEvents.length} sự kiện thuộc thời kỳ này
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
            {activePeriod.title}
          </h3>
          <p className="text-xs sm:text-sm text-rose-50 leading-relaxed font-normal">
            {activePeriod.description}
          </p>
        </div>
      )}

      {/* Bố Cục Dòng Thời Gian (2 Cột) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI: DANH SÁCH THỜI GIAN THEO NIÊN BIỂU (45%) */}
        <div className="lg:col-span-5 space-y-3 max-h-[680px] overflow-y-auto pr-1">
          {filteredEvents.map((ev, index) => {
            const isSelected = selectedEvent?.id === ev.id;
            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-gradient-to-br from-rose-800 via-pink-700 to-rose-900 text-white border-amber-300 shadow-md ring-2 ring-amber-300/30'
                    : 'bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 border-rose-200 text-rose-950 hover:border-rose-400 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold font-mono ${
                      isSelected
                        ? 'bg-amber-300 text-rose-950'
                        : 'bg-rose-100 text-rose-900 border border-rose-200'
                    }`}
                  >
                    {ev.dateLabel}
                  </span>
                  <span
                    className={`text-[11px] font-bold flex items-center gap-1 ${
                      isSelected ? 'text-amber-100' : 'text-rose-700'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    {ev.locationName}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-xs sm:text-sm leading-snug mb-1">
                  {ev.title}
                </h4>

                <p
                  className={`text-xs line-clamp-2 leading-relaxed ${
                    isSelected ? 'text-rose-100' : 'text-rose-900/80'
                  }`}
                >
                  {ev.summary}
                </p>

                {isAdmin && (
                  <div className="mt-2 pt-2 border-t border-rose-300/20 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEvent(ev);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                        isSelected
                          ? 'bg-amber-300 text-rose-950 hover:bg-amber-200'
                          : 'bg-rose-100 text-rose-900 hover:bg-rose-200 border border-rose-300'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa sự kiện</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CỘT PHẢI: XEM CHI TIẾT SỰ KIỆN SỐ HÓA (55%) */}
        <div className="lg:col-span-7">
          {selectedEvent ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 shadow-md space-y-5 sticky top-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-4">
                <span className="px-3 py-1 rounded-full bg-rose-700 text-white font-mono font-bold text-xs">
                  {selectedEvent.dateLabel}
                </span>

                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <MapPin className="w-4 h-4 text-rose-700" />
                  <span>{selectedEvent.locationName}</span>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setEditingEvent(selectedEvent)}
                    className="px-3 py-1 rounded-xl bg-amber-400 text-rose-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-300 transition shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-extrabold text-rose-950 leading-tight">
                {selectedEvent.title}
              </h3>

              {/* Tóm tắt */}
              <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1">
                <h5 className="text-xs font-bold text-rose-900 uppercase">Tóm tắt sự kiện:</h5>
                <p className="text-xs sm:text-sm text-rose-950 leading-relaxed">
                  {selectedEvent.summary}
                </p>
              </div>

              {/* Bối cảnh & Ý nghĩa */}
              <div className="space-y-3 text-xs sm:text-sm text-rose-950 leading-relaxed font-serif">
                <div className="p-4 rounded-2xl bg-white border border-rose-200 whitespace-pre-line">
                  <h5 className="text-xs font-bold text-rose-900 uppercase font-sans mb-1">Bối cảnh lịch sử chi tiết:</h5>
                  {selectedEvent.historicalContext}
                </div>

                {selectedEvent.significance && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-rose-950 font-sans">
                    <h5 className="text-xs font-bold text-amber-900 uppercase mb-1">Ý nghĩa lịch sử:</h5>
                    <p className="italic">{selectedEvent.significance}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-rose-800 bg-rose-50 rounded-3xl border border-rose-200">
              Chọn một sự kiện bên danh sách để xem chi tiết tư liệu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
