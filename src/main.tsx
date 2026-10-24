import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary.tsx';
import './index.css';

// 1. Safe in-memory storage fallback for sandboxed iframes where localStorage access is restricted
if (typeof window !== 'undefined') {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
  } catch {
    console.warn('[Storage] Native localStorage access restricted in iframe sandbox. Using memory fallback.');
    const memStore: Record<string, string> = {};
    const dummyStorage: Storage = {
      length: 0,
      clear: () => { Object.keys(memStore).forEach(k => delete memStore[k]); },
      getItem: (key: string) => (key in memStore ? memStore[key] : null),
      setItem: (key: string, value: string) => { memStore[key] = String(value); },
      removeItem: (key: string) => { delete memStore[key]; },
      key: (index: number) => Object.keys(memStore)[index] || null,
    };
    try {
      Object.defineProperty(window, 'localStorage', { value: dummyStorage, configurable: true, writable: true });
    } catch {}
  }

  // 2. Global diagnostics listener with safe unhandled rejection handling
  window.addEventListener('error', (event) => {
    console.warn('[Global Uncaught Error Handled]:', event.error || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason) {
      console.warn('[Global Unhandled Rejection Handled]:', event.reason);
    }
    // Prevent unhandled rejection from bubbling as fatal crash
    event.preventDefault();
  });
}

// 3. Mount React application safely with instant fallback handling
try {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element #root not found in document');
  }

  const root = createRoot(rootElement);
  root.render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>,
  );
} catch (mountErr: any) {
  console.error('[Mount Fatal Error]:', mountErr);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #fff; font-family: sans-serif; padding: 24px; text-align: center;">
        <div style="max-width: 480px; background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
          <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(239, 68, 68, 0.2); color: #f87171; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 28px;">⚠️</div>
          <h2 style="font-size: 18px; font-weight: 800; margin: 0 0 8px 0; color: #f8fafc;">Đã Xảy Ra Sự Cố Khởi Động</h2>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 20px 0;">Hệ thống phát hiện lỗi bộ nhớ đệm hoặc xung đột phiên làm việc. Vui lòng bấm nút bên dưới để khôi phục:</p>
          <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();" style="background: #2563eb; color: #fff; border: none; padding: 12px 24px; font-size: 14px; font-weight: 700; border-radius: 12px; cursor: pointer;">
            Xóa bộ nhớ đệm &amp; Tải lại trang
          </button>
        </div>
      </div>
    `;
  }
}

// 4. Safe Service Worker management:
// Proactively unregister any active service worker in development, preview, and iframe environments
// to prevent workbox precache from intercepting new Vite assets.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const isInIframe = window.self !== window.top;
  const isLocalOrPreview = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' || 
                           window.location.hostname.includes('.run.app') ||
                           window.location.hostname.includes('web.app') ||
                           isInIframe ||
                           import.meta.env.DEV;

  if (isLocalOrPreview) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    }).catch(() => {});

    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          if (key.includes('workbox') || key.includes('pwa')) {
            caches.delete(key).catch(() => {});
          }
        }
      }).catch(() => {});
    }
  }
}


