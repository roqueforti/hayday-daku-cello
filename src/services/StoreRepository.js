import { Category } from '../models/Category';
import {
  DEFAULT_WA,
  DEFAULT_THX,
  DEFAULT_QRIS,
  DEFAULT_GAS_URL,
  DEFAULT_SECTIONS
} from '../lib/constants';

const LOCAL_STORAGE_KEY = 'hayday_daku_cello_data';
const GAS_URL_STORAGE_KEY = 'hayday_gas_url';

export class StoreRepository {
  constructor() {
    this.storageKey = LOCAL_STORAGE_KEY;
    this.gasUrlKey = GAS_URL_STORAGE_KEY;
    this.cachedGasUrl = null;
  }

  // Mendapatkan URL Google Apps Script Web App
  getGasUrl() {
    if (typeof window === 'undefined') return DEFAULT_GAS_URL || '';
    if (this.cachedGasUrl) return this.cachedGasUrl;
    try {
      const stored = localStorage.getItem(this.gasUrlKey);
      if (stored && stored.trim()) {
        this.cachedGasUrl = stored.trim();
        return this.cachedGasUrl;
      }
    } catch (e) {}
    return DEFAULT_GAS_URL || '';
  }

  // Menyimpan URL Google Apps Script ke storage lokal
  setGasUrl(url) {
    const clean = (url || '').trim();
    this.cachedGasUrl = clean;
    if (typeof window !== 'undefined') {
      try {
        if (clean) {
          localStorage.setItem(this.gasUrlKey, clean);
        } else {
          localStorage.removeItem(this.gasUrlKey);
        }
      } catch (e) {}
    }
  }

  // Load data dari localStorage (fallback ke default jika kosong)
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
      console.warn("Gagal membaca localStorage:", e);
    }
    return this.createDefaultStoreState();
  }

  // Simpan data ke localStorage
  saveLocal(storeState) {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        wa: storeState.wa || DEFAULT_WA,
        thx: storeState.thx || DEFAULT_THX,
        qris: storeState.qris || DEFAULT_QRIS,
        gasUrl: storeState.gasUrl || this.getGasUrl(),
        sections: (storeState.sections || []).map(s => s.toLegacy ? s.toLegacy() : s),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage:", e);
      throw e;
    }
  }

  // Simpan data ke Google Apps Script (Google Sheets Cloud)
  async saveToCloud(storeState) {
    // 1. Selalu simpan lokal terlebih dahulu agar responsif dan aman offline
    this.saveLocal(storeState);

    const gasUrl = (storeState.gasUrl || this.getGasUrl()).trim();
    if (!gasUrl) {
      console.warn("URL Google Apps Script belum disetel. Data hanya disimpan di localStorage.");
      return { success: true, cloud: false, message: "Tersimpan lokal (URL Google Sheets belum disetel)" };
    }

    const payload = {
      wa: storeState.wa || DEFAULT_WA,
      thx: storeState.thx || DEFAULT_THX,
      qris: storeState.qris || DEFAULT_QRIS,
      sections: (storeState.sections || []).map(s => s.toLegacy ? s.toLegacy() : s),
      updatedAt: new Date().toISOString()
    };

    try {
      // Menggunakan text/plain agar browser tidak mengirim preflight OPTIONS yang ditolak Google Apps Script
      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Gagal menyimpan ke Google Apps Script`);
      }

      const resData = await res.json().catch(() => ({ success: true }));
      return { success: true, cloud: true, data: resData };
    } catch (err) {
      console.error("Gagal saveToCloud via Google Apps Script:", err);
      throw err;
    }
  }

  // Ambil data terbaru dari Google Sheets via Apps Script Web App
  async fetchCloud() {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) return null;

    try {
      const sep = gasUrl.includes('?') ? '&' : '?';
      const url = `${gasUrl}${sep}t=${Date.now()}`;
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store'
      });

      if (!res.ok) {
        console.warn(`fetchCloud HTTP error ${res.status}`);
        return null;
      }

      const data = await res.json();
      if (data && Array.isArray(data.sections)) {
        // Cache data baru ke localStorage
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {}
        return this.parseStoreData(data);
      }
    } catch (e) {
      console.warn("fetchCloud error via Google Apps Script:", e);
    }
    return null;
  }

  // Subscribe ke update Google Sheets secara smart polling & focus listener
  subscribeCloud(onUpdate) {
    if (typeof window === 'undefined') return () => {};

    let lastHash = '';
    const checkForUpdates = async () => {
      try {
        const cloudData = await this.fetchCloud();
        if (cloudData) {
          const currentHash = JSON.stringify({
            wa: cloudData.wa,
            thx: cloudData.thx,
            qris: cloudData.qris,
            sectionsCount: cloudData.sections?.length,
            itemsCount: cloudData.sections?.reduce((acc, s) => acc + (s.items?.length || 0), 0)
          });
          if (currentHash !== lastHash) {
            lastHash = currentHash;
            onUpdate(cloudData);
          }
        }
      } catch (e) {}
    };

    // Polling periodik tiap 45 detik
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    }, 45000);

    // Cek update saat tab browser kembali aktif
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearInterval(timer);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }

  // Menguji koneksi URL Google Apps Script Web App
  async testConnection(url) {
    const targetUrl = (url || this.getGasUrl()).trim();
    if (!targetUrl) {
      return { success: false, error: "URL Google Apps Script tidak boleh kosong." };
    }

    try {
      const sep = targetUrl.includes('?') ? '&' : '?';
      const pingUrl = `${targetUrl}${sep}action=ping&t=${Date.now()}`;
      const res = await fetch(pingUrl, {
        method: 'GET',
        cache: 'no-store'
      });

      if (!res.ok) {
        return { success: false, error: `Server merespons kode HTTP ${res.status}` };
      }

      const data = await res.json();
      return {
        success: true,
        message: data.message || "Koneksi Google Apps Script Berhasil Terhubung! 🌾",
        data: data
      };
    } catch (err) {
      return {
        success: false,
        error: "Tidak dapat terhubung ke Google Apps Script: " + (err.message || String(err))
      };
    }
  }

  // Helper untuk parsing object json ke model Category OOP
  parseStoreData(data) {
    const wa = data.wa || DEFAULT_WA;
    const thx = data.thx || DEFAULT_THX;
    const qris = data.qris || DEFAULT_QRIS;
    const gasUrl = data.gasUrl || this.getGasUrl();
    const rawSections = Array.isArray(data.sections) ? data.sections : DEFAULT_SECTIONS;
    const sections = rawSections.map(secData => new Category(secData));
    return { wa, thx, qris, gasUrl, sections };
  }

  createDefaultStoreState() {
    return {
      wa: DEFAULT_WA,
      thx: DEFAULT_THX,
      qris: DEFAULT_QRIS,
      gasUrl: this.getGasUrl(),
      sections: DEFAULT_SECTIONS.map(s => new Category(s))
    };
  }
}

export const storeRepository = new StoreRepository();
