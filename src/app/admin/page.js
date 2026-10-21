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
          <div className="mobile-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <Link
              href="/"
              className="app-btn-top shop-link"
              title="Lihat Toko"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                height: '34px',
                padding: '0 10px',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#1d4ed8',
                border: '2px solid #93c5fd',
                boxShadow: '0 2px 0 #93c5fd',
                fontSize: '12px',
                fontWeight: 800,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                lineHeight: 1
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>Lihat Toko</span>
            </Link>
            <button
              type="button"
              className="app-btn-top logout-link"
              onClick={handleLogout}
              title="Keluar dari Admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                height: '34px',
                padding: '0 10px',
                borderRadius: '10px',
                background: '#fff5f5',
                color: '#dc2626',
                border: '2px solid #fca5a5',
                boxShadow: '0 2px 0 #fca5a5',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                lineHeight: 1
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Keluar</span>
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
                <div key={sIdx} className="hayday-category-group">
                  <div className="hayday-category-banner">
                    <div className="cat-wood-sign">
                      <span className="cat-wood-title">{sec.title}</span>
                      <span className="cat-wood-count">{filteredItems.length} item</span>
                    </div>
                    <div className="cat-banner-actions">
                      <button
                        type="button"
                        className="cat-wood-btn edit-cat-btn"
                        onClick={() => openEditCategoryModal(sIdx)}
                        title="Edit nama kategori"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="cat-wood-btn add-item-btn"
                        onClick={() => openAddItemModal(sIdx)}
                        title="Tambah produk"
                      >
                        + Item
                      </button>
                      <button
                        type="button"
                        className="cat-wood-btn del-cat-btn"
                        onClick={() => promptDeleteCategory(sIdx)}
                        title="Hapus kategori"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Hay Day Roadside Crate Cards Grid */}
                  <div className="mobile-cards-grid">
                    {filteredItems.length === 0 ? (
                      <div className="empty-category-msg">
                        {adminSearch.trim()
                          ? 'Tidak ada produk yang cocok dengan pencarian.'
                          : 'Belum ada produk di kategori ini. Ketuk "+ Tambah Item" untuk menambah.'}
                      </div>
                    ) : (
                      filteredItems.map((prod, pIdx) => {
                        const originalIdx = sec.items.findIndex(it => it.id === prod.id);
                        const actualIdx = originalIdx >= 0 ? originalIdx : pIdx;

                        return (
                          <div key={prod.id || pIdx} className="hayday-crate-card">
                            {/* Wooden Tray Display */}
                            <div
                              className="hayday-crate-tray"
                              onClick={() => openEditItemModal(sIdx, actualIdx)}
                            >
                              <div className="crate-tray-badge">
                                {prod.unit}x {prod.unitType}
                              </div>

                              <div className="crate-tray-icon">
                                {prod.icons && prod.icons.length > 1 ? (
                                  <div className="bundle-icons-grid">
                                    {prod.icons.slice(0, 4).map((ic, i) => (
                                      <img key={i} src={ic.startsWith('/') ? ic : `/${ic}`} alt="item" />
                                    ))}
                                  </div>
                                ) : prod.icon && (prod.icon.startsWith('assets/') || prod.icon.startsWith('data:') || prod.icon.startsWith('http') || prod.icon.startsWith('/')) ? (
                                  <img src={prod.icon.startsWith('/') ? prod.icon : `/${prod.icon}`} alt="icon" />
                                ) : (
                                  <span style={{ fontSize: '36px' }}>{prod.icon || '📦'}</span>
                                )}
                              </div>
                            </div>

                            {/* Item Info Box */}
                            <div
                              className="crate-info-box"
                              onClick={() => openEditItemModal(sIdx, actualIdx)}
                            >
                              <div className="crate-item-name">{prod.name}</div>
                              <div className="crate-item-price">
                                Rp{prod.price.toLocaleString('id-ID')}
                              </div>
                              {prod.description && (
                                <div className="crate-item-desc">{prod.description}</div>
                              )}
                            </div>

                            {/* Distinct Action Buttons with Clear Labels */}
                            <div className="crate-actions-row">
                              <button
                                type="button"
                                className="crate-btn crate-btn-edit"
                                onClick={() => openEditItemModal(sIdx, actualIdx)}
                                title="Edit Item Produk"
                              >
                                Edit Item
                              </button>
                              <button
                                type="button"
                                className="crate-btn crate-btn-delete"
                                onClick={() => promptDeleteItem(sIdx, actualIdx)}
                                title="Hapus Item Produk"
                              >
                                Hapus
                              </button>
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
              <h2 className="section-heading">Kontak & Catatan Toko</h2>
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
              <h2 className="section-heading">Informasi Katalog</h2>
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
              <h2 className="section-heading">Backup & Kelola Data Excel</h2>
              <p className="section-subtext">Unduh seluruh data produk ke file Excel atau upload data dari file spreadsheet.</p>

              <div className="tools-btn-stack">
                <button
                  type="button"
                  className="app-big-tool-btn primary"
                  onClick={handleExportExcel}
                >
                  <div className="tool-indicator primary-indicator">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </div>
                  <div className="tool-info">
                    <span className="tool-title">Export ke Excel (.xlsx)</span>
                    <span className="tool-desc">Download backup seluruh produk dan harga</span>
                  </div>
                </button>

                <label className="app-big-tool-btn secondary" style={{ cursor: 'pointer' }}>
                  <div className="tool-indicator secondary-indicator">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
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
                  <div className="tool-indicator danger-indicator">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  </div>
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
            Simpan Perubahan
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
          <svg className="nav-tab-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
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
          aria-label="Tambah Produk Baru"
        >
          <span className="fab-plus">+</span>
          <span className="fab-text">Tambah</span>
        </button>

        <button
          type="button"
          className={`nav-tab-item ${mobileTab === 'settings' ? 'active' : ''}`}
          onClick={() => setMobileTab('settings')}
        >
          <svg className="nav-tab-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span className="nav-tab-label">Pengaturan</span>
        </button>

        <button
          type="button"
          className={`nav-tab-item ${mobileTab === 'tools' ? 'active' : ''}`}
          onClick={() => setMobileTab('tools')}
        >
          <svg className="nav-tab-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
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
        /* Hay Day Farm Theme for Mobile Admin */
        .admin-app-wrap {
          min-height: 100vh;
          background: #fdfaf4;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: var(--text-primary);
          padding-bottom: 95px; /* space for bottom tab bar */
        }

        /* Top Mobile App Header */
        .mobile-app-header {
          position: sticky;
          top: 0;
          z-index: 40;
          background: #ffffff;
          box-shadow: 0 3px 12px rgba(110, 74, 37, 0.08);
          border-bottom: 2px solid var(--border-subtle);
          padding: 12px 16px 10px;
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
          border: 1.5px solid var(--border-subtle);
          box-shadow: 0 2px 5px rgba(110, 74, 37, 0.12);
        }

        .app-title-group {
          display: flex;
          flex-direction: column;
        }

        .app-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .app-badge {
          font-size: 11px;
          font-weight: 700;
          color: #277220;
          background: #eef8eb;
          border: 1px solid #c2ebba;
          padding: 1px 8px;
          border-radius: 999px;
          display: inline-block;
          margin-top: 2px;
          align-self: flex-start;
        }

        .mobile-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .app-btn-top {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 34px;
          padding: 0 10px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          text-decoration: none !important;
          white-space: nowrap;
          transition: all 0.12s ease;
          border: 1.5px solid transparent;
          line-height: 1;
        }
        .app-btn-top:active {
          transform: translateY(1px);
        }

        .shop-link {
          background: #ffffff;
          color: #1d4ed8 !important;
          border: 2px solid #93c5fd;
          box-shadow: 0 2px 0 #93c5fd;
        }
        .logout-link {
          background: #fff5f5;
          color: #dc2626 !important;
          border: 2px solid #fca5a5;
          box-shadow: 0 2px 0 #fca5a5;
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
          font-size: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .mobile-search-input {
          width: 100%;
          height: 40px;
          background: #fbf8f2;
          border: 1.5px solid var(--border-subtle);
          border-radius: 12px;
          padding: 0 36px 0 36px;
          font-size: 14px;
          font-family: inherit;
          color: var(--text-primary);
          outline: none;
          transition: all 0.2s;
        }
        .mobile-search-input:focus {
          background: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(70, 178, 60, 0.18);
        }

        .mobile-search-clear {
          position: absolute;
          right: 10px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ebdcc8;
          color: var(--text-secondary);
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
          padding: 6px 13px;
          border-radius: 999px;
          border: 1.5px solid var(--border-subtle);
          background: #ffffff;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .cat-chip.active {
          background: linear-gradient(180deg, #52c748 0%, #3ca032 100%);
          border-color: #2b7a23;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(43, 122, 35, 0.3);
        }
        .cat-chip.add-chip {
          border: 1.5px dashed #2e7ee6;
          color: #1d4ed8;
          background: #eff6ff;
        }

        /* Mobile Main Body */
        .mobile-app-body {
          max-width: 800px;
          margin: 0 auto;
          padding: 14px 14px 20px;
        }

        /* Hay Day Category Wood Banner */
        .hayday-category-group {
          margin-bottom: 24px;
        }

        .hayday-category-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 8px;
        }

        .cat-wood-sign {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #a36125 0%, #753f12 100%);
          border: 2.5px solid #5a2e0a;
          border-radius: 14px;
          padding: 6px 14px;
          box-shadow: 0 3px 0 #4a2406, 0 5px 10px rgba(74, 36, 6, 0.2);
          flex-shrink: 0;
        }

        .cat-wood-title {
          font-family: 'Fredoka', 'Lilita One', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.3px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        .cat-wood-count {
          font-size: 11px;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.22);
          color: #fff9ed;
          padding: 2px 7px;
          border-radius: 999px;
        }

        .cat-banner-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cat-wood-btn {
          height: 32px;
          border-radius: 9px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          padding: 0 10px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.12s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }
        .cat-wood-btn:active {
          transform: translateY(1px);
        }

        .edit-cat-btn {
          background: #ffffff;
          color: #6e4a25;
          border: 2px solid #ebdcc8;
          box-shadow: 0 2px 0 #d8c2a3;
        }
        .add-item-btn {
          background: linear-gradient(180deg, #52c748 0%, #3ca032 100%);
          color: #ffffff;
          border: 2px solid #2b7a23;
          box-shadow: 0 2px 0 #205c19;
        }
        .del-cat-btn {
          background: #fff5f5;
          color: #dc2626;
          border: 2px solid #fca5a5;
          box-shadow: 0 2px 0 #f87171;
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

        /* Hay Day Roadside Shop Wooden Crate Card */
        .hayday-crate-card {
          background: #fdf6e7;
          border: 4px solid #9e6427;
          border-radius: 20px;
          padding: 10px 10px 12px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 5px 0 #734515, 0 10px 18px rgba(56, 26, 7, 0.28);
          transition: transform 0.12s, box-shadow 0.12s;
        }
        .hayday-crate-card:active {
          transform: translateY(1px);
        }

        /* Wooden Tray Inside Crate */
        .hayday-crate-tray {
          position: relative;
          background: linear-gradient(180deg, #ecc37e 0%, #deb065 100%);
          border: 4px solid #caa157;
          border-radius: 16px;
          padding: 10px 8px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 95px;
          cursor: pointer;
          box-shadow:
            inset 0 4px 6px rgba(90, 50, 10, 0.35),
            inset 0 -3px 4px rgba(255, 255, 255, 0.3);
          overflow: visible;
        }
        .hayday-crate-tray::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 32px,
            rgba(138, 83, 28, 0.15) 32px,
            rgba(138, 83, 28, 0.15) 34px
          );
          border-radius: 12px;
          pointer-events: none;
        }

        .crate-tray-badge {
          position: absolute;
          top: -8px;
          left: 6px;
          background: #ffffff;
          border: 2px solid #5a2e0a;
          border-radius: 7px;
          padding: 1px 7px;
          font-size: 11px;
          font-weight: 800;
          color: #4a2406;
          box-shadow: 0 2px 0 #5a2e0a;
          line-height: 1.2;
          z-index: 2;
        }

        .crate-tray-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .crate-tray-icon img {
          max-width: 48px;
          max-height: 48px;
          object-fit: contain;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
        }

        .bundle-icons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          width: 48px;
          height: 48px;
        }
        .bundle-icons-grid img {
          width: 22px;
          height: 22px;
          object-fit: contain;
        }

        /* Crate Product Info Area */
        .crate-info-box {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-top: 8px;
          flex-grow: 1;
        }

        .crate-item-name {
          font-family: 'Fredoka', 'Nunito', sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          color: #381e09;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .crate-item-price {
          font-family: 'Lilita One', 'Nunito', sans-serif;
          font-size: 17px;
          font-weight: 400;
          color: #277220;
          text-shadow: 0 1px 0 rgba(255,255,255,0.8);
          margin-top: 2px;
        }

        .crate-item-desc {
          font-size: 11.5px;
          color: #8d5d36;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
        }

        /* Clear, High-Contrast Action Buttons */
        .crate-actions-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1.5px dashed #deb065;
        }

        .crate-btn {
          font-family: inherit;
          font-size: 11.5px;
          font-weight: 800;
          height: 32px;
          padding: 0 4px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.12s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }
        .crate-btn:active {
          transform: translateY(1px);
        }

        .crate-btn-edit {
          background: #ffffff;
          color: #1d4ed8;
          border: 2px solid #93c5fd;
          box-shadow: 0 2px 0 #93c5fd;
        }
        .crate-btn-delete {
          background: #fff5f5;
          color: #b91c1c;
          border: 2px solid #fca5a5;
          box-shadow: 0 2px 0 #fca5a5;
        }

        .empty-category-msg {
          grid-column: 1 / -1;
          padding: 24px;
          text-align: center;
          background: #ffffff;
          border: 2px dashed #caa157;
          border-radius: 16px;
          color: #8d5d36;
          font-size: 14px;
          font-weight: 600;
        }

        /* App Card Panels for Settings & Tools */
        .app-card-panel {
          background: #ffffff;
          border-radius: 18px;
          border: 1.5px solid var(--border-subtle);
          padding: 20px 18px;
          box-shadow: 0 4px 12px rgba(110, 74, 37, 0.05);
        }

        .section-heading {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px;
        }

        .section-subtext {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0 0 16px;
        }

        .app-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .app-label {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .app-text-input {
          width: 100%;
          border: 1.5px solid var(--border-subtle);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14.5px;
          font-family: inherit;
          color: var(--text-primary);
          background: #fdfaf4;
          outline: none;
          transition: all 0.2s;
        }
        .app-text-input:focus {
          background: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(70, 178, 60, 0.18);
        }

        .app-helper-text {
          font-size: 12px;
          color: var(--text-muted);
        }

        .app-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .stat-card {
          background: #fdfaf4;
          border: 1.5px solid var(--border-subtle);
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
          color: #277220;
        }

        .stat-label {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-secondary);
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
          border: 1.5px solid var(--border-subtle);
          background: #ffffff;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          box-shadow: 0 2px 6px rgba(110, 74, 37, 0.04);
        }
        .app-big-tool-btn:active {
          transform: scale(0.99);
        }

        .tool-indicator {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .primary-indicator {
          background: #eef8eb;
          color: #277220;
          border: 1.5px solid #c2ebba;
        }
        .secondary-indicator {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1.5px solid #bfdbfe;
        }
        .danger-indicator {
          background: #fef2f2;
          color: #b91c1c;
          border: 1.5px solid #fecaca;
        }

        .app-big-tool-btn .tool-info {
          display: flex;
          flex-direction: column;
        }

        .app-big-tool-btn .tool-title {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .app-big-tool-btn .tool-desc {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .app-big-tool-btn.primary {
          border-color: #c2ebba;
          background: #fbfdfa;
        }
        .app-big-tool-btn.primary .tool-title {
          color: #277220;
        }

        .app-big-tool-btn.secondary {
          border-color: #bfdbfe;
          background: #fafdff;
        }
        .app-big-tool-btn.secondary .tool-title {
          color: #1d4ed8;
        }

        .app-big-tool-btn.danger {
          border-color: #fecaca;
          background: #fffbfb;
        }
        .app-big-tool-btn.danger .tool-title {
          color: #b91c1c;
        }

        /* Floating Save Banner */
        .mobile-save-banner {
          position: fixed;
          bottom: 74px;
          left: 14px;
          right: 14px;
          max-width: 600px;
          margin: 0 auto;
          background: #381e09;
          color: #ffffff;
          padding: 10px 14px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 55;
          box-shadow: 0 8px 24px rgba(56, 30, 9, 0.35);
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
          font-size: 13px;
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
          background: linear-gradient(180deg, #52c748 0%, #3ca032 100%);
          color: #ffffff;
          border: 1.5px solid #2b7a23;
          padding: 7px 15px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .save-banner-btn:active {
          transform: translateY(1px);
        }

        /* Mobile Bottom App Navigation Bar */
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: #ffffff;
          border-top: 1.5px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 16px env(safe-area-inset-bottom, 0px);
          z-index: 50;
          box-shadow: 0 -4px 14px rgba(110, 74, 37, 0.08);
        }

        .nav-tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: inherit;
          cursor: pointer;
          padding: 6px 0;
          gap: 3px;
          transition: all 0.15s;
        }
        .nav-tab-item.active {
          color: var(--primary);
        }

        .nav-tab-svg {
          transition: transform 0.15s;
        }
        .nav-tab-item.active .nav-tab-svg {
          transform: scale(1.1);
        }

        .nav-tab-label {
          font-size: 11px;
          font-weight: 700;
        }

        /* Floating Center Action Button (FAB) */
        .nav-fab-btn {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(180deg, #52c748 0%, #3ca032 100%);
          border: 3.5px solid #ffffff;
          box-shadow: 0 4px 14px rgba(43, 122, 35, 0.45);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          margin-top: -24px;
          transition: transform 0.15s;
          text-decoration: none;
        }
        .nav-fab-btn:active {
          transform: scale(0.92);
        }

        .fab-plus {
          font-size: 22px;
          font-weight: 900;
          line-height: 1;
        }

        .fab-text {
          font-size: 9.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          line-height: 1;
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
}
