import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Compass,
  Volume2,
  HeartHandshake,
  ShieldCheck,
  Search,
  ArrowRight,
  Eye,
  Award,
  ExternalLink,
  ChevronRight,
  Clock,
  MapPin,
  FileText,
  Layers,
  CheckCircle2,
  BookmarkCheck,
  Edit3
} from 'lucide-react';
import {
  HISTORICAL_PERIODS,
  HISTORICAL_EVENTS,
  HISTORICAL_WORKS,
  VERIFIED_QUOTES,
  HISTORICAL_AUDIOS,
  FOOTSTEP_LOCATIONS
} from '../../data/hcmVerifiedMuseumData';
import {
  CoverConfig,
  loadStoredCoverConfig,
  saveStoredCoverConfig,
  loadStoredChapters,
  BiographyChapter,
  loadStoredEvents
} from '../../data/hcmGovernanceSchema';
import { DongSonDrumIcon, ChimHacIcon, HoaSenIcon, TraditionalBorderPattern } from './TraditionalMotifs';
import { UniversalHcmEditorModal } from './UniversalHcmEditorModal';

interface HcmMuseumGrandFoyerProps {
  onNavigateTab: (tabId: string) => void;
  onOpenSearch: () => void;
  isResearchMode: boolean;
  onToggleResearchMode: () => void;
  isAdmin?: boolean;
}

export const HcmMuseumGrandFoyer: React.FC<HcmMuseumGrandFoyerProps> = ({
  onNavigateTab,
  onOpenSearch,
  isResearchMode,
  onToggleResearchMode,
  isAdmin = false
}) => {
  const [coverConfig, setCoverConfig] = useState<CoverConfig>(() => loadStoredCoverConfig());
  const [chapters, setChapters] = useState<BiographyChapter[]>(() => loadStoredChapters());
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Sync if updated from admin
    setCoverConfig(loadStoredCoverConfig());
    setChapters(loadStoredChapters());
  }, []);

  const handleSaveCoverConfig = (updated: CoverConfig) => {
    setCoverConfig(updated);
    saveStoredCoverConfig(updated);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Universal Editor Modal for Cover Config */}
      <UniversalHcmEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        itemType="cover"
        itemData={coverConfig}
        onSave={handleSaveCoverConfig}
      />

      {/* ========================================================== */}
      {/* SECTION VII.A: HERO BANNER TRANG BÌA CHÍNH THỨC - TONE HỒNG CÁNH SEN */}
      {/* ========================================================== */}
      <section 
        aria-label="Trang bìa Không gian Văn hóa Hồ Chí Minh" 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white shadow-2xl border-2 border-rose-300/40"
      >
        {/* Họa tiết Trống Đồng & Chim Hạc chìm góc background */}
        <div className="absolute top-0 right-0 p-8 opacity-15 pointer-events-none text-amber-200">
          <DongSonDrumIcon size={320} />
        </div>
        <div className="absolute bottom-2 left-6 opacity-20 pointer-events-none text-amber-100">
          <ChimHacIcon size={140} />
        </div>

        {/* Thanh tiêu đề trang trí hoa văn truyền thống */}
        <div className="px-6 py-2.5 bg-rose-950/40 border-b border-rose-300/30 flex flex-wrap items-center justify-between text-[11px] text-amber-200 gap-2">
          <div className="flex items-center gap-2">
            <HoaSenIcon className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="font-bold tracking-wide uppercase">Cơ quan tham chiếu: {coverConfig.primary_source_agency}</span>
          </div>
          <div className="flex items-center gap-3 text-amber-200">
            <span className="hidden sm:inline font-medium">Trích dẫn chính thức theo nguồn Cổng TTĐT TP.HCM</span>
            <a
              href={coverConfig.primary_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 underline underline-offset-2 transition-colors font-semibold"
            >
              <span>Nguồn gốc</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {/* Direct Admin Edit Button */}
            {isAdmin && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="ml-2 px-2.5 py-1 rounded-lg bg-amber-400 text-rose-950 font-extrabold text-[11px] flex items-center gap-1 hover:bg-amber-300 transition shadow-sm cursor-pointer"
                title="Chỉnh sửa thông tin trang bìa này"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sửa bìa</span>
              </button>
            )}
          </div>
        </div>

        {/* Grand Hero Content */}
        <div className="relative p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 z-10">
          {/* Chân dung Chủ tịch Hồ Chí Minh (Ảnh tư liệu trang trọng) */}
          <div className="flex-shrink-0 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-amber-400 via-rose-300 to-amber-500 shadow-2xl ring-4 ring-rose-300/50">
                <img
                  src={coverConfig.portrait_url}
                  alt={coverConfig.portrait_caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top rounded-full filter contrast-[1.03] transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-3 inset-x-0 mx-auto w-max px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-rose-950 font-black text-xs uppercase tracking-widest shadow-lg border border-amber-200">
                1890 — 1969
              </div>
            </div>
            <p className="text-[11px] text-amber-100 mt-5 max-w-[220px] italic font-medium leading-tight">
              {coverConfig.portrait_caption}
            </p>
          </div>

          {/* Nội dung Giới thiệu & Khối CTA Chuẩn mực */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            {/* Title & Subtitle */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-100 text-xs font-bold tracking-wider uppercase">
                <DongSonDrumIcon className="w-4 h-4 text-amber-300" />
                <span>Không Gian Văn Hóa Số Đảng Bộ & Nhân Dân Phường Chánh Hiệp</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                {coverConfig.title}
              </h1>

              <h2 className="text-sm sm:text-base lg:text-lg font-medium text-amber-200 tracking-wide font-serif">
                “{coverConfig.subtitle}”
              </h2>
            </div>

            {/* Mô tả chuẩn xác theo nguồn chính thống */}
            <p className="text-sm sm:text-base text-rose-50 leading-relaxed font-normal max-w-3xl drop-shadow-xs">
              {coverConfig.description}
            </p>

            {/* 3 NÚT CTA CHÍNH THEO ĐẶC TẢ SECTION VII.A */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {/* CTA 1: Khám phá hành trình */}
              <button
                id="btn-hero-explore"
                onClick={() => onNavigateTab('timeline')}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-rose-950 font-extrabold text-sm hover:brightness-110 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-rose-950" />
                <span>KHÁM PHÁ HÀNH TRÌNH</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* CTA 2: Cuộc đời – Sự nghiệp */}
              <button
                id="btn-hero-biography"
                onClick={() => onNavigateTab('biography')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-900/90 hover:bg-rose-800 text-amber-100 font-bold text-sm transition-all border border-rose-300/50 backdrop-blur-sm active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>CUỘC ĐỜI – SỰ NGHIỆP</span>
              </button>

              {/* CTA 3: Xem dòng thời gian */}
              <button
                id="btn-hero-timeline"
                onClick={() => onNavigateTab('timeline')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-all border border-white/30 backdrop-blur-sm active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>XEM DÒNG THỜI GIAN</span>
              </button>
            </div>

            {/* Các công cụ bổ trợ: Tra cứu & Chế độ Nghiên cứu */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 border-t border-rose-300/30">
              <button
                onClick={onOpenSearch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/60 text-amber-100 text-xs font-semibold border border-rose-300/30 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-amber-300" />
                <span>Tra cứu từ khóa tư liệu</span>
              </button>

              <button
                onClick={() => onNavigateTab('virtual-3d')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/60 text-amber-100 text-xs font-semibold border border-rose-300/30 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span>Không gian triển lãm 3D</span>
              </button>

              <button
                onClick={onToggleResearchMode}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  isResearchMode
                    ? 'bg-amber-300 text-rose-950 border-amber-200 shadow-sm'
                    : 'bg-rose-950/40 text-amber-200 border-rose-300/30 hover:bg-rose-950/60'
                }`}
                title="Bật/Tắt hiển thị chú thích xuất xứ, tập số và mã lưu trữ"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Chế độ Nghiên cứu: {isResearchMode ? 'BẬT' : 'TẮT'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SECTION VII.B: THỐNG KÊ TƯ LIỆU ĐÃ THẨM ĐỊNH - TONE TRUYỀN THỐNG */}
      {/* ========================================================== */}
      <section aria-label="Thống kê dữ liệu đã thẩm định" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => onNavigateTab('timeline')}
          className="p-4 rounded-2xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-xs font-bold">Thời kỳ cách mạng</span>
            <Calendar className="w-4 h-4 text-rose-700 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-rose-950 font-serif">08</div>
          <p className="text-[11px] text-rose-700 mt-1">Từ 1890 đến Di sản</p>
        </div>

        <div
          onClick={() => onNavigateTab('timeline')}
          className="p-4 rounded-2xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-xs font-bold">Sự kiện lịch sử</span>
            <Sparkles className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-rose-950 font-serif">
            {HISTORICAL_EVENTS.length}
          </div>
          <p className="text-[11px] text-rose-700 mt-1">Đã đối chiếu 2 nguồn</p>
        </div>

        <div
          onClick={() => onNavigateTab('works')}
          className="p-4 rounded-2xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-xs font-bold">Tác phẩm kinh điển</span>
            <BookOpen className="w-4 h-4 text-rose-700 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-rose-950 font-serif">
            {HISTORICAL_WORKS.length}
          </div>
          <p className="text-[11px] text-rose-700 mt-1">Trích lục số tập, trang</p>
        </div>

        <div
          onClick={() => onNavigateTab('quotes')}
          className="p-4 rounded-2xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-xs font-bold">Lời dạy &amp; Trích dẫn</span>
            <Award className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-rose-950 font-serif">
            {VERIFIED_QUOTES.length}
          </div>
          <p className="text-[11px] text-rose-700 mt-1">Xác thực nguồn Cấp A</p>
        </div>

        <div
          onClick={() => onNavigateTab('footsteps')}
          className="p-4 rounded-2xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-xs font-bold">Dấu chân Bác Hồ</span>
            <Compass className="w-4 h-4 text-rose-700 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-rose-950 font-serif">
            {FOOTSTEP_LOCATIONS.length}
          </div>
          <p className="text-[11px] text-rose-700 mt-1">Tọa độ quốc tế &amp; di tích</p>
        </div>

        <div
          onClick={() => onNavigateTab('audio')}
          className="p-4 rounded-2xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-xs font-bold">Tư liệu âm thanh</span>
            <Volume2 className="w-4 h-4 text-rose-700 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-rose-950 font-serif">
            {HISTORICAL_AUDIOS.length}
          </div>
          <p className="text-[11px] text-rose-700 mt-1">Ghi âm giọng Bác Hồ</p>
        </div>
      </section>

      {/* CHUYỂN HƯỚNG NHANH CÁC PHÂN HỆ TƯ LIỆU */}
      <section aria-label="Danh mục phân hệ chính" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          onClick={() => onNavigateTab('biography')}
          className="p-5 rounded-3xl bg-gradient-to-br from-white via-rose-50/70 to-amber-50/40 border-2 border-rose-200 hover:border-rose-400 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-rose-700 text-white shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
              {chapters.length} Chương tiểu sử
            </span>
          </div>
          <h3 className="text-lg font-bold font-serif text-rose-950 group-hover:text-rose-700 transition-colors">
            1. Cuộc đời &amp; Sự nghiệp Cách mạng
          </h3>
          <p className="text-xs text-rose-900/80 leading-relaxed">
            Hệ thống hóa toàn bộ hành trình cách mạng từ quê hương Nam Đàn đến khi đi tìm đường cứu nước và lãnh đạo dân tộc.
          </p>
          <div className="pt-2 flex items-center text-xs font-bold text-rose-800 group-hover:translate-x-1 transition-transform">
            <span>Khám phá ngay</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('works')}
          className="p-5 rounded-3xl bg-gradient-to-br from-white via-rose-50/70 to-amber-50/40 border-2 border-rose-200 hover:border-rose-400 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-rose-700 text-white shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
              Hồ Chí Minh Toàn tập
            </span>
          </div>
          <h3 className="text-lg font-bold font-serif text-rose-950 group-hover:text-rose-700 transition-colors">
            2. Thư viện Tác phẩm Kinh điển
          </h3>
          <p className="text-xs text-rose-900/80 leading-relaxed">
            Nội dung tóm tắt và trích trích dẫn chuẩn hóa từ Tuyên ngôn Độc lập, Đường Kách mệnh, Bản Di chúc và các văn kiện chính yếu.
          </p>
          <div className="pt-2 flex items-center text-xs font-bold text-rose-800 group-hover:translate-x-1 transition-transform">
            <span>Tra cứu tác phẩm</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('chanh-hiep')}
          className="p-5 rounded-3xl bg-gradient-to-br from-white via-rose-50/70 to-amber-50/40 border-2 border-rose-200 hover:border-rose-400 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-600 text-white shadow-md">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              21 Khu phố Chánh Hiệp
            </span>
          </div>
          <h3 className="text-lg font-bold font-serif text-rose-950 group-hover:text-amber-800 transition-colors">
            3. Chánh Hiệp Học &amp; Làm Theo Bác
          </h3>
          <p className="text-xs text-rose-900/80 leading-relaxed">
            Các mô hình thực tiễn, việc làm thiết thực của cán bộ, đảng viên và nhân dân Phường Chánh Hiệp áp dụng tư tưởng Hồ Chí Minh.
          </p>
          <div className="pt-2 flex items-center text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
            <span>Xem mô hình thực tiễn</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </section>
    </div>
  );
};
