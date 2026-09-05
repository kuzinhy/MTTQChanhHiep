import React, { useState, useEffect, useRef } from 'react';
import { CloudinaryImageMeta } from '../../types';
import { 
  ImageVariant, 
  getResponsiveImageSources, 
  handleOptimizedImageError 
} from '../../lib/imageOptimization';
import { ARTICLE_BANNERS, getBannerForCategory } from '../../utils/officialImages';
import { Maximize2 } from 'lucide-react';

export interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | CloudinaryImageMeta | undefined | null;
  alt: string;
  variant?: ImageVariant;
  fallbackCategory?: string;
  fallbackSrc?: string;
  priority?: boolean;
  enableLightbox?: boolean;
  onOpenLightbox?: (originalUrl: string, title?: string) => void;
  className?: string;
  containerClassName?: string;
  customSizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  variant = 'article',
  fallbackCategory,
  fallbackSrc,
  priority = false,
  enableLightbox = false,
  onOpenLightbox,
  className = '',
  containerClassName = '',
  customSizes,
  ...restProps
}) => {
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const fallback = fallbackSrc || (fallbackCategory ? getBannerForCategory(fallbackCategory) : ARTICLE_BANNERS.default);
  const responsive = getResponsiveImageSources(src || fallback, variant, customSizes);

  // Dev quality diagnostic check
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && imgRef.current) {
      const img = imgRef.current;
      const handleDiagnostic = () => {
        if (!img.naturalWidth) return;
        const dpr = window.devicePixelRatio || 1;
        const renderedTarget = img.clientWidth * dpr;
        if (img.naturalWidth < renderedTarget * 0.6 && img.clientWidth > 150) {
          console.debug(
            `[Image Quality Warning] Intrinsic width (${img.naturalWidth}px) is lower than rendered Retina width (${Math.round(renderedTarget)}px at ${dpr}x DPR) for "${alt}". Source: ${img.currentSrc || img.src}`
          );
        }
      };

      if (img.complete) {
        handleDiagnostic();
      } else {
        img.addEventListener('load', handleDiagnostic, { once: true });
      }
    }
  }, [src, alt]);

  const handleImageClick = (e: React.MouseEvent) => {
    if (enableLightbox && onOpenLightbox) {
      e.stopPropagation();
      onOpenLightbox(responsive.originalSrc, alt);
    }
  };

  return (
    <div className={`relative ${containerClassName}`}>
      <img
        ref={imgRef}
        src={hasError ? fallback : responsive.src}
        srcSet={hasError ? undefined : responsive.srcSet}
        sizes={hasError ? undefined : responsive.sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={(e) => {
          setHasError(true);
          handleOptimizedImageError(e, fallback);
        }}
        style={{ imageRendering: 'auto' }}
        className={`${className} ${enableLightbox ? 'cursor-zoom-in' : ''}`}
        onClick={handleImageClick}
        {...restProps}
      />

      {/* Lightbox hint overlay button if enabled */}
      {enableLightbox && onOpenLightbox && (
        <button
          type="button"
          onClick={handleImageClick}
          title="Xem ảnh gốc chất lượng cao"
          aria-label="Phóng to ảnh chất lượng cao"
          className="absolute bottom-2 right-2 p-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-lg opacity-0 hover:opacity-100 group-hover:opacity-90 transition-opacity backdrop-blur-xs shadow-md"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
