import React, { useState, useEffect, useMemo } from 'react';
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
  Tag
} from 'lucide-react';
import { HISTORICAL_VIDEOS, HistoricalVideo, extractYouTubeId } from '../../data/hcmVerifiedMuseumData';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

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

      return matchSearch && matchCategory;
    });
  }, [videoList, searchQuery, selectedCategory]);

  const categories = [
    { id: 'ALL', label: 'Tất cả tư liệu' },
    { id: 'Tuyên ngôn & Độc lập', label: 'Tuyên ngôn & Độc lập' },
    { id: 'Ngoại giao & Quốc tế', label: 'Ngoại giao & Quốc tế' },
    { id: 'Bác Hồ với Nhân dân', label: 'Bác Hồ với Nhân dân' },
    { id: 'Kháng chiến & Chiến dịch', label: 'Kháng chiến & Chiến dịch' },
    { id: 'Phim tài liệu lịch sử', label: 'Phim tài liệu lịch sử' },
    { id: 'Quốc tang & Di chúc', label: 'Quốc tang & Di chúc' }
  ];

  const handleCopyLink = () => {
    if (selectedVideo?.youtubeUrl) {
      navigator.clipboard.writeText(selectedVideo.youtubeUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  // CRUD Operations
  const handleSaveVideo = (updated: HistoricalVideo) => {
    // Ensure video ID is extracted
    const videoId = updated.youtubeVideoId || extractYouTubeId(updated.youtubeUrl || '');
    const finalVideo: HistoricalVideo = {
      ...updated,
      youtubeVideoId: videoId,
      imageUrl: updated.imageUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '')
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
    if (confirm('Đồng chí có chắc chắn muốn xóa video tư liệu này khỏi Không gian Văn hóa?')) {
      const updatedList = videoList.filter(v => v.id !== videoId);
      setVideoList(updatedList);
      saveStoredVideos(updatedList);
      if (selectedVideo?.id === videoId) {
        setSelectedVideo(updatedList[0] || HISTORICAL_VIDEOS[0]);
      }
    }
  };

  const handleResetVideos = () => {
    if (confirm('Khôi phục danh sách tư liệu video gốc chuẩn mực từ YouTube ban đầu?')) {
      const defaults = resetStoredVideos();
      setVideoList(defaults);
      setSelectedVideo(defaults[0]);
    }
  };

  const handleOpenCreateNew = () => {
    const newVideo: HistoricalVideo = {
      id: `vid-${Date.now()}`,
      title: 'Tư liệu video mới',
      youtubeUrl: 'https://www.youtube.com/watch?v=',
      youtubeVideoId: '',
      dateStr: new Date().toLocaleDateString('vi-VN'),
      duration: '05 phút 00 giây',
      occasion: 'Tư liệu lịch sử Bác Hồ',
      sourceAgency: 'Đài Truyền hình Việt Nam (VTV)',
      imageUrl: '',
      description: 'Nội dung tóm tắt thước phim tư liệu lịch sử...',
      historicalNote: 'Ý nghĩa giáo dục truyền thống...',
      category: 'Phim tài liệu lịch sử',
      verificationStatus: 'VERIFIED'
    };
    setIsCreatingNew(true);
    setEditingVideo(newVideo);
  };

  // Safe YouTube embed URL with privacy enhancements
  const embedUrl = useMemo(() => {
    const id = selectedVideo?.youtubeVideoId || extractYouTubeId(selectedVideo?.youtubeUrl || '');
    if (!id) return '';
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
  }, [selectedVideo?.youtubeVideoId, selectedVideo?.youtubeUrl]);

  return (
    <div className="space-y-6 py-2">
      {/* HEADER KHÔNG GIAN VIDEO TƯ LIỆU */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-red-900 to-amber-950 p-6 sm:p-8 text-white shadow-xl border border-amber-400/30">
        <DongSonDrumIcon className="absolute -right-16 -bottom-16 w-80 h-80 text-amber-400/5 pointer-events-none" />
        <ChimHacIcon className="absolute top-4 right-12 w-28 h-28 text-amber-300/10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30 flex items-center gap-1.5 shadow-2xs">
              <Film className="w-3.5 h-3.5" />
              <span>Nguồn YouTube &amp; Hãng phim Tài liệu Quốc gia</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold border border-rose-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dữ liệu kiểm chứng Cấp A</span>
            </span>
            {isAdmin && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-rose-950 text-xs font-bold">
                Quyền Quản trị Admin
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-200 tracking-tight leading-tight">
            Kho Tư Liệu Video &amp; Thước Phim Lịch Sử Hồ Chí Minh
          </h2>

          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-3xl">
            Tập hợp những thước phim tài liệu điện ảnh, video ghi lại khoảnh khắc lịch sử thiêng liêng và phong thái ung dung, nhân ái của Chủ tịch Hồ Chí Minh được số hóa từ các cơ quan lưu trữ quốc gia và phát sóng trên nền tảng YouTube.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-200/90 font-medium">
              <Video className="w-4 h-4 text-amber-300" />
              <span>Hiện có <strong className="text-amber-300 font-bold">{videoList.length}</strong> thước phim tư liệu</span>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleOpenCreateNew}
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

      {/* THANH TÌM KIẾM & BỘ LỌC CHỦ ĐỀ */}
      <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-rose-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề phim, bối cảnh, năm lịch sử, cơ quan lưu trữ..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-rose-50/30 text-rose-950 placeholder:text-rose-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-400 hover:text-rose-600"
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
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-2xs">
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

                {selectedVideo?.youtubeUrl && (
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
                )}
              </div>
            </div>

            {/* KHUNG NHÚNG VIDEO YOUTUBE (TỶ LỆ 16:9) */}
            <div className="w-full relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border-2 border-rose-300/50 group">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={selectedVideo?.title || 'Tư liệu video Bác Hồ'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-rose-200 p-6 text-center space-y-2">
                  <AlertCircle className="w-10 h-10 text-amber-400" />
                  <p className="font-bold text-sm">Chưa có liên kết YouTube hợp lệ</p>
                  <p className="text-xs text-rose-300">Vui lòng cập nhật đường dẫn YouTube trong phần chỉnh sửa của Quản trị viên.</p>
                </div>
              )}
            </div>

            {/* TIÊU ĐỀ & THÔNG TIN NỘI DUNG TƯ LIỆU */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-rose-950 leading-tight">
                    {selectedVideo?.title}
                  </h3>
                  {selectedVideo?.category && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
                      <Tag className="w-3 h-3" />
                      <span>{selectedVideo.category}</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-xl text-rose-700 hover:text-rose-950 hover:bg-rose-100 border border-rose-200 transition shrink-0 cursor-pointer"
                  title="Sao chép liên kết video"
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
                  <span className="text-rose-700 font-bold block">Cơ quan lưu trữ / Sản xuất:</span>
                  <p className="text-rose-950 font-medium leading-relaxed flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{selectedVideo?.sourceAgency || 'Lưu trữ quốc gia'}</span>
                  </p>
                </div>
              </div>

              {/* Tóm tắt nội dung */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Tóm tắt nội dung thước phim:
                </h4>
                <p className="text-xs sm:text-sm text-rose-950/90 leading-relaxed bg-white/70 p-4 rounded-2xl border border-rose-200/80">
                  {selectedVideo?.description}
                </p>
              </div>

              {/* Ý nghĩa lịch sử */}
              {selectedVideo?.historicalNote && (
                <div className="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Ý nghĩa lịch sử &amp; Giá trị giáo dục:</span>
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
                Bấm vào để xem
              </span>
            </div>

            {filteredVideos.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border-2 border-dashed border-rose-200 text-center space-y-2">
                <Film className="w-8 h-8 text-rose-400 mx-auto" />
                <p className="font-bold text-xs text-rose-900">Không tìm thấy video nào phù hợp</p>
                <p className="text-[11px] text-rose-600">Vui lòng thử tìm kiếm với từ khóa hoặc chủ đề khác</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rose-200">
                {filteredVideos.map((item, idx) => {
                  const isSelected = selectedVideo?.id === item.id;
                  const thumbUrl = item.imageUrl || (item.youtubeVideoId ? `https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg` : '');

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
                      {/* Thumbnail 16:9 với nút Play */}
                      <div className="w-28 sm:w-32 aspect-video rounded-xl overflow-hidden shrink-0 relative bg-black/80 border border-rose-200/60 shadow-2xs">
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-rose-300 bg-rose-950">
                            <Film className="w-6 h-6" />
                          </div>
                        )}

                        {/* Nút Play đỏ YouTube */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-all">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                            isSelected ? 'bg-amber-400 text-rose-950' : 'bg-red-600 text-white'
                          }`}>
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>

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
                              className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition"
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
        />
      )}
    </div>
  );
};
