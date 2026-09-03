import React from 'react';
import { 
  MapPin, 
  Navigation, 
  ArrowRight, 
  Building2, 
  HeartHandshake, 
  Users, 
  Sparkles, 
  Compass,
  CheckCircle2,
  Stethoscope,
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';
import { INITIAL_MAP_LOCATIONS, INITIAL_NEIGHBORHOODS_GIS } from '../../data/mapSeedData';

interface DigitalMapSectionProps {
  onNavigateToMap?: () => void;
  onSelectNeighborhood?: (neighborhoodId: string) => void;
}

export const DigitalMapSection: React.FC<DigitalMapSectionProps> = ({
  onNavigateToMap,
  onSelectNeighborhood
}) => {
  const totalLocations = INITIAL_MAP_LOCATIONS.length;
  const welfareCount = INITIAL_MAP_LOCATIONS.filter(l => l.category_code === 'AN_SINH' || l.welfare_type).length;
  const featuredLocations = INITIAL_MAP_LOCATIONS.filter(l => l.is_featured).slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left column: Overview & CTA */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-200 border border-red-500/30 text-xs font-black uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-red-400" />
            <span>Phân hệ Bản Đồ Số GIS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Bản Đồ Số An Sinh &amp; Địa Bàn 21 Khu Phố
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Hệ thống dữ liệu không gian trực quan hóa 21 khu phố, trụ sở Đảng ủy, UBND, Ủy ban MTTQ Việt Nam phường, Trạm Y tế, trường học và toàn bộ các điểm hỗ trợ an sinh xã hội vì người nghèo.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-[10px] uppercase font-bold text-rose-300">Khu phố</div>
              <div className="text-lg font-black text-amber-300">21 / 21</div>
              <div className="text-[10px] text-slate-400">100% Địa bàn</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-[10px] uppercase font-bold text-rose-300">Địa điểm (POI)</div>
              <div className="text-lg font-black text-white">{totalLocations}+</div>
              <div className="text-[10px] text-slate-400">Cơ quan &amp; tiện ích</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-[10px] uppercase font-bold text-rose-300">Điểm An sinh</div>
              <div className="text-lg font-black text-emerald-400">{welfareCount}</div>
              <div className="text-[10px] text-slate-400">Thiện nguyện, cứu trợ</div>
            </div>
          </div>

          {/* Call to action button */}
          <div className="pt-2">
            <button
              onClick={onNavigateToMap}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-white" />
              <span>KHÁM PHÁ BẢN ĐỒ SỐ ĐỊA BÀN</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Right column: Interactive Mini-Map Preview Card */}
        <div className="lg:col-span-6 bg-slate-950/80 rounded-3xl p-5 border border-white/15 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              <span className="text-xs font-black text-white uppercase tracking-wide">
                Các Địa Điểm Trọng Điểm
              </span>
            </div>
            <button
              onClick={onNavigateToMap}
              className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {featuredLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={onNavigateToMap}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-red-400/50 hover:bg-white/10 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded-md">
                    {loc.neighborhood_name}
                  </span>
                  <span className="text-[10px] text-slate-400">Chánh Hiệp</span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug line-clamp-1">
                  {loc.name}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">
                  {loc.address}
                </p>
              </div>
            ))}
          </div>

          {/* Quick 21 Neighborhood Centroids Pill Grid */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Truy cập nhanh 21 Khu phố:</div>
            <div className="flex flex-wrap gap-1.5">
              {INITIAL_NEIGHBORHOODS_GIS.slice(0, 10).map((nh) => (
                <span
                  key={nh.id}
                  onClick={() => {
                    if (onSelectNeighborhood) onSelectNeighborhood(nh.id);
                    if (onNavigateToMap) onNavigateToMap();
                  }}
                  className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-red-600 text-[10px] font-bold text-slate-200 hover:text-white cursor-pointer transition-colors"
                >
                  {nh.code}
                </span>
              ))}
              <span
                onClick={onNavigateToMap}
                className="px-2 py-0.5 rounded-md bg-red-600/30 text-[10px] font-bold text-amber-200 cursor-pointer hover:bg-red-600 hover:text-white transition-colors"
              >
                +11 KP khác
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
