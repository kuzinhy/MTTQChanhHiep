import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore instance with safe memory cache fallback
let firestoreDb: Firestore;
const targetDbId = (firebaseConfig as any).firestoreDatabaseId || undefined;

try {
  // If Firestore is already initialized, get the existing instance
  firestoreDb = targetDbId ? getFirestore(firebaseApp, targetDbId) : getFirestore(firebaseApp);
} catch {
  try {
    firestoreDb = initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true,
      localCache: memoryLocalCache()
    }, targetDbId);
  } catch {
    try {
      firestoreDb = targetDbId ? getFirestore(firebaseApp, targetDbId) : getFirestore(firebaseApp);
    } catch (finalErr) {
      console.warn('[Firebase] Firestore fallback initialization warning:', finalErr);
      firestoreDb = getFirestore(firebaseApp);
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
