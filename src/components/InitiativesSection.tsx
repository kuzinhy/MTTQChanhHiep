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
  ArrowLeft,
  MessageSquare,
  Send,
  Copy,
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
  Image as ImageIcon,
  List,
  LayoutGrid
} from 'lucide-react';
import { QrCodeModal } from './QrCodeModal';
import { FrontInitiative, ChanhHiepActionModel, FRONT_INITIATIVE_DATA } from '../data/hcmVerifiedMuseumData';
import { loadStoredInitiatives, saveStoredInitiatives, loadStoredChanhHiepActions } from '../lib/hcmDataStore';
import { UniversalHcmEditorModal } from './cultural/UniversalHcmEditorModal';
import { getGoogleDriveDirectImageUrl } from '../lib/googleDriveService';
import { OptimizedImage } from './common/OptimizedImage';

interface InitiativesSectionProps {
  isAdmin?: boolean;
}

const DEFAULT_FALLBACK_COVER = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80';

const createVietnameseBannerSvg = (title: string = 'Mô hình sáng kiến', unit: string = 'MTTQ Phường Chánh Hiệp'): string => {
  const safeTitle = (title || 'Mô hình sáng kiến').replace(/[<>&'"]/g, '').slice(0, 45);
  const safeUnit = (unit || 'Phường Chánh Hiệp').replace(/[<>&'"]/g, '').slice(0, 35);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="#1e3a8a"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bgGrad)"/>
    <circle cx="700" cy="80" r="200" fill="#3b82f6" opacity="0.12"/>
    <circle cx="100" cy="380" r="160" fill="#f59e0b" opacity="0.1"/>
    <path d="M400,60 L412,95 L448,95 L418,116 L429,150 L400,128 L371,150 L382,116 L352,95 L388,95 Z" fill="url(#goldGrad)"/>
    <rect x="50" y="185" width="700" height="3" fill="url(#goldGrad)" opacity="0.8"/>
    <text x="400" y="240" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle">${safeTitle}</text>
    <rect x="250" y="275" width="300" height="36" rx="18" fill="url(#goldGrad)"/>
    <text x="400" y="299" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#0f172a" text-anchor="middle">${safeUnit}</text>
    <text x="400" y="375" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#93c5fd" text-anchor="middle">MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const getInitiativeCardImage = (item: FrontInitiative): string => {
  if (item && item.imageUrl && item.imageUrl.trim() !== '') {
    const converted = getGoogleDriveDirectImageUrl(item.imageUrl.trim());
    if (converted) return converted;
  }
  return createVietnameseBannerSvg(item?.title, item?.unit);
};

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
  const [viewLayout, setViewLayout] = useState<'LIST' | 'GRID' | 'TABLE'>('LIST');

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
        const nextStatus: 'PUBLISHED' | 'DRAFT' = item.status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT';
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
    if (selectedArticleDetail && selectedArticleDetail.id === updatedArticle.id) {
      setSelectedArticleDetail(updatedArticle);
    }
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

  // =========================================================================
  // TRANG TIN CHI TIẾT MÔ HÌNH SÁNG KIẾN (FULL PAGE VIEW - KHÔNG DÙNG POPUP)
  // =========================================================================
  if (selectedArticleDetail) {
    const cardImg = getInitiativeCardImage(selectedArticleDetail);
    const relatedList = initiatives
      .filter((i) => i.id !== selectedArticleDetail.id && i.status !== 'DRAFT')
      .slice(0, 3);

    return (
      <div className="py-8 px-4 max-w-5xl mx-auto space-y-8 animate-fadeIn">
        {/* Universal Editor Modal for Admin */}
        {editingItem && (
          <UniversalHcmEditorModal
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            itemType="front_initiative"
            itemData={editingItem}
            onSave={handleSaveEditedArticle}
          />
        )}

        {/* QR Code Modal */}
        {qrModalItem && (
          <QrCodeModal
            isOpen={!!qrModalItem}
            onClose={() => setQrModalItem(null)}
            title={qrModalItem.title}
            url={qrModalItem.url}
          />
        )}

        {/* Header Navigation & Breadcrumbs Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto py-1">
            <span 
              onClick={() => {
                setSelectedArticleDetail(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="hover:text-blue-600 transition cursor-pointer flex items-center gap-1 font-bold text-slate-700 shrink-0"
            >
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
              Sáng kiến 21 Khu phố
            </span>
            <span>/</span>
            <span className="text-slate-900 font-extrabold truncate max-w-xs sm:max-w-md">
              {selectedArticleDetail.title}
            </span>
          </div>

          <button
            onClick={() => {
              setSelectedArticleDetail(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer flex items-center gap-2 shrink-0 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Trở về Danh sách Mô hình</span>
          </button>
        </div>

        {/* Main Full News Article Container */}
        <article className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden space-y-6">
          {/* Cover Header Image */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-950 overflow-hidden">
            <OptimizedImage
              src={selectedArticleDetail.imageUrl || cardImg}
              alt={selectedArticleDetail.title}
              variant="article"
              priority={true}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = createVietnameseBannerSvg(selectedArticleDetail.title, selectedArticleDetail.unit);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-sm">
                  {selectedArticleDetail.unit}
                </span>
                {selectedArticleDetail.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Mô hình Tiêu biểu</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã nghiệm thu thực tiễn</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-md">
                {selectedArticleDetail.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Article Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-medium">
              <div className="flex flex-wrap items-center gap-4">
                {selectedArticleDetail.author && (
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>{selectedArticleDetail.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Ban hành: {selectedArticleDetail.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-blue-700 font-extrabold">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{selectedArticleDetail.likes} Lượt đánh giá hữu ích</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>1.240 lượt xem</span>
                </div>
              </div>
            </div>

            {/* Linked HCM Topic Card */}
            {selectedArticleDetail.linkedHcmTopicTitle && (
              <div
                onClick={(e) => handleViewHcmAction(selectedArticleDetail.linkedHcmActionId, selectedArticleDetail.linkedHcmTopicTitle, e)}
                className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border-2 border-rose-200 hover:border-rose-400 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <span className="font-extrabold text-rose-800 uppercase tracking-wider text-[11px] block">
                      Liên thông Chuyên đề Học tập và Làm theo Bác:
                    </span>
                    <span className="text-slate-900 font-serif italic text-sm font-bold">
                      "{selectedArticleDetail.linkedHcmTopicTitle}"
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-rose-700 font-black text-xs shrink-0 bg-white/80 px-3 py-1.5 rounded-xl border border-rose-200">
                  <span>Xem chuyên đề</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Highlight Summary Box */}
            <div className="p-6 rounded-3xl bg-blue-50/80 border-2 border-blue-200 space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Tóm tắt giải pháp &amp; Cách làm hay</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                {selectedArticleDetail.summary}
              </p>
            </div>

            {/* Practical Impact Box */}
            <div className="p-6 rounded-3xl bg-emerald-50/90 border-2 border-emerald-200 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Kết quả &amp; Tác động thực tiễn mang lại cho nhân dân</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-emerald-950 leading-relaxed">
                {selectedArticleDetail.impact}
              </p>
            </div>

            {/* Detailed Article Body Content */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Nội dung chi tiết &amp; Các bước triển khai mô hình</span>
              </h3>
              
              <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line space-y-4">
                {selectedArticleDetail.fullContent || selectedArticleDetail.summary}
              </div>
            </div>

            {/* Tags */}
            {selectedArticleDetail.tags?.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Từ khóa:
                </span>
                {selectedArticleDetail.tags.map((tag) => (
                  <span key={tag} className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Interaction & Share Action Bar */}
            <div className="p-5 bg-slate-900 text-white rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleLike(selectedArticleDetail.id, e)}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition cursor-pointer flex items-center gap-2 shadow-md active:scale-95"
                >
                  <ThumbsUp className="w-4 h-4 fill-white" />
                  <span>Đánh giá Hữu ích ({selectedArticleDetail.likes})</span>
                </button>

                <button
                  onClick={() => setQrModalItem({ title: selectedArticleDetail.title, url: window.location.href })}
                  className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Tạo mã QR</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {isAdminMode && (
                  <button
                    onClick={() => {
                      const target = selectedArticleDetail;
                      setEditingItem(target);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Chỉnh sửa nội dung</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedArticleDetail(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Trở về Danh sách</span>
                </button>
              </div>
            </div>

            {/* Citizen Feedback & Discussion Box */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Ý kiến &amp; Đóng góp thực tiễn về Mô hình này</span>
              </h4>
              <p className="text-xs text-slate-600">
                Ý kiến nhân dân và cán bộ khu phố góp phần đánh giá hiệu quả, đề xuất giải pháp nhân rộng mô hình trên địa bàn phường.
              </p>
              <div className="space-y-3">
                <textarea
                  rows={3}
                  placeholder="Nhập ý kiến, đóng góp kinh nghiệm triển khai mô hình..."
                  className="w-full p-3.5 text-xs bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      alert('Cảm ơn Ông/Bà đã đóng góp ý kiến xây dựng mô hình! Ý kiến đã được chuyển tới Ban Chỉ đạo Mặt trận.');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Gửi đóng góp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Initiatives Grid */}
        {relatedList.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Các Mô hình &amp; Sáng kiến tiêu biểu khác</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedList.map((rel) => {
                const relImg = getInitiativeCardImage(rel);
                return (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedArticleDetail(rel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="h-36 w-full bg-slate-900 relative overflow-hidden">
                        <OptimizedImage
                          src={rel.imageUrl || relImg}
                          alt={rel.title}
                          variant="card"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-md text-white font-bold text-[10px]">
                          {rel.unit}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700 transition leading-snug line-clamp-2">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {rel.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between text-xs font-bold text-blue-600">
                      <span>Xem trang chi tiết</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

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

      {/* Header Banner - Refined Professional Design */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-800/40 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/90 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm backdrop-blur-md">
            <Lightbulb className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>MÔ HÌNH TIÊU BIỂU &amp; SÁNG KIẾN MẶT TRẬN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight leading-tight">
            Mô hình tiêu biểu
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Kho dữ liệu sáng kiến tác nghiệp, mô hình nhân rộng hay Mặt Trận tại 21 khu phố — Phường Chánh Hiệp. Tích hợp liên thông dữ liệu trực tiếp với Chuyên đề Học tập và Làm theo Tư tưởng, Đạo đức, Phong cách Hồ Chí Minh.
          </p>
        </div>

        {/* Admin Mode Toggle & Actions */}
        <div className="shrink-0 relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                isAdminMode
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-200'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAdminMode ? 'Đang bật Quản trị' : 'Bật Bàn Quản Trị'}</span>
            </button>
          )}

          {isAdminMode && (
            <button
              onClick={handleCreateNewArticle}
              className="px-4.5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Mô Hình Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* COMPACT STATS SUMMARY BAR (Thu gọn tối đa để ưu tiên không gian cho Mô hình) */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50/90 px-3.5 py-2 rounded-2xl border border-slate-200/90 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
            <span className="text-[11px] text-slate-500">Mô hình:</span>
            <span className="text-blue-700 font-extrabold">{totalArticles}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-emerald-900 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] text-emerald-700">Công khai:</span>
            <span className="font-extrabold">{publishedCount}</span>
          </div>

          {isAdminMode && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 font-bold text-rose-900 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span className="text-[11px] text-rose-700">Bản nháp:</span>
              <span className="font-extrabold">{draftCount}</span>
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 font-bold text-amber-900 shadow-2xs">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
            <span className="text-[11px] text-amber-800">Nổi bật:</span>
            <span className="font-extrabold">{featuredCount}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 font-bold text-blue-900 shadow-2xs">
            <ThumbsUp className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="text-[11px] text-blue-800">Đánh giá thích:</span>
            <span className="font-extrabold">{totalLikesCount}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium ml-auto hidden md:block">
          Hiển thị <strong className="text-blue-700 font-bold">{filteredInitiatives.length}</strong> / {totalArticles} mô hình
        </div>
      </div>

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

            {/* Layout Switcher (List vs Grid vs Table) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewLayout('LIST')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewLayout === 'LIST' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Giao diện Danh sách Gọn"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Danh sách gọn</span>
              </button>
              <button
                onClick={() => setViewLayout('GRID')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewLayout === 'GRID' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Giao diện Thẻ Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dạng Thẻ</span>
              </button>
              {isAdminMode && (
                <button
                  onClick={() => setViewLayout('TABLE')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    viewLayout === 'TABLE' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Giao diện Bảng Báo cáo Chi tiết"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bảng chi tiết</span>
                </button>
              )}
            </div>

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

      {/* VIEW LAYOUT 1: COMPACT LIST VIEW */}
      {viewLayout === 'LIST' && filteredInitiatives.length > 0 && (
        <div className="space-y-2.5">
          {filteredInitiatives.map((item) => {
            const isLiked = likedMap[item.id];
            const isDraft = item.status === 'DRAFT';
            const cardImg = getInitiativeCardImage(item);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedArticleDetail(item)}
                className={`bg-white p-3 sm:p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group cursor-pointer hover:shadow-md ${
                  item.isFeatured
                    ? 'border-amber-300 ring-1 ring-amber-400/30 bg-amber-50/20'
                    : 'border-slate-200/90 hover:border-blue-300'
                } ${isDraft ? 'bg-slate-50/90 border-dashed border-rose-300' : ''}`}
              >
                {/* Left Thumbnail + Basic Compact Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1 w-full sm:w-auto">
                  {/* Thumbnail Image */}
                  <div className="relative w-20 h-16 sm:w-28 sm:h-20 rounded-xl bg-slate-900 overflow-hidden shrink-0 shadow-2xs">
                    <OptimizedImage
                      src={item.imageUrl || cardImg}
                      alt={item.title}
                      variant="thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = createVietnameseBannerSvg(item.title, item.unit);
                      }}
                    />
                  </div>

                  {/* Title & Key Specs */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-100">
                        {item.unit}
                      </span>
                      {item.isFeatured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[10px] flex items-center gap-0.5 border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Nổi bật</span>
                        </span>
                      )}
                      {isDraft && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center gap-0.5 border border-rose-200">
                          <Lock className="w-3 h-3" />
                          <span>Bản nháp</span>
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium ml-auto sm:ml-0">{item.date}</span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-blue-700 transition line-clamp-1 leading-snug">
                      {item.title}
                    </h3>

                    {item.summary && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 hidden md:block">
                        {item.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div 
                  className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                        isLiked ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title="Lượt thích"
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
                      title="Mã QR"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  {isAdminMode ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleToggleFeatured(item.id, e)}
                        className={`p-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          item.isFeatured ? 'bg-amber-100 text-amber-900' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                        title={item.isFeatured ? 'Bỏ ghim nổi bật' : 'Ghim nổi bật'}
                      >
                        <Star className={`w-4 h-4 ${item.isFeatured ? 'fill-amber-500' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => handleTogglePublishStatus(item.id, e)}
                        className={`p-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
                        className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition cursor-pointer"
                        title="Sửa mô hình / bài viết"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(item.id);
                        }}
                        className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                        title="Xóa mô hình"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedArticleDetail(item)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Xem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW LAYOUT 2: GRID VIEW */}
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

                {/* Cover Image - Guaranteed Cover Image for all models */}
                {(() => {
                  const cardImg = getInitiativeCardImage(item);
                  return (
                    <div className="relative h-48 w-full bg-slate-900 overflow-hidden shrink-0">
                      <OptimizedImage
                        src={item.imageUrl || cardImg}
                        alt={item.title}
                        variant="card"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = createVietnameseBannerSvg(item.title, item.unit);
                        }}
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white font-bold text-[10px] backdrop-blur-xs border border-white/10 shadow-xs">
                        {item.unit}
                      </div>
                    </div>
                  );
                })()}

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition leading-snug">
                          {item.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">{item.date}</span>
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
                            <OptimizedImage
                              src={item.imageUrl}
                              alt={item.title}
                              variant="thumbnail"
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
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
                <OptimizedImage
                  src={selectedHcmActionModal.imageUrl}
                  alt={selectedHcmActionModal.title}
                  variant="card"
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
