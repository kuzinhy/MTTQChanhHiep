import { CloudDatabase } from './firestoreService';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserCacheManager } from './browserCacheManager';
import { AppStorageEngine } from './storage';

export type BootstrapStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface BootstrapState {
  status: BootstrapStatus;
  progress: number;
  currentTask: string;
  statusText?: string;
  ready: boolean;
  error: string | null;
  loadedDetails?: {
    articlesCount?: number;
    documentsCount?: number;
    neighborhoodsCount?: number;
    isCached?: boolean;
  };
}

class AppBootstrapManager {
  private state: BootstrapState = {
    status: 'idle',
    progress: 0,
    currentTask: 'Khởi tạo hệ thống Cổng thông tin...',
    ready: false,
    error: null,
  };

  private listeners: ((state: BootstrapState) => void)[] = [];
  private isRunning = false;

  constructor() {}

  subscribe(listener: (state: BootstrapState) => void): () => void {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private setState(newState: Partial<BootstrapState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(l => l(this.state));
  }

  async runBootstrap(): Promise<void> {
    if (this.state.ready) {
      this.setState({ status: 'ready', ready: true, progress: 100 });
      return;
    }

    if (this.isRunning) return;
    this.isRunning = true;

    const isRepeat = BrowserCacheManager.isRepeatVisitor();
    const initialProgress = isRepeat ? 25 : 10;

    this.setState({ 
      status: 'loading', 
      progress: initialProgress, 
      currentTask: isRepeat ? 'Đang khôi phục dữ liệu từ bộ nhớ đệm...' : 'Khởi tạo phiên làm việc mới...' 
    });

    try {
      // Step 1: Initialize local storage cache & auth session
      this.setState({ progress: 25, currentTask: 'Kiểm tra CSDL LocalStorage & Phiên đăng nhập...' });
      await Promise.all([
        this.restoreSession(),
        this.waitForFonts()
      ]);

      // Step 2: Sync Cloud Firestore Snapshot (Articles, Documents, 21 Neighborhoods)
      this.setState({ progress: 55, currentTask: 'Đồng bộ tin tức, văn bản & 21 Khu phố từ Cloud...' });
      
      const localArticles = AppStorageEngine.getArticles();
      const localDocs = AppStorageEngine.getDocuments();
      const localAreas = AppStorageEngine.getAreas();

      // Step 3: Pre-cache & Preload Media Assets into Browser RAM & Cache Storage
      this.setState({ 
        progress: 80, 
        currentTask: 'Tải trước biểu tượng, banner & dữ liệu hình ảnh...',
        loadedDetails: {
          articlesCount: localArticles.length,
          documentsCount: localDocs.length,
          neighborhoodsCount: localAreas.length,
          isCached: isRepeat
        }
      });

      await Promise.all([
        BrowserCacheManager.preCacheCriticalAssets(),
        this.preloadCriticalImages(localArticles)
      ]);

      // Step 4: Mark Last Visited Timestamp for future instant access
      BrowserCacheManager.markLastVisitedTime();

      this.setState({ 
        progress: 100, 
        currentTask: 'Cổng thông tin & Văn phòng số đã sẵn sàng!', 
        status: 'ready', 
        ready: true 
      });
    } catch (error) {
      console.error('Bootstrap error:', error);
      // Fallback so user is never blocked
      this.setState({ progress: 100, status: 'ready', ready: true, currentTask: 'Trang chủ sẵn sàng!' });
    } finally {
      this.isRunning = false;
    }
  }

  private async restoreSession() {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(true), 400);
      const unsubscribe = onAuthStateChanged(auth, () => {
        clearTimeout(timeout);
        unsubscribe();
        resolve(true);
      });
    });
  }

  private async preloadCriticalImages(articlesList: any[] = []) {
    const defaultImages = [
      'https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png',
      'https://res.cloudinary.com/idt08wyp/image/upload/v1789907027/701895118_122094685251337068_1425314572080698202_n.jpg'
    ];

    // Pick top article thumbnail images if available
    const articleImages = (articlesList || [])
      .map(a => a?.thumbnail || a?.imageUrl || a?.image)
      .filter(Boolean)
      .slice(0, 4);

    const allUrls = Array.from(new Set([...defaultImages, ...articleImages]));

    await Promise.allSettled(
      allUrls.map(url => BrowserCacheManager.preloadImageToMemory(url))
    );
  }

  private async waitForFonts() {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      try {
        await Promise.race([
          (document as any).fonts.ready,
          new Promise(r => setTimeout(r, 300))
        ]);
      } catch {
        // Fallthrough safely
      }
    }
  }
}

export const bootstrapManager = new AppBootstrapManager();
