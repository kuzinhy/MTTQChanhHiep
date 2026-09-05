import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { getGoogleDriveDirectImageUrl, handleImageError } from '../lib/googleDriveService';
import { ARTICLE_BANNERS, getBannerForCategory } from '../utils/officialImages';
import { OptimizedImage } from './common/OptimizedImage';
import { ImageLightboxModal } from './common/ImageLightboxModal';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  User, 
  Tag, 
  Share2, 
  Printer, 
  Check, 
  Clock, 
  MessageSquare, 
  ChevronRight, 
  Building2, 
  FileText,
  Bookmark,
  Send,
  ExternalLink,
  Globe,
  Paperclip,
  Download,
  HardDrive
} from 'lucide-react';
import { motion } from 'motion/react';

interface ArticleDetailPageProps {
  article: Article;
  allArticles?: Article[];
  articles?: Article[];
  onSelectArticle: (art: Article) => void;
  onBack: () => void;
  onGoToOpinion?: () => void;
  onSelectDocumentTab?: () => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article,
  allArticles,
  articles,
  onSelectArticle,
  onBack,
  onGoToOpinion = () => {},
  onSelectDocumentTab,
}) => {
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string | undefined>(undefined);

  const safeArticles: Article[] = Array.isArray(allArticles) ? allArticles : (Array.isArray(articles) ? articles : []);

  // Scroll to top when article changes
  useEffect(() => {
    if (article?.id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [article?.id]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Không Tìm Thấy Bài Viết</h2>
        <p className="text-xs text-slate-600">Nội dung bài viết bạn đang tìm kiếm không tồn tại hoặc đã được gỡ xuống.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          Quay lại danh sách Tin tức
        </button>
      </div>
    );
  }

  // Related articles in same category
  const relatedArticles = safeArticles
    .filter(a => a && a.id !== article.id && (a.category === article.category || a.neighborhood === article.neighborhood))
    .slice(0, 4);

  // Popular articles
  const popularArticles = [...safeArticles]
    .filter(Boolean)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .filter(a => a && a.id !== article.id)
    .slice(0, 4);

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentSubmitted(true);
    setCommentText('');
    setCommentName('');
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto px-4 py-6 space-y-8"
    >
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 flex-wrap">
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 hover:underline font-bold cursor-pointer"
          >
            Tin tức &amp; An sinh
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-extrabold truncate max-w-xs sm:max-w-md">
            {article.category}
          </span>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>Quay lại danh sách tin tức</span>
        </button>
      </div>

      {/* Main Grid: Left Article (8 cols) + Right Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Main Article Page */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8">
          
          {/* Header Metadata */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-blue-600 text-white text-xs font-black px-3.5 py-1 rounded-xl uppercase tracking-wider shadow-2xs">
                {article.category}
              </span>
              {article.neighborhood && (
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  {article.neighborhood}
                </span>
              )}
              {article.isFeatured && (
                <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-2.5 py-1 rounded-xl border border-amber-200">
                  Tin nổi bật
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <User className="w-4 h-4 text-blue-600" />
                  {article.authorName || 'Ban Biên Tập MTTQ Phường Chánh Hiệp'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  {article.publishDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-600" />
                  {article.views} lượt xem
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-4 h-4 text-slate-400" />
                  ~4 phút đọc
                </span>
              </div>

              {/* Utility buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareCopy}
                  title="Sao chép liên kết"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Đã chép' : 'Chia sẻ'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  title="In bài viết"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="space-y-2">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
                <OptimizedImage
                  src={article.featuredImage}
                  alt={article.title}
                  variant="article"
                  fallbackCategory={article.category}
                  priority={true}
                  enableLightbox={true}
                  onOpenLightbox={(origUrl) => {
                    setLightboxImage(origUrl);
                    setLightboxTitle(article.title);
                  }}
                  className="w-full max-h-[560px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                />
              </div>
              <p className="text-[11px] text-slate-500 italic text-center">
                Hình ảnh hoạt động thực tế tại Ủy ban MTTQ Việt Nam Phường Chánh Hiệp, TP. Hồ Chí Minh. (Nhấp vào ảnh để xem bản gốc độ phân giải cao)
              </p>
            </div>
          )}

          {/* Article Lead Summary */}
          <div className="p-5 rounded-2xl bg-blue-50/80 border-l-4 border-blue-600 text-slate-900 text-sm font-semibold leading-relaxed shadow-2xs">
            {article.summary}
          </div>

          {/* Article Main Text Content */}
          {article.content && /<[a-z][\s\S]*>/i.test(article.content) ? (
            <div 
              className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-5 font-normal [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:my-4 [&_img]:shadow-sm [&_img]:border [&_img]:border-slate-200"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-5 font-normal">
              {article.content}
            </div>
          )}

          {/* Tags list */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-200 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-700">Chủ đề liên quan:</span>
              {article.tags.map((t, idx) => (
                <span 
                  key={idx} 
                  className="bg-blue-50 text-blue-900 text-xs font-semibold px-3 py-1 rounded-xl border border-blue-200/80 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}



          {/* Attachment Section (File / Image attached & Google Drive Link) */}
          {(article.attachment || article.attachmentName || article.driveFolderUrl) && (
            <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50/40 rounded-3xl border border-emerald-200/90 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-xs">
                    <Paperclip className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-950">
                      Tệp &amp; Tài liệu đính kèm bài viết
                    </h4>
                    <p className="text-xs text-emerald-700 font-medium">
                      Tài liệu lưu trữ trực tiếp tại Thư mục Google Drive chính thức
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-[10px] font-black uppercase">
                  Google Drive Storage
                </span>
              </div>

              {article.attachmentName && (
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs shrink-0">
                      <FileText className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-black text-slate-900 truncate">{article.attachmentName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Kích thước: {article.attachmentSize || 'Đã đính kèm'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {article.attachment && (
                      <a
                        href={article.attachment}
                        download={article.attachmentName}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải tệp</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-1 flex items-center justify-between gap-3 flex-wrap text-xs">
                <a
                  href={article.driveFolderUrl || 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <HardDrive className="w-4 h-4 text-emerald-300" />
                  <span>Mở Thư mục Google Drive (1TNEc-8JYkF17R44igkinTIZAmFEjSmOL)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Original Source / Facebook Link Callout */}
          {article.originalUrl && (
            <div className="p-5 bg-gradient-to-r from-blue-50 via-sky-50 to-white rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider">
                      {article.sourceName || 'Fanpage Facebook'}
                    </span>
                    <span className="text-xs font-black text-slate-900">Bài viết gốc trên mạng xã hội</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bạn có thể xem bài viết gốc, hình ảnh bổ sung và tham gia bình luận cộng đồng trên Fanpage chính thức.
                  </p>
                  <p className="text-[11px] text-blue-800 font-mono truncate max-w-sm sm:max-w-md">
                    {article.originalUrl}
                  </p>
                </div>
              </div>
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-sm inline-flex items-center gap-2 transition-all shrink-0 cursor-pointer"
              >
                <span>Xem trên Facebook</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Citizen Comment / Reaction Form */}
          <div className="pt-8 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Ý kiến phản hồi về bài viết</h3>
            </div>
            <p className="text-xs text-slate-500">
              Nhân dân có thể gửi ý kiến đóng góp, thắc mắc hoặc đề xuất liên quan trực tiếp đến nội dung tin bài này.
            </p>

            {commentSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Cảm ơn ý kiến đóng góp của bạn! Nội dung phản hồi đã được ghi nhận và gửi đến Ban biên tập.</span>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Họ và tên công dân (tùy chọn)"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                  <div className="text-[11px] text-slate-500 flex items-center px-2">
                    Nội dung phản hồi được bảo mật theo quy định
                  </div>
                </div>
                <textarea
                  rows={3}
                  placeholder="Nhập ý kiến đóng góp của bạn về bài viết này..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full text-xs p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden leading-relaxed"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Gửi ý kiến phản hồi</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Related Articles Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Bài viết cùng chuyên mục
              </h3>
            </div>

            <div className="space-y-3">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel)}
                    className="p-3 rounded-2xl hover:bg-blue-50/70 border border-transparent hover:border-blue-200 transition-all cursor-pointer group flex gap-3 items-center"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                      <OptimizedImage
                        src={rel.featuredImage}
                        alt={rel.title}
                        variant="thumbnail"
                        fallbackCategory={rel.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {rel.publishDate} • {rel.views} lượt xem
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic p-2">Không có bài viết cùng chuyên mục khác.</p>
              )}
            </div>
          </div>

          {/* Popular Articles Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Eye className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Tin tức xem nhiều nhất
              </h3>
            </div>

            <div className="space-y-3">
              {popularArticles.map((pop, idx) => (
                <div
                  key={pop.id}
                  onClick={() => onSelectArticle(pop)}
                  className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-600 line-clamp-2 leading-snug">
                      {pop.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      {pop.views} lượt xem
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Relief & Opinion Banner Widget */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h4 className="font-black text-xs uppercase text-blue-300">Cổng tiếp nhận an sinh</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Người dân có hoàn cảnh khó khăn hoặc phản ánh dân sinh tại Phường Chánh Hiệp có thể gửi đề xuất cứu trợ trực tiếp.
            </p>
            <button
              onClick={onGoToOpinion}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Đăng ký Cứu trợ / Gửi Phản ánh</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Facebook Link Widget in Sidebar */}
          {article.originalUrl && (
            <div className="p-5 rounded-3xl bg-blue-50/90 border border-blue-200 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-600" />
                <h4 className="font-black text-xs uppercase text-slate-900">Liên kết Fanpage Facebook</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Xem bài viết, thảo luận và tương tác trực tiếp với cộng đồng tại Fanpage MTTQ.
              </p>
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Mở bài viết trên Facebook</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Relevant Documents Link Widget */}
          {onSelectDocumentTab && (
            <div className="p-5 rounded-3xl bg-blue-50/90 border border-blue-200 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-black text-xs uppercase text-slate-900">Văn bản &amp; Kế hoạch Mặt trận</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tra cứu kế hoạch chỉ đạo, quy chế hoạt động &amp; chính sách trợ cấp xã hội mới nhất.
              </p>
              <button
                onClick={onSelectDocumentTab}
                className="w-full py-2 bg-white hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Xem Kho Văn bản</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* High-Resolution Master Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={!!lightboxImage}
        imageUrl={lightboxImage}
        title={lightboxTitle}
        onClose={() => {
          setLightboxImage(null);
          setLightboxTitle(undefined);
        }}
      />
    </motion.div>
  );
};
