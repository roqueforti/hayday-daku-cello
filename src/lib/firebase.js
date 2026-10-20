import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB2vKWEt55J6A5mBJaCyI3eB70tvXkkQnk",
  authDomain: "dakucello.firebaseapp.com",
  projectId: "dakucello",
  storageBucket: "dakucello.firebasestorage.app",
  messagingSenderId: "395549212760",
  appId: "1:395549212760:web:5b7374880a31023862ca2d",
  measurementId: "G-103C816WWQ"
};

let app = null;
let firestore = null;

export function getFirebaseApp() {
  if (typeof window === 'undefined') return null;
  if (!getApps().length) {
    app = initializeApp(FIREBASE_CONFIG);
  } else {
    app = getApps()[0];
  }
  return app;
}

export function getFirestoreDb() {
  if (firestore) return firestore;
  const firebaseApp = getFirebaseApp();
  if (firebaseApp) {
    try {
      firestore = getFirestore(firebaseApp);
    } catch (e) {
      console.warn("Firestore initialization error:", e);
    }
  }
  return firestore;
}
