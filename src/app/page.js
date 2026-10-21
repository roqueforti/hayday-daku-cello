'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { storeRepository } from '../services/StoreRepository';
import { Cart } from '../models/Cart';
import { ConfirmModal } from '../components/ConfirmModal';

export default function StorePage() {
  const [storeData, setStoreData] = useState({ wa: '6287719747833', thx: '', sections: [] });
  const [cart, setCart] = useState(new Cart());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [customerNote, setCustomerNote] = useState('');
  const [isMobileReceiptOpen, setIsMobileReceiptOpen] = useState(false);
  const [confirmClearCartOpen, setConfirmClearCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2200);
  };

  useEffect(() => {
    // 1. Tampilkan data lokal sebagai instant visual fallback
    const local = storeRepository.loadLocal();
    setStoreData(local);

    // 2. Fetch data terbaru langsung dari Firestore (bypass cache lokal)
    storeRepository.fetchCloud().then((cloudData) => {
      if (cloudData) {
        setStoreData(cloudData);
      }
    });

    // 3. Berlangganan Firestore realtime (jika ada admin yang edit, langsung auto update di layar hp pembeli)
    const unsubscribe = storeRepository.subscribeCloud((cloudData) => {
      if (cloudData) {
        setStoreData(cloudData);
      }
    });

    return () => unsubscribe();
  }, []);

  // Update item cart
  const updateCartQuantity = (product, newQty) => {
    const newCart = new Cart();
    // Copy existing items
    for (const [id, item] of cart.items.entries()) {
      newCart.setItem(item.product, item.quantity);
    }

    const min = product.getMinQuantity();
    const finalQty = Number(newQty);

    if (finalQty <= 0) {
      newCart.removeItem(product.id);
      showToast(`Dihapus: ${product.name}`);
    } else {
      newCart.setItem(product, finalQty);
    }
    setCart(newCart);
  };

  const handleStepQty = (product, delta) => {
    const current = cart.getQuantity(product.id);
    const step = product.getStepQuantity();
    const min = product.getMinQuantity();

    let next;
    if (current === 0) {
      next = delta > 0 ? min : 0;
    } else {
      next = current + (delta * step);
      if (next < min && delta < 0) next = 0;
    }
    updateCartQuantity(product, next);
  };

  const clearAllCart = () => {
    const newCart = new Cart();
    setCart(newCart);
    setConfirmClearCartOpen(false);
    showToast("Keranjang berhasil dikosongkan 🧹");
  };

  // Filter items
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return storeData.sections.map(sec => {
      const matchedItems = sec.items.filter(it => {
        if (!q) return true;
        const n = (it.name || '').toLowerCase();
        const d = (it.description || '').toLowerCase();
        return n.includes(q) || d.includes(q);
      });
      return {
        ...sec,
        items: matchedItems
      };
    }).filter(sec => sec.items.length > 0);
  }, [storeData, searchQuery]);

  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false);

  const handleOpenCheckoutModal = () => {
    if (cart.getTotalItemCount() === 0) {
      showToast("Pilih minimal 1 produk terlebih dahulu! 🌱");
      return;
    }
    setIsOrderConfirmOpen(true);
  };

  const handleSendOrderToWA = () => {
    if (cart.getTotalItemCount() === 0) return;
    const msg = cart.generateWhatsAppMessage(customerNote);
    const cleanWa = (storeData.wa || '6287719747833').replace(/\D/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanWa}&text=${encodeURIComponent(msg)}`;
    setIsOrderConfirmOpen(false);
    window.open(waUrl, '_blank');
  };

  const totalAmount = cart.getTotalPrice();
  const totalCount = cart.getTotalItemCount();

  return (
    <div className="store-app-wrap">
      {/* Beautiful Fluffy Animated Vector Clouds */}
      <div className="sky-clouds" aria-hidden="true">
        <div className="cloud cloud-1">
          <svg viewBox="0 0 100 45" fill="currentColor">
            <path d="M 20 38 Q 8 38 8 26 Q 8 16 18 16 Q 22 6 34 6 Q 44 6 48 13 Q 54 4 66 4 Q 78 4 82 14 Q 92 14 92 25 Q 92 38 80 38 Z" />
          </svg>
        </div>
        <div className="cloud cloud-2">
          <svg viewBox="0 0 100 45" fill="currentColor">
            <path d="M 22 36 Q 10 36 10 26 Q 10 18 19 18 Q 23 9 33 9 Q 42 9 46 15 Q 52 7 64 7 Q 75 7 79 16 Q 88 16 88 26 Q 88 36 78 36 Z" />
          </svg>
        </div>
        <div className="cloud cloud-3">
          <svg viewBox="0 0 100 45" fill="currentColor">
            <path d="M 18 38 Q 6 38 6 27 Q 6 17 16 17 Q 20 7 32 7 Q 41 7 46 14 Q 53 5 65 5 Q 77 5 81 15 Q 92 15 92 26 Q 92 38 78 38 Z" />
          </svg>
        </div>
        <div className="cloud cloud-4">
          <svg viewBox="0 0 100 45" fill="currentColor">
            <path d="M 20 35 Q 11 35 11 25 Q 11 18 20 18 Q 24 10 34 10 Q 42 10 46 16 Q 52 8 63 8 Q 74 8 78 17 Q 86 17 86 26 Q 86 35 76 35 Z" />
          </svg>
        </div>
      </div>

      <div className="wrap">
        {/* Header Sign with Wooden Plank, Pets, and Notice */}
        <header className="main-sign-header">
          <div className="sign">
            <img src="/logo-daku-cello.jpeg" alt="Hay Day Daku Cello" className="logo-img" />
          </div>
          <div className="pets">
            <span>🐄</span><span>🐔</span><span>🌾</span><span>🐖</span><span>🚜</span>
          </div>
          <div className="rule">⚠️ Pembelian minimal 10 per item ⚠️</div>
        </header>

        {/* Search Bar Produk Hay Day */}
        <div className="search-wrap">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Cari produk (contoh: sekop, babi, bem, koin, krim)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button type="button" className="search-clear" onClick={() => setSearchQuery('')} title="Hapus pencarian">✕</button>
            )}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="stats">
          <div className="stat">
            <small>📦 Total Item</small>
            <b>{storeData.sections.reduce((acc, s) => acc + s.items.length, 0)}</b>
          </div>
          <div className="stat">
            <small>🛒 Dipilih</small>
            <b>{totalCount}</b>
          </div>
          <div className="stat">
            <small>💵 Perkiraan Harga</small>
            <b>Rp{Math.round(totalAmount).toLocaleString('id-ID')}</b>
          </div>
        </div>

        {/* Search Empty Notice */}
        {filteredSections.length === 0 && (
          <div className="search-empty">
            <div className="search-empty-icon">🌾</div>
            <h3 className="search-empty-text">Produk tidak ditemukan</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '14px' }}>
              Coba gunakan kata kunci lain seperti nama bahan, alat, atau koin.
            </p>
          </div>
        )}

        {/* Sticky Category Navigation: Mobile Custom Dropdown & Desktop Horizontal Pills */}
        <nav className="cat-nav-sticky" aria-label="Kategori Produk">
          {/* Mobile Category Dropdown Selector */}
          <div className="cat-dropdown-mobile">
            <label htmlFor="cat-mobile-select" className="cat-dropdown-label">
              Pilih Kategori:
            </label>
            <div className="cat-select-wrapper">
              <select
                id="cat-mobile-select"
                className="cat-select"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option value="all">🌾 Semua Kategori ({storeData.sections.reduce((acc, s) => acc + s.items.length, 0)} produk)</option>
                {storeData.sections.map((sec, idx) => (
                  <option key={idx} value={String(idx)}>
                    {sec.title} ({sec.items.length} produk)
                  </option>
                ))}
              </select>
              <span className="cat-select-arrow">▼</span>
            </div>
          </div>

          {/* Desktop / Tablet Horizontal Category Pills */}
          <div className="cat-pills-desktop">
            <button
              type="button"
              className={`cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              🌾 Semua Kategori
            </button>
            {storeData.sections.map((sec, idx) => (
              <button
                key={idx}
                type="button"
                className={`cat-pill ${String(activeCategory) === String(idx) ? 'active' : ''}`}
                onClick={() => setActiveCategory(String(idx))}
              >
                {sec.title}
              </button>
            ))}
          </div>
        </nav>

        {/* Main 2-Column Store Layout: Left Catalog, Right Sticky Barn Receipt */}
        <div className="store-layout">
          {/* Left: Product Catalog by Sections */}
          <div className="catalog-col">
            {filteredSections.map((sec, sIdx) => {
              if (activeCategory !== 'all' && String(activeCategory) !== String(sIdx)) {
                return null;
              }

              return (
                <div key={sIdx} className="sec-group" id={`sec-${sIdx}`}>
                  <div className="sec">
                    <span>{sec.title}</span>
                    <i></i>
                  </div>

                  <div className="grid">
                    {sec.items.map((prod) => {
                      const qty = cart.getQuantity(prod.id);
                      const isSelected = qty > 0;
                      const displayPrice = isSelected ? prod.calculatePriceForQuantity(qty) : prod.price;
                      const displayQty = isSelected ? qty : prod.unit;
                      const descText = prod.description && prod.description.trim()
                        ? prod.description.trim()
                        : (sec.isPackage ? "Per paket" : `Min. beli ${prod.getMinQuantity()} • harga per ${prod.getUnitLabel()}`);

                      return (
                        <div key={prod.id} className={`card ${isSelected ? 'on' : ''}`}>
                          <div className="crate-box">
                            <div className="crate-qty">{displayQty}x</div>
                            <div className="ico">
                              {prod.icons && prod.icons.length > 1 ? (
                                <div className="ico-bundle">
                                  {prod.icons.slice(0, 4).map((ic, i) => (
                                    <img key={i} src={ic} alt={prod.name} />
                                  ))}
                                </div>
                              ) : prod.icon && (prod.icon.startsWith('assets/') || prod.icon.startsWith('data:') || prod.icon.startsWith('http')) ? (
                                <img src={prod.icon} alt={prod.name} />
                              ) : (
                                <span>{prod.icon || '📦'}</span>
                              )}
                            </div>
                            <div className="price-tag-wrap">
                              <div className="price-tag">
                                <span className="price-num">Rp{Math.round(displayPrice).toLocaleString('id-ID')}</span>
                                <img src="/assets/icons/Coins.png" className="coin-icon" alt="Koin" onError={(e) => { e.target.style.display = 'none'; }} />
                              </div>
                            </div>
                          </div>

                          <div className="nm">{prod.name}</div>
                          <div className="desc">{descText}</div>

                          <div className="card-ctrl-container">
                            {qty === 0 ? (
                              <button
                                type="button"
                                className="add"
                                onClick={() => handleStepQty(prod, 1)}
                              >
                                ＋ Pilih
                              </button>
                            ) : (
                              <div>
                                <div className="ctl">
                                  <button type="button" onClick={() => handleStepQty(prod, -1)}>−</button>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    value={qty}
                                    onChange={(e) => updateCartQuantity(prod, e.target.value)}
                                  />
                                  <button type="button" onClick={() => handleStepQty(prod, 1)}>+</button>
                                </div>
                                <div className="sub">
                                  {prod.unitType === 'paket' && qty === 1
                                    ? `Rp${Math.round(displayPrice).toLocaleString('id-ID')}`
                                    : `${qty} ${prod.unitType} = Rp${Math.round(displayPrice).toLocaleString('id-ID')}`}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Sticky Desktop Barn Receipt Panel (Kasir Nota) */}
          <aside className="sidebar-col">
            <div className="barn-receipt">
              <div className="barn-receipt-header">
                <div className="barn-receipt-title">
                  <span>📋 Nota Pesanan</span>
                </div>
                <span style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: '12px',
                  background: 'rgba(255,255,255,0.25)',
                  color: '#fff',
                  borderRadius: '999px',
                  padding: '3px 10px',
                  fontWeight: 700
                }}>
                  {totalCount} item
                </span>
              </div>

              <div className="barn-receipt-body">
                {totalCount === 0 ? (
                  <div className="barn-receipt-empty">
                    🌾 Belum ada item yang dipilih.<br />
                    <span style={{ fontSize: '12px', opacity: 0.8 }}>Pilih produk di katalog untuk mengisi keranjang belanja.</span>
                  </div>
                ) : (
                  <div>
                    {cart.getAllItems().map((it) => (
                      <div key={it.product.id} className="barn-receipt-item">
                        <div className="barn-receipt-item-info">
                          <div className="barn-receipt-item-ico">
                            {it.product.icon && (it.product.icon.startsWith('assets/') || it.product.icon.startsWith('http') || it.product.icon.startsWith('data:')) ? (
                              <img src={it.product.icon} alt="ico" />
                            ) : (
                              <span>{it.product.icon || '📦'}</span>
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div className="barn-receipt-item-name">{it.product.name}</div>
                            <div className="barn-receipt-item-qty">{it.quantity} {it.product.unitType}</div>
                          </div>
                        </div>
                        <div className="barn-receipt-item-right">
                          <div className="barn-receipt-item-price">Rp{Math.round(it.getSubtotal()).toLocaleString('id-ID')}</div>
                          <button
                            type="button"
                            className="cart-item-del"
                            onClick={() => updateCartQuantity(it.product, 0)}
                            title="Hapus"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="barn-receipt-footer">
                <div className="barn-receipt-total">
                  <span>Total:</span>
                  <span>Rp{Math.round(totalAmount).toLocaleString('id-ID')}</span>
                </div>
                <div className="barn-receipt-actions">
                  <button
                    type="button"
                    className="b wa"
                    style={{ width: '100%', fontSize: '15px', padding: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={handleOpenCheckoutModal}
                  >
                    💬 Lanjut Pesan ke WA
                  </button>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="b cp"
                      style={{ flex: 1, padding: '9px', fontSize: '13px' }}
                      onClick={() => {
                        const msg = cart.generateWhatsAppMessage(customerNote);
                        if (!msg) return showToast("Belum ada item dipilih 🌱");
                        navigator.clipboard.writeText(msg);
                        showToast("List pesanan disalin ke clipboard! 📋");
                      }}
                    >
                      📋 Salin List
                    </button>
                    <button
                      type="button"
                      className="b rs"
                      style={{ padding: '9px 12px', fontSize: '13px' }}
                      onClick={() => setConfirmClearCartOpen(true)}
                    >
                      🔄 Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Payment Methods Section */}
        <div className="pay">
          <h3>💳 Metode Pembayaran</h3>
          <div className="chips">
            <span style={{ background: '#5b2ec9' }}>OVO</span>
            <span style={{ background: '#118ee9' }}>DANA</span>
            <span style={{ background: '#ee4d2d' }}>Shopee</span>
            <span style={{ background: '#0a5db3' }}>BRI</span>
            <span style={{ background: '#f08a00' }}>SeaBank</span>
            <span style={{ background: '#00a5cf' }}>GoPay</span>
          </div>
          <div className="thx">
            {storeData.thx || '🌻 Terima kasih sudah percaya! WA: 087719747833 🌻'}
          </div>
        </div>
      </div>

      {/* Bottom Floating Bar on Mobile */}
      <div className="bar">
        <div className="in">
          <div className="tot">
            <small>{totalCount > 0 ? `${totalCount} item dipilih` : 'Belum ada item dipilih'}</small>
            <span>Rp{Math.round(totalAmount).toLocaleString('id-ID')}</span>
          </div>
          <button
            type="button"
            className="b cp"
            onClick={() => {
              const msg = cart.generateWhatsAppMessage(customerNote);
              if (!msg) return showToast("Belum ada item dipilih 🌱");
              navigator.clipboard.writeText(msg);
              showToast("List pesanan disalin! 📋");
            }}
          >
            📋 Salin
          </button>
          <button
            type="button"
            className="b rs"
            onClick={() => setConfirmClearCartOpen(true)}
          >
            🔄 Reset
          </button>
          <button
            type="button"
            className="b wa"
            onClick={handleOpenCheckoutModal}
          >
            💬 Pesan via WA
          </button>
        </div>
      </div>

      {/* Modal Konfirmasi Pengecekan Pesanan Sebelum WA */}
      {isOrderConfirmOpen && (
        <div className="modal-bg active" onClick={() => setIsOrderConfirmOpen(false)}>
          <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-title">
              <span style={{ fontFamily: 'Fredoka, Nunito, sans-serif', fontSize: '18px', fontWeight: 700, color: '#381e09' }}>
                📋 Cek Rincian Pesanan
              </span>
              <button className="modal-close" onClick={() => setIsOrderConfirmOpen(false)}>✕</button>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#6e4a25' }}>
              Pastikan jumlah dan jenis item pesanan Anda sudah sesuai sebelum diteruskan ke WhatsApp admin.
            </p>

            <div className="receipt-items-list" style={{ maxHeight: '42vh', overflowY: 'auto', background: '#fdfaf4', padding: '8px 12px', borderRadius: '12px', border: '1.5px solid #ebdcc8' }}>
              {cart.getAllItems().map((item) => (
                <div key={item.product.id} className="receipt-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed #ebdcc8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff', border: '1px solid #ebdcc8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.product.icon && (item.product.icon.startsWith('assets/') || item.product.icon.startsWith('http') || item.product.icon.startsWith('data:')) ? (
                        <img src={item.product.icon} alt="ico" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: '20px' }}>{item.product.icon || '📦'}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#381e09' }}>{item.product.name}</div>
                      <small style={{ color: '#8d5d36' }}>{item.quantity} {item.product.unitType}</small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <b style={{ color: '#277220', fontFamily: 'JetBrains Mono, monospace', fontSize: '14px' }}>
                      Rp{Math.round(item.getSubtotal()).toLocaleString('id-ID')}
                    </b>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.product, 0)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '15px', padding: '2px 4px' }}
                      title="Hapus item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Catatan Tambahan (Opsional) */}
            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6e4a25', marginBottom: '4px' }}>
                Catatan Pesanan / Tagar Hay Day (Opsional):
              </label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Contoh: Tagar #9V8PYCGQ atau catatan waktu online..."
                style={{ width: '100%', height: '38px', borderRadius: '10px', border: '1.5px solid #ebdcc8', padding: '0 10px', fontSize: '13px', outline: 'none' }}
              />
            </div>

            {/* Total Pembayaran & Tombol Lanjut */}
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '2px solid #ebdcc8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#6e4a25' }}>Total Estimasi ({totalCount} jenis produk):</span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#277220', fontFamily: 'JetBrains Mono, monospace' }}>
                  Rp{Math.round(totalAmount).toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => setIsOrderConfirmOpen(false)}
                  style={{ justifyContent: 'center', padding: '10px', fontWeight: 700 }}
                >
                  Ubah Pesanan
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSendOrderToWA}
                  style={{ justifyContent: 'center', padding: '10px', fontSize: '14px', fontWeight: 800 }}
                >
                  Kirim ke WhatsApp 💬
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Receipt Drawer Modal */}
      {isMobileReceiptOpen && (
        <div className="modal-bg active" onClick={() => setIsMobileReceiptOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <span>🧾 Rincian Pesanan ({totalCount} item)</span>
              <button className="modal-close" onClick={() => setIsMobileReceiptOpen(false)}>✕</button>
            </div>
            <div className="receipt-items-list" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {cart.getAllItems().map((item) => (
                <div key={item.product.id} className="receipt-item-row">
                  <div>
                    <b>{item.product.name}</b>
                    <div><small>{item.quantity} {item.product.unitType}</small></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <b>Rp{Math.round(item.getSubtotal()).toLocaleString('id-ID')}</b>
                    <button
                      type="button"
                      className="receipt-item-del"
                      onClick={() => updateCartQuantity(item.product, 0)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '2px dashed #ebdcc8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '16px' }}>
                <b>Total:</b>
                <b style={{ color: '#277220', fontSize: '18px' }}>Rp{Math.round(totalAmount).toLocaleString('id-ID')}</b>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px' }}
                onClick={() => {
                  setIsMobileReceiptOpen(false);
                  handleOpenCheckoutModal();
                }}
              >
                Lanjut Kirim ke WhatsApp 💬
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UI Confirmation Modal for Clearing Cart */}
      <ConfirmModal
        isOpen={confirmClearCartOpen}
        title="Kosongkan Keranjang?"
        message="Seluruh item yang telah Anda pilih akan dihapus dari daftar nota belanja."
        confirmText="Ya, Kosongkan"
        cancelText="Batal"
        type="danger"
        onConfirm={clearAllCart}
        onCancel={() => setConfirmClearCartOpen(false)}
      />

      {/* Toast Alert */}
      <div className={`toast ${toastMessage ? 's' : ''}`}>{toastMessage}</div>

      <style jsx>{`
        /* Fluffy Sky Clouds with Smooth Hardware-Accelerated Floating Animation */
        .sky-clouds {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }
        .cloud {
          position: absolute;
          width: 140px;
          height: 48px;
          color: #ffffff;
          filter: drop-shadow(0 8px 16px rgba(45, 115, 230, 0.12));
          opacity: 0.88;
          will-change: transform;
          animation: driftClouds linear infinite;
        }
        .cloud svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .cloud-1 {
          top: 45px;
          width: 160px;
          animation-duration: 48s;
          transform: translate3d(-200px, 0, 0);
        }
        .cloud-2 {
          top: 135px;
          width: 110px;
          opacity: 0.72;
          animation-duration: 72s;
          animation-delay: -24s;
          transform: translate3d(-200px, 0, 0);
        }
        .cloud-3 {
          top: 220px;
          width: 180px;
          opacity: 0.65;
          animation-duration: 90s;
          animation-delay: -50s;
          transform: translate3d(-250px, 0, 0);
        }
        .cloud-4 {
          top: 320px;
          width: 95px;
          opacity: 0.55;
          animation-duration: 60s;
          animation-delay: -10s;
          transform: translate3d(-200px, 0, 0);
        }
        @keyframes driftClouds {
          0% {
            transform: translate3d(-260px, 0, 0);
          }
          50% {
            transform: translate3d(calc(50vw - 70px), 8px, 0);
          }
          100% {
            transform: translate3d(calc(100vw + 260px), 0, 0);
          }
        }

        .store-app-wrap {
          width: 100%;
          max-width: 100vw;
          overflow-x: clip;
          position: relative;
        }

        .wrap {
          position: relative;
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          padding: 18px 20px 140px;
          z-index: 1;
          box-sizing: border-box;
        }

        .main-sign-header {
          text-align: center;
          position: relative;
          margin-bottom: 20px;
        }
        .admin-portal-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #dfc28d;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #381e09;
          text-decoration: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
          transition: all 0.15s ease;
        }
        .admin-portal-link:hover {
          background: #ffffff;
          transform: translateY(-1px);
        }
        .sign {
          display: inline-block;
          background: linear-gradient(var(--wood), var(--wood2));
          border: 5px solid #6b3c12;
          border-radius: 28px;
          padding: 10px;
          box-shadow: 0 8px 0 #5a3010, 0 14px 24px rgba(90, 50, 10, 0.25);
          transform: rotate(-1.5deg);
        }
        .logo-img {
          width: clamp(180px, 45vw, 280px);
          height: auto;
          display: block;
          margin: 0 auto;
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45));
          transition: 0.25s;
          border-radius: 22px;
        }
        .logo-img:hover {
          transform: scale(1.04) rotate(1.5deg);
        }
        .pets {
          font-size: 34px;
          margin-top: 12px;
          letter-spacing: 8px;
        }
        .pets span {
          display: inline-block;
          animation: hop 1.8s ease-in-out infinite;
        }
        .pets span:nth-child(2) { animation-delay: 0.25s; }
        .pets span:nth-child(3) { animation-delay: 0.5s; }
        .pets span:nth-child(4) { animation-delay: 0.75s; }
        .pets span:nth-child(5) { animation-delay: 1s; }
        @keyframes hop {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-12px) rotate(-8deg); }
        }
        .rule {
          margin: 14px auto 0;
          max-width: 560px;
          background: #fff3b0;
          color: #7a3b00;
          border: 3px dashed #e58a00;
          border-radius: 16px;
          padding: 10px 14px;
          font-weight: 800;
          text-align: center;
          animation: pulse 2.4s ease-in-out infinite;
        }
        @keyframes pulse {
          50% { transform: scale(1.025); }
        }

        /* Search Bar */
        .search-wrap {
          margin: 16px auto 10px;
          max-width: 580px;
          position: relative;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: #fff;
          border: 3px solid var(--line);
          border-radius: 20px;
          padding: 6px 14px;
          box-shadow: 0 4px 0 var(--line), 0 8px 16px rgba(90, 50, 10, 0.25);
          transition: 0.2s;
        }
        .search-box:focus-within {
          border-color: var(--wood);
          box-shadow: 0 4px 0 var(--wood2), 0 10px 20px rgba(90, 50, 10, 0.25);
          transform: translateY(-2px);
        }
        .search-icon {
          font-size: 20px;
          margin-right: 8px;
          user-select: none;
        }
        .search-input {
          flex: 1;
          border: none !important;
          outline: none;
          font-family: "Nunito", sans-serif;
          font-weight: 800;
          font-size: 16px;
          color: #2c1605 !important;
          background: transparent;
        }
        .search-clear {
          background: var(--line);
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          color: #fff;
        }
        .search-empty {
          text-align: center;
          padding: 30px 16px;
          background: var(--card);
          border: 3px dashed var(--line);
          border-radius: 20px;
          margin-top: 16px;
        }
        .search-empty-icon {
          font-size: 40px;
          margin-bottom: 6px;
        }
        .search-empty-text {
          font-family: "Lilita One", sans-serif;
          font-size: 20px;
          color: var(--wood2);
          margin: 0;
        }

        /* Stats */
        .stats {
          display: flex;
          gap: 10px;
          margin: 16px 0 6px;
          flex-wrap: wrap;
        }
        .stat {
          flex: 1;
          min-width: 140px;
          background: var(--card);
          border: 3px solid var(--line);
          border-radius: 16px;
          padding: 8px 12px;
          text-align: center;
          box-shadow: 0 4px 0 var(--line);
        }
        .stat small {
          display: block;
          color: var(--muted);
          font-weight: 800;
        }
        .stat b {
          font-family: "Lilita One", sans-serif;
          font-weight: 400;
          font-size: 24px;
        }

        /* Sticky Category Navigation */
        .cat-nav-sticky {
          position: sticky;
          top: 12px;
          z-index: 20;
          background: rgba(255, 250, 240, 0.96);
          backdrop-filter: blur(10px);
          border: 3px solid var(--line);
          border-radius: 18px;
          padding: 8px 12px;
          margin: 16px 0 20px;
          box-shadow: 0 5px 0 var(--line), 0 10px 22px rgba(60, 30, 5, 0.2);
        }

        /* Mobile Dropdown Styling */
        .cat-dropdown-mobile {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .cat-dropdown-label {
          font-family: 'Fredoka', 'Nunito', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #4a2709;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .cat-select-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .cat-select {
          width: 100%;
          height: 40px !important;
          background: #ffffff !important;
          border: 2px solid #9e6427 !important;
          border-radius: 12px !important;
          padding: 0 34px 0 12px !important;
          font-family: 'Fredoka', 'Nunito', sans-serif !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #381e09 !important;
          box-shadow: 0 2px 0 #734515 !important;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
        }
        .cat-select:focus {
          border-color: #2da323 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(45, 163, 35, 0.25) !important;
        }

        .cat-select-arrow {
          position: absolute;
          right: 12px;
          font-size: 11px;
          color: #734515;
          pointer-events: none;
        }

        /* Desktop Horizontal Pills */
        .cat-pills-desktop {
          display: none;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          white-space: nowrap;
          scrollbar-width: none;
        }
        .cat-pills-desktop::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 768px) {
          .cat-dropdown-mobile {
            display: none;
          }
          .cat-pills-desktop {
            display: flex;
          }
        }

        .cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 2px solid var(--line);
          border-radius: 999px;
          padding: 7px 16px;
          font-family: "Fredoka", "Nunito", sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #4a2709;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 2px 0 var(--line);
          flex-shrink: 0;
        }
        .cat-pill:hover {
          background: #fdf5e2;
          transform: translateY(-2px);
        }
        .cat-pill.active {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #ffffff;
          border-color: #047857;
          box-shadow: 0 3px 0 #047857;
        }

        /* 2-Column Store Layout */
        .store-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 26px;
          align-items: start;
          margin-top: 14px;
        }
        .catalog-col {
          min-width: 0;
        }
        .sidebar-col {
          position: sticky;
          top: 80px;
        }

        .sec {
          margin: 28px 0 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sec span {
          font-family: "Fredoka", "Nunito", sans-serif;
          font-weight: 600;
          font-size: 19px;
          letter-spacing: 0.3px;
          color: #ffffff;
          background: linear-gradient(135deg, #a36125, #753f12);
          border: 2px solid #5a2e0a;
          border-radius: 12px;
          padding: 6px 18px;
          box-shadow: 0 3px 0 #4a2406, 0 4px 10px rgba(0, 0, 0, 0.15);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .sec i {
          flex: 1;
          height: 4px;
          border-radius: 4px;
          background: repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.5) 0 12px,
            transparent 12px 20px
          );
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
          gap: 16px;
        }

        /* Kotak Peti Toko Hay Day (Roadside Shop Crate Box) */
        .card {
          position: relative;
          background: #fdf6e7;
          border: 4px solid #9e6427;
          border-radius: 20px;
          padding: 10px 10px 12px;
          text-align: center;
          box-shadow: 0 5px 0 #734515, 0 10px 18px rgba(56, 26, 7, 0.28);
          transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
        }
        .card:hover {
          transform: translateY(-5px) scale(1.02);
        }
        .card.on {
          border-color: #2da323;
          box-shadow: 0 5px 0 #1b6d14, 0 10px 18px rgba(56, 26, 7, 0.28);
        }
        .card.on::after {
          content: "✔";
          position: absolute;
          top: -10px;
          right: -8px;
          background: #2da323;
          color: #fff;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          line-height: 32px;
          font-size: 17px;
          box-shadow: 0 3px 0 #1b6d14;
          z-index: 5;
        }

        /* Wadah Peti Kayu Bagian Dalam (Wood Box Tray) */
        .crate-box {
          position: relative;
          background: linear-gradient(180deg, #ecc37e 0%, #deb065 100%);
          border: 4px solid #caa157;
          box-shadow:
            inset 0 4px 6px rgba(90, 50, 10, 0.35),
            inset 0 -3px 4px rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 12px 8px 18px;
          margin-bottom: 8px;
          min-height: 115px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }
        .crate-box::before {
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
        .crate-qty {
          position: absolute;
          top: 6px;
          left: 8px;
          font-family: "Lilita One", Impact, sans-serif;
          font-size: 26px;
          color: #ffffff;
          -webkit-text-stroke: 1.6px #2b1402;
          text-shadow: 2px 2px 0 #2b1402, 0 3px 4px rgba(0, 0, 0, 0.4);
          line-height: 1;
          letter-spacing: 0.5px;
          z-index: 2;
          pointer-events: none;
        }
        .ico {
          font-size: 54px;
          line-height: 1.1;
          filter: drop-shadow(0 6px 4px rgba(60, 30, 5, 0.45));
          transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        .ico img {
          max-width: 66px;
          max-height: 66px;
          object-fit: contain;
          display: block;
        }
        .ico-bundle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          width: 100%;
          height: 100%;
        }
        .ico-bundle img {
          max-width: 42px;
          max-height: 48px;
          filter: drop-shadow(0 4px 3px rgba(60, 30, 5, 0.4));
          transition: 0.2s;
        }
        .ico-bundle img:nth-child(1) { transform: rotate(-8deg) scale(0.95); }
        .ico-bundle img:nth-child(2) { transform: translateY(-4px) scale(1.05); z-index: 2; }
        .ico-bundle img:nth-child(3) { transform: rotate(8deg) scale(0.95); }

        .price-tag-wrap {
          position: absolute;
          bottom: -12px;
          right: 4px;
          z-index: 3;
          transform: rotate(-4deg);
          filter: drop-shadow(0 3px 4px rgba(60, 30, 5, 0.35));
          transition: 0.2s;
        }
        .card:hover .price-tag-wrap {
          transform: rotate(-2deg) scale(1.05);
        }
        .price-tag {
          background: #ffffec;
          border: 2px solid #57310f;
          border-radius: 8px;
          padding: 3px 8px 3px 10px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          box-shadow: inset 0 -2px 0 #e6dbb3;
        }
        .price-tag .price-num {
          font-family: "Fredoka", "Nunito", sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #2b1402;
          letter-spacing: 0.2px;
          line-height: 1;
        }
        .price-tag .coin-icon {
          width: 22px;
          height: 22px;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
        }

        .nm {
          font-family: "Fredoka", "Nunito", sans-serif;
          font-weight: 600;
          font-size: 16px;
          margin: 10px 0 3px;
          color: #2c1605;
          letter-spacing: 0.2px;
          line-height: 1.25;
        }
        .desc {
          font-size: 12px;
          color: #634325;
          background: #f7ebd4;
          border: 1px dashed var(--line);
          border-radius: 8px;
          padding: 4px 8px;
          margin: 6px 0 2px;
          line-height: 1.35;
          font-weight: 600;
          text-align: center;
        }
        .card-ctrl-container {
          margin-top: auto;
        }
        .add {
          margin-top: 10px;
          width: 100%;
          border: 0;
          border-radius: 12px;
          padding: 8px 12px;
          font-family: "Fredoka", "Nunito", sans-serif;
          font-weight: 600;
          font-size: 16px;
          letter-spacing: 0.3px;
          color: #fff;
          background: var(--green);
          box-shadow: 0 3px 0 #2f8a28;
          cursor: pointer;
          transition: 0.15s;
        }
        .add:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 #2f8a28;
        }
        .ctl {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 10px;
        }
        .ctl button {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 12px;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          background: var(--wood);
          box-shadow: 0 4px 0 var(--wood2);
          cursor: pointer;
        }
        .ctl button:active {
          transform: translateY(3px);
          box-shadow: 0 1px 0 var(--wood2);
        }
        .ctl input {
          width: 64px;
          height: 36px;
          text-align: center;
          border: 3px solid var(--line);
          border-radius: 12px;
          font: 800 16px "Nunito", sans-serif;
          background: #fff;
          color: #4a2c12;
        }
        .sub {
          font-family: "Fredoka", "Nunito", sans-serif;
          font-size: 13.5px;
          color: #3b1d06;
          background: #f5e6cc;
          border: 1px solid #dfc29a;
          border-radius: 8px;
          padding: 3px 8px;
          margin-top: 8px;
          min-height: 22px;
          font-weight: 700;
          display: inline-block;
          letter-spacing: 0.2px;
        }

        /* Desktop Sticky Barn Receipt Panel */
        .barn-receipt {
          background: #ffffff;
          border: 4px solid var(--line);
          border-radius: 24px;
          box-shadow: 0 8px 0 var(--line), 0 16px 30px rgba(56, 26, 7, 0.28);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .barn-receipt-header {
          background: linear-gradient(135deg, #8a4a15, #633209);
          color: #ffffff;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .barn-receipt-title {
          font-family: "Lilita One", sans-serif;
          font-size: 18px;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .barn-receipt-body {
          padding: 14px 18px;
          max-height: calc(100vh - 280px);
          overflow-y: auto;
        }
        .barn-receipt-empty {
          text-align: center;
          padding: 32px 14px;
          color: #64748b;
          font-size: 13.5px;
        }
        .barn-receipt-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #e2e8f0;
          gap: 10px;
        }
        .barn-receipt-item-info {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .barn-receipt-item-ico {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .barn-receipt-item-ico img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
        .barn-receipt-item-name {
          font-family: "Fredoka", "Nunito", sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .barn-receipt-item-qty {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }
        .barn-receipt-item-right {
          text-align: right;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .barn-receipt-item-price {
          font-family: "Fredoka", "Nunito", sans-serif;
          font-weight: 700;
          font-size: 14.5px;
          color: #059669;
        }
        .cart-item-del {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          font-weight: 800;
          font-size: 13px;
        }
        .barn-receipt-footer {
          background: #f8fafc;
          border-top: 2px solid #e2e8f0;
          padding: 16px 18px;
        }
        .barn-receipt-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          font-family: "Fredoka", "Nunito", sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #1e293b;
        }
        .barn-receipt-total span:last-child {
          font-size: 20px;
          color: #059669;
        }
        .barn-receipt-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Pay Box */
        .pay {
          margin-top: 30px;
          background: var(--card);
          border: 3px solid var(--line);
          border-radius: 20px;
          padding: 16px;
          text-align: center;
        }
        .pay h3 {
          margin: 0 0 10px;
          font-family: "Lilita One", sans-serif;
          font-weight: 400;
          font-size: 22px;
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .chips span {
          padding: 6px 14px;
          border-radius: 30px;
          color: #fff;
          font-weight: 800;
        }
        .thx {
          margin-top: 12px;
          color: var(--muted);
          font-weight: 800;
        }

        /* Bottom Floating Bar on Mobile */
        .bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px));
          background: linear-gradient(var(--wood), var(--wood2));
          border-top: 4px solid #6b3c12;
          box-shadow: 0 -8px 20px rgba(56, 26, 7, 0.28);
          z-index: 50;
        }
        .bar .in {
          max-width: 980px;
          margin: auto;
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .tot {
          color: #fff;
          font-family: "Fredoka", "Nunito", sans-serif;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 0.3px;
          flex: 1;
          min-width: 150px;
          line-height: 1.15;
        }
        .tot small {
          display: block;
          font-family: "Nunito", sans-serif;
          font-weight: 700;
          font-size: 12px;
          opacity: 0.9;
          letter-spacing: 0;
        }
        .b {
          border: 0;
          border-radius: 12px;
          padding: 9px 16px;
          font-family: "Fredoka", "Nunito", sans-serif;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.3px;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 3px 0 #0004;
          transition: 0.15s;
        }
        .b:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 #0004;
        }
        .b.wa { background: #25b24f; }
        .b.cp { background: #2f7fe0; }
        .b.rs { background: var(--red); }

        @media (max-width: 600px) {
          .wrap {
            padding: 12px 10px 170px;
          }
          .sign {
            padding: 8px 18px 10px;
            border-width: 4px;
          }
          .stats {
            gap: 6px;
          }
          .stat {
            min-width: 90px;
            padding: 6px 8px;
          }
          .stat b {
            font-size: 20px;
          }
          .grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .card {
            padding: 8px 8px 10px;
            border-radius: 16px;
          }
          .crate-box {
            min-height: 95px;
            padding: 8px 6px 14px;
            border-radius: 14px;
          }
          .crate-qty {
            font-size: 22px;
            top: 4px;
            left: 6px;
          }
          .ico {
            font-size: 44px;
            height: 52px;
          }
          .ico img {
            max-width: 48px;
            max-height: 48px;
          }
          .price-tag-wrap {
            bottom: -10px;
            right: 2px;
          }
          .price-tag {
            padding: 2px 6px 2px 8px;
          }
          .price-tag .price-num {
            font-size: 15px;
          }
          .price-tag .coin-icon {
            width: 18px;
            height: 18px;
          }
          .nm {
            font-size: 15px;
            margin: 6px 0 2px;
          }
          .ctl input {
            width: 48px;
            font-size: 15px;
          }
          .ctl button {
            width: 32px;
            height: 32px;
          }
          .bar .in {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .tot {
            grid-column: 1 / -1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 20px;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
            padding-bottom: 4px;
          }
          .b {
            padding: 10px 8px;
            font-size: 15px;
            text-align: center;
            justify-content: center;
          }
          .b.wa {
            grid-column: 1 / -1;
            font-size: 18px;
            padding: 12px;
          }
        }

        @media (max-width: 992px) {
          .store-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .sidebar-col {
            display: none !important;
          }
          .bar {
            display: block !important;
          }
        }

        @media (min-width: 993px) {
          .bar {
            display: none !important;
          }
        }

        @media (max-width: 380px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .stats {
            flex-direction: column;
          }
          .stat {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
