import React, { useState, useEffect } from 'react';
import { 
  uploadFileToGoogleDrive, 
  DEFAULT_DRIVE_FOLDER_ID, 
  DEFAULT_DRIVE_FOLDER_URL, 
  CHANH_HIEP_DRIVE_FOLDERS, 
  DriveFolderItem,
  getGoogleDriveDirectImageUrl,
  getGoogleDrivePreviewEmbedUrl,
  extractGoogleDriveFileId,
  handleImageError
} from '../../lib/googleDriveService';
import { inspectImageFile, formatBytes, isFacebookCdnUrl, isFacebookPostUrl, compressAndOptimizeImageFile } from '../../lib/imageOptimization';
import { ARTICLE_BANNERS } from '../../utils/officialImages';
import { 
  Link2, 
  Upload, 
  FolderOpen, 
  Image as ImageIcon, 
  FileText, 
  HardDrive, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  AlertCircle, 
  AlertTriangle,
  Palette,
  ShieldCheck,
  Loader2, 
  X, 
  Eye, 
  RefreshCw,
  CheckCircle2,
  Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SmartMediaDriveUploaderProps {
  label?: string;
  currentValue?: string;
  currentName?: string;
  currentSize?: string;
  accept?: string;
  modeType?: 'image' | 'document' | 'all';
  defaultFolderCode?: 'hcm' | 'kien-thuc-chung' | 'van-ban-lhpn' | 'van-ban-doan' | 'van-ban-mttq' | 'data' | 'uploadvb';
  onMediaSelected: (result: {
    url: string;
    directImageUrl?: string;
    name?: string;
    size?: string;
    isDrive: boolean;
    folderCode?: string;
  }) => void;
  onClear?: () => void;
  className?: string;
}

const DEFAULT_PRESETS = [
  { label: 'Lễ chào cờ & Dưới cờ', url: ARTICLE_BANNERS.chao_co, folder: 'van-ban-mttq', tag: 'Chào cờ' },
  { label: 'Hội nghị & Thi đua MTTQ', url: ARTICLE_BANNERS.thidua, folder: 'van-ban-mttq', tag: 'Thi đua' },
  { label: 'Không gian Bác Hồ', url: ARTICLE_BANNERS.hoctapbac, folder: 'hcm', tag: 'Bác Hồ' },
  { label: 'Chăm lo An sinh & Sức khỏe', url: ARTICLE_BANNERS.ansinh, folder: 'van-ban-mttq', tag: 'An sinh' },
  { label: 'Tuổi trẻ & Youth Fest', url: ARTICLE_BANNERS.thanhnien, folder: 'kien-thuc-chung', tag: 'Thanh niên' },
  { label: 'Hội Liên hiệp Phụ nữ', url: ARTICLE_BANNERS.phunu, folder: 'van-ban-mttq', tag: 'Phụ nữ' },
  { label: '21 Khu phố & Đại hội', url: ARTICLE_BANNERS.khupho, folder: 'kien-thuc-chung', tag: 'Khu phố' },
  { label: 'Giám sát & Phản biện', url: ARTICLE_BANNERS.giamsat, folder: 'van-ban-mttq', tag: 'Giám sát' },
  { label: 'Tết Trung thu thiếu nhi', url: ARTICLE_BANNERS.trungthu, folder: 'kien-thuc-chung', tag: 'Trung thu' },
  { label: 'Biểu trưng Chánh Hiệp', url: ARTICLE_BANNERS.logo_chanh_hiep, folder: 'kien-thuc-chung', tag: 'Logo' },
  { label: 'Cổng thông tin Mặt trận', url: ARTICLE_BANNERS.default, folder: 'kien-thuc-chung', tag: 'MTTQ' },
];

export const SmartMediaDriveUploader: React.FC<SmartMediaDriveUploaderProps> = ({
  label = 'Hình ảnh & Tài liệu đính kèm',
  currentValue = '',
  currentName = '',
  currentSize = '',
  accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx',
  modeType = 'all',
  defaultFolderCode = 'data',
  onMediaSelected,
  onClear,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'upload' | 'folders' | 'presets'>('link');
  
  // Link input state
  const [inputUrl, setInputUrl] = useState(currentValue);
  const [linkDiagnostics, setLinkDiagnostics] = useState<{
    isDrive: boolean;
    fileId: string;
    directImageUrl: string;
    embedUrl: string;
  }>({ isDrive: false, fileId: '', directImageUrl: '', embedUrl: '' });

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFolderCode, setSelectedFolderCode] = useState<string>(defaultFolderCode);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [isTestingUrlValid, setIsTestingUrlValid] = useState<boolean | null>(null);
  const [isSavingPermanent, setIsSavingPermanent] = useState(false);
  const [isExtractingFbPost, setIsExtractingFbPost] = useState(false);

  // Sync internal link input when currentValue changes
  useEffect(() => {
    setInputUrl(currentValue);
    analyzeUrl(currentValue);
  }, [currentValue]);

  // Test external URL image loading
  useEffect(() => {
    if (!inputUrl || linkDiagnostics.isDrive || isFacebookPostUrl(inputUrl)) {
      setIsTestingUrlValid(null);
      return;
    }
    if (modeType === 'image' && (inputUrl.startsWith('http://') || inputUrl.startsWith('https://'))) {
      const testImg = new window.Image();
      testImg.referrerPolicy = 'no-referrer';
      testImg.onload = () => setIsTestingUrlValid(true);
      testImg.onerror = () => setIsTestingUrlValid(false);
      testImg.src = inputUrl;
    }
  }, [inputUrl, linkDiagnostics.isDrive, modeType]);

  // Analyze URL to detect Google Drive file ID, high-res direct image URL, and embed URL
  const analyzeUrl = (url: string) => {
    if (!url) {
      setLinkDiagnostics({ isDrive: false, fileId: '', directImageUrl: '', embedUrl: '' });
      return;
    }
    const fileId = extractGoogleDriveFileId(url);
    const isDrive = !!fileId || url.includes('drive.google.com');
    const directImageUrl = getGoogleDriveDirectImageUrl(url);
    const embedUrl = getGoogleDrivePreviewEmbedUrl(url);

    setLinkDiagnostics({
      isDrive,
      fileId,
      directImageUrl,
      embedUrl
    });
  };

  const handleLinkChange = (url: string) => {
    setInputUrl(url);
    analyzeUrl(url);
  };

  const handleApplyLink = () => {
    if (!inputUrl.trim()) return;
    const fileId = extractGoogleDriveFileId(inputUrl);
    const isDrive = !!fileId || inputUrl.includes('drive.google.com');
    const isFbCdn = isFacebookCdnUrl(inputUrl);
    const isFbPost = isFacebookPostUrl(inputUrl);
    const directImage = isFbPost ? ARTICLE_BANNERS.default : getGoogleDriveDirectImageUrl(inputUrl);

    onMediaSelected({
      url: isFbPost ? ARTICLE_BANNERS.default : inputUrl.trim(),
      directImageUrl: directImage || inputUrl.trim(),
      name: currentName || (isDrive ? `Drive File (${fileId.slice(0, 8)}...)` : isFbCdn ? 'Ảnh từ Facebook' : isFbPost ? 'Banner chính thống Mặt trận' : 'Tài liệu / Ảnh liên kết'),
      isDrive,
      folderCode: selectedFolderCode
    });
  };

  // Convert external image (Facebook CDN or Web) into permanent persistent image in /uploads/
  const handleSaveToPermanentStorage = async () => {
    if (!inputUrl.trim()) return;
    setIsSavingPermanent(true);
    setUploadError(null);
    try {
      const res = await fetch('/api/media/save-external-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể lưu ảnh từ liên kết.');
      }
      onMediaSelected({
        url: data.directImageUrl,
        directImageUrl: data.directImageUrl,
        name: `Ảnh lưu trữ vĩnh viễn (${data.sizeFormatted})`,
        size: data.sizeFormatted,
        isDrive: false,
        folderCode: selectedFolderCode
      });
      setInputUrl(data.directImageUrl);
      analyzeUrl(data.directImageUrl);
      setUploadSuccess(true);
    } catch (err: any) {
      setUploadError(err.message || 'Lỗi khi lưu ảnh vĩnh viễn');
    } finally {
      setIsSavingPermanent(false);
    }
  };

  // Extract representative image from a Facebook Post link
  const handleExtractFromFbPost = async () => {
    if (!inputUrl.trim()) return;
    setIsExtractingFbPost(true);
    setUploadError(null);
    try {
      const res = await fetch('/api/media/parse-facebook-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() })
      });
      const data = await res.json();
      if (data.data?.imageUrl) {
        // Automatically save it permanently to uploads so it never expires
        try {
          const saveRes = await fetch('/api/media/save-external-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: data.data.imageUrl })
          });
          const saveData = await saveRes.json();
          const finalUrl = (saveData.success && saveData.directImageUrl) ? saveData.directImageUrl : data.data.imageUrl;
          onMediaSelected({
            url: finalUrl,
            directImageUrl: finalUrl,
            name: `Ảnh trích xuất từ bài viết Facebook (${data.data.title || 'Bài viết'})`,
            isDrive: false,
            folderCode: selectedFolderCode
          });
          setInputUrl(finalUrl);
          analyzeUrl(finalUrl);
          setUploadSuccess(true);
          return;
        } catch {
          onMediaSelected({
            url: data.data.imageUrl,
            directImageUrl: data.data.imageUrl,
            name: `Ảnh trích xuất từ bài viết Facebook`,
            isDrive: false
          });
          setInputUrl(data.data.imageUrl);
          analyzeUrl(data.data.imageUrl);
          setUploadSuccess(true);
        }
      } else {
        setUploadError('Facebook bảo mật bài viết này. Vui lòng bấm tab "Tải ảnh từ máy" để tải ảnh lên hoặc chọn Banner phù hợp bên tab "Ảnh mẫu".');
      }
    } catch (err: any) {
      setUploadError('Không thể lấy ảnh từ bài viết Facebook: ' + err.message);
    } finally {
      setIsExtractingFbPost(false);
    }
  };

  // Handle local file selection with auto client-side image compression
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(false);

    const isImageFile = file.type.startsWith('image/') || modeType === 'image';
    if (isImageFile) {
      try {
        const compressed = await compressAndOptimizeImageFile(file);
        const originalMb = (compressed.originalSize / (1024 * 1024)).toFixed(2);
        const compKb = Math.round(compressed.compressedSize / 1024);
        
        onMediaSelected({
          url: compressed.dataUrl,
          directImageUrl: compressed.dataUrl,
          name: file.name,
          size: `${compKb} KB (gốc ${originalMb} MB)`,
          isDrive: false,
          folderCode: selectedFolderCode
        });
        setUploadSuccess(true);
        return;
      } catch (compErr) {
        console.warn('[SmartMediaDriveUploader] Compression fallback:', compErr);
      }
    }

    // Fallback DataURL reader for non-images
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        const formattedSize = sizeMb === '0.00' ? `${(file.size / 1024).toFixed(1)} KB` : `${sizeMb} MB`;
        
        onMediaSelected({
          url: reader.result,
          directImageUrl: reader.result,
          name: file.name,
          size: formattedSize,
          isDrive: false,
          folderCode: selectedFolderCode
        });
        setUploadSuccess(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload to Google Drive ChanhHiep Folder
  const handleUploadToDrive = async () => {
    if (!selectedFile) {
      setUploadError('Vui lòng chọn tệp tin từ thiết bị trước.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setUploadError(null);

    try {
      setUploadProgress(50);
      const res = await uploadFileToGoogleDrive(selectedFile, DEFAULT_DRIVE_FOLDER_ID);
      setUploadProgress(90);

      const webViewLink = res.webViewLink || `https://drive.google.com/file/d/${res.id}/view`;
      const directImage = res.id ? `https://lh3.googleusercontent.com/d/${res.id}=w2000` : webViewLink;
      const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(2);
      const formattedSize = sizeMb === '0.00' ? `${(selectedFile.size / 1024).toFixed(1)} KB` : `${sizeMb} MB`;

      onMediaSelected({
        url: webViewLink,
        directImageUrl: directImage,
        name: res.name || selectedFile.name,
        size: formattedSize,
        isDrive: true,
        folderCode: selectedFolderCode
      });

      setInputUrl(webViewLink);
      analyzeUrl(webViewLink);
      setUploadSuccess(true);
      setUploadProgress(100);
    } catch (err: any) {
      console.error('[SmartMediaDriveUploader] Upload error:', err);
      setUploadError(`Lỗi tải lên: ${err?.message || 'Không thể kết nối Drive'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyCurrentLink = () => {
    if (!currentValue) return;
    navigator.clipboard.writeText(currentValue);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const targetFolder = CHANH_HIEP_DRIVE_FOLDERS.find(f => f.code === selectedFolderCode) || CHANH_HIEP_DRIVE_FOLDERS[0];

  const isCurrentAnImage = modeType === 'image' || 
    (currentValue && (currentValue.startsWith('data:image') || 
     currentValue.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || 
     linkDiagnostics.isDrive));

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800 ${className}`}>
      {/* Header bar */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
            {modeType === 'image' ? <ImageIcon className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
          </div>
          <div>
            <label className="text-xs font-black text-slate-900 block">{label}</label>
            <p className="text-[10px] text-slate-500">
              Hỗ trợ gắn link ảnh/tài liệu trực tiếp hoặc Upload lên Google Drive Chánh Hiệp
            </p>
          </div>
        </div>

        {/* Current status pill */}
        {currentValue && (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Đã liên kết
            </span>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                title="Xóa liên kết này"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-slate-100/60 p-1 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('link')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'link'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Gắn link Drive / URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload lên Drive</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('folders')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'folders'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>Thư mục Chánh Hiệp</span>
        </button>

        {modeType === 'image' && (
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ảnh mẫu</span>
          </button>
        )}
      </div>

      {/* Tab Contents */}
      <div className="p-3.5 space-y-3">
        {/* =================================================================== */}
        {/* TAB 1: GẮN LINK GOOGLE DRIVE HOẶC URL ẢNH / TÀI LIỆU */}
        {/* =================================================================== */}
        {activeTab === 'link' && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Dán đường dẫn Google Drive / Web / Cloudinary:
                </label>
                <a
                  href={DEFAULT_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10.5px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Mở Google Drive</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/... hoặc https://..."
                    value={inputUrl}
                    onChange={(e) => handleLinkChange(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden font-mono text-slate-800"
                  />
                  <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="button"
                  onClick={handleApplyLink}
                  disabled={!inputUrl.trim()}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Smart detection badge */}
            {linkDiagnostics.isDrive && (
              <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-blue-600 text-white rounded-md text-[9px] font-black">DRIVE</span>
                  <div>
                    <p className="font-bold text-blue-950 text-[11px]">Đã nhận dạng tệp Google Drive</p>
                    <p className="text-[10px] text-blue-700 font-mono">ID: {linkDiagnostics.fileId}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Tự động chuyển đổi HD
                </span>
              </div>
            )}

            {/* Facebook Post Detection Card */}
            {isFacebookPostUrl(inputUrl) && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-xl space-y-2 text-xs text-blue-950 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Phát hiện liên kết bài viết Facebook (Trang web HTML)</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Đây là liên kết trang bài viết Facebook chứ không phải tệp ảnh trực tiếp. Để bài viết có ảnh đại diện đẹp và không bị lỗi, bạn có thể:
                </p>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={handleExtractFromFbPost}
                    disabled={isExtractingFbPost}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all disabled:opacity-50"
                  >
                    {isExtractingFbPost ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{isExtractingFbPost ? 'Đang trích xuất ảnh...' : '🔍 Tự động trích xuất ảnh từ bài viết Facebook này'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="px-2.5 py-1.5 bg-white border border-blue-200 hover:bg-blue-100 text-blue-900 font-bold rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh từ máy lên</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('presets')}
                    className="px-2.5 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-950 font-bold rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Chọn Banner chuyên đề</span>
                  </button>
                </div>
              </div>
            )}

            {/* Facebook CDN Image Detection Card */}
            {isFacebookCdnUrl(inputUrl) && !isFacebookPostUrl(inputUrl) && (
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl space-y-2 text-xs text-amber-950 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Phát hiện liên kết ảnh Facebook CDN (fbcdn / token có thời hạn)</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Liên kết ảnh trực tiếp từ Facebook có kèm mã định danh có thời hạn và có thể <strong>hết hạn sau vài tuần (lỗi 403)</strong>. Để bài viết luôn hiển thị vĩnh viễn, bạn nên chọn:
                </p>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={handleSaveToPermanentStorage}
                    disabled={isSavingPermanent}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all disabled:opacity-50"
                  >
                    {isSavingPermanent ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    <span>{isSavingPermanent ? 'Đang lưu vào hệ thống...' : '📥 Tải & Lưu ảnh vĩnh viễn (Khuyên dùng - 100% không lo hết hạn)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyLink}
                    className="px-2.5 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Áp dụng dùng qua Proxy chống chặn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('presets')}
                    className="px-2.5 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Chọn Banner chuyên đề</span>
                  </button>
                </div>
              </div>
            )}

            {/* Live Web Image Tester (for non-Drive and non-Facebook URLs) */}
            {inputUrl && !isFacebookCdnUrl(inputUrl) && !linkDiagnostics.isDrive && (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">Trạng thái kết nối ảnh:</span>
                  {isTestingUrlValid === true && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Liên kết hoạt động tốt
                    </span>
                  )}
                  {isTestingUrlValid === false && (
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Trang nguồn chặn hiển thị
                    </span>
                  )}
                  {isTestingUrlValid === null && (
                    <span className="text-[10px] text-slate-400">Đang kiểm tra kết nối...</span>
                  )}
                </div>
                {isTestingUrlValid === false && (
                  <p className="text-[10.5px] text-red-600 leading-tight">
                    Liên kết này bị máy chủ nguồn chặn truy cập trực tiếp (CORS/Hotlink). Bạn nên lưu ảnh về máy tính và bấm tab <strong>"Tải lên từ thiết bị"</strong> hoặc <strong>"Ảnh mẫu"</strong> để đảm bảo hiển thị 100%.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: UPLOAD FILE & LƯU TRỮ VÀO GOOGLE DRIVE CHÁNH HIỆP */}
        {/* =================================================================== */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            {/* Choose Target Folder */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Lưu vào thư mục Google Drive:
              </label>
              <select
                value={selectedFolderCode}
                onChange={(e) => setSelectedFolderCode(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                {CHANH_HIEP_DRIVE_FOLDERS.map((f) => (
                  <option key={f.code} value={f.code}>
                    📂 {f.name} - {f.description.slice(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            {/* File Dropzone / Picker */}
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 text-center bg-slate-50/60 hover:bg-blue-50/40 transition-all">
              <input
                type="file"
                id={`smart-uploader-${label}`}
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor={`smart-uploader-${label}`}
                className="cursor-pointer flex flex-col items-center justify-center space-y-1.5"
              >
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : 'Bấm để chọn tệp từ máy tính hoặc kéo thả vào đây'}
                </p>
                <p className="text-[10px] text-slate-500">
                  Hỗ trợ PNG, JPG, WEBP, PDF, DOCX, XLSX (Tối đa 50MB)
                </p>
              </label>
            </div>

            {/* Upload Action Button */}
            {selectedFile && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUploadToDrive}
                  disabled={isUploading}
                  className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tải lên Drive ({uploadProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-4 h-4" />
                      <span>Tải lên Google Drive ({targetFolder.name})</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error or Success notification */}
            {uploadError && (
              <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
            {uploadSuccess && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4 shrink-0" />
                <span>Đã tải lên và lưu vào Google Drive thành công!</span>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: DANH SÁCH 7 THƯ MỤC GOOGLE DRIVE CHÁNH HIỆP */}
        {/* =================================================================== */}
        {activeTab === 'folders' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-700">
                Cấu trúc Thư mục Google Drive Chánh Hiệp:
              </span>
              <a
                href={DEFAULT_DRIVE_FOLDER_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[10.5px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Mở thư mục gốc</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {CHANH_HIEP_DRIVE_FOLDERS.map((folder) => (
                <div
                  key={folder.code}
                  className="p-2 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 rounded-xl flex items-center justify-between text-xs transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate flex items-center gap-1">
                      <span>📂</span> {folder.name}
                    </p>
                    <p className="text-[9.5px] text-slate-500 truncate">{folder.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={folder.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg"
                      title="Mở thư mục này trên Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: THƯ VIỆN ẢNH MẪU CHUẨN */}
        {/* =================================================================== */}
        {activeTab === 'presets' && modeType === 'image' && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-700">Chọn nhanh ảnh bìa chuẩn MTTQ:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_PRESETS.map((preset) => (
                <div
                  key={preset.label}
                  onClick={() => {
                    onMediaSelected({
                      url: preset.url,
                      directImageUrl: preset.url,
                      name: preset.label,
                      isDrive: false,
                      folderCode: preset.folder
                    });
                    setInputUrl(preset.url);
                  }}
                  className="group relative cursor-pointer border border-slate-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-sm transition-all"
                >
                  <div className="aspect-video w-full bg-slate-100 overflow-hidden">
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-1.5 bg-white">
                    <p className="text-[10.5px] font-bold text-slate-800 truncate">{preset.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* LIVE PREVIEW BOX */}
        {/* =================================================================== */}
        {currentValue && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                Xem trước tệp / ảnh liên kết:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCurrentLink}
                  className="text-[10px] text-slate-600 hover:text-blue-600 flex items-center gap-1 font-medium"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Đã chép link' : 'Sao chép link'}</span>
                </button>
                <a
                  href={currentValue}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Mở gốc</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Image Preview */}
            {isCurrentAnImage ? (
              <div className="relative aspect-video max-h-48 w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-200 group">
                <img
                  src={getGoogleDriveDirectImageUrl(currentValue)}
                  alt="Xem trước"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, ARTICLE_BANNERS.default)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2 flex items-center justify-between text-white text-[10px]">
                  <span className="font-bold truncate max-w-[70%]">
                    {currentName || 'Ảnh đại diện'}
                  </span>
                  {currentSize && <span>{currentSize}</span>}
                </div>
              </div>
            ) : (
              /* Document preview badge */
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentName || 'Tài liệu đính kèm'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {currentSize ? `${currentSize} • ` : ''}{currentValue}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
