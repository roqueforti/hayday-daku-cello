'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { storeRepository } from '../../services/StoreRepository';
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';
import { ItemModal } from '../../components/ItemModal';
import { CategoryModal } from '../../components/CategoryModal';
import { ConfirmModal } from '../../components/ConfirmModal';

const ADMIN_HASH = "12222e06fa6847a3b4a8f6fe79ea75d8ce39bfdbef5f054ea4a902cb0a48ef3d";
const AUTH_KEY = "hayday_admin_auth_v2";

async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [storeData, setStoreData] = useState({ wa: '', thx: '', sections: [] });
  const [isDirty, setIsDirty] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [mobileTab, setMobileTab] = useState('catalog'); // 'catalog' | 'settings' | 'tools'
  const [adminSearch, setAdminSearch] = useState('');

  // Modals state
  const [itemModalState, setItemModalState] = useState({ isOpen: false, categoryIndex: 0, productIndex: -1, initialProduct: null });
  const [categoryModalState, setCategoryModalState] = useState({ isOpen: false, categoryIndex: -1, initialTitle: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', type: 'danger', onConfirm: () => {} });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2400);
  };

  useEffect(() => {
    // Check session
    const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
    }

    const local = storeRepository.loadLocal();
    setStoreData(local);

    const unsub = storeRepository.subscribeCloud((cloud) => {
      if (!isDirty) {
        setStoreData(cloud);
      }
    });
    return () => unsub();
  }, [isDirty]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const hash = await sha256(passwordInput.trim());
    if (hash === ADMIN_HASH) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setLoginError('');
      setPasswordInput('');
      showToast("Selamat datang di Admin Portal! 🚜✨");
    } else {
      setLoginError("Password salah! Silakan coba lagi.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    showToast("Anda telah keluar dari Admin.");
  };

  // CRUD Item Modal Triggers
  const openAddItemModal = (catIdx) => {
    setItemModalState({
      isOpen: true,
      categoryIndex: catIdx,
      productIndex: -1,
      initialProduct: null
    });
  };

  const openEditItemModal = (catIdx, prodIdx) => {
    const prod = storeData.sections[catIdx]?.items[prodIdx];
    setItemModalState({
      isOpen: true,
      categoryIndex: catIdx,
      productIndex: prodIdx,
      initialProduct: prod
    });
  };

  const handleSaveItemModal = (catIdx, prodIdx, product) => {
    const newSections = [...storeData.sections];
    const category = newSections[catIdx];

    if (prodIdx >= 0) {
      category.updateProduct(prodIdx, product);
      showToast(`Item '${product.name}' diperbarui! ✨`);
    } else {
      category.addProduct(product);
      showToast(`Item '${product.name}' ditambahkan! ✨`);
    }

    setStoreData({ ...storeData, sections: newSections });
    setIsDirty(true);
  };

  const promptDeleteItem = (catIdx, prodIdx) => {
    const item = storeData.sections[catIdx]?.items[prodIdx];
    const name = item ? item.name : 'item ini';

    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Item Produk?',
      message: `Apakah Anda yakin ingin menghapus '${name}' dari daftar? Tindakan ini dapat dibatalkan sebelum Anda menekan tombol simpan perubahan.`,
      confirmText: 'Ya, Hapus Item',
      type: 'danger',
      onConfirm: () => {
        const newSections = [...storeData.sections];
        newSections[catIdx].removeProduct(prodIdx);
        setStoreData({ ...storeData, sections: newSections });
        setIsDirty(true);
        setConfirmDialog({ isOpen: false });
        showToast(`Item '${name}' telah dihapus.`);
      }
    });
  };

  // CRUD Category Modal Triggers
  const openAddCategoryModal = () => {
    setCategoryModalState({
      isOpen: true,
      categoryIndex: -1,
      initialTitle: ''
    });
  };

  const openEditCategoryModal = (catIdx) => {
    const sec = storeData.sections[catIdx];
    setCategoryModalState({
      isOpen: true,
      categoryIndex: catIdx,
      initialTitle: sec ? sec.title : ''
    });
  };

  const handleSaveCategoryModal = (catIdx, newTitle) => {
    const newSections = [...storeData.sections];
    if (catIdx >= 0) {
      newSections[catIdx].title = newTitle;
      showToast(`Kategori '${newTitle}' diperbarui.`);
    } else {
      const newCat = new Category({ t: newTitle, items: [] });
      newSections.push(newCat);
      setActiveCategoryFilter(newSections.length - 1);
      showToast(`Kategori baru '${newTitle}' dibuat.`);
    }
    setStoreData({ ...storeData, sections: newSections });
    setIsDirty(true);
  };

  const promptDeleteCategory = (catIdx) => {
    const sec = storeData.sections[catIdx];
    const title = sec ? sec.title : 'kategori ini';

    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Seluruh Kategori?',
      message: `Kategori '${title}' beserta seluruh produk di dalamnya (${sec?.items?.length || 0} item) akan dihapus. Lanjutkan?`,
      confirmText: 'Hapus Kategori',
      type: 'danger',
      onConfirm: () => {
        const newSections = storeData.sections.filter((_, idx) => idx !== catIdx);
        setStoreData({ ...storeData, sections: newSections });
        setActiveCategoryFilter('all');
        setIsDirty(true);
        setConfirmDialog({ isOpen: false });
        showToast(`Kategori '${title}' telah dihapus.`);
      }
    });
  };

  // Save changes
  const handleSaveAll = async () => {
    try {
      showToast("Menyimpan ke Cloud Database... ☁️");
      const res = await storeRepository.saveToCloud(storeData);
      setIsDirty(false);
      if (res.cloud) {
        showToast("Tersimpan ke Cloud Database & Semua Pembeli! 🚀");
      } else {
        showToast("Tersimpan lokal di browser 💾");
      }
    } catch (e) {
      alert("Gagal menyimpan perubahan: " + e.message);
    }
  };

  // Export ke Excel
  const handleExportExcel = () => {
    const productsData = [];
    storeData.sections.forEach(sec => {
      sec.items.forEach(it => {
        productsData.push({
          "Kategori": sec.title,
          "Tipe Kategori": sec.isPackage ? "Per Paket" : "Reguler (per 100 pcs)",
          "Nama Produk": it.name,
          "Satuan Dasar": it.unit,
          "Jenis Satuan": it.unitType,
          "Harga (Rp)": it.price,
          "Deskripsi / Catatan": it.description,
          "Warna Label": it.color,
          "Icon File": it.icon,
          "ID Produk": it.id
        });
      });
    });

    const settingsData = [
      { "Kunci Pengaturan": "Nomor WhatsApp", "Nilai": storeData.wa },
      { "Kunci Pengaturan": "Teks Footer / Catatan", "Nilai": storeData.thx }
    ];

    const wb = XLSX.utils.book_new();
    const wsProducts = XLSX.utils.json_to_sheet(productsData);
    wsProducts["!cols"] = [
      { wch: 22 }, { wch: 18 }, { wch: 24 }, { wch: 14 },
      { wch: 14 }, { wch: 14 }, { wch: 32 }, { wch: 14 },
      { wch: 26 }, { wch: 18 }
    ];
    XLSX.utils.book_append_sheet(wb, wsProducts, "Daftar Produk");

    const wsSettings = XLSX.utils.json_to_sheet(settingsData);
    XLSX.utils.book_append_sheet(wb, wsSettings, "Pengaturan Toko");

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Daftar_Harga_HayDay_${today}.xlsx`);
    showToast("File Excel berhasil diunduh! 📊✨");
  };

  // Import dari Excel
  const handleImportExcel = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const wb = XLSX.read(data, { type: "array" });

        let newWa = storeData.wa;
        let newThx = storeData.thx;

        if (wb.Sheets["Pengaturan Toko"]) {
          const settingsRows = XLSX.utils.sheet_to_json(wb.Sheets["Pengaturan Toko"]);
          settingsRows.forEach(row => {
            const k = (row["Kunci Pengaturan"] || "").toString().toLowerCase();
            const v = (row["Nilai"] || "").toString().trim();
            if (k.includes("whatsapp") && v) newWa = v;
            if (k.includes("footer") && v) newThx = v;
          });
        }

        const sheetName = wb.SheetNames.includes("Daftar Produk") ? "Daftar Produk" : wb.SheetNames[0];
        const productRows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);

        if (!productRows || !productRows.length) {
          alert("File Excel kosong atau tidak memiliki baris data produk!");
          return;
        }

        const catMap = {};
        const catOrder = [];

        productRows.forEach(row => {
          const catName = (row["Kategori"] || "Lain-lain").toString().trim();
          const tipeKat = (row["Tipe Kategori"] || "").toString().toLowerCase();
          const isPk = tipeKat.includes("paket");

          if (!catMap[catName]) {
            catMap[catName] = {
              title: catName,
              isPackage: isPk,
              items: []
            };
            catOrder.push(catName);
          }

          catMap[catName].items.push(new Product({
            id: (row["ID Produk"] || "").toString().trim() || ('item_' + Date.now()),
            name: (row["Nama Produk"] || "").toString().trim(),
            u: row["Satuan Dasar"] !== undefined ? Number(row["Satuan Dasar"]) : 100,
            ut: (row["Jenis Satuan"] || "pcs").toString().trim(),
            p: Number(row["Harga (Rp)"]) || 0,
            d: (row["Deskripsi / Catatan"] || "").toString().trim(),
            c: (row["Warna Label"] || "#46b23c").toString().trim(),
            e: (row["Icon File"] || "assets/icons/Wheat.png").toString().trim()
          }));
        });

        const newSections = catOrder.map(name => new Category(catMap[name]));
        setStoreData({ wa: newWa, thx: newThx, sections: newSections });
        setIsDirty(true);
        showToast("Data Excel berhasil di-import! Silakan simpan. 📊✅");
      } catch (err) {
        alert("Gagal membaca file Excel: " + err.message);
      }
      e.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  // If not logged in, show login gate
  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <div className="login-icon">🔒</div>
          <h2 className="login-title">LOGIN ADMIN</h2>
          <p className="login-sub">Masukkan password untuk mengelola harga Hay Day Daku Cello</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="login-inp"
              placeholder="Ketik password..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              autoFocus
            />
            <button type="submit" className="btn btn-primary login-btn">
              🔑 Buka Admin
            </button>
            {loginError && <div className="login-error">{loginError}</div>}
          </form>
          <div style={{ marginTop: '16px' }}>
            <Link href="/" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
              ⬅ Kembali ke Toko
            </Link>
          </div>
        </div>

        <style jsx>{`
          .login-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
          }
          .login-box {
            background: #ffffff;
            border: 2px solid var(--border-subtle);
            border-radius: var(--radius-xl);
            padding: 36px 32px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 10px 18px rgba(110, 74, 37, 0.1);
          }
          .login-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: #eef8eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            margin: 0 auto 16px;
          }
          .login-title {
            margin: 0 0 6px;
            font-size: 20px;
            font-weight: 800;
          }
          .login-sub {
            font-size: 13px;
            color: var(--text-muted);
            margin: 0 0 20px;
          }
          .login-inp {
            width: 100%;
            height: 42px !important;
            text-align: center;
            letter-spacing: 2px;
            margin-bottom: 14px;
          }
          .login-btn {
            width: 100%;
            justify-content: center;
            padding: 11px;
            font-size: 14px;
          }
          .login-error {
            color: #dc2626;
            font-size: 12.5px;
            font-weight: 600;
            margin-top: 12px;
          }
        `}</style>
      </div>
    );
  }

  const totalProducts = storeData.sections.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div className="admin-app-wrap">
      {/* Mobile App Bar */}
      <header className="mobile-app-header">
        <div className="mobile-header-top">
          <div className="mobile-brand-info">
            <img src="/logo-daku-cello.jpeg" alt="Logo" className="app-logo-avatar" />
            <div className="app-title-group">
              <span className="app-name">Hay Day Daku Cello</span>
              <span className="app-badge">Admin Manager</span>
            </div>
          </div>
          <div className="mobile-header-actions">
            <Link href="/" className="app-header-icon-btn" title="Lihat Toko">
              👁️
            </Link>
            <button
              type="button"
              className="app-header-icon-btn"
              onClick={handleLogout}
              title="Keluar"
            >
              🚪
            </button>
          </div>
        </div>

        {/* Search input in mobile app header */}
        {mobileTab === 'catalog' && (
          <div className="mobile-search-bar">
            <span className="mobile-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Cari item di katalog..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="mobile-search-input"
            />
            {adminSearch && (
              <button
                type="button"
                className="mobile-search-clear"
                onClick={() => setAdminSearch('')}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Category Horizontal Scrolling Chips */}
        {mobileTab === 'catalog' && (
          <div className="mobile-cat-chips-scroll">
            <button
              type="button"
              className={`cat-chip ${activeCategoryFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategoryFilter('all')}
            >
              Semua ({totalProducts})
            </button>
            {storeData.sections.map((sec, idx) => (
              <button
                key={idx}
                type="button"
                className={`cat-chip ${String(activeCategoryFilter) === String(idx) ? 'active' : ''}`}
                onClick={() => setActiveCategoryFilter(idx)}
              >
                {sec.title} ({sec.items.length})
              </button>
            ))}
            <button
              type="button"
              className="cat-chip add-chip"
              onClick={openAddCategoryModal}
            >
              + Kategori
            </button>
          </div>
        )}
      </header>

      {/* Main App Content Body */}
      <main className="mobile-app-body">
        {/* TAB 1: KATALOG PRODUK */}
        {mobileTab === 'catalog' && (
          <div className="mobile-tab-content">
            {storeData.sections.map((sec, sIdx) => {
              if (activeCategoryFilter !== 'all' && String(activeCategoryFilter) !== String(sIdx)) {
                return null;
              }

              // Filter products by admin search
              const filteredItems = sec.items.filter(it => {
                if (!adminSearch.trim()) return true;
                const q = adminSearch.toLowerCase();
                return (
                  it.name.toLowerCase().includes(q) ||
                  it.unitType.toLowerCase().includes(q) ||
                  (it.description && it.description.toLowerCase().includes(q))
                );
              });

              if (adminSearch.trim() && filteredItems.length === 0) {
                return null;
              }

              return (
                <div key={sIdx} className="mobile-category-block">
                  <div className="mobile-category-header">
                    <div className="cat-title-wrap">
                      <span className="cat-title-text">{sec.title}</span>
                      <span className="cat-count-pill">{filteredItems.length} item</span>
                    </div>
                    <div className="cat-actions-wrap">
                      <button
                        type="button"
                        className="cat-pill-btn"
                        onClick={() => openEditCategoryModal(sIdx)}
                        title="Edit nama kategori"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="cat-pill-btn add-item-pill"
                        onClick={() => openAddItemModal(sIdx)}
                        title="Tambah produk"
                      >
                        + Item
                      </button>
                      <button
                        type="button"
                        className="cat-pill-btn del-pill"
                        onClick={() => promptDeleteCategory(sIdx)}
                        title="Hapus kategori"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Product Cards Grid */}
                  <div className="mobile-cards-grid">
                    {filteredItems.length === 0 ? (
                      <div className="empty-category-msg">
                        {adminSearch.trim()
                          ? 'Tidak ada produk yang cocok dengan pencarian.'
                          : 'Belum ada produk. Ketuk "+ Item" untuk menambah.'}
                      </div>
                    ) : (
                      filteredItems.map((prod, pIdx) => {
                        // find real index in original items array
                        const originalIdx = sec.items.findIndex(it => it.id === prod.id);
                        const actualIdx = originalIdx >= 0 ? originalIdx : pIdx;

                        return (
                          <div key={prod.id || pIdx} className="app-product-card">
                            <div className="card-top-row">
                              <div
                                className="card-icon-container"
                                onClick={() => openEditItemModal(sIdx, actualIdx)}
                                style={{ borderColor: prod.color || '#e2e8f0' }}
                              >
                                {prod.icons && prod.icons.length > 1 ? (
                                  <div className="bundle-icons-grid">
                                    {prod.icons.slice(0, 4).map((ic, i) => (
                                      <img key={i} src={ic.startsWith('/') ? ic : `/${ic}`} alt="item" />
                                    ))}
                                  </div>
                                ) : prod.icon && (prod.icon.startsWith('assets/') || prod.icon.startsWith('data:') || prod.icon.startsWith('http') || prod.icon.startsWith('/')) ? (
                                  <img src={prod.icon.startsWith('/') ? prod.icon : `/${prod.icon}`} alt="icon" />
                                ) : (
                                  <span style={{ fontSize: '32px' }}>{prod.icon || '📦'}</span>
                                )}
                              </div>
                              <div className="card-quick-actions">
                                <button
                                  type="button"
                                  className="card-action-icon-btn edit-icon"
                                  onClick={() => openEditItemModal(sIdx, actualIdx)}
                                  title="Edit Produk"
                                  aria-label="Edit Produk"
                                >
                                  ✏️
                                </button>
                                <button
                                  type="button"
                                  className="card-action-icon-btn del-icon"
                                  onClick={() => promptDeleteItem(sIdx, actualIdx)}
                                  title="Hapus Produk"
                                  aria-label="Hapus Produk"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>

                            <div
                              className="card-content-area"
                              onClick={() => openEditItemModal(sIdx, actualIdx)}
                            >
                              <div className="card-item-title">{prod.name}</div>
                              <div className="card-item-unit">{prod.unit} {prod.unitType}</div>
                              <div className="card-item-price">
                                Rp{prod.price.toLocaleString('id-ID')}
                              </div>
                              {prod.description && (
                                <div className="card-item-note">{prod.description}</div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: PENGATURAN TOKO (SETTINGS) */}
        {mobileTab === 'settings' && (
          <div className="mobile-settings-view">
            <div className="app-card-panel">
              <h2 className="section-heading">⚙️ Kontak & Catatan Toko</h2>
              <p className="section-subtext">Nomor WhatsApp tujuan order dan pesan footer di nota pesanan.</p>

              <div className="app-input-group">
                <label className="app-label">Nomor WhatsApp Penerima Order</label>
                <input
                  type="text"
                  value={storeData.wa}
                  onChange={(e) => {
                    setStoreData({ ...storeData, wa: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="Format: 628xxx"
                  className="app-text-input"
                />
                <span className="app-helper-text">Contoh: 6287719747833 (gunakan kode negara 62)</span>
              </div>

              <div className="app-input-group" style={{ marginTop: '16px' }}>
                <label className="app-label">Catatan Footer / Ucapan Terima Kasih</label>
                <textarea
                  rows={3}
                  value={storeData.thx}
                  onChange={(e) => {
                    setStoreData({ ...storeData, thx: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="🌻 Terima kasih sudah berbelanja di Hay Day Daku Cello 🌻"
                  className="app-text-input"
                />
              </div>
            </div>

            <div className="app-card-panel" style={{ marginTop: '14px' }}>
              <h2 className="section-heading">📋 Informasi Katalog</h2>
              <div className="app-stats-row">
                <div className="stat-card">
                  <span className="stat-number">{storeData.sections.length}</span>
                  <span className="stat-label">Total Kategori</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{totalProducts}</span>
                  <span className="stat-label">Total Item Produk</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TOOLS (EXPORT / IMPORT EXCEL) */}
        {mobileTab === 'tools' && (
          <div className="mobile-tools-view">
            <div className="app-card-panel">
              <h2 className="section-heading">📊 Backup & Kelola Excel</h2>
              <p className="section-subtext">Unduh seluruh data produk ke file Excel atau upload data dari komputer.</p>

              <div className="tools-btn-stack">
                <button
                  type="button"
                  className="app-big-tool-btn primary"
                  onClick={handleExportExcel}
                >
                  <span className="tool-icon">📊</span>
                  <div className="tool-info">
                    <span className="tool-title">Export ke Excel (.xlsx)</span>
                    <span className="tool-desc">Download backup seluruh produk dan harga</span>
                  </div>
                </button>

                <label className="app-big-tool-btn secondary" style={{ cursor: 'pointer' }}>
                  <span className="tool-icon">📥</span>
                  <div className="tool-info">
                    <span className="tool-title">Import dari Excel</span>
                    <span className="tool-desc">Upload dan perbarui katalog otomatis</span>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleImportExcel}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  type="button"
                  className="app-big-tool-btn danger"
                  onClick={handleLogout}
                >
                  <span className="tool-icon">🚪</span>
                  <div className="tool-info">
                    <span className="tool-title">Keluar dari Admin</span>
                    <span className="tool-desc">Kunci kembali akses portal administrator</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Save Banner (when changes occur) */}
      {isDirty && (
        <div className="mobile-save-banner">
          <div className="save-banner-text">
            <span className="pulse-dot" />
            <span>Ada perubahan belum tersimpan!</span>
          </div>
          <button
            type="button"
            className="save-banner-btn"
            onClick={handleSaveAll}
          >
            💾 Simpan Sekarang
          </button>
        </div>
      )}

      {/* Mobile App Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          type="button"
          className={`nav-tab-item ${mobileTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setMobileTab('catalog')}
        >
          <span className="nav-tab-icon">📦</span>
          <span className="nav-tab-label">Katalog</span>
        </button>

        <button
          type="button"
          className="nav-fab-btn"
          onClick={() => {
            const catIdx = activeCategoryFilter === 'all' ? 0 : Number(activeCategoryFilter);
            openAddItemModal(catIdx || 0);
          }}
          title="Tambah Produk Baru"
        >
          <span className="fab-plus">+</span>
        </button>

        <button
          type="button"
          className={`nav-tab-item ${mobileTab === 'settings' ? 'active' : ''}`}
          onClick={() => setMobileTab('settings')}
        >
          <span className="nav-tab-icon">⚙️</span>
          <span className="nav-tab-label">Pengaturan</span>
        </button>

        <button
          type="button"
          className={`nav-tab-item ${mobileTab === 'tools' ? 'active' : ''}`}
          onClick={() => setMobileTab('tools')}
        >
          <span className="nav-tab-icon">📊</span>
          <span className="nav-tab-label">Excel</span>
        </button>
      </nav>

      {/* Item Modal Form */}
      <ItemModal
        isOpen={itemModalState.isOpen}
        categoryIndex={itemModalState.categoryIndex}
        productIndex={itemModalState.productIndex}
        categoryTitle={storeData.sections[itemModalState.categoryIndex]?.title || ''}
        initialProduct={itemModalState.initialProduct}
        onSave={handleSaveItemModal}
        onClose={() => setItemModalState({ ...itemModalState, isOpen: false })}
      />

      {/* Category Modal Form */}
      <CategoryModal
        isOpen={categoryModalState.isOpen}
        categoryIndex={categoryModalState.categoryIndex}
        initialTitle={categoryModalState.initialTitle}
        onSave={handleSaveCategoryModal}
        onClose={() => setCategoryModalState({ ...categoryModalState, isOpen: false })}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      {/* Toast Alert */}
      <div className={`toast ${toastMessage ? 's' : ''}`}>{toastMessage}</div>

      <style jsx>{`
        /* Native Mobile App Style Theme */
        .admin-app-wrap {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: #1e293b;
          padding-bottom: 95px; /* space for bottom tab bar */
        }

        /* Top Mobile App Header */
        .mobile-app-header {
          position: sticky;
          top: 0;
          z-index: 40;
          background: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 16px 8px;
        }

        .mobile-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .mobile-brand-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .app-logo-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          object-fit: cover;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.06);
        }

        .app-title-group {
          display: flex;
          flex-direction: column;
        }

        .app-name {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }

        .app-badge {
          font-size: 11px;
          font-weight: 700;
          color: #166534;
          background: #dcfce7;
          padding: 1px 7px;
          border-radius: 999px;
          display: inline-block;
          margin-top: 2px;
          align-self: flex-start;
        }

        .mobile-header-actions {
          display: flex;
          gap: 8px;
        }

        .app-header-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          transition: background 0.15s;
        }
        .app-header-icon-btn:active {
          background: #e2e8f0;
        }

        /* Mobile Search Bar */
        .mobile-search-bar {
          margin-top: 10px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .mobile-search-icon {
          position: absolute;
          left: 12px;
          font-size: 15px;
          color: #94a3b8;
          pointer-events: none;
        }

        .mobile-search-input {
          width: 100%;
          height: 42px;
          background: #f1f5f9;
          border: 1.5px solid transparent;
          border-radius: 12px;
          padding: 0 36px 0 36px;
          font-size: 14.5px;
          font-family: inherit;
          color: #1e293b;
          outline: none;
          transition: all 0.2s;
        }
        .mobile-search-input:focus {
          background: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .mobile-search-clear {
          position: absolute;
          right: 10px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #cbd5e1;
          color: #475569;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          cursor: pointer;
        }

        /* Category Horizontal Scroll Chips */
        .mobile-cat-chips-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          white-space: nowrap;
          padding: 10px 0 4px;
          scrollbar-width: none;
        }
        .mobile-cat-chips-scroll::-webkit-scrollbar {
          display: none;
        }

        .cat-chip {
          padding: 7px 14px;
          border-radius: 999px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 13.5px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .cat-chip.active {
          background: #22c55e;
          border-color: #16a34a;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);
        }
        .cat-chip.add-chip {
          border-style: dashed;
          color: #2563eb;
          border-color: #93c5fd;
          background: #eff6ff;
        }

        /* Mobile Main Body */
        .mobile-app-body {
          max-width: 800px;
          margin: 0 auto;
          padding: 14px 14px 20px;
        }

        .mobile-category-block {
          margin-bottom: 22px;
        }

        .mobile-category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 0 4px;
        }

        .cat-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cat-title-text {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
        }

        .cat-count-pill {
          font-size: 11.5px;
          font-weight: 700;
          background: #e2e8f0;
          color: #475569;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .cat-actions-wrap {
          display: flex;
          gap: 6px;
        }

        .cat-pill-btn {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .cat-pill-btn.add-item-pill {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #166534;
        }
        .cat-pill-btn.del-pill {
          background: #fef2f2;
          border-color: #fecaca;
          color: #991b1b;
        }

        /* 2-Column Mobile Cards Grid */
        .mobile-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (max-width: 350px) {
          .mobile-cards-grid {
            gap: 8px;
          }
        }

        .app-product-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          padding: 12px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
          transition: transform 0.12s, box-shadow 0.12s;
        }
        .app-product-card:active {
          transform: scale(0.98);
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .card-icon-container {
          width: 58px;
          height: 58px;
          border-radius: 14px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
          flex-shrink: 0;
        }
        .card-icon-container img {
          max-width: 44px;
          max-height: 44px;
          object-fit: contain;
        }

        .bundle-icons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          width: 44px;
          height: 44px;
        }
        .bundle-icons-grid img {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }

        .card-quick-actions {
          display: flex;
          gap: 6px;
        }

        .card-action-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .card-action-icon-btn.edit-icon:active {
          background: #eff6ff;
          border-color: #3b82f6;
        }
        .card-action-icon-btn.del-icon:active {
          background: #fef2f2;
          border-color: #ef4444;
        }

        .card-content-area {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-grow: 1;
        }

        .card-item-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          margin-bottom: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-item-unit {
          font-size: 13.5px;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 3px 8px;
          border-radius: 6px;
          display: inline-block;
          align-self: flex-start;
        }

        .card-item-price {
          font-size: 17px;
          font-weight: 900;
          color: #166534;
          font-family: 'JetBrains Mono', monospace;
          margin-top: 4px;
        }

        .card-item-note {
          font-size: 12.5px;
          color: #94a3b8;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
          margin-top: 2px;
        }

        .empty-category-msg {
          grid-column: 1 / -1;
          padding: 24px;
          text-align: center;
          background: #ffffff;
          border: 1.5px dashed #cbd5e1;
          border-radius: 12px;
          color: #64748b;
          font-size: 14.5px;
        }

        /* App Card Panels for Settings & Tools */
        .app-card-panel {
          background: #ffffff;
          border-radius: 18px;
          border: 1.5px solid #e2e8f0;
          padding: 20px 18px;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.03);
        }

        .section-heading {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .section-subtext {
          font-size: 13.5px;
          color: #64748b;
          margin: 0 0 16px;
        }

        .app-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .app-label {
          font-size: 14px;
          font-weight: 700;
          color: #334155;
        }

        .app-text-input {
          width: 100%;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 15px;
          font-family: inherit;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: all 0.2s;
        }
        .app-text-input:focus {
          background: #ffffff;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
        }

        .app-helper-text {
          font-size: 12px;
          color: #94a3b8;
        }

        .app-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .stat-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-number {
          font-size: 26px;
          font-weight: 900;
          color: #16a34a;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          margin-top: 2px;
        }

        /* Tools Button Stack */
        .tools-btn-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .app-big-tool-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          box-shadow: 0 2px 5px rgba(0,0,0,0.03);
        }
        .app-big-tool-btn:active {
          transform: scale(0.99);
        }

        .app-big-tool-btn .tool-icon {
          font-size: 28px;
          flex-shrink: 0;
        }

        .app-big-tool-btn .tool-info {
          display: flex;
          flex-direction: column;
        }

        .app-big-tool-btn .tool-title {
          font-size: 15.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .app-big-tool-btn .tool-desc {
          font-size: 12.5px;
          color: #64748b;
          margin-top: 2px;
        }

        .app-big-tool-btn.primary {
          border-color: #bbf7d0;
          background: #f0fdf4;
        }
        .app-big-tool-btn.primary .tool-title {
          color: #166534;
        }

        .app-big-tool-btn.danger {
          border-color: #fecaca;
          background: #fef2f2;
        }
        .app-big-tool-btn.danger .tool-title {
          color: #991b1b;
        }

        /* Floating Save Banner */
        .mobile-save-banner {
          position: fixed;
          bottom: 74px;
          left: 14px;
          right: 14px;
          max-width: 600px;
          margin: 0 auto;
          background: #0f172a;
          color: #ffffff;
          padding: 10px 14px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 55;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.2s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .save-banner-text {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 700;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.4);
        }

        .save-banner-btn {
          background: #22c55e;
          color: #ffffff;
          border: none;
          padding: 7px 14px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 800;
          cursor: pointer;
        }
        .save-banner-btn:active {
          background: #16a34a;
        }

        /* Mobile Bottom App Navigation Bar */
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 66px;
          background: #ffffff;
          border-top: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 16px env(safe-area-inset-bottom, 0px);
          z-index: 50;
          box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.05);
        }

        .nav-tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: #64748b;
          font-family: inherit;
          cursor: pointer;
          padding: 6px 0;
          gap: 3px;
          transition: all 0.15s;
        }
        .nav-tab-item.active {
          color: #16a34a;
        }

        .nav-tab-icon {
          font-size: 20px;
        }

        .nav-tab-label {
          font-size: 11.5px;
          font-weight: 700;
        }

        /* Floating Center Action Button (FAB) */
        .nav-fab-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: 3px solid #ffffff;
          box-shadow: 0 4px 14px rgba(22, 163, 74, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          margin-top: -24px;
          transition: transform 0.15s;
        }
        .nav-fab-btn:active {
          transform: scale(0.92);
        }

        .fab-plus {
          font-size: 30px;
          font-weight: 700;
          line-height: 1;
          margin-top: -2px;
        }
      `}</style>
    </div>
  );
}
