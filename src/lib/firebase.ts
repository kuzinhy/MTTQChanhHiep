import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore instance with long-polling auto-detection & offline persistence for web sandboxes
let firestoreDb: Firestore;
const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

if (isInIframe) {
  // Use memory local cache inside sandboxed iframes to prevent write queue exhaustion across reloads
  try {
    firestoreDb = initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true,
      localCache: memoryLocalCache()
    }, (firebaseConfig as any).firestoreDatabaseId || undefined);
  } catch {
    firestoreDb = (firebaseConfig as any).firestoreDatabaseId
      ? getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId)
      : getFirestore(firebaseApp);
  }
} else {
  try {
    firestoreDb = initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true,
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    }, (firebaseConfig as any).firestoreDatabaseId || undefined);
  } catch {
    try {
      firestoreDb = initializeFirestore(firebaseApp, {
        experimentalAutoDetectLongPolling: true
      }, (firebaseConfig as any).firestoreDatabaseId || undefined);
    } catch {
      firestoreDb = (firebaseConfig as any).firestoreDatabaseId
        ? getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId)
        : getFirestore(firebaseApp);
    }
  }
}

export const db: Firestore = firestoreDb;

// Initialize Firebase Auth
export const auth: Auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Analytics safely (client-side only)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  }).catch((err) => {
    console.warn('Firebase Analytics not supported in this environment:', err);
  });
}

export { firebaseConfig };
