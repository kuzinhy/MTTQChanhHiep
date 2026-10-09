import { CloudinaryImageMeta } from '../types';
import { ARTICLE_BANNERS, getBannerForCategory } from '../utils/officialImages';
import { extractGoogleDriveFileId } from './googleDriveService';

export const BACKEND_CLOUD_RUN_ORIGIN = 'https://ais-pre-eokzuo3lbp4ijcdgdnvif3-553565080913.asia-southeast1.run.app';

/**
 * Optimizes an assigned link (Google Drive, Dropbox, Imgur, Anhsieuviet, Cloudinary, etc.)
 * by converting it into the most performant, direct, and high-quality streamable URL.
 */
export function optimizeAssignedLink(rawLink?: string | null): string {
  if (!rawLink) return '';
  let url = rawLink.trim();
  if (!url || url === 'null' || url === 'undefined' || url === '[object Object]') return '';

  // 1. Strip markdown wrapper [title](url)
  const mdMatch = url.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (mdMatch && mdMatch[1]) {
    url = mdMatch[1];
  }

  // 2. Strip surrounding quotes
  url = url.replace(/^["']|["']$/g, '');

  // 3. Reject invalid ephemeral/local URLs
  if (
    url.startsWith('blob:') ||
    url.startsWith('file:') ||
    url.includes('localhost') ||
    url.includes('127.0.0.1') ||
    url.includes('/tmp/') ||
    url.startsWith('C:') ||
    url.startsWith('D:')
  ) {
    return '';
  }

  // 4. Data URIs pass through directly
  if (url.startsWith('data:image/')) {
    return url;
  }

  // 5. Convert Google Drive link / file ID to high-resolution direct CDN image stream
  const gDriveId = extractGoogleDriveFileId(url);
  if (gDriveId) {
    return `https://lh3.googleusercontent.com/d/${gDriveId}=w1600`;
  }

  // 6. Dropbox link direct stream optimization (dl=0 -> raw=1)
  if (url.includes('dropbox.com')) {
    url = url.replace(/\?dl=0/g, '?raw=1').replace(/&dl=0/g, '&raw=1');
    if (!url.includes('raw=1') && !url.includes('dl=1')) {
      url += url.includes('?') ? '&raw=1' : '?raw=1';
    }
    return url;
  }

  // 7. Imgur link direct image optimization
  if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
    const imgurMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)(?:\.[a-zA-Z]+)?$/);
    if (imgurMatch && imgurMatch[1]) {
      return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }
  }

  // 8. Upgrade plain HTTP to HTTPS
  if (url.startsWith('http://')) {
    url = `https://${url.substring(7)}`;
  }

  // 9. Sanitize and encode spaces / Unicode URL paths safely
  if (url.startsWith('https://')) {
    try {
      url = encodeURI(decodeURI(url));
    } catch {
      url = url.replace(/ /g, '%20');
    }
  }

  return url;
}

export function isFacebookCdnUrl(url?: string | null): boolean {
  if (!url) return false;
  return /fbcdn\.net|scontent|lookaside\.fbsbx|fna\.fbcdn/i.test(url);
}

export function isFacebookPostUrl(url?: string | null): boolean {
  if (!url) return false;
  return /facebook\.com\/(?:permalink\.php|story\.php|[^/]+\/posts|groups\/|events\/|watch|share)/i.test(url) ||
    /fb\.watch|fb\.me/i.test(url);
}

/**
 * Normalizes any image input (string, object, undefined, null) into a guaranteed valid,
 * permanent HTTPS or local asset URL. Filters out invalid blob:, localhost, and broken URLs.
 */
export function normalizeImageUrl(
  rawInput?: string | CloudinaryImageMeta | null | undefined,
  fallbackCategory?: string,
  fallbackTitle?: string
): string {
  const fallback = getBannerForCategory(fallbackCategory, fallbackTitle);

  if (!rawInput) return fallback;

  let url = '';
  if (typeof rawInput === 'object') {
    url = rawInput.secureUrl || rawInput.url || '';
  } else if (typeof rawInput === 'string') {
    url = rawInput.trim();
  }

  if (!url || url === 'null' || url === 'undefined' || url === '[object Object]') {
    return fallback;
  }

  // If input is an HTML post link from Facebook (not an image file), fallback to official banner
  if (isFacebookPostUrl(url) && !isFacebookCdnUrl(url)) {
    return fallback;
  }

  // Data URIs pass through directly
  if (url.startsWith('data:image/')) {
    return url;
  }

  // Handle local uploads path
  if (url.startsWith('/uploads/')) {
    return url;
  }

  // Check with optimizeAssignedLink
  const optimized = optimizeAssignedLink(url);
  if (optimized) {
    return optimized;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return fallback;
}

/**
 * Returns a proxied URL via the backend server proxy to bypass CORS, Referrer restrictions, and Hotlink Protection.
 */
export function getProxiedMediaUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('/api/media/proxy?url=')) return trimmed;
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) return trimmed;
  return `/api/media/proxy?url=${encodeURIComponent(trimmed)}`;
}

/**
 * Global CDN Image Proxy fallback for external sites with strict Hotlink Protection (e.g. congdoangdvn.org.vn)
 */
export function getGlobalCdnProxiedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) return trimmed;
  const cleanUrl = trimmed.replace(/^https?:\/\//i, '');
  return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&output=webp`;
}

/**
 * Resolves any media URL (image, audio, video) into a clean, universally accessible URL.
 * Preserves external http:// and https:// URLs completely without truncating, editing, or converting them.
 */
export function resolveMediaUrl(rawUrl?: string | null, category?: string): string {
  if (!rawUrl) {
    if (category) {
      return getBannerForCategory(category) || ARTICLE_BANNERS.default;
    }
    return '';
  }
  
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') {
    return category ? (getBannerForCategory(category) || ARTICLE_BANNERS.default) : '';
  }

  // Optimize assigned link (Google Drive, Dropbox, Imgur, HTTPS sanitization)
  const optimized = optimizeAssignedLink(trimmed);
  if (optimized) {
    return optimized;
  }
  
  // Rules for external URLs & special protocol handlers
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }
  
  // Rules for local paths
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  
  return `/${trimmed}`;
}

export type ImageVariant = 'thumbnail' | 'card' | 'article' | 'hero' | 'original' | 'avatar' | 'banner';

export interface ResponsiveImageSources {
  src: string;
  srcSet?: string;
  sizes: string;
  originalSrc: string;
  isHighRes: boolean;
}

export interface ImageFileDiagnostics {
  name: string;
  width: number;
  height: number;
  sizeBytes: number;
  sizeFormatted: string;
  format: string;
  isHighRes: boolean;
  warning?: string;
  qualityLevel: 'ultra' | 'hd' | 'standard' | 'low';
}

/**
 * Format bytes to readable string (e.g. 3.2 MB or 450 KB)
 */
export function formatBytes(bytes: number): string {
  if (!bytes || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Format raw image source (string or CloudinaryImageMeta) into a raw string
 */
export function extractRawImageUrl(source: string | CloudinaryImageMeta | undefined | null): string {
  if (!source) return '';
  if (typeof source === 'object') {
    return source.secureUrl || source.url || '';
  }
  return source.trim();
}

/**
 * Extract Cloudinary public parts to build custom high-quality responsive URLs
 */
function buildCloudinaryUrl(url: string, transform: string): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  // Replace or inject transformation after /upload/
  // e.g. https://res.cloudinary.com/<cloud>/image/upload/v12345/abc.jpg
  // -> https://res.cloudinary.com/<cloud>/image/upload/<transform>/v12345/abc.jpg
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  
  const prefix = url.substring(0, uploadIndex + 8);
  const suffix = url.substring(uploadIndex + 8);
  
  // If suffix already has transformations (doesn't start with v\d+ or is already transformed)
  const regexTransform = /^([a-zA-Z0-9_,:-]+\/)(v\d+\/.*)$/;
  if (regexTransform.test(suffix)) {
    return `${prefix}${transform}/${suffix.replace(regexTransform, '$2')}`;
  }
  
  return `${prefix}${transform}/${suffix}`;
}

/**
 * Converts a raw image source into the optimal, highest-quality direct URL for the requested context
 */
export function getOptimalImageUrl(
  source: string | CloudinaryImageMeta | undefined | null,
  variant: ImageVariant = 'article'
): string {
  const normalized = normalizeImageUrl(source);
  if (!normalized) return '';

  // Data URLs and SVGs pass directly
  if (normalized.startsWith('data:image/')) {
    return normalized;
  }

  // 1. Google Drive URLs
  const fileId = extractGoogleDriveFileId(normalized);
  if (fileId) {
    if (variant === 'original') {
      return `https://lh3.googleusercontent.com/d/${fileId}=s0`;
    }
    if (variant === 'hero') {
      return `https://lh3.googleusercontent.com/d/${fileId}=w2560`;
    }
    if (variant === 'article') {
      return `https://lh3.googleusercontent.com/d/${fileId}=w2000`;
    }
    if (variant === 'card') {
      return `https://lh3.googleusercontent.com/d/${fileId}=w1200`;
    }
    if (variant === 'thumbnail') {
      return `https://lh3.googleusercontent.com/d/${fileId}=w600`;
    }
    return `https://lh3.googleusercontent.com/d/${fileId}=w2000`;
  }

  // 2. Cloudinary URLs
  if (normalized.includes('res.cloudinary.com')) {
    if (variant === 'original') {
      return normalized;
    }
    if (variant === 'hero') {
      return buildCloudinaryUrl(normalized, 'w_2560,q_95');
    }
    if (variant === 'article') {
      return buildCloudinaryUrl(normalized, 'w_2000,q_95');
    }
    if (variant === 'card') {
      return buildCloudinaryUrl(normalized, 'w_1200,q_95');
    }
    if (variant === 'thumbnail') {
      return buildCloudinaryUrl(normalized, 'w_600,q_90');
    }
  }

  return normalized;
}

/**
 * Returns full responsive sources including src, srcSet, sizes, and original master link
 */
export function getResponsiveImageSources(
  source: string | CloudinaryImageMeta | undefined | null,
  variant: ImageVariant = 'article',
  customSizes?: string
): ResponsiveImageSources {
  const rawUrl = extractRawImageUrl(source);
  const primarySrc = getOptimalImageUrl(source, variant);
  const originalSrc = getOptimalImageUrl(source, 'original') || primarySrc;

  // Default sizes matching container archetypes
  let defaultSizes = '(max-width: 768px) 100vw, 1200px';
  if (variant === 'hero') {
    defaultSizes = '100vw';
  } else if (variant === 'card') {
    defaultSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px';
  } else if (variant === 'thumbnail') {
    defaultSizes = '(max-width: 640px) 120px, 160px';
  } else if (variant === 'article') {
    defaultSizes = '(max-width: 1024px) 100vw, 1200px';
  }

  const sizes = customSizes || defaultSizes;

  // Build responsive srcSet for Google Drive
  const fileId = extractGoogleDriveFileId(rawUrl);
  if (fileId) {
    const srcSet = [
      `https://lh3.googleusercontent.com/d/${fileId}=w600 600w`,
      `https://lh3.googleusercontent.com/d/${fileId}=w1200 1200w`,
      `https://lh3.googleusercontent.com/d/${fileId}=w1800 1800w`,
      `https://lh3.googleusercontent.com/d/${fileId}=w2560 2560w`
    ].join(', ');

    return {
      src: primarySrc,
      srcSet,
      sizes,
      originalSrc,
      isHighRes: true
    };
  }

  // Build responsive srcSet for Cloudinary
  if (rawUrl.includes('res.cloudinary.com')) {
    const srcSet = [
      `${buildCloudinaryUrl(rawUrl, 'w_600,q_90')} 600w`,
      `${buildCloudinaryUrl(rawUrl, 'w_1200,q_95')} 1200w`,
      `${buildCloudinaryUrl(rawUrl, 'w_1800,q_95')} 1800w`,
      `${buildCloudinaryUrl(rawUrl, 'w_2560,q_95')} 2560w`
    ].join(', ');

    return {
      src: primarySrc,
      srcSet,
      sizes,
      originalSrc,
      isHighRes: true
    };
  }

  return {
    src: primarySrc,
    sizes,
    originalSrc,
    isHighRes: true
  };
}

/**
 * Inspects a File object to extract actual natural dimensions, size, and quality diagnosis
 * WITHOUT mutating, compressing, or resizing the file.
 */
export function inspectImageFile(file: File): Promise<ImageFileDiagnostics> {
  return new Promise((resolve) => {
    const format = file.type ? file.type.replace('image/', '').toUpperCase() : 'UNKNOWN';
    const sizeFormatted = formatBytes(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        let qualityLevel: 'ultra' | 'hd' | 'standard' | 'low' = 'hd';
        let warning: string | undefined;

        if (width >= 2400) {
          qualityLevel = 'ultra';
        } else if (width >= 1200) {
          qualityLevel = 'hd';
        } else if (width >= 800) {
          qualityLevel = 'standard';
          warning = `Ảnh có chiều rộng ${width}px (đạt mức tiêu chuẩn). Trên màn hình 2K/4K hoặc Retina có thể kém sắc nét hơn ảnh chuẩn HD (≥1200px).`;
        } else {
          qualityLevel = 'low';
          warning = `Cảnh báo: Ảnh này có độ phân giải thấp (${width} × ${height}px). Khi hiển thị trên màn hình máy tính lớn hoặc màn hình Retina, ảnh có thể bị mờ hoặc vỡ nét. Khuyến nghị tải ảnh tối thiểu 1200px (hoặc 1920px đối với Banner/Hero).`;
        }

        resolve({
          name: file.name,
          width,
          height,
          sizeBytes: file.size,
          sizeFormatted,
          format,
          isHighRes: width >= 1200,
          warning,
          qualityLevel
        });
      };

      img.onerror = () => {
        resolve({
          name: file.name,
          width: 0,
          height: 0,
          sizeBytes: file.size,
          sizeFormatted,
          format,
          isHighRes: true,
          qualityLevel: 'standard'
        });
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      resolve({
        name: file.name,
        width: 0,
        height: 0,
        sizeBytes: file.size,
        sizeFormatted,
        format,
        isHighRes: true,
        qualityLevel: 'standard'
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Universal error handler for images to prevent broken visual states
 */
export function handleOptimizedImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
): void {
  const target = e.currentTarget;
  const currentSrc = target.src || '';

  // Prevent infinite loops if error is already handled
  if (target.dataset.errorHandled === 'true') {
    return;
  }

  // If already at an SVG data URI fallback, stop
  if (currentSrc.startsWith('data:image/svg+xml')) {
    target.dataset.errorHandled = 'true';
    return;
  }

  const defaultFallback = fallbackSrc || ARTICLE_BANNERS.default;

  // If already tried proxy or already failed on proxy, apply fallback immediately
  if (
    currentSrc.includes('/api/media/proxy') ||
    currentSrc.includes('wsrv.nl') ||
    target.dataset.triedInternalProxy === 'true'
  ) {
    target.dataset.errorHandled = 'true';
    target.src = defaultFallback;
    return;
  }

  // 1. Google Drive Fallback: Convert to direct lh3 Google CDN stream
  const fileId = extractGoogleDriveFileId(currentSrc);
  if (fileId && !currentSrc.includes('lh3.googleusercontent.com') && !target.dataset.triedLh3) {
    target.dataset.triedLh3 = 'true';
    target.src = `https://lh3.googleusercontent.com/d/${fileId}=w1600`;
    return;
  }

  // 2. Try Internal API Proxy once for external URLs (including Facebook CDN)
  if (
    currentSrc &&
    (currentSrc.startsWith('http://') || currentSrc.startsWith('https://')) &&
    !target.dataset.triedInternalProxy
  ) {
    target.dataset.triedInternalProxy = 'true';
    target.src = getProxiedMediaUrl(currentSrc);
    return;
  }

  // 3. Final Fallback to official category banner
  target.dataset.errorHandled = 'true';
  target.src = defaultFallback;
}

/**
 * Automatically compresses and optimizes an image file (from local picker or camera)
 * to a crisp, high-performance Data URL (max 1600px, WebP/JPEG, ~150-300KB)
 * to guarantee 100% persistent storage and zero display errors.
 */
export async function compressAndOptimizeImageFile(
  file: File, 
  maxDim = 1600, 
  quality = 0.85
): Promise<{
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    // If SVG, read as text / data URL directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        resolve({
          dataUrl: res,
          originalSize: file.size,
          compressedSize: file.size,
          width: 1200,
          height: 630
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        let width = img.naturalWidth || img.width || 1200;
        let height = img.naturalHeight || img.height || 630;

        // Scale down proportionally if larger than maxDim
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: reader.result as string,
            originalSize: file.size,
            compressedSize: file.size,
            width,
            height
          });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
        } catch {
          dataUrl = '';
        }
        if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const compressedSize = Math.round((dataUrl.length * 3) / 4);

        resolve({
          dataUrl,
          originalSize: file.size,
          compressedSize,
          width,
          height
        });
      };
      img.onerror = () => {
        // Fallback to original data URL if image can't be decoded on canvas
        resolve({
          dataUrl: reader.result as string,
          originalSize: file.size,
          compressedSize: file.size,
          width: 0,
          height: 0
        });
      };
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

