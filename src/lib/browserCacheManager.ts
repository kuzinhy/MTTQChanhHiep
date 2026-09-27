/**
 * Quản lý Bộ nhớ đệm Trình duyệt (Browser Cache API & LocalStorage)
 * Tối ưu hóa lưu trữ tài nguyên static, hình ảnh, dữ liệu bài viết & bản đồ
 * Giúp người dùng truy cập trang chủ ngay lập tức kể cả khi mạng chậm hoặc offline.
 */

const CACHE_NAME_STATIC = 'mttq-chanhhiep-static-v2';

export const BrowserCacheManager = {
  /**
   * Khởi tạo và pre-cache các tài nguyên hình ảnh, biểu tượng & font chữ quan trọng
   */
  async preCacheCriticalAssets(): Promise<void> {
    if (typeof window === 'undefined') return;

    const criticalUrls = [
      'https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png',
      'https://res.cloudinary.com/idt08wyp/image/upload/v1789907027/701895118_122094685251337068_1425314572080698202_n.jpg',
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
      '/favicon.png',
      '/icon.svg',
      '/manifest.webmanifest'
    ];

    try {
      if ('caches' in window) {
        const cache = await caches.open(CACHE_NAME_STATIC);
        // Cache non-blocking
        await Promise.allSettled(
          criticalUrls.map(async (url) => {
            try {
              const matched = await cache.match(url);
              if (!matched) {
                await cache.add(url);
              }
            } catch (err) {
              // Ignore cross-origin request restrictions safely
            }
          })
        );
      }
    } catch (e) {
      console.warn('[CacheManager] Pre-cache warning:', e);
    }
  },

  /**
   * Preload hình ảnh vào RAM trình duyệt bằng Image object
   */
  async preloadImageToMemory(src: string): Promise<boolean> {
    if (!src || typeof window === 'undefined') return false;
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  },

  /**
   * Lưu dấu phiên làm việc & thông số cache lần cuối
   */
  markLastVisitedTime(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mttq_last_visit_timestamp', Date.now().toString());
        localStorage.setItem('mttq_cache_version', '2.0');
      }
    } catch (e) {
      console.warn('[CacheManager] LocalStorage error:', e);
    }
  },

  /**
   * Kiểm tra xem người dùng đã từng truy cập hay là máy mới
   */
  isRepeatVisitor(): boolean {
    try {
      if (typeof window !== 'undefined') {
        const lastVisit = localStorage.getItem('mttq_last_visit_timestamp');
        return !!lastVisit;
      }
    } catch (e) {
      return false;
    }
    return false;
  }
};
