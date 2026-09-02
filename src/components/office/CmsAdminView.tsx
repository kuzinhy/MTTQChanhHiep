import React, { useState, useMemo } from 'react';
import { 
  uploadFileToGoogleDrive, 
  DEFAULT_DRIVE_FOLDER_ID, 
  DEFAULT_DRIVE_FOLDER_URL, 
  getAppsScriptUrl, 
  saveAppsScriptUrl, 
  getGoogleDriveDirectImageUrl,
  getGoogleDrivePreviewEmbedUrl,
  getGoogleDriveDirectDownloadUrl,
  extractGoogleDriveFileId,
  getGoogleDriveViewUrl,
  getGoogleDrivePdfProxyUrl
} from '../../lib/googleDriveService';
import { getApiUrl } from '../../lib/api';
import { SecurePdfViewer } from '../SecurePdfViewer';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { 
  Article, 
  OfficialDocument, 
  Competition, 
  PublicOpinion, 
  ArticleCategory, 
  ArticleStatus, 
  OpinionStatus,
  DocType 
} from '../../types';
import {
  sortArticlesNewestFirst,
  sortDocumentsNewestFirst,
  sortCompetitionsNewestFirst,
  sortOpinionsNewestFirst
} from '../../lib/dateUtils';

import { 
  Newspaper, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Eye, 
  Search, 
  Filter, 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  Award,
  MessageSquare,
  Tag,
  AlertCircle,
  Calendar,
  User,
  Star,
  Copy,
  Upload,
  Layers,
  ArrowUpDown,
  BookOpen,
  Settings,
  Share2,
  Clock,
  ShieldCheck,
  CheckCheck,
  FolderOpen,
  ExternalLink,
  Globe,
  Download,
  HelpCircle,
  Database,
  Cloud,
  RefreshCw,
  HardDrive,
  CloudUpload,
  FileCheck,
  Paperclip,
  Loader2,
  Link2,
  Clipboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppStorageEngine } from '../../lib/storage';

interface CmsAdminViewProps {
  articles: Article[];
  documents: OfficialDocument[];
  competitions?: Competition[];
  opinions?: PublicOpinion[];
  initialTab?: 'ARTICLES' | 'DOCUMENTS' | 'COMPETITIONS' | 'OPINIONS';
  onAddArticle: (art: Article) => void;
  onUpdateArticle: (art: Article) => void;
  onDeleteArticle: (id: string) => void;
  onAddDocument: (doc: OfficialDocument) => void;
  onUpdateDocument: (doc: OfficialDocument) => void;
  onDeleteDocument: (id: string) => void;
  onAddCompetition?: (comp: Competition) => void;
  onUpdateCompetition?: (comp: Competition) => void;
  onDeleteCompetition?: (id: string) => void;
  onUpdateOpinionStatus?: (id: string, status: OpinionStatus, response?: string) => void;
  onRequestDocApproval?: (doc: OfficialDocument) => void;
  onForceCloudSync?: () => void;
  onShowToast?: (title: string, message: string) => void;
}

const DEFAULT_IMAGE_PRESETS = [
  { label: 'Hội nghị MTTQ', url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=800' },
  { label: 'Chăm lo An sinh', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800' },
  { label: 'Không gian Bác Hồ', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800' },
  { label: 'Chuyển đổi số', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800' },
  { label: 'Khu phố Dân cư', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800' },
  { label: 'Đoàn kết Dân tộc', url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&q=80&w=800' },
];

const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'Hoạt động Mặt trận',
  'Học tập và làm theo Bác',
  'Đại đoàn kết',
  'An sinh xã hội',
  'Hoạt động khu phố',
  'Tuyên truyền & Nghị quyết',
  'Dân vận khéo',
  'Khu phố đoàn kết',
  'Giám sát - Phản biện',
  'Phong trào thi đua'
];

const DOC_TYPES: DocType[] = [
  'Kế hoạch',
  'Nghị quyết',
  'Thông báo',
  'Hướng dẫn',
  'Quyết định',
  'Công văn',
  'Chương trình',
  'Báo cáo',
  'Chính sách',
  'Tài liệu tuyên truyền'
];

// Helper to remove Vietnamese accents for clean slug generation
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export const CmsAdminView: React.FC<CmsAdminViewProps> = ({
  articles,
  documents,
  competitions = [],
  opinions = [],
  initialTab = 'ARTICLES',
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  onAddCompetition,
  onUpdateCompetition,
  onDeleteCompetition,
  onUpdateOpinionStatus,
  onRequestDocApproval,
  onForceCloudSync,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ARTICLES' | 'DOCUMENTS' | 'COMPETITIONS' | 'OPINIONS'>(initialTab || 'ARTICLES');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals for Articles
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // Article Form State
  const [artTitle, setArtTitle] = useState('');
  const [artSlug, setArtSlug] = useState('');
  const [artSummary, setArtSummary] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState<ArticleCategory>('Hoạt động Mặt trận');
  const [artAuthor, setArtAuthor] = useState('Cán bộ Tuyên giáo MTTQ');
  const [artImage, setArtImage] = useState(DEFAULT_IMAGE_PRESETS[0].url);
  const [artTags, setArtTags] = useState('Mặt trận, Chánh Hiệp');
  const [artStatus, setArtStatus] = useState<ArticleStatus>('Published');
  const [artIsFeatured, setArtIsFeatured] = useState<boolean>(false);
  const [artOriginalUrl, setArtOriginalUrl] = useState<string>('');
  const [artSourceName, setArtSourceName] = useState<string>('');
  const [artPublishDate, setArtPublishDate] = useState<string>(new Date().toISOString().substring(0, 10));

  // Attachment & Google Drive Storage State
  const [artAttachment, setArtAttachment] = useState<string>('');
  const [artAttachmentName, setArtAttachmentName] = useState<string>('');
  const [artAttachmentSize, setArtAttachmentSize] = useState<string>('');
  const [artDriveFolderUrl, setArtDriveFolderUrl] = useState<string>(DEFAULT_DRIVE_FOLDER_URL);
  const [artSelectedFile, setArtSelectedFile] = useState<File | null>(null);
  const [artIsUploading, setArtIsUploading] = useState<boolean>(false);
  const [artUploadSuccess, setArtUploadSuccess] = useState<boolean>(false);

  // AI Link Parsing & Duplication Check States for Articles
  const [artInputUrl, setArtInputUrl] = useState<string>('');
  const [isParsingNewsLink, setIsParsingNewsLink] = useState<boolean>(false);

  // AI Document Parsing & Duplication Check States for Documents
  const [isExtractingDocMeta, setIsExtractingDocMeta] = useState<boolean>(false);

  // Modals for Documents
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<OfficialDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<OfficialDocument | null>(null);
  const [docToDelete, setDocToDelete] = useState<OfficialDocument | null>(null);

  // Document Form State
  const [docCode, setDocCode] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocType>('Kế hoạch');
  const [docField, setDocField] = useState('Tổ chức - Tuyên giáo');
  const [docSigner, setDocSigner] = useState('Chủ tịch Trần Thị Hoa');
  const [docSummary, setDocSummary] = useState('');
  const [docIssueDate, setDocIssueDate] = useState(new Date().toISOString().substring(0, 10));
  const [docIsPublic, setDocIsPublic] = useState(true);
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docFileName, setDocFileName] = useState('');
  const [docFileSize, setDocFileSize] = useState('');
  const [docDriveUrl, setDocDriveUrl] = useState(DEFAULT_DRIVE_FOLDER_URL);
  const [docSelectedFile, setDocSelectedFile] = useState<File | null>(null);
  const [docIsUploading, setDocIsUploading] = useState<boolean>(false);
  const [docUploadSuccess, setDocUploadSuccess] = useState<boolean>(false);
  const [docAttachMode, setDocAttachMode] = useState<'file' | 'drive'>('file');
  const [previewDriveLink, setPreviewDriveLink] = useState<string | null>(null);

  // Duplicate Content Detection Logic for Articles
  const duplicateArticleMatch = useMemo(() => {
    if (!artTitle.trim() && !artOriginalUrl.trim() && !artInputUrl.trim()) return null;
    const cleanTitle = artTitle.trim().toLowerCase();
    const cleanUrl = (artInputUrl || artOriginalUrl).trim().toLowerCase();
    const cleanSlug = artSlug.trim().toLowerCase() || generateSlug(cleanTitle);

    return articles.find(art => {
      if (editingArticle && art.id === editingArticle.id) return false;
      const artCleanTitle = art.title.trim().toLowerCase();
      const artCleanSlug = art.slug.trim().toLowerCase();
      const artCleanUrl = (art.originalUrl || '').trim().toLowerCase();

      if (cleanTitle && (artCleanTitle === cleanTitle || artCleanTitle.includes(cleanTitle) || cleanTitle.includes(artCleanTitle))) return true;
      if (cleanSlug && artCleanSlug === cleanSlug) return true;
      if (cleanUrl && artCleanUrl && artCleanUrl === cleanUrl) return true;
      return false;
    }) || null;
  }, [artTitle, artSlug, artOriginalUrl, artInputUrl, articles, editingArticle]);

  // Duplicate Content Detection Logic for Documents
  const duplicateDocMatch = useMemo(() => {
    if (!docCode.trim() && !docTitle.trim()) return null;
    const cleanCode = docCode.trim().toLowerCase();
    const cleanTitle = docTitle.trim().toLowerCase();

    return documents.find(doc => {
      if (editingDoc && doc.id === editingDoc.id) return false;
      const dCode = doc.codeNumber.trim().toLowerCase();
      const dTitle = doc.title.trim().toLowerCase();

      if (cleanCode && dCode === cleanCode) return true;
      if (cleanTitle && (dTitle === cleanTitle || dTitle.includes(cleanTitle) || cleanTitle.includes(dTitle))) return true;
      return false;
    }) || null;
  }, [docCode, docTitle, documents, editingDoc]);

  // Handler for AI News Link Parsing
  const handleParseNewsLink = async () => {
    const targetUrl = artInputUrl.trim() || artOriginalUrl.trim();
    if (!targetUrl) {
      showErrorBanner('Vui lòng nhập đường dẫn (Link URL) bài viết báo chí hoặc tin tức.');
      return;
    }
    setIsParsingNewsLink(true);
    try {
      const response = await fetch(getApiUrl('/api/ai/parse-news-link'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Không thể bóc tách link.');
      }
      const parsed = data.data;
      if (parsed.title) {
        setArtTitle(parsed.title);
        setArtSlug(generateSlug(parsed.title));
      }
      if (parsed.summary) setArtSummary(parsed.summary);
      if (parsed.content) setArtContent(parsed.content);
      if (parsed.category && ARTICLE_CATEGORIES.includes(parsed.category)) setArtCategory(parsed.category);
      if (parsed.tags && Array.isArray(parsed.tags)) setArtTags(parsed.tags.join(', '));
      if (parsed.authorName) setArtAuthor(parsed.authorName);
      if (parsed.sourceName) setArtSourceName(parsed.sourceName);
      if (parsed.publishDate) setArtPublishDate(parsed.publishDate);
      if (parsed.imageUrl) setArtImage(parsed.imageUrl);
      setArtOriginalUrl(targetUrl);
      showSuccessBanner(`AI đã tự động bóc tách thành công tin tức: "${parsed.title || targetUrl}"`);
    } catch (err: any) {
      console.error('AI link parsing error:', err);
      showErrorBanner(`Không thể bóc tách dữ liệu từ Link: ${err.message || 'Lỗi hệ thống'}`);
    } finally {
      setIsParsingNewsLink(false);
    }
  };

  // Helper to trigger AI Document Metadata Extraction
  const extractMetaFromDocFile = async (file: File) => {
    setIsExtractingDocMeta(true);
    try {
      let textSnippet = file.name;
      if (file.size < 2000 * 1024) {
        try {
          textSnippet = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const res = reader.result;
              if (typeof res === 'string') {
                resolve(res.substring(0, 5000));
              } else {
                resolve(file.name);
              }
            };
            reader.onerror = () => resolve(file.name);
            reader.readAsText(file);
          });
        } catch {
          textSnippet = file.name;
        }
      }

      const response = await fetch(getApiUrl('/api/ai/extract-document-meta'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, textContent: textSnippet })
      });
      const data = await response.json();
      if (response.ok && data.success && data.data) {
        const meta = data.data;
        if (meta.codeNumber) setDocCode(meta.codeNumber);
        if (meta.title) setDocTitle(meta.title);
        if (meta.docType && DOC_TYPES.includes(meta.docType as any)) setDocType(meta.docType as any);
        if (meta.field) setDocField(meta.field);
        if (meta.signer) setDocSigner(meta.signer);
        if (meta.summary) setDocSummary(meta.summary);
        if (meta.issueDate) setDocIssueDate(meta.issueDate);
        showSuccessBanner(`✨ AI Gemini 2.5 Flash đã bóc tách xong: Số ${meta.codeNumber || 'văn bản'} - Trích yếu: "${meta.title || file.name}"`);
      }
    } catch (err) {
      console.warn('AI Doc extract warning:', err);
    } finally {
      setIsExtractingDocMeta(false);
    }
  };

  // Helper to extract AI Metadata from Google Drive Link
  const extractMetaFromDriveUrl = async (urlToParse?: string) => {
    const targetUrl = (urlToParse || docDriveUrl).trim();
    if (!targetUrl) {
      showErrorBanner('Vui lòng dán liên kết Google Drive trước khi trích xuất.');
      return;
    }
    const fileId = extractGoogleDriveFileId(targetUrl);
    setIsExtractingDocMeta(true);
    try {
      const response = await fetch(getApiUrl('/api/ai/extract-document-meta'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileName: `Google Drive Doc (${fileId || 'document'})`, 
          textContent: `Liên kết Google Drive: ${targetUrl}. Tệp văn bản hành chính được ban hành bởi Mặt trận Tổ quốc hoặc cơ quan nhà nước.`,
          driveUrl: targetUrl
        })
      });
      const data = await response.json();
      if (response.ok && data.success && data.data) {
        const meta = data.data;
        if (meta.codeNumber) setDocCode(meta.codeNumber);
        if (meta.title) setDocTitle(meta.title);
        if (meta.docType && DOC_TYPES.includes(meta.docType as any)) setDocType(meta.docType as any);
        if (meta.field) setDocField(meta.field);
        if (meta.signer) setDocSigner(meta.signer);
        if (meta.summary) setDocSummary(meta.summary);
        if (meta.issueDate) setDocIssueDate(meta.issueDate);
        showSuccessBanner(`✨ AI đã bóc tách từ Google Drive: Số ${meta.codeNumber || 'văn bản'} - Trích yếu: "${meta.title || 'Văn bản'}"`);
      } else {
        showSuccessBanner(`Đã nhận diện liên kết Google Drive (ID: ${fileId || 'hợp lệ'}). Hãy điền thêm Số hiệu & Trích yếu.`);
      }
    } catch (err) {
      console.warn('AI Doc Drive extract warning:', err);
      showSuccessBanner(`Đã nhận diện liên kết Google Drive (ID: ${fileId || 'hợp lệ'}).`);
    } finally {
      setIsExtractingDocMeta(false);
    }
  };

  // Handler for manual Google Drive URL change
  const handleDriveUrlChange = (val: string) => {
    setDocDriveUrl(val);
    const trimmed = val.trim();
    if (trimmed) {
      const fileId = extractGoogleDriveFileId(trimmed);
      if (fileId) {
        setDocFileUrl(trimmed);
        if (!docFileName) setDocFileName(`Tệp Google Drive [${fileId.substring(0, 8)}...]`);
        if (!docFileSize) setDocFileSize('Google Drive Cloud');
        setDocUploadSuccess(true);
      }
    }
  };

  // Handler to paste Google Drive link from clipboard
  const handlePasteDriveUrlFromClipboard = async () => {
    try {
      if (!navigator.clipboard) {
        showErrorBanner('Trình duyệt chưa hỗ trợ đọc clipboard tự động. Vui lòng nhấn Ctrl+V để dán.');
        return;
      }
      const text = await navigator.clipboard.readText();
      const trimmed = (text || '').trim();
      if (trimmed) {
        handleDriveUrlChange(trimmed);
        showSuccessBanner('Đã dán liên kết Google Drive từ bộ nhớ tạm!');
      } else {
        showErrorBanner('Bộ nhớ tạm (Clipboard) đang trống.');
      }
    } catch {
      showErrorBanner('Không thể truy cập Clipboard. Hãy nhấn Ctrl+V trực tiếp vào ô nhập.');
    }
  };

  // Apps Script Web App Config State
  const [appsScriptUrlInput, setAppsScriptUrlInput] = useState<string>(getAppsScriptUrl());
  const [showAppsScriptConfig, setShowAppsScriptConfig] = useState<boolean>(false);

  const handleSaveAppsScriptUrl = (url: string) => {
    setAppsScriptUrlInput(url);
    saveAppsScriptUrl(url);
    if (url.trim()) {
      showSuccessBanner('Đã lưu URL Google Apps Script! Các tệp đính kèm sẽ tự động gửi qua Apps Script.');
    } else {
      showSuccessBanner('Đã xóa URL Apps Script, hệ thống sử dụng kết nối Google OAuth trực tiếp.');
    }
  };

  // Modals for Competitions
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<Competition | null>(null);
  const [compToDelete, setCompToDelete] = useState<Competition | null>(null);

  // Competition Form State
  const [compTitle, setCompTitle] = useState('');
  const [compType, setCompType] = useState<'TRIVIA' | 'WRITING'>('TRIVIA');
  const [compDesc, setCompDesc] = useState('');
  const [compRules, setCompRules] = useState('Dự thi trực tuyến cá nhân, trả lời đầy đủ các câu hỏi theo quy định.');
  const [compStartDate, setCompStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [compEndDate, setCompEndDate] = useState('31/12/2026');
  const [compStatus, setCompStatus] = useState<'ONGOING' | 'UPCOMING' | 'ENDED'>('ONGOING');
  const [compTotalQuestions, setCompTotalQuestions] = useState(10);

  // Opinions Response Modal
  const [respondingOpinion, setRespondingOpinion] = useState<PublicOpinion | null>(null);
  const [opinionReplyText, setOpinionReplyText] = useState('');
  const [opinionTargetStatus, setOpinionTargetStatus] = useState<OpinionStatus>('RESOLVED');

  // Success Feedback Banner State
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const showSuccessBanner = (msg: string) => {
    if (onShowToast) {
      onShowToast('Thành công', msg);
    } else {
      setActionSuccessMsg(msg);
      setTimeout(() => {
        setActionSuccessMsg(null);
      }, 4000);
    }
  };

  const showErrorBanner = (msg: string) => {
    if (onShowToast) {
      onShowToast('Có lỗi xảy ra', msg);
    } else {
      setActionSuccessMsg('⚠️ Lỗi: ' + msg);
      setTimeout(() => {
        setActionSuccessMsg(null);
      }, 5000);
    }
  };

  // Reset Article Form
  const resetArticleForm = () => {
    setEditingArticle(null);
    setArtTitle('');
    setArtSlug('');
    setArtSummary('');
    setArtContent('');
    setArtCategory('Hoạt động Mặt trận');
    setArtAuthor('Cán bộ Tuyên giáo MTTQ');
    setArtImage(DEFAULT_IMAGE_PRESETS[0].url);
    setArtTags('Mặt trận, Chánh Hiệp');
    setArtStatus('Published');
    setArtIsFeatured(false);
    setArtOriginalUrl('');
    setArtSourceName('');
    setArtPublishDate(new Date().toISOString().substring(0, 10));
    setArtAttachment('');
    setArtAttachmentName('');
    setArtAttachmentSize('');
    setArtDriveFolderUrl(DEFAULT_DRIVE_FOLDER_URL);
    setArtSelectedFile(null);
    setArtIsUploading(false);
    setArtUploadSuccess(false);
  };

  // Open Edit Article
  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArtTitle(art.title);
    setArtSlug(art.slug || generateSlug(art.title));
    setArtSummary(art.summary);
    setArtContent(art.content);
    setArtCategory(art.category);
    setArtAuthor(art.authorName || 'Cán bộ Tuyên giáo');
    setArtImage(art.featuredImage || DEFAULT_IMAGE_PRESETS[0].url);
    setArtTags((art.tags || []).join(', '));
    setArtStatus(art.status || 'Published');
    setArtIsFeatured(!!art.isFeatured);
    setArtOriginalUrl(art.originalUrl || '');
    setArtSourceName(art.sourceName || '');
    setArtPublishDate(art.publishDate || new Date().toISOString().substring(0, 10));
    setArtAttachment(art.attachment || '');
    setArtAttachmentName(art.attachmentName || '');
    setArtAttachmentSize(art.attachmentSize || '');
    setArtDriveFolderUrl(art.driveFolderUrl || DEFAULT_DRIVE_FOLDER_URL);
    setArtSelectedFile(null);
    setArtIsUploading(false);
    setArtUploadSuccess(!!(art.driveFolderUrl && art.driveFolderUrl.includes('drive.google.com/file')));
    setIsArticleModalOpen(true);
  };

  // Quick Duplicate Article
  const handleDuplicateArticle = (art: Article) => {
    const duplicated: Article = {
      ...art,
      id: 'art-' + Date.now(),
      title: `${art.title} (Bản sao)`,
      slug: `${generateSlug(art.title)}-ban-sao-${Date.now().toString().slice(-4)}`,
      status: 'Draft',
      isFeatured: false,
      publishDate: new Date().toISOString().substring(0, 10),
      views: 1
    };
    onAddArticle(duplicated);
    showSuccessBanner(`Đã nhân bản bài viết "${duplicated.title}" thành công!`);
  };

  // Quick Toggle Published / Draft Status
  const handleToggleArticleStatus = (art: Article) => {
    const nextStatus: ArticleStatus = art.status === 'Published' ? 'Draft' : 'Published';
    const updated: Article = { ...art, status: nextStatus };
    onUpdateArticle(updated);
    showSuccessBanner(`Đã chuyển bài viết sang trạng thái: "${nextStatus === 'Published' ? 'Đã xuất bản' : 'Bản nháp'}"`);
  };

  // Quick Toggle Featured Flag
  const handleToggleArticleFeatured = (art: Article) => {
    const updated: Article = { ...art, isFeatured: !art.isFeatured };
    onUpdateArticle(updated);
    showSuccessBanner(updated.isFeatured ? 'Đã ghim bài viết lên vị trí Nổi bật trang đầu!' : 'Đã bỏ ghim bài viết nổi bật.');
  };

  // Helper to compress image files before storing
  const compressImageFile = (file: File, maxDim = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve((e.target?.result as string) || '');
          }
        };
        img.onerror = () => resolve((e.target?.result as string) || '');
        img.src = (e.target?.result as string) || '';
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Image File Upload (FileReader to base64 with compression)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImageFile(file);
        setArtImage(compressed);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') setArtImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
      showSuccessBanner(`Đã chọn hình ảnh đính kèm "${file.name}"!`);
    }
  };

  // Handle Document/File Attachment / Image Upload
  const handleAttachmentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArtSelectedFile(file);
      setArtAttachmentName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setArtAttachmentSize(sizeMb === '0.00' ? `${(file.size / 1024).toFixed(1)} KB` : `${sizeMb} MB`);
      setArtUploadSuccess(false);

      if (file.type.startsWith('image/')) {
        compressImageFile(file).then(compressed => {
          setArtImage(compressed);
        });
      }

      if (file.size > 100 * 1024) {
        setArtAttachment(URL.createObjectURL(file));
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') setArtAttachment(reader.result);
        };
        reader.readAsDataURL(file);
      }
      showSuccessBanner(`Đã chọn "${file.name}". Bấm nút "Upload lên Google Drive" để lưu trữ trực tiếp!`);
    }
  };

  // Upload Article Attachment or Image to Google Drive
  const handleUploadArticleAttachmentToDrive = async () => {
    if (!artSelectedFile) {
      showErrorBanner('Vui lòng chọn tệp tin hoặc ảnh từ máy tính trước.');
      return;
    }
    setArtIsUploading(true);
    try {
      let resLink = DEFAULT_DRIVE_FOLDER_URL;
      let directImageUrl = '';
      try {
        const res = await uploadFileToGoogleDrive(artSelectedFile, DEFAULT_DRIVE_FOLDER_ID);
        if (res.webViewLink) {
          resLink = res.webViewLink;
          directImageUrl = res.id ? `https://lh3.googleusercontent.com/d/${res.id}` : res.webViewLink;
        }
      } catch (e) {
        console.warn('Drive upload fallback notice:', e);
        directImageUrl = URL.createObjectURL(artSelectedFile);
      }

      if (artSelectedFile.type.startsWith('image/')) {
        setArtImage(directImageUrl || resLink);
      }

      setArtDriveFolderUrl(resLink);
      setArtAttachment(resLink);
      setArtUploadSuccess(true);
      showSuccessBanner(`Đã tải lên tệp/ảnh thành công và lưu vào hệ thống/Drive!`);
    } catch (err: any) {
      console.error('Drive upload error:', err);
      showErrorBanner(`Không thể tải tệp lên: ${err?.message || 'Lỗi kết nối'}`);
    } finally {
      setArtIsUploading(false);
    }
  };

  // Save Article (Create or Update)
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim() || !artContent.trim()) return;

    const parsedTags = artTags.split(',').map(t => t.trim()).filter(Boolean);
    const finalSlug = artSlug.trim() || generateSlug(artTitle);
    const finalSummary = artSummary.trim() || artContent.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';

    if (editingArticle) {
      const updated: Article = {
        ...editingArticle,
        title: artTitle.trim(),
        slug: finalSlug,
        summary: finalSummary,
        content: artContent.trim(),
        featuredImage: artImage,
        category: artCategory,
        tags: parsedTags.length > 0 ? parsedTags : ['Mặt trận', 'Chánh Hiệp'],
        status: artStatus,
        isFeatured: artIsFeatured,
        originalUrl: artOriginalUrl.trim() || undefined,
        sourceName: artSourceName.trim() || undefined,
        authorName: artAuthor.trim() || 'Cán bộ Tuyên giáo',
        publishDate: artPublishDate,
        attachment: artAttachment.trim() || undefined,
        attachmentName: artAttachmentName.trim() || undefined,
        attachmentSize: artAttachmentSize.trim() || undefined,
        driveFolderUrl: artDriveFolderUrl.trim() || DEFAULT_DRIVE_FOLDER_URL
      };
      onUpdateArticle(updated);
    } else {
      const newArt: Article = {
        id: 'art-' + Date.now(),
        title: artTitle.trim(),
        slug: finalSlug,
        summary: finalSummary,
        content: artContent.trim(),
        featuredImage: artImage,
        category: artCategory,
        tags: parsedTags.length > 0 ? parsedTags : ['Mặt trận', 'Chánh Hiệp'],
        status: artStatus,
        isFeatured: artIsFeatured,
        originalUrl: artOriginalUrl.trim() || undefined,
        sourceName: artSourceName.trim() || undefined,
        authorName: artAuthor.trim() || 'Cán bộ Tuyên giáo',
        publishDate: artPublishDate,
        attachment: artAttachment.trim() || undefined,
        attachmentName: artAttachmentName.trim() || undefined,
        attachmentSize: artAttachmentSize.trim() || undefined,
        driveFolderUrl: artDriveFolderUrl.trim() || DEFAULT_DRIVE_FOLDER_URL,
        views: 1
      };
      onAddArticle(newArt);
    }

    setIsArticleModalOpen(false);
    resetArticleForm();
  };

  // Confirm Delete Article
  const handleConfirmDeleteArticle = () => {
    if (!articleToDelete) return;
    onDeleteArticle(articleToDelete.id);
    setArticleToDelete(null);
  };

  // Reset Document Form
  const resetDocForm = () => {
    setEditingDoc(null);
    setDocCode('');
    setDocTitle('');
    setDocType('Kế hoạch');
    setDocField('Tổ chức - Tuyên giáo');
    setDocSigner('Chủ tịch Trần Thị Hoa');
    setDocSummary('');
    setDocIssueDate(new Date().toISOString().substring(0, 10));
    setDocIsPublic(true);
    setDocFileUrl('');
    setDocFileName('');
    setDocFileSize('');
    setDocDriveUrl(DEFAULT_DRIVE_FOLDER_URL);
    setDocSelectedFile(null);
    setDocIsUploading(false);
    setDocUploadSuccess(false);
    setDocAttachMode('file');
    setPreviewDriveLink(null);
  };

  // Open Edit Document
  const handleOpenEditDoc = (doc: OfficialDocument) => {
    setEditingDoc(doc);
    setDocCode(doc.codeNumber);
    setDocTitle(doc.title);
    setDocType(doc.docType);
    setDocField(doc.field || 'Tổ chức - Tuyên giáo');
    setDocSigner(doc.signer || 'Chủ tịch Trần Thị Hoa');
    setDocSummary(doc.summary || '');
    setDocIssueDate(doc.issueDate || new Date().toISOString().substring(0, 10));
    setDocIsPublic(doc.isPublic ?? true);
    setDocFileUrl(doc.fileUrl || '');
    setDocFileName(doc.fileName || '');
    setDocFileSize(doc.fileSize || '');
    setDocDriveUrl(doc.driveUrl || DEFAULT_DRIVE_FOLDER_URL);
    setDocSelectedFile(null);
    setDocIsUploading(false);
    const hasDrive = !!(doc.driveUrl && (doc.driveUrl.includes('drive.google.com') || doc.driveUrl.includes('docs.google.com')));
    setDocUploadSuccess(hasDrive);
    setDocAttachMode(hasDrive ? 'drive' : 'file');
    setIsDocModalOpen(true);
  };

  // Handle Document File Upload & Auto AI Metadata Extraction
  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement> | { target: { files: FileList | File[] } }) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocSelectedFile(file);
      setDocFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setDocFileSize(sizeMb === '0.00' ? `${(file.size / 1024).toFixed(1)} KB` : `${sizeMb} MB`);
      setDocUploadSuccess(true);

      // Read as Data URL or Object URL for instantaneous viewing in browser
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDocFileUrl(reader.result);
        }
      };
      reader.onerror = () => {
        setDocFileUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);

      showSuccessBanner(`Đã nhận tệp văn bản "${file.name}". AI đang tự động phân tích & gán thông số văn bản...`);
      // Trigger AI metadata extraction automatically
      extractMetaFromDocFile(file);
    }
  };

  // Upload Document File to Google Drive
  const handleUploadDocFileToDrive = async () => {
    if (!docSelectedFile) {
      showErrorBanner('Vui lòng chọn tệp văn bản từ máy tính trước.');
      return;
    }
    setDocIsUploading(true);
    try {
      const res = await uploadFileToGoogleDrive(docSelectedFile, DEFAULT_DRIVE_FOLDER_ID);
      setDocDriveUrl(res.webViewLink);
      setDocFileUrl(res.webViewLink);
      setDocUploadSuccess(true);
      showSuccessBanner(`Đã tải tệp văn bản "${res.name}" lên thư mục Google Drive thành công!`);
    } catch (err: any) {
      console.error('Drive upload error:', err);
      showErrorBanner(`Không thể tải tệp văn bản lên Google Drive: ${err?.message || 'Lỗi kết nối'}`);
    } finally {
      setDocIsUploading(false);
    }
  };

  // Save Document
  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docCode.trim()) return;

    if (editingDoc) {
      const updated: OfficialDocument = {
        ...editingDoc,
        codeNumber: docCode.trim(),
        title: docTitle.trim(),
        docType: docType,
        field: docField,
        signer: docSigner.trim(),
        summary: docSummary.trim(),
        issueDate: docIssueDate,
        isPublic: docIsPublic,
        fileUrl: docFileUrl || editingDoc.fileUrl,
        fileName: docFileName || editingDoc.fileName,
        fileSize: docFileSize || editingDoc.fileSize,
        driveUrl: docDriveUrl || editingDoc.driveUrl
      };
      onUpdateDocument(updated);
    } else {
      const newDoc: OfficialDocument = {
        id: 'doc-' + Date.now(),
        codeNumber: docCode.trim(),
        title: docTitle.trim(),
        docType: docType,
        issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: docIssueDate,
        signer: docSigner.trim() || 'Chủ tịch Trần Thị Hoa',
        field: docField,
        summary: docSummary.trim(),
        isPublic: docIsPublic,
        fileUrl: docFileUrl || undefined,
        fileName: docFileName || undefined,
        fileSize: docFileSize || undefined,
        driveUrl: docDriveUrl || 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL'
      };
      onAddDocument(newDoc);
    }

    resetDocForm();
    setIsDocModalOpen(false);
  };

  // Confirm Delete Document
  const handleConfirmDeleteDoc = () => {
    if (!docToDelete) return;
    onDeleteDocument(docToDelete.id);
    setDocToDelete(null);
  };

  // Reset Competition Form
  const resetCompForm = () => {
    setEditingComp(null);
    setCompTitle('');
    setCompType('TRIVIA');
    setCompDesc('');
    setCompRules('Dự thi trực tuyến cá nhân, trả lời đầy đủ các câu hỏi.');
    setCompStartDate(new Date().toISOString().substring(0, 10));
    setCompEndDate('31/12/2026');
    setCompStatus('ONGOING');
    setCompTotalQuestions(10);
  };

  // Open Edit Competition
  const handleOpenEditComp = (comp: Competition) => {
    setEditingComp(comp);
    setCompTitle(comp.title);
    setCompType(comp.type);
    setCompDesc(comp.description || '');
    setCompRules(comp.rules || '');
    setCompStartDate(comp.startDate || new Date().toISOString().substring(0, 10));
    setCompEndDate(comp.endDate || '31/12/2026');
    setCompStatus(comp.status);
    setCompTotalQuestions(comp.totalQuestions || 10);
    setIsCompModalOpen(true);
  };

  // Save Competition
  const handleSaveCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle.trim()) return;

    if (editingComp) {
      const updated: Competition = {
        ...editingComp,
        title: compTitle.trim(),
        type: compType,
        description: compDesc.trim(),
        rules: compRules.trim(),
        startDate: compStartDate,
        endDate: compEndDate,
        status: compStatus,
        totalQuestions: compTotalQuestions
      };
      if (onUpdateCompetition) onUpdateCompetition(updated);
    } else {
      const newComp: Competition = {
        id: 'comp-' + Date.now(),
        title: compTitle.trim(),
        type: compType,
        description: compDesc.trim() || 'Cuộc thi trực tuyến chào mừng kỷ niệm thành lập Mặt trận.',
        startDate: compStartDate,
        endDate: compEndDate,
        status: compStatus,
        rules: compRules.trim(),
        totalQuestions: compTotalQuestions
      };
      if (onAddCompetition) onAddCompetition(newComp);
    }

    setIsCompModalOpen(false);
    resetCompForm();
  };

  // Confirm Delete Competition
  const handleConfirmDeleteComp = () => {
    if (!compToDelete) return;
    if (onDeleteCompetition) onDeleteCompetition(compToDelete.id);
    setCompToDelete(null);
  };

  // Submit Opinion Response
  const handleSubmitOpinionResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingOpinion || !opinionReplyText.trim()) return;
    if (onUpdateOpinionStatus) {
      onUpdateOpinionStatus(respondingOpinion.id, opinionTargetStatus, opinionReplyText.trim());
    }
    setRespondingOpinion(null);
    setOpinionReplyText('');
  };

  // Filtered Articles (Always sorted newest first)
  const filteredArticles = useMemo(() => {
    const list = articles.filter(art => {
      const matchesSearch = 
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (art.tags && art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
      const matchesStatus = statusFilter === 'ALL' || art.status === statusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    });
    return sortArticlesNewestFirst(list);
  }, [articles, searchTerm, selectedCategory, statusFilter]);

  // Filtered Documents (Always sorted newest first)
  const filteredDocuments = useMemo(() => {
    const list = documents.filter(doc => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.codeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.signer && doc.signer.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedCategory === 'ALL' || doc.docType === selectedCategory;
      return matchesSearch && matchesType;
    });
    return sortDocumentsNewestFirst(list);
  }, [documents, searchTerm, selectedCategory]);

  // Filtered Competitions (Always sorted newest / active first)
  const filteredCompetitions = useMemo(() => {
    const list = competitions.filter(comp => {
      return comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return sortCompetitionsNewestFirst(list);
  }, [competitions, searchTerm]);

  // Filtered Opinions (Always sorted newest first)
  const filteredOpinions = useMemo(() => {
    const list = opinions.filter(op => {
      const matchesSearch = 
        op.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.receiptCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || op.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    return sortOpinionsNewestFirst(list);
  }, [opinions, searchTerm, statusFilter]);

  // Stats calculation
  const publishedCount = articles.filter(a => a.status === 'Published').length;
  const draftCount = articles.filter(a => a.status === 'Draft').length;
  const featuredCount = articles.filter(a => a.isFeatured).length;
  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);

  return (
    <div className="space-y-6 text-slate-900 font-sans pb-12">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {actionSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />
            <span className="text-xs font-black">{actionSuccessMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner - Modern & Clean Admin Identity */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-black text-[11px] uppercase tracking-wider border border-blue-200">
              TRUNG TÂM QUẢN TRỊ NỘI DUNG CMS
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đồng bộ thời gian thực với Cổng Thông Tin
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Trị Bài Viết &amp; Nội Dung Số Phường Chánh Hiệp
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Hệ thống hỗ trợ Đăng mới, Chỉnh sửa, Xóa bỏ và Điều chỉnh vị trí hiển thị cho mọi bài viết, văn bản chỉ đạo và hội thi trực tuyến.
          </p>
        </div>

        {/* Action Button depending on Active Tab */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {onForceCloudSync && (
            <button
              type="button"
              onClick={onForceCloudSync}
              title="Đẩy toàn bộ tin bài hiện tại lên Firebase Cloud để các máy khác cập nhật ngay lập tức"
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 active:scale-98 text-xs font-bold rounded-2xl border border-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Cloud className="w-4 h-4 text-emerald-600" />
              <span>Đồng Bộ Lên Cloud</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              AppStorageEngine.exportFullDatabase();
              showSuccessBanner('Đã xuất toàn bộ dữ liệu hệ thống (Tin bài, Văn bản, Hội thi) ra tệp JSON thành công!');
            }}
            title="Tải tệp sao lưu dữ liệu toàn bộ hệ thống để đồng bộ hoặc lưu trữ"
            className="px-4 py-2.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 active:scale-98 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sao Lưu Dữ Liệu (JSON)</span>
          </button>

          {activeTab === 'ARTICLES' && (
            <button
              onClick={() => { resetArticleForm(); setIsArticleModalOpen(true); }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white stroke-[3]" />
              <span>Đăng Bài Viết Mới</span>
            </button>
          )}

          {activeTab === 'DOCUMENTS' && (
            <button
              onClick={() => { resetDocForm(); setIsDocModalOpen(true); }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white stroke-[3]" />
              <span>Thêm Văn Bản Mới</span>
            </button>
          )}

          {activeTab === 'COMPETITIONS' && (
            <button
              onClick={() => { resetCompForm(); setIsCompModalOpen(true); }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white stroke-[3]" />
              <span>Tạo Hội Thi Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Mini Stats Bar for Articles */}
      {activeTab === 'ARTICLES' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số tin bài</p>
            <p className="text-xl font-black text-slate-900 mt-1">{articles.length}</p>
          </div>
          <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 shadow-2xs">
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Đã xuất bản</p>
            <p className="text-xl font-black text-emerald-900 mt-1">{publishedCount}</p>
          </div>
          <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 shadow-2xs">
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Bản nháp chờ duyệt</p>
            <p className="text-xl font-black text-amber-900 mt-1">{draftCount}</p>
          </div>
          <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200 shadow-2xs">
            <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Tin nổi bật trang đầu</p>
            <p className="text-xl font-black text-rose-900 mt-1">{featuredCount}</p>
          </div>
        </div>
      )}

      {/* Tabs Navigation (Fit on 1 line across Desktop/Tablet) */}
      <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-2 shadow-2xs">
        <button
          onClick={() => { setActiveTab('OVERVIEW'); setSelectedCategory('ALL'); setSearchTerm(''); }}
          className={`w-full py-2.5 px-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'OVERVIEW'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span className="truncate">Thống Kê Tổng Quan</span>
        </button>

        <button
          onClick={() => { setActiveTab('ARTICLES'); setSelectedCategory('ALL'); setStatusFilter('ALL'); setSearchTerm(''); }}
          className={`w-full py-2.5 px-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'ARTICLES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
          }`}
        >
          <Newspaper className="w-4 h-4 shrink-0" />
          <span className="truncate">Tin Tức &amp; Bài Viết ({articles.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('DOCUMENTS'); setSelectedCategory('ALL'); setSearchTerm(''); }}
          className={`w-full py-2.5 px-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'DOCUMENTS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span className="truncate">Văn Bản Chỉ Đạo ({documents.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('COMPETITIONS'); setSelectedCategory('ALL'); setSearchTerm(''); }}
          className={`w-full py-2.5 px-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'COMPETITIONS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
          }`}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span className="truncate">Hội Thi ({competitions.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('OPINIONS'); setSelectedCategory('ALL'); setSearchTerm(''); }}
          className={`w-full py-2.5 px-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'OPINIONS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
          }`}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span className="truncate">Ý Kiến Dân Sinh ({opinions.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 0. OVERVIEW ANALYTICS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'OVERVIEW' && (
        <AdminAnalyticsView
          documents={documents}
          feedbackList={opinions}
          articles={articles}
        />
      )}

      {/* ========================================================================= */}
      {/* 1. ARTICLES MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'ARTICLES' && (
        <div className="space-y-4">
          
          {/* Helpful Tips Box */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl text-blue-950 text-xs flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-black text-blue-900">Tính năng quản trị bài viết nâng cao:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                <li>Bấm <strong>Sửa</strong> để cập nhật nhanh tiêu đề, hình ảnh, chuyên mục hoặc nội dung.</li>
                <li>Bấm biểu tượng <strong>Ngôi sao</strong> để ghim bài viết lên vị trí tin Nổi bật trang đầu Cổng thông tin.</li>
                <li>Bấm <strong>Bản nháp / Đã xuất bản</strong> để chuyển đổi nhanh trạng thái hiển thị.</li>
                <li>Bài viết thuộc chủ đề <strong>"Học tập và làm theo Bác"</strong> sẽ tự động xuất hiện ở khối Chuyên đề hoa sen trang trọng trên trang chủ.</li>
              </ul>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Tìm tiêu đề, nội dung, tác giả hoặc từ khóa thẻ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category and Status Selectors */}
            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-slate-600 text-[11px]">Chuyên mục:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 outline-hidden text-xs cursor-pointer"
                >
                  <option value="ALL">Tất cả chuyên mục ({articles.length})</option>
                  {ARTICLE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs">
                <span className="font-bold text-slate-600 text-[11px]">Trạng thái:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 outline-hidden text-xs cursor-pointer"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="Published">Đã xuất bản ({publishedCount})</option>
                  <option value="Draft">Bản nháp ({draftCount})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Articles Table Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 w-12 text-center">Ghim</th>
                    <th className="px-4 py-3.5">Bài viết &amp; Hình ảnh</th>
                    <th className="px-4 py-3.5">Chuyên mục</th>
                    <th className="px-4 py-3.5">Tác giả &amp; Ngày đăng</th>
                    <th className="px-4 py-3.5">Trạng thái</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs">
                        <FolderOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-slate-600">Không tìm thấy bài viết nào phù hợp với bộ lọc.</p>
                        <p className="text-slate-400 mt-1">Hãy thử xóa từ khóa tìm kiếm hoặc chọn chuyên mục khác.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50/90 transition-colors">
                        {/* Featured Star Toggle */}
                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => handleToggleArticleFeatured(art)}
                            title={art.isFeatured ? 'Đang ghim nổi bật (Bấm để hủy)' : 'Ghim nổi bật trang đầu'}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              art.isFeatured ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${art.isFeatured ? 'fill-amber-500' : ''}`} />
                          </button>
                        </td>

                        {/* Article Info */}
                        <td className="px-4 py-3.5 max-w-md">
                          <div className="flex items-start gap-3">
                            <img
                              src={getGoogleDriveDirectImageUrl(art.featuredImage) || DEFAULT_IMAGE_PRESETS[0].url}
                              alt={art.title}
                              className="w-16 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (art.featuredImage && art.featuredImage.includes('drive.google.com') && !target.dataset.triedThumbnail) {
                                  target.dataset.triedThumbnail = 'true';
                                  const match = art.featuredImage.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || art.featuredImage.match(/id=([a-zA-Z0-9_-]+)/);
                                  if (match && match[1]) target.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
                                }
                              }}
                            />
                            <div className="space-y-1">
                              <h4 className="font-black text-slate-900 text-xs leading-snug line-clamp-2 hover:text-blue-700 cursor-pointer" onClick={() => setPreviewArticle(art)}>
                                {art.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 line-clamp-1">{art.summary}</p>
                              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                {(art.attachmentName || art.attachment) && (
                                  <a
                                    href={art.driveFolderUrl || 'https://drive.google.com/drive/folders/1TNEc-8JYkF17R44igkinTIZAmFEjSmOL'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-300 transition-colors"
                                    title={`Tệp đính kèm Google Drive: ${art.attachmentName || 'Tệp đính kèm'}`}
                                  >
                                    <Paperclip className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                                    <span className="truncate max-w-[140px]">{art.attachmentName || 'Tệp đính kèm (Drive)'}</span>
                                  </a>
                                )}

                                {art.originalUrl && (
                                  <a
                                    href={art.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-700 bg-blue-100/90 hover:bg-blue-200 px-2 py-0.5 rounded-md border border-blue-300 transition-colors"
                                    title={`Xem bài viết gốc: ${art.originalUrl}`}
                                  >
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                    <span>{art.sourceName || 'Xem trên Facebook'}</span>
                                  </a>
                                )}
                                {art.tags && art.tags.length > 0 && art.tags.slice(0, 3).map((t, idx) => (
                                  <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                            art.category === 'Học tập và làm theo Bác'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : art.category === 'Đại đoàn kết'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {art.category}
                          </span>
                        </td>

                        {/* Author & Date */}
                        <td className="px-4 py-3.5 text-slate-600 text-[11px]">
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{art.authorName || 'Cán bộ Tuyên giáo'}</span>
                          </p>
                          <p className="text-slate-400 mt-0.5 flex items-center gap-1 text-[10px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{art.publishDate || '2026-08-28'}</span>
                          </p>
                        </td>

                        {/* Status Toggle Badge */}
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => handleToggleArticleStatus(art)}
                            title="Bấm để chuyển đổi giữa Xuất bản và Bản nháp"
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                              art.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${art.status === 'Published' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                            <span>{art.status === 'Published' ? 'Đã xuất bản' : 'Bản nháp'}</span>
                          </button>
                        </td>

                        {/* Action Buttons: Preview, Edit, Duplicate, Delete */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPreviewArticle(art)}
                              className="p-2 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 rounded-xl transition-all cursor-pointer"
                              title="Xem trước bài viết"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditArticle(art)}
                              className="p-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl transition-all cursor-pointer"
                              title="Chỉnh sửa bài viết"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateArticle(art)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                              title="Nhân bản bài viết này"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setArticleToDelete(art)}
                              className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 rounded-xl transition-all cursor-pointer"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DOCUMENTS MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'DOCUMENTS' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Tìm số hiệu, tên trích yếu hoặc người ký..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Loại văn bản:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-100 px-3 py-1.5 rounded-xl font-bold text-slate-800 text-xs border border-slate-200 outline-hidden cursor-pointer"
              >
                <option value="ALL">Tất cả loại ({documents.length})</option>
                {DOC_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Số / Ký hiệu</th>
                    <th className="px-4 py-3.5">Trích yếu tên văn bản</th>
                    <th className="px-4 py-3.5">Loại văn bản</th>
                    <th className="px-4 py-3.5">Người ký &amp; Ban hành</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs">
                        <FolderOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-slate-600">Không tìm thấy văn bản phù hợp.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/90 transition-colors">
                        <td className="px-5 py-3.5 font-black text-blue-700 shrink-0">
                          {doc.codeNumber}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 max-w-md">
                          <p className="line-clamp-2">{doc.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {doc.fileName && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                <FileCheck className="w-3 h-3 text-blue-600" />
                                {doc.fileName} ({doc.fileSize || 'PDF'})
                              </span>
                            )}
                            {doc.summary && (
                              <p className="text-[11px] text-slate-500 font-normal line-clamp-1">{doc.summary}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">
                            {doc.docType}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 text-[11px]">
                          <p className="font-bold text-slate-900">{doc.signer || 'Chủ tịch MTTQ'}</p>
                          <p className="text-slate-400 text-[10px]">{doc.issueDate}</p>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditDoc(doc)}
                              className="p-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl transition-all cursor-pointer"
                              title="Sửa văn bản"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDocToDelete(doc)}
                              className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 rounded-xl transition-all cursor-pointer"
                              title="Xóa văn bản"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. COMPETITIONS MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'COMPETITIONS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompetitions.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
                <Award className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-700 text-sm">Chưa có cuộc thi nào</p>
                <p className="text-xs text-slate-400 mt-1">Bấm "Tạo Hội Thi Mới" ở góc trên để tạo cuộc thi trực tuyến.</p>
              </div>
            ) : (
              filteredCompetitions.map((comp) => (
                <div key={comp.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        comp.status === 'ONGOING' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {comp.status === 'ONGOING' ? 'Đang diễn ra' : comp.status === 'UPCOMING' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">{comp.endDate}</span>
                    </div>
                    <h3 className="font-black text-slate-900 text-sm">{comp.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{comp.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700">
                      {comp.type === 'TRIVIA' ? 'Trắc nghiệm trực tuyến' : 'Bài viết cảm nhận'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditComp(comp)}
                        className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all cursor-pointer"
                        title="Sửa cuộc thi"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setCompToDelete(comp)}
                        className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl transition-all cursor-pointer"
                        title="Xóa cuộc thi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. OPINIONS MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'OPINIONS' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {filteredOpinions.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-700 text-sm">Chưa có ý kiến dân sinh nào cần xử lý</p>
              </div>
            ) : (
              filteredOpinions.map((op) => (
                <div key={op.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-blue-700 text-xs">{op.receiptCode}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-800 text-xs">{op.neighborhood}</span>
                      <span className="text-slate-400 text-xs">• {op.createdAt}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      op.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : op.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {op.status === 'RESOLVED' ? 'Đã phản hồi dứt điểm' : op.status === 'IN_PROGRESS' ? 'Đang xác minh xử lý' : 'Ý kiến mới'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-xs">Chủ đề: {op.topic}</h4>
                    <p className="text-xs text-slate-700 mt-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      "{op.content}"
                    </p>
                  </div>

                  {op.adminResponse && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
                      <p className="font-black text-emerald-800 flex items-center gap-1.5">
                        <CheckCheck className="w-4 h-4 text-emerald-600" /> Trả lời chính thức từ Ủy ban MTTQ Phường:
                      </p>
                      <p className="leading-relaxed">{op.adminResponse}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">
                      Người gửi: <strong>{op.isAnonymous ? 'Người dân ẩn danh' : op.fullname}</strong> ({op.phone || 'Không để lại SĐT'})
                    </span>

                    <button
                      onClick={() => {
                        setRespondingOpinion(op);
                        setOpinionReplyText(op.adminResponse || '');
                        setOpinionTargetStatus(op.status || 'RESOLVED');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-black rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Phản hồi &amp; Cập nhật trạng thái
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ARTICLE CREATE / EDIT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isArticleModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-5xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                    <Newspaper className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">
                      {editingArticle ? 'Chỉnh sửa nội dung bài viết' : 'Soạn & Xuất bản bài viết mới'}
                    </h3>
                    <p className="text-[11px] text-slate-500">Nội dung sẽ được cập nhật đồng bộ lên Cổng thông tin Mặt trận.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsArticleModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="flex-1 flex flex-col min-h-0 space-y-3 overflow-y-auto pr-1">
                {/* 1. AI News Link Parsing Bar - COMPACT TOP BAR */}
                <div className="p-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border border-blue-200 rounded-xl space-y-1.5 shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-black text-blue-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                      <span>Trợ lý AI Bóc tách dữ liệu từ Link URL</span>
                    </label>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Gemini 3.7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        placeholder="Dán link bài viết từ báo chí, cổng thông tin... (vd: https://baobinhduong.vn/...)"
                        value={artInputUrl || artOriginalUrl}
                        onChange={(e) => {
                          setArtInputUrl(e.target.value);
                          setArtOriginalUrl(e.target.value);
                        }}
                        className="w-full text-xs pl-7 pr-3 py-1.5 bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden font-medium text-slate-800"
                      />
                      <Globe className="w-3.5 h-3.5 text-blue-500 absolute left-2 top-2.5" />
                    </div>
                    <button
                      type="button"
                      onClick={handleParseNewsLink}
                      disabled={isParsingNewsLink}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0 disabled:opacity-50 cursor-pointer"
                    >
                      {isParsingNewsLink ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Đang bóc tách...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>AI Bóc tách</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Duplicate Article Content Warning Banner */}
                {duplicateArticleMatch && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 bg-amber-50 border border-amber-400 rounded-xl flex items-start gap-2 shadow-2xs text-slate-900 shrink-0"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-xs">
                      <p className="font-black text-amber-950 flex items-center gap-1.5 text-[11px]">
                        <span>⚠️ CẢNH BÁO ĐĂNG BÀI TRÙNG NỘI DUNG!</span>
                      </p>
                      <p className="text-amber-900 text-[10.5px]">
                        Hệ thống phát hiện bài viết tương tự đã tồn tại trong CSDL: <strong>"{duplicateArticleMatch.title}"</strong>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* TWO COLUMN MAIN FORM BODY */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-1 min-h-0">
                  {/* LEFT COLUMN: Metadata, Category, Image & Excerpt (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    {/* Title */}
                    <div>
                      <label className="text-[11px] font-black text-slate-800 block mb-1">
                        Tiêu đề bài viết <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nhập tiêu đề tin tức, hoạt động Mặt trận..."
                        value={artTitle}
                        onChange={(e) => {
                          setArtTitle(e.target.value);
                          if (!editingArticle) {
                            setArtSlug(generateSlug(e.target.value));
                          }
                        }}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden font-bold"
                      />
                    </div>

                    {/* Category, Status, Author & Date in 2x2 grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10.5px] font-black text-slate-800 block mb-1">
                          Chuyên mục <span className="text-rose-600">*</span>
                        </label>
                        <select
                          value={artCategory}
                          onChange={(e) => setArtCategory(e.target.value as ArticleCategory)}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden font-bold bg-white cursor-pointer"
                        >
                          {ARTICLE_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10.5px] font-black text-slate-800 block mb-1">
                          Trạng thái
                        </label>
                        <select
                          value={artStatus}
                          onChange={(e) => setArtStatus(e.target.value as ArticleStatus)}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden font-bold bg-white cursor-pointer"
                        >
                          <option value="Published">Đã xuất bản</option>
                          <option value="Draft">Bản nháp</option>
                          <option value="Archived">Lưu trữ</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10.5px] font-black text-slate-800 block mb-1">Tác giả</label>
                        <input
                          type="text"
                          value={artAuthor}
                          onChange={(e) => setArtAuthor(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-black text-slate-800 block mb-1">Ngày phát hành</label>
                        <input
                          type="date"
                          value={artPublishDate}
                          onChange={(e) => setArtPublishDate(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                        />
                      </div>
                    </div>

                    {/* Hero Feature Checkbox */}
                    <div className="p-2 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Star className={`w-3.5 h-3.5 ${artIsFeatured ? 'text-amber-600 fill-amber-500' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-amber-950">Ghim Tin Nổi Bật (Hero Feature)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={artIsFeatured}
                        onChange={(e) => setArtIsFeatured(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                    </div>

                    {/* Featured Image Upload & Google Drive */}
                    <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs font-black text-emerald-950 flex items-center gap-1">
                          <ImageIcon className="w-4 h-4 text-emerald-700" />
                          <span>Ảnh đại diện (Upload / Google Drive)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAppsScriptConfig(!showAppsScriptConfig)}
                          className="bg-emerald-200 hover:bg-emerald-300 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors cursor-pointer inline-flex items-center gap-0.5"
                        >
                          <Settings className="w-2.5 h-2.5" />
                          <span>Config</span>
                        </button>
                      </div>

                      {showAppsScriptConfig && (
                        <div className="p-2 bg-white border border-emerald-400 rounded-lg space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-emerald-950">Apps Script URL:</span>
                          </div>
                          <input
                            type="url"
                            placeholder="https://script.google.com/macros/s/.../exec"
                            value={appsScriptUrlInput}
                            onChange={(e) => handleSaveAppsScriptUrl(e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-emerald-300 rounded text-[11px] font-mono"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <label className="flex-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-all shadow-2xs inline-flex items-center justify-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{artAttachmentName ? 'Chọn ảnh khác' : 'Chọn ảnh từ máy'}</span>
                          <input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleAttachmentFileUpload}
                            className="hidden"
                          />
                        </label>
                        {artAttachmentName && (
                          <button
                            type="button"
                            onClick={handleUploadArticleAttachmentToDrive}
                            disabled={artIsUploading}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {artIsUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <HardDrive className="w-3.5 h-3.5" />}
                            <span>Upload Drive</span>
                          </button>
                        )}
                      </div>

                      {/* URL Option */}
                      <input
                        type="url"
                        placeholder="Hoặc dán link ảnh trực tuyến (https://...)"
                        value={artImage}
                        onChange={(e) => setArtImage(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg focus:ring-1 focus:ring-emerald-600 outline-hidden font-medium text-slate-800"
                      />

                      {/* Compact Image Preview */}
                      {artImage && (
                        <div className="relative rounded-lg overflow-hidden border border-emerald-300 bg-slate-900 group max-h-32 flex items-center justify-center">
                          <img
                            src={getGoogleDriveDirectImageUrl(artImage)}
                            alt="Preview ảnh đại diện"
                            className="w-full h-28 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const fileIdMatch = artImage.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || artImage.match(/id=([a-zA-Z0-9_-]+)/);
                              if (fileIdMatch && fileIdMatch[1] && !target.dataset.triedThumbnail) {
                                target.dataset.triedThumbnail = 'true';
                                target.src = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w800`;
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2 text-white">
                            <span className="text-[10px] font-bold bg-slate-900/80 px-2 py-0.5 rounded">
                              {artUploadSuccess ? '✅ Ảnh trên Drive' : 'Ảnh xem trước'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setArtImage('');
                                setArtAttachment('');
                                setArtAttachmentName('');
                                setArtAttachmentSize('');
                                setArtSelectedFile(null);
                                setArtUploadSuccess(false);
                              }}
                              className="p-1 bg-rose-600 text-white rounded text-xs font-bold"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Excerpt Summary */}
                    <div>
                      <label className="text-[11px] font-black text-slate-800 block mb-1">Tóm tắt trích yếu (Excerpt)</label>
                      <textarea
                        rows={2}
                        placeholder="Tóm tắt ngắn gọn 1-2 câu hiển thị ở danh sách bài viết..."
                        value={artSummary}
                        onChange={(e) => setArtSummary(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden font-medium resize-none"
                      />
                    </div>

                    {/* Tags & Original Source Link */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10.5px] font-black text-slate-800 block mb-1">Thẻ Tags</label>
                        <input
                          type="text"
                          placeholder="Mặt trận, Chánh Hiệp..."
                          value={artTags}
                          onChange={(e) => setArtTags(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10.5px] font-black text-slate-800 block mb-1">Nguồn bài viết</label>
                        <input
                          type="text"
                          placeholder="MTTQ Chánh Hiệp"
                          value={artSourceName}
                          onChange={(e) => setArtSourceName(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Full Height Main Article Content (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col h-full space-y-2">
                    <label className="text-[11px] font-black text-slate-800 flex items-center justify-between">
                      <span>Nội dung chi tiết bài viết <span className="text-rose-600">*</span></span>
                      <span className="text-[10px] text-slate-400 font-normal">Hỗ trợ định dạng văn bản & xuống dòng</span>
                    </label>
                    <textarea
                      rows={15}
                      required
                      placeholder="Nhập toàn văn nội dung bài viết tuyên truyền, phóng sự hoặc tin hoạt động..."
                      value={artContent}
                      onChange={(e) => setArtContent(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden font-medium leading-relaxed flex-1 min-h-[360px]"
                    />

                    <div>
                      <label className="text-[10.5px] font-black text-slate-800 block mb-1">Liên kết bài gốc (Link Facebook / Báo chí)</label>
                      <input
                        type="url"
                        placeholder="https://www.facebook.com/mttq.chanhhiep/posts/..."
                        value={artOriginalUrl}
                        onChange={(e) => setArtOriginalUrl(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Actions Footer */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                    <span>{editingArticle ? 'Lưu Thay Đổi Bài Viết' : 'Xuất Bản Bài Viết'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CUSTOM DELETE CONFIRMATION MODAL FOR ARTICLE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {articleToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-100 rounded-2xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Xác nhận xóa bài viết</h3>
                  <p className="text-xs text-slate-500">Hành động này không thể hoàn tác.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                <p className="font-black text-slate-900 line-clamp-2">{articleToDelete.title}</p>
                <p className="text-slate-500">Chuyên mục: {articleToDelete.category} • Ngày đăng: {articleToDelete.publishDate}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setArticleToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteArticle}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xác nhận xóa ngay</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* DOCUMENT CREATE / EDIT MODAL (FULL SIZE 2-COLUMN FLAT DESIGN) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isDocModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white w-full max-w-6xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[94vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">
                      {editingDoc ? 'Chỉnh sửa văn bản chỉ đạo' : 'Ban hành văn bản chỉ đạo mới'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Hệ thống tự động bóc tách thông tin bằng AI Gemini & lưu trữ bản mềm trực tiếp trên Google Drive
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDocModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body - 2 Columns */}
              <form onSubmit={handleSaveDocument} className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* LEFT COLUMN: FILE ATTACHMENT / GOOGLE DRIVE LINK & METADATA (5/12) */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* PROMINENT TABBED ATTACHMENT BOX: LOCAL FILE UPLOAD OR GOOGLE DRIVE LINK */}
                    <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 border border-emerald-300 rounded-2xl space-y-3 shadow-2xs">
                      {/* Header with Mode Switcher */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-emerald-200 shadow-xs">
                          <button
                            type="button"
                            onClick={() => setDocAttachMode('file')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                              docAttachMode === 'file'
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Tải tệp từ máy</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDocAttachMode('drive')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                              docAttachMode === 'drive'
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
                            }`}
                          >
                            <HardDrive className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Chèn Link Google Drive</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-700" /> AI Gemini 2.5
                        </span>
                      </div>

                      {/* MODE 1: LOCAL FILE DROPZONE */}
                      {docAttachMode === 'file' && (
                        <div className="space-y-3">
                          <div className="relative border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-white/90 p-4 rounded-xl text-center transition-all cursor-pointer group">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                              onChange={handleDocFileUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center justify-center space-y-1.5">
                              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6" />
                              </div>
                              <p className="text-xs font-black text-slate-800">
                                {docFileName ? `Tệp đã chọn: ${docFileName}` : 'Kéo thả tệp vào đây hoặc Bấm để chọn tệp văn bản'}
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium">
                                Hỗ trợ PDF, Word (.docx), TXT. Tự động trích xuất Số hiệu, Ngày ban hành, Trích yếu & Người ký.
                              </p>
                            </div>
                          </div>

                          {/* AI Extracting Status Indicator */}
                          {isExtractingDocMeta && (
                            <div className="p-2.5 bg-white rounded-xl border border-emerald-300 flex items-center gap-2 text-xs font-bold text-emerald-900 shadow-2xs">
                              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                              <span>🤖 AI Gemini đang đọc nội dung tệp & trích xuất dữ liệu...</span>
                            </div>
                          )}

                          {docFileName && (
                            <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between text-xs gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Paperclip className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span className="font-bold text-slate-900 truncate">{docFileName} ({docFileSize || 'Đã tải'})</span>
                              </div>
                              <button
                                type="button"
                                onClick={handleUploadDocFileToDrive}
                                disabled={docIsUploading || docUploadSuccess}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 disabled:opacity-50 cursor-pointer shrink-0"
                              >
                                {docIsUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <HardDrive className="w-3.5 h-3.5" />}
                                <span>{docUploadSuccess ? 'Đã lưu trên Drive' : 'Lưu lên Google Drive'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* MODE 2: GOOGLE DRIVE LINK INSERTION */}
                      {docAttachMode === 'drive' && (
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-emerald-950 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Link2 className="w-3.5 h-3.5 text-emerald-700" />
                                Dán liên kết tệp Google Drive:
                              </span>
                              <button
                                type="button"
                                onClick={handlePasteDriveUrlFromClipboard}
                                className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 bg-emerald-200/80 hover:bg-emerald-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                              >
                                <Clipboard className="w-3 h-3" />
                                <span>Dán từ Clipboard</span>
                              </button>
                            </label>

                            <div className="relative">
                              <input
                                type="url"
                                placeholder="https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing"
                                value={docDriveUrl}
                                onChange={(e) => handleDriveUrlChange(e.target.value)}
                                className="w-full text-xs pl-8 pr-8 py-2.5 bg-white border-2 border-emerald-300 focus:border-emerald-600 rounded-xl font-mono text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500"
                              />
                              <HardDrive className="w-4 h-4 text-emerald-600 absolute left-2.5 top-3" />
                              {docDriveUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleDriveUrlChange('')}
                                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-rose-600 cursor-pointer p-0.5 rounded-full"
                                  title="Xóa link"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Drive URL Detection & Live Inspector Card */}
                          {extractGoogleDriveFileId(docDriveUrl) ? (
                            <div className="p-3 bg-white rounded-xl border-2 border-emerald-300 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-900">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Đã nhận diện tệp Google Drive</span>
                                </span>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">
                                  ID: {extractGoogleDriveFileId(docDriveUrl)}
                                </span>
                              </div>

                              {/* Action Buttons for Drive File */}
                              <div className="flex items-center gap-2 pt-1 flex-wrap">
                                <a
                                  href={getGoogleDriveViewUrl(extractGoogleDriveFileId(docDriveUrl) || '') || docDriveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3 text-emerald-700" />
                                  <span>Mở trên Drive</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => extractMetaFromDriveUrl(docDriveUrl)}
                                  disabled={isExtractingDocMeta}
                                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                                >
                                  {isExtractingDocMeta ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      <span>AI đang bóc tách...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3 h-3 text-emerald-200" />
                                      <span>AI Trích xuất thông tin</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 text-[11px] text-slate-600 space-y-1">
                              <p className="font-bold text-emerald-950 flex items-center gap-1">
                                💡 Hướng dẫn chèn link Google Drive nhanh:
                              </p>
                              <ol className="list-decimal pl-4 space-y-0.5 text-slate-600">
                                <li>Mở tệp văn bản trên Google Drive của bạn.</li>
                                <li>Bấm nút <strong>Chia sẻ (Share)</strong> &rarr; Đổi quyền thành <strong>"Bất kỳ ai có đường liên kết"</strong>.</li>
                                <li>Bấm <strong>Sao chép liên kết</strong> rồi dán vào ô trên.</li>
                              </ol>
                            </div>
                          )}

                          {/* AI Extraction Progress */}
                          {isExtractingDocMeta && (
                            <div className="p-2.5 bg-white rounded-xl border border-emerald-300 flex items-center gap-2 text-xs font-bold text-emerald-900 shadow-2xs">
                              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                              <span>🤖 AI Gemini đang đọc nội dung tệp Drive & điền thông tin văn bản...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Duplicate Document Warning Banner */}
                    {duplicateDocMatch && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-start gap-3 shadow-sm text-slate-900"
                      >
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs">
                          <p className="font-black text-amber-950">⚠️ CẢNH BÁO UPLOAD / BAN HÀNH TRÙNG LẶP!</p>
                          <p className="text-amber-900 font-medium">Phát hiện văn bản trùng số hiệu trong kho lưu trữ:</p>
                          <div className="p-2 bg-white/80 rounded-xl border border-amber-200 font-bold text-slate-800 text-[11px] flex items-center justify-between gap-2">
                            <span className="truncate">[{duplicateDocMatch.codeNumber}] {duplicateDocMatch.title}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Số / Ký hiệu văn bản */}
                    <div>
                      <label className="text-xs font-black text-slate-800 block mb-1">Số / Ký hiệu văn bản (*)</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: 15/KH-MTTQ hoặc 08/NQ-MTTQ"
                        value={docCode}
                        onChange={(e) => setDocCode(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-black outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>

                    {/* Grid: Loại văn bản & Lĩnh vực */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-black text-slate-800 block mb-1">Loại văn bản</label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value as DocType)}
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold bg-white cursor-pointer"
                        >
                          {DOC_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-black text-slate-800 block mb-1">Lĩnh vực công tác</label>
                        <input
                          type="text"
                          value={docField}
                          onChange={(e) => setDocField(e.target.value)}
                          placeholder="Ví dụ: Tổ chức - Tuyên giáo"
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                        />
                      </div>
                    </div>

                    {/* Grid: Ngày ban hành & Người ký */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-black text-slate-800 block mb-1">Ngày ban hành</label>
                        <input
                          type="date"
                          value={docIssueDate}
                          onChange={(e) => setDocIssueDate(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black text-slate-800 block mb-1">Người ký ban hành</label>
                        <input
                          type="text"
                          value={docSigner}
                          onChange={(e) => setDocSigner(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                        />
                      </div>
                    </div>

                    {/* Toggle: Công khai trên Cổng TTĐT */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Công khai trên Cổng thông tin</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={docIsPublic}
                          onChange={(e) => setDocIsPublic(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: TRÍCH YẾU & NỘI DUNG TÓM TẮT (7/12) */}
                  <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                    <div>
                      <label className="text-xs font-black text-slate-800 block mb-1">
                        Trích yếu tên văn bản (*)
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Nhập tên trích yếu đầy đủ của nghị quyết, kế hoạch, thông báo..."
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold"
                      />
                    </div>

                    <div className="flex-1 flex flex-col min-h-[160px]">
                      <label className="text-xs font-black text-slate-800 block mb-1">
                        Nội dung tóm tắt chính & Chỉ đạo triển khai
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Nhập tóm tắt các nội dung trọng tâm, mục tiêu, thời hạn và phân công tổ chức thực hiện..."
                        value={docSummary}
                        onChange={(e) => setDocSummary(e.target.value)}
                        className="w-full text-xs p-3.5 bg-slate-50 border border-slate-300 rounded-xl font-medium flex-1 outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
                      />
                    </div>

                    {/* Google Drive / Document URL Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-black text-slate-800">
                          Liên kết Google Drive hoặc đường dẫn PDF (tùy chọn)
                        </label>
                        {extractGoogleDriveFileId(docDriveUrl) && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đã kết nối Google Drive
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                          value={docDriveUrl}
                          onChange={(e) => handleDriveUrlChange(e.target.value)}
                          className="w-full text-xs pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                        />
                        <HardDrive className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <span>💡</span>
                        <span>Chọn quyền <strong>"Bất kỳ ai có đường liên kết"</strong> trên Google Drive để cán bộ và nhân dân có thể xem toàn văn trực tuyến.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 mt-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsDocModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-colors active:scale-98"
                  >
                    <span>{editingDoc ? 'Lưu cập nhật văn bản' : 'Ban hành văn bản chỉ đạo'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CUSTOM DELETE CONFIRMATION FOR DOCUMENT */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {docToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-100 rounded-2xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Xác nhận xóa văn bản</h3>
                  <p className="text-xs text-slate-500">Văn bản sẽ được gỡ khỏi cơ sở dữ liệu.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                <p className="font-black text-blue-700">{docToDelete.codeNumber}</p>
                <p className="text-slate-800 line-clamp-2">{docToDelete.title}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDocToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteDoc}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* COMPETITION CREATE / EDIT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCompModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>{editingComp ? 'Chỉnh sửa cuộc thi' : 'Khởi tạo cuộc thi trực tuyến mới'}</span>
                </h3>
                <button onClick={() => setIsCompModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCompetition} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tên cuộc thi (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Hội thi tìm hiểu 96 năm Mặt trận Dân tộc Thống nhất..."
                    value={compTitle}
                    onChange={(e) => setCompTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl font-black outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Hình thức thi</label>
                    <select
                      value={compType}
                      onChange={(e) => setCompType(e.target.value as any)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold bg-white cursor-pointer"
                    >
                      <option value="TRIVIA">Trắc nghiệm trực tuyến</option>
                      <option value="WRITING">Bài viết tự luận</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Trạng thái</label>
                    <select
                      value={compStatus}
                      onChange={(e) => setCompStatus(e.target.value as any)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold bg-white cursor-pointer"
                    >
                      <option value="ONGOING">Đang diễn ra</option>
                      <option value="UPCOMING">Sắp diễn ra</option>
                      <option value="ENDED">Đã kết thúc</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả tóm tắt</label>
                  <textarea
                    rows={2}
                    value={compDesc}
                    onChange={(e) => setCompDesc(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Thể lệ &amp; Hướng dẫn thi</label>
                  <textarea
                    rows={3}
                    value={compRules}
                    onChange={(e) => setCompRules(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCompModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                  >
                    Lưu cuộc thi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* OPINION RESPONSE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {respondingOpinion && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Xử lý &amp; Trả lời Ý kiến Dân sinh</span>
                </h3>
                <button onClick={() => setRespondingOpinion(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                <p className="font-black text-blue-700">{respondingOpinion.receiptCode} • {respondingOpinion.neighborhood}</p>
                <p className="text-slate-800 italic">"{respondingOpinion.content}"</p>
              </div>

              <form onSubmit={handleSubmitOpinionResponse} className="space-y-3.5">
                <div>
                  <label className="text-xs font-black text-slate-800 block mb-1">Nội dung phản hồi chính thức của MTTQ Phường (*)</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Nhập nội dung kết quả xác minh, giải quyết để phản hồi công khai..."
                    value={opinionReplyText}
                    onChange={(e) => setOpinionReplyText(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-2xl outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-800 block mb-1">Cập nhật trạng thái xử lý</label>
                  <select
                    value={opinionTargetStatus}
                    onChange={(e) => setOpinionTargetStatus(e.target.value as OpinionStatus)}
                    className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-xl font-bold bg-white cursor-pointer"
                  >
                    <option value="RESOLVED">Đã giải quyết &amp; Phản hồi dứt điểm</option>
                    <option value="IN_PROGRESS">Đang tiến hành xác minh xử lý</option>
                    <option value="NEW">Chờ xử lý</option>
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRespondingOpinion(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                  >
                    Phê duyệt &amp; Xuất bản trả lời
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* PREVIEW ARTICLE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewArticle && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase">
                    {previewArticle.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${
                    previewArticle.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {previewArticle.status === 'Published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </div>
                <button onClick={() => setPreviewArticle(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">{previewArticle.title}</h2>
              
              <div className="flex items-center gap-4 text-xs text-slate-500 font-bold border-b border-slate-100 pb-3">
                <span>Tác giả: <strong className="text-slate-800">{previewArticle.authorName}</strong></span>
                <span>•</span>
                <span>Ngày đăng: {previewArticle.publishDate}</span>
                <span>•</span>
                <span>Lượt xem: {previewArticle.views || 1}</span>
              </div>

              {previewArticle.featuredImage && (
                <img
                  src={getGoogleDriveDirectImageUrl(previewArticle.featuredImage)}
                  alt={previewArticle.title}
                  className="w-full h-72 md:h-80 object-cover rounded-2xl border border-slate-200 shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (previewArticle.featuredImage && previewArticle.featuredImage.includes('drive.google.com') && !target.dataset.triedThumbnail) {
                      target.dataset.triedThumbnail = 'true';
                      const match = previewArticle.featuredImage.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || previewArticle.featuredImage.match(/id=([a-zA-Z0-9_-]+)/);
                      if (match && match[1]) target.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
                    }
                  }}
                />
              )}

              <p className="text-xs md:text-sm font-bold text-slate-800 italic bg-slate-50 p-4 rounded-2xl border-l-4 border-blue-600 leading-relaxed">
                {previewArticle.summary}
              </p>

              <div className="text-xs md:text-sm text-slate-800 leading-relaxed space-y-3 whitespace-pre-line">
                {previewArticle.content}
              </div>



              {previewArticle.originalUrl && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-blue-950">Nguồn bài viết gốc:</p>
                      <p className="text-[11px] text-blue-800 truncate max-w-md font-mono">{previewArticle.originalUrl}</p>
                    </div>
                  </div>
                  <a
                    href={previewArticle.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-xs inline-flex items-center gap-1.5 shrink-0"
                  >
                    <span>Xem bài viết trên Facebook</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {previewArticle.tags && previewArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-500">Từ khóa:</span>
                  {previewArticle.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-8 max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-600 text-white font-mono font-black text-xs rounded-lg shadow-2xs">
                    {previewDoc.codeNumber}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs border border-slate-200">
                    {previewDoc.docType}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                    {previewDoc.title}
                  </h2>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-sans">
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-500 block">Cơ quan ban hành:</span>
                      <span className="font-extrabold text-slate-900">{previewDoc.issuer}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-500 block">Người ký duyệt:</span>
                      <span className="font-extrabold text-slate-900">{previewDoc.signer}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-500 block">Ngày ban hành:</span>
                      <span className="font-bold text-slate-800">{previewDoc.issueDate}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-500 block">Lĩnh vực:</span>
                      <span className="font-bold text-slate-800">{previewDoc.field}</span>
                    </div>
                  </div>
                </div>

                {/* Description / Summary */}
                {previewDoc.summary && (
                  <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-slate-900 text-xs sm:text-sm font-medium leading-relaxed space-y-2">
                    <span className="font-extrabold text-blue-900 block uppercase tracking-wide text-xs">Mô tả tóm tắt nội dung văn bản:</span>
                    <p>{previewDoc.summary}</p>
                  </div>
                )}

                {/* Embedded Viewer with Secure PDF.js / Proxy */}
                {(previewDoc.driveUrl || previewDoc.fileUrl) && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Xem trước tài liệu toàn văn</span>
                    </h4>

                    <SecurePdfViewer
                      fileUrl={previewDoc.fileUrl}
                      driveUrl={previewDoc.driveUrl}
                      title={previewDoc.title}
                      height="520px"
                    />
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-black rounded-xl cursor-pointer"
                >
                  Đóng lại
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
