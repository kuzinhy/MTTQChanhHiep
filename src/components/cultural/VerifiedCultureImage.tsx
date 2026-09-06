import React, { useState, useEffect } from 'react';
import { Landmark, ImageOff, Maximize2, ShieldCheck } from 'lucide-react';

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
 * Strictly rejects Unsplash random stock photos, lorem picsum, placeholder URLs, and AI/mock image strings.
 */
export function isValidCultureImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false;
  
  // Reject stock/placeholder/mock domains & patterns
  const forbiddenPatterns = [
    'images.unsplash.com',
    'unsplash.com',
    'picsum.photos',
    'via.placeholder.com',
    'placeholder.com',
    'dummyimage.com',
    'loremflickr.com',
    'placekitten.com',
    'fakeimg.pl',
    'example.com',
    'ai-generated',
    'mock-image',
    'demo-image'
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

  const isValidUrl = isValidCultureImageUrl(src);

  useEffect(() => {
    if (!isValidUrl) {
      setLoadingStatus('error');
    } else {
      setLoadingStatus('loading');
    }
  }, [src, isValidUrl]);

  const handleImageLoad = () => {
    setLoadingStatus('loaded');
  };

  const handleImageError = () => {
    setLoadingStatus('error');
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (enableLightbox && onOpenLightbox && src && isValidUrl && loadingStatus === 'loaded') {
      e.stopPropagation();
      onOpenLightbox(src, alt);
    }
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${containerClassName}`}>
      {/* 1. Loading Skeleton / Shimmer */}
      {loadingStatus === 'loading' && (
        <div className="absolute inset-0 bg-slate-800/60 animate-pulse flex flex-col items-center justify-center p-4 text-slate-400 z-10">
          <Landmark className="w-8 h-8 text-amber-500/40 animate-bounce mb-2" />
          <span className="text-[11px] font-medium text-amber-200/70">Đang kiểm tra hình ảnh tư liệu...</span>
        </div>
      )}

      {/* 2. Error / Missing Image Neutral Frame */}
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
            Nguồn tin cậy (Nội dung văn bản đã xác thực)
          </span>
        </div>
      )}

      {/* 3. Real Valid Image */}
      {isValidUrl && loadingStatus !== 'error' && (
        <>
          <img
            src={src || undefined}
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
