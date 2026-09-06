import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Play,
  Calendar,
  Clock,
  Building,
  Edit3,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Search,
  Film,
  Sparkles,
  ShieldCheck,
  Share2,
  Maximize2,
  Minimize2,
  AlertCircle,
  Tag,
  Globe,
  Upload,
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
  BookmarkCheck,
  Radio
} from 'lucide-react';
import {
  HISTORICAL_VIDEOS,
  HistoricalVideo,
  VideoSourceType,
  extractYouTubeId,
  detectVideoSource,
  getVideoThumbnail
} from '../../data/hcmVerifiedMuseumData';
import { VerifiedCultureImage } from './VerifiedCultureImage';
import { loadStoredVideos, saveStoredVideos, resetStoredVideos } from '../../lib/hcmDataStore';
import { DongSonDrumIcon, ChimHacIcon, HoaSenIcon } from './TraditionalMotifs';
import { UniversalHcmEditorModal } from './UniversalHcmEditorModal';

interface HcmVideoArchiveProps {
  isResearchMode: boolean;
  isAdmin?: boolean;
}

export const HcmVideoArchive: React.FC<HcmVideoArchiveProps> = ({ isResearchMode, isAdmin = false }) => {
  const [videoList, setVideoList] = useState<HistoricalVideo[]>(() => loadStoredVideos());
  const [selectedVideo, setSelectedVideo] = useState<HistoricalVideo>(() => {
    const list = loadStoredVideos();
    return list[0] || HISTORICAL_VIDEOS[0];
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('ALL'); // 'ALL' | 'HOCHIMINH_VN' | 'YOUTUBE' | 'DIRECT_STREAM'
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);

  const html5VideoRef = useRef<HTMLVideoElement | null>(null);

  // Admin Modal state
  const [editingVideo, setEditingVideo] = useState<HistoricalVideo | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Load from store on mount
  useEffect(() => {
    const list = loadStoredVideos();
    setVideoList(list);
    if (!list.some(v => v.id === selectedVideo?.id)) {
      setSelectedVideo(list[0] || HISTORICAL_VIDEOS[0]);
    }
  }, []);

  // Update playback speed when state changes
  useEffect(() => {
    if (html5VideoRef.current) {
      html5VideoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, selectedVideo]);

  // Counts for sources
  const sourceCounts = useMemo(() => {
    const hocChiMinhCount = videoList.filter(v => v.sourceType === 'HOCHIMINH_VN' || (v.hoChiMinhVnUrl && v.hoChiMinhVnUrl.includes('hochiminh.vn'))).length;
    const youtubeCount = videoList.filter(v => v.sourceType === 'YOUTUBE' || (!v.sourceType && v.youtubeVideoId)).length;
    const directCount = videoList.filter(v => v.sourceType === 'DIRECT_STREAM' || v.videoStreamUrl).length;
    return {
      all: videoList.length,
      hochiminh: hocChiMinhCount,
      youtube: youtubeCount,
      direct: directCount
    };
  }, [videoList]);

  // Filter list
  const filteredVideos = useMemo(() => {
    return videoList.filter(item => {
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.occasion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dateStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sourceAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      let matchSource = true;
      if (selectedSourceType === 'HOCHIMINH_VN') {
        matchSource = item.sourceType === 'HOCHIMINH_VN' || Boolean(item.hoChiMinhVnUrl && item.hoChiMinhVnUrl.includes('hochiminh.vn'));
      } else if (selectedSourceType === 'YOUTUBE') {
        matchSource = item.sourceType === 'YOUTUBE' || (item.sourceType !== 'HOCHIMINH_VN' && Boolean(item.youtubeVideoId || item.youtubeUrl));
      } else if (selectedSourceType === 'DIRECT_STREAM') {
        matchSource = item.sourceType === 'DIRECT_STREAM' || Boolean(item.videoStreamUrl);
      }

      return matchSearch && matchCategory && matchSource;
    });
  }, [videoList, searchQuery, selectedCategory, selectedSourceType]);

  const categories = [
    { id: 'ALL', label: 'Tất cả chủ đề' },
    { id: 'Tuyên ngôn & Độc lập', label: 'Tuyên ngôn & Độc lập' },
    { id: 'Hành trình cứu nước', label: 'Hành trình cứu nước' },
    { id: 'Bác Hồ với Nhân dân', label: 'Bác Hồ với Nhân dân' },
    { id: 'Kháng chiến & Chiến dịch', label: 'Kháng chiến & Chiến dịch' },
    { id: 'Ngoại giao & Quốc tế', label: 'Ngoại giao & Quốc tế' },
    { id: 'Phim tài liệu lịch sử', label: 'Phim tài liệu lịch sử' },
    { id: 'Di sản tư tưởng', label: 'Di sản tư tưởng' },
    { id: 'Quốc tang & Di chúc', label: 'Quốc tang & Di chúc' }
  ];

  const handleCopyLink = () => {
    const urlToCopy = selectedVideo?.hoChiMinhVnUrl || selectedVideo?.youtubeUrl || selectedVideo?.videoStreamUrl || window.location.href;
    navigator.clipboard.writeText(urlToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // CRUD Operations
  const handleSaveVideo = (updated: HistoricalVideo) => {
    const detected = detectVideoSource(updated.youtubeUrl || updated.hoChiMinhVnUrl || updated.videoStreamUrl || '');
    const finalSourceType: VideoSourceType = updated.sourceType || (updated.hoChiMinhVnUrl ? 'HOCHIMINH_VN' : detected.sourceType);
    const videoId = updated.youtubeVideoId || extractYouTubeId(updated.youtubeUrl || '') || detected.youtubeId;

    let imageUrl = updated.imageUrl;
    if (!imageUrl && videoId) {
      imageUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    const finalVideo: HistoricalVideo = {
      ...updated,
      sourceType: finalSourceType,
      youtubeVideoId: videoId,
      imageUrl
    };

    let updatedList: HistoricalVideo[];
    const exists = videoList.some(v => v.id === finalVideo.id);

    if (exists) {
      updatedList = videoList.map(v => (v.id === finalVideo.id ? finalVideo : v));
    } else {
      updatedList = [finalVideo, ...videoList];
    }

    setVideoList(updatedList);
    saveStoredVideos(updatedList);
    setSelectedVideo(finalVideo);
    setEditingVideo(null);
    setIsCreatingNew(false);
  };

  const handleDeleteVideo = (videoId: string) => {
    if (confirm('Đồng chí có chắc chắn muốn xóa thước phim tư liệu này khỏi Không gian Văn hóa Hồ Chí Minh?')) {
      const updatedList = videoList.filter(v => v.id !== videoId);
      setVideoList(updatedList);
      saveStoredVideos(updatedList);
      if (selectedVideo?.id === videoId) {
        setSelectedVideo(updatedList[0] || HISTORICAL_VIDEOS[0]);
      }
    }
  };

  const handleResetVideos = () => {
    if (confirm('Khôi phục toàn bộ danh sách tư liệu video gốc (bao gồm nguồn chính thống hochiminh.vn và YouTube)?')) {
      const defaults = resetStoredVideos();
      setVideoList(defaults);
      setSelectedVideo(defaults[0]);
    }
  };

  const handleOpenCreateNew = (initialSource: 'YOUTUBE' | 'HOCHIMINH_VN' = 'HOCHIMINH_VN') => {
    const newVideo: HistoricalVideo = {
      id: `vid-${Date.now()}`,
      title: initialSource === 'HOCHIMINH_VN' ? 'Tư liệu video từ hochiminh.vn' : 'Tư liệu video lịch sử mới',
      sourceType: initialSource,
      hoChiMinhVnUrl: initialSource === 'HOCHIMINH_VN' ? 'https://hochiminh.vn/tu-lieu-video' : '',
      youtubeUrl: initialSource === 'YOUTUBE' ? 'https://www.youtube.com/watch?v=' : '',
      youtubeVideoId: '',
      videoStreamUrl: '',
      dateStr: new Date().toLocaleDateString('vi-VN'),
      duration: '05 phút 00 giây',
      occasion: 'Tư liệu lịch sử Chủ tịch Hồ Chí Minh',
      sourceAgency: initialSource === 'HOCHIMINH_VN' ? 'Cổng thông tin điện tử Hồ Chí Minh (hochiminh.vn)' : 'Đài Truyền hình Việt Nam (VTV)',
      imageUrl: '',
      description: 'Nội dung tóm tắt thước phim tư liệu lịch sử...',
      historicalNote: 'Ý nghĩa giáo dục truyền thống cách mạng...',
      category: 'Phim tài liệu lịch sử',
      verificationStatus: 'VERIFIED'
    };
    setIsCreatingNew(true);
    setEditingVideo(newVideo);
  };

  // Safe YouTube embed URL with privacy enhancements
  const youtubeEmbedUrl = useMemo(() => {
    const id = selectedVideo?.youtubeVideoId || extractYouTubeId(selectedVideo?.youtubeUrl || '');
    if (!id) return '';
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
  }, [selectedVideo?.youtubeVideoId, selectedVideo?.youtubeUrl]);

  // Determine current active player mode for the selected video
  const activePlayerMode = useMemo(() => {
    if (selectedVideo?.videoStreamUrl) {
      return 'HTML5_STREAM';
    }
    if (youtubeEmbedUrl) {
      return 'YOUTUBE_EMBED';
    }
    if (selectedVideo?.hoChiMinhVnUrl) {
      return 'HOCHIMINH_PORTAL_CARD';
    }
    return 'FALLBACK_PREVIEW';
  }, [selectedVideo, youtubeEmbedUrl]);

  return (
    <div className="space-y-6 py-2">
      {/* HEADER KHÔNG GIAN VIDEO TƯ LIỆU ĐA NGUỒN */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-red-900 to-amber-950 p-6 sm:p-8 text-white shadow-xl border border-amber-400/30">
        <DongSonDrumIcon className="absolute -right-16 -bottom-16 w-80 h-80 text-amber-400/5 pointer-events-none" />
        <ChimHacIcon className="absolute top-4 right-12 w-28 h-28 text-amber-300/10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30 flex items-center gap-1.5 shadow-2xs">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Chuyên mục Video Tư liệu Lịch sử Đa Nguồn</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-rose-200 text-xs font-bold border border-red-400/40 flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-300" />
              <span>hochiminh.vn &amp; YouTube</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kiểm chứng Cấp A</span>
            </span>

            {isAdmin && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-rose-950 text-xs font-bold">
                Quyền Quản trị Admin
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-200 tracking-tight leading-tight">
            Kho Thước Phim &amp; Video Tư Liệu Hồ Chí Minh
          </h2>

          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-3xl">
            Tập hợp những thước phim tài liệu điện ảnh, video tư liệu lịch sử vô giá về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh. Được tổng hợp, số hóa và kết nối trực tiếp từ nguồn chính thống của <strong>Cổng thông tin điện tử Hồ Chí Minh (hochiminh.vn - Ban Tuyên giáo Trung ương)</strong> và các kênh lưu trữ tài liệu lịch sử quốc gia trên <strong>YouTube</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-amber-200/90 font-medium">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-amber-400/20">
                <Video className="w-3.5 h-3.5 text-amber-300" />
                <span>Tổng số: <strong className="text-amber-300 font-bold">{videoList.length}</strong> tư liệu</span>
              </div>
              <div className="flex items-center gap-1.5 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-400/20 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                <span>hochiminh.vn: <strong>{sourceCounts.hochiminh}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-400/20 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                <span>YouTube: <strong>{sourceCounts.youtube}</strong></span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenCreateNew('HOCHIMINH_VN')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-rose-950 font-bold text-xs hover:brightness-110 shadow-md flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Video Tư Liệu</span>
                </button>
                <button
                  onClick={handleResetVideos}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-medium border border-amber-300/20 transition cursor-pointer"
                  title="Khôi phục danh sách tư liệu gốc"
                >
                  Khôi phục gốc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BỘ LỌC NGUỒN TƯ LIỆU CHÍNH (TABS NGUỒN HOCHIMINH.VN & YOUTUBE) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setSelectedSourceType('ALL')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
            selectedSourceType === 'ALL'
              ? 'bg-gradient-to-br from-rose-900 via-red-800 to-rose-950 text-white border-amber-400 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white hover:bg-rose-50/60 border-rose-200 text-rose-950 shadow-2xs'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold block opacity-80">Tất cả nguồn</span>
            <span className="text-xs sm:text-sm font-bold block">Toàn bộ kho video</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
            selectedSourceType === 'ALL' ? 'bg-amber-400 text-rose-950' : 'bg-rose-100 text-rose-900'
          }`}>
            {sourceCounts.all}
          </span>
        </button>

        <button
          onClick={() => setSelectedSourceType('HOCHIMINH_VN')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
            selectedSourceType === 'HOCHIMINH_VN'
              ? 'bg-gradient-to-br from-amber-700 via-rose-800 to-red-900 text-white border-amber-300 shadow-md ring-2 ring-amber-400/40'
              : 'bg-white hover:bg-rose-50/60 border-rose-200 text-rose-950 shadow-2xs'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700 block flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-600" />
              <span>Cổng TTĐT Ban TG TW</span>
            </span>
            <span className="text-xs sm:text-sm font-bold block">hochiminh.vn</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
            selectedSourceType === 'HOCHIMINH_VN' ? 'bg-amber-300 text-rose-950' : 'bg-amber-100 text-amber-900'
          }`}>
            {sourceCounts.hochiminh}
          </span>
        </button>

        <button
          onClick={() => setSelectedSourceType('YOUTUBE')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
            selectedSourceType === 'YOUTUBE'
              ? 'bg-gradient-to-br from-red-700 via-rose-800 to-red-900 text-white border-red-400 shadow-md ring-2 ring-red-400/40'
              : 'bg-white hover:bg-rose-50/60 border-rose-200 text-rose-950 shadow-2xs'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-red-700 block flex items-center gap-1">
              <Play className="w-3 h-3 fill-red-600 text-red-600" />
              <span>Kênh Lịch sử</span>
            </span>
            <span className="text-xs sm:text-sm font-bold block">YouTube VTV / TLTW</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
            selectedSourceType === 'YOUTUBE' ? 'bg-white text-red-700' : 'bg-red-100 text-red-900'
          }`}>
            {sourceCounts.youtube}
          </span>
        </button>

        <button
          onClick={() => setSelectedSourceType('DIRECT_STREAM')}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
            selectedSourceType === 'DIRECT_STREAM'
              ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 text-white border-rose-400 shadow-md ring-2 ring-rose-400/30'
              : 'bg-white hover:bg-rose-50/60 border-rose-200 text-rose-950 shadow-2xs'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-rose-700 block flex items-center gap-1">
              <Upload className="w-3 h-3" />
              <span>Tệp số hóa</span>
            </span>
            <span className="text-xs sm:text-sm font-bold block">Tải lên trực tiếp</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
            selectedSourceType === 'DIRECT_STREAM' ? 'bg-amber-300 text-rose-950' : 'bg-rose-100 text-rose-900'
          }`}>
            {sourceCounts.direct}
          </span>
        </button>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC CHỦ ĐỀ */}
      <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xs border border-rose-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm thước phim theo tiêu đề, bối cảnh, năm lịch sử, cơ quan lưu trữ..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-rose-50/30 text-rose-950 placeholder:text-rose-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-400 hover:text-rose-600 cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Danh mục lọc nhanh */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* KHÔNG GIAN XEM VIDEO & DANH SÁCH (GRID 12 CỘT) */}
      <div className={`grid grid-cols-1 ${isTheaterMode ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
        {/* CỘT PHẢI / TRÊN: RẠP CHIẾU VIDEO (THEATER PLAYER) */}
        <div className={isTheaterMode ? 'w-full' : 'lg:col-span-7 lg:order-2'}>
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-rose-50/50 to-amber-50/40 border-2 border-rose-200 shadow-md space-y-5 sticky top-4">
            
            {/* Header thông tin video đang phát */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-3.5">
              <div className="flex flex-wrap items-center gap-2">
                {/* Badge Nguồn Video */}
                {selectedVideo?.sourceType === 'HOCHIMINH_VN' || (selectedVideo?.hoChiMinhVnUrl && selectedVideo.hoChiMinhVnUrl.includes('hochiminh.vn')) ? (
                  <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-600 to-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs">
                    <Globe className="w-3 h-3 text-amber-200" />
                    <span>Nguồn: hochiminh.vn</span>
                  </span>
                ) : selectedVideo?.sourceType === 'DIRECT_STREAM' || selectedVideo?.videoStreamUrl ? (
                  <span className="px-2.5 py-1 rounded-full bg-rose-900 text-white font-bold text-xs flex items-center gap-1 shadow-2xs">
                    <Upload className="w-3 h-3" />
                    <span>Tệp video số hóa</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-bold text-xs flex items-center gap-1 shadow-2xs">
                    <Play className="w-3 h-3 fill-white" />
                    <span>Nguồn: YouTube</span>
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-full bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-2xs">
                  {selectedVideo?.dateStr}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-700" />
                  <span>{selectedVideo?.duration}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-800 hover:bg-rose-100 border border-rose-200 flex items-center gap-1 transition cursor-pointer"
                  title={isTheaterMode ? 'Thu nhỏ khung xem' : 'Mở rộng rạp chiếu'}
                >
                  {isTheaterMode ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Thu gọn</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Rạp chiếu</span>
                    </>
                  )}
                </button>

                {/* Nút mở nguồn gốc tương ứng */}
                {selectedVideo?.hoChiMinhVnUrl ? (
                  <a
                    href={selectedVideo.hoChiMinhVnUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-rose-700 hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Mở trên hochiminh.vn</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                ) : selectedVideo?.youtubeUrl ? (
                  <a
                    href={selectedVideo.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Xem trên YouTube</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                ) : null}
              </div>
            </div>

            {/* BANNER NGUỒN CHÍNH THỐNG HOCHIMINH.VN NẾU CÓ */}
            {(selectedVideo?.sourceType === 'HOCHIMINH_VN' || (selectedVideo?.hoChiMinhVnUrl && selectedVideo.hoChiMinhVnUrl.includes('hochiminh.vn'))) && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-900 via-red-800 to-amber-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs border border-amber-400/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-200 block">
                      Tư liệu Cổng Thông tin điện tử Hồ Chí Minh (hochiminh.vn)
                    </span>
                    <span className="text-[11px] text-rose-100/90 block">
                      Kho tư liệu hình ảnh, phim tài liệu thuộc Ban Tuyên giáo Trung ương
                    </span>
                  </div>
                </div>

                <a
                  href={selectedVideo.hoChiMinhVnUrl || 'https://hochiminh.vn/tu-lieu-video'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-amber-400 text-rose-950 hover:bg-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-xs transition"
                >
                  <span>Chuyên mục tư liệu gốc</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* KHUNG PHÁT VIDEO THÔNG MINH (DÀNH CHO HTML5 STREAM, YOUTUBE HOẶC HOCHIMINH.VN) */}
            <div className="w-full relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border-2 border-rose-300/50 group">
              {activePlayerMode === 'HTML5_STREAM' && selectedVideo?.videoStreamUrl ? (
                <video
                  ref={html5VideoRef}
                  controls
                  src={selectedVideo.videoStreamUrl}
                  poster={getVideoThumbnail(selectedVideo)}
                  muted={isVideoMuted}
                  className="w-full h-full object-contain bg-black"
                />
              ) : activePlayerMode === 'YOUTUBE_EMBED' && youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={selectedVideo?.title || 'Tư liệu video Bác Hồ'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : selectedVideo?.hoChiMinhVnUrl ? (
                <div className="w-full h-full relative flex flex-col items-center justify-center text-white p-6 text-center space-y-3 bg-gradient-to-br from-rose-950 via-slate-950 to-amber-950">
                  <VerifiedCultureImage
                    src={getVideoThumbnail(selectedVideo)}
                    alt={selectedVideo.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
                  />
                  <div className="relative z-10 max-w-md space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-rose-600 flex items-center justify-center shadow-lg border-2 border-amber-300">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-amber-200">
                      Tư liệu gốc tại hochiminh.vn/tu-lieu-video
                    </h4>
                    <p className="text-xs text-rose-100/90 leading-relaxed">
                      Thước phim tư liệu này được số hóa và bảo tồn tại Cổng thông tin điện tử Hồ Chí Minh. Đồng chí có thể mở xem trực tiếp toàn bộ dữ liệu trên cổng.
                    </p>
                    <a
                      href={selectedVideo.hoChiMinhVnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-rose-950 font-bold text-xs hover:brightness-110 shadow-md transition transform active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Xem tư liệu đầy đủ trên hochiminh.vn</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-rose-200 p-6 text-center space-y-2">
                  <AlertCircle className="w-10 h-10 text-amber-400" />
                  <p className="font-bold text-sm">Chưa có liên kết phát video</p>
                  <p className="text-xs text-rose-300">Vui lòng cập nhật đường dẫn YouTube hoặc hochiminh.vn trong phần chỉnh sửa của Quản trị viên.</p>
                </div>
              )}
            </div>

            {/* TÙY CHỌN TỐC ĐỘ PHÁT & ÂM THANH NẾU LÀ HTML5 STREAM */}
            {activePlayerMode === 'HTML5_STREAM' && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-rose-200 text-xs">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-rose-700" />
                  <span className="font-bold text-rose-950">Tốc độ phát:</span>
                  {[0.75, 1, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                        playbackSpeed === speed
                          ? 'bg-rose-700 text-white shadow-2xs'
                          : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className="p-1.5 rounded-lg text-rose-800 hover:bg-rose-100 transition cursor-pointer"
                    title={isVideoMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                  >
                    {isVideoMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* TIÊU ĐỀ & THÔNG TIN NỘI DUNG TƯ LIỆU */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-rose-950 leading-tight">
                    {selectedVideo?.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {selectedVideo?.category && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
                        <Tag className="w-3 h-3" />
                        <span>{selectedVideo.category}</span>
                      </span>
                    )}

                    {selectedVideo?.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-200">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Tư liệu tiêu biểu</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-xl text-rose-700 hover:text-rose-950 hover:bg-rose-100 border border-rose-200 transition shrink-0 cursor-pointer"
                  title="Sao chép liên kết tư liệu"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Bối cảnh & Cơ quan lưu trữ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white border border-rose-200 text-xs">
                <div className="space-y-1">
                  <span className="text-rose-700 font-bold block">Bối cảnh lịch sử:</span>
                  <p className="text-rose-950 font-medium leading-relaxed">
                    {selectedVideo?.occasion || 'Chưa ghi nhận'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-rose-700 font-bold block">Cơ quan lưu trữ / Xuất bản:</span>
                  <p className="text-rose-950 font-medium leading-relaxed flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{selectedVideo?.sourceAgency || 'Cổng TTĐT Hồ Chí Minh'}</span>
                  </p>
                </div>
              </div>

              {/* Tóm tắt nội dung */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Tóm tắt nội dung thước phim tư liệu:
                </h4>
                <p className="text-xs sm:text-sm text-rose-950/90 leading-relaxed bg-white/80 p-4 rounded-2xl border border-rose-200/80">
                  {selectedVideo?.description}
                </p>
              </div>

              {/* Ý nghĩa lịch sử */}
              {selectedVideo?.historicalNote && (
                <div className="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Ý nghĩa lịch sử &amp; Giá trị giáo dục truyền thống:</span>
                  </div>
                  <p className="leading-relaxed font-medium pl-5">
                    {selectedVideo.historicalNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CỘT TRÁI / DƯỚI: DANH SÁCH CÁC THƯỚC PHIM TƯ LIỆU */}
        <div className={isTheaterMode ? 'w-full' : 'lg:col-span-5 lg:order-1'}>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif font-bold text-sm text-rose-950">
                Danh sách tư liệu ({filteredVideos.length})
              </span>
              <span className="text-xs text-rose-700">
                Bấm vào để xem phát video
              </span>
            </div>

            {filteredVideos.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border-2 border-dashed border-rose-200 text-center space-y-2">
                <Film className="w-8 h-8 text-rose-400 mx-auto" />
                <p className="font-bold text-xs text-rose-900">Không tìm thấy video nào phù hợp</p>
                <p className="text-[11px] text-rose-600">Vui lòng thử tìm kiếm với từ khóa hoặc nguồn khác</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rose-200">
                {filteredVideos.map((item) => {
                  const isSelected = selectedVideo?.id === item.id;
                  const thumbUrl = getVideoThumbnail(item);
                  const isHcmPortal = item.sourceType === 'HOCHIMINH_VN' || (item.hoChiMinhVnUrl && item.hoChiMinhVnUrl.includes('hochiminh.vn'));

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedVideo(item)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative group flex gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-br from-rose-900 via-red-800 to-rose-950 text-white border-amber-300 shadow-md ring-2 ring-amber-300/40'
                          : 'bg-white hover:bg-rose-50/60 border-rose-200 text-rose-950 hover:border-rose-400 hover:shadow-xs'
                      }`}
                    >
                      {/* Thumbnail 16:9 với nút Play & Badge nguồn */}
                      <div className="w-28 sm:w-32 aspect-video rounded-xl overflow-hidden shrink-0 relative bg-black/80 border border-rose-200/60 shadow-2xs">
                        <VerifiedCultureImage
                          src={thumbUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Nút Play overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-all">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                            isSelected
                              ? 'bg-amber-400 text-rose-950'
                              : isHcmPortal
                              ? 'bg-amber-500 text-rose-950'
                              : 'bg-red-600 text-white'
                          }`}>
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Badge nguồn góc trên trái thumbnail */}
                        <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tight shadow-xs ${
                          isHcmPortal
                            ? 'bg-amber-400 text-rose-950'
                            : item.sourceType === 'DIRECT_STREAM'
                            ? 'bg-blue-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}>
                          {isHcmPortal ? 'hochiminh.vn' : item.sourceType === 'DIRECT_STREAM' ? 'MP4' : 'YouTube'}
                        </span>

                        {/* Badge thời lượng trên thumbnail */}
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/80 text-white tracking-tight">
                          {item.duration || 'Video'}
                        </span>
                      </div>

                      {/* Thông tin video */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                                isSelected ? 'bg-amber-300 text-rose-950' : 'bg-rose-100 text-rose-900 border border-rose-200'
                              }`}
                            >
                              {item.dateStr}
                            </span>
                            <span
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-amber-200' : 'text-rose-700'
                              }`}
                            >
                              {item.category || 'Tư liệu'}
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-xs line-clamp-2 leading-snug mb-1">
                            {item.title}
                          </h4>

                          <p
                            className={`text-[11px] line-clamp-2 leading-relaxed ${
                              isSelected ? 'text-rose-100' : 'text-rose-900/80'
                            }`}
                          >
                            {item.description || item.occasion}
                          </p>
                        </div>

                        {isAdmin && (
                          <div className="flex items-center justify-end gap-1.5 pt-1.5 mt-1 border-t border-rose-300/20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingVideo(item);
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                                isSelected
                                  ? 'bg-amber-300 text-rose-950 hover:bg-amber-200'
                                  : 'bg-rose-100 text-rose-900 hover:bg-rose-200 border border-rose-300'
                              }`}
                            >
                              <Edit3 className="w-2.5 h-2.5" />
                              <span>Sửa</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteVideo(item.id);
                              }}
                              className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition cursor-pointer"
                              title="Xóa video"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADMIN EDIT / CREATE MODAL */}
      {editingVideo && (
        <UniversalHcmEditorModal
          isOpen={!!editingVideo}
          onClose={() => {
            setEditingVideo(null);
            setIsCreatingNew(false);
          }}
          itemType="video"
          itemData={editingVideo}
          onSave={handleSaveVideo}
          onDelete={handleDeleteVideo}
        />
      )}
    </div>
  );
};
