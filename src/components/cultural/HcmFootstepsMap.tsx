import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  MapPin,
  Calendar,
  Globe2,
  ShieldCheck,
  User,
  Building,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { FOOTSTEP_LOCATIONS, FootstepLocation } from '../../data/hcmVerifiedMuseumData';
import { loadStoredFootsteps, saveStoredFootsteps } from '../../lib/hcmDataStore';
import { DongSonDrumIcon, ChimHacIcon, HoaSenIcon } from './TraditionalMotifs';
import { UniversalHcmEditorModal } from './UniversalHcmEditorModal';

interface HcmFootstepsMapProps {
  isResearchMode: boolean;
  isAdmin?: boolean;
}

export const HcmFootstepsMap: React.FC<HcmFootstepsMapProps> = ({ isResearchMode, isAdmin = false }) => {
  const [footstepsList, setFootstepsList] = useState<FootstepLocation[]>(() => loadStoredFootsteps());
  const [selectedLocation, setSelectedLocation] = useState<FootstepLocation>(() => footstepsList[3] || FOOTSTEP_LOCATIONS[3]);

  // Admin Direct Edit state
  const [editingFootstep, setEditingFootstep] = useState<FootstepLocation | null>(null);

  useEffect(() => {
    setFootstepsList(loadStoredFootsteps());
  }, []);

  const handleSaveFootstep = (updated: FootstepLocation) => {
    const updatedList = footstepsList.map((f) => (f.id === updated.id ? updated : f));
    setFootstepsList(updatedList);
    saveStoredFootsteps(updatedList);
    setSelectedLocation(updated);
    setEditingFootstep(null);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Universal Direct Editor Modal for Admin Editing Footsteps */}
      {editingFootstep && (
        <UniversalHcmEditorModal
          isOpen={!!editingFootstep}
          onClose={() => setEditingFootstep(null)}
          itemType="footstep"
          itemData={editingFootstep}
          onSave={handleSaveFootstep}
        />
      )}

      {/* Header Giới thiệu - Tone Hồng Cánh Sen */}
      <div className="bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 p-5 sm:p-6 rounded-3xl border-2 border-rose-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-rose-950 flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-700" />
            <span>Bản Đồ Hành Trình "Dấu Chân Người" (20 Tọa Độ Lịch Sử)</span>
          </h2>
          <p className="text-xs text-rose-800/80 mt-1">
            Theo bước chân Chủ tịch Hồ Chí Minh qua 3 đại dương, 4 châu lục và các căn cứ địa cách mạng giải phóng dân tộc.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
          <Globe2 className="w-4 h-4 text-rose-700" />
          <span>20 Điểm dừng chân lịch sử</span>
        </div>
      </div>

      {/* Bố cục 2 Cột: Danh Sách Điểm Dừng Chân & Chi Tiết Tọa Độ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột Trái: Danh sách điểm mốc */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
          {footstepsList.map((loc, idx) => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-gradient-to-br from-rose-800 via-pink-700 to-rose-900 text-white border-amber-300 shadow-md ring-2 ring-amber-300/30'
                    : 'bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 border-rose-200 text-rose-950 hover:border-rose-400 hover:shadow-xs'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-amber-300 text-rose-950 shadow-md'
                      : 'bg-rose-100 text-rose-900 border border-rose-200'
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-serif font-bold text-sm truncate">
                      {loc.name}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-rose-950/60 text-amber-100'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {loc.country}
                    </span>
                  </div>

                  <div
                    className={`text-[11px] font-bold flex items-center gap-1 mb-1 ${
                      isSelected ? 'text-amber-200' : 'text-rose-700'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{loc.periodYears}</span>
                  </div>

                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-rose-100' : 'text-rose-900/80'
                    }`}
                  >
                    {loc.historicalAction}
                  </p>

                  {isAdmin && (
                    <div className="mt-2 pt-2 border-t border-rose-300/20 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFootstep(loc);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                          isSelected
                            ? 'bg-amber-300 text-rose-950 hover:bg-amber-200'
                            : 'bg-rose-100 text-rose-900 hover:bg-rose-200 border border-rose-300'
                        }`}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Sửa tọa độ</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cột Phải: Bảng Chi Tiết Tọa Độ & Mô Phỏng Trực Quan */}
        <div className="lg:col-span-7 sticky top-4 space-y-4">
          <motion.div
            key={selectedLocation.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 shadow-md space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-4">
              <span className="px-3 py-1 rounded-full bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider">
                {selectedLocation.country} • {selectedLocation.periodYears}
              </span>

              <span className="text-xs font-mono font-bold text-rose-800">
                Tọa độ GPS: [{(selectedLocation.coordinates || [0, 0])[0]}, {(selectedLocation.coordinates || [0, 0])[1]}]
              </span>

              {isAdmin && (
                <button
                  onClick={() => setEditingFootstep(selectedLocation)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 text-rose-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-300 transition shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa tọa độ này</span>
                </button>
              )}
            </div>

            <h3 className="text-xl font-serif font-extrabold text-rose-950 leading-tight">
              {selectedLocation.name}
            </h3>

            {/* Bí danh / Bút danh sử dụng */}
            {selectedLocation.aliasUsed && (
              <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-xs text-amber-950 font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-amber-800" />
                <span>Bí danh / Tên gọi giai đoạn này: {selectedLocation.aliasUsed}</span>
              </div>
            )}

            {/* Hoạt động lịch sử cốt lõi */}
            <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1">
              <h5 className="text-xs font-bold text-rose-900 uppercase">Sự kiện &amp; Hoạt động cách mạng:</h5>
              <p className="text-xs sm:text-sm text-rose-950 leading-relaxed font-normal">
                {selectedLocation.historicalAction}
              </p>
            </div>

            {/* Di tích chính / Xuất xứ tư liệu */}
            {(selectedLocation.primaryRelic || selectedLocation.sourceReference) && (
              <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-2">
                {selectedLocation.primaryRelic && (
                  <div>
                    <h5 className="text-xs font-bold text-rose-900 uppercase">Di tích / Địa điểm lưu niệm:</h5>
                    <p className="text-xs sm:text-sm text-rose-950 font-medium">{selectedLocation.primaryRelic}</p>
                  </div>
                )}
                {selectedLocation.sourceReference && (
                  <div className="pt-2 border-t border-rose-100">
                    <h5 className="text-[11px] font-bold text-rose-800 uppercase">Xuất xứ tư liệu:</h5>
                    <p className="text-xs text-rose-900 font-serif">{selectedLocation.sourceReference}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
