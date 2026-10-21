import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getFirestoreDb } from '../lib/firebase';
import { Category } from '../models/Category';
import { DEFAULT_WA, DEFAULT_THX, DEFAULT_SECTIONS } from '../lib/constants';

const LOCAL_STORAGE_KEY = 'hayday_daku_cello_data';

export class StoreRepository {
  constructor() {
    this.storageKey = LOCAL_STORAGE_KEY;
  }

  // Load dari localStorage (fallback ke default jika kosong)
  loadLocal() {
    if (typeof window === 'undefined') {
      return this.createDefaultStoreState();
    }
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        return this.parseStoreData(parsed);
      }
    } catch (e) {
      console.warn("Failed reading localStorage:", e);
    }
    return this.createDefaultStoreState();
  }

  // Save ke localStorage
  saveLocal(storeState) {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        wa: storeState.wa || DEFAULT_WA,
        thx: storeState.thx || DEFAULT_THX,
        sections: storeState.sections.map(s => s.toLegacy())
      };
      localStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch (e) {
      console.error("Failed saving to localStorage:", e);
      throw e;
    }
  }

  // Simpan ke Firebase Firestore Cloud
  async saveToCloud(storeState) {
    const payload = {
      wa: storeState.wa || DEFAULT_WA,
      thx: storeState.thx || DEFAULT_THX,
      sections: storeState.sections.map(s => s.toLegacy()),
      updatedAt: serverTimestamp()
    };

    // Selalu simpan lokal terlebih dahulu agar offline/fallback selalu up-to-date
    this.saveLocal(storeState);

    const db = getFirestoreDb();
    if (!db) {
      console.warn("Firestore db tidak tersedia, data disimpan ke localStorage saja.");
      return { success: true, cloud: false };
    }

    try {
      const storeRef = doc(db, 'settings', 'store');
      await setDoc(storeRef, payload, { merge: true });
      return { success: true, cloud: true };
    } catch (err) {
      console.error("Firestore save error:", err);
      throw err;
    }
  }

  // Subscribe ke update Firestore secara realtime
  subscribeCloud(onUpdate) {
    const db = getFirestoreDb();
    if (!db) return () => {};

    try {
      const storeRef = doc(db, 'settings', 'store');
      return onSnapshot(storeRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.sections) {
            const parsed = this.parseStoreData(data);
            try {
              localStorage.setItem(this.storageKey, JSON.stringify(data));
            } catch (e) {}
            onUpdate(parsed);
          }
        }
      }, (err) => {
        console.warn("Firestore subscription error:", err);
      });
    } catch (e) {
      console.warn("subscribeCloud error:", e);
      return () => {};
    }
  }

  // Helper untuk parsing object json ke model Category OOP
  parseStoreData(data) {
    const wa = data.wa || DEFAULT_WA;
    const thx = data.thx || DEFAULT_THX;
    const rawSections = Array.isArray(data.sections) ? data.sections : DEFAULT_SECTIONS;
    const sections = rawSections.map(secData => new Category(secData));
    return { wa, thx, sections };
  }

  createDefaultStoreState() {
    return {
      wa: DEFAULT_WA,
      thx: DEFAULT_THX,
      sections: DEFAULT_SECTIONS.map(s => new Category(s))
    };
  }
}

export const storeRepository = new StoreRepository();
