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
  ChevronLeft,
  Sparkles,
  Maximize2,
  Compass,
  RotateCcw,
  Info,
  CheckCircle2,
  X,
  Share2,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Settings,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  Crosshair,
  Sliders,
  Globe,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapLocation, NeighborhoodGIS, MapCategory, MapLayerConfig } from '../../data/mapSchema';
import { INITIAL_MAP_CATEGORIES, INITIAL_NEIGHBORHOODS_GIS } from '../../data/mapSeedData';
import { calculateHaversineDistance, formatDistance, removeVietnameseTones, generateGoogleMapsDirectionsUrl } from '../../utils/geoUtils';
import { InteractiveGoogleMap } from './InteractiveGoogleMap';
import { AppStorageEngine } from '../../lib/storage';
import { StaffUser } from '../../types';
import { ARTICLE_BANNERS } from '../../utils/officialImages';

interface DigitalCommunityMapProps {
  initialNeighborhoodId?: string;
  initialLocationId?: string;
  onSelectLocation?: (location: MapLocation) => void;
  onSelectNeighborhood?: (neighborhood: NeighborhoodGIS) => void;
  currentStaffUser?: StaffUser | null;
}

export const DigitalCommunityMap: React.FC<DigitalCommunityMapProps> = ({
  initialNeighborhoodId,
  initialLocationId,
  onSelectLocation,
  onSelectNeighborhood,
  currentStaffUser
}) => {
  // Master data
  const [categories] = useState<MapCategory[]>(INITIAL_MAP_CATEGORIES);
  const [neighborhoods] = useState<NeighborhoodGIS[]>(INITIAL_NEIGHBORHOODS_GIS);
  const [locations, setLocations] = useState<MapLocation[]>(() => AppStorageEngine.getMapLocations());

  // User & Admin context
  const currentUser = currentStaffUser || AppStorageEngine.getCurrentUser();
  const isAdmin = currentUser && ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'MTTQ_ADMIN', 'EDITOR', 'STAFF'].includes(currentUser.role);

  // Admin Management States
  const [showAdminListModal, setShowAdminListModal] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<Partial<MapLocation> | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [deletingLocation, setDeletingLocation] = useState<MapLocation | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Filters
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>('');
  const [adminNeighborhoodFilter, setAdminNeighborhoodFilter] = useState<string>('ALL');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<string>('ALL');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('ALL');

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

  // Horizontal reel ref & scroll handlers
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLocationsLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollLocationsRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  // Toast feedback trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Auto scroll active location card into view
  useEffect(() => {
    if (activeLocation && scrollContainerRef.current) {
      const cardEl = document.getElementById(`loc-card-${activeLocation.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeLocation]);

  // Handle Initial Location if requested via props
  useEffect(() => {
    if (initialLocationId) {
      const loc = locations.find(l => l.id === initialLocationId || l.slug === initialLocationId);
      if (loc) {
        setActiveLocation(loc);
        setMapCenter({ lat: loc.latitude, lng: loc.longitude });
        setShowDetailModal(true);
      }
    }
  }, [initialLocationId, locations]);

  // Handle Initial Neighborhood if requested via props
  useEffect(() => {
    if (initialNeighborhoodId && initialNeighborhoodId !== 'ALL') {
      const nh = neighborhoods.find(n => n.id === initialNeighborhoodId || n.code === initialNeighborhoodId);
      if (nh) {
        setSelectedNeighborhoodId(nh.id);
        setActiveNeighborhood(nh);
        setMapCenter({ lat: nh.center_lat, lng: nh.center_lng });
      }
    }
  }, [initialNeighborhoodId, neighborhoods]);

  // Handle User GPS Geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Trình duyệt không hỗ trợ định vị GPS.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        setMapCenter({ lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Bạn đã từ chối quyền truy cập vị trí GPS.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Không thể xác định vị trí GPS hiện tại.');
            break;
          case error.TIMEOUT:
            setLocationError('Hết thời gian chờ định vị GPS.');
            break;
          default:
            setLocationError('Đã xảy ra lỗi khi xác định vị trí.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 1. Calculate Public Filtered Locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // Respect hidden status for public view
      if (loc.status === 'HIDDEN' && !isAdmin) return false;

      // Filter by Search Query
      if (searchQuery.trim()) {
        const query = removeVietnameseTones(searchQuery.trim().toLowerCase());
        const locName = removeVietnameseTones(loc.name.toLowerCase());
        const locAddress = removeVietnameseTones(loc.address.toLowerCase());
        const locNh = removeVietnameseTones((loc.neighborhood_name || '').toLowerCase());
        const locDesc = removeVietnameseTones((loc.description || '').toLowerCase());

        const matches = locName.includes(query) || locAddress.includes(query) || locNh.includes(query) || locDesc.includes(query);
        if (!matches) return false;
      }

      // Filter by Category
      if (selectedCategory !== 'ALL' && loc.category_id !== selectedCategory && loc.category_code !== selectedCategory) {
        return false;
      }

      // Filter by Neighborhood
      if (selectedNeighborhoodId !== 'ALL' && loc.neighborhood_id !== selectedNeighborhoodId && loc.neighborhood_code !== selectedNeighborhoodId) {
        return false;
      }

      // Filter by Welfare Points
      if (selectedWelfareOnly && loc.category_code !== 'AN_SINH' && loc.welfare_type === 'NONE') {
        return false;
      }

      return true;
    }).map((loc) => {
      // Attach distance if user GPS available
      if (userCoords) {
        const dist = calculateHaversineDistance(
          userCoords.latitude,
          userCoords.longitude,
          loc.latitude,
          loc.longitude
        );
        return { ...loc, distance_in_meters: dist };
      }
      return loc;
    }).sort((a, b) => {
      if (userCoords && a.distance_in_meters !== undefined && b.distance_in_meters !== undefined) {
        return a.distance_in_meters - b.distance_in_meters;
      }
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [locations, searchQuery, selectedCategory, selectedNeighborhoodId, selectedWelfareOnly, userCoords, isAdmin]);

  // 2. Calculate Admin Filtered Locations for Admin Modal
  const adminFilteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (adminSearchQuery.trim()) {
        const query = removeVietnameseTones(adminSearchQuery.trim().toLowerCase());
        const locName = removeVietnameseTones(loc.name.toLowerCase());
        const locAddress = removeVietnameseTones(loc.address.toLowerCase());
        if (!locName.includes(query) && !locAddress.includes(query)) return false;
      }

      if (adminNeighborhoodFilter !== 'ALL' && loc.neighborhood_id !== adminNeighborhoodFilter && loc.neighborhood_code !== adminNeighborhoodFilter) {
        return false;
      }

      if (adminCategoryFilter !== 'ALL' && loc.category_id !== adminCategoryFilter && loc.category_code !== adminCategoryFilter) {
        return false;
      }

      if (adminStatusFilter !== 'ALL' && loc.status !== adminStatusFilter) {
        return false;
      }

      return true;
    });
  }, [locations, adminSearchQuery, adminNeighborhoodFilter, adminCategoryFilter, adminStatusFilter]);

  // Reset Filters
  const handleResetView = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedNeighborhoodId('ALL');
    setSelectedWelfareOnly(false);
    setActiveLocation(null);
    setActiveNeighborhood(null);
    setMapCenter({ lat: 11.015, lng: 106.652 });
  };

  // Helper render Category Icon
  const renderCategoryIcon = (code: string | undefined, className = 'w-4 h-4') => {
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
      case 'TRU_SO_KP':
        return <Home className={className} />;
      case 'TON_GIAO':
        return <Church className={className} />;
      default:
        return <MapPin className={className} />;
    }
  };

  // ==========================================
  // HANDLERS FOR LOCATION CRUD (ADMIN)
  // ==========================================

  // Open Form to Create
  const handleOpenCreateForm = () => {
    const defaultNeighborhood = neighborhoods[0];
    const defaultCat = categories[0];

    setEditingLocation({
      id: '',
      name: '',
      slug: '',
      category_id: defaultCat?.id || 'cat-co-quan',
      category_code: defaultCat?.code || 'CO_QUAN',
      neighborhood_id: defaultNeighborhood?.id || 'area-chanh-hiep',
      neighborhood_name: defaultNeighborhood?.name || 'Phường Chánh Hiệp',
      neighborhood_code: defaultNeighborhood?.code || 'KP-01',
      address: 'Phường Chánh Hiệp, Thành phố Thủ Dầu Một, Bình Dương',
      latitude: defaultNeighborhood?.center_lat || 11.015,
      longitude: defaultNeighborhood?.center_lng || 106.652,
      description: '',
      phone: '',
      email: '',
      opening_hours: '7:30 - 11:30 | 13:30 - 17:00 (Thứ 2 - Thứ 6)',
      directions_url: '',
      is_featured: false,
      is_public: true,
      welfare_type: 'NONE',
      status: 'ACTIVE'
    });
    setShowFormModal(true);
  };

  // Open Form to Edit
  const handleOpenEditForm = (loc: MapLocation) => {
    setEditingLocation({ ...loc });
    setShowFormModal(true);
  };

  // Save Location (Create or Update)
  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation || !editingLocation.name?.trim()) {
      alert('Vui lòng nhập tên địa điểm!');
      return;
    }

    const selectedNh = neighborhoods.find(n => n.id === editingLocation.neighborhood_id) || neighborhoods[0];
    const selectedCat = categories.find(c => c.id === editingLocation.category_id) || categories[0];

    const slug = editingLocation.slug || removeVietnameseTones(editingLocation.name.trim()).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const lat = Number(editingLocation.latitude) || selectedNh.center_lat;
    const lng = Number(editingLocation.longitude) || selectedNh.center_lng;

    const directions_url = editingLocation.directions_url?.trim() || generateGoogleMapsDirectionsUrl(lat, lng);

    if (editingLocation.id) {
      // UPDATE EXISTING LOCATION
      const updatedList = locations.map(loc => {
        if (loc.id === editingLocation.id) {
          return {
            ...loc,
            ...editingLocation,
            name: editingLocation.name!.trim(),
            slug,
            category_id: selectedCat.id,
            category_code: selectedCat.code,
            category: selectedCat,
            neighborhood_id: selectedNh.id,
            neighborhood_name: selectedNh.name,
            neighborhood_code: selectedNh.code,
            latitude: lat,
            longitude: lng,
            directions_url,
            updated_at: new Date().toISOString(),
            updated_by: currentUser?.fullname || 'Ban Quản Trị'
          } as MapLocation;
        }
        return loc;
      });

      setLocations(updatedList);
      AppStorageEngine.saveMapLocations(updatedList);
      
      if (activeLocation && activeLocation.id === editingLocation.id) {
        const updated = updatedList.find(l => l.id === editingLocation.id);
        if (updated) setActiveLocation(updated);
      }

      showToast(`Đã cập nhật địa điểm "${editingLocation.name}" thành công!`);
    } else {
      // CREATE NEW LOCATION
      const newId = `loc-custom-${Date.now()}`;
      const newLoc: MapLocation = {
        id: newId,
        name: editingLocation.name!.trim(),
        slug,
        category_id: selectedCat.id,
        category_code: selectedCat.code,
        category: selectedCat,
        neighborhood_id: selectedNh.id,
        neighborhood_name: selectedNh.name,
        neighborhood_code: selectedNh.code,
        address: editingLocation.address || 'Phường Chánh Hiệp, TPHCM',
        latitude: lat,
        longitude: lng,
        description: editingLocation.description || '',
        phone: editingLocation.phone || '',
        email: editingLocation.email || '',
        opening_hours: editingLocation.opening_hours || 'Giờ hành chính',
        image_url: editingLocation.image_url || ARTICLE_BANNERS.default,
        directions_url,
        is_featured: !!editingLocation.is_featured,
        is_public: editingLocation.is_public !== false,
        welfare_type: editingLocation.welfare_type || 'NONE',
        status: editingLocation.status || 'ACTIVE',
        created_at: new Date().toISOString(),
        created_by: currentUser?.fullname || 'Ban Quản Trị'
      };

      const updatedList = [newLoc, ...locations];
      setLocations(updatedList);
      AppStorageEngine.saveMapLocations(updatedList);
      setActiveLocation(newLoc);
      setMapCenter({ lat: newLoc.latitude, lng: newLoc.longitude });

      showToast(`Đã thêm địa điểm mới "${newLoc.name}" thành công!`);
    }

    setShowFormModal(false);
    setEditingLocation(null);
  };

  // Toggle Active/Hidden Status
  const handleToggleStatus = (id: string) => {
    const updatedList = locations.map(l => {
      if (l.id === id) {
        const nextStatus: 'ACTIVE' | 'HIDDEN' = l.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
        return { ...l, status: nextStatus };
      }
      return l;
    });

    setLocations(updatedList);
    AppStorageEngine.saveMapLocations(updatedList);
    showToast('Đã thay đổi trạng thái hiển thị địa điểm.');
  };

  // Delete Location Confirmation Trigger
  const confirmDeleteLocation = (loc: MapLocation) => {
    setDeletingLocation(loc);
    setShowDeleteConfirmModal(true);
  };

  // Execute Delete
  const handleExecuteDelete = () => {
    if (!deletingLocation) return;

    const updatedList = locations.filter(l => l.id !== deletingLocation.id);
    setLocations(updatedList);
    AppStorageEngine.saveMapLocations(updatedList);

    if (activeLocation?.id === deletingLocation.id) {
      setActiveLocation(null);
      setShowDetailModal(false);
    }

    showToast(`Đã xóa địa điểm "${deletingLocation.name}" khỏi hệ thống.`);
    setDeletingLocation(null);
    setShowDeleteConfirmModal(false);
  };

  // Reset to seed defaults
  const handleResetLocations = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục danh sách địa điểm về dữ liệu mẫu ban đầu của 21 Khu phố Chánh Hiệp? Tất cả địa điểm tùy chỉnh sẽ bị làm mới.')) {
      const resetData = AppStorageEngine.resetMapLocationsToSeed();
      setLocations(resetData);
      showToast('Đã khôi phục dữ liệu địa điểm mẫu ban đầu thành công!');
    }
  };

  // Metrics
  const totalLocationsCount = locations.length;
  const activeCount = locations.filter(l => l.status === 'ACTIVE').length;
  const hiddenCount = locations.filter(l => l.status === 'HIDDEN').length;
  const welfarePointsCount = locations.filter(l => l.category_code === 'AN_SINH' || (l.welfare_type && l.welfare_type !== 'NONE')).length;
  const adminOfficesCount = locations.filter(l => l.category_code === 'CO_QUAN' || l.category_code === 'TO_CHUC').length;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn relative">
      {/* Toast Feedback Popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-400/40 flex items-center gap-2.5 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* I. HEADER BANNER: BẢN ĐỒ SỐ AN SINH PHƯỜNG CHÁNH HIỆP                     */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-blue-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-black uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-sky-200" />
                <span>Hệ Thống Dữ Liệu Địa Bàn Số GIS</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 text-xs font-bold">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" />
                <span>Bảo trợ &amp; An sinh 21 Khu phố</span>
              </span>
            </div>

            {/* Admin Management Quick Trigger Button */}
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => setShowAdminListModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-blue-800 hover:bg-blue-50 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>Quản Lý Địa Điểm BQT</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                    {locations.length}
                  </span>
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={handleOpenCreateForm}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Thêm Địa Điểm Mới</span>
                </button>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Bản Đồ Số An Sinh &amp; Địa Bàn Phường Chánh Hiệp
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm font-medium leading-relaxed max-w-3xl">
            Khám phá trực quan 21 khu phố, hệ thống cơ quan chính trị - hành chính, trạm y tế, trường học, điểm sinh hoạt cộng đồng và mạng lưới an sinh xã hội vì người nghèo.
          </p>

          {/* Quick Metrics Dashboard Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-sky-200">Địa bàn cơ sở</div>
              <div className="text-lg sm:text-xl font-black text-white">21 Khu phố</div>
              <div className="text-[10px] text-sky-100">100% Phủ sóng số hóa</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-sky-200">Điểm tọa độ (POI)</div>
              <div className="text-lg sm:text-xl font-black text-white">{totalLocationsCount}</div>
              <div className="text-[10px] text-sky-100">Cơ quan, tiện ích, trường học</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-sky-200">Điểm An sinh</div>
              <div className="text-lg sm:text-xl font-black text-emerald-300">{welfarePointsCount}</div>
              <div className="text-[10px] text-sky-100">Bếp ăn, cứu trợ, từ thiện</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-sky-200">Cơ quan &amp; Đoàn thể</div>
              <div className="text-lg sm:text-xl font-black text-sky-200">{adminOfficesCount}</div>
              <div className="text-[10px] text-sky-100">MTTQ &amp; 21 Ban CTMT</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* II. TOOLBAR: TÌM KIẾM, ĐỊNH VỊ GẦN TÔI & LỚP BẢN ĐỒ                        */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên địa điểm, cơ quan, trạm y tế, trường học, khu phố 1-21..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Action Controls */}
          <div className="md:col-span-6 flex flex-wrap items-center justify-start md:justify-end gap-2">
            {/* GPS Geolocation Button */}
            <button
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                userCoords
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-600' : 'text-emerald-600'}`} />
              <span>{isLocating ? 'Đang định vị...' : userCoords ? 'Đã bật GPS vị trí tôi' : 'Định vị vị trí của tôi'}</span>
            </button>

            {/* Toggle Neighborhood Boundaries List */}
            <button
              onClick={() => setShowNeighborhoodModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-all border border-blue-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>21 Khu phố Chánh Hiệp</span>
            </button>

            {/* Toggle Layer Panel */}
            <button
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showLayerPanel
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bật/Tắt Lớp Dữ Liệu</span>
            </button>

            {/* Admin Management Direct Button */}
            {isAdmin && (
              <button
                onClick={() => setShowAdminListModal(true)}
                className="px-3 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Mở bảng quản lý địa điểm cho Ban Quản Trị"
              >
                <Pencil className="w-3.5 h-3.5 text-amber-300" />
                <span>Sửa/Xóa</span>
              </button>
            )}
          </div>
        </div>

        {/* GPS Location Alert Error Message */}
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

        {/* Category Pills Bar */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Tất cả ({locations.length})</span>
            </button>

            {categories.map((cat) => {
              const count = locations.filter(l => l.category_id === cat.id || l.category_code === cat.code).length;
              const isSelected = selectedCategory === cat.id || selectedCategory === cat.code;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {renderCategoryIcon(cat.code, 'w-3.5 h-3.5')}
                  <span>{cat.name} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Quick 21 Neighborhood Selector Dropdown & Welfare Toggle */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Lọc theo 21 Khu phố:</span>
            </div>
            
            <select
              value={selectedNeighborhoodId}
              onChange={(e) => {
                setSelectedNeighborhoodId(e.target.value);
                if (e.target.value !== 'ALL') {
                  const nh = neighborhoods.find(n => n.id === e.target.value);
                  if (nh) {
                    setActiveNeighborhood(nh);
                    setMapCenter({ lat: nh.center_lat, lng: nh.center_lng });
                  }
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">Toàn bộ 21 Khu phố</option>
              {neighborhoods.map((nh) => (
                <option key={nh.id} value={nh.id}>
                  {nh.code} - {nh.name}
                </option>
              ))}
            </select>

            {/* Quick Welfare Filter Switch */}
            <button
              onClick={() => setSelectedWelfareOnly(!selectedWelfareOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                selectedWelfareOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Chỉ điểm An sinh / Từ thiện</span>
            </button>
          </div>
        </div>

        {/* Collapsible Layer Config Settings Panel */}
        <AnimatePresence>
          {showLayerPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-2 border-t border-slate-200"
            >
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    Quản lý hiển thị các lớp dữ liệu không gian
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Tự động đồng bộ trên bản đồ</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={layerConfig.show_neighborhood_boundaries}
                      onChange={(e) => setLayerConfig({ ...layerConfig, show_neighborhood_boundaries: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold">🏡 Ranh giới 21 Khu phố</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={layerConfig.show_administrative_offices}
                      onChange={(e) => setLayerConfig({ ...layerConfig, show_administrative_offices: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold">🏛 Cơ quan Đảng - UBND</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={layerConfig.show_mttq_organizations}
                      onChange={(e) => setLayerConfig({ ...layerConfig, show_mttq_organizations: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold">👥 MTTQ &amp; Đoàn thể</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={layerConfig.show_welfare_points}
                      onChange={(e) => setLayerConfig({ ...layerConfig, show_welfare_points: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold">❤️ Điểm An sinh Xã hội</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={layerConfig.show_medical_facilities}
                      onChange={(e) => setLayerConfig({ ...layerConfig, show_medical_facilities: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold">🏥 Trạm Y tế &amp; Cơ sở y tế</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={layerConfig.show_education_schools}
                      onChange={(e) => setLayerConfig({ ...layerConfig, show_education_schools: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold">🏫 Trường học &amp; Giáo dục</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={layerConfig.show_community_centers}
                      onChange={(e) => setLayerConfig({ ...layerConfig, show_community_centers: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold">🏠 Trụ sở Ban CTMT KP</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={layerConfig.show_religious_sites}
                      onChange={(e) => setLayerConfig({ ...layerConfig, show_religious_sites: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold">⛪️ Cơ sở Tôn giáo</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* III. MAIN MAP STAGE & HORIZONTAL REEL CARDS LAYOUT                         */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Full-width Map Stage Container */}
        <div className="w-full h-[620px] sm:h-[680px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative bg-slate-100">
          <InteractiveGoogleMap
            locations={filteredLocations}
            neighborhoods={neighborhoods}
            categories={categories}
            activeLocation={activeLocation}
            activeNeighborhood={activeNeighborhood}
            layerConfig={layerConfig}
            userCoords={userCoords}
            onSelectLocation={(loc) => {
              setActiveLocation(loc);
              if (onSelectLocation) onSelectLocation(loc);
            }}
            onOpenDetailModal={(loc) => {
              setActiveLocation(loc);
              setShowDetailModal(true);
            }}
            onSelectNeighborhood={(nh) => {
              setSelectedNeighborhoodId(nh.id);
              setActiveNeighborhood(nh);
              if (onSelectNeighborhood) onSelectNeighborhood(nh);
            }}
            onOpenNeighborhoodModal={(nh) => {
              setSelectedNeighborhoodId(nh.id);
              setActiveNeighborhood(nh);
              setShowNeighborhoodModal(true);
            }}
          />
        </div>

        {/* Horizontal Scrollable Reel Section Below Map */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Danh sách Địa điểm trên Địa bàn ({filteredLocations.length})
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {searchQuery || selectedCategory !== 'ALL' || selectedNeighborhoodId !== 'ALL' ? (
                <button
                  onClick={handleResetView}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer mr-1 hidden sm:inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa lọc</span>
                </button>
              ) : null}

              {isAdmin && (
                <button
                  onClick={handleOpenCreateForm}
                  className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 mr-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm mới</span>
                </button>
              )}

              <button
                onClick={scrollLocationsLeft}
                className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="Cuộn sang trái"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollLocationsRight}
                className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="Cuộn sang phải"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Reel Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3.5 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x scrollbar-thin"
          >
            {filteredLocations.length === 0 ? (
              <div className="w-full bg-slate-50 rounded-2xl p-6 text-center border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-700">Không tìm thấy địa điểm phù hợp</p>
                <button
                  onClick={handleResetView}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
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
                    id={`loc-card-${loc.id}`}
                    whileHover={{ y: -2 }}
                    onClick={() => {
                      setActiveLocation(loc);
                      setMapCenter({ lat: loc.latitude, lng: loc.longitude });
                      if (onSelectLocation) onSelectLocation(loc);
                    }}
                    className={`w-[280px] sm:w-[320px] shrink-0 snap-start p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          cat?.bgBadgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                        } ${cat?.textBadgeColor || ''}`}>
                          {cat?.name?.split('&')[0]?.trim() || 'Cơ sở'}
                        </span>

                        <div className="flex items-center gap-1 ml-auto">
                          {loc.status === 'HIDDEN' && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                              Tạm ẩn
                            </span>
                          )}

                          {loc.neighborhood_name && (
                            <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                              {loc.neighborhood_name}
                            </span>
                          )}

                          {loc.distance_in_meters !== undefined && (
                            <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                              {formatDistance(loc.distance_in_meters)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 shrink-0 flex items-center justify-center p-1 text-blue-700 mt-0.5">
                          {renderCategoryIcon(loc.category_code, 'w-4 h-4 text-blue-700')}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                            {loc.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            📍 {loc.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer buttons & Admin controls */}
                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      {loc.phone ? (
                        <a
                          href={`tel:${loc.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-600 font-medium hover:text-blue-700 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-blue-600" />
                          <span>{loc.phone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Chưa có SĐT</span>
                      )}

                      <div className="flex items-center gap-1 ml-auto">
                        {/* Admin quick edit buttons */}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditForm(loc);
                            }}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold transition-colors cursor-pointer"
                            title="Sửa địa điểm"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDeleteLocation(loc);
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold transition-colors cursor-pointer"
                            title="Xóa địa điểm"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}

                        <a
                          href={generateGoogleMapsDirectionsUrl(loc.latitude, loc.longitude)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold transition-colors inline-flex items-center gap-0.5"
                          title="Mở chỉ đường Google Maps"
                        >
                          <Navigation className="w-2.5 h-2.5" />
                          <span>Chỉ đường</span>
                        </a>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLocation(loc);
                            setShowDetailModal(true);
                          }}
                          className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold transition-colors inline-flex items-center gap-0.5"
                        >
                          <span>Chi tiết</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* IV. LOCATION DETAIL MODAL POPUP                                           */}
      {/* ========================================================================= */}
      {showDetailModal && activeLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-blue-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  {renderCategoryIcon(activeLocation.category_code, 'w-5 h-5 text-white')}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-200">
                    {activeLocation.neighborhood_name || 'Phường Chánh Hiệp'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black leading-snug">
                    {activeLocation.name}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenEditForm(activeLocation);
                    }}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Sửa địa điểm này"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Sửa</span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      confirmDeleteLocation(activeLocation);
                    }}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Xóa địa điểm này"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                )}

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={activeLocation.image_url || ARTICLE_BANNERS.default}
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
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
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
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-slate-500 font-medium">Bản đồ số MTTQ Phường Chánh Hiệp</span>
              <div className="flex items-center gap-2">
                {activeLocation.phone ? (
                  <a
                    href={`tel:${activeLocation.phone}`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Liên hệ ngay ({activeLocation.phone})</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="px-3 py-2 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Liên hệ (Chưa có SĐT)</span>
                  </button>
                )}

                <a
                  href={activeLocation.directions_url || generateGoogleMapsDirectionsUrl(activeLocation.latitude, activeLocation.longitude)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Chỉ đường</span>
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
            <div className="bg-gradient-to-r from-blue-800 to-sky-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Home className="w-5 h-5 text-sky-200" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black">
                    Danh Sách 21 Khu Phố - Phường Chánh Hiệp
                  </h3>
                  <p className="text-xs text-sky-100">Mạng lưới cán bộ cơ sở &amp; thiết chế văn hóa địa bàn</p>
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
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
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

      {/* ========================================================================= */}
      {/* VI. ADMIN LOCATION MANAGEMENT LIST MODAL (BAN QUẢN TRỊ)                  */}
      {/* ========================================================================= */}
      {showAdminListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black">
                      Quản Lý Địa Điểm Bản Đồ Số GIS
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                      Ban Quản Trị
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Thêm mới, cập nhật thông tin, thay đổi trạng thái và xóa địa điểm 21 Khu phố</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenCreateForm}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Địa Điểm Mới</span>
                </button>

                <button
                  onClick={handleResetLocations}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Khôi phục dữ liệu mẫu ban đầu"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowAdminListModal(false)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên địa điểm hoặc địa chỉ..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={adminNeighborhoodFilter}
                  onChange={(e) => setAdminNeighborhoodFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="ALL">Tất cả 21 Khu phố</option>
                  {neighborhoods.map((nh) => (
                    <option key={nh.id} value={nh.id}>
                      {nh.code} - {nh.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={adminCategoryFilter}
                  onChange={(e) => setAdminCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="ALL">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={adminStatusFilter}
                  onChange={(e) => setAdminStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="ACTIVE">Hiển thị (Active)</option>
                  <option value="HIDDEN">Tạm ẩn (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Admin Table Body */}
            <div className="p-4 overflow-y-auto space-y-2 bg-slate-100 flex-1">
              {adminFilteredLocations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">Không tìm thấy địa điểm nào phù hợp với bộ lọc.</p>
                  <button
                    onClick={() => {
                      setAdminSearchQuery('');
                      setAdminNeighborhoodFilter('ALL');
                      setAdminCategoryFilter('ALL');
                      setAdminStatusFilter('ALL');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                    <div className="col-span-4">Tên Địa Điểm / Địa Chỉ</div>
                    <div className="col-span-3">Khu Phố &amp; Danh Mục</div>
                    <div className="col-span-2">Tọa Độ GPS &amp; SĐT</div>
                    <div className="col-span-1 text-center">Trạng Thái</div>
                    <div className="col-span-2 text-right">Thao Tác</div>
                  </div>

                  {adminFilteredLocations.map((loc) => {
                    const cat = categories.find(c => c.id === loc.category_id || c.code === loc.category_code);
                    const isHidden = loc.status === 'HIDDEN';

                    return (
                      <div
                        key={loc.id}
                        className={`p-3 sm:p-4 rounded-2xl border transition-all flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:items-center ${
                          isHidden
                            ? 'bg-slate-50 border-slate-300 opacity-75'
                            : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'
                        }`}
                      >
                        {/* Name & Address */}
                        <div className="sm:col-span-4 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                              {loc.name}
                            </span>
                            {loc.is_featured && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                                Trọng điểm
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">📍 {loc.address}</p>
                        </div>

                        {/* Neighborhood & Category */}
                        <div className="sm:col-span-3 flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                            {loc.neighborhood_code || 'KP'} - {loc.neighborhood_name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${cat?.bgBadgeColor || 'bg-slate-100'} ${cat?.textBadgeColor || 'text-slate-700'}`}>
                            {cat?.name}
                          </span>
                        </div>

                        {/* Coordinates & Phone */}
                        <div className="sm:col-span-2 text-[11px] space-y-0.5 text-slate-600">
                          <div>SĐT: <strong>{loc.phone || 'N/A'}</strong></div>
                          <div className="text-[10px] text-slate-400">GPS: {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}</div>
                        </div>

                        {/* Status Badge */}
                        <div className="sm:col-span-1 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isHidden
                              ? 'bg-slate-200 text-slate-700 border border-slate-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {isHidden ? 'Tạm ẩn' : 'Hiển thị'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="sm:col-span-2 flex items-center justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <button
                            onClick={() => handleToggleStatus(loc.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isHidden
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                            title={isHidden ? 'Hiện địa điểm này' : 'Tạm ẩn địa điểm'}
                          >
                            {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleOpenEditForm(loc)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                            title="Sửa chi tiết địa điểm"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => confirmDeleteLocation(loc)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                            title="Xóa vĩnh viễn địa điểm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-500 font-medium">
                Tổng số: <strong>{locations.length}</strong> địa điểm ({activeCount} công khai, {hiddenCount} tạm ẩn)
              </div>
              <button
                onClick={() => setShowAdminListModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VII. LOCATION ADD/EDIT FORM MODAL                                         */}
      {/* ========================================================================= */}
      {showFormModal && editingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-sky-800 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black">
                    {editingLocation.id ? 'Chỉnh Sửa Địa Điểm' : 'Thêm Địa Điểm Mới Trên Bản Đồ'}
                  </h3>
                  <p className="text-xs text-sky-100">Cập nhật thông tin địa lý GIS 21 Khu phố Phường Chánh Hiệp</p>
                </div>
              </div>

              <button
                onClick={() => setShowFormModal(false)}
                className="p-2 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveLocation} className="p-6 overflow-y-auto space-y-4 bg-slate-50 flex-1">
              {/* Row 1: Name & Featured Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Tên địa điểm <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingLocation.name || ''}
                  onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                  placeholder="Ví dụ: Trạm Y tế Phường Chánh Hiệp / Bếp ăn từ thiện KP-03"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Row 2: Neighborhood & Category Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800">
                    Khu phố (Thuộc 1 trong 21 KP) <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={editingLocation.neighborhood_id || ''}
                    onChange={(e) => {
                      const nh = neighborhoods.find(n => n.id === e.target.value);
                      if (nh) {
                        setEditingLocation({
                          ...editingLocation,
                          neighborhood_id: nh.id,
                          neighborhood_name: nh.name,
                          neighborhood_code: nh.code,
                          latitude: editingLocation.latitude || nh.center_lat,
                          longitude: editingLocation.longitude || nh.center_lng
                        });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  >
                    {neighborhoods.map((nh) => (
                      <option key={nh.id} value={nh.id}>
                        {nh.code} - {nh.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800">
                    Danh mục địa điểm <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={editingLocation.category_id || ''}
                    onChange={(e) => {
                      const cat = categories.find(c => c.id === e.target.value);
                      if (cat) {
                        setEditingLocation({
                          ...editingLocation,
                          category_id: cat.id,
                          category_code: cat.code
                        });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  Địa chỉ chi tiết địa bàn
                </label>
                <input
                  type="text"
                  value={editingLocation.address || ''}
                  onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })}
                  placeholder="Ví dụ: Đường Nguyễn Văn Tiết, KP-02, Phường Chánh Hiệp"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden"
                />
              </div>

              {/* Row 4: Coordinates GPS WGS84 */}
              <div className="space-y-2 p-3.5 bg-white rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue-600" />
                    Tọa độ không gian GPS (WGS84)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const nh = neighborhoods.find(n => n.id === editingLocation.neighborhood_id);
                        if (nh) {
                          setEditingLocation({
                            ...editingLocation,
                            latitude: nh.center_lat,
                            longitude: nh.center_lng
                          });
                        }
                      }}
                      className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold hover:bg-blue-100"
                    >
                      📍 Tọa độ khu phố
                    </button>

                    {userCoords && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLocation({
                            ...editingLocation,
                            latitude: userCoords.latitude,
                            longitude: userCoords.longitude
                          });
                        }}
                        className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold hover:bg-emerald-100"
                      >
                        🎯 Tọa độ vị trí tôi
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Vĩ độ (Latitude)</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      value={editingLocation.latitude ?? 11.015}
                      onChange={(e) => setEditingLocation({ ...editingLocation, latitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Kinh độ (Longitude)</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      value={editingLocation.longitude ?? 106.652}
                      onChange={(e) => setEditingLocation({ ...editingLocation, longitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Contact details (Phone, Opening Hours, Image URL) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    value={editingLocation.phone || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, phone: e.target.value })}
                    placeholder="0274..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Giờ làm việc / Mở cửa</label>
                  <input
                    type="text"
                    value={editingLocation.opening_hours || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, opening_hours: e.target.value })}
                    placeholder="7:30 - 17:00..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Hình ảnh URL</label>
                  <input
                    type="text"
                    value={editingLocation.image_url || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, image_url: e.target.value })}
                    placeholder="Dán đường dẫn ảnh hoặc SVG banner..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Row 6: Welfare Type & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phân loại An sinh Xã hội</label>
                  <select
                    value={editingLocation.welfare_type || 'NONE'}
                    onChange={(e) => setEditingLocation({ ...editingLocation, welfare_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="NONE">Không áp dụng (Thông thường)</option>
                    <option value="COMMUNITY_KITCHEN">Bếp ăn Từ thiện / Miễn phí</option>
                    <option value="EMERGENCY_AID">Điểm Cứu trợ Khẩn cấp</option>
                    <option value="GIFT_DISTRIBUTION">Điểm Phát Quà An sinh</option>
                    <option value="RECEIVING_POINT">Điểm Tiếp Nhận Hàng Cứu Trợ</option>
                    <option value="FREE_CLINIC">Điểm Khám Bệnh Thuốc Miễn Phí</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Trạng thái hiển thị</label>
                  <select
                    value={editingLocation.status || 'ACTIVE'}
                    onChange={(e) => setEditingLocation({ ...editingLocation, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="ACTIVE">ACTIVE - Hiển thị Công khai</option>
                    <option value="HIDDEN">HIDDEN - Tạm ẩn (Nội bộ BQT)</option>
                  </select>
                </div>
              </div>

              {/* Row 7: Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={!!editingLocation.is_featured}
                    onChange={(e) => setEditingLocation({ ...editingLocation, is_featured: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Đánh dấu là Địa điểm Trọng điểm (Nổi bật)</span>
                </label>
              </div>

              {/* Row 8: Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800">Mô tả giới thiệu &amp; Tiện ích địa điểm</label>
                <textarea
                  rows={3}
                  value={editingLocation.description || ''}
                  onChange={(e) => setEditingLocation({ ...editingLocation, description: e.target.value })}
                  placeholder="Nhập chức năng nhiệm vụ, thiết chế văn hóa, thông tin liên hệ cán bộ phụ trách..."
                  className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden"
                />
              </div>

              {/* Submit / Cancel Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingLocation.id ? 'Cập Nhật Địa Điểm' : 'Tạo Địa Điểm Mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIII. DELETE CONFIRMATION MODAL                                           */}
      {/* ========================================================================= */}
      {showDeleteConfirmModal && deletingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">Xác Nhận Xóa Địa Điểm?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa vĩnh viễn địa điểm <strong className="text-slate-900">"{deletingLocation.name}"</strong> thuộc {deletingLocation.neighborhood_name}?
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-1">
              <div>📍 Địa chỉ: {deletingLocation.address}</div>
              <div>📍 Tọa độ: {deletingLocation.latitude}, {deletingLocation.longitude}</div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Hủy thao tác
              </button>
              <button
                onClick={handleExecuteDelete}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
