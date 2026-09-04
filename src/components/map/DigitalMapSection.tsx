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
  GraduationCap,
  Landmark,
  Palette
} from 'lucide-react';
import { motion } from 'motion/react';
import { INITIAL_MAP_LOCATIONS } from '../../data/mapSeedData';

interface DigitalMapSectionProps {
  onNavigateToMap?: () => void;
  onSelectNeighborhood?: (neighborhoodId: string) => void;
}

export const DigitalMapSection: React.FC<DigitalMapSectionProps> = ({
  onNavigateToMap,
  onSelectNeighborhood
}) => {
  const totalLocations = INITIAL_MAP_LOCATIONS.length;
  const diaChiDoCount = INITIAL_MAP_LOCATIONS.filter(l => l.category_code === 'DIA_CHI_DO' || l.category_code === 'LANG_NGHE').length;
  const featuredLocations = INITIAL_MAP_LOCATIONS.filter(l => l.is_featured).slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-sky-50/40 to-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-xl border border-blue-200/80 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left column: Overview & CTA */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-black uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Phân hệ Bản Đồ Số Địa Phương</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Bản đồ số
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Hệ thống dữ liệu không gian trực quan hóa các "Địa chỉ đỏ", di tích lịch sử cách mạng, làng nghề truyền thống, thiết chế văn hóa và các cơ quan hành chính, y tế, giáo dục tại địa phương.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-white/90 border border-blue-100 shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-500">Địa chỉ đỏ &amp; Di tích</div>
              <div className="text-lg font-black text-red-600">{INITIAL_MAP_LOCATIONS.filter(l => l.category_code === 'DIA_CHI_DO').length}</div>
              <div className="text-[10px] text-slate-500">Lịch sử cách mạng</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-blue-100 shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-500">Làng nghề</div>
              <div className="text-lg font-black text-amber-600">{INITIAL_MAP_LOCATIONS.filter(l => l.category_code === 'LANG_NGHE').length}</div>
              <div className="text-[10px] text-slate-500">Truyền thống văn hóa</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-blue-100 shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-500">Tổng điểm (POI)</div>
              <div className="text-lg font-black text-blue-700">{totalLocations}+</div>
              <div className="text-[10px] text-slate-500">Tiện ích địa phương</div>
            </div>
          </div>

          {/* Call to action button */}
          <div className="pt-2">
            <button
              onClick={onNavigateToMap}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-white" />
              <span>KHÁM PHÁ BẢN ĐỒ SỐ ĐỊA PHƯƠNG</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Right column: Interactive Mini-Map Preview Card */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-blue-200/90 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-red-600" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                Địa chỉ đỏ &amp; Di tích nổi bật
              </span>
            </div>
            <button
              onClick={onNavigateToMap}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
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
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-400 hover:bg-red-50/30 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-red-700 bg-red-100 px-1.5 py-0.5 rounded-md">
                    {loc.category_code === 'DIA_CHI_DO' ? 'Địa chỉ đỏ' : loc.category_code === 'LANG_NGHE' ? 'Làng nghề' : 'Địa phương'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Chánh Hiệp</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                  {loc.name}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1">
                  {loc.address}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>Bảo tồn di tích lịch sử và làng nghề truyền thống</span>
            </div>
            <span className="text-blue-600 font-bold hover:underline cursor-pointer" onClick={onNavigateToMap}>
              Mở bản đồ đầy đủ →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
