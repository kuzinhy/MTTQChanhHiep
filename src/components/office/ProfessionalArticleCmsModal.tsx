// Professional CMS Article Editor for Ward Digital Office (Chánh Hiệp)
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Image as ImageIcon, Video, FileText, Check, Save, Send, Sparkles, 
  Trash2, History, Calendar, Clock, Eye, Star, Tag, Layers, ArrowLeft, 
  Maximize2, Plus, RefreshCw, Upload, AlertCircle, Link2, Bold, Italic, 
  Underline, List, ListOrdered, Quote, Heading1, Heading2, Heading3, 
  RotateCcw, Redo, Undo, Search, Filter, ShieldCheck, CheckCircle2, ChevronRight,
  ExternalLink, Smartphone, Monitor, Share2, Crop, Sliders,
  HardDrive, Cloud, FolderOpen, Loader2
} from 'lucide-react';
import { 
  Article, ArticleCategory, ArticleStatus, ArticleCoverImage, 
  ArticleGalleryItem, ArticleVersionHistory 
} from '../../types';
import { OptimizedImage } from '../common/OptimizedImage';
import { AppStorageEngine } from '../../lib/storage';
import { fetchMediaLibrary } from '../../lib/cloudinaryService';
import { canPublishPost, canEditPost, canDeletePost } from '../../services/permissionService';
import { 
  uploadFileToGoogleDrive, 
  getGoogleDriveDirectImageUrl, 
  extractGoogleDriveFileId,
  CHANH_HIEP_DRIVE_FOLDERS,
  DEFAULT_DRIVE_FOLDER_ID,
  DEFAULT_DRIVE_FOLDER_URL
} from '../../lib/googleDriveService';

interface ProfessionalArticleCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleToEdit: Article | null;
  onSave: (articlePayload: Partial<Article>, continueEditing?: boolean) => void;
  onShowToast?: (msg: string) => void;
}

const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'Hoạt động Mặt trận',
  'Hoạt động khu phố',
  'An sinh xã hội',
  'Đại đoàn kết',
  'Dân vận',
  'Giám sát - Phản biện',
  'Tuyên truyền',
  'Phong trào thi đua',
  'Học tập và làm theo Bác',
  'Tuyên truyền & Nghị quyết',
  'Tuyên truyền & Pháp luật',
  'Chuyển đổi số',
  'Dân vận khéo',
  'Khu phố đoàn kết'
];

// Helper: generate SEO friendly slug
const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Helper: Client-side Image Compression to WebP & Thumbnail creation
const compressImageToWebp = async (
  file: File, 
  maxWidth = 1600, 
  maxHeight = 1200, 
  quality = 0.85
): Promise<{ dataUrl: string; thumbnailUrl: string; sizeBytes: number; format: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ 
            dataUrl: event.target?.result as string, 
            thumbnailUrl: event.target?.result as string, 
            sizeBytes: file.size, 
            format: 'image/jpeg' 
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/webp', quality);
        const sizeBytes = Math.round((dataUrl.length * 3) / 4);

        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 320;
        thumbCanvas.height = 180;
        const thumbCtx = thumbCanvas.getContext('2d');
        if (thumbCtx) {
          thumbCtx.drawImage(img, 0, 0, 320, 180);
          const thumbnailUrl = thumbCanvas.toDataURL('image/webp', 0.7);
          resolve({ dataUrl, thumbnailUrl, sizeBytes, format: 'image/webp' });
        } else {
          resolve({ dataUrl, thumbnailUrl: dataUrl, sizeBytes, format: 'image/webp' });
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ProfessionalArticleCmsModal: React.FC<ProfessionalArticleCmsModalProps> = ({
  isOpen,
  onClose,
  articleToEdit,
  onSave,
  onShowToast
}) => {
  // Basic State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('Hoạt động Mặt trận');
  const [tags, setTags] = useState<string[]>(['Mặt trận', 'Chánh Hiệp']);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<ArticleStatus>('Draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  // Scheduled Publishing State
  const [scheduledPublishAt, setScheduledPublishAt] = useState('');

  // Cover Image State (1 image only, crop/preview, 16:9 ratio, ALT, Caption)
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [coverImageCaption, setCoverImageCaption] = useState('');
  const [coverImageThumbnail, setCoverImageThumbnail] = useState('');
  const [coverCropRatio, setCoverCropRatio] = useState<'16:9' | '4:3' | 'original'>('16:9');
  const [coverFocalPoint, setCoverFocalPoint] = useState<'center' | 'top' | 'bottom'>('center');

  // Gallery Images State (Grid 2/3 cols, lightbox, alt, caption)
  const [gallery, setGallery] = useState<ArticleGalleryItem[]>([]);
  const [galleryColumns, setGalleryColumns] = useState<2 | 3>(3);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Inline Content Image Insertion Modal State
  const [showInsertImageModal, setShowInsertImageModal] = useState(false);
  const [insertImageUrl, setInsertImageUrl] = useState('');
  const [insertImageAlt, setInsertImageAlt] = useState('');
  const [insertImageCaption, setInsertImageCaption] = useState('');
  const [insertImageAlign, setInsertImageAlign] = useState<'center' | 'left' | 'right'>('center');
  const [insertImageWidth, setInsertImageWidth] = useState<'100%' | '75%' | '50%' | '300px'>('100%');
  const [isCompressingInline, setIsCompressingInline] = useState(false);

  // Google Drive & Upload States inside Insert Image Modal
  const [insertImageTab, setInsertImageTab] = useState<'drive' | 'compress' | 'url'>('drive');
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [driveUploadError, setDriveUploadError] = useState<string | null>(null);
  const [driveUploadSuccess, setDriveUploadSuccess] = useState<string | null>(null);
  const [selectedDriveFolderId, setSelectedDriveFolderId] = useState<string>(DEFAULT_DRIVE_FOLDER_ID);
  const [driveInputLink, setDriveInputLink] = useState('');
  const [isUploadingCoverToDrive, setIsUploadingCoverToDrive] = useState(false);

  // Media Library Picker Modal State
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [mediaTargetType, setMediaTargetType] = useState<'cover' | 'inline' | 'gallery'>('cover');
  const [mediaLibraryItems, setMediaLibraryItems] = useState<any[]>([]);
  const [mediaSearchTerm, setMediaSearchTerm] = useState('');
  const [mediaFilterType, setMediaFilterType] = useState<'all' | 'image' | 'video' | 'file'>('all');
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Version History & Autosave State
  const [versions, setVersions] = useState<ArticleVersionHistory[]>([]);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [lastAutosaveTime, setLastAutosaveTime] = useState<string>('');

  // Live Preview & Open Graph Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewTab, setPreviewTab] = useState<'article' | 'opengraph' | 'card'>('article');

  // Undo / Redo Stacks
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Active Tab for Mobile / Responsive
  const [mobileTab, setMobileTab] = useState<'editor' | 'media' | 'settings'>('editor');

  // Auth / Permissions Check
  const currentUser = AppStorageEngine.getCurrentUser();
  const canPublish = canPublishPost(currentUser);

  // Load article data when opened
  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title || '');
      setSlug(articleToEdit.slug || generateSlug(articleToEdit.title || ''));
      setSummary(articleToEdit.summary || '');
      setContent(articleToEdit.content || '');
      setCategory(articleToEdit.category || 'Hoạt động Mặt trận');
      setTags(articleToEdit.tags || ['Mặt trận', 'Chánh Hiệp']);
      setStatus(articleToEdit.status || 'Draft');
      setIsFeatured(!!articleToEdit.isFeatured);
      setOriginalUrl(articleToEdit.originalUrl || '');
      setVideoUrl(articleToEdit.videoUrl || '');
      setAttachmentUrl(articleToEdit.attachment || '');
      setAttachmentName(articleToEdit.attachmentName || '');
      setScheduledPublishAt(articleToEdit.scheduledPublishAt || '');

      if (articleToEdit.coverImage) {
        setCoverImageUrl(articleToEdit.coverImage.url || '');
        setCoverImageAlt(articleToEdit.coverImage.alt || '');
        setCoverImageCaption(articleToEdit.coverImage.caption || '');
        setCoverImageThumbnail(articleToEdit.coverImage.thumbnailUrl || '');
      } else if (typeof articleToEdit.featuredImage === 'string') {
        setCoverImageUrl(articleToEdit.featuredImage);
        setCoverImageAlt(articleToEdit.title);
      } else if (articleToEdit.featuredImage && typeof articleToEdit.featuredImage === 'object') {
        setCoverImageUrl(articleToEdit.featuredImage.secureUrl);
        setCoverImageAlt(articleToEdit.featuredImage.alt || '');
        setCoverImageCaption(articleToEdit.featuredImage.caption || '');
      }

      if (articleToEdit.gallery && Array.isArray(articleToEdit.gallery)) {
        setGallery(articleToEdit.gallery);
      } else {
        setGallery([]);
      }

      if (articleToEdit.versions && Array.isArray(articleToEdit.versions)) {
        setVersions(articleToEdit.versions);
      } else {
        setVersions([
          {
            id: 'v-' + Date.now(),
            title: articleToEdit.title || 'Bản gốc khởi tạo',
            content: articleToEdit.content || '',
            summary: articleToEdit.summary || '',
            savedAt: new Date().toLocaleTimeString('vi-VN'),
            authorName: articleToEdit.authorName || 'Biên tập viên'
          }
        ]);
      }
    } else {
      setTitle('');
      setSlug('');
      setSummary('');
      setContent('');
      setCategory('Hoạt động Mặt trận');
      setTags(['Mặt trận', 'Chánh Hiệp']);
      setStatus('Draft');
      setIsFeatured(false);
      setOriginalUrl('');
      setVideoUrl('');
      setAttachmentUrl('');
      setAttachmentName('');
      setCoverImageUrl('');
      setCoverImageAlt('');
      setCoverImageCaption('');
      setCoverImageThumbnail('');
      setGallery([]);
      setVersions([]);
      setScheduledPublishAt('');
    }
  }, [articleToEdit, isOpen]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!articleToEdit) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Periodic Autosave (every 30 seconds): does NOT overwrite 'Published' status if live
  useEffect(() => {
    if (!isOpen || !title.trim()) return;

    const interval = setInterval(() => {
      const nowStr = new Date().toLocaleTimeString('vi-VN');
      setLastAutosaveTime(nowStr);

      const snapshot: ArticleVersionHistory = {
        id: 'auto-' + Date.now(),
        title,
        content,
        summary,
        savedAt: nowStr,
        authorName: currentUser?.fullname || 'Cán bộ biên tập'
      };

      setVersions(prev => [snapshot, ...prev.slice(0, 15)]);

      try {
        const draftBackup = {
          title,
          slug,
          summary,
          content,
          category,
          tags,
          coverImageUrl,
          coverImageAlt,
          coverImageCaption,
          gallery,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem('cms_article_draft_autosave', JSON.stringify(draftBackup));
      } catch (err) {
        console.warn('LocalStorage autosave failed:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, title, slug, summary, content, category, tags, coverImageUrl, coverImageAlt, coverImageCaption, gallery]);

  const loadMediaLibrary = async () => {
    setIsLoadingMedia(true);
    try {
      const res = await fetchMediaLibrary();
      setMediaLibraryItems(res.resources || []);
    } catch (err) {
      console.error('Failed to load media library:', err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  useEffect(() => {
    if (isMediaLibraryOpen) {
      loadMediaLibrary();
    }
  }, [isMediaLibraryOpen]);

  const insertAtCursor = (before: string, after = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousContent = textarea.value;
    const selectedText = previousContent.substring(start, end);

    setUndoStack(prev => [...prev, previousContent]);
    setRedoStack([]);

    const newContent = 
      previousContent.substring(0, start) + 
      before + selectedText + after + 
      previousContent.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 10);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, content]);
    setUndoStack(u => u.slice(0, -1));
    setContent(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, content]);
    setRedoStack(r => r.slice(0, -1));
    setContent(next);
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh dung lượng dưới 10MB!');
      return;
    }

    try {
      setIsUploadingMedia(true);
      const compressed = await compressImageToWebp(file, 1600, 900, 0.85);
      setCoverImageUrl(compressed.dataUrl);
      setCoverImageThumbnail(compressed.thumbnailUrl);
      if (!coverImageAlt) {
        setCoverImageAlt(file.name.replace(/\.[^/.]+$/, ''));
      }
      onShowToast?.(`Đã nén ảnh xuống ${(compressed.sizeBytes / 1024).toFixed(0)} KB (WebP chuẩn) thành công!`);
    } catch (err) {
      console.error('Image compression error:', err);
      alert('Lỗi nén ảnh, vui lòng thử lại!');
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingMedia(true);
    try {
      const newItems: ArticleGalleryItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) continue;
        const compressed = await compressImageToWebp(file, 1400, 1050, 0.85);
        newItems.push({
          id: 'gal-' + Date.now() + '-' + i,
          url: compressed.dataUrl,
          thumbnailUrl: compressed.thumbnailUrl,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          caption: '',
          order: gallery.length + i + 1
        });
      }
      setGallery(prev => [...prev, ...newItems]);
      onShowToast?.(`Đã thêm ${newItems.length} ảnh vào Gallery bộ sưu tập!`);
    } catch (err) {
      console.error('Gallery upload error:', err);
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleUploadInlineToDrive = async (file: File) => {
    if (!file) return;
    setIsUploadingToDrive(true);
    setDriveUploadError(null);
    setDriveUploadSuccess(null);
    try {
      const result = await uploadFileToGoogleDrive(file, selectedDriveFolderId);
      const directUrl = getGoogleDriveDirectImageUrl(result.id || result.webViewLink);
      setInsertImageUrl(directUrl || result.webViewLink);
      if (!insertImageAlt) {
        setInsertImageAlt(file.name.replace(/\.[^/.]+$/, ''));
      }
      setDriveUploadSuccess(`Tải lên Google Drive thành công: "${file.name}"`);
    } catch (err: any) {
      console.error('Lỗi khi tải ảnh lên Google Drive:', err);
      setDriveUploadError(err.message || 'Không thể tải lên Google Drive. Vui lòng kiểm tra quyền hoặc thử lại.');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  const handleApplyDriveLink = () => {
    if (!driveInputLink.trim()) return;
    const directUrl = getGoogleDriveDirectImageUrl(driveInputLink.trim());
    if (directUrl) {
      setInsertImageUrl(directUrl);
      setDriveUploadSuccess('Đã chuyển đổi liên kết Google Drive sang ảnh hiển thị tốc độ cao (CDN)!');
      setDriveUploadError(null);
    } else {
      setDriveUploadError('Không thể nhận diện liên kết Google Drive hợp lệ.');
    }
  };

  const handleCoverDriveUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCoverToDrive(true);
    try {
      const result = await uploadFileToGoogleDrive(file, DEFAULT_DRIVE_FOLDER_ID);
      const directUrl = getGoogleDriveDirectImageUrl(result.id || result.webViewLink);
      setCoverImageUrl(directUrl || result.webViewLink);
      if (!coverImageAlt) setCoverImageAlt(file.name.replace(/\.[^/.]+$/, ''));
      if (onShowToast) onShowToast('Đã tải ảnh đại diện lên Google Drive thành công!');
    } catch (err: any) {
      console.error(err);
      alert('Tải ảnh đại diện lên Google Drive thất bại: ' + err.message);
    } finally {
      setIsUploadingCoverToDrive(false);
      e.target.value = '';
    }
  };

  const handleInsertInlineImage = () => {
    if (!insertImageUrl) {
      alert('Vui lòng nhập đường dẫn ảnh hoặc tải ảnh lên!');
      return;
    }

    let alignClass = 'text-center my-6';
    let floatStyle = '';
    if (insertImageAlign === 'left') {
      alignClass = 'float-left mr-6 mb-4 max-w-[50%]';
      floatStyle = 'style="float: left; margin: 0 1.5rem 1rem 0;"';
    } else if (insertImageAlign === 'right') {
      alignClass = 'float-right ml-6 mb-4 max-w-[50%]';
      floatStyle = 'style="float: right; margin: 0 0 1rem 1.5rem;"';
    } else {
      alignClass = 'my-6 mx-auto text-center';
    }

    const captionHtml = insertImageCaption 
      ? `\n<figcaption class="text-xs text-slate-500 italic mt-2 text-center">${insertImageCaption}</figcaption>` 
      : '';

    const imgTag = `\n<figure class="${alignClass}" ${floatStyle}>\n  <img src="${insertImageUrl}" alt="${insertImageAlt || 'Hình ảnh minh họa'}" loading="lazy" decoding="async" style="width: ${insertImageWidth}; max-width: 100%; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" />${captionHtml}\n</figure>\n`;

    insertAtCursor(imgTag);
    setShowInsertImageModal(false);
    setInsertImageUrl('');
    setInsertImageAlt('');
    setInsertImageCaption('');
  };

  const generateStructuredContent = (rawContent: string) => {
    const blocks: any[] = [];
    const lines = rawContent.split('\n');
    let currentParagraph = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (currentParagraph) {
          blocks.push({ type: 'paragraph', text: currentParagraph });
          currentParagraph = '';
        }
        continue;
      }

      if (trimmed.startsWith('# ')) {
        if (currentParagraph) { blocks.push({ type: 'paragraph', text: currentParagraph }); currentParagraph = ''; }
        blocks.push({ type: 'heading', level: 1, text: trimmed.replace('# ', '') });
      } else if (trimmed.startsWith('## ')) {
        if (currentParagraph) { blocks.push({ type: 'paragraph', text: currentParagraph }); currentParagraph = ''; }
        blocks.push({ type: 'heading', level: 2, text: trimmed.replace('## ', '') });
      } else if (trimmed.startsWith('### ')) {
        if (currentParagraph) { blocks.push({ type: 'paragraph', text: currentParagraph }); currentParagraph = ''; }
        blocks.push({ type: 'heading', level: 3, text: trimmed.replace('### ', '') });
      } else if (trimmed.startsWith('> ')) {
        if (currentParagraph) { blocks.push({ type: 'paragraph', text: currentParagraph }); currentParagraph = ''; }
        blocks.push({ type: 'quote', text: trimmed.replace('> ', '') });
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (currentParagraph) { blocks.push({ type: 'paragraph', text: currentParagraph }); currentParagraph = ''; }
        blocks.push({ type: 'list-item', text: trimmed.substring(2) });
      } else {
        currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
      }
    }
    if (currentParagraph) {
      blocks.push({ type: 'paragraph', text: currentParagraph });
    }

    return {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      blocks
    };
  };

  const handleSave = (targetStatus: ArticleStatus, continueEditing = false) => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }

    const finalSlug = slug.trim() || generateSlug(title);
    const finalSummary = summary.trim() || content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';

    let effectiveStatus: ArticleStatus = targetStatus;
    if (targetStatus === 'Published' && !canPublish) {
      effectiveStatus = 'Pending Review';
      onShowToast?.('Bài viết đã được gửi duyệt lên Lãnh đạo do bạn chưa có quyền xuất bản trực tiếp.');
    }

    const coverImageObj: ArticleCoverImage | undefined = coverImageUrl ? {
      url: coverImageUrl,
      alt: coverImageAlt || title,
      caption: coverImageCaption,
      aspectRatio: coverCropRatio,
      thumbnailUrl: coverImageThumbnail || coverImageUrl
    } : undefined;

    const payload: Partial<Article> = {
      title,
      slug: finalSlug,
      summary: finalSummary,
      content,
      contentStructured: generateStructuredContent(content),
      category,
      tags,
      status: effectiveStatus,
      isFeatured,
      originalUrl,
      videoUrl,
      attachment: attachmentUrl,
      attachmentName,
      coverImage: coverImageObj,
      featuredImage: coverImageUrl || undefined,
      gallery,
      versions,
      scheduledPublishAt: scheduledPublishAt || undefined,
      publishDate: scheduledPublishAt ? scheduledPublishAt.split('T')[0] : new Date().toISOString().split('T')[0],
      publishedAt: effectiveStatus === 'Published' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };

    onSave(payload, continueEditing);

    if (continueEditing) {
      onShowToast?.('Đã lưu dữ liệu bài viết thành công! Bạn có thể tiếp tục chỉnh sửa.');
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-50 w-full max-w-7xl rounded-3xl shadow-2xl border border-slate-300 flex flex-col max-h-[96vh] overflow-hidden">
        
        {/* HEADER */}
        <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {articleToEdit ? 'Biên Tập Bài Viết Chuyên Nghiệp' : 'Đăng Tin Bài CMS Chuyên Nghiệp'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                  CMS v2.4
                </span>
                {lastAutosaveTime && (
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã lưu tự động lúc {lastAutosaveTime}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Tách riêng Cover, Nội dung rich text, Gallery ảnh, Thư viện Media & Tự động tối ưu WebP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowVersionHistoryModal(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Xem lại lịch sử các phiên bản bài viết"
            >
              <History className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">Lịch sử ({versions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Xem trước giao diện Cổng tin tức & Open Graph"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Xem trước</span>
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

        {/* MOBILE TAB BAR */}
        <div className="lg:hidden flex border-b border-slate-200 bg-white px-3 py-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-1.5 rounded-lg text-center ${mobileTab === 'editor' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Trình soạn thảo
          </button>
          <button
            onClick={() => setMobileTab('media')}
            className={`flex-1 py-1.5 rounded-lg text-center ${mobileTab === 'media' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Ảnh bìa & Gallery
          </button>
          <button
            onClick={() => setMobileTab('settings')}
            className={`flex-1 py-1.5 rounded-lg text-center ${mobileTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Cấu hình & SEO
          </button>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Metadata, Cover Image, Gallery & Attachments */}
          <div className={`space-y-5 lg:col-span-5 ${mobileTab !== 'media' && mobileTab !== 'settings' ? 'hidden lg:block' : ''}`}>
            
            {/* 1. COVER IMAGE MANAGER */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  1. Ảnh đại diện bài viết (Chỉ 1 ảnh)
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200">
                  Tỷ lệ chuẩn 16:9
                </span>
              </div>

              {coverImageUrl ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-inner">
                    <img 
                      src={coverImageUrl} 
                      alt={coverImageAlt || title} 
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        coverFocalPoint === 'top' ? 'object-top' : coverFocalPoint === 'bottom' ? 'object-bottom' : 'object-center'
                      }`}
                    />
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTargetType('cover');
                          setIsMediaLibraryOpen(true);
                        }}
                        className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-xl shadow-md hover:bg-slate-100 cursor-pointer"
                      >
                        Đổi ảnh từ thư viện
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImageUrl('');
                          setCoverImageAlt('');
                          setCoverImageCaption('');
                          setCoverImageThumbnail('');
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-rose-700 cursor-pointer"
                      >
                        Gỡ bỏ
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-[10px] text-white font-medium rounded-md">
                      Tỷ lệ 16:9 • Dùng cho Card tin & Open Graph
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="font-bold text-[11px] flex items-center gap-1">
                      <Crop className="w-3.5 h-3.5 text-blue-600" />
                      Tiêu điểm:
                    </span>
                    <div className="flex gap-1">
                      {(['top', 'center', 'bottom'] as const).map(pt => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setCoverFocalPoint(pt)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md capitalize cursor-pointer ${coverFocalPoint === pt ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                        >
                          {pt === 'center' ? 'Giữa' : pt === 'top' ? 'Trên' : 'Dưới'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-0.5">
                        Văn bản thay thế (ALT Text cho SEO & Trợ năng)
                      </label>
                      <input
                        type="text"
                        placeholder="Mô tả nội dung bức ảnh..."
                        value={coverImageAlt}
                        onChange={(e) => setCoverImageAlt(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-700 block mb-0.5">
                        Chú thích ảnh bìa (Caption)
                      </label>
                      <input
                        type="text"
                        placeholder="Chú thích hiển thị dưới ảnh đại diện..."
                        value={coverImageCaption}
                        onChange={(e) => setCoverImageCaption(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div 
                    onClick={() => {
                      setMediaTargetType('cover');
                      setIsMediaLibraryOpen(true);
                    }}
                    className="aspect-video border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50/40 transition-all cursor-pointer group"
                  >
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xs text-slate-800">Chọn ảnh đại diện bài viết</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 text-center">
                      Tải lên từ máy hoặc chọn từ Thư viện Media (Tự động nén WebP)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <label className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Tải từ máy (WebP)</span>
                      <input type="file" accept="image/*" onChange={handleCoverFileUpload} className="hidden" />
                    </label>
                    <label className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm transition-colors">
                      {isUploadingCoverToDrive ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <HardDrive className="w-4 h-4" />
                      )}
                      <span>{isUploadingCoverToDrive ? 'Đang tải Drive...' : 'Tải lên Drive'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCoverDriveUpload} 
                        disabled={isUploadingCoverToDrive} 
                        className="hidden" 
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTargetType('cover');
                        setIsMediaLibraryOpen(true);
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shrink-0"
                    >
                      Thư viện
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. GALLERY MANAGER */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  2. Gallery Ảnh ({gallery.length} ảnh)
                </span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setGalleryColumns(2)}
                    className={`px-2 py-0.5 rounded ${galleryColumns === 2 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    2 Cột
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryColumns(3)}
                    className={`px-2 py-0.5 rounded ${galleryColumns === 3 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    3 Cột
                  </button>
                </div>
              </div>

              {gallery.length > 0 ? (
                <div className="space-y-3">
                  <div className={`grid ${galleryColumns === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2 max-h-56 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200`}>
                    {gallery.map((img, idx) => (
                      <div key={img.id || idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group bg-slate-900">
                        <img 
                          src={img.thumbnailUrl || img.url} 
                          alt={img.alt || `Ảnh ${idx + 1}`} 
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setLightboxIndex(idx)}
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => setGallery(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                          title="Gỡ ảnh"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/70 p-1 text-[9px] text-white truncate text-center">
                          {img.caption || `Ảnh ${idx + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl cursor-pointer text-center flex items-center justify-center gap-1 border border-purple-200">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm nhiều ảnh từ máy tính</span>
                      <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTargetType('gallery');
                        setIsMediaLibraryOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Từ Thư viện
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2 bg-slate-50">
                  <p className="text-xs text-slate-600 font-medium">Chưa có ảnh trong Bộ sưu tập Gallery</p>
                  <div className="flex items-center justify-center gap-2">
                    <label className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm hover:bg-purple-700 inline-flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh lên Gallery</span>
                      <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTargetType('gallery');
                        setIsMediaLibraryOpen(true);
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50"
                    >
                      Chọn từ Thư viện
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. WORKFLOW & PUBLISH CONFIG */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                3. Cấu hình & Quy trình xuất bản (Workflow)
              </span>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chuyên mục bài viết</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 cursor-pointer"
                  >
                    {ARTICLE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Trạng thái phê duyệt (Workflow)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Draft">📝 Bản nháp (DRAFT)</option>
                    <option value="Pending Review">⏳ Chờ duyệt (PENDING_REVIEW)</option>
                    <option value="Approved">✅ Đã duyệt (APPROVED)</option>
                    <option value="Published" disabled={!canPublish}>
                      🟢 Xuất bản công khai (PUBLISHED) {!canPublish ? '(Yêu cầu quyền Lãnh đạo)' : ''}
                    </option>
                    <option value="Archived">📦 Lưu trữ (ARCHIVED)</option>
                  </select>
                </div>

                {/* Scheduled Publishing */}
                <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      Lên lịch đăng bài tự động
                    </span>
                    {scheduledPublishAt && (
                      <button
                        type="button"
                        onClick={() => setScheduledPublishAt('')}
                        className="text-[10px] text-rose-600 font-bold hover:underline"
                      >
                        Hủy lịch
                      </button>
                    )}
                  </div>
                  <input
                    type="datetime-local"
                    value={scheduledPublishAt}
                    onChange={(e) => setScheduledPublishAt(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-blue-300 rounded-lg text-slate-800"
                  />
                  {scheduledPublishAt && (
                    <p className="text-[10px] text-blue-700 italic">
                      Bài viết sẽ tự động lên trang nhất vào ngày giờ đã định.
                    </p>
                  )}
                </div>

                {/* Tags input */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thẻ từ khóa (Tags)</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {tags.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                        #{t}
                        <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="hover:text-rose-600">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Thêm tag mới..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                            setTags([...tags, tagInput.trim()]);
                            setTagInput('');
                          }
                        }
                      }}
                      className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                          setTags([...tags, tagInput.trim()]);
                          setTagInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Attached file & video url */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">Link Video (YouTube/Facebook)</label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">Tài liệu đính kèm (PDF / DOCX)</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Title, Summary & Professional Rich Text Editor */}
          <div className={`space-y-4 lg:col-span-7 flex flex-col ${mobileTab !== 'editor' ? 'hidden lg:flex' : ''}`}>
            
            {/* Title & Slug */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div>
                <label className="text-xs font-black text-slate-800 block mb-1">
                  Tiêu đề bài viết <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề tin tức, thông báo hoặc hoạt động phường..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-base md:text-lg font-black px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Đường dẫn tĩnh (Slug URL)</label>
                  <input
                    type="text"
                    placeholder="tieu-de-bai-viet"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Tóm tắt ngắn (Sapo / Summary) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Tóm tắt hiển thị trên card tin và Open Graph..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>

            {/* RICH TEXT EDITOR WITH FULL TOOLBAR */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden min-h-[460px]">
              
              {/* Toolbar */}
              <div className="px-3 py-2.5 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-1.5 shrink-0">
                <div className="flex items-center gap-1 flex-wrap">
                  
                  {/* Headings */}
                  <button
                    type="button"
                    onClick={() => insertAtCursor('# ')}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-700 font-bold text-xs"
                    title="Tiêu đề H1"
                  >
                    <Heading1 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor('## ')}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-700 font-bold text-xs"
                    title="Tiêu đề H2"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor('### ')}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-700 font-bold text-xs"
                    title="Tiêu đề H3"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>

                  {/* Formatting */}
                  <button
                    type="button"
                    onClick={() => insertAtCursor('**', '**')}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-700 font-bold"
                    title="In đậm (Bold)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor('*', '*')}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-700 italic"
                    title="In nghiêng (Italic)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor('<u>', '</u>')}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-700 underline"
                    title="Gạch chân (Underline)"
                  >
                    <Underline className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>

                  {/* Lists & Quotes */}
                  <button
                    type="button"
                    onClick={() => insertAtCursor('- ')}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                    title="Danh sách dấu chấm (Bullet List)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor('1. ')}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                    title="Danh sách đánh số (Ordered List)"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor('> ')}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                    title="Trích dẫn (Quote)"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Nhập đường dẫn liên kết URL:');
                      if (url) {
                        const linkText = prompt('Nhập văn bản hiển thị:') || url;
                        insertAtCursor(`[${linkText}](${url})`);
                      }
                    }}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                    title="Chèn liên kết (Link)"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>

                  {/* MEDIA INSERTION BUTTONS */}
                  <button
                    type="button"
                    onClick={() => {
                      setInsertImageTab('drive');
                      setDriveUploadError(null);
                      setDriveUploadSuccess(null);
                      setShowInsertImageModal(true);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-blue-500/30 ring-1 ring-blue-400/20"
                    title="Chèn ảnh vào nội dung (Tải lên Google Drive, Nén WebP hoặc chọn từ Thư viện)"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-blue-100" />
                    <span>Chèn ảnh bài viết</span>
                    <span className="px-1.5 py-0.5 bg-white/20 hover:bg-white/30 text-[10px] font-bold rounded-md flex items-center gap-1 backdrop-blur-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Drive
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMediaTargetType('inline');
                      setIsMediaLibraryOpen(true);
                    }}
                    className="px-2.5 py-1 bg-slate-200/80 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    title="Mở Thư viện Media chọn nhanh"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Media Library</span>
                  </button>

                </div>

                {/* Undo / Redo */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Hoàn tác (Undo)"
                  >
                    <Undo className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Làm lại (Redo)"
                  >
                    <Redo className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Textarea Editor */}
              <div className="flex-1 p-4 flex flex-col min-h-[360px]">
                <textarea
                  ref={contentTextareaRef}
                  value={content}
                  onChange={(e) => {
                    setUndoStack(prev => [...prev, content]);
                    setRedoStack([]);
                    setContent(e.target.value);
                  }}
                  placeholder="Nhập nội dung bài viết chi tiết tại đây (Hỗ trợ định dạng Rich Text, chèn ảnh có ALT & Caption, căn lề, danh sách, trích dẫn)..."
                  className="w-full flex-1 bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 leading-relaxed focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden font-normal resize-none"
                />
              </div>

              {/* Word count & Original URL Source */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span>Số từ: <strong>{content.trim() ? content.trim().split(/\s+/).length : 0}</strong></span>
                  <span>Ký tự: <strong>{content.length}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-600">Nguồn bài viết gốc:</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="text-xs px-2 py-1 bg-white border border-slate-300 rounded-lg w-48 font-mono"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* MODAL FOOTER: ALL 6 WORKFLOW BUTTONS */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
            <span className="font-semibold text-slate-700">CMS Phường Chánh Hiệp</span>
            <span className="hidden md:inline text-slate-400">• Tự động đồng bộ chuẩn Open Graph & Card tin</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-slate-600" />
              <span>Lưu nháp</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(status, true)}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black rounded-xl border border-blue-200 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Lưu dữ liệu mà không đóng cửa sổ để tiếp tục viết"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Lưu & tiếp tục</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Xem trước</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('Pending Review')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi duyệt</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!scheduledPublishAt) {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(8, 0, 0, 0);
                  setScheduledPublishAt(tomorrow.toISOString().substring(0, 16));
                }
                handleSave('Approved');
                onShowToast?.('Đã lên lịch đăng bài viết thành công!');
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Lên lịch đăng</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('Published')}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{articleToEdit ? 'Lưu & Xuất bản ngay' : 'Đăng bài ngay'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* MODAL: CHÈN ẢNH VÀO NỘI DUNG */}
      {showInsertImageModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 md:p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-5 md:p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-xs">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                    Chèn Ảnh Vào Bài Viết
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-bold rounded-md border border-emerald-200 flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-emerald-600" />
                      Google Drive
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Tải ảnh lên Google Drive Phường Chánh Hiệp, nén WebP hoặc chọn từ Thư viện</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowInsertImageModal(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Source Selection Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setInsertImageTab('drive')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  insertImageTab === 'drive'
                    ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Drive</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-emerald-100 text-emerald-800 rounded font-black hidden sm:inline">Khuyên dùng</span>
              </button>

              <button
                type="button"
                onClick={() => setInsertImageTab('compress')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  insertImageTab === 'compress'
                    ? 'bg-white text-blue-700 shadow-xs border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Nén WebP từ máy</span>
              </button>

              <button
                type="button"
                onClick={() => setInsertImageTab('url')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  insertImageTab === 'url'
                    ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Link URL / Khác</span>
              </button>
            </div>

            {/* TAB CONTENT: GOOGLE DRIVE */}
            {insertImageTab === 'drive' && (
              <div className="space-y-3 p-4 bg-emerald-50/40 border border-emerald-200/70 rounded-2xl">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-emerald-600" />
                    Tải ảnh lên Google Drive Phường Chánh Hiệp:
                  </span>
                  <a
                    href={DEFAULT_DRIVE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>Mở thư mục Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Destination Folder Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Thư mục lưu trữ trên Google Drive:
                  </label>
                  <select
                    value={selectedDriveFolderId}
                    onChange={(e) => setSelectedDriveFolderId(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-emerald-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value={DEFAULT_DRIVE_FOLDER_ID}>Thư mục Chung (Kho Dữ Liệu Số Chánh Hiệp)</option>
                    {CHANH_HIEP_DRIVE_FOLDERS.map((f) => (
                      <option key={f.code} value={f.id}>
                        {f.name} — {f.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload File Box */}
                <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-4 bg-white text-center transition-colors">
                  {isUploadingToDrive ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                      <p className="text-xs font-black text-emerald-800">Đang tải ảnh lên Google Drive...</p>
                      <p className="text-[11px] text-slate-500">Tự động cấu hình quyền chia sẻ và tạo liên kết trực tiếp CDN</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-10 h-10 mx-auto bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-2">
                        <HardDrive className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 mb-1">
                        Chọn tệp ảnh từ máy tính để tải trực tiếp lên Google Drive
                      </p>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Hỗ trợ PNG, JPG, JPEG, WEBP, GIF (Tối đa 15MB)
                      </p>
                      <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all active:scale-95">
                        <Upload className="w-4 h-4" />
                        <span>Tải ảnh lên Google Drive</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadInlineToDrive(file);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Drive Link Pasting / Converter */}
                <div className="pt-2 border-t border-emerald-200/60">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Hoặc dán liên kết Google Drive đã có sẵn:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Dán link drive.google.com/file/d/... hoặc ID tệp Drive"
                      value={driveInputLink}
                      onChange={(e) => setDriveInputLink(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDriveLink}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Áp dụng link
                    </button>
                  </div>
                </div>

                {driveUploadSuccess && (
                  <div className="p-2.5 bg-emerald-100/80 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{driveUploadSuccess}</span>
                  </div>
                )}

                {driveUploadError && (
                  <div className="p-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{driveUploadError}</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: COMPRESS WEBP */}
            {insertImageTab === 'compress' && (
              <div className="space-y-3 p-4 bg-blue-50/40 border border-blue-200/70 rounded-2xl">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Nén ảnh tự động sang chuẩn WebP siêu nhẹ:
                </span>
                <div className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-4 bg-white text-center transition-colors">
                  {isCompressingInline ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-xs font-black text-blue-800">Đang nén ảnh sang WebP (giảm dung lượng)...</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-10 h-10 mx-auto bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 mb-1">
                        Tải ảnh từ máy tính (Tự động nén WebP)
                      </p>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Tự động điều chỉnh kích thước tối đa 1200px, giảm 80-90% dung lượng tải trang
                      </p>
                      <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all active:scale-95">
                        <Upload className="w-4 h-4" />
                        <span>Chọn ảnh để nén & chèn</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsCompressingInline(true);
                            try {
                              const res = await compressImageToWebp(file, 1200, 900, 0.85);
                              setInsertImageUrl(res.dataUrl);
                              if (!insertImageAlt) setInsertImageAlt(file.name.replace(/\.[^/.]+$/, ''));
                              setDriveUploadSuccess(`Đã nén ảnh WebP (${Math.round(res.sizeBytes / 1024)} KB)`);
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsCompressingInline(false);
                              e.target.value = '';
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: URL / LIBRARY */}
            {insertImageTab === 'url' && (
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nhập đường dẫn ảnh trực tiếp (URL):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... hoặc link ảnh bất kỳ"
                      value={insertImageUrl}
                      onChange={(e) => setInsertImageUrl(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTargetType('inline');
                        setIsMediaLibraryOpen(true);
                        setShowInsertImageModal(false);
                      }}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Thư viện Media</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE PREVIEW OF SELECTED IMAGE */}
            {insertImageUrl && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    Xem trước ảnh đã chọn:
                  </span>
                  <div className="flex items-center gap-2">
                    {insertImageUrl.includes('lh3.googleusercontent.com') && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                        Google Drive CDN
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setInsertImageUrl('');
                        setDriveUploadSuccess(null);
                      }}
                      className="text-[11px] text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                </div>
                <div className="relative max-h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 flex items-center justify-center p-1">
                  <img
                    src={insertImageUrl}
                    alt={insertImageAlt || 'Preview'}
                    className="max-h-44 max-w-full object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* FORMATTING OPTIONS */}
            <div className="space-y-3 text-xs pt-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Căn lề hình ảnh:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setInsertImageAlign('left')}
                    className={`py-1.5 rounded-xl font-bold border cursor-pointer transition-colors ${
                      insertImageAlign === 'left'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Căn trái (Float left)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsertImageAlign('center')}
                    className={`py-1.5 rounded-xl font-bold border cursor-pointer transition-colors ${
                      insertImageAlign === 'center'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Căn giữa (Block center)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsertImageAlign('right')}
                    className={`py-1.5 rounded-xl font-bold border cursor-pointer transition-colors ${
                      insertImageAlign === 'right'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Căn phải (Float right)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kích thước hiển thị:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['300px', '50%', '75%', '100%'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setInsertImageWidth(s)}
                      className={`py-1.5 rounded-xl font-bold border cursor-pointer transition-colors ${
                        insertImageWidth === s
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s === '300px' ? 'Nhỏ (300px)' : s === '50%' ? 'Vừa (50%)' : s === '75%' ? 'Lớn (75%)' : 'Đầy đủ (100%)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Văn bản thay thế (ALT text cho SEO):
                  </label>
                  <input
                    type="text"
                    placeholder="Mô tả bức ảnh cho tìm kiếm..."
                    value={insertImageAlt}
                    onChange={(e) => setInsertImageAlt(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Chú thích ảnh (Caption):
                  </label>
                  <input
                    type="text"
                    placeholder="Chú thích hiển thị dưới bức ảnh..."
                    value={insertImageCaption}
                    onChange={(e) => setInsertImageCaption(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowInsertImageModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleInsertInlineImage}
                disabled={!insertImageUrl}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Chèn vào bài viết</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MEDIA LIBRARY PICKER */}
      {isMediaLibraryOpen && (
        <div className="fixed inset-0 z-70 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
          <div className="bg-white w-full max-w-5xl rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Thư Viện Media Phường Chánh Hiệp</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Chọn media cho: <strong>{mediaTargetType === 'cover' ? 'Ảnh đại diện (16:9)' : mediaTargetType === 'gallery' ? 'Gallery ảnh' : 'Nội dung bài viết'}</strong>
                  </p>
                </div>
              </div>
              <button onClick={() => setIsMediaLibraryOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 mb-4 shrink-0 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm file media theo tên hoặc tag..."
                  value={mediaSearchTerm}
                  onChange={(e) => setMediaSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {(['all', 'image', 'video', 'file'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMediaFilterType(t)}
                      className={`px-3 py-1 rounded-lg capitalize ${mediaFilterType === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                    >
                      {t === 'all' ? 'Tất cả' : t === 'image' ? 'Hình ảnh' : t === 'video' ? 'Video' : 'Tài liệu'}
                    </button>
                  ))}
                </div>

                <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>Tải file mới lên</span>
                  <input
                    type="file"
                    accept="image/*,video/*,.pdf,.docx"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploadingMedia(true);
                      try {
                        const compressed = await compressImageToWebp(file);
                        const newItem = {
                          publicId: 'local-' + Date.now(),
                          secureUrl: compressed.dataUrl,
                          thumbnailUrl: compressed.thumbnailUrl,
                          bytes: compressed.sizeBytes,
                          format: compressed.format,
                          resourceType: 'image'
                        };
                        setMediaLibraryItems(prev => [newItem, ...prev]);
                        onShowToast?.('Đã nén và lưu file vào Thư viện Media!');
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsUploadingMedia(false);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {isLoadingMedia ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-xs font-bold gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  Đang tải Thư viện Media...
                </div>
              ) : mediaLibraryItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs">
                  <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="font-bold text-slate-600">Thư viện trống hoặc không tìm thấy file nào.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {mediaLibraryItems.map((item, idx) => {
                    const imgUrl = item.secureUrl || item.url;
                    const sizeKb = item.bytes ? (item.bytes / 1024).toFixed(0) : '120';
                    return (
                      <div
                        key={item.publicId || idx}
                        onClick={() => {
                          if (mediaTargetType === 'cover') {
                            setCoverImageUrl(imgUrl);
                            if (!coverImageAlt && item.publicId) setCoverImageAlt(item.publicId);
                          } else if (mediaTargetType === 'gallery') {
                            setGallery(prev => [
                              ...prev,
                              {
                                id: 'gal-' + Date.now(),
                                url: imgUrl,
                                thumbnailUrl: item.thumbnailUrl || imgUrl,
                                alt: item.publicId || 'Ảnh gallery',
                                caption: ''
                              }
                            ]);
                          } else {
                            setInsertImageUrl(imgUrl);
                            setShowInsertImageModal(true);
                          }
                          setIsMediaLibraryOpen(false);
                        }}
                        className="border border-slate-200 rounded-xl overflow-hidden group cursor-pointer hover:border-blue-500 hover:shadow-md transition-all bg-slate-50 flex flex-col"
                      >
                        <div className="aspect-video bg-slate-900 relative overflow-hidden">
                          <img src={item.thumbnailUrl || imgUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-slate-900/80 text-[9px] text-white rounded font-mono">
                            {sizeKb} KB
                          </span>
                        </div>
                        <div className="p-2 text-[10px] text-slate-600 truncate font-medium">
                          {item.publicId || `Media-${idx + 1}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMediaLibraryOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VERSION HISTORY */}
      {showVersionHistoryModal && (
        <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                <h3 className="font-black text-base text-slate-900">Lịch Sử Phiên Bản Bài Viết</h3>
              </div>
              <button onClick={() => setShowVersionHistoryModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2.5">
              {versions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Chưa có bản lưu lịch sử nào.</p>
              ) : (
                versions.map((ver, idx) => (
                  <div key={ver.id || idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{ver.title || 'Bản lưu nháp'}</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md text-[10px] font-bold">
                          {ver.savedAt}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {ver.summary || ver.content?.substring(0, 100) || 'Không có mô tả'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Bạn có chắc muốn khôi phục lại phiên bản lưu lúc ${ver.savedAt}?`)) {
                          setTitle(ver.title);
                          if (ver.summary) setSummary(ver.summary);
                          setContent(ver.content);
                          setShowVersionHistoryModal(false);
                          onShowToast?.(`Đã khôi phục nội dung từ phiên bản ${ver.savedAt}!`);
                        }
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Khôi phục</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowVersionHistoryModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LIVE PREVIEW & OPEN GRAPH */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-70 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
          <div className="bg-slate-100 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden text-slate-900">
            
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-600" />
                  Xem Trước:
                </span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                  <button
                    onClick={() => setPreviewTab('article')}
                    className={`px-3 py-1 rounded-md ${previewTab === 'article' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    Bài viết Portal
                  </button>
                  <button
                    onClick={() => setPreviewTab('card')}
                    className={`px-3 py-1 rounded-md ${previewTab === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    Card tin tức
                  </button>
                  <button
                    onClick={() => setPreviewTab('opengraph')}
                    className={`px-3 py-1 rounded-md ${previewTab === 'opengraph' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    Open Graph (FB/Zalo)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {previewTab === 'article' && (
                  <div className="flex bg-slate-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded-md ${previewDevice === 'desktop' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400'}`}
                      title="Desktop view"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded-md ${previewDevice === 'mobile' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400'}`}
                      title="Mobile view"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button onClick={() => setIsPreviewOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex items-center justify-center">
              
              {previewTab === 'article' && (
                <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-200 transition-all ${previewDevice === 'mobile' ? 'max-w-sm w-full' : 'max-w-3xl w-full'}`}>
                  <span className="px-3 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                    {category}
                  </span>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-3 leading-snug">
                    {title || 'Tiêu đề bài viết chưa nhập'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                    <span>Đăng ngày: {new Date().toLocaleDateString('vi-VN')}</span>
                    <span>•</span>
                    <span>Biên tập: {currentUser?.fullname || 'Cán bộ MTTQ'}</span>
                  </p>

                  {summary && (
                    <div className="p-3.5 bg-slate-50 border-l-4 border-blue-600 rounded-r-xl my-4 text-xs font-bold text-slate-700 leading-relaxed">
                      {summary}
                    </div>
                  )}

                  {coverImageUrl && (
                    <div className="my-4 aspect-video rounded-2xl overflow-hidden shadow-sm">
                      <img src={coverImageUrl} alt={coverImageAlt || title} className="w-full h-full object-cover" />
                      {coverImageCaption && (
                        <p className="text-[11px] text-slate-500 italic text-center mt-1.5">{coverImageCaption}</p>
                      )}
                    </div>
                  )}

                  <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap mt-4 space-y-3 font-normal" dangerouslySetInnerHTML={{ __html: content }} />

                  {gallery.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <h4 className="text-xs font-black uppercase text-slate-700 mb-3">Bộ sưu tập ảnh liên quan</h4>
                      <div className={`grid ${galleryColumns === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
                        {gallery.map((img, i) => (
                          <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-900 shadow-xs cursor-pointer" onClick={() => setLightboxIndex(i)}>
                            <img src={img.thumbnailUrl || img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {previewTab === 'card' && (
                <div className="bg-white max-w-sm w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                  <div className="aspect-video bg-slate-900 relative">
                    {coverImageUrl ? (
                      <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Chưa có ảnh bìa</div>
                    )}
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-md shadow-xs">
                      {category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-black text-sm text-slate-900 line-clamp-2 leading-snug">
                      {title || 'Tiêu đề bài viết hiển thị trên trang tin'}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {summary || 'Tóm tắt nội dung sẽ hiển thị tại đây...'}
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{new Date().toLocaleDateString('vi-VN')}</span>
                      <span className="text-blue-600 font-bold">Xem chi tiết →</span>
                    </div>
                  </div>
                </div>
              )}

              {previewTab === 'opengraph' && (
                <div className="bg-white max-w-md w-full rounded-2xl overflow-hidden border border-slate-300 shadow-xl">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-700">Mô phỏng chia sẻ Facebook / Zalo / Telegram</span>
                  </div>
                  <div className="aspect-video bg-slate-900 relative">
                    {coverImageUrl ? (
                      <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Chưa có ảnh OG</div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">CHANHHIEP.BINHDUONG.GOV.VN</span>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{title || 'Tiêu đề chia sẻ trên mạng xã hội'}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{summary || 'Tóm tắt nội dung bài viết khi gửi qua Zalo hoặc Facebook...'}</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* GALLERY LIGHTBOX */}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div className="fixed inset-0 z-80 bg-slate-950/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={gallery[lightboxIndex].url}
            alt={gallery[lightboxIndex].alt || 'Gallery photo'}
            className="max-h-[82vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
          />
          {gallery[lightboxIndex].caption && (
            <p className="text-white text-sm font-medium mt-3 bg-black/50 px-4 py-1.5 rounded-full">
              {gallery[lightboxIndex].caption}
            </p>
          )}
          <div className="flex gap-4 mt-3">
            <button
              disabled={lightboxIndex === 0}
              onClick={() => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))}
              className="px-4 py-1.5 bg-white/20 text-white rounded-xl text-xs font-bold disabled:opacity-30 cursor-pointer"
            >
              ← Ảnh trước
            </button>
            <span className="text-white text-xs font-bold self-center">
              {lightboxIndex + 1} / {gallery.length}
            </span>
            <button
              disabled={lightboxIndex === gallery.length - 1}
              onClick={() => setLightboxIndex(i => (i !== null && i < gallery.length - 1 ? i + 1 : i))}
              className="px-4 py-1.5 bg-white/20 text-white rounded-xl text-xs font-bold disabled:opacity-30 cursor-pointer"
            >
              Ảnh sau →
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
