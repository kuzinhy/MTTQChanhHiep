import {
  incrementVisitorCount,
  updateActiveVisitorPresence,
  removeActiveVisitorPresence,
  subscribeToFirebaseAnalytics
} from './firebaseAnalytics';
import { db } from './firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  monthVisits: number;
  totalPageViews?: number;
  todayPageViews?: number;
  lastVisitDate: string;
  lastVisitTime: string;
  serverTime?: string;
  hourlyTraffic?: Record<string, number>;
}

export interface DetailedAnalyticsReport {
  onlineCount: number;
  totalVisits: number;
  todayVisits: number;
  monthVisits: number;
  totalPageViews: number;
  todayPageViews: number;
  lastDate: string;
  dailyTrend: Array<{ date: string; displayDate: string; visits: number; pageViews: number }>;
  hourlyTraffic: Record<string, number>;
  deviceStats: { Desktop: number; Mobile: number; Tablet: number };
  browserStats: Record<string, number>;
  topPages: Record<string, number>;
  topArticles: Array<{
    id: string;
    views: number;
    title?: string;
    category?: string;
    lastViewedAt: string;
  }>;
  recentAccessLogs: Array<{
    id: string;
    timestamp: number;
    dateStr: string;
    timeStr: string;
    maskedIp: string;
    device: 'Mobile' | 'Tablet' | 'Desktop';
    browser: string;
    page: string;
    referrer: string;
  }>;
  serverTime: string;
}

// Unique session identifier for this tab/window session
export const getAnalyticsSessionId = (): string => {
  if (typeof window === 'undefined') return 'server_session';
  let sid = sessionStorage.getItem('mttq_chanhhiep_analytics_sid');
  if (!sid) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem('mttq_chanhhiep_analytics_sid', sid);
  }
  return sid;
};

// Local storage fallback key
const STORAGE_KEY_CACHE = 'mttq_chanhhiep_visitor_stats_cache_v5';

export class VisitorTrackerEngine {
  private static listeners: Array<(count: number) => void> = [];
  private static statsListeners: Array<(stats: VisitorStats) => void> = [];
  private static heartbeatInterval: any = null;
  private static firebaseUnsub: (() => void) | null = null;
  private static isInitialized = false;

  private static currentOnlineCount = 1;
  private static currentStats: VisitorStats = {
    totalVisits: 1258,
    todayVisits: 48,
    monthVisits: 385,
    totalPageViews: 4120,
    todayPageViews: 142,
    lastVisitDate: new Date().toISOString().split('T')[0],
    lastVisitTime: new Date().toLocaleTimeString('vi-VN'),
  };

  /**
   * Khởi tạo máy đếm: Cập nhật Server Express & Firebase Firestore
   */
  public static init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Load cached stats from localStorage if available for immediate rendering
    this.loadFromCache();

    const sessionId = getAnalyticsSessionId();

    // 1. Gửi bản tin truy cập đến Express Server (Server có cơ chế de-duplicate 30 phút)
    this.sendVisitToExpressServer();

    // 2. Tăng lượt truy cập trên Firebase Firestore
    const isRecordedInSession = sessionStorage.getItem('mttq_chanhhiep_analytics_visit_recorded');
    if (!isRecordedInSession) {
      sessionStorage.setItem('mttq_chanhhiep_analytics_visit_recorded', 'true');
      incrementVisitorCount()
        .then((fbStats) => {
          if (fbStats) {
            this.currentStats = {
              ...this.currentStats,
              totalVisits: Math.max(this.currentStats.totalVisits, fbStats.totalVisits),
              todayVisits: Math.max(this.currentStats.todayVisits, fbStats.todayVisits),
              monthVisits: Math.max(this.currentStats.monthVisits, fbStats.monthVisits),
              lastVisitDate: fbStats.lastDate,
            };
            this.notifyStats();
          }
        })
        .catch(() => {});
    }

    // 3. Cập nhật presence Firestore
    updateActiveVisitorPresence(sessionId).catch(() => {});

    // 4. Chu kỳ 30 giây: Cập nhật nhịp tim duy trì online
    this.heartbeatInterval = setInterval(() => {
      updateActiveVisitorPresence(sessionId).catch(() => {});
      this.sendHeartbeatToExpressServer().catch(() => {});
    }, 30000);

    // 5. Đăng ký nhận snapshot real-time từ Firestore
    this.firebaseUnsub = subscribeToFirebaseAnalytics(
      (fbStats) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const nowTimeStr = new Date().toLocaleTimeString('vi-VN');

        this.currentStats = {
          ...this.currentStats,
          totalVisits: Math.max(this.currentStats.totalVisits, fbStats.totalVisits || 0),
          todayVisits: Math.max(this.currentStats.todayVisits, fbStats.todayVisits || 0),
          monthVisits: Math.max(this.currentStats.monthVisits, fbStats.monthVisits || 0),
          lastVisitDate: fbStats.lastDate || todayStr,
          lastVisitTime: nowTimeStr,
        };
        this.saveToCache();
        this.notifyStats();
      },
      (onlineCount) => {
        this.currentOnlineCount = Math.max(1, onlineCount);
        this.saveToCache();
        this.notifyOnlineCount();
      }
    );

    // 6. Event handlers khi rời trang
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        removeActiveVisitorPresence(sessionId);
        this.sendUnloadToExpressServer();
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          updateActiveVisitorPresence(sessionId);
          this.sendHeartbeatToExpressServer();
        }
      });
    }
  }

  /**
   * Gửi lượt truy cập hợp lệ lên Express Server
   */
  private static async sendVisitToExpressServer(): Promise<void> {
    try {
      const res = await fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getAnalyticsSessionId(),
          currentPage: window.location.hash || window.location.pathname || '/',
          referrer: document.referrer || '',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          this.currentOnlineCount = Math.max(1, data.onlineCount || this.currentOnlineCount);
          this.currentStats = {
            ...this.currentStats,
            totalVisits: Math.max(this.currentStats.totalVisits, data.totalVisits || 0),
            todayVisits: Math.max(this.currentStats.todayVisits, data.todayVisits || 0),
            monthVisits: Math.max(this.currentStats.monthVisits, data.monthVisits || 0),
            totalPageViews: data.totalPageViews,
            todayPageViews: data.todayPageViews,
            serverTime: data.serverTime,
          };
          this.saveToCache();
          this.notifyStats();
          this.notifyOnlineCount();
        }
      }
    } catch {
      // Fallback
    }
  }

  /**
   * Gửi nhịp tim keep-alive
   */
  private static async sendHeartbeatToExpressServer(): Promise<void> {
    try {
      const res = await fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getAnalyticsSessionId(),
          currentPage: window.location.hash || window.location.pathname || '/',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.onlineCount) {
          this.currentOnlineCount = Math.max(1, data.onlineCount);
          this.notifyOnlineCount();
        }
      }
    } catch {
      // ignore
    }
  }

  private static sendUnloadToExpressServer(): void {
    try {
      const payload = JSON.stringify({ sessionId: getAnalyticsSessionId() });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/heartbeat', payload);
      }
    } catch {
      // ignore
    }
  }

  /**
   * Ghi nhận lượt xem bài viết trên máy chủ & Firestore
   */
  public static async recordArticleView(
    articleId: string,
    articleTitle?: string,
    articleCategory?: string,
    initialViews: number = 0
  ): Promise<{ views: number; recorded: boolean }> {
    if (!articleId) return { views: initialViews, recorded: false };

    try {
      // 1. Gọi Server endpoint với cơ chế chống trùng lặp (debounce 15 phút)
      const res = await fetch('/api/analytics/article-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          sessionId: getAnalyticsSessionId(),
          title: articleTitle,
          category: articleCategory,
          initialViews
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const viewsCount = data.views || initialViews;

        // 2. Nếu là lượt xem mới hợp lệ, đồng bộ tăng lượt xem trên Firestore
        if (data.recorded) {
          try {
            const artDocRef = doc(db, 'articles', articleId);
            updateDoc(artDocRef, {
              views: increment(1)
            }).catch(() => {});
          } catch {
            // ignore
          }
        }

        // 3. Phát sự kiện cập nhật để các component khác (Thẻ tin, Danh sách) tự cập nhật số lượt xem
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('article_views_updated', {
              detail: { articleId, views: viewsCount, recorded: data.recorded }
            })
          );
        }

        return { views: viewsCount, recorded: data.recorded };
      }
    } catch (e) {
      console.warn('[Analytics] Failed to record article view on server:', e);
    }

    return { views: initialViews, recorded: false };
  }

  /**
   * Lấy số lượt xem bài viết từ máy chủ
   */
  public static async getArticleViews(articleId: string): Promise<number> {
    try {
      const res = await fetch(`/api/analytics/article-views/${encodeURIComponent(articleId)}`);
      if (res.ok) {
        const data = await res.json();
        return Number(data.views) || 0;
      }
    } catch {
      // ignore
    }
    return 0;
  }

  /**
   * Lấy báo cáo thống kê chi tiết từ máy chủ
   */
  public static async getDetailedAnalytics(): Promise<DetailedAnalyticsReport | null> {
    try {
      const res = await fetch('/api/analytics/detailed-stats');
      if (res.ok) {
        const data = await res.json();
        return data as DetailedAnalyticsReport;
      }
    } catch (err) {
      console.warn('[Analytics] Failed to fetch detailed stats:', err);
    }
    return null;
  }

  /**
   * Đồng bộ danh sách bài viết hiện tại lên máy chủ
   */
  public static async syncArticlesBaseline(articles: Array<{ id: string; views?: number; title?: string; category?: string }>): Promise<void> {
    try {
      await fetch('/api/analytics/sync-article-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles }),
      });
    } catch {
      // ignore
    }
  }

  /**
   * Tải số liệu từ cache bộ nhớ máy
   */
  private static loadFromCache(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CACHE);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached.stats) {
          this.currentStats = { ...this.currentStats, ...cached.stats };
        }
        if (cached.onlineCount) {
          this.currentOnlineCount = cached.onlineCount;
        }
      }
    } catch {
      // ignore
    }
  }

  /**
   * Lưu số liệu vào cache cục bộ
   */
  private static saveToCache(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY_CACHE,
        JSON.stringify({
          stats: this.currentStats,
          onlineCount: this.currentOnlineCount,
          updatedAt: Date.now(),
        })
      );
    } catch {
      // ignore
    }
  }

  public static getOnlineCount(): number {
    return this.currentOnlineCount;
  }

  public static getStats(): VisitorStats {
    return this.currentStats;
  }

  public static subscribeOnlineCount(callback: (count: number) => void): () => void {
    this.listeners.push(callback);
    callback(this.getOnlineCount());

    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public static subscribeStats(callback: (stats: VisitorStats) => void): () => void {
    this.statsListeners.push(callback);
    callback(this.getStats());

    return () => {
      this.statsListeners = this.statsListeners.filter((cb) => cb !== callback);
    };
  }

  private static notifyOnlineCount(): void {
    const count = this.getOnlineCount();
    this.listeners.forEach((cb) => {
      try {
        cb(count);
      } catch {}
    });
  }

  private static notifyStats(): void {
    const stats = this.getStats();
    this.statsListeners.forEach((cb) => {
      try {
        cb(stats);
      } catch {}
    });
  }
}
