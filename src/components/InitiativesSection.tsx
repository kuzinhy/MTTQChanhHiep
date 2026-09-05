import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  ThumbsUp,
  Download,
  Share2,
  Sparkles,
  Eye,
  CheckCircle2,
  QrCode,
  BookOpen,
  ArrowRight,
  X,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ShieldCheck,
  Star,
  FileText,
  User,
  Calendar,
  Layers,
  RefreshCw,
  Check,
  Tag,
  Globe,
  Lock,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { QrCodeModal } from './QrCodeModal';
import { FrontInitiative, ChanhHiepActionModel, FRONT_INITIATIVE_DATA } from '../data/hcmVerifiedMuseumData';
import { loadStoredInitiatives, saveStoredInitiatives, loadStoredChanhHiepActions } from '../lib/hcmDataStore';
import { UniversalHcmEditorModal } from './cultural/UniversalHcmEditorModal';

interface InitiativesSectionProps {
  isAdmin?: boolean;
}

export const InitiativesSection: React.FC<InitiativesSectionProps> = ({ isAdmin = true }) => {
  const [initiatives, setInitiatives] = useState<FrontInitiative[]>(() => loadStoredInitiatives());
  const [hcmActions, setHcmActions] = useState<ChanhHiepActionModel[]>(() => loadStoredChanhHiepActions());
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  
  // Admin Mode & Filters State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(isAdmin);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'LIKES' | 'TITLE'>('NEWEST');
  const [viewLayout, setViewLayout] = useState<'GRID' | 'TABLE'>('GRID');

  // Modals
  const [qrModalItem, setQrModalItem] = useState<{ title: string; url: string } | null>(null);
  const [selectedHcmActionModal, setSelectedHcmActionModal] = useState<ChanhHiepActionModel | null>(null);
  const [selectedArticleDetail, setSelectedArticleDetail] = useState<FrontInitiative | null>(null);
  const [editingItem, setEditingItem] = useState<FrontInitiative | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setInitiatives(loadStoredInitiatives());
    setHcmActions(loadStoredChanhHiepActions());
    setIsAdminMode(isAdmin);
  }, [isAdmin]);

  const persistUpdatedList = (newList: FrontInitiative[]) => {
    setInitiatives(newList);
    saveStoredInitiatives(newList);
  };

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    const updated = initiatives.map((item) =>
      item.id === id ? { ...item, likes: item.likes + (isLiked ? -1 : 1) } : item
    );
    persistUpdatedList(updated);
  };

  const handleTogglePublishStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = initiatives.map((item) => {
      if (item.id === id) {
        const nextStatus = item.status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    persistUpdatedList(updated);
  };

  const handleToggleFeatured = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = initiatives.map((item) =>
      item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
    );
    persistUpdatedList(updated);
  };

  const handleDeleteArticle = (id: string) => {
    const updated = initiatives.filter((item) => item.id !== id);
    persistUpdatedList(updated);
    setDeletingId(null);
    if (selectedArticleDetail?.id === id) {
      setSelectedArticleDetail(null);
    }
  };

  const handleResetSampleData = () => {
    if (window.confirm('Khôi phục danh sách Sáng kiến bài viết mẫu 21 Khu phố?')) {
      persistUpdatedList(FRONT_INITIATIVE_DATA);
    }
  };

  const handleCreateNewArticle = () => {
    const newArticle: FrontInitiative = {
      id: `init-${Date.now()}`,
      title: 'Mô hình / Sáng kiến Tác nghiệp Mặt Trận mới',
      unit: 'Ủy ban MTTQ & Ban CTMTKP 1',
      author: 'Ban Biên tập Mặt Trận Phường',
      summary: 'Tóm tắt nội dung giải pháp tác nghiệp và cách làm hay tại khu phố...',
      fullContent: 'Nội dung chi tiết các bước triển khai bài viết sáng kiến...',
      impact: 'Hiệu quả thiết thực mang lại cho nhân dân địa phương.',
      likes: 50,
      tags: ['Sáng kiến mới', 'Làm theo Bác', '21 Khu phố'],
      date: new Date().toLocaleDateString('vi-VN'),
      linkedHcmActionId: hcmActions[0]?.id || 'act-01',
      linkedHcmTopicTitle: hcmActions[0]?.title || 'Dân vận khéo – Gần dân, sát việc, lo cho dân',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
      status: 'PUBLISHED',
      isFeatured: false,
      postToHcmSpace: true
    };
    setEditingItem(newArticle);
  };

  const handleSaveEditedArticle = (updatedArticle: FrontInitiative) => {
    const exists = initiatives.some((i) => i.id === updatedArticle.id);
    const updatedList = exists
      ? initiatives.map((i) => (i.id === updatedArticle.id ? updatedArticle : i))
      : [updatedArticle, ...initiatives];
    
    persistUpdatedList(updatedList);
    setHcmActions(loadStoredChanhHiepActions());
    setEditingItem(null);
  };

  const handleViewHcmAction = (actionId?: string, topicTitle?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const found = hcmActions.find(
      (a) => a.id === actionId || (topicTitle && a.title.toLowerCase().includes(topicTitle.toLowerCase()))
    ) || hcmActions[0];

    if (found) {
      setSelectedHcmActionModal(found);
    }
  };

  // Filtered Items Logic
  const filteredInitiatives = initiatives.filter((item) => {
    // If not in admin mode, hide drafts
    if (!isAdminMode && item.status === 'DRAFT') {
      return false;
    }

    if (selectedStatusFilter === 'PUBLISHED' && item.status === 'DRAFT') return false;
    if (selectedStatusFilter === 'DRAFT' && item.status !== 'DRAFT') return false;
    if (selectedStatusFilter === 'FEATURED' && !item.isFeatured) return false;

    if (selectedUnitFilter !== 'ALL' && !item.unit.toLowerCase().includes(selectedUnitFilter.toLowerCase())) {
      return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchUnit = item.unit.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchUnit && !matchSummary && !matchTags) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;

    if (sortBy === 'LIKES') return b.likes - a.likes;
    if (sortBy === 'TITLE') return a.title.localeCompare(b.title, 'vi');
    return b.id.localeCompare(a.id);
  });

  // Unique units for dropdown filter
  const unitOptions = Array.from(
    new Set(initiatives.map((i) => i.unit.split('&')[0].trim()))
  );

  // Statistics
  const totalArticles = initiatives.length;
  const publishedCount = initiatives.filter((i) => i.status !== 'DRAFT').length;
  const draftCount = initiatives.filter((i) => i.status === 'DRAFT').length;
  const featuredCount = initiatives.filter((i) => i.isFeatured).length;
  const totalLikesCount = initiatives.reduce((sum, i) => sum + (i.likes || 0), 0);

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto space-y-6">
      {/* Editor Modal */}
      {editingItem && (
        <UniversalHcmEditorModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          itemType="front_initiative"
          itemData={editingItem}
          onSave={handleSaveEditedArticle}
        />
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
            <Lightbulb className="w-4 h-4 fill-amber-950 text-amber-950" />
            <span>KHO SÁNG KIẾN &amp; MÔ HÌNH HAY MẶT TRẬN 21 KHU PHỐ</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
            Mô Hình Nhân Rộng &amp; Sáng Kiến Tác Nghiệp Mặt Trận 21 Khu Phố
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed">
            Hệ thống quản trị &amp; tra cứu bài viết sáng kiến, giải pháp tác nghiệp Mặt Trận liên thông trực tiếp với Chuyên đề Học tập và Làm theo Tư tưởng, Đạo đức, Phong cách Hồ Chí Minh Phường Chánh Hiệp.
          </p>
        </div>

        {/* Admin Mode Toggle Button */}
        <div className="shrink-0 relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                isAdminMode
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-200'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAdminMode ? 'Đang bật Bàn Quản Trị' : 'Bật Quản Trị Bài Viết'}</span>
            </button>
          )}

          {isAdminMode && (
            <button
              onClick={handleCreateNewArticle}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Mô Hình Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* DASHBOARD THỐNG KÊ QUẢN TRỊ (Hiển thị khi Admin Mode Bật) */}
      {isAdminMode && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tổng Bài Viết</span>
            <p className="text-2xl font-black text-slate-900">{totalArticles}</p>
            <span className="text-[10px] text-blue-600 font-semibold">Tất cả bài viết sáng kiến</span>
          </div>

          <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Đã Xuất Bản</span>
            <p className="text-2xl font-black text-emerald-950">{publishedCount}</p>
            <span className="text-[10px] text-emerald-700 font-semibold">🟢 Công khai rộng rãi</span>
          </div>

          <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Bản Nháp / Nội Bộ</span>
            <p className="text-2xl font-black text-rose-950">{draftCount}</p>
            <span className="text-[10px] text-rose-700 font-semibold">🔴 Chưa duyệt xuất bản</span>
          </div>

          <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Ghim Nổi Bật</span>
            <p className="text-2xl font-black text-amber-950">{featuredCount}</p>
            <span className="text-[10px] text-amber-700 font-semibold">⭐ Ưu tiên trang đầu</span>
          </div>

          <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Lượt Đánh Giá</span>
            <p className="text-2xl font-black text-blue-950">{totalLikesCount}</p>
            <span className="text-[10px] text-blue-700 font-semibold">👍 Lượt thích hữu ích</span>
          </div>
        </div>
      )}

      {/* TOOLBAR TÌM KIẾM & BỘ LỌC BÀI VIẾT QUẢN TRỊ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Ô Tìm Kiếm */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm bài viết theo từ khóa, tên mô hình, khu phố, tác giả, thẻ..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Unit/Khu phố */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                value={selectedUnitFilter}
                onChange={(e) => setSelectedUnitFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Tất cả Đơn vị / Khu phố</option>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            {/* Filter by Status (Admin Mode) */}
            {isAdminMode && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Tất cả Trạng thái</option>
                  <option value="PUBLISHED">🟢 Đã Xuất Bản</option>
                  <option value="DRAFT">🔴 Bản Nháp</option>
                  <option value="FEATURED">⭐ Ghim Nổi Bật</option>
                </select>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] font-bold text-slate-500">Xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="NEWEST">Mới nhất</option>
                <option value="LIKES">Nhiều lượt thích nhất</option>
                <option value="TITLE">Tên A - Z</option>
              </select>
            </div>

            {/* Layout Switcher (Grid vs Table in Admin Mode) */}
            {isAdminMode && (
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewLayout('GRID')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition ${
                    viewLayout === 'GRID' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="Giao diện Thẻ"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewLayout('TABLE')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition ${
                    viewLayout === 'TABLE' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="Giao diện Bảng Quản trị"
                >
                  <FileText className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Restore Sample Data Button */}
            {isAdminMode && (
              <button
                onClick={handleResetSampleData}
                className="p-2 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                title="Khôi phục danh sách mẫu 21 Khu phố"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status result summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-medium">
          <span>
            Hiển thị <strong>{filteredInitiatives.length}</strong> / {initiatives.length} bài viết sáng kiến
            {searchTerm && ` cho từ khóa "${searchTerm}"`}
          </span>
          {isAdminMode && (
            <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              ⚡ Đang ở Chế độ Quản trị Bài viết
            </span>
          )}
        </div>
      </div>

      {/* NO RESULTS DISPLAY */}
      {filteredInitiatives.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Lightbulb className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy bài viết sáng kiến phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ kho bài viết sáng kiến.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedUnitFilter('ALL');
              setSelectedStatusFilter('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition cursor-pointer"
          >
            Xóa bộ lọc tìm kiếm
          </button>
        </div>
      )}

      {/* VIEW LAYOUT 1: GRID VIEW */}
      {viewLayout === 'GRID' && filteredInitiatives.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredInitiatives.map((item) => {
            const isLiked = likedMap[item.id];
            const isDraft = item.status === 'DRAFT';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedArticleDetail(item)}
                className={`bg-white rounded-3xl border transition-all flex flex-col justify-between overflow-hidden relative group cursor-pointer ${
                  item.isFeatured 
                    ? 'border-amber-300 shadow-md ring-2 ring-amber-400/20' 
                    : 'border-slate-200/90 shadow-xs hover:shadow-md'
                } ${isDraft ? 'bg-slate-50/80 opacity-90 border-dashed border-rose-300' : ''}`}
              >
                {/* Admin Quick Status Overlay Badges */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  {item.isFeatured && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>Nổi bật</span>
                    </span>
                  )}
                  {isDraft && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[10px] shadow-xs flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Bản nháp</span>
                    </span>
                  )}
                </div>

                {/* Cover Image */}
                {item.imageUrl && (
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white font-bold text-[10px] backdrop-blur-xs border border-white/10">
                      {item.unit}
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {!item.imageUrl && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          {item.unit}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition leading-snug">
                          {item.title}
                        </h3>
                        {item.imageUrl && (
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">{item.date}</span>
                        )}
                      </div>
                      {item.author && (
                        <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{item.author}</span>
                        </p>
                      )}
                    </div>

                    {/* Badge Liên thông Học Bác */}
                    {item.linkedHcmTopicTitle && (
                      <button
                        onClick={(e) => handleViewHcmAction(item.linkedHcmActionId, item.linkedHcmTopicTitle, e)}
                        className="w-full text-left p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs text-rose-950 transition flex items-center justify-between gap-2 cursor-pointer group/badge"
                      >
                        <div className="flex items-start gap-1.5 min-w-0">
                          <BookOpen className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-1 font-semibold">
                            Gắn liền Học Bác: <strong className="text-rose-900">{item.linkedHcmTopicTitle}</strong>
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-rose-700 shrink-0 group-hover/badge:translate-x-0.5 transition" />
                      </button>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>

                    <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 space-y-1">
                      <div className="text-[10px] font-black uppercase text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kết quả &amp; Tác động</span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-950 leading-tight">
                        {item.impact}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleLike(item.id, e)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                            isLiked 
                              ? 'bg-blue-600 text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                          <span>{item.likes}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQrModalItem({ title: item.title, url: window.location.href });
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                          title="Mã QR Bài viết Sáng kiến"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Admin Direct Action Buttons */}
                      {isAdminMode ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleToggleFeatured(item.id, e)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              item.isFeatured ? 'bg-amber-100 text-amber-900' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                            }`}
                            title={item.isFeatured ? 'Bỏ ghim nổi bật' : 'Ghim nổi bật'}
                          >
                            <Star className={`w-4 h-4 ${item.isFeatured ? 'fill-amber-500' : ''}`} />
                          </button>

                          <button
                            onClick={(e) => handleTogglePublishStatus(item.id, e)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              isDraft ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                            title={isDraft ? 'Xuất bản công khai' : 'Chuyển về bản nháp'}
                          >
                            {isDraft ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingItem(item);
                            }}
                            className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            title="Sửa bài viết"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingId(item.id);
                            }}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-blue-600 group-hover:translate-x-0.5 transition flex items-center gap-1">
                          <span>Xem bài viết</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW LAYOUT 2: ADMIN TABLE VIEW */}
      {viewLayout === 'TABLE' && isAdminMode && filteredInitiatives.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-3 w-20 text-center">Ảnh Đại Diện</th>
                  <th className="py-3.5 px-4">Tên Bài Viết / Sáng Kiến</th>
                  <th className="py-3.5 px-3">Đơn Vị Khu Phố</th>
                  <th className="py-3.5 px-3">Học Bác Liên Thông</th>
                  <th className="py-3.5 px-3 text-center">Trạng Thái</th>
                  <th className="py-3.5 px-3 text-center">Đánh Giá</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác Quản Trị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInitiatives.map((item) => {
                  const isDraft = item.status === 'DRAFT';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-3 text-center">
                        {item.imageUrl ? (
                          <div 
                            onClick={() => setSelectedArticleDetail(item)}
                            className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 mx-auto shrink-0 shadow-2xs hover:opacity-90 cursor-pointer group"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-10 rounded-lg border border-dashed border-slate-200 bg-slate-50 mx-auto flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {item.isFeatured && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-black shrink-0">
                                ⭐ NỔI BẬT
                              </span>
                            )}
                            <span
                              onClick={() => setSelectedArticleDetail(item)}
                              className="font-bold text-slate-900 hover:text-blue-700 transition cursor-pointer line-clamp-2"
                            >
                              {item.title}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{item.summary}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-1 rounded bg-slate-100 font-bold text-slate-800 text-[10px]">
                          {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 max-w-[200px]">
                        <span className="text-[11px] text-rose-900 font-medium line-clamp-1 italic">
                          {item.linkedHcmTopicTitle || '—'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {isDraft ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] inline-flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Bản nháp</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>Đã xuất bản</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center whitespace-nowrap font-bold text-blue-700">
                        👍 {item.likes}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedArticleDetail(item)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                            title="Xem chi tiết bài viết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleFeatured(item.id)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              item.isFeatured ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                            title="Ghim nổi bật"
                          >
                            <Star className={`w-4 h-4 ${item.isFeatured ? 'fill-amber-500' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleTogglePublishStatus(item.id)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              isDraft ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                            title={isDraft ? 'Công khai bài viết' : 'Thu hồi về bản nháp'}
                          >
                            {isDraft ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            title="Chỉnh sửa bài viết"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingId(item.id)}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL ARTICLE READER MODAL (`selectedArticleDetail`) */}
      {selectedArticleDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden relative my-8">
            {/* Cover Header Image */}
            {selectedArticleDetail.imageUrl && (
              <div className="relative h-60 w-full bg-slate-900 overflow-hidden">
                <img
                  src={selectedArticleDetail.imageUrl}
                  alt={selectedArticleDetail.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs">
                    {selectedArticleDetail.unit}
                  </span>
                  <h2 className="text-xl font-black text-white leading-tight">
                    {selectedArticleDetail.title}
                  </h2>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedArticleDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900/80 text-white transition cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-5">
              {!selectedArticleDetail.imageUrl && (
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200 inline-block">
                    {selectedArticleDetail.unit}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedArticleDetail.title}
                  </h2>
                </div>
              )}

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 border-b border-slate-100 pb-3">
                {selectedArticleDetail.author && (
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>{selectedArticleDetail.author}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ngày ban hành: {selectedArticleDetail.date}</span>
                </span>
                <span className="flex items-center gap-1 text-blue-700 font-bold">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{selectedArticleDetail.likes} Lượt hữu ích</span>
                </span>
              </div>

              {/* Trường thông tin ảnh đại diện mô hình */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-16 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0 shadow-2xs">
                    {selectedArticleDetail.imageUrl ? (
                      <img
                        src={selectedArticleDetail.imageUrl}
                        alt="Ảnh đại diện"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 text-xs overflow-hidden">
                    <span className="font-bold text-slate-900 block text-[11px] flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ảnh đại diện mô hình:</span>
                    </span>
                    <span className="text-slate-500 text-[11px] truncate block font-mono">
                      {selectedArticleDetail.imageUrl || 'Chưa cập nhật link ảnh'}
                    </span>
                  </div>
                </div>
                {selectedArticleDetail.imageUrl && (
                  <a
                    href={selectedArticleDetail.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] shrink-0 transition whitespace-nowrap"
                  >
                    Xem ảnh gốc ↗
                  </a>
                )}
              </div>

              {/* Linked HCM Topic Card */}
              {selectedArticleDetail.linkedHcmTopicTitle && (
                <div
                  onClick={(e) => handleViewHcmAction(selectedArticleDetail.linkedHcmActionId, selectedArticleDetail.linkedHcmTopicTitle, e)}
                  className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-rose-700 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-rose-900 block">Chuyên đề Học Bác Liên Thông:</span>
                      <span className="text-rose-950 font-serif italic">{selectedArticleDetail.linkedHcmTopicTitle}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-700 shrink-0" />
                </div>
              )}

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-800 space-y-1">
                <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px]">Tóm tắt nội dung giải pháp:</span>
                <p>{selectedArticleDetail.summary}</p>
              </div>

              {/* Full Content Body */}
              {selectedArticleDetail.fullContent && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Nội dung chi tiết &amp; Các bước triển khai:</h4>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                    {selectedArticleDetail.fullContent}
                  </p>
                </div>
              )}

              {/* Impact Box */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kết quả &amp; Tác động thực tiễn</span>
                </div>
                <p className="text-xs font-semibold text-emerald-950 leading-relaxed">
                  {selectedArticleDetail.impact}
                </p>
              </div>

              {/* Tags */}
              {selectedArticleDetail.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedArticleDetail.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleLike(selectedArticleDetail.id, e)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ThumbsUp className="w-4 h-4 fill-white" />
                    <span>Hữu ích ({selectedArticleDetail.likes})</span>
                  </button>

                  <button
                    onClick={() => setQrModalItem({ title: selectedArticleDetail.title, url: window.location.href })}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Mã QR</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {isAdminMode && (
                    <button
                      onClick={() => {
                        const target = selectedArticleDetail;
                        setSelectedArticleDetail(null);
                        setEditingItem(target);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Chỉnh sửa bài viết</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedArticleDetail(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <Trash2 className="w-10 h-10 text-rose-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Xác nhận xóa bài viết sáng kiến?</h3>
              <p className="text-xs text-slate-500">Hành động này sẽ gỡ bỏ bài viết khỏi hệ thống quản trị.</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeleteArticle(deletingId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM BÀI VIẾT HỌC BÁC LIÊN THÔNG */}
      {selectedHcmActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-rose-300 shadow-2xl max-w-lg w-full overflow-hidden relative">
            {selectedHcmActionModal.imageUrl && (
              <div className="relative h-48 w-full bg-rose-950 overflow-hidden">
                <img
                  src={selectedHcmActionModal.imageUrl}
                  alt={selectedHcmActionModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-950/80 text-amber-200 text-xs font-bold border border-rose-300/40 backdrop-blur-xs">
                  {selectedHcmActionModal.targetGroup || 'Chủ đề Học Bác'}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedHcmActionModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/40 hover:bg-slate-900/70 text-white transition cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-bold text-xs border border-rose-200 inline-block">
                  Chuyên đề Học Tập Bác • {selectedHcmActionModal.neighborhood}
                </span>
                <h3 className="text-lg font-serif font-extrabold text-rose-950">
                  {selectedHcmActionModal.title}
                </h3>
              </div>

              {selectedHcmActionModal.inspirationalQuote && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs italic font-serif text-amber-950">
                  <span className="font-sans font-bold text-amber-900 not-italic block mb-0.5">Kim chỉ nam:</span>
                  “{selectedHcmActionModal.inspirationalQuote}”
                </div>
              )}

              <div className="space-y-2 text-xs">
                <p className="text-slate-800 leading-relaxed font-normal">
                  {selectedHcmActionModal.summary}
                </p>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-900 block">Kết quả thực tiễn:</span>
                  <p className="text-emerald-950 font-medium">{selectedHcmActionModal.practicalResult}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedHcmActionModal(null)}
                  className="px-4 py-2 rounded-xl bg-rose-800 text-white font-bold text-xs hover:bg-rose-900 transition cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModalItem && (
        <QrCodeModal
          isOpen={true}
          onClose={() => setQrModalItem(null)}
          title={qrModalItem.title}
          itemUrl={qrModalItem.url}
          category="Mô hình Hay MTTQ 21 Khu Phố"
        />
      )}
    </section>
  );
};
