import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore instance
export const db: Firestore = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(firebaseApp);

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
