import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register PWA service worker with full lifecycle handling
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA SW] New content available, updating automatically...');
  },
  onOfflineReady() {
    console.log('[PWA SW] App is ready to work offline.');
  },
  onRegistered(r) {
    if (r) {
      // Periodically check for SW updates every hour
      setInterval(() => {
        r.update().catch((err) => console.error('[PWA SW] Update check failed', err));
      }, 60 * 60 * 1000);
    }
  },
  onRegisterError(error) {
    console.error('[PWA SW] Registration failed:', error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
