import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Search, Filter, Trash2, Copy, Check, ExternalLink, RefreshCw, AlertTriangle, Plus, Folder, Calendar, HardDrive } from 'lucide-react';
import { CloudinaryImageMeta, Article } from '../../types';
import { fetchMediaLibrary, deleteMediaFromCloudinary, syncImageUsageWithServer } from '../../lib/cloudinaryService';
import { MediaUploader } from './MediaUploader';
import { OptimizedImage } from '../common/OptimizedImage';

interface MediaLibraryViewProps {
  articles?: Article[];
  onSelectImageForArticle?: (image: CloudinaryImageMeta) => void;
  isSelectionMode?: boolean;
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  articles = [],
  onSelectImageForArticle,
  isSelectionMode = false
}) => {
  const [mediaList, setMediaList] = useState<CloudinaryImageMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<CloudinaryImageMeta | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploaderModal, setShowUploaderModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load Cloudinary media library
  const loadMedia = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const folderArg = selectedFolder === 'all' ? undefined : selectedFolder;
    const res = await fetchMediaLibrary(folderArg);

    setIsLoading(false);

    if (res.success && res.resources) {
      setMediaList(res.resources);
    } else {
      setErrorMessage(res.error || 'Không thể lấy dữ liệu thư viện ảnh Cloudinary.');
    }
  };

  useEffect(() => {
    loadMedia();
  }, [selectedFolder]);

  // Extract all image publicIds / secureUrls used in existing articles
  const getUsedImageSet = () => {
    const set = new Set<string>();
    articles.forEach(art => {
      if (typeof art.featuredImage === 'string') {
        set.add(art.featuredImage);
      } else if (art.featuredImage?.publicId) {
        set.add(art.featuredImage.publicId);
        set.add(art.featuredImage.secureUrl);
      }
      if (art.featuredImageMeta?.publicId) {
        set.add(art.featuredImageMeta.publicId);
      }
      // Check image tags in content
      if (art.content) {
        const matches = art.content.match(/src=["']([^"']+)["']/g);
        if (matches) {
          matches.forEach(m => {
            const src = m.replace(/src=["']|["']/g, '');
            set.add(src);
          });
        }
      }
    });
    return set;
  };

  const usedImages = getUsedImageSet();

  // Sync usage set with backend server
  useEffect(() => {
    const ids = Array.from(usedImages);
    syncImageUsageWithServer(ids);
  }, [articles]);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteImage = async (media: CloudinaryImageMeta) => {
    const isUsed = usedImages.has(media.publicId) || usedImages.has(media.secureUrl);

    if (isUsed) {
      alert('⚠️ Không thể xóa hình ảnh!\n\nHình ảnh này đang được sử dụng trong bài viết hoặc nội dung trên hệ thống. Vui lòng gỡ hình ảnh ra khỏi bài viết trước khi tiến hành xóa.');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa tệp ảnh "${media.publicId}" khỏi Cloudinary? Hành động này không thể hoàn tác.`)) {
      return;
    }

    setDeletingId(media.publicId);
    setErrorMessage(null);

    const res = await deleteMediaFromCloudinary(media.publicId, isUsed);

    setDeletingId(null);

    if (res.success) {
      setSuccessMessage('Đã xóa thành công tệp ảnh khỏi Cloudinary.');
      setTimeout(() => setSuccessMessage(null), 4000);
      setMediaList(prev => prev.filter(item => item.publicId !== media.publicId));
      if (previewImage?.publicId === media.publicId) {
        setPreviewImage(null);
      }
    } else {
      alert(res.message || res.error || 'Lỗi khi xóa tệp ảnh.');
    }
  };

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.publicId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.alt && item.alt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-600" /> Thư viện Quản trị Media Cloudinary
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý tập trung tệp ảnh truyền thông, lưu trữ bảo mật trên Cloudinary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadMedia}
            disabled={isLoading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Làm mới thư viện"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} /> Làm mới
          </button>

          <button
            type="button"
            onClick={() => setShowUploaderModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Tải ảnh mới lên
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên publicId, mã ảnh..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Folder Selector */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
          >
            <option value="all">Tất cả thư mục (All)</option>
            <option value="articles">Bài viết (articles)</option>
            <option value="banners">Banners truyền thông</option>
            <option value="events">Sự kiện & Hội thi</option>
            <option value="digital-map">Bản đồ khu phố</option>
            <option value="ho-chi-minh-space">Không gian Hồ Chí Minh</option>
            <option value="avatars">Hình ảnh Đại diện</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" /> {errorMessage}
        </div>
      )}

      {/* Media Grid */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Đang tải thư viện ảnh từ Cloudinary server...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/50">
          <Folder className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Chưa có tệp ảnh nào trong thư mục này</p>
          <p className="text-xs text-slate-500">Bấm nút "Tải ảnh mới lên" để lưu trữ ảnh đầu tiên lên Cloudinary.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((media) => {
            const isUsed = usedImages.has(media.publicId) || usedImages.has(media.secureUrl);

            return (
              <div
                key={media.publicId}
                className="group relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                {/* Image Aspect Box */}
                <div 
                  onClick={() => isSelectionMode && onSelectImageForArticle ? onSelectImageForArticle(media) : setPreviewImage(media)}
                  className="aspect-square bg-slate-200 relative overflow-hidden cursor-pointer"
                >
                  <OptimizedImage
                    src={media.secureUrl}
                    alt={media.publicId}
                    variant="thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  {isUsed && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500/90 text-white font-bold text-[10px] rounded-md shadow-sm">
                      Đang dùng
                    </span>
                  )}

                  {/* Overlay Hover Controls */}
                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 p-2">
                    {isSelectionMode ? (
                      <button
                        type="button"
                        onClick={() => onSelectImageForArticle && onSelectImageForArticle(media)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-md"
                      >
                        Chọn ảnh này
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPreviewImage(media); }}
                          className="p-2 bg-white text-slate-800 rounded-lg hover:bg-slate-100 shadow-sm"
                          title="Xem chi tiết"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleCopyLink(media.secureUrl, media.publicId); }}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                          title="Sao chép URL"
                        >
                          {copiedId === media.publicId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleDeleteImage(media); }}
                          disabled={deletingId === media.publicId}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm disabled:opacity-50"
                          title={isUsed ? 'Ảnh đang sử dụng trong bài viết (Không thể xóa)' : 'Xóa ảnh'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-2.5 bg-white border-t border-slate-100 text-[11px] text-slate-600">
                  <div className="font-semibold text-slate-800 truncate" title={media.publicId}>
                    {media.publicId.split('/').pop()}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>{media.format?.toUpperCase() || 'IMG'}</span>
                    <span>{formatFileSize(media.bytes)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploaderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Tải ảnh mới lên Cloudinary
              </h3>
              <button
                type="button"
                onClick={() => setShowUploaderModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <MediaUploader
              folder={selectedFolder === 'all' ? 'articles' : selectedFolder}
              label="Chọn ảnh từ máy tính hoặc kéo thả"
              onImageUploaded={(img) => {
                setMediaList(prev => [img, ...prev]);
                setShowUploaderModal(false);
                setSuccessMessage('Tải ảnh thành công!');
                setTimeout(() => setSuccessMessage(null), 3000);
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowUploaderModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 truncate">
                Chi tiết ảnh: {previewImage.publicId}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-100 rounded-2xl overflow-hidden max-h-80 flex items-center justify-center p-2 border border-slate-200">
              <OptimizedImage
                src={previewImage.secureUrl}
                alt={previewImage.publicId}
                variant="article"
                priority={true}
                className="max-h-72 object-contain w-auto mx-auto rounded-lg"
              />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Định dạng</span>
                <span className="font-bold text-slate-800">{previewImage.format?.toUpperCase() || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Kích thước</span>
                <span className="font-bold text-slate-800">{previewImage.width && previewImage.height ? `${previewImage.width} × ${previewImage.height} px` : 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Dung lượng</span>
                <span className="font-bold text-slate-800">{formatFileSize(previewImage.bytes)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Thư mục</span>
                <span className="font-bold text-blue-600 truncate block">{previewImage.publicId.split('/')[0]}</span>
              </div>
            </div>

            {/* URL input with copy */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Cloudinary Secure URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={previewImage.secureUrl}
                  className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-700 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopyLink(previewImage.secureUrl, previewImage.publicId)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedId === previewImage.publicId ? 'Đã sao chép' : 'Sao chép'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <a
                href={previewImage.secureUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Mở ảnh gốc trong tab mới
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteImage(previewImage)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa ảnh khỏi Cloudinary
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
