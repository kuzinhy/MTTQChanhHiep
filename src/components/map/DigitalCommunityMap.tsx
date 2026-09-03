import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  MapPin,
  Filter,
  Navigation,
  Layers,
  Building2,
  Users,
  Stethoscope,
  GraduationCap,
  Home,
  HeartHandshake,
  Church,
  ShieldCheck,
  Phone,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Maximize2,
  Compass,
  RotateCcw,
  Info,
  CheckCircle2,
  X,
  Share2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapLocation, NeighborhoodGIS, MapCategory, MapLayerConfig } from '../../data/mapSchema';
import { INITIAL_MAP_CATEGORIES, INITIAL_NEIGHBORHOODS_GIS, INITIAL_MAP_LOCATIONS } from '../../data/mapSeedData';
import { calculateHaversineDistance, formatDistance, removeVietnameseTones, generateGoogleMapsDirectionsUrl } from '../../utils/geoUtils';
import { InteractiveGoogleMap } from './InteractiveGoogleMap';

interface DigitalCommunityMapProps {
  initialNeighborhoodId?: string;
  initialLocationId?: string;
  onSelectLocation?: (location: MapLocation) => void;
  onSelectNeighborhood?: (neighborhood: NeighborhoodGIS) => void;
}

export const DigitalCommunityMap: React.FC<DigitalCommunityMapProps> = ({
  initialNeighborhoodId,
  initialLocationId,
  onSelectLocation,
  onSelectNeighborhood
}) => {
  // Master data
  const [categories] = useState<MapCategory[]>(INITIAL_MAP_CATEGORIES);
  const [neighborhoods] = useState<NeighborhoodGIS[]>(INITIAL_NEIGHBORHOODS_GIS);
  const [locations, setLocations] = useState<MapLocation[]>(INITIAL_MAP_LOCATIONS);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>(initialNeighborhoodId || 'ALL');
  const [selectedWelfareOnly, setSelectedWelfareOnly] = useState<boolean>(false);
  
  // Selection
  const [activeLocation, setActiveLocation] = useState<MapLocation | null>(null);
  const [activeNeighborhood, setActiveNeighborhood] = useState<NeighborhoodGIS | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState<boolean>(false);

  // User GPS Location
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Layer Visibility
  const [layerConfig, setLayerConfig] = useState<MapLayerConfig>({
    show_neighborhood_boundaries: true,
    show_administrative_offices: true,
    show_mttq_organizations: true,
    show_medical_facilities: true,
    show_education_schools: true,
    show_welfare_points: true,
    show_community_centers: true,
    show_religious_sites: true,
    show_public_services: true
  });
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false);

  // Map viewport zoom / center simulation
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 11.015, lng: 106.652 });
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  // Handle Initial Location if requested via props
  useEffect(() => {
    if (initialLocationId) {
      const loc = locations.find(l => l.id === initialLocationId || l.slug === initialLocationId);
      if (loc) {
        setActiveLocation(loc);
        setMapCenter({ lat: loc.latitude, lng: loc.longitude });
      }
    }
    if (initialNeighborhoodId && initialNeighborhoodId !== 'ALL') {
      const nh = neighborhoods.find(n => n.id === initialNeighborhoodId || n.code === initialNeighborhoodId);
      if (nh) {
        setActiveNeighborhood(nh);
        setSelectedNeighborhoodId(nh.id);
        setMapCenter({ lat: nh.center_lat, lng: nh.center_lng });
      }
    }
  }, [initialLocationId, initialNeighborhoodId]);

  // Request User GPS location
  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setUserCoords(coords);
        setMapCenter({ lat: coords.latitude, lng: coords.longitude });
        setZoomLevel(15);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocationError('Không thể lấy vị trí. Bạn có thể duyệt địa điểm trên bản đồ hoặc tìm kiếm theo khu phố.');
      },
      { timeout: 8000 }
    );
  };

  // Reset viewport to Full Ward
  const handleResetView = () => {
    setMapCenter({ lat: 11.015, lng: 106.652 });
    setZoomLevel(14);
    setSelectedCategory('ALL');
    setSelectedNeighborhoodId('ALL');
    setSelectedWelfareOnly(false);
    setSearchQuery('');
    setActiveLocation(null);
    setActiveNeighborhood(null);
  };

  // Calculate dynamic distances & filter locations
  const filteredLocations = useMemo(() => {
    const rawSearch = removeVietnameseTones(searchQuery.toLowerCase().trim());

    return locations
      .map(loc => {
        let distance_in_meters: number | undefined = undefined;
        if (userCoords) {
          distance_in_meters = calculateHaversineDistance(
            userCoords.latitude,
            userCoords.longitude,
            loc.latitude,
            loc.longitude
          );
        }
        return {
          ...loc,
          distance_in_meters
        };
      })
      .filter(loc => {
        if (!loc.is_public) return false;

        // Category filter
        if (selectedCategory !== 'ALL' && loc.category_id !== selectedCategory) {
          return false;
        }

        // Neighborhood filter
        if (selectedNeighborhoodId !== 'ALL' && loc.neighborhood_id !== selectedNeighborhoodId) {
          return false;
        }

        // Welfare only toggle
        if (selectedWelfareOnly && loc.category_code !== 'AN_SINH' && !loc.welfare_type) {
          return false;
        }

        // Search query filter (checks name, address, neighborhood, category)
        if (rawSearch) {
          const matchName = removeVietnameseTones(loc.name).includes(rawSearch);
          const matchAddr = removeVietnameseTones(loc.address).includes(rawSearch);
          const matchNh = loc.neighborhood_name ? removeVietnameseTones(loc.neighborhood_name).includes(rawSearch) : false;
          const matchDesc = loc.description ? removeVietnameseTones(loc.description).includes(rawSearch) : false;
          if (!matchName && !matchAddr && !matchNh && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (userCoords && a.distance_in_meters && b.distance_in_meters) {
          return a.distance_in_meters - b.distance_in_meters;
        }
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [locations, searchQuery, selectedCategory, selectedNeighborhoodId, selectedWelfareOnly, userCoords]);

  // Icon renderer helper
  const renderCategoryIcon = (code?: string, className: string = 'w-4 h-4') => {
    switch (code) {
      case 'CO_QUAN':
        return <Building2 className={className} />;
      case 'TO_CHUC':
        return <Users className={className} />;
      case 'AN_SINH':
        return <HeartHandshake className={className} />;
      case 'Y_TE':
        return <Stethoscope className={className} />;
      case 'GIAO_DUC':
        return <GraduationCap className={className} />;
      case 'CONG_DONG':
        return <Home className={className} />;
      case 'TON_GIAO':
        return <Church className={className} />;
      case 'DICH_VU_CONG':
        return <ShieldCheck className={className} />;
      default:
        return <MapPin className={className} />;
    }
  };

  // Metrics for quick dashboard
  const totalLocationsCount = locations.filter(l => l.is_public).length;
  const welfarePointsCount = locations.filter(l => l.category_code === 'AN_SINH' || l.welfare_type).length;
  const adminOfficesCount = locations.filter(l => l.category_code === 'CO_QUAN' || l.category_code === 'TO_CHUC').length;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* ========================================================================= */}
      {/* I. HEADER BANNER: BẢN ĐỒ SỐ AN SINH PHƯỜNG CHÁNH HIỆP                     */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-red-800 via-rose-900 to-indigo-950 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-black uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Hệ Thống Dữ Liệu Địa Bàn Số GIS</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-xs font-bold">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" />
              <span>Bảo trợ &amp; An sinh 21 Khu phố</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Bản Đồ Số An Sinh &amp; Địa Bàn Phường Chánh Hiệp
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm font-medium leading-relaxed max-w-3xl">
            Khám phá trực quan 21 khu phố, hệ thống cơ quan chính trị - hành chính, trạm y tế, trường học, điểm sinh hoạt cộng đồng và mạng lưới an sinh xã hội vì người nghèo.
          </p>

          {/* Quick Metrics Dashboard Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-rose-200">Địa bàn cơ sở</div>
              <div className="text-lg sm:text-xl font-black text-amber-300">21 Khu phố</div>
              <div className="text-[10px] text-rose-100">100% Phủ sóng số hóa</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-rose-200">Điểm tọa độ (POI)</div>
              <div className="text-lg sm:text-xl font-black text-white">{totalLocationsCount}</div>
              <div className="text-[10px] text-rose-100">Cơ quan, tiện ích, trường học</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-rose-200">Điểm An sinh</div>
              <div className="text-lg sm:text-xl font-black text-emerald-300">{welfarePointsCount}</div>
              <div className="text-[10px] text-rose-100">Bếp ăn, cứu trợ, từ thiện</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-rose-200">Cơ quan &amp; Đoàn thể</div>
              <div className="text-lg sm:text-xl font-black text-sky-300">{adminOfficesCount}</div>
              <div className="text-[10px] text-rose-100">MTTQ &amp; 21 Ban CTMT</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* II. TOOLBAR: TÌM KIẾM, ĐỊNH VỊ GẦN TÔI & LỚP BẢN ĐỒ                        */}
      {/* ========================================================================= */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên địa điểm, cơ quan, trạm y tế, trường học, khu phố 1-21..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* GPS Gần Tôi */}
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                userCoords
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Đang định vị...' : userCoords ? 'Đã định vị GPS' : '📍 Gần tôi'}</span>
            </button>

            {/* Xem toàn phường */}
            <button
              onClick={handleResetView}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Toàn phường</span>
            </button>

            {/* Bật / Tắt lớp */}
            <button
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                showLayerPanel
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Lớp bản đồ</span>
            </button>
          </div>
        </div>

        {/* Location Error Warning if any */}
        {locationError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{locationError}</span>
            </div>
            <button onClick={() => setLocationError(null)} className="text-amber-700 hover:text-amber-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Category & Neighborhood Filter Row */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả danh mục ({locations.length})
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = locations.filter(l => l.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'ALL' : cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {renderCategoryIcon(cat.code, 'w-3.5 h-3.5')}
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick 21 Neighborhood Selector Dropdown & Welfare Toggle */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>Lọc theo 21 Khu phố:</span>
            </div>
            
            <select
              value={selectedNeighborhoodId}
              onChange={(e) => {
                const nhId = e.target.value;
                setSelectedNeighborhoodId(nhId);
                if (nhId !== 'ALL') {
                  const nh = neighborhoods.find(n => n.id === nhId);
                  if (nh) {
                    setMapCenter({ lat: nh.center_lat, lng: nh.center_lng });
                    setZoomLevel(15);
                  }
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
            >
              <option value="ALL">Toàn bộ 21 Khu phố</option>
              {neighborhoods.map((nh) => (
                <option key={nh.id} value={nh.id}>
                  {nh.name} ({nh.code})
                </option>
              ))}
            </select>

            {/* Điểm An sinh Toggle */}
            <button
              onClick={() => setSelectedWelfareOnly(!selectedWelfareOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedWelfareOnly
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Chỉ hiển thị Điểm An sinh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Layer Control Expandable Panel */}
      <AnimatePresence>
        {showLayerPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300">
                  Bật / Tắt Các Lớp Dữ Liệu Địa Bàn
                </h4>
              </div>
              <button
                onClick={() => setShowLayerPanel(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerConfig.show_administrative_offices}
                  onChange={(e) => setLayerConfig({ ...layerConfig, show_administrative_offices: e.target.checked })}
                  className="rounded text-red-600 focus:ring-0"
                />
                <span className="font-semibold">🏛 Cơ quan Đảng - UBND</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerConfig.show_mttq_organizations}
                  onChange={(e) => setLayerConfig({ ...layerConfig, show_mttq_organizations: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-0"
                />
                <span className="font-semibold">👥 Khối MTTQ &amp; Đoàn thể</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerConfig.show_welfare_points}
                  onChange={(e) => setLayerConfig({ ...layerConfig, show_welfare_points: e.target.checked })}
                  className="rounded text-orange-600 focus:ring-0"
                />
                <span className="font-semibold">🤝 Điểm Hỗ trợ An sinh</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerConfig.show_medical_facilities}
                  onChange={(e) => setLayerConfig({ ...layerConfig, show_medical_facilities: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span className="font-semibold">🏥 Trạm Y tế &amp; Khám bệnh</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerConfig.show_education_schools}
                  onChange={(e) => setLayerConfig({ ...layerConfig, show_education_schools: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="font-semibold">🏫 Trường học các cấp</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerConfig.show_community_centers}
                  onChange={(e) => setLayerConfig({ ...layerConfig, show_community_centers: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-0"
                />
                <span className="font-semibold">🏠 21 Văn phòng Khu phố</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerConfig.show_religious_sites}
                  onChange={(e) => setLayerConfig({ ...layerConfig, show_religious_sites: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span className="font-semibold">⛪ Chùa &amp; Cơ sở tôn giáo</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerConfig.show_neighborhood_boundaries}
                  onChange={(e) => setLayerConfig({ ...layerConfig, show_neighborhood_boundaries: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-0"
                />
                <span className="font-semibold">🗺 Ranh giới 21 Khu phố</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* III. MAIN MAP STAGE & SIDEBAR LOCATIONS LIST                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: POI List & Neighborhood Cards (4 Cols Desktop) */}
        <div className="lg:col-span-4 space-y-3 flex flex-col h-[550px] sm:h-[650px]">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>Danh sách địa điểm ({filteredLocations.length})</span>
            </span>
            {userCoords && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Sắp xếp theo cự ly gần nhất
              </span>
            )}
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
            {filteredLocations.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-800">Không tìm thấy địa điểm phù hợp</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Thử đổi từ khóa tìm kiếm hoặc bấm nút bên dưới để xem toàn bộ địa điểm.
                </p>
                <button
                  onClick={handleResetView}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected = activeLocation?.id === loc.id;
                const cat = categories.find(c => c.id === loc.category_id);

                return (
                  <motion.div
                    key={loc.id}
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      setActiveLocation(loc);
                      setMapCenter({ lat: loc.latitude, lng: loc.longitude });
                      if (onSelectLocation) onSelectLocation(loc);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center p-1 text-slate-700">
                        {renderCategoryIcon(loc.category_code, 'w-5 h-5 text-red-700')}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                            cat?.bgBadgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                          } ${cat?.textBadgeColor || ''}`}>
                            {cat?.name?.split('&')[0]?.trim() || 'Cơ sở'}
                          </span>

                          {loc.neighborhood_name && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {loc.neighborhood_name}
                            </span>
                          )}

                          {loc.distance_in_meters !== undefined && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md ml-auto">
                              Cách {formatDistance(loc.distance_in_meters)}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                          {loc.name}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {loc.address}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          {loc.phone && (
                            <span className="text-slate-600 font-medium flex items-center gap-1">
                              <Phone className="w-3 h-3 text-blue-600" />
                              <span>{loc.phone}</span>
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveLocation(loc);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-700 font-bold hover:underline flex items-center gap-0.5 ml-auto"
                          >
                            <span>Chi tiết</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Interactive Visual Community Map Stage (8 Cols Desktop) */}
        <div className="lg:col-span-8 bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-lg relative h-[550px] sm:h-[650px] flex flex-col">
          {/* Interactive True Google Maps / GIS Canvas */}
          <div className="flex-1 relative w-full h-full">
            <InteractiveGoogleMap
              locations={filteredLocations}
              neighborhoods={neighborhoods}
              categories={categories}
              layerConfig={layerConfig}
              activeLocation={activeLocation}
              activeNeighborhood={activeNeighborhood}
              userCoords={userCoords}
              onSelectLocation={(loc) => {
                setActiveLocation(loc);
                setMapCenter({ lat: loc.latitude, lng: loc.longitude });
                if (onSelectLocation) onSelectLocation(loc);
              }}
              onSelectNeighborhood={(nh) => {
                setActiveNeighborhood(nh);
                setSelectedNeighborhoodId(nh.id);
                setMapCenter({ lat: nh.center_lat, lng: nh.center_lng });
                if (onSelectNeighborhood) onSelectNeighborhood(nh);
              }}
              onOpenDetailModal={(loc) => {
                setActiveLocation(loc);
                setShowDetailModal(true);
              }}
              onOpenNeighborhoodModal={(nh) => {
                setActiveNeighborhood(nh);
                setShowNeighborhoodModal(true);
              }}
            />
          </div>

          {/* Floating Card for Selected Location with Quick Google Directions */}
          {activeLocation && (
            <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-3xl p-3.5 sm:p-4 border border-blue-200 shadow-2xl text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn pointer-events-auto">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 border border-blue-400 flex items-center justify-center shrink-0 shadow-md">
                  {renderCategoryIcon(activeLocation.category_code, 'w-5 h-5 text-white')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                      {activeLocation.neighborhood_name || 'Phường Chánh Hiệp'}
                    </span>
                    {activeLocation.phone && (
                      <span className="text-[10px] text-slate-600 font-bold">
                        📞 {activeLocation.phone}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 truncate">
                    {activeLocation.name}
                  </h3>
                  <p className="text-[11px] text-slate-600 truncate">
                    📍 {activeLocation.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href={generateGoogleMapsDirectionsUrl(activeLocation.latitude, activeLocation.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Chỉ đường Google</span>
                </a>

                <button
                  onClick={() => setShowDetailModal(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
                >
                  <span>Xem hồ sơ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* IV. LOCATION DETAIL MODAL POPUP                                           */}
      {/* ========================================================================= */}
      {showDetailModal && activeLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 via-rose-700 to-indigo-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  {renderCategoryIcon(activeLocation.category_code, 'w-5 h-5 text-white')}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                    {activeLocation.neighborhood_name || 'Phường Chánh Hiệp'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black leading-snug">
                    {activeLocation.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={activeLocation.image_url || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800'}
                  alt={activeLocation.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông tin địa điểm</div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {activeLocation.description || 'Chưa có mô tả chi tiết.'}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>Địa chỉ:</span>
                  </div>
                  <div className="font-bold text-slate-900">{activeLocation.address}</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Thời gian mở cửa / Tiếp dân:</span>
                  </div>
                  <div className="font-bold text-slate-900">{activeLocation.opening_hours || 'Theo giờ hành chính'}</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Số điện thoại:</span>
                  </div>
                  <div className="font-bold text-slate-900">{activeLocation.phone || 'Đang cập nhật'}</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tọa độ WGS84:</span>
                  </div>
                  <div className="font-bold text-slate-900">{activeLocation.latitude}, {activeLocation.longitude}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Bản đồ số MTTQ Phường Chánh Hiệp</span>
              <div className="flex items-center gap-2">
                <a
                  href={activeLocation.directions_url || generateGoogleMapsDirectionsUrl(activeLocation.latitude, activeLocation.longitude)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Mở Google Maps chỉ đường</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* V. NEIGHBORHOOD GIS MODAL: XEM 21 KHU PHỐ                                  */}
      {/* ========================================================================= */}
      {showNeighborhoodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-red-800 to-indigo-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Home className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black">
                    Danh Sách 21 Khu Phố - Phường Chánh Hiệp
                  </h3>
                  <p className="text-xs text-rose-200">Mạng lưới cán bộ cơ sở &amp; thiết chế văn hóa địa bàn</p>
                </div>
              </div>
              <button
                onClick={() => setShowNeighborhoodModal(false)}
                className="p-2 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {neighborhoods.map((nh) => (
                  <div
                    key={nh.id}
                    onClick={() => {
                      setSelectedNeighborhoodId(nh.id);
                      setActiveNeighborhood(nh);
                      setMapCenter({ lat: nh.center_lat, lng: nh.center_lng });
                      setShowNeighborhoodModal(false);
                    }}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-red-500 hover:shadow-md transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                        {nh.code}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {nh.population?.toLocaleString('vi-VN')} người
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900">{nh.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{nh.address}</p>

                    <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                      <div className="text-slate-700">Trưởng ban CTMT: <strong>{nh.front_work_head}</strong></div>
                      <div className="text-slate-500">SĐT: {nh.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Hệ thống đồng bộ 21/21 Khu phố mới</span>
              <button
                onClick={() => setShowNeighborhoodModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
