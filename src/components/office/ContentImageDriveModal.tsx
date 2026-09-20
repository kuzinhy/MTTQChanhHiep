import React, { useState } from 'react';
import { 
  CHANH_HIEP_DRIVE_FOLDERS, 
  DEFAULT_DRIVE_FOLDER_URL, 
  DEFAULT_DRIVE_FOLDER_ID,
  uploadFileToGoogleDrive,
  getGoogleDriveDirectImageUrl,
  extractGoogleDriveFileId,
  handleImageError
} from '../../lib/googleDriveService';
import { ARTICLE_BANNERS } from '../../utils/officialImages';
import { 
  X, 
  Plus, 
  Link2, 
  Upload, 
  FolderOpen, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Check, 
  HardDrive, 
  ExternalLink,
  Loader2,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContentImageDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertContent: (snippet: string) => void;
}

export const ContentImageDriveModal: React.FC<ContentImageDriveModalProps> = ({
  isOpen,
  onClose,
  onInsertContent
}) => {
  const [activeTab, setActiveTab] = useState<'drive-link' | 'upload' | 'presets'>('drive-link');
  
  // Link Tab State
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [align, setAlign] = useState<'center' | 'left' | 'right'>('center');
  
  // Upload Tab State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFolderCode, setTargetFolderCode] = useState('data');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const directImage = getGoogleDriveDirectImageUrl(url);
  const isDrive = url.includes('drive.google.com') || !!extractGoogleDriveFileId(url);

  const handleInsert = (customUrl?: string, customCaption?: string) => {
    const finalUrl = customUrl || directImage || url;
    const finalCaption = customCaption || caption || 'Hình ảnh hoạt động MTTQ Chánh Hiệp';
    
    // Check if document or image
    const isDoc = url.endsWith('.pdf') || url.endsWith('.doc') || url.endsWith('.docx') || url.endsWith('.xls') || url.endsWith('.xlsx') || url.includes('/document/d/') || url.includes('/spreadsheets/d/');

    let snippet = '';
    if (isDoc) {
      snippet = `\n\n📄 **[Tài liệu đính kèm: ${finalCaption}](${finalUrl})**\n\n`;
    } else {
      snippet = `\n\n![${finalCaption}](${finalUrl})\n*${finalCaption}*\n\n`;
    }

    onInsertContent(snippet);
    onClose();
    // Reset state
    setUrl('');
    setCaption('');
  };

  const handleUploadAndInsert = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(30);

    try {
      const res = await uploadFileToGoogleDrive(selectedFile, DEFAULT_DRIVE_FOLDER_ID);
      setUploadProgress(80);

      const finalUrl = res.id ? `https://lh3.googleusercontent.com/d/${res.id}=w2000` : res.webViewLink;
      const finalCaption = caption || selectedFile.name;

      let snippet = '';
      if (selectedFile.type.startsWith('image/')) {
        snippet = `\n\n![${finalCaption}](${finalUrl})\n*${finalCaption}*\n\n`;
      } else {
        snippet = `\n\n📄 **[Tài liệu đính kèm: ${finalCaption}](${res.webViewLink})**\n\n`;
      }

      onInsertContent(snippet);
      onClose();
    } catch (err: any) {
      console.error('Upload error in content modal:', err);
      alert(`Lỗi tải lên: ${err?.message || 'Không thể kết nối'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl border border-slate-200 flex flex-col text-slate-900 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900">
                Chèn hình ảnh &amp; tài liệu vào nội dung bài viết
              </h3>
              <p className="text-[11px] text-slate-500">
                Gắn link Google Drive hoặc tải tệp trực tiếp lên 7 thư mục Chánh Hiệp
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-100/60 p-1 gap-1 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('drive-link')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'drive-link'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Gắn link Drive / Web</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload lên Drive</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ảnh mẫu MTTQ</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-3">
          {/* TAB 1: Link */}
          {activeTab === 'drive-link' && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Đường dẫn Google Drive / Web:
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/... hoặc https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-mono"
                  />
                  <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Chú thích / Tên hiển thị dưới ảnh:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đại biểu tham dự Hội nghị tiếp xúc cử tri phường..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                />
              </div>

              {/* Live Preview */}
              {url && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-700">
                    <span>Xem trước:</span>
                    {isDrive && (
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[9.5px]">
                        Google Drive HD
                      </span>
                    )}
                  </div>
                  <div className="aspect-video max-h-36 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={directImage}
                      alt="Preview"
                      onError={(e) => handleImageError(e, ARTICLE_BANNERS.default)}
                      className="max-h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Lưu vào Thư mục Google Drive:
                </label>
                <select
                  value={targetFolderCode}
                  onChange={(e) => setTargetFolderCode(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  {CHANH_HIEP_DRIVE_FOLDERS.map((f) => (
                    <option key={f.code} value={f.code}>
                      📂 {f.name} ({f.description.slice(0, 35)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 text-center bg-slate-50">
                <input
                  type="file"
                  id="modal-content-file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setSelectedFile(f);
                      if (!caption) setCaption(f.name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="modal-content-file" className="cursor-pointer space-y-1 block">
                  <Upload className="w-5 h-5 text-blue-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">
                    {selectedFile ? selectedFile.name : 'Bấm chọn tệp ảnh hoặc tài liệu'}
                  </p>
                </label>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Chú thích hiển thị:
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Nhập lời chú thích ảnh..."
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Presets */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {[
                { label: 'Hội nghị MTTQ', url: ARTICLE_BANNERS.thidua },
                { label: 'Không gian Bác Hồ', url: ARTICLE_BANNERS.hoctapbac },
                { label: 'Chăm lo An sinh', url: ARTICLE_BANNERS.ansinh },
                { label: 'Giám sát Phản biện', url: ARTICLE_BANNERS.giamsat },
                { label: 'Khu phố Dân cư', url: ARTICLE_BANNERS.default },
              ].map((p) => (
                <div
                  key={p.label}
                  onClick={() => handleInsert(p.url, p.label)}
                  className="group cursor-pointer border border-slate-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-xs transition-all"
                >
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <p className="p-1.5 text-[10.5px] font-bold text-slate-800 truncate bg-white">{p.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-3">
          <a
            href={DEFAULT_DRIVE_FOLDER_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Mở Drive Chánh Hiệp</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Hủy
            </button>

            {activeTab === 'drive-link' && (
              <button
                type="button"
                onClick={() => handleInsert()}
                disabled={!url.trim()}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Chèn vào bài</span>
              </button>
            )}

            {activeTab === 'upload' && (
              <button
                type="button"
                onClick={handleUploadAndInsert}
                disabled={!selectedFile || isUploading}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang tải lên...</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Tải &amp; Chèn</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
