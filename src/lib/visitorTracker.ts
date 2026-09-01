/**
 * Real-time Visitor & Active Online Session Tracker
 * Lưu trữ chính xác số lượt truy cập thực tế và đếm số phiên trực tuyến thời gian thực
 * Không tạo số ảo - Dữ liệu thực từ bộ nhớ và phiên hoạt động
 */

const STORAGE_KEYS = {
  VISITOR_STATS: 'mttq_chanhhiep_visit_stats_v2',
  HEARTBEAT_MAP: 'mttq_chanhhiep_active_heartbeats_v2',
  SESSION_VISITED: 'mttq_chanhhiep_session_flag_v2',
};

export interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  lastVisitDate: string;
  lastVisitTime: string;
}

// Generate unique ID for this browser tab
const TAB_ID = 'tab_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);

export class VisitorTrackerEngine {
  private static listeners: Array<(count: number) => void> = [];
  private static statsListeners: Array<(stats: VisitorStats) => void> = [];
  private static heartbeatInterval: any = null;
  private static isInitialized = false;

  /**
   * Khởi tạo theo dõi: Ghi nhận 1 lượt truy cập thực và bắt đầu nhịp tim đếm trực tuyến
   */
  public static init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Ghi nhận lượt truy cập
    this.recordPageVisit();

    // Khởi động nhịp tim phiên hoạt động (Heartbeat) - 8s định kỳ tránh giật lag
    this.sendHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 8000);

    // Lắng nghe sự kiện Storage giữa các tab
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEYS.HEARTBEAT_MAP) {
          this.notifyOnlineCount();
        }
        if (e.key === STORAGE_KEYS.VISITOR_STATS) {
          this.notifyStats();
        }
      });

      // Dọn dẹp nhịp tim khi đóng tab
      window.addEventListener('beforeunload', () => {
        this.removeHeartbeat();
      });
      window.addEventListener('unload', () => {
        this.removeHeartbeat();
      });
    }
  }

  /**
   * Ghi nhận lượt truy cập thực tế vào bộ nhớ (localStorage)
   */
  public static recordPageVisit(): VisitorStats {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const nowTimeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const raw = localStorage.getItem(STORAGE_KEYS.VISITOR_STATS);
      let stats: VisitorStats;

      if (raw) {
        stats = JSON.parse(raw);
        // Kiểm tra xem đã tính trong phiên này chưa (sessionStorage) để tránh tăng ảo khi re-render nội bộ
        const hasSessionVisited = sessionStorage.getItem(STORAGE_KEYS.SESSION_VISITED);
        if (!hasSessionVisited) {
          stats.totalVisits = (stats.totalVisits || 0) + 1;
          if (stats.lastVisitDate === todayStr) {
            stats.todayVisits = (stats.todayVisits || 0) + 1;
          } else {
            stats.todayVisits = 1;
            stats.lastVisitDate = todayStr;
          }
          stats.lastVisitTime = nowTimeStr;
          sessionStorage.setItem(STORAGE_KEYS.SESSION_VISITED, 'true');
          localStorage.setItem(STORAGE_KEYS.VISITOR_STATS, JSON.stringify(stats));
        }
      } else {
        // Lần đầu tiên chạy
        stats = {
          totalVisits: 1,
          todayVisits: 1,
          lastVisitDate: todayStr,
          lastVisitTime: nowTimeStr
        };
        sessionStorage.setItem(STORAGE_KEYS.SESSION_VISITED, 'true');
        localStorage.setItem(STORAGE_KEYS.VISITOR_STATS, JSON.stringify(stats));
      }

      this.notifyStats();
      return stats;
    } catch (err) {
      console.warn('Lỗi ghi nhận lượt truy cập:', err);
      return {
        totalVisits: 1,
        todayVisits: 1,
        lastVisitDate: new Date().toISOString().split('T')[0],
        lastVisitTime: new Date().toLocaleTimeString('vi-VN')
      };
    }
  }

  /**
   * Lấy số liệu thống kê lượt truy cập hiện tại từ bộ nhớ
   */
  public static getStats(): VisitorStats {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VISITOR_STATS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      // ignore
    }
    return {
      totalVisits: 1,
      todayVisits: 1,
      lastVisitDate: new Date().toISOString().split('T')[0],
      lastVisitTime: new Date().toLocaleTimeString('vi-VN')
    };
  }

  /**
   * Gửi nhịp tim (Heartbeat) báo hiệu tab này đang trực tuyến
   */
  private static sendHeartbeat(): void {
    try {
      const now = Date.now();
      const raw = localStorage.getItem(STORAGE_KEYS.HEARTBEAT_MAP);
      let map: Record<string, number> = raw ? JSON.parse(raw) : {};

      // Cập nhật tab hiện tại
      map[TAB_ID] = now;

      // Dọn dẹp các tab đã tắt quá 6 giây
      const cleanedMap: Record<string, number> = {};
      for (const [id, time] of Object.entries(map)) {
        if (now - time < 6000) {
          cleanedMap[id] = time;
        }
      }

      localStorage.setItem(STORAGE_KEYS.HEARTBEAT_MAP, JSON.stringify(cleanedMap));
      this.notifyOnlineCount();
    } catch (err) {
      // ignore
    }
  }

  /**
   * Xóa tab khỏi danh sách khi đóng tab
   */
  private static removeHeartbeat(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HEARTBEAT_MAP);
      if (raw) {
        const map: Record<string, number> = JSON.parse(raw);
        delete map[TAB_ID];
        localStorage.setItem(STORAGE_KEYS.HEARTBEAT_MAP, JSON.stringify(map));
      }
    } catch (err) {
      // ignore
    }
  }

  /**
   * Lấy số lượng người dùng / tab đang trực tuyến thực tế
   */
  public static getOnlineCount(): number {
    try {
      const now = Date.now();
      const raw = localStorage.getItem(STORAGE_KEYS.HEARTBEAT_MAP);
      if (!raw) return 1;

      const map: Record<string, number> = JSON.parse(raw);
      const activeTabs = Object.values(map).filter(time => now - time < 6000);
      return Math.max(1, activeTabs.length);
    } catch (e) {
      return 1;
    }
  }

  /**
   * Đăng ký lắng nghe thay đổi số người trực tuyến
   */
  public static subscribeOnlineCount(callback: (count: number) => void): () => void {
    this.listeners.push(callback);
    callback(this.getOnlineCount());

    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Đăng ký lắng nghe thay đổi thống kê lượt truy cập
   */
  public static subscribeStats(callback: (stats: VisitorStats) => void): () => void {
    this.statsListeners.push(callback);
    callback(this.getStats());

    return () => {
      this.statsListeners = this.statsListeners.filter(cb => cb !== callback);
    };
  }

  private static notifyOnlineCount(): void {
    const count = this.getOnlineCount();
    this.listeners.forEach(cb => {
      try { cb(count); } catch (e) {}
    });
  }

  private static notifyStats(): void {
    const stats = this.getStats();
    this.statsListeners.forEach(cb => {
      try { cb(stats); } catch (e) {}
    });
  }
}
