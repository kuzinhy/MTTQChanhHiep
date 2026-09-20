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

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in document');
}

// 3. Mount React application
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);

// 4. Safe Service Worker management:
// In dev or preview iframe: Unregister any service worker that intercepts Vite requests
// In standalone production: Lazily register service worker on window load
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const isInIframe = window.self !== window.top;
  if (import.meta.env.DEV || isInIframe) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    }).catch(() => {});
  } else {
    window.addEventListener('load', () => {
      import('virtual:pwa-register')
        .then(({ registerSW }) => {
          registerSW({
            immediate: false,
            onNeedRefresh() {
              console.log('[PWA SW] New content available, updating automatically...');
            },
            onOfflineReady() {
              console.log('[PWA SW] App is ready to work offline.');
            },
            onRegisterError(error) {
              console.warn('[PWA SW] Registration failed:', error);
            },
          });
        })
        .catch((err) => {
          console.warn('[PWA SW] Service worker module unavailable:', err);
        });
    });
  }
}


