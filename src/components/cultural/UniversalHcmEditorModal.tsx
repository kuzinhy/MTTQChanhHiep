import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Edit3, ShieldCheck, Sparkles, Image as ImageIcon, Upload, Trash2, Star, Volume2, Music, Play, AlertCircle, Video, Film, ExternalLink, Building, Check } from 'lucide-react';
import {
  HistoricalWork,
  VerifiedQuote,
  HistoricalAudio,
  HistoricalVideo,
  extractYouTubeId,
  FootstepLocation,
  ChanhHiepActionModel
} from '../../data/hcmVerifiedMuseumData';
import { BiographyChapter, EventCardSchema, CoverConfig } from '../../data/hcmGovernanceSchema';
import { OptimizedImage } from '../common/OptimizedImage';
import { uploadMediaToCloudinary } from '../../lib/cloudinaryService';

export type EditableHcmItemType =
  | 'work'
  | 'quote'
  | 'audio'
  | 'video'
  | 'footstep'
  | 'chanh_hiep_action'
  | 'front_initiative'
  | 'chapter'
  | 'event'
  | 'cover';

export interface UniversalHcmEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: EditableHcmItemType;
  itemData: any; // The initial item object
  onSave: (updatedItem: any) => void;
  onDelete?: (id: string) => void;
}

const ImageInputWithPreview: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder = 'Dán đường dẫn URL ảnh (https://...) hoặc bấm Tải ảnh từ máy' }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const result = await uploadMediaToCloudinary(file, 'cultural-images');
        if (result.success && result.image) {
          onChange(result.image.secureUrl || result.image.url);
        } else {
          alert(result.error || 'Có lỗi xảy ra khi tải ảnh lên.');
        }
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Tải ảnh thất bại. Vui lòng thử lại.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-1.5 p-3 rounded-2xl bg-rose-50/80 border border-rose-200/90 shadow-2xs">
      <label className="block text-xs font-bold text-rose-950 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-rose-700" />
          <span>{label}</span>
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xóa ảnh</span>
          </button>
        )}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-1.5 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white text-slate-800"
        />
        <label className={`px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-105 text-rose-950 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? 'Đang tải...' : 'Tải ảnh'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {value && (
        <div className="relative h-32 w-full mt-2 rounded-xl overflow-hidden border border-rose-300/80 bg-slate-900 flex items-center justify-center group">
          <OptimizedImage
            src={value}
            alt="Preview Avatar"
            variant="card"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
            Xem trước ảnh đại diện
          </div>
        </div>
      )}
    </div>
  );
};

const AudioInputWithPreview: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder = 'Dán đường dẫn URL âm thanh (https://...) hoặc bấm Tải tệp từ máy' }) => {
  const [uploading, setUploading] = useState(false);
  const [playError, setPlayError] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      setPlayError(false);
      try {
        const result = await uploadMediaToCloudinary(file, 'cultural-audio');
        if (result.success && result.image) {
          onChange(result.image.secureUrl || result.image.url);
        } else {
          alert(result.error || 'Có lỗi xảy ra khi tải âm thanh lên.');
        }
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Tải âm thanh thất bại. Vui lòng thử lại.');
      } finally {
        setUploading(false);
      }
    }
  };

  const resolvedAudioSrc = value && value.startsWith('http') && !value.includes(window.location.host) && (value.includes('hochiminh.vn') || value.includes('baochinhphu.vn'))
    ? `/api/media/proxy?url=${encodeURIComponent(value)}`
    : value;

  return (
    <div className="space-y-2 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-rose-50/70 border border-amber-200/90 shadow-2xs">
      <label className="block text-xs font-bold text-amber-950 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>{label}</span>
          <span className="text-[10px] text-amber-700/80 font-normal">(MP3, M4A, WAV, OGG)</span>
        </span>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setPlayError(false);
            }}
            className="text-[10px] text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xóa âm thanh</span>
          </button>
        )}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setPlayError(false);
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-amber-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 bg-white text-slate-800"
        />
        <label className={`px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-105 text-amber-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? 'Đang tải lên...' : 'Tải tệp âm thanh'}</span>
          <input
            type="file"
            accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {value && (
        <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-amber-900 font-bold">
            <span className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-amber-600" />
              <span>Nghe thử tệp âm thanh trước khi lưu:</span>
            </span>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-amber-700 hover:underline text-[10px] font-normal truncate max-w-[200px]"
            >
              Mở link gốc
            </a>
          </div>

          <audio
            key={value}
            controls
            src={resolvedAudioSrc}
            onError={() => setPlayError(true)}
            onPlay={() => setPlayError(false)}
            className="w-full h-8 outline-hidden accent-amber-600"
          />

          {playError && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-100/70 p-2 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                Lưu ý: Tệp nguồn có thể yêu cầu mở qua proxy hoặc phát trực tiếp từ trình duyệt. Tệp vẫn sẽ được lưu an toàn.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DualSourceVideoInputWithPreview: React.FC<{
  sourceType: 'YOUTUBE' | 'HOCHIMINH_VN' | 'DIRECT_STREAM';
  youtubeUrl: string;
  hoChiMinhVnUrl: string;
  videoStreamUrl: string;
  imageUrl: string;
  onSourceTypeChange: (type: 'YOUTUBE' | 'HOCHIMINH_VN' | 'DIRECT_STREAM') => void;
  onYouTubeChange: (url: string, videoId: string) => void;
  onHoChiMinhVnChange: (url: string) => void;
  onVideoStreamChange: (url: string) => void;
  onImageChange: (url: string) => void;
  onAutoFillMeta?: (meta: { title?: string; youtubeId?: string; videoStreamUrl?: string; imageUrl?: string }) => void;
}> = ({
  sourceType = 'YOUTUBE',
  youtubeUrl,
  hoChiMinhVnUrl,
  videoStreamUrl,
  imageUrl,
  onSourceTypeChange,
  onYouTubeChange,
  onHoChiMinhVnChange,
  onVideoStreamChange,
  onImageChange,
  onAutoFillMeta
}) => {
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [extractingMeta, setExtractingMeta] = useState(false);
  const [autoThumbSuccess, setAutoThumbSuccess] = useState<string | null>(null);
  const [ytQuality, setYtQuality] = useState<'hqdefault' | 'maxresdefault' | 'mqdefault'>('hqdefault');
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const videoId = extractYouTubeId(youtubeUrl || '');

  // Auto-generate YouTube thumbnail whenever YouTube URL changes
  const handleYouTubeInputChange = (val: string) => {
    const extracted = extractYouTubeId(val);
    onYouTubeChange(val, extracted);
    if (extracted) {
      const generatedThumb = `https://img.youtube.com/vi/${extracted}/${ytQuality}.jpg`;
      onImageChange(generatedThumb);
      setAutoThumbSuccess(`Đã tự động tạo ảnh đại diện từ YouTube (${extracted})`);
    } else {
      setAutoThumbSuccess(null);
    }
  };

  // Switch YouTube thumbnail quality
  const handleSwitchYtQuality = (quality: 'hqdefault' | 'maxresdefault' | 'mqdefault') => {
    setYtQuality(quality);
    if (videoId) {
      const newThumb = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
      onImageChange(newThumb);
      setAutoThumbSuccess(`Đã đổi chất lượng ảnh đại diện: ${quality}`);
    }
  };

  // Auto-extract metadata & thumbnail from hochiminh.vn or web URL
  const handleHoChiMinhVnInputChange = async (val: string) => {
    onHoChiMinhVnChange(val);
    setAutoThumbSuccess(null);

    // If it's a YouTube link pasted inside the hochiminh.vn field
    const ytId = extractYouTubeId(val);
    if (ytId) {
      onYouTubeChange(val, ytId);
      const generatedThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      onImageChange(generatedThumb);
      setAutoThumbSuccess('Đã tự động nhận diện Video YouTube và tạo ảnh đại diện tương ứng');
      return;
    }

    if (val && val.startsWith('http')) {
      setExtractingMeta(true);
      try {
        const res = await fetch(`/api/media/extract-metadata?url=${encodeURIComponent(val)}`);
        const data = await res.json();
        if (data.success) {
          if (data.imageUrl) {
            onImageChange(data.imageUrl);
            setAutoThumbSuccess('Đã tự động tạo ảnh đại diện tương ứng từ Cổng hochiminh.vn');
          }
          if (onAutoFillMeta) {
            onAutoFillMeta({
              title: data.title,
              youtubeId: data.youtubeId,
              videoStreamUrl: data.videoStreamUrl,
              imageUrl: data.imageUrl
            });
          }
        }
      } catch (err) {
        console.warn('Auto metadata extraction error:', err);
      } finally {
        setExtractingMeta(false);
      }
    }
  };

  // Video file upload
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingVideo(true);
      try {
        const result = await uploadMediaToCloudinary(file, 'cultural-videos');
        if (result.success && result.image) {
          const videoUrl = result.image.secureUrl || result.image.url;
          onVideoStreamChange(videoUrl);
          onSourceTypeChange('DIRECT_STREAM');
          // If cloudinary generated a thumbnail
          if (result.image.url && result.image.url.endsWith('.mp4')) {
            const thumb = result.image.url.replace(/\.mp4$/, '.jpg');
            onImageChange(thumb);
            setAutoThumbSuccess('Đã tự động tạo ảnh đại diện từ video tải lên');
          }
        } else {
          alert(result.error || 'Có lỗi khi tải tệp video lên.');
        }
      } catch (err) {
        console.error('Video upload failed:', err);
        alert('Tải video thất bại. Vui lòng thử lại hoặc sử dụng đường dẫn URL.');
      } finally {
        setUploadingVideo(false);
      }
    }
  };

  // Capture video frame from HTML5 video element to canvas
  const handleCaptureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const vid = videoRef.current;
      const cvs = canvasRef.current;
      cvs.width = vid.videoWidth || 640;
      cvs.height = vid.videoHeight || 360;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
        try {
          const dataUrl = cvs.toDataURL('image/jpeg', 0.85);
          onImageChange(dataUrl);
          setAutoThumbSuccess('Đã chụp khung hình video thành công làm ảnh đại diện');
        } catch (e) {
          console.warn('Canvas capture CORS notice:', e);
        }
      }
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-red-50/90 via-rose-50/70 to-amber-50/60 border border-red-200/90 shadow-2xs">
      <div className="flex items-center justify-between border-b border-red-200/70 pb-2.5">
        <span className="text-xs font-bold text-red-950 flex items-center gap-1.5">
          <Film className="w-4 h-4 text-red-700" />
          <span>Lựa chọn Nguồn Tư Liệu Video</span>
        </span>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Tự động tạo ảnh đại diện</span>
        </span>
      </div>

      {/* Tabs chuyển đổi nguồn tư liệu */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onSourceTypeChange('YOUTUBE')}
          className={`px-2.5 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
            sourceType === 'YOUTUBE'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400'
              : 'bg-white text-red-900 border border-red-200 hover:bg-red-50'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="text-[11px] leading-tight text-center">Nguồn YouTube</span>
        </button>

        <button
          type="button"
          onClick={() => onSourceTypeChange('HOCHIMINH_VN')}
          className={`px-2.5 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
            sourceType === 'HOCHIMINH_VN'
              ? 'bg-gradient-to-r from-amber-600 to-rose-700 text-white shadow-md ring-2 ring-amber-400'
              : 'bg-white text-rose-950 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-[11px] leading-tight text-center">hochiminh.vn</span>
        </button>

        <button
          type="button"
          onClick={() => onSourceTypeChange('DIRECT_STREAM')}
          className={`px-2.5 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
            sourceType === 'DIRECT_STREAM'
              ? 'bg-rose-900 text-white shadow-md ring-2 ring-rose-400'
              : 'bg-white text-rose-950 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="text-[11px] leading-tight text-center">Tải Video lên</span>
        </button>
      </div>

      {/* 1. NGUỒN YOUTUBE */}
      {sourceType === 'YOUTUBE' && (
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-bold text-red-950 flex items-center justify-between">
            <span>Đường dẫn Video YouTube chính thức:</span>
            {youtubeUrl && (
              <button
                type="button"
                onClick={() => {
                  onYouTubeChange('', '');
                  setAutoThumbSuccess(null);
                }}
                className="text-[10px] text-red-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa link</span>
              </button>
            )}
          </label>
          <input
            type="text"
            value={youtubeUrl || ''}
            onChange={(e) => handleYouTubeInputChange(e.target.value)}
            placeholder="Dán link YouTube (ví dụ: https://www.youtube.com/watch?v=... hoặc https://youtu.be/...)"
            className="w-full px-3 py-2 border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 bg-white text-slate-800 font-mono"
          />

          {videoId ? (
            <div className="p-3 bg-white rounded-xl border border-red-200/80 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-red-950 font-bold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Video ID: <strong className="font-mono bg-red-100 text-red-900 px-1.5 py-0.5 rounded">{videoId}</strong></span>
                </span>
                
                {/* Chọn chất lượng ảnh đại diện */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-600 font-normal">Độ nét:</span>
                  <button
                    type="button"
                    onClick={() => handleSwitchYtQuality('hqdefault')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                      ytQuality === 'hqdefault' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    HD
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchYtQuality('maxresdefault')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                      ytQuality === 'maxresdefault' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    1080p
                  </button>
                </div>
              </div>

              {/* Thông báo tự tạo ảnh đại diện */}
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-emerald-900 text-xs">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Hệ thống đã tự động tạo ảnh đại diện tương ứng từ YouTube</span>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline text-[10px] font-semibold flex items-center gap-1 shrink-0"
                >
                  <span>Mở xem</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-xs border border-red-200">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/${ytQuality}.jpg`}
                  alt="YouTube Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          ) : youtubeUrl ? (
            <div className="p-2 rounded-lg bg-amber-100 text-amber-900 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Chưa nhận diện được Video ID hợp lệ từ đường dẫn YouTube trên.</span>
            </div>
          ) : null}
        </div>
      )}

      {/* 2. NGUỒN CỔNG TTĐT HỒ CHÍ MINH (hochiminh.vn/tu-lieu-video) */}
      {sourceType === 'HOCHIMINH_VN' && (
        <div className="space-y-3 pt-1">
          <div className="p-3 rounded-xl bg-gradient-to-r from-rose-900 to-amber-950 text-white text-xs space-y-1 shadow-xs border border-amber-400/40">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Nguồn chính thống: Cổng Thông tin điện tử Hồ Chí Minh (hochiminh.vn)</span>
            </div>
            <p className="text-[11px] text-rose-100/90 leading-relaxed">
              Dán link bài viết tư liệu từ <strong>hochiminh.vn/tu-lieu-video</strong> - Hệ thống sẽ tự động quét và trích xuất ảnh bìa tư liệu đại diện.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-950 mb-1 flex items-center justify-between">
              <span>Đường dẫn chuyên mục tư liệu tại hochiminh.vn:</span>
              <a
                href="https://hochiminh.vn/tu-lieu-video"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-rose-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Mở hochiminh.vn/tu-lieu-video</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="text"
              value={hoChiMinhVnUrl || ''}
              onChange={(e) => handleHoChiMinhVnInputChange(e.target.value)}
              placeholder="https://hochiminh.vn/tu-lieu-video/ten-phim-tai-lieu..."
              className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white text-slate-800"
            />
          </div>

          {extractingMeta && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-900 font-medium animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Đang kết nối hochiminh.vn và tự động tạo ảnh đại diện tương ứng...</span>
            </div>
          )}

          {autoThumbSuccess && !extractingMeta && (
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-1.5 text-emerald-900 text-xs font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{autoThumbSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-rose-950 mb-1">
              Đường dẫn phát Video (Link tệp MP4 hoặc link nhúng YouTube kèm theo bài viết trên cổng):
            </label>
            <input
              type="text"
              value={videoStreamUrl || youtubeUrl || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val.includes('youtube.com') || val.includes('youtu.be')) {
                  const id = extractYouTubeId(val);
                  onYouTubeChange(val, id);
                  if (id) {
                    onImageChange(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
                    setAutoThumbSuccess('Đã tự động cập nhật ảnh đại diện từ YouTube nhúng');
                  }
                } else {
                  onVideoStreamChange(val);
                }
              }}
              placeholder="Dán link phát video MP4 trực tiếp hoặc link YouTube phụ trợ..."
              className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white text-slate-800"
            />
          </div>
        </div>
      )}

      {/* 3. NGUỒN TẢI VIDEO TRỰC TIẾP LÊN */}
      {sourceType === 'DIRECT_STREAM' && (
        <div className="space-y-3 pt-1">
          <label className="block text-xs font-bold text-rose-950 flex items-center justify-between">
            <span>Tải lên tệp Video số hóa (MP4, WebM, MOV):</span>
            {videoStreamUrl && (
              <button
                type="button"
                onClick={() => {
                  onVideoStreamChange('');
                  setAutoThumbSuccess(null);
                }}
                className="text-[10px] text-rose-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa video</span>
              </button>
            )}
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={videoStreamUrl || ''}
              onChange={(e) => onVideoStreamChange(e.target.value)}
              placeholder="Dán link tệp video MP4 trực tiếp hoặc bấm Tải tệp từ máy"
              className="flex-1 px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white text-slate-800"
            />
            <label className={`px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs transition ${uploadingVideo ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingVideo ? 'Đang tải lên...' : 'Tải tệp video'}</span>
              <input
                type="file"
                accept="video/*,.mp4,.webm,.m4v,.mov"
                onChange={handleVideoFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {videoStreamUrl && (
            <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-950">Phát thử nghiệm video:</span>
                <button
                  type="button"
                  onClick={handleCaptureFrame}
                  className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <Sparkles className="w-3 h-3 text-rose-700" />
                  <span>Chụp khung hình làm ảnh đại diện</span>
                </button>
              </div>

              <video
                ref={videoRef}
                controls
                crossOrigin="anonymous"
                src={videoStreamUrl}
                className="w-full aspect-video rounded-xl bg-black border border-rose-300"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const UniversalHcmEditorModal: React.FC<UniversalHcmEditorModalProps> = ({
  isOpen,
  onClose,
  itemType,
  itemData,
  onSave,
  onDelete
}) => {
  const [formState, setFormState] = useState<any>({});

  useEffect(() => {
    if (itemData) {
      setFormState({ ...itemData });
    }
  }, [itemData, itemType]);

  if (!isOpen || !itemData) return null;

  const handleChange = (field: string, value: any) => {
    setFormState((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    onClose();
  };

  const handleDeleteItem = () => {
    if (!itemData?.id || !onDelete) return;
    const title = formState.title || formState.name || formState.quote || 'mục này';
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${title}" khỏi hệ thống?`)) {
      onDelete(itemData.id);
      onClose();
    }
  };

  const renderFormFields = () => {
    switch (itemType) {
      case 'chanh_hiep_action':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên mô hình / Hoạt động Chánh Hiệp</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>

            <ImageInputWithPreview
              label="Ảnh đại diện / Link ảnh minh họa mô hình"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Đối tượng / Lực lượng</label>
                <input
                  type="text"
                  value={formState.targetGroup || ''}
                  onChange={(e) => handleChange('targetGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Địa bàn / Khu phố</label>
                <input
                  type="text"
                  value={formState.neighborhood || ''}
                  onChange={(e) => handleChange('neighborhood', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Lời Bác dạy / Kim chỉ nam truyền cảm hứng</label>
              <textarea
                rows={2}
                value={formState.inspirationalQuote || ''}
                onChange={(e) => handleChange('inspirationalQuote', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white italic font-serif"
                placeholder="VD: Dân vận khéo thì việc gì cũng thành công..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Mô tả cách làm &amp; nội dung thực hiện</label>
              <textarea
                rows={3}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Kết quả thực tiễn đạt được</label>
              <textarea
                rows={2}
                value={formState.practicalResult || ''}
                onChange={(e) => handleChange('practicalResult', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'front_initiative':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên Sáng kiến / Bài viết Mô hình Mặt Trận</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white font-bold text-slate-900"
                placeholder="VD: Mô hình 'Tổ Đoàn Kết Số 4.0' tại 21 Khu phố..."
                required
              />
            </div>

            <ImageInputWithPreview
              label="Ảnh đại diện mô hình / Hình ảnh đại diện chính thức (Link hoặc Tải ảnh)"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Đơn vị chủ trì / Thực hiện</label>
                <input
                  type="text"
                  value={formState.unit || ''}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                  placeholder="VD: Ban CTMTKP 5"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Tác giả / Người soạn thảo</label>
                <input
                  type="text"
                  value={formState.author || ''}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                  placeholder="VD: Ban Biên tập Mặt Trận Phường"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Ngày / Thời điểm ban hành</label>
                <input
                  type="text"
                  value={formState.date || ''}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Trạng thái xuất bản</label>
                <select
                  value={formState.status || 'PUBLISHED'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white font-bold"
                >
                  <option value="PUBLISHED">🟢 Đã xuất bản (Công khai)</option>
                  <option value="DRAFT">🔴 Bản nháp (Nội bộ)</option>
                  <option value="ARCHIVED">📦 Lưu trữ</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <input
                type="checkbox"
                id="isFeaturedInit"
                checked={!!formState.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="isFeaturedInit" className="text-xs font-bold text-amber-950 cursor-pointer select-none">
                Ghim làm Sáng kiến Nổi bật (Hiển thị ưu tiên hàng đầu)
              </label>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50/60 to-rose-50 border-2 border-rose-300/80 shadow-2xs">
              <input
                type="checkbox"
                id="postToHcmSpace"
                checked={formState.postToHcmSpace ?? true}
                onChange={(e) => handleChange('postToHcmSpace', e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer accent-rose-600 shrink-0"
              />
              <label htmlFor="postToHcmSpace" className="text-xs font-black text-rose-950 cursor-pointer select-none leading-tight flex items-center gap-1.5 flex-wrap">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline shrink-0" />
                <span>Đăng vào Không gian Văn hóa Hồ Chí Minh</span>
                <span className="text-[10px] font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                  Phòng: Chánh Hiệp Học Tập Và Làm Theo Bác
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Chuyên đề Học Bác liên thông (Tên chủ đề)</label>
              <input
                type="text"
                value={formState.linkedHcmTopicTitle || ''}
                onChange={(e) => handleChange('linkedHcmTopicTitle', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="VD: Dân vận khéo – Gần dân, sát việc, lo cho dân"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Mô tả tóm tắt giải pháp &amp; cách làm</label>
              <textarea
                rows={2}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="Mô tả tóm tắt nội dung giải pháp tác nghiệp và cách làm hay..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Nội dung chi tiết bài viết &amp; Quy trình triển khai</label>
              <textarea
                rows={5}
                value={formState.fullContent || ''}
                onChange={(e) => handleChange('fullContent', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="Nhập toàn bộ nội dung chi tiết bài viết, các bước thực hiện, phân công trách nhiệm..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Kết quả &amp; Tác động nổi bật</label>
              <textarea
                rows={2}
                value={formState.impact || ''}
                onChange={(e) => handleChange('impact', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="Hiệu quả thiết thực mang lại cho nhân dân địa phương..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Thẻ phân loại (Cách nhau bởi dấu phẩy)</label>
              <input
                type="text"
                value={Array.isArray(formState.tags) ? formState.tags.join(', ') : (formState.tags || '')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                  handleChange('tags', arr);
                }}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="Chuyển đổi số, Dân nguyện, Khu phố số, Làm theo Bác"
              />
            </div>
          </>
        );

      case 'work':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên tác phẩm</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>

            <ImageInputWithPreview
              label="Ảnh bìa tác phẩm / Tư liệu"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Năm ra đời / Thời gian</label>
                <input
                  type="text"
                  value={formState.year || ''}
                  onChange={(e) => handleChange('year', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Tập (Hồ Chí Minh Toàn tập)</label>
                <input
                  type="number"
                  value={formState.volume || 1}
                  onChange={(e) => handleChange('volume', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tóm tắt tác phẩm</label>
              <textarea
                rows={3}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Hoàn cảnh ra đời</label>
              <textarea
                rows={2}
                value={formState.historicalContext || ''}
                onChange={(e) => handleChange('historicalContext', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tư liệu chuyên nghiệp (Link/Mô tả)</label>
              <textarea
                rows={2}
                value={formState.professionalNote || ''}
                onChange={(e) => handleChange('professionalNote', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                placeholder="Nhập thông tin tư liệu chuyên nghiệp (link, tài liệu tham khảo...)"
              />
            </div>
          </>
        );

      case 'chapter':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên chương tiểu sử</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>

            <ImageInputWithPreview
              label="Ảnh tư liệu / Chân dung Bác giai đoạn này"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Giai đoạn thời gian</label>
              <input
                type="text"
                value={formState.timeRange || ''}
                onChange={(e) => handleChange('timeRange', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tóm tắt chương</label>
              <textarea
                rows={3}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Nội dung chi tiết chương</label>
              <textarea
                rows={5}
                value={formState.full_text || ''}
                onChange={(e) => handleChange('full_text', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'event':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên sự kiện lịch sử</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>

            <ImageInputWithPreview
              label="Ảnh minh họa / Tư liệu sự kiện"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Thời gian hiển thị</label>
                <input
                  type="text"
                  value={formState.date_display || ''}
                  onChange={(e) => handleChange('date_display', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Địa điểm</label>
                <input
                  type="text"
                  value={formState.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tóm tắt sự kiện</label>
              <textarea
                rows={3}
                value={formState.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Nội dung đầy đủ</label>
              <textarea
                rows={4}
                value={formState.full_content || ''}
                onChange={(e) => handleChange('full_content', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'footstep':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tên địa danh / Điểm dừng chân</label>
              <input
                type="text"
                value={formState.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>

            <ImageInputWithPreview
              label="Ảnh tư liệu địa danh / Bác Hồ dừng chân"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Quốc gia / Lãnh thổ</label>
                <input
                  type="text"
                  value={formState.country || ''}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Thời gian (Năm)</label>
                <input
                  type="text"
                  value={formState.periodYears || ''}
                  onChange={(e) => handleChange('periodYears', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Bút danh / Tên gọi sử dụng</label>
              <input
                type="text"
                value={formState.aliasUsed || ''}
                onChange={(e) => handleChange('aliasUsed', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Hoạt động lịch sử chính</label>
              <textarea
                rows={3}
                value={formState.historicalAction || ''}
                onChange={(e) => handleChange('historicalAction', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'cover':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tiêu đề chính không gian</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>

            <ImageInputWithPreview
              label="Ảnh chân dung Bác Hồ / Ảnh bìa không gian văn hóa"
              value={formState.portrait_url || formState.imageUrl || ''}
              onChange={(val) => {
                handleChange('portrait_url', val);
                handleChange('imageUrl', val);
              }}
            />

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tiêu đề phụ</label>
              <input
                type="text"
                value={formState.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Mô tả tổng quan</label>
              <textarea
                rows={3}
                value={formState.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'quote':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Nội dung trích dẫn / Lời dạy của Bác</label>
              <textarea
                rows={4}
                value={formState.quoteText || ''}
                onChange={(e) => handleChange('quoteText', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white font-serif italic text-rose-950"
                required
              />
            </div>

            <ImageInputWithPreview
              label="Ảnh minh họa / Tư liệu trích dẫn"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Bối cảnh / Sự kiện</label>
                <input
                  type="text"
                  value={formState.context || ''}
                  onChange={(e) => handleChange('context', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Năm</label>
                <input
                  type="text"
                  value={formState.year || ''}
                  onChange={(e) => handleChange('year', e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Ý nghĩa lý luận &amp; thực tiễn</label>
              <textarea
                rows={2}
                value={formState.significance || ''}
                onChange={(e) => handleChange('significance', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );
      case 'audio':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Tiêu đề bản ghi âm lịch sử</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                required
              />
            </div>

            <ImageInputWithPreview
              label="Ảnh đại diện / Tư liệu bản ghi âm"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

            <AudioInputWithPreview
              label="Tải lên tệp âm thanh hoặc dán link URL"
              value={formState.audioUrl || ''}
              onChange={(val) => handleChange('audioUrl', val)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Thời điểm / Ngày đọc</label>
                <input
                  type="text"
                  value={formState.dateStr || ''}
                  onChange={(e) => handleChange('dateStr', e.target.value)}
                  placeholder="Ví dụ: 02/09/1945 hoặc Đêm 19/12/1946"
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Thời lượng bản thu</label>
                <input
                  type="text"
                  value={formState.duration || ''}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="Ví dụ: 04 phút 35 giây"
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Hoàn cảnh lịch sử / Dịp phát thanh</label>
                <input
                  type="text"
                  value={formState.occasion || ''}
                  onChange={(e) => handleChange('occasion', e.target.value)}
                  placeholder="Ví dụ: Lễ Độc lập, Quảng trường Ba Đình"
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">Cơ quan lưu trữ nguồn gốc</label>
                <input
                  type="text"
                  value={formState.sourceAgency || ''}
                  onChange={(e) => handleChange('sourceAgency', e.target.value)}
                  placeholder="Ví dụ: Đài Tiếng nói Việt Nam (VOV)"
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Bản ghi transcript chữ viết toàn văn</label>
              <textarea
                rows={4}
                value={formState.transcript || ''}
                onChange={(e) => handleChange('transcript', e.target.value)}
                placeholder="Toàn văn lời nói của Bác Hồ trong bản ghi âm..."
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">Ghi chú &amp; Ý nghĩa lịch sử</label>
              <textarea
                rows={2}
                value={formState.historicalNote || ''}
                onChange={(e) => handleChange('historicalNote', e.target.value)}
                placeholder="Ý nghĩa lịch sử, âm vang thời đại của bản ghi âm..."
                className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </>
        );

      case 'video':
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-red-950 mb-1">Tiêu đề thước phim / Video tư liệu</label>
              <input
                type="text"
                value={formState.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ví dụ: Lễ Độc lập 02/09/1945 - Bác Hồ đọc Tuyên ngôn Độc lập"
                className="w-full px-3 py-2 border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 bg-white"
                required
              />
            </div>

            <DualSourceVideoInputWithPreview
              sourceType={formState.sourceType || (formState.hoChiMinhVnUrl ? 'HOCHIMINH_VN' : 'YOUTUBE')}
              youtubeUrl={formState.youtubeUrl || ''}
              hoChiMinhVnUrl={formState.hoChiMinhVnUrl || ''}
              videoStreamUrl={formState.videoStreamUrl || ''}
              imageUrl={formState.imageUrl || ''}
              onSourceTypeChange={(type) => handleChange('sourceType', type)}
              onYouTubeChange={(url, videoId) => {
                handleChange('youtubeUrl', url);
                handleChange('youtubeVideoId', videoId);
                if (videoId) {
                  handleChange('imageUrl', `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
                }
              }}
              onHoChiMinhVnChange={(url) => {
                handleChange('hoChiMinhVnUrl', url);
                handleChange('sourceType', 'HOCHIMINH_VN');
                if (!formState.sourceAgency) {
                  handleChange('sourceAgency', 'Cổng thông tin điện tử Hồ Chí Minh (hochiminh.vn)');
                }
              }}
              onVideoStreamChange={(url) => {
                handleChange('videoStreamUrl', url);
              }}
              onImageChange={(val) => handleChange('imageUrl', val)}
              onAutoFillMeta={(meta) => {
                if (meta.imageUrl) {
                  handleChange('imageUrl', meta.imageUrl);
                }
                if (meta.title && (!formState.title || formState.title.includes('Tư liệu video mới') || formState.title.includes('hochiminh.vn'))) {
                  handleChange('title', meta.title);
                }
                if (meta.youtubeId) {
                  handleChange('youtubeVideoId', meta.youtubeId);
                  handleChange('youtubeUrl', `https://www.youtube.com/watch?v=${meta.youtubeId}`);
                }
                if (meta.videoStreamUrl) {
                  handleChange('videoStreamUrl', meta.videoStreamUrl);
                }
              }}
            />

            <ImageInputWithPreview
              label="Ảnh đại diện / Thumbnail tùy chỉnh (tùy chọn, để trống sẽ tự lấy từ nguồn video)"
              value={formState.imageUrl || ''}
              onChange={(val) => handleChange('imageUrl', val)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-red-950 mb-1">Thời điểm / Năm lịch sử</label>
                <input
                  type="text"
                  value={formState.dateStr || ''}
                  onChange={(e) => handleChange('dateStr', e.target.value)}
                  placeholder="Ví dụ: 02/09/1945 hoặc Năm 1946"
                  className="w-full px-3 py-2 border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-red-950 mb-1">Thời lượng video</label>
                <input
                  type="text"
                  value={formState.duration || ''}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="Ví dụ: 05 phút 18 giây"
                  className="w-full px-3 py-2 border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-red-950 mb-1">Thể loại tư liệu</label>
                <select
                  value={formState.category || 'Phim tài liệu lịch sử'}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="Tuyên ngôn & Độc lập">Tuyên ngôn & Độc lập</option>
                  <option value="Hành trình cứu nước">Hành trình cứu nước</option>
                  <option value="Ngoại giao & Quốc tế">Ngoại giao & Quốc tế</option>
                  <option value="Bác Hồ với Nhân dân">Bác Hồ với Nhân dân</option>
                  <option value="Kháng chiến & Chiến dịch">Kháng chiến & Chiến dịch</option>
                  <option value="Phim tài liệu lịch sử">Phim tài liệu lịch sử</option>
                  <option value="Di sản tư tưởng">Di sản tư tưởng</option>
                  <option value="Quốc tang & Di chúc">Quốc tang & Di chúc</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-red-950 mb-1">Cơ quan lưu trữ / Xuất bản</label>
                <input
                  type="text"
                  value={formState.sourceAgency || ''}
                  onChange={(e) => handleChange('sourceAgency', e.target.value)}
                  placeholder="Ví dụ: hochiminh.vn, VTV, Hãng phim TL&KH TW..."
                  className="w-full px-3 py-2 border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-red-950 mb-1">Bối cảnh lịch sử / Sự kiện</label>
              <input
                type="text"
                value={formState.occasion || ''}
                onChange={(e) => handleChange('occasion', e.target.value)}
                placeholder="Ví dụ: Quảng trường Ba Đình, Lễ Tuyên ngôn Độc lập..."
                className="w-full px-3 py-2 border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-red-950 mb-1">Tóm tắt nội dung thước phim</label>
              <textarea
                rows={3}
                value={formState.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Mô tả tóm tắt những hình ảnh, diễn biến trong thước phim tư liệu..."
                className="w-full px-3 py-2 border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 bg-white leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-red-950 mb-1">Ý nghĩa lịch sử &amp; Giá trị giáo dục</label>
              <textarea
                rows={2}
                value={formState.historicalNote || ''}
                onChange={(e) => handleChange('historicalNote', e.target.value)}
                placeholder="Ghi chú ý nghĩa lịch sử, giáo dục truyền thống..."
                className="w-full px-3 py-2 border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 bg-white"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-rose-950/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-white via-rose-50/50 to-amber-50/30 rounded-3xl border-2 border-rose-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                Chỉnh Sửa Trực Tiếp Dữ Liệu &amp; Ảnh Đại Diện
              </h3>
              <p className="text-[10px] text-amber-200">
                Quyền Admin - Cập nhật thông tin &amp; Ảnh đại diện vào Không gian Văn hóa HCM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {renderFormFields()}

          {/* Buttons */}
          <div className="pt-4 border-t border-rose-200 flex items-center justify-between gap-3">
            <div>
              {onDelete && itemData?.id && (
                <button
                  type="button"
                  onClick={handleDeleteItem}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Xóa tư liệu</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-700 via-pink-600 to-rose-800 hover:brightness-110 shadow-md flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Thông Tin</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
