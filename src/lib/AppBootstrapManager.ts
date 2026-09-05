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

  constructor() {}

  subscribe(listener: (state: BootstrapState) => void) {
    this.listeners.push(listener);
    listener(this.state);
  }

  private setState(newState: Partial<BootstrapState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(l => l(this.state));
  }

  async runBootstrap() {
    this.setState({ status: 'loading', progress: 0, currentTask: 'Bắt đầu khởi động...' });

    try {
      // Define Tasks
      const tasks = [
        { name: 'Khởi tạo cấu hình', action: this.loadConfig.bind(this), weight: 10 },
        { name: 'Khôi phục phiên làm việc', action: this.restoreSession.bind(this), weight: 10 },
        { name: 'Tải dữ liệu trang chủ', action: this.loadHomepageData.bind(this), weight: 30 },
        { name: 'Chuẩn bị ảnh quan trọng', action: this.preloadCriticalImages.bind(this), weight: 20 },
        { name: 'Kiểm tra Font & UI', action: this.waitForFonts.bind(this), weight: 10 },
        { name: 'Đồng bộ Cache hệ thống', action: this.initializeCache.bind(this), weight: 20 },
      ];

      let completedWeight = 0;
      const totalWeight = tasks.reduce((sum, t) => sum + t.weight, 0);

      for (const task of tasks) {
        this.setState({ currentTask: task.name });
        await task.action();
        completedWeight += task.weight;
        this.setState({ progress: Math.floor((completedWeight / totalWeight) * 100) });
      }

      this.setState({ status: 'ready', ready: true, currentTask: 'Hệ thống sẵn sàng!' });
    } catch (error) {
      console.error('Bootstrap error:', error);
      this.setState({ status: 'error', error: 'Không thể tải dữ liệu.' });
    }
  }

  private async loadConfig() {
    // Simulate real config loading
    await new Promise(resolve => setTimeout(resolve, 500)); 
  }

  private async restoreSession() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, () => {
        resolve(true);
      });
    });
  }

  private async loadHomepageData() {
    // Replace with real data fetch
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  private async preloadCriticalImages() {
    // Real image decoding
    const imageUrls = [
      'https://www.mattrancantho.vn/files/images/Logo%20-%20Icon/Logo%20MTTQ.png'
    ];
    await Promise.all(imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
      });
    }));
  }

  private async waitForFonts() {
    if ('fonts' in document) {
      await (document as any).fonts.ready;
    }
  }

  private async initializeCache() {
    // Check if cache needs clearing/initializing
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const bootstrapManager = new AppBootstrapManager();
