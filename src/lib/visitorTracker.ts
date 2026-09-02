import {
  incrementVisitorCount,
  updateActiveVisitorPresence,
  removeActiveVisitorPresence,
  subscribeToFirebaseAnalytics
} from './firebaseAnalytics';

export interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  monthVisits: number;
  lastVisitDate: string;
  lastVisitTime: string;
  serverTime?: string;
  hourlyTraffic?: Record<string, number>;
}

// Unique session identifier for this tab/window session
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server_session';
  let sid = sessionStorage.getItem('mttq_chanhhiep_analytics_sid');
  if (!sid) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem('mttq_chanhhiep_analytics_sid', sid);
  }
  return sid;
};

// Local storage fallback key
const STORAGE_KEY_CACHE = 'mttq_chanhhiep_visitor_stats_cache_v4';

export class VisitorTrackerEngine {
  private static listeners: Array<(count: number) => void> = [];
  private static statsListeners: Array<(stats: VisitorStats) => void> = [];
  private static heartbeatInterval: any = null;
  private static firebaseUnsub: (() => void) | null = null;
  private static isInitialized = false;

  private static currentOnlineCount = 1;
  private static currentStats: VisitorStats = {
    totalVisits: 1,
    todayVisits: 1,
    monthVisits: 1,
    lastVisitDate: new Date().toISOString().split('T')[0],
    lastVisitTime: new Date().toLocaleTimeString('vi-VN'),
  };

  /**
   * Khởi tạo máy đếm: Cập nhật Firebase Firestore & Bắt đầu nhịp tim Timestamp 30s
   */
  public static init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Load cached stats from localStorage if available for immediate UI rendering
    this.loadFromCache();

    const sessionId = getSessionId();

    // Check if this is a brand new session visit
    const isRecordedInSession = sessionStorage.getItem('mttq_chanhhiep_analytics_visit_recorded');
    const isNewSession = !isRecordedInSession;

    if (isNewSession) {
      sessionStorage.setItem('mttq_chanhhiep_analytics_visit_recorded', 'true');
      // Tăng lượt truy cập trong Firebase collection 'analytics_stats'
      incrementVisitorCount().then((fbStats) => {
        if (fbStats) {
          this.currentStats = {
            ...this.currentStats,
            totalVisits: fbStats.totalVisits,
            todayVisits: fbStats.todayVisits,
            monthVisits: fbStats.monthVisits,
            lastVisitDate: fbStats.lastDate,
          };
          this.notifyStats();
        }
      });
    }

    // Cập nhật 'active_visitors' Firestore ngay lập tức
    updateActiveVisitorPresence(sessionId);

    // Chu kỳ 30 giây: Cập nhật timestamp 'active_visitors' theo đúng yêu cầu
    this.heartbeatInterval = setInterval(() => {
      updateActiveVisitorPresence(sessionId);
      this.sendHeartbeatToExpressServer();
    }, 30000); // 30s timestamp update

    // Đăng ký nhận thông tin Real-time Snapshot từ Firebase Firestore
    this.firebaseUnsub = subscribeToFirebaseAnalytics(
      (fbStats) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const nowTimeStr = new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        this.currentStats = {
          totalVisits: fbStats.totalVisits || this.currentStats.totalVisits,
          todayVisits: fbStats.todayVisits || this.currentStats.todayVisits,
          monthVisits: fbStats.monthVisits || this.currentStats.monthVisits,
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

    // Đồng bộ thêm với Express Backend server
    this.sendVisitToExpressServer(isNewSession);

    // Event handlers khi rời trang / thay đổi tab
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        removeActiveVisitorPresence(sessionId);
        this.sendUnloadToExpressServer();
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          updateActiveVisitorPresence(sessionId);
        }
      });
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
          this.currentStats = cached.stats;
        }
        if (cached.onlineCount) {
          this.currentOnlineCount = cached.onlineCount;
        }
      }
    } catch (e) {
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
    } catch (e) {
      // ignore
    }
  }

  private static async sendVisitToExpressServer(isNewSession: boolean): Promise<void> {
    try {
      await fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          isNewSession,
          currentPage: window.location.pathname || 'HOME',
        }),
      });
    } catch (err) {
      // ignore fallback
    }
  }

  private static async sendHeartbeatToExpressServer(): Promise<void> {
    try {
      await fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          currentPage: window.location.pathname || 'HOME',
        }),
      });
    } catch (err) {
      // ignore fallback
    }
  }

  private static sendUnloadToExpressServer(): void {
    try {
      const payload = JSON.stringify({ sessionId: getSessionId() });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/heartbeat', payload);
      }
    } catch (e) {
      // ignore
    }
  }

  /**
   * Lấy số người đang online thời gian thực
   */
  public static getOnlineCount(): number {
    return this.currentOnlineCount;
  }

  /**
   * Lấy thống kê lượt truy cập
   */
  public static getStats(): VisitorStats {
    return this.currentStats;
  }

  /**
   * Đăng ký lắng nghe thay đổi số người trực tuyến
   */
  public static subscribeOnlineCount(callback: (count: number) => void): () => void {
    this.listeners.push(callback);
    callback(this.getOnlineCount());

    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Đăng ký lắng nghe thay đổi thống kê lượt truy cập
   */
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
      } catch (e) {}
    });
  }

  private static notifyStats(): void {
    const stats = this.getStats();
    this.statsListeners.forEach((cb) => {
      try {
        cb(stats);
      } catch (e) {}
    });
  }
}
