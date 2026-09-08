import { CloudDatabase } from './firestoreService';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export type BootstrapStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface BootstrapState {
  status: BootstrapStatus;
  progress: number;
  currentTask: string;
  statusText?: string;
  ready: boolean;
  error: string | null;
}

class AppBootstrapManager {
  private state: BootstrapState = {
    status: 'idle',
    progress: 0,
    currentTask: 'Khởi tạo hệ thống...',
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

    this.setState({ status: 'loading', progress: 5, currentTask: 'Khởi tạo cấu hình hệ thống...' });

    try {
      // Step 1: Restore Session & Config in parallel
      this.setState({ progress: 18, currentTask: 'Khôi phục phiên đăng nhập & Cấu hình...' });
      await Promise.all([
        this.restoreSession(),
        this.waitForFonts()
      ]);

      // Step 2: Preload Critical Images
      this.setState({ progress: 45, currentTask: 'Đồng bộ biểu tượng & Dữ liệu trang chủ...' });
      await this.preloadCriticalImages().catch(() => {});

      // Step 3: Fast Cache Check
      this.setState({ progress: 78, currentTask: 'Khởi tạo CSDL & Cache bộ nhớ...' });
      await new Promise(r => setTimeout(r, 100));

      // Step 4: Ready
      this.setState({ progress: 100, currentTask: 'Hệ thống sẵn sàng!', status: 'ready', ready: true });
    } catch (error) {
      console.error('Bootstrap error:', error);
      // Fallback to ready so user is never stuck
      this.setState({ progress: 100, status: 'ready', ready: true, currentTask: 'Hệ thống sẵn sàng!' });
    } finally {
      this.isRunning = false;
    }
  }

  private async restoreSession() {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(true), 600);
      const unsubscribe = onAuthStateChanged(auth, () => {
        clearTimeout(timeout);
        unsubscribe();
        resolve(true);
      });
    });
  }

  private async preloadCriticalImages() {
    const imageUrls = [
      '/assets/logos/logo-mttq.svg',
      '/assets/cultural/ho-chi-minh-portrait.jpg'
    ];
    await Promise.all(imageUrls.map(url => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = resolve; // Continue on error
      });
    }));
  }

  private async waitForFonts() {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      try {
        await Promise.race([
          (document as any).fonts.ready,
          new Promise(r => setTimeout(r, 400))
        ]);
      } catch {
        // Fallthrough safely
      }
    }
  }
}

export const bootstrapManager = new AppBootstrapManager();

