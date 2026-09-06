import { Request, Response } from 'express';
import fetch from 'node-fetch';

/**
 * Media Proxy cho tư liệu âm thanh/video
 * Mục đích: Vượt CORS, xử lý Range Requests, bảo mật URL
 */
export async function mediaProxyHandler(req: Request, res: Response) {
  const mediaUrl = req.query.url as string;

  if (!mediaUrl || typeof mediaUrl !== 'string' || !mediaUrl.startsWith('https://')) {
    return res.status(400).json({ error: 'URL không hợp lệ hoặc không phải HTTPS' });
  }

  // BƯỚC 1: Kiểm tra an toàn (whitelist domain)
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
    'githubusercontent.com'
  ];
  const urlObj = new URL(mediaUrl);
  const isDomainAllowed = safeDomains.some(domain => urlObj.hostname.endsWith(domain)) || 
    /\.(mp3|m4a|wav|ogg|aac|mp4|webm|mov|jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(mediaUrl);

  if (!isDomainAllowed) {
    return res.status(403).json({ error: 'Domain hoặc tệp tư liệu không được cho phép qua proxy' });
  }

  try {
    const response = await fetch(mediaUrl, {
      method: 'GET',
      headers: {
        'Range': req.headers.range || '',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (compatible; MTTQ-ChanhHiep-Bot/1.0)'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Không thể truy cập nguồn tư liệu' });
    }

    // BƯỚC 2: Chuyển tiếp headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');
    const contentRange = response.headers.get('content-range');

    res.setHeader('Content-Type', contentType);
    if (contentLength) res.setHeader('Content-Length', contentLength);
    if (contentRange) res.setHeader('Content-Range', contentRange);
    res.setHeader('Accept-Ranges', 'bytes');
    res.status(response.status === 206 ? 206 : 200);

    // BƯỚC 3: Truyền tải dữ liệu (streaming)
    (response.body as any).pipe(res);

  } catch (error) {
    console.error('[MediaProxy] Error:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi truyền tải tư liệu' });
  }
}
