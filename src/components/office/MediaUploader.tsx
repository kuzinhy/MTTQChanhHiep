import React, { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, Trash2, Copy, RefreshCw, ExternalLink, Tag, FileText, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { CloudinaryImageMeta } from '../../types';
import { uploadMediaToCloudinary } from '../../lib/cloudinaryService';
import { inspectImageFile, ImageFileDiagnostics, formatBytes } from '../../lib/imageOptimization';

interface MediaUploaderProps {
  onImageUploaded: (image: CloudinaryImageMeta) => void;
  folder?: string;
  label?: string;
  currentImage?: CloudinaryImageMeta | string;
  onRemoveImage?: () => void;
  compact?: boolean;
  onAltChange?: (alt: string) => void;
  onCaptionChange?: (caption: string) => void;
  initialAlt?: string;
  initialCaption?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onImageUploaded,
  folder = 'articles',
  label = 'Ảnh đại diện bài viết',
  currentImage,
  onRemoveImage,
  compact = false,
  onAltChange,
  onCaptionChange,
  initialAlt = '',
  initialCaption = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [diagnostics, setDiagnostics] = useState<ImageFileDiagnostics | null>(null);
  const [activeNaturalSize, setActiveNaturalSize] = useState<{ width: number; height: number } | null>(null);

  // Metadata inputs
  const [altText, setAltText] = useState(initialAlt);
  const [captionText, setCaptionText] = useState(initialCaption);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive active image URL
  const activeImageUrl = typeof currentImage === 'string' 
    ? currentImage 
    : (currentImage?.secureUrl || currentImage?.url || '');

  const activePublicId = typeof currentImage === 'object' ? currentImage?.publicId : '';

  // Inspect existing image URL if present
  useEffect(() => {
    if (activeImageUrl && !activeImageUrl.startsWith('data:image/svg')) {
      const img = new Image();
      img.onload = () => {
        setActiveNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = activeImageUrl;
    } else {
      setActiveNaturalSize(null);
    }
  }, [activeImageUrl]);

  const handleFileSelect = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate MIME type
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(file.type)) {
      setErrorMessage('Định dạng tệp không hợp lệ! Chỉ chấp nhận ảnh định dạng JPG, PNG hoặc WEBP.');
      return;
    }

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh quá lớn! Dung lượng tối đa được phép tải lên là 10MB.');
      return;
    }

    // Inspect file quality without resizing or mutating
    const diag = await inspectImageFile(file);
    setDiagnostics(diag);

    setIsUploading(true);

    const result = await uploadMediaToCloudinary(file, folder);

    setIsUploading(false);

    if (result.success && result.image) {
      const meta: CloudinaryImageMeta = {
        ...result.image,
        alt: altText,
        caption: captionText
      };
      onImageUploaded(meta);
      if (result.isFallback) {
        setSuccessMessage(result.warning || 'Đã lưu ảnh nguyên bản dưới dạng Data URL dự phòng.');
      } else {
        setSuccessMessage('Đã tải ảnh gốc lên Cloudinary thành công với độ phân giải nguyên bản!');
      }
      setTimeout(() => setSuccessMessage(null), 6000);
    } else {
      setErrorMessage(result.error || 'Tải ảnh lên thất bại. Vui lòng thử lại.');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCopyLink = () => {
    if (!activeImageUrl) return;
    navigator.clipboard.writeText(activeImageUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleAltUpdate = (val: string) => {
    setAltText(val);
    if (onAltChange) onAltChange(val);
  };

  const handleCaptionUpdate = (val: string) => {
    setCaptionText(val);
    if (onCaptionChange) onCaptionChange(val);
  };

  return (
    <div className="w-full space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-slate-800">
            {label}
          </label>
          {activeImageUrl && (
            <span className={`text-xs px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
              activeImageUrl.startsWith('data:')
                ? 'text-amber-800 bg-amber-50 border-amber-300'
                : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              <CheckCircle className={`w-3.5 h-3.5 ${activeImageUrl.startsWith('data:') ? 'text-amber-600' : 'text-emerald-600'}`} />
              {activeImageUrl.startsWith('data:') ? 'Data URL Local Storage' : 'Cloudinary Secure Storage'}
            </span>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-800 text-xs sm:text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block text-red-900">Lỗi tải ảnh:</strong>
            <span>{errorMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-bold ml-1 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs sm:text-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="flex-1 font-medium">{successMessage}</span>
        </div>
      )}

      {/* Active Image Preview Box */}
      {activeImageUrl ? (
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
          <div className="relative group rounded-xl overflow-hidden bg-slate-200 border border-slate-300 max-h-64 flex items-center justify-center">
            <img
              src={activeImageUrl}
              alt={altText || 'Ảnh đại diện bài viết'}
              className="max-h-64 object-contain w-auto mx-auto rounded-lg"
            />
            
            {/* Quick Action Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Thay đổi ảnh
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 shadow-md"
              >
                <Copy className="w-3.5 h-3.5" /> {copiedUrl ? 'Đã chép!' : 'Copy Link'}
              </button>

              {onRemoveImage && (
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 flex items-center gap-1.5 shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Gỡ ảnh
                </button>
              )}
            </div>
          </div>

          {/* Details & Copy Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
            <div className="truncate max-w-full flex items-center gap-1.5 text-slate-700">
              <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-mono text-[11px] truncate">{activeImageUrl}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedUrl ? 'Đã sao chép URL' : 'Sao chép URL'}
              </button>

              <a
                href={activeImageUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg"
                title="Xem hình ảnh gốc"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Image Quality Inspector / Diagnostics Banner */}
          {(diagnostics || activeNaturalSize) && (
            <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
              (diagnostics?.qualityLevel === 'low' || (activeNaturalSize && activeNaturalSize.width < 1200))
                ? 'bg-amber-50/90 border-amber-200 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 font-bold">
                  {(diagnostics?.qualityLevel === 'low' || (activeNaturalSize && activeNaturalSize.width < 1200)) ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span>
                    Thông số ảnh: {diagnostics?.width || activeNaturalSize?.width || '?'} × {diagnostics?.height || activeNaturalSize?.height || '?'} px
                    {diagnostics?.format ? ` • ${diagnostics.format}` : ''}
                    {diagnostics?.sizeFormatted ? ` • ${diagnostics.sizeFormatted}` : ''}
                  </span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  (diagnostics?.width || activeNaturalSize?.width || 0) >= 2400
                    ? 'bg-purple-100 text-purple-800'
                    : (diagnostics?.width || activeNaturalSize?.width || 0) >= 1200
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {(diagnostics?.width || activeNaturalSize?.width || 0) >= 2400
                    ? 'Chuẩn Ultra 4K/Retina'
                    : (diagnostics?.width || activeNaturalSize?.width || 0) >= 1200
                    ? 'Chuẩn Full HD/Retina'
                    : 'Độ phân giải tiêu chuẩn (<1200px)'}
                </span>
              </div>

              {(diagnostics?.warning || (activeNaturalSize && activeNaturalSize.width < 1200)) && (
                <p className="text-[11px] text-amber-800 leading-normal">
                  {diagnostics?.warning || `Ảnh này có chiều rộng ${activeNaturalSize?.width}px (< 1200px). Khi hiển thị trên màn hình lớn hoặc màn hình Retina, ảnh có thể bị mờ. Khuyến nghị tải ảnh tối thiểu 1200px (hoặc 1920px đối với Banner).`}
                </p>
              )}
            </div>
          )}

          {/* ALT & Caption inputs if enabled */}
          {!compact && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-blue-600" /> Thẻ mô tả (ALT Text)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => handleAltUpdate(e.target.value)}
                  placeholder="Ví dụ: Lễ bàn giao nhà Đại đoàn kết khu phố 8..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-blue-600" /> Chú thích ảnh (Caption)
                </label>
                <input
                  type="text"
                  value={captionText}
                  onChange={(e) => handleCaptionUpdate(e.target.value)}
                  placeholder="Ví dụ: Đại biểu chụp ảnh lưu niệm cùng hộ gia đình..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            isDragging 
              ? 'border-blue-500 bg-blue-50/70 scale-[0.99]' 
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          {isUploading ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <div className="text-sm font-semibold text-slate-800">
                Đang tải ảnh lên Cloudinary server...
              </div>
              <p className="text-xs text-slate-500">
                Vui lòng đợi trong giây lát, hệ thống đang lưu và tạo secure URL.
              </p>
            </div>
          ) : (
            <div className="py-4 space-y-3">
              <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center shadow-sm">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  Kéo và thả tệp ảnh vào đây, hoặc{' '}
                  <span className="text-blue-600 hover:underline">bấm chọn tệp</span>
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Chấp nhận các tệp: <strong>JPG, PNG, WEBP</strong> (Dung lượng tối đa <strong>10MB</strong>)
                </p>
              </div>

              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                <Upload className="w-4 h-4" /> Tải ảnh lên
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
