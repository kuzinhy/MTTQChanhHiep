import { Article, CloudinaryImageMeta } from '../types';
import { extractGoogleDriveFileId } from './googleDriveService';
import { getBannerForCategory, ARTICLE_BANNERS } from '../utils/officialImages';
import { optimizeAssignedLink } from './imageOptimization';

export interface ArticleImageResult {
  url: string;
  source: 'thumbnailUrl' | 'featuredImage' | 'coverImage' | 'gallery' | 'content' | 'legacy' | 'categoryBanner';
  isFallback: boolean;
  originalUrl?: string;
}

export interface ArticleImageAuditItem {
  article: Article;
  status: 'valid' | 'missing' | 'broken' | 'from_content';
  source: string;
  url: string;
  issueDescription?: string;
  firstContentImage?: string | null;
}

/**
 * Extracts the first image URL found inside HTML or Markdown content.
 * Supports:
 * - HTML <img> tags with src="..." or src='...'
 * - Markdown ![alt](url)
 * - Direct Google Drive URLs or image file links in content
 */
export function extractFirstImageFromContent(content?: string | null): string | null {
  if (!content || typeof content !== 'string') return null;

  const trimmed = content.trim();
  if (!trimmed) return null;

  // 1. Try matching HTML <img ... src="..." ...>
  const htmlImgMatch = trimmed.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (htmlImgMatch && htmlImgMatch[1]) {
    const raw = htmlImgMatch[1].trim();
    if (isValidImageCandidate(raw)) {
      return normalizeArticleImageUrl(raw);
    }
  }

  // 2. Try matching Markdown image syntax: ![...](url)
  const mdImgMatch = trimmed.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/i);
  if (mdImgMatch && mdImgMatch[1]) {
    const raw = mdImgMatch[1].trim();
    if (isValidImageCandidate(raw)) {
      return normalizeArticleImageUrl(raw);
    }
  }

  // 3. Try matching Google Drive file links in text
  const driveMatch = trimmed.match(/https?:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]{20,50})/i);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=w1600`;
  }

  // 4. Try matching direct image URLs (png, jpg, jpeg, webp, gif, svg)
  const directImgMatch = trimmed.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif|svg)(?:\?[^\s"'<>]*)?/i);
  if (directImgMatch && directImgMatch[0]) {
    return normalizeArticleImageUrl(directImgMatch[0]);
  }

  return null;
}

/**
 * Extracts all images found in content (useful for gallery / previews)
 */
export function extractAllImagesFromContent(content?: string | null): string[] {
  if (!content || typeof content !== 'string') return [];
  const results: string[] = [];
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match[1] && isValidImageCandidate(match[1])) {
      const normalized = normalizeArticleImageUrl(match[1]);
      if (normalized && !results.includes(normalized)) {
        results.push(normalized);
      }
    }
  }
  return results;
}

/**
 * Validates whether a candidate string can be a valid image URL
 */
function isValidImageCandidate(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  if (clean === 'null' || clean === 'undefined' || clean === '[object object]') return false;
  if (clean.startsWith('blob:') || clean.startsWith('file:') || clean.includes('localhost')) return false;
  // A Drive folder link is NOT an image file!
  if (clean.includes('/drive/folders/')) return false;
  return true;
}

/**
 * Normalizes any image URL into a high-performance, streamable HTTPS image URL.
 * Converts Google Drive preview/share links to direct Google UserContent CDN links (`lh3.googleusercontent.com/d/{id}=w...`).
 */
export function normalizeArticleImageUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  if (!isValidImageCandidate(url)) return '';

  // Strip markdown wrapper if user pasted [title](url)
  const mdMatch = url.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (mdMatch && mdMatch[1]) {
    url = mdMatch[1].trim();
  }

  // Strip surrounding quotes
  url = url.replace(/^["']|["']$/g, '');

  // Data URLs pass through directly
  if (url.startsWith('data:image/')) {
    return url;
  }

  // Google Drive: Extract File ID and convert to direct sharp CDN stream
  const driveFileId = extractGoogleDriveFileId(url);
  if (driveFileId) {
    return `https://lh3.googleusercontent.com/d/${driveFileId}=w1600`;
  }

  // If already an lh3.googleusercontent.com link without sizing or small sizing, ensure high-res
  if (url.includes('lh3.googleusercontent.com/d/')) {
    if (!url.includes('=w') && !url.includes('=s')) {
      return `${url}=w1600`;
    }
    return url;
  }

  // Dropbox direct link optimization
  if (url.includes('dropbox.com')) {
    url = url.replace(/\?dl=0/g, '?raw=1').replace(/&dl=0/g, '&raw=1');
    if (!url.includes('raw=1') && !url.includes('dl=1')) {
      url += url.includes('?') ? '&raw=1' : '?raw=1';
    }
    return url;
  }

  // Imgur direct image optimization
  if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
    const imgurMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)(?:\.[a-zA-Z]+)?$/);
    if (imgurMatch && imgurMatch[1]) {
      return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }
  }

  // Upgrade HTTP to HTTPS
  if (url.startsWith('http://')) {
    url = `https://${url.substring(7)}`;
  }

  // Sanitize spaces
  if (url.startsWith('https://') && url.includes(' ')) {
    url = url.replace(/ /g, '%20');
  }

  return url;
}

/**
 * MASTER FUNCTION: Resolves the best illustration image for an article.
 * 
 * Priority order:
 * 1. article.thumbnailUrl
 * 2. article.featuredImage (string or object)
 * 3. article.coverImage.url or article.coverImage.thumbnailUrl
 * 4. article.gallery[0].url
 * 5. Legacy/alternate fields (article.thumbnail, article.image, article.photo)
 * 6. First image extracted from article.content (HTML / Markdown)
 * 7. Default category banner from getBannerForCategory(category, title)
 */
export function getArticleImage(
  article?: Partial<Article> | null,
  options?: {
    fallbackCategory?: string;
    fallbackTitle?: string;
    defaultBannerOnly?: boolean;
  }
): ArticleImageResult {
  const category = article?.category || options?.fallbackCategory || 'Hoạt động Mặt trận';
  const title = article?.title || options?.fallbackTitle || '';
  const defaultBanner = getBannerForCategory(category, title) || ARTICLE_BANNERS.default;

  if (options?.defaultBannerOnly) {
    return {
      url: defaultBanner,
      source: 'categoryBanner',
      isFallback: true
    };
  }

  if (!article) {
    return {
      url: defaultBanner,
      source: 'categoryBanner',
      isFallback: true
    };
  }

  // 1. Explicit thumbnailUrl
  if (article.thumbnailUrl && typeof article.thumbnailUrl === 'string' && article.thumbnailUrl.trim()) {
    const normalized = normalizeArticleImageUrl(article.thumbnailUrl);
    if (normalized) {
      return {
        url: normalized,
        source: 'thumbnailUrl',
        isFallback: false,
        originalUrl: article.thumbnailUrl
      };
    }
  }

  // 2. featuredImage (string or CloudinaryImageMeta)
  if (article.featuredImage) {
    let rawFeatured = '';
    if (typeof article.featuredImage === 'string') {
      rawFeatured = article.featuredImage.trim();
    } else if (typeof article.featuredImage === 'object') {
      const meta = article.featuredImage as CloudinaryImageMeta;
      rawFeatured = meta.secureUrl || meta.url || '';
    }

    if (rawFeatured) {
      const normalized = normalizeArticleImageUrl(rawFeatured);
      if (normalized) {
        return {
          url: normalized,
          source: 'featuredImage',
          isFallback: false,
          originalUrl: rawFeatured
        };
      }
    }
  }

  // 3. coverImage object (from CMS modal)
  if (article.coverImage) {
    const rawCover = article.coverImage.url || article.coverImage.thumbnailUrl;
    if (rawCover && typeof rawCover === 'string' && rawCover.trim()) {
      const normalized = normalizeArticleImageUrl(rawCover);
      if (normalized) {
        return {
          url: normalized,
          source: 'coverImage',
          isFallback: false,
          originalUrl: rawCover
        };
      }
    }
  }

  // 4. First item from gallery
  if (Array.isArray(article.gallery) && article.gallery.length > 0) {
    const firstGal = article.gallery[0];
    const rawGal = firstGal?.url || firstGal?.thumbnailUrl;
    if (rawGal && typeof rawGal === 'string' && rawGal.trim()) {
      const normalized = normalizeArticleImageUrl(rawGal);
      if (normalized) {
        return {
          url: normalized,
          source: 'gallery',
          isFallback: false,
          originalUrl: rawGal
        };
      }
    }
  }

  // 5. Legacy / alternative field names (thumbnail, image, photo)
  const anyArt = article as any;
  const legacyCandidate = anyArt.thumbnail || anyArt.image || anyArt.imageUrl || anyArt.photo;
  if (legacyCandidate && typeof legacyCandidate === 'string' && legacyCandidate.trim()) {
    const normalized = normalizeArticleImageUrl(legacyCandidate);
    if (normalized) {
      return {
        url: normalized,
        source: 'legacy',
        isFallback: false,
        originalUrl: legacyCandidate
      };
    }
  }

  // 6. Automatic extraction from article content HTML / Markdown
  const contentImage = extractFirstImageFromContent(article.content);
  if (contentImage) {
    return {
      url: contentImage,
      source: 'content',
      isFallback: false
    };
  }

  // 7. Fallback to Official Category Banner SVG
  return {
    url: defaultBanner,
    source: 'categoryBanner',
    isFallback: true
  };
}

/**
 * Diagnostic Audit function for an individual article.
 * Used by the "Kiểm tra ảnh tin bài" CMS feature.
 */
export function auditArticleImage(article: Article): ArticleImageAuditItem {
  const contentFirstImage = extractFirstImageFromContent(article.content);
  const result = getArticleImage(article);

  // Check if raw field has a broken link (e.g. folder link or unresolvable)
  const rawCandidate = 
    article.thumbnailUrl || 
    (typeof article.featuredImage === 'string' ? article.featuredImage : article.featuredImage?.secureUrl) || 
    article.coverImage?.url;

  if (rawCandidate && typeof rawCandidate === 'string') {
    if (rawCandidate.includes('/drive/folders/')) {
      return {
        article,
        status: 'broken',
        source: result.source,
        url: result.url,
        issueDescription: 'Đường dẫn là Thư mục Google Drive (/drive/folders/), không phải tệp ảnh trực tiếp.',
        firstContentImage: contentFirstImage
      };
    }
    if (rawCandidate.startsWith('blob:') || rawCandidate.startsWith('file:') || rawCandidate.includes('localhost')) {
      return {
        article,
        status: 'broken',
        source: result.source,
        url: result.url,
        issueDescription: 'Đường dẫn ảnh tạm (blob/localhost) đã hết hạn hoặc không khả dụng.',
        firstContentImage: contentFirstImage
      };
    }
  }

  if (result.source === 'categoryBanner') {
    return {
      article,
      status: 'missing',
      source: 'categoryBanner',
      url: result.url,
      issueDescription: contentFirstImage 
        ? 'Chưa có ảnh đại diện riêng, nhưng có thể trích xuất từ nội dung.' 
        : 'Chưa có ảnh đại diện và không có ảnh trong bài viết (Đang dùng banner mặc định).',
      firstContentImage: contentFirstImage
    };
  }

  if (result.source === 'content') {
    return {
      article,
      status: 'from_content',
      source: 'content',
      url: result.url,
      issueDescription: 'Ảnh được tự động trích xuất từ nội dung bài viết.',
      firstContentImage: contentFirstImage
    };
  }

  return {
    article,
    status: 'valid',
    source: result.source,
    url: result.url,
    firstContentImage: contentFirstImage
  };
}
