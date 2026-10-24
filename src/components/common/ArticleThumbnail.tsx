import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../../types';
import { getArticleImage, ArticleImageResult } from '../../lib/articleImageService';
import { getBannerForCategory, ARTICLE_BANNERS } from '../../utils/officialImages';
import { extractGoogleDriveFileId } from '../../lib/googleDriveService';
import { Maximize2, Image as ImageIcon } from 'lucide-react';

export interface ArticleThumbnailProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'onClick'> {
  article: Partial<Article>;
  alt?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: '16/9' | '16/10' | '4/3' | '1/1' | 'auto';
  variant?: 'thumbnail' | 'card' | 'hero' | 'article' | 'detail';
  priority?: boolean;
  enableLightbox?: boolean;
  onOpenLightbox?: (url: string, title?: string) => void;
  onClick?: (e: React.MouseEvent) => void;
  showCategoryBadge?: boolean;
  objectPosition?: string;
}

export const ArticleThumbnail: React.FC<ArticleThumbnailProps> = ({
  article,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = '16/10',
  variant = 'card',
  priority = false,
  enableLightbox = false,
  onOpenLightbox,
  onClick,
  showCategoryBadge = false,
  objectPosition,
  style,
  ...restProps
}) => {
  const [resolved, setResolved] = useState<ArticleImageResult>(() => getArticleImage(article));
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Re-resolve whenever article identity, thumbnail, featuredImage, or content changes
  useEffect(() => {
    const next = getArticleImage(article);
    setResolved(next);
    setHasError(false);
    setIsLoaded(false);
  }, [
    article?.id,
    article?.thumbnailUrl,
    article?.featuredImage,
    article?.coverImage?.url,
    article?.content,
    article?.category
  ]);

  const category = article?.category || 'Hoạt động Mặt trận';
  const displayTitle = alt || article?.title || 'Hình ảnh tin bài';
  const defaultFallback = getBannerForCategory(category, displayTitle) || ARTICLE_BANNERS.default;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const currentSrc = target.src || '';

    // If already at an SVG data URI or marked handled, stop
    if (target.dataset.errorHandled === 'true' || currentSrc.startsWith('data:image/svg+xml')) {
      return;
    }

    // Tier 1: If Google Drive CDN failed, try Google Drive Thumbnail API
    const fileId = extractGoogleDriveFileId(currentSrc);
    if (fileId && !target.dataset.triedDriveThumbnail) {
      target.dataset.triedDriveThumbnail = 'true';
      target.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
      return;
    }

    // Tier 2: Try internal media proxy for external URLs with strict CORS
    if (
      currentSrc &&
      (currentSrc.startsWith('http://') || currentSrc.startsWith('https://')) &&
      !target.dataset.triedProxy &&
      !currentSrc.includes('/api/media/proxy')
    ) {
      target.dataset.triedProxy = 'true';
      target.src = `/api/media/proxy?url=${encodeURIComponent(currentSrc)}`;
      return;
    }

    // Tier 3: Final fallback to official category banner
    target.dataset.errorHandled = 'true';
    target.src = defaultFallback;
    setHasError(true);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (enableLightbox && onOpenLightbox) {
      e.stopPropagation();
      onOpenLightbox(resolved.url, displayTitle);
    }
  };

  // Aspect ratio class helper
  const aspectClass = 
    aspectRatio === '16/9' ? 'aspect-video' :
    aspectRatio === '16/10' ? 'aspect-[16/10]' :
    aspectRatio === '4/3' ? 'aspect-[4/3]' :
    aspectRatio === '1/1' ? 'aspect-square' : '';

  // Determine effective position
  const effectiveObjectPosition = 
    objectPosition || 
    article?.objectPosition || 
    article?.imageFocalPoint || 
    (article?.imagePositionY ? `${article.imagePositionX || '50'}% ${article.imagePositionY}%` : 'center');

  return (
    <div 
      className={`relative overflow-hidden bg-slate-100 group ${aspectClass} ${containerClassName}`}
      onClick={handleContainerClick}
    >
      {/* Loading Skeleton Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center pointer-events-none">
          <ImageIcon className="w-6 h-6 text-slate-300" />
        </div>
      )}

      {/* Main Responsive Image */}
      <img
        ref={imgRef}
        src={hasError ? defaultFallback : resolved.url}
        alt={displayTitle}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        style={{
          objectFit: 'cover',
          objectPosition: effectiveObjectPosition,
          ...style
        }}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded || hasError ? 'opacity-100' : 'opacity-0'
        } ${enableLightbox ? 'cursor-zoom-in' : ''} ${className}`}
        {...restProps}
      />

      {/* Optional Category Tag Badge on Image */}
      {showCategoryBadge && article.category && (
        <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-lg bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider shadow-sm border border-white/20 pointer-events-none">
          {article.category}
        </span>
      )}

      {/* Lightbox Trigger Icon Button */}
      {enableLightbox && onOpenLightbox && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenLightbox(resolved.url, displayTitle);
          }}
          title="Xem ảnh phóng to"
          aria-label="Xem ảnh phóng to"
          className="absolute bottom-2 right-2 p-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-md z-10 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
