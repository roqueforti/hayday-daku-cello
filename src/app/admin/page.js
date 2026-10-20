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
      {/* Top Navbar */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <img src="/logo-daku-cello.jpeg" alt="Logo" className="header-logo-icon" />
            <div>
              <h1 className="header-title">
                Hay Day Daku Cello
                <span className="header-badge">Admin Portal</span>
              </h1>
              <p className="header-sub">Kelola katalog harga, stok satuan, dan variasi produk</p>
            </div>
          </div>

          <div className="header-actions">
            <Link href="/" className="btn btn-default" title="Buka Toko Pelanggan">
              👁️ Lihat Toko
            </Link>
            <button type="button" className="btn btn-default" onClick={handleExportExcel} title="Export katalog ke Excel">
              📊 Export Excel
            </button>
            <label className="btn btn-default" style={{ cursor: 'pointer', margin: 0 }} title="Import katalog dari Excel">
              📥 Import Excel
              <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} style={{ display: 'none' }} />
            </label>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout} title="Keluar dari sesi admin">
              🚪 Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="wrap">
        {/* Settings Panel */}
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              ⚙️ Pengaturan Kontak & Catatan Toko
            </h2>
          </div>
          <div className="cfg-grid">
            <div className="fgroup">
              <label>Nomor WhatsApp Penerima Order (Format 628xxx)</label>
              <input
                type="text"
                value={storeData.wa}
                onChange={(e) => {
                  setStoreData({ ...storeData, wa: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="Contoh: 6287719747833"
              />
            </div>
            <div className="fgroup">
              <label>Catatan Footer / Ucapan Terima Kasih</label>
              <input
                type="text"
                value={storeData.thx}
                onChange={(e) => {
                  setStoreData({ ...storeData, thx: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="🌻 Terima kasih sudah percaya! WA: 087719747833 🌻"
              />
            </div>
          </div>
        </section>

        {/* Dashboard 2-column Layout */}
        <div className="admin-layout">
          {/* Category Sidebar */}
          <aside className="cat-sidebar">
            <div className="cat-sidebar-header">
              <span className="cat-sidebar-title">Kategori ({storeData.sections.length})</span>
            </div>
            <div className="cat-nav-list">
              <button
                type="button"
                className={`cat-nav-item ${activeCategoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategoryFilter('all')}
              >
                <span>🌟 Semua Kategori</span>
                <span className="cat-badge">{totalProducts}</span>
              </button>
              {storeData.sections.map((sec, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`cat-nav-item ${String(activeCategoryFilter) === String(idx) ? 'active' : ''}`}
                  onClick={() => setActiveCategoryFilter(idx)}
                >
                  <span>{sec.title}</span>
                  <span className="cat-badge">{sec.items.length}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
              onClick={openAddCategoryModal}
            >
              + Tambah Kategori
            </button>
          </aside>

          {/* Main Content Sections */}
          <div>
            <div className="panel" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="panel-title" style={{ margin: '0 0 4px' }}>
                    📦 Daftar Produk & Pengaturan Harga
                  </h2>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                    Atur nama, icon, satuan dasar, dan harga jual melalui form modal interaktif.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openAddCategoryModal}
                >
                  + Kategori Baru
                </button>
              </div>
            </div>

            {/* List of Category Boxes */}
            {storeData.sections.map((sec, sIdx) => {
              if (activeCategoryFilter !== 'all' && String(activeCategoryFilter) !== String(sIdx)) {
                return null;
              }

              return (
                <div key={sIdx} className="sec-box">
                  <div className="sec-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {sec.title}
                      </span>
                      <button
                        type="button"
                        className="btn btn-default btn-sm"
                        onClick={() => openEditCategoryModal(sIdx)}
                        title="Edit nama kategori"
                      >
                        ✏️ Edit Kategori
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openAddItemModal(sIdx)}
                      >
                        + Tambah Item
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => promptDeleteCategory(sIdx)}
                        title="Hapus kategori ini"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>

                  {/* Desktop View Table */}
                  <div className="table-resp desktop-only-table">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: '130px' }}>Icon Produk</th>
                          <th style={{ width: '200px' }}>Nama Item</th>
                          <th style={{ width: '170px' }}>Satuan Dasar</th>
                          <th style={{ width: '130px' }}>Harga (Rp)</th>
                          <th>Deskripsi</th>
                          <th style={{ width: '45px' }}>Warna</th>
                          <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sec.items.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                              Belum ada produk di kategori ini. Klik <b>+ Tambah Item</b> untuk menambahkan produk pertama.
                            </td>
                          </tr>
                        ) : (
                          sec.items.map((prod, pIdx) => (
                            <tr key={prod.id || pIdx} className="main-item-row">
                              <td className="td-ico">
                                <div className="ico-cell">
                                  <div
                                    className="ico-preview"
                                    onClick={() => openEditItemModal(sIdx, pIdx)}
                                    title="Klik untuk mengedit item"
                                  >
                                    {prod.icons && prod.icons.length > 1 ? (
                                      <div className="ico-bundle-preview">
                                        {prod.icons.slice(0, 4).map((ic, i) => (
                                          <img key={i} src={ic} alt="item" />
                                        ))}
                                      </div>
                                    ) : prod.icon && (prod.icon.startsWith('assets/') || prod.icon.startsWith('data:') || prod.icon.startsWith('http') || prod.icon.startsWith('/')) ? (
                                      <img src={prod.icon.startsWith('/') ? prod.icon : `/${prod.icon}`} alt="icon" />
                                    ) : (
                                      <span>{prod.icon || '📦'}</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="td-name">
                                <b className="desktop-val">{prod.name}</b>
                              </td>
                              <td className="td-unit">
                                <span className="val-text">{prod.unit} {prod.unitType}</span>
                              </td>
                              <td className="td-price">
                                <b className="val-price" style={{ color: '#277220', fontFamily: 'JetBrains Mono, monospace' }}>
                                  Rp{prod.price.toLocaleString('id-ID')}
                                </b>
                              </td>
                              <td className="td-desc">
                                <span className="val-desc" style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                                  {prod.description || '-'}
                                </span>
                              </td>
                              <td className="td-color">
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  backgroundColor: prod.color,
                                  border: '1.5px solid var(--border-subtle)',
                                  display: 'inline-block',
                                  verticalAlign: 'middle'
                                }} />
                              </td>
                              <td className="row-act">
                                <div className="actions-cell-group">
                                  <button
                                    type="button"
                                    className="btn-row-edit"
                                    onClick={() => openEditItemModal(sIdx, pIdx)}
                                    title="Edit item ini"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-row-del"
                                    onClick={() => promptDeleteItem(sIdx, pIdx)}
                                    title="Hapus item ini"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile 2-Column Product Cards Grid */}
                  <div className="mobile-only-cards-grid">
                    {sec.items.length === 0 ? (
                      <div className="mobile-empty-alert">
                        Belum ada produk di kategori ini. Ketuk <b>+ Tambah Item</b> untuk menambah produk.
                      </div>
                    ) : (
                      sec.items.map((prod, pIdx) => (
                        <div key={prod.id || pIdx} className="admin-prod-card">
                          <div className="admin-prod-card-top">
                            <div
                              className="admin-prod-card-icon"
                              onClick={() => openEditItemModal(sIdx, pIdx)}
                              style={{ borderColor: prod.color || '#e2e8f0' }}
                            >
                              {prod.icons && prod.icons.length > 1 ? (
                                <div className="card-bundle-icons">
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
                            <div className="admin-prod-card-actions">
                              <button
                                type="button"
                                className="card-btn-edit"
                                onClick={() => openEditItemModal(sIdx, pIdx)}
                                title="Edit Item"
                                aria-label="Edit Item"
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                className="card-btn-del"
                                onClick={() => promptDeleteItem(sIdx, pIdx)}
                                title="Hapus Item"
                                aria-label="Hapus Item"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          <div className="admin-prod-card-body" onClick={() => openEditItemModal(sIdx, pIdx)}>
                            <div className="admin-prod-name">{prod.name}</div>
                            <div className="admin-prod-unit-badge">{prod.unit} {prod.unitType}</div>
                            <div className="admin-prod-price">
                              Rp{prod.price.toLocaleString('id-ID')}
                            </div>
                            {prod.description && (
                              <div className="admin-prod-desc-text">
                                {prod.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating Bottom Save Bar */}
      <div className="bottom-bar">
        <div className="bottom-bar-status">
          <span className={`status-dot ${isDirty ? 'dirty' : ''}`} />
          <span>{isDirty ? 'Ada perubahan yang belum tersimpan ke Cloud' : 'Semua perubahan tersimpan'}</span>
        </div>
        <button
          type="button"
          className={`btn ${isDirty ? 'btn-primary' : 'btn-saved-idle'}`}
          disabled={!isDirty}
          onClick={handleSaveAll}
          style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 700 }}
        >
          {isDirty ? '💾 Simpan Perubahan' : '✓ Tersimpan'}
        </button>
      </div>

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
        .app-header {
          background: #ffffff;
          border-bottom: 2px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .header-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          object-fit: cover;
          border: 1px solid var(--border-subtle);
        }
        .header-title {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .header-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
          background: var(--primary-light);
          color: var(--primary-dark);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }
        .header-sub {
          margin: 2px 0 0;
          font-size: 12px;
          color: var(--text-muted);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wrap {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 24px 110px;
        }
        .panel {
          background: var(--surface);
          border: 2px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 0 rgba(223, 194, 141, 0.4);
        }
        .panel-header {
          padding-bottom: 12px;
          margin-bottom: 16px;
          border-bottom: 2px dashed var(--border-subtle);
        }
        .panel-title {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
        }
        .cfg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 16px;
        }
        .admin-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 20px;
          align-items: start;
        }
        .cat-sidebar {
          position: sticky;
          top: 84px;
          background: var(--surface);
          border: 2px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 0 rgba(223, 194, 141, 0.4);
        }
        .cat-sidebar-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
        }
        .cat-nav-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
          max-height: calc(100vh - 230px);
          overflow-y: auto;
        }
        .cat-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          background: transparent;
          border: 1.5px solid transparent;
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.15s;
        }
        .cat-nav-item:hover {
          background: var(--surface-subtle);
          color: var(--text-primary);
        }
        .cat-nav-item.active {
          background: #f0f9ed;
          border-color: #8edc82;
          color: #277220;
          font-weight: 700;
        }
        .cat-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          background: #eeddc9;
          color: var(--text-secondary);
          border-radius: 999px;
          padding: 1px 7px;
        }
        .cat-nav-item.active .cat-badge {
          background: #46b23c;
          color: #fff;
        }
        .sec-box {
          margin-bottom: 24px;
          background: var(--surface);
          border: 2px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 0 rgba(223, 194, 141, 0.4);
          overflow: hidden;
        }
        .sec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          background: #fdfbf7;
          border-bottom: 2px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 10px;
        }
        .table-resp {
          width: 100%;
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }
        thead th {
          background: #fdfaf4;
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          padding: 11px 14px;
          border-bottom: 2px solid var(--border-subtle);
          text-align: left;
        }
        tbody tr {
          background: var(--surface);
          border-bottom: 1px dashed var(--border-subtle);
        }
        tbody td {
          padding: 10px 14px;
          vertical-align: middle;
        }
        .ico-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ico-preview {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: var(--surface-subtle);
          border: 1.5px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .ico-preview img {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }
        .ico-bundle-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }
        .ico-bundle-preview img {
          width: 16px;
          height: 16px;
        }
        .btn-row-edit, .btn-row-del {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .btn-row-del {
          border-color: #fca5a5;
          color: #ef4444;
        }
        .bottom-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(8px);
          border-top: 1.5px solid var(--border-subtle);
          padding: 12px 24px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          z-index: 40;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
        }
        .bottom-bar-status {
          margin-right: auto;
          font-size: 13px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }
        .status-dot.dirty {
          background: #f59e0b;
        }
        .btn-saved-idle {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
          cursor: default;
        }

        .mobile-label {
          display: none;
          font-weight: 700;
          color: var(--text-muted);
          font-size: 11.5px;
          min-width: 60px;
        }
        .mobile-item-title-col {
          display: none;
        }

        /* Dual Layout: Desktop Table vs Mobile 2-Column Cards Grid */
        .desktop-only-table {
          display: block;
        }
        .mobile-only-cards-grid {
          display: none;
        }

        .mobile-empty-alert {
          padding: 24px;
          text-align: center;
          font-size: 15px;
          color: var(--text-muted);
          background: #fff;
          border-radius: var(--radius-md);
          border: 1.5px dashed var(--border-subtle);
          grid-column: 1 / -1;
        }

        @media (max-width: 860px) {
          .admin-layout {
            grid-template-columns: 1fr;
          }
          .cat-sidebar {
            position: sticky;
            top: 0;
            z-index: 30;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(8px);
          }
          .cat-sidebar-header {
            display: none;
          }
          .cat-nav-list {
            flex-direction: row;
            overflow-x: auto;
            white-space: nowrap;
            max-height: none;
            gap: 10px;
            scrollbar-width: none;
            padding-bottom: 4px;
          }
          .cat-nav-list::-webkit-scrollbar {
            display: none;
          }
          .cat-nav-item {
            width: auto;
            flex-shrink: 0;
            padding: 9px 16px;
            border-radius: 999px;
            border: 1.5px solid var(--border-subtle);
            background: var(--surface-subtle);
            font-size: 15px;
            font-weight: 700;
          }
          .header-inner {
            height: auto;
            padding: 12px 14px;
            flex-direction: column;
            gap: 12px;
          }
          .header-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            width: 100%;
          }
          .header-actions .btn {
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
            padding: 10px;
          }
          .wrap {
            padding: 12px 10px 120px;
          }
        }

        @media (max-width: 768px) {
          /* Sembunyikan tabel desktop di mobile */
          .desktop-only-table {
            display: none !important;
          }

          /* Tampilkan 2 Kolom Grid Produk (1 Produk = 1 Card) */
          .mobile-only-cards-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
            padding: 8px 0;
          }

          .admin-prod-card {
            background: #ffffff;
            border: 2px solid #e9ecef;
            border-radius: 16px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .admin-prod-card:active {
            transform: scale(0.98);
          }

          .admin-prod-card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
          }

          .admin-prod-card-icon {
            width: 58px;
            height: 58px;
            background: #f8fafc;
            border-radius: 14px;
            border: 2px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
          }
          .admin-prod-card-icon img {
            max-width: 44px;
            max-height: 44px;
            object-fit: contain;
          }

          .card-bundle-icons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2px;
            width: 44px;
            height: 44px;
          }
          .card-bundle-icons img {
            width: 20px;
            height: 20px;
            object-fit: contain;
          }

          .admin-prod-card-actions {
            display: flex;
            gap: 6px;
          }

          .card-btn-edit, .card-btn-del {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            border: 1.5px solid #e2e8f0;
            background: #ffffff;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
          }
          .card-btn-edit:hover, .card-btn-edit:active {
            background: #eff6ff;
            border-color: #3b82f6;
          }
          .card-btn-del:hover, .card-btn-del:active {
            background: #fef2f2;
            border-color: #ef4444;
          }

          .admin-prod-card-body {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex-grow: 1;
          }

          /* Teks Lebih Besar Khusus Pengguna HP */
          .admin-prod-name {
            font-size: 16px;
            font-weight: 800;
            color: #1e293b;
            line-height: 1.25;
            margin-bottom: 2px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .admin-prod-unit-badge {
            font-size: 13.5px;
            font-weight: 700;
            color: #64748b;
            background: #f1f5f9;
            padding: 3px 8px;
            border-radius: 6px;
            display: inline-block;
            align-self: flex-start;
          }

          .admin-prod-price {
            font-size: 17px;
            font-weight: 900;
            color: #2e7d32;
            font-family: 'JetBrains Mono', monospace;
            margin-top: 4px;
          }

          .admin-prod-desc-text {
            font-size: 12.5px;
            color: #94a3b8;
            margin-top: 2px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.3;
          }

          /* Bottom Bar Lebih Besar & Nyaman di HP */
          .bottom-bar {
            padding: 12px 14px calc(14px + env(safe-area-inset-bottom, 0px));
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .bottom-bar-status {
            margin-right: 0;
            justify-content: center;
            font-size: 14px;
            font-weight: 600;
          }
          .bottom-bar button {
            width: 100%;
            justify-content: center;
            font-size: 16px;
            font-weight: 800;
            padding: 12px;
            border-radius: 12px;
          }
        }

        /* Support untuk HP layar sangat kecil (di bawah 360px) tetap 2 kolom seimbang */
        @media (max-width: 360px) {
          .mobile-only-cards-grid {
            gap: 8px !important;
          }
          .admin-prod-card {
            padding: 8px;
          }
          .admin-prod-name {
            font-size: 14.5px;
          }
          .admin-prod-price {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
