import { Request, Response } from 'express';
import fetch from 'node-fetch';

/**
 * Media Proxy cho hình ảnh & tư liệu âm thanh/video
 * Mục đích: Vượt CORS, xử lý Hotlink Protection, bypass Referrer restrictions, stream dữ liệu
 */
export async function mediaProxyHandler(req: Request, res: Response) {
  let mediaUrl = req.query.url as string;

  if (!mediaUrl || typeof mediaUrl !== 'string') {
    return res.status(400).json({ error: 'Thiếu tham số URL tư liệu' });
  }

  mediaUrl = mediaUrl.trim();

  // If relative path like /uploads/..., redirect or handle
  if (mediaUrl.startsWith('/uploads/')) {
    const fs = await import('fs');
    const path = await import('path');
    const localFilePath = path.join(process.cwd(), mediaUrl);
    if (fs.existsSync(localFilePath)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(localFilePath);
    }
  }

  // Support both HTTP and HTTPS (upgrade to HTTPS if standard)
  if (!mediaUrl.startsWith('http://') && !mediaUrl.startsWith('https://')) {
    return res.status(400).json({ error: 'URL không hợp lệ. Phải bắt đầu bằng http:// hoặc https://' });
  }

  // Google Drive conversion for proxy streaming
  const gDriveMatch = mediaUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/i);
  if (gDriveMatch && gDriveMatch[1]) {
    mediaUrl = `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}=s0`;
  }

  try {
    const urlObj = new URL(mediaUrl);

    // List of trusted / common cultural and media domains
    const safeDomains = [
      'hochiminh.vn',
      'drive.google.com',
      'google.com',
      'googleusercontent.com',
      'youtube.com',
      'cloudinary.com',
      'res.cloudinary.com',
      'vov.vn',
      'baochinhphu.vn',
      'dangcongsan.vn',
      'nhandan.vn',
      'archive.org',
      'wikimedia.org',
      'wikipedia.org',
      'githubusercontent.com',
      'anhsieuviet.com',
      'sv2.anhsieuviet.com',
      'hcmcpv.org.vn',
      'tphcm.chinhphu.vn',
      'mattran.org.vn',
      'qdnd.vn',
      'tuoitre.vn',
      'thanhnien.vn',
      'vnexpress.net',
      'vietnamnet.vn',
      'bocongan.gov.vn',
      'chinhphu.vn',
      'firebasestorage.googleapis.com',
      'firebasestorage.app',
      'firebaseio.com',
      'imgur.com',
      'pinimg.com'
    ];

    const isDomainAllowed = safeDomains.some(domain => urlObj.hostname.endsWith(domain)) ||
      /\.(mp3|m4a|wav|ogg|aac|mp4|webm|mov|jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(mediaUrl) ||
      req.headers.accept?.includes('image/') ||
      urlObj.pathname.includes('/image') ||
      urlObj.pathname.includes('/media');

    if (!isDomainAllowed) {
      return res.status(403).json({ error: 'Domain hoặc tệp tư liệu không được cho phép qua proxy' });
    }

    // Use a standard modern browser User-Agent so government and image hosting sites don't block requests
    const response = await fetch(mediaUrl, {
      method: 'GET',
      headers: {
        'Range': req.headers.range || '',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,audio/*,video/*,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': `${urlObj.protocol}//${urlObj.host}/`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Không thể truy cập nguồn tư liệu (HTTP ${response.status})` });
    }

    // Set CORS and caching headers so frontend can display without restrictions
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');
    const contentRange = response.headers.get('content-range');

    res.setHeader('Content-Type', contentType);
    if (contentLength) res.setHeader('Content-Length', contentLength);
    if (contentRange) res.setHeader('Content-Range', contentRange);
    res.setHeader('Accept-Ranges', 'bytes');
    res.status(response.status === 206 ? 206 : 200);

    // Stream the binary response body
    (response.body as any).pipe(res);

  } catch (error: any) {
    console.error('[MediaProxy] Error:', error);
    res.status(500).json({ error: `Lỗi kết nối khi truyền tải tư liệu: ${error?.message || error}` });
  }
}
