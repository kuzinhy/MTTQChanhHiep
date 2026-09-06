import React, { useState, useEffect } from 'react';
import { Landmark, Maximize2, ShieldCheck, RefreshCw, ExternalLink } from 'lucide-react';
import { resolveMediaUrl, getProxiedMediaUrl, BACKEND_CLOUD_RUN_ORIGIN } from '../../lib/imageOptimization';

export interface VerifiedCultureImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  fallbackTitle?: string;
  className?: string;
  containerClassName?: string;
  enableLightbox?: boolean;
  onOpenLightbox?: (url: string, title?: string) => void;
  aspectRatio?: string; // e.g., 'aspect-video', 'aspect-4/3', 'aspect-square'
  showBadge?: boolean;
}

/**
 * Validates whether an image URL is a legitimate, non-mock, non-stock image.
 * Strictly rejects generic placeholder stock photos while preserving historical photos, government archives, and uploads.
 */
export function isValidCultureImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false;
  
  // Reject stock/placeholder/mock domains & patterns
  const forbiddenPatterns = [
    'images.unsplash.com',
    'picsum.photos',
    'via.placeholder.com',
    'placeholder.com',
    'dummyimage.com',
    'loremflickr.com',
    'placekitten.com',
    'fakeimg.pl'
  ];

  for (const pattern of forbiddenPatterns) {
    if (trimmed.toLowerCase().includes(pattern)) {
      return false;
    }
  }

  // Must be a valid HTTP/HTTPS URL or absolute data/blob/relative path
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:')
  );
}

export const VerifiedCultureImage: React.FC<VerifiedCultureImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  enableLightbox = false,
  onOpenLightbox,
  aspectRatio = '',
  showBadge = false,
  ...restProps
}) => {
  const [loadingStatus, setLoadingStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [triedProxy, setTriedProxy] = useState<boolean>(false);
  const [triedBackend, setTriedBackend] = useState<boolean>(false);

  // Initialize and resolve the URL
  useEffect(() => {
    if (!src || !isValidCultureImageUrl(src)) {
      setLoadingStatus('error');
      setCurrentSrc('');
      return;
    }

    const resolved = resolveMediaUrl(src);
    setCurrentSrc(resolved);
    setTriedProxy(false);
    setTriedBackend(false);
    setLoadingStatus('loading');
  }, [src]);

  const handleImageLoad = () => {
    setLoadingStatus('loaded');
  };

  const handleImageError = () => {
    // 1. Auto-healing attempt 1: If it's a local /uploads/ file and we haven't tried the Cloud Run backend directly
    if (currentSrc && currentSrc.startsWith('/uploads/') && !triedBackend) {
      setTriedBackend(true);
      setCurrentSrc(`${BACKEND_CLOUD_RUN_ORIGIN}${currentSrc}`);
      setLoadingStatus('loading');
      return;
    }

    // 2. Auto-healing attempt 2: If it's an external HTTP/HTTPS link and we haven't tried the proxy yet
    if (
      currentSrc &&
      (currentSrc.startsWith('http://') || currentSrc.startsWith('https://')) &&
      !currentSrc.includes('/api/media/proxy') &&
      !triedProxy
    ) {
      setTriedProxy(true);
      setCurrentSrc(getProxiedMediaUrl(currentSrc));
      setLoadingStatus('loading');
      return;
    }

    // If all auto-healing attempts failed
    setLoadingStatus('error');
  };

  const handleManualRetryProxy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!src) return;
    setLoadingStatus('loading');
    setCurrentSrc(getProxiedMediaUrl(src));
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (enableLightbox && onOpenLightbox && currentSrc && loadingStatus === 'loaded') {
      e.stopPropagation();
      onOpenLightbox(currentSrc, alt);
    }
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${containerClassName}`}>
      {/* 1. Loading Skeleton / Shimmer */}
      {loadingStatus === 'loading' && (
        <div className="absolute inset-0 bg-slate-800/60 animate-pulse flex flex-col items-center justify-center p-4 text-slate-400 z-10">
          <Landmark className="w-8 h-8 text-amber-500/40 animate-bounce mb-2" />
          <span className="text-[11px] font-medium text-amber-200/70">Đang kiểm tra & tối ưu hình ảnh tư liệu...</span>
        </div>
      )}

      {/* 2. Error / Missing Image Neutral Frame with Self-Healing Action */}
      {loadingStatus === 'error' && (
        <div className="w-full h-full min-h-[140px] bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 border border-slate-700/50 rounded-xl flex flex-col items-center justify-center p-4 text-center select-none">
          <div className="p-2.5 rounded-full bg-slate-800/80 border border-amber-500/20 mb-2">
            <Landmark className="w-6 h-6 text-amber-400/80" />
          </div>
          <p className="text-xs font-semibold text-amber-200/90 max-w-[220px] line-clamp-2">
            {fallbackTitle || alt || 'Tư liệu lịch sử'}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Nội dung tư liệu lịch sử xác thực
          </span>

          {src && (
            <div className="flex items-center gap-2 mt-3 z-10">
              <button
                type="button"
                onClick={handleManualRetryProxy}
                className="px-2.5 py-1 text-[10px] font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                title="Thử tải lại qua máy chủ Proxy"
              >
                <RefreshCw className="w-3 h-3" />
                Tải lại qua Proxy
              </button>
              {(src.startsWith('http://') || src.startsWith('https://')) && (
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-2 py-1 text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-md transition-colors flex items-center gap-1"
                  title="Mở liên kết ảnh gốc trong tab mới"
                >
                  <ExternalLink className="w-3 h-3" />
                  Link gốc
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. Real Valid Image */}
      {currentSrc && loadingStatus !== 'error' && (
        <>
          <img
            src={currentSrc}
            alt={alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onClick={handleImageClick}
            className={`${className} ${
              loadingStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300 ${enableLightbox ? 'cursor-zoom-in' : ''}`}
            {...restProps}
          />

          {/* Verified Badge */}
          {showBadge && loadingStatus === 'loaded' && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-medium text-emerald-300 flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Ảnh tư liệu xác thực</span>
            </div>
          )}

          {/* Lightbox Trigger Icon */}
          {enableLightbox && onOpenLightbox && loadingStatus === 'loaded' && (
            <button
              type="button"
              onClick={handleImageClick}
              title="Xem phóng to ảnh tư liệu gốc"
              aria-label="Phóng to ảnh tư liệu"
              className="absolute bottom-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-amber-300 rounded-lg border border-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-lg cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </>
      )}
    </div>
  );
};
