import React, { useState, useMemo } from 'react';
import { Article } from '../../types';
import { auditArticleImage, ArticleImageAuditItem, normalizeArticleImageUrl } from '../../lib/articleImageService';
import { ArticleThumbnail } from '../common/ArticleThumbnail';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  RefreshCw, 
  Edit3, 
  Sparkles, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

interface ArticleImageAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onEditArticle: (article: Article) => void;
  onUpdateArticle?: (updated: Article) => void;
  onShowToast?: (title: string, msg?: string) => void;
}

export const ArticleImageAuditModal: React.FC<ArticleImageAuditModalProps> = ({
  isOpen,
  onClose,
  articles,
  onEditArticle,
  onUpdateArticle,
  onShowToast
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'ACTION_NEEDED' | 'VALID' | 'FROM_CONTENT' | 'BROKEN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanTimestamp, setScanTimestamp] = useState<string>(() => new Date().toLocaleTimeString('vi-VN'));

  // Run audit on all articles
  const auditResults: ArticleImageAuditItem[] = useMemo(() => {
    const list = Array.isArray(articles) ? articles : [];
    return list.map(art => auditArticleImage(art));
  }, [articles, scanTimestamp]);

  const stats = useMemo(() => {
    const total = auditResults.length;
    const valid = auditResults.filter(i => i.status === 'valid').length;
    const fromContent = auditResults.filter(i => i.status === 'from_content').length;
    const missing = auditResults.filter(i => i.status === 'missing').length;
    const broken = auditResults.filter(i => i.status === 'broken').length;
    const actionNeeded = missing + broken;
    return { total, valid, fromContent, missing, broken, actionNeeded };
  }, [auditResults]);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanTimestamp(new Date().toLocaleTimeString('vi-VN'));
      setIsScanning(false);
      onShowToast?.('Đã kiểm tra lại', 'Đã quét và phân tích trạng thái ảnh của toàn bộ bài viết.');
    }, 400);
  };

  const handleApplyContentImage = (item: ArticleImageAuditItem) => {
    if (!item.firstContentImage || !onUpdateArticle) return;
    const normalized = normalizeArticleImageUrl(item.firstContentImage);
    const updated: Article = {
      ...item.article,
      thumbnailUrl: normalized,
      featuredImage: normalized,
      updatedAt: new Date().toISOString()
    };
    onUpdateArticle(updated);
    onShowToast?.('Đã cập nhật ảnh đại diện', `Đã gán ảnh trích xuất làm ảnh đại diện cho "${item.article.title.substring(0, 35)}..."`);
  };

  const filteredItems = useMemo(() => {
    return auditResults.filter(item => {
      // Type filter
      if (filterType === 'ACTION_NEEDED' && item.status !== 'broken' && item.status !== 'missing') return false;
      if (filterType === 'VALID' && item.status !== 'valid') return false;
      if (filterType === 'FROM_CONTENT' && item.status !== 'from_content') return false;
      if (filterType === 'BROKEN' && item.status !== 'broken') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.article.title.toLowerCase().includes(q);
        const matchCategory = (item.article.category || '').toLowerCase().includes(q);
        return matchTitle || matchCategory;
      }
      return true;
    });
  }, [auditResults, filterType, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Kiểm Tra &amp; Chẩn Đoán Hình Ảnh Tin Bài
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                  Cổng Thông Tin Chánh Hiệp
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Kiểm tra tự động toàn bộ ảnh đại diện, trích xuất ảnh từ nội dung HTML và phát hiện liên kết Drive không hợp lệ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRescan}
              disabled={isScanning}
              className="px-3.5 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Quét lại toàn bộ bài viết"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-blue-600' : ''}`} />
              <span className="hidden sm:inline">Quét lại</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* KPI Metrics Dashboard */}
        <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-3 shrink-0">
          
          {/* Total Articles */}
          <div 
            onClick={() => setFilterType('ALL')}
            className={`p-3 bg-white rounded-2xl border transition-all cursor-pointer shadow-2xs ${filterType === 'ALL' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <div className="text-[11px] font-bold text-slate-500">Tổng bài viết</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.total}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Toàn bộ kho tin</div>
          </div>

          {/* Valid Images */}
          <div 
            onClick={() => setFilterType('VALID')}
            className={`p-3 bg-white rounded-2xl border transition-all cursor-pointer shadow-2xs ${filterType === 'VALID' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-200'}`}
          >
            <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ảnh hợp lệ</span>
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">{stats.valid}</div>
            <div className="text-[10px] text-emerald-600/80 mt-0.5">Đã có thumbnail riêng</div>
          </div>

          {/* Extracted from Content */}
          <div 
            onClick={() => setFilterType('FROM_CONTENT')}
            className={`p-3 bg-white rounded-2xl border transition-all cursor-pointer shadow-2xs ${filterType === 'FROM_CONTENT' ? 'border-purple-500 ring-2 ring-purple-100' : 'border-slate-200 hover:border-purple-200'}`}
          >
            <div className="text-[11px] font-bold text-purple-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Trích từ nội dung</span>
            </div>
            <div className="text-xl font-black text-purple-700 mt-0.5">{stats.fromContent}</div>
            <div className="text-[10px] text-purple-600/80 mt-0.5">Tự nhận diện từ HTML</div>
          </div>

          {/* Missing / Fallback */}
          <div 
            onClick={() => setFilterType('ACTION_NEEDED')}
            className={`p-3 bg-white rounded-2xl border transition-all cursor-pointer shadow-2xs ${filterType === 'ACTION_NEEDED' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200 hover:border-amber-200'}`}
          >
            <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Dùng Banner</span>
            </div>
            <div className="text-xl font-black text-amber-700 mt-0.5">{stats.missing}</div>
            <div className="text-[10px] text-amber-600/80 mt-0.5">Dùng banner chuyên mục</div>
          </div>

          {/* Broken URLs */}
          <div 
            onClick={() => setFilterType('BROKEN')}
            className={`p-3 bg-white rounded-2xl border transition-all cursor-pointer shadow-2xs ${filterType === 'BROKEN' ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 hover:border-rose-200'}`}
          >
            <div className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Lỗi liên kết</span>
            </div>
            <div className="text-xl font-black text-rose-700 mt-0.5">{stats.broken}</div>
            <div className="text-[10px] text-rose-600/80 mt-0.5">Link thư mục Drive/lỗi</div>
          </div>

        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setFilterType('ACTION_NEEDED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === 'ACTION_NEEDED' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'}`}
            >
              Cần bổ sung/sửa ({stats.actionNeeded})
            </button>
            <button
              onClick={() => setFilterType('BROKEN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === 'BROKEN' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'}`}
            >
              Lỗi URL ({stats.broken})
            </button>
            <button
              onClick={() => setFilterType('FROM_CONTENT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === 'FROM_CONTENT' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'}`}
            >
              Trích từ nội dung ({stats.fromContent})
            </button>
            <button
              onClick={() => setFilterType('VALID')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === 'VALID' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'}`}
            >
              Đã chuẩn ({stats.valid})
            </button>
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, chuyên mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Articles Audit Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">Không có bài viết nào cần xử lý trong mục này</h3>
              <p className="text-xs text-slate-500">Mọi hình ảnh tin bài đều đang hiển thị ổn định trên hệ thống.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const art = item.article;

              let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              let badgeText = 'Ảnh hợp lệ';

              if (item.status === 'broken') {
                badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                badgeText = 'Lỗi đường dẫn';
              } else if (item.status === 'missing') {
                badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                badgeText = 'Banner mặc định';
              } else if (item.status === 'from_content') {
                badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
                badgeText = 'Tự trích xuất từ nội dung';
              }

              return (
                <div
                  key={art.id}
                  className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Main Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-24 h-18 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative">
                      <ArticleThumbnail
                        article={art}
                        variant="thumbnail"
                        aspectRatio="auto"
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${badgeColor}`}>
                          {badgeText}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {art.category || 'Hoạt động Mặt trận'}
                        </span>
                        {art.publishDate && (
                          <span className="text-[10px] text-slate-400">
                            • {art.publishDate}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
                        {art.title}
                      </h4>

                      {item.issueDescription && (
                        <p className={`text-[11px] font-medium leading-relaxed ${item.status === 'broken' ? 'text-rose-600' : 'text-slate-500'}`}>
                          {item.issueDescription}
                        </p>
                      )}

                      {/* Content extracted image hint */}
                      {item.firstContentImage && item.status !== 'valid' && (
                        <div className="pt-0.5 flex items-center gap-1.5 text-[10.5px] text-emerald-700 font-bold">
                          <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">Đã tìm thấy ảnh trong bài: {item.firstContentImage.substring(0, 45)}...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {item.firstContentImage && item.status !== 'valid' && onUpdateArticle && (
                      <button
                        type="button"
                        onClick={() => handleApplyContentImage(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11px] font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-2xs whitespace-nowrap"
                        title="Tự động áp dụng ảnh trích xuất từ nội dung làm ảnh đại diện chính thức"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Dùng ảnh nội dung</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditArticle(art);
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa bài viết</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
          <div>
            Quét lần cuối lúc: <strong>{scanTimestamp}</strong> • Hệ thống tự động chuẩn hóa liên kết Google Drive sang CDN tốc độ cao.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
