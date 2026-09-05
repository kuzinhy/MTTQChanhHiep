import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Maximize2, ExternalLink } from 'lucide-react';
import { getOptimalImageUrl } from '../../lib/imageOptimization';

interface ImageLightboxModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  imageUrl,
  title,
  onClose,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setDimensions(null);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === '+' || e.key === '=') setScale(s => Math.min(s + 0.25, 4));
        if (e.key === '-') setScale(s => Math.max(s - 0.25, 0.5));
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  // Ensure we load the raw unscaled master source in lightbox
  const highResSource = getOptimalImageUrl(imageUrl, 'original');

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = highResSource;
    a.target = '_blank';
    a.download = (title || 'hinh-anh-mttq-chanh-hiep').replace(/[\s\W-]+/g, '-').toLowerCase() + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none animate-fade-in">
      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3 text-white max-w-xl truncate">
          <Maximize2 className="w-5 h-5 text-blue-400 shrink-0" />
          <div className="truncate">
            <h3 className="text-sm font-bold truncate">{title || 'Xem hình ảnh chất lượng cao (Bản gốc)'}</h3>
            {dimensions && (
              <p className="text-[11px] text-slate-400">
                Độ phân giải gốc: {dimensions.width} × {dimensions.height} px
              </p>
            )}
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale(s => Math.max(s - 0.25, 0.5))}
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            title="Thu nhỏ (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-300 px-2">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={() => setScale(s => Math.min(s + 0.25, 4))}
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            title="Phóng to (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setScale(1)}
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            title="Kích thước chuẩn (100%)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="p-2 text-blue-300 hover:text-white bg-blue-600/30 hover:bg-blue-600/60 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold"
            title="Tải ảnh gốc về máy"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Tải ảnh gốc</span>
          </button>

          <a
            href={highResSource}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            title="Mở tab mới"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/10 hover:bg-red-600/60 rounded-xl transition-all ml-2"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewing Area */}
      <div 
        className="w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <img
          src={highResSource}
          alt={title || 'Hình ảnh chất lượng cao'}
          referrerPolicy="no-referrer"
          onLoad={(e) => {
            const target = e.currentTarget;
            setDimensions({
              width: target.naturalWidth,
              height: target.naturalHeight
            });
          }}
          style={{
            transform: `scale(${scale})`,
            transition: 'transform 0.15s ease-out',
            maxHeight: scale === 1 ? '85vh' : 'none',
            maxWidth: scale === 1 ? '90vw' : 'none',
            imageRendering: 'auto'
          }}
          className="object-contain shadow-2xl rounded-lg select-none"
        />
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none text-slate-400 text-xs">
        Bản gốc độ phân giải đầy đủ • Nhấp ra ngoài hoặc bấm Esc để đóng
      </div>
    </div>
  );
};
