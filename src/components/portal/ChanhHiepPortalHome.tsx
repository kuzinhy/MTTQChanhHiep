import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  Megaphone, 
  UserCheck, 
  BarChart3, 
  Monitor, 
  Calendar, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  MapPin, 
  Plus, 
  Minus, 
  Building2, 
  HeartHandshake, 
  Sparkles,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Users,
  Compass,
  Award
} from 'lucide-react';
import { sortArticlesNewestFirst } from '../../lib/dateUtils';
import { motion, AnimatePresence } from 'motion/react';
import { Article, OfficialDocument, PublicOpinion, CloudinaryImageMeta, StaffUser } from '../../types';
import { INITIAL_ARTICLES } from '../../data/seedData';
import { AppStorageEngine } from '../../lib/storage';
import { MapLocation } from '../../data/mapSchema';
import { DigitalCommunityMap } from '../map/DigitalCommunityMap';
import { CitizenPublicServiceGuide } from './CitizenPublicServiceGuide';
import { CitizenOpinionTrackerModal } from './CitizenOpinionTrackerModal';
import { CitizenWelfareHubModal } from './CitizenWelfareHubModal';

const getImageUrl = (image?: string | CloudinaryImageMeta): string => {
  if (!image) return 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80';
  if (typeof image === 'string') return image;
  return image.secureUrl || image.url || 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80';
};

interface ChanhHiepPortalHomeProps {
  articles: Article[];
  documents?: OfficialDocument[];
  opinions?: PublicOpinion[];
  onSelectArticle: (article: Article) => void;
  onSelectTab: (tab: string) => void;
  onOpenHcmSpaceModal: () => void;
  onOpenVolunteerModal: () => void;
  onOpenDirectory?: () => void;
  onGoToOffice: (view?: any) => void;
  currentStaffUser?: StaffUser | null;
}

export const ChanhHiepPortalHome: React.FC<ChanhHiepPortalHomeProps> = ({
  articles = [],
  documents = [],
  opinions = [],
  onSelectArticle,
  onSelectTab,
  onOpenHcmSpaceModal,
  onOpenVolunteerModal,
  onOpenDirectory,
  onGoToOffice,
  currentStaffUser
}) => {
  // Safe articles fallback
  const safeArticles: Article[] = useMemo(() => {
    const cloudList = Array.isArray(articles) ? articles : [];
    const cloudIds = new Set(cloudList.map(a => a.id).filter(Boolean));
    
    // Combine lists, preferring cloud versions if IDs overlap (though unlikely)
    const combined = [
      ...cloudList,
      ...INITIAL_ARTICLES.filter(a => a && a.id && !cloudIds.has(a.id))
    ];

    // Public portal should show Published & Approved articles
    const filtered = combined.filter(a => 
      (a.status && (a.status.toLowerCase() === 'published' || a.status.toLowerCase() === 'approved')) || 
      !a.status
    );
    
    return sortArticlesNewestFirst(filtered);
  }, [articles]);

  // Featured hero article index
  const [heroIndex, setHeroIndex] = useState(0);
  const featuredArticles = safeArticles.slice(0, 4);
  const currentHero = featuredArticles[heroIndex] || safeArticles[0];

  // Right sidebar 3 articles
  const sideArticles = safeArticles.slice(1, 4);

  // Map state
  const [locations, setLocations] = useState<MapLocation[]>(() => AppStorageEngine.getMapLocations());

  React.useEffect(() => {
    const handleSync = () => {
      setLocations(AppStorageEngine.getMapLocations());
    };
    window.addEventListener('app_storage_synced', handleSync);
    return () => {
      window.removeEventListener('app_storage_synced', handleSync);
    };
  }, []);

  const homeFeaturedLocations = useMemo(() => {
    return locations.filter(
      loc => loc.status === 'ACTIVE' && (loc.is_featured || ['DIA_CHI_DO', 'LANG_NGHE', 'CO_QUAN', 'Y_TE'].includes(loc.category_code))
    ).slice(0, 6);
  }, [locations]);

  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(null);

  React.useEffect(() => {
    if (homeFeaturedLocations.length > 0 && !selectedLandmarkId) {
      setSelectedLandmarkId(homeFeaturedLocations[0].id);
    }
  }, [homeFeaturedLocations, selectedLandmarkId]);

  // Local News filter & pagination state
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>('ALL');
  const [newsSearchTerm, setNewsSearchTerm] = useState<string>('');
  const [visibleNewsCount, setVisibleNewsCount] = useState<number>(6);

  // Citizen Hub Modals State (Trụ cột 1)
  const [isOpinionTrackerOpen, setIsOpinionTrackerOpen] = useState(false);
  const [isWelfareHubOpen, setIsWelfareHubOpen] = useState(false);
  const [welfareHubDefaultTab, setWelfareHubDefaultTab] = useState<'sos_aid' | 'donation' | 'solidarity_handbook'>('sos_aid');

  const openWelfareModal = (tab: 'sos_aid' | 'donation' | 'solidarity_handbook') => {
    setWelfareHubDefaultTab(tab);
    setIsWelfareHubOpen(true);
  };

  const newsCategories = [
    { id: 'ALL', label: 'Tất cả tin tức' },
    { id: 'Hoạt động Mặt trận', label: 'Hoạt động Mặt trận' },
    { id: 'An sinh xã hội', label: 'An sinh xã hội' },
    { id: 'Tuyên truyền', label: 'Tuyên truyền & Pháp luật' },
    { id: 'Chuyển đổi số', label: 'Chuyển đổi số' },
  ];

  const filteredLocalNews = useMemo(() => {
    return safeArticles.filter(art => {
      const matchCat = selectedNewsCategory === 'ALL' || art.category === selectedNewsCategory;
      const matchSearch = !newsSearchTerm.trim() || 
        art.title.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
        art.summary?.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
        art.tags?.some(t => t.toLowerCase().includes(newsSearchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [safeArticles, selectedNewsCategory, newsSearchTerm]);

  const handleNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % featuredArticles.length);
  };

  const handlePrevHero = () => {
    setHeroIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">

      {/* ========================================================================= */}
      {/* 1. TIỆN ÍCH SỐ - Quick Services Grid */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        {/* Section Header */}
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-[#0068ff] rounded-xs shrink-0" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Tiện ích số
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Kết nối - Minh bạch - Phục vụ nhân dân
          </span>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Card 1: Không gian Văn hóa Hồ Chí Minh */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenHcmSpaceModal}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform overflow-hidden p-0.5">
              <img
                src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907027/701895118_122094685251337068_1425314572080698202_n.jpg"
                alt="Logo Không gian Văn hóa Hồ Chí Minh"
                className="w-full h-full object-cover object-center rounded-lg"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                Không gian Văn hóa Hồ Chí Minh
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                Bảo tàng ảo 3D, tư liệu, học tập và lan tỏa giá trị tốt đẹp
              </p>
            </div>
          </motion.div>

          {/* Card 2: Kho văn bản Mặt trận */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTab('documents')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0068ff] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-[#0068ff] transition-colors leading-snug">
                Kho văn bản Mặt trận
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                Tra cứu văn bản, kế hoạch, hướng dẫn, biểu mẫu
              </p>
            </div>
          </motion.div>

          {/* Card 3: Phản ánh - kiến nghị */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTab('opinion')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                Phản ánh – kiến nghị
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                Gửi ý kiến, phản ánh đến Ủy ban MTTQ
              </p>
            </div>
          </motion.div>

          {/* Card 4: Đăng ký tình nguyện viên */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenVolunteerModal}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                Đăng ký tình nguyện viên
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                Tham gia các hoạt động vì cộng đồng
              </p>
            </div>
          </motion.div>

          {/* Card 5: Khảo sát ý kiến */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTab('surveys')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-purple-600 transition-colors leading-snug">
                Khảo sát ý kiến
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                Tham gia khảo sát, đóng góp ý kiến xây dựng địa phương
              </p>
            </div>
          </motion.div>

          {/* Card 6: Văn phòng số */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoToOffice}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                Văn phòng số
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                Hệ thống điều hành, quản lý công việc nội bộ
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HERO FEATURED CAROUSEL + 3 RIGHT NEWS */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left Side: Big Hero Carousel (Col 1-8 / 65%) */}
        <div className="lg:col-span-8 relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-md border border-slate-200/80 group flex flex-col justify-end min-h-[360px] sm:min-h-[420px]">
          
          {/* Top Red Slogan Ribbon */}
          <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-amber-200 text-center py-2 px-4 shadow-sm border-b border-amber-400/30">
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider drop-shadow-xs">
              ĐẢNG CỘNG SẢN VIỆT NAM QUANG VINH MUÔN NĂM!
            </p>
          </div>

          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={getImageUrl(currentHero.featuredImage)}
              alt={currentHero.title}
              className="w-full h-full object-cover object-top sm:object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Low-profile Soft Bottom Gradient Overlay - only bottom 30-35% to keep original photo clear and bright */}
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
          </div>

          {/* Left / Right Nav Arrows */}
          <button
            onClick={handlePrevHero}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-xs flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
            aria-label="Tin trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextHero}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-xs flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
            aria-label="Tin sau"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Article Content Info - Compact & Low to prevent covering subject */}
          <div className="relative z-20 p-3 sm:p-4.5 space-y-1.5 text-white">
            {/* Tag Badge & Dots row */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wide shadow-xs">
                {currentHero.category || 'Hoạt động Mặt trận'}
              </span>

              {/* Compact Pagination Dots */}
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
                {featuredArticles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === heroIndex ? 'w-4 bg-white shadow-2xs' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Chuyển tin ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Title - Compact leading, drop shadow for readability on bright photos */}
            <h3 
              onClick={() => onSelectArticle(currentHero)}
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}
              className="text-xs sm:text-sm md:text-base font-black text-white leading-snug cursor-pointer hover:text-amber-200 transition-colors line-clamp-2"
            >
              {currentHero.title}
            </h3>

            {/* Bottom Meta & Action */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-200 font-medium">
                <span className="flex items-center gap-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  {currentHero.publishDate ? new Date(currentHero.publishDate).toLocaleDateString('vi-VN') : '04/09/2026'}
                </span>
                <span className="flex items-center gap-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  {(currentHero.views || 1256).toLocaleString('vi-VN')} lượt xem
                </span>
              </div>

              <button
                onClick={() => onSelectArticle(currentHero)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white hover:bg-slate-100 text-slate-900 text-[11px] sm:text-xs font-bold rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: 3 Stacked Articles (Col 9-12 / 35%) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-2.5">
          {sideArticles.map((art, idx) => {
            const badgeBg = 
              art.category === 'An sinh xã hội' ? 'bg-rose-100 text-rose-700' :
              art.category === 'Tuyên truyền' ? 'bg-orange-100 text-orange-700' :
              'bg-blue-100 text-blue-700';

            return (
              <motion.div
                key={art.id || idx}
                whileHover={{ y: -1 }}
                onClick={() => onSelectArticle(art)}
                className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex items-center gap-3 group flex-1"
              >
                {/* Thumbnail */}
                <div className="w-24 h-20 sm:w-28 sm:h-22 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                  <img
                    src={getImageUrl(art.featuredImage)}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide ${badgeBg}`}>
                      {art.category || 'Hoạt động Mặt trận'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#0068ff] transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {art.publishDate ? new Date(art.publishDate).toLocaleDateString('vi-VN') : '28/08/2026'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" />
                      {art.views || 520}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. MẶT TRẬN SỐ HÔM NAY - Metrics Dashboard */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-[#0068ff] rounded-xs shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Mặt trận số hôm nay
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Những con số thể hiện nỗ lực vì cộng đồng
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Cập nhật: {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
          </div>
        </div>

        {/* 6 Metric Cards - Khởi tạo làm mới bắt đầu chu kỳ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Metric 1: Hoạt động tháng */}
          <div 
            onClick={() => onSelectTab('activities')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between transition-all duration-300 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-[#0068ff]">0</span>
                <span className="text-[10px] font-bold text-slate-400">Kỳ mới</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">Hoạt động tháng</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0068ff] flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>

          {/* Metric 2: Tin tức mới */}
          <div 
            onClick={() => onSelectTab('news')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between transition-all duration-300 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-rose-600">0</span>
                <span className="text-[10px] font-bold text-slate-400">Kỳ mới</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">Tin tức mới</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          {/* Metric 3: Hồ sơ an sinh */}
          <div 
            onClick={() => onSelectTab('social_welfare')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between transition-all duration-300 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-emerald-600">0</span>
                <span className="text-[10px] font-bold text-slate-400">Kỳ mới</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">Hồ sơ an sinh</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Metric 4: Dân nguyện tiếp nhận */}
          <div 
            onClick={() => onSelectTab('opinions')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between transition-all duration-300 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-orange-500">
                  {opinions && opinions.length > 0 ? opinions.length : 0}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {opinions && opinions.length > 0 ? `+${opinions.length}` : 'Kỳ mới'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">Dân nguyện tiếp nhận</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
          </div>

          {/* Metric 5: Đã xử lý */}
          <div 
            onClick={() => onSelectTab('opinions')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between transition-all duration-300 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-purple-600">
                  {opinions && opinions.length > 0 ? opinions.filter(o => o.status === 'RESOLVED' || o.status === 'CLOSED').length : 0}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {opinions && opinions.length > 0 ? 'Trực tiếp' : 'Kỳ mới'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">Đã xử lý</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Metric 6: Tình nguyện viên */}
          <div 
            onClick={() => onOpenVolunteerModal()}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between transition-all duration-300 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-sky-600">
                  {AppStorageEngine.getVolunteers?.()?.length || 0}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {AppStorageEngine.getVolunteers?.()?.length ? `+${AppStorageEngine.getVolunteers().length}` : 'Kỳ mới'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">Tình nguyện viên</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3.5. CỔNG DỊCH VỤ CÔNG DÂN & AN SINH SỐ (TRỤ CỘT 1)                         */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 rounded-xs shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">
              Cổng Dịch Vụ Công Dân &amp; An Sinh Số
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-black uppercase">
              Trụ cột 1
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Phục vụ nhân dân 21 Khu phố Phường Chánh Hiệp</span>
        </div>

        {/* 4 Primary Interactive Citizen Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Card 1: Tra cứu Dân nguyện Realtime - Tech Blue / Cyan Glow */}
          <div
            onClick={() => setIsOpinionTrackerOpen(true)}
            className="group bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-700 text-white p-5 rounded-3xl border border-sky-300/40 shadow-lg shadow-blue-500/20 hover:shadow-2xl hover:shadow-sky-500/30 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/25 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:12px_12px] opacity-60 pointer-events-none" />
            
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5 text-white drop-shadow-xs" />
                </div>
                <span className="text-[10px] font-black bg-white/25 text-white px-2.5 py-1 rounded-full border border-white/40 backdrop-blur-md tracking-wider shadow-xs">
                  REALTIME
                </span>
              </div>
              <div>
                <h3 className="text-sm font-black text-white group-hover:text-cyan-100 transition-colors tracking-tight">
                  Tra Cứu Tiến Độ Dân Nguyện
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed font-medium mt-1">
                  Nhập mã hồ sơ / SĐT để theo dõi quy trình xử lý 4 bước và đánh giá mức độ hài lòng.
                </p>
              </div>
            </div>
            <div className="pt-3.5 mt-3 border-t border-white/25 flex items-center justify-between text-xs font-black text-white relative z-10">
              <span className="group-hover:translate-x-0.5 transition-transform">Tra cứu ngay</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: SOS Cứu trợ khẩn cấp - Bright Crimson / Vibrant Coral */}
          <div
            onClick={() => openWelfareModal('sos_aid')}
            className="group bg-gradient-to-br from-rose-500 via-red-500 to-amber-600 text-white p-5 rounded-3xl border border-rose-300/40 shadow-lg shadow-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/30 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/25 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:12px_12px] opacity-60 pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner group-hover:scale-105 transition-transform">
                  <HeartHandshake className="w-5 h-5 text-white drop-shadow-xs" />
                </div>
                <span className="text-[10px] font-black bg-white/25 text-white px-2.5 py-1 rounded-full border border-white/40 backdrop-blur-md tracking-wider shadow-xs animate-pulse">
                  SOS 24/7
                </span>
              </div>
              <div>
                <h3 className="text-sm font-black text-white group-hover:text-amber-100 transition-colors tracking-tight">
                  Cứu Trợ An Sinh Khẩn Cấp
                </h3>
                <p className="text-xs text-rose-100 leading-relaxed font-medium mt-1">
                  Gửi yêu cầu trợ cấp gạo, viện phí, học bổng hoặc sửa chữa nhà Đại đoàn kết 21 khu phố.
                </p>
              </div>
            </div>
            <div className="pt-3.5 mt-3 border-t border-white/25 flex items-center justify-between text-xs font-black text-white relative z-10">
              <span className="group-hover:translate-x-0.5 transition-transform">Gửi yêu cầu trợ giúp</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-rose-600 transition-all">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 3: Ủng hộ Quỹ & Tấm Lòng Vàng - Tech Amber / Golden Orange */}
          <div
            onClick={() => openWelfareModal('donation')}
            className="group bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 text-white p-5 rounded-3xl border border-amber-300/40 shadow-lg shadow-orange-500/20 hover:shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/25 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:12px_12px] opacity-60 pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5 text-white drop-shadow-xs" />
                </div>
                <span className="text-[10px] font-black bg-white/25 text-white px-2.5 py-1 rounded-full border border-white/40 backdrop-blur-md tracking-wider shadow-xs">
                  VIETQR
                </span>
              </div>
              <div>
                <h3 className="text-sm font-black text-white group-hover:text-yellow-100 transition-colors tracking-tight">
                  Ủng Hộ Quỹ &amp; Tấm Lòng Vàng
                </h3>
                <p className="text-xs text-amber-100 leading-relaxed font-medium mt-1">
                  Chuyển khoản VietQR tự động và nhận ngay Giấy chứng nhận Tấm Lòng Vàng Số có mộc MTTQ.
                </p>
              </div>
            </div>
            <div className="pt-3.5 mt-3 border-t border-white/25 flex items-center justify-between text-xs font-black text-white relative z-10">
              <span className="group-hover:translate-x-0.5 transition-transform">Đóng góp &amp; Nhận chứng nhận</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-amber-600 transition-all">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 4: Sổ tay Gia đình Đại đoàn kết - Bright Emerald / Cyber Teal */}
          <div
            onClick={() => openWelfareModal('solidarity_handbook')}
            className="group bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white p-5 rounded-3xl border border-emerald-300/40 shadow-lg shadow-emerald-500/20 hover:shadow-2xl hover:shadow-teal-500/30 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/25 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:12px_12px] opacity-60 pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-white drop-shadow-xs" />
                </div>
                <span className="text-[10px] font-black bg-white/25 text-white px-2.5 py-1 rounded-full border border-white/40 backdrop-blur-md tracking-wider shadow-xs">
                  10 TIÊU CHÍ
                </span>
              </div>
              <div>
                <h3 className="text-sm font-black text-white group-hover:text-emerald-100 transition-colors tracking-tight">
                  Gia Đình Đại Đoàn Kết
                </h3>
                <p className="text-xs text-emerald-100 leading-relaxed font-medium mt-1">
                  Bảng tự đánh giá 10 tiêu chí văn hóa trực tuyến /100 điểm gửi Ban CTMT 21 Khu phố.
                </p>
              </div>
            </div>
            <div className="pt-3.5 mt-3 border-t border-white/25 flex items-center justify-between text-xs font-black text-white relative z-10">
              <span className="group-hover:translate-x-0.5 transition-transform">Tự chấm điểm online</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-all">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TIN TỨC ĐỊA PHƯƠNG - Expanded Rich Multi-Column News Hub */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#0068ff] rounded-xs shrink-0" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Tin tức địa phương
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0068ff] text-[11px] font-bold">
                {filteredLocalNews.length} bài viết
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cập nhật toàn diện các hoạt động Mặt trận, phong trào 21 khu phố, an sinh xã hội & chuyển đổi số
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Search */}
            <div className="relative">
              <input
                type="text"
                value={newsSearchTerm}
                onChange={(e) => setNewsSearchTerm(e.target.value)}
                placeholder="Tìm tin bài..."
                className="pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-36 sm:w-44 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => onSelectTab('news')}
              className="text-xs font-bold text-[#0068ff] hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span>Xem chuyên trang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {newsCategories.map((cat) => {
            const isActive = selectedNewsCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedNewsCategory(cat.id);
                  setVisibleNewsCount(6);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#0068ff] text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* News Grid (Displays up to visibleNewsCount items) */}
        {filteredLocalNews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-2">
            <p className="text-sm font-bold text-slate-600">Không tìm thấy tin bài phù hợp với từ khóa</p>
            <button
              onClick={() => {
                setSelectedNewsCategory('ALL');
                setNewsSearchTerm('');
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocalNews.slice(0, visibleNewsCount).map((art, idx) => {
              const badgeBg = 
                art.category === 'An sinh xã hội' ? 'bg-rose-600 text-white' :
                art.category === 'Tuyên truyền' || art.category === 'Tuyên truyền & Pháp luật' ? 'bg-orange-600 text-white' :
                art.category === 'Chuyển đổi số' ? 'bg-emerald-600 text-white' :
                'bg-[#0068ff] text-white';

              return (
                <div
                  key={art.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all overflow-hidden flex flex-col group"
                >
                  {/* Card Image */}
                  <div 
                    onClick={() => onSelectArticle(art)}
                    className="h-44 sm:h-48 overflow-hidden bg-slate-100 cursor-pointer relative"
                  >
                    <img
                      src={getImageUrl(art.featuredImage)}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide shadow-xs ${badgeBg}`}>
                        {art.category || 'Hoạt động Mặt trận'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <h3
                        onClick={() => onSelectArticle(art)}
                        className="font-bold text-sm text-slate-900 group-hover:text-[#0068ff] transition-colors line-clamp-2 leading-snug cursor-pointer"
                        title={art.title}
                      >
                        {art.title}
                      </h3>

                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {art.publishDate ? new Date(art.publishDate).toLocaleDateString('vi-VN') : '04/09/2026'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          {(art.views || 1256).toLocaleString('vi-VN')}
                        </span>
                        {art.authorName && (
                          <span className="truncate max-w-[110px] text-slate-500 font-medium">
                            ✍️ {art.authorName}
                          </span>
                        )}
                      </div>

                      {/* Excerpt */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {art.summary || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp phối hợp triển khai các hoạt động thiết thực chăm lo đời sống nhân dân...'}
                      </p>
                    </div>

                    {/* Tags & Read more */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      {art.tags && art.tags.length > 0 ? (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[130px]">
                          #{art.tags[0]}
                        </span>
                      ) : <span />}

                      <button
                        onClick={() => onSelectArticle(art)}
                        className="text-xs font-bold text-[#0068ff] hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Đọc tiếp</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More / Expand Controls */}
        {filteredLocalNews.length > visibleNewsCount && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setVisibleNewsCount(prev => prev + 6)}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Xem thêm {filteredLocalNews.length - visibleNewsCount} bài viết khác</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        )}

        {visibleNewsCount > 6 && filteredLocalNews.length <= visibleNewsCount && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setVisibleNewsCount(6)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Thu gọn danh sách
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. BẢN ĐỒ SỐ CHÁNH HIỆP - HỆ THỐNG GIS & 21 KHU PHỐ                        */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <DigitalCommunityMap
          hideHeroBanner={true}
          currentStaffUser={currentStaffUser}
          onSelectLocation={() => {}}
          onSelectNeighborhood={() => {}}
        />
      </section>

      {/* ========================================================================= */}
      {/* 6. CẨM NANG DỊCH VỤ CÔNG, TRA CỨU TIẾN ĐỘ DÂN NGUYỆN & ĐƯỜNG DÂY NÓNG 24/7 */}
      {/* ========================================================================= */}
      <CitizenPublicServiceGuide
        opinions={opinions}
        onSelectTab={onSelectTab}
        onOpenVolunteerModal={onOpenVolunteerModal}
        onOpenDirectory={onOpenDirectory}
      />

      {/* ========================================================================= */}
      {/* MODALS - TRỤ CỘT 1 PHỤC VỤ NHÂN DÂN                                       */}
      {/* ========================================================================= */}
      <CitizenOpinionTrackerModal
        isOpen={isOpinionTrackerOpen}
        onClose={() => setIsOpinionTrackerOpen(false)}
        opinions={opinions}
        onOpenNewOpinionForm={() => onSelectTab('opinion')}
      />

      <CitizenWelfareHubModal
        isOpen={isWelfareHubOpen}
        onClose={() => setIsWelfareHubOpen(false)}
        defaultTab={welfareHubDefaultTab}
      />

    </div>
  );
};
