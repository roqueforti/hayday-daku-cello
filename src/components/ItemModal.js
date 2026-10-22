'use client';
import React, { useState, useEffect } from 'react';
import { Product } from '../models/Product';
import { IconPickerModal } from './IconPickerModal';

export function ItemModal({
  isOpen,
  categoryIndex,
  productIndex = -1,
  categoryTitle = '',
  initialProduct = null,
  onSave,
  onClose
}) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState(100);
  const [unitType, setUnitType] = useState('pcs');
  const [minQty, setMinQty] = useState('');
  const [price, setPrice] = useState(1000); // total harga untuk `unit` dasar
  const [pricePerUnit, setPricePerUnit] = useState('10'); // harga per 1 pcs / satuan
  const [color, setColor] = useState('#46b23c');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🌾');
  const [icons, setIcons] = useState([]);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialProduct) {
        const u = initialProduct.unit || 100;
        const p = initialProduct.price || 0;
        const ppu = u > 0 ? (p / u) : p;
        setName(initialProduct.name || '');
        setUnit(u);
        setUnitType(initialProduct.unitType || 'pcs');
        setMinQty(initialProduct.minQty !== null && initialProduct.minQty !== undefined ? initialProduct.minQty : '');
        setPrice(p);
        setPricePerUnit(Number.isInteger(ppu) ? String(ppu) : ppu.toFixed(2));
        setColor(initialProduct.color || '#46b23c');
        setDescription(initialProduct.description || '');
        setIcon(initialProduct.icon || '🌾');
        setIcons(Array.isArray(initialProduct.icons) ? [...initialProduct.icons] : []);
      } else {
        setName('');
        setUnit(100);
        setUnitType('pcs');
        setMinQty('');
        setPrice(1000);
        setPricePerUnit('10');
        setColor('#46b23c');
        setDescription('');
        setIcon('assets/icons/Wheat.png');
        setIcons([]);
      }
    }
  }, [isOpen, initialProduct]);

  // Handler saat penjual mengubah Harga Satuan (per pcs / unit)
  const handlePricePerUnitChange = (val) => {
    setPricePerUnit(val);
    const numPpu = parseFloat(val);
    const numUnit = parseFloat(unit) || 1;
    if (!isNaN(numPpu) && numPpu >= 0) {
      const calculatedTotal = Math.round(numPpu * numUnit);
      setPrice(calculatedTotal);
    }
  };

  // Handler saat penjual mengubah Total Harga Satuan Dasar
  const handleTotalBasePriceChange = (val) => {
    setPrice(val);
    const numTotal = parseFloat(val);
    const numUnit = parseFloat(unit) || 1;
    if (!isNaN(numTotal) && numTotal >= 0 && numUnit > 0) {
      const ppu = numTotal / numUnit;
      setPricePerUnit(Number.isInteger(ppu) ? String(ppu) : ppu.toFixed(2));
    }
  };

  // Handler saat penjual mengubah Satuan Dasar (unit)
  const handleUnitChange = (val) => {
    setUnit(val);
    const numUnit = parseFloat(val) || 1;
    const numPpu = parseFloat(pricePerUnit);
    if (!isNaN(numPpu) && numPpu >= 0) {
      setPrice(Math.round(numPpu * numUnit));
    }
  };

  if (!isOpen) return null;

  const isEditing = productIndex >= 0 && initialProduct;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nama produk wajib diisi!");
      return;
    }

    const parsedMinQty = minQty !== '' && minQty !== null && !isNaN(Number(minQty)) ? Number(minQty) : null;

    const product = new Product({
      id: initialProduct?.id || ('item_' + Date.now()),
      name: name.trim(),
      u: Number(unit) || 1,
      ut: unitType,
      min: parsedMinQty,
      p: Number(price) || 0,
      c: color,
      d: description.trim(),
      e: icon,
      icons: icons.length > 0 ? icons : [icon]
    });

    onSave(categoryIndex, productIndex, product);
    onClose();
  };

  const handleUploadCustomImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 128;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/webp", 0.85);

        setIcon(compressed);
        if (unitType === 'paket' && icons.length < 4) {
          setIcons([...icons, compressed]);
        } else {
          setIcons([]);
        }
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="modal-bg active hayday-modal-backdrop" role="dialog" aria-modal="true" onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
        <div className="modal-card modal-card-lg hayday-modal-card">
          {/* Header Kartu Kayu Lucu Hayday */}
          <div className="hayday-modal-header">
            <div className="hayday-modal-title-wrap">
              <span className="hayday-badge-star">🌾</span>
              <span className="hayday-modal-title">
                {isEditing ? `Edit Item: ${name}` : `Tambah Item: ${categoryTitle}`}
              </span>
            </div>
            <button className="hayday-modal-close" onClick={onClose} title="Tutup">✕</button>
          </div>

          <p className="hayday-modal-sub">
            Atur nama, icon lucu, satuan, serta harga per pcs dengan kalkulasi otomatis.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Icon Picker Row */}
            <div className="hayday-field-group">
              <label className="hayday-label">Ikon Produk Hay Day</label>
              <div className="modal-icon-select-row hayday-icon-selector">
                <div
                  className="modal-icon-select-preview hayday-icon-preview-box"
                  title="Klik untuk memilih ikon"
                  onClick={() => setIsIconPickerOpen(true)}
                >
                  {icons && icons.length > 0 ? (
                    <div className="ico-bundle-preview">
                      {icons.slice(0, 4).map((ic, i) => (
                        <img key={i} src={ic} alt="item" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                      ))}
                    </div>
                  ) : (
                    icon.startsWith('assets/') || icon.startsWith('data:') ? (
                      <img src={icon} alt="item" style={{ width: 38, height: 38, objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '28px' }}>{icon}</span>
                    )
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn hayday-btn-wood btn-sm"
                      onClick={() => setIsIconPickerOpen(true)}
                    >
                      🎨 Pilih Ikon
                    </button>
                    <label className="btn hayday-btn-wood btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                      📸 Upload Gambar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadCustomImage}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#8d5d36', marginTop: '6px', fontWeight: 600 }}>
                    {icons.length > 0
                      ? `✨ ${icons.length} ikon bundle dipilih.`
                      : 'Pilih ikon resmi Hay Day atau upload gambar produkmu.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-form-grid hayday-form-grid">
              {/* Nama Item */}
              <div className="fgroup full">
                <label className="hayday-label">Nama Produk *</label>
                <input
                  type="text"
                  className="hayday-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kapak, Sekop, Tagar BEM..."
                  required
                  autoFocus
                />
              </div>

              {/* Satuan Dasar */}
              <div className="fgroup">
                <label className="hayday-label">Jumlah Satuan Dasar *</label>
                <input
                  type="number"
                  className="hayday-input"
                  min="1"
                  step="1"
                  value={unit}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  required
                />
              </div>

              {/* Tipe Satuan */}
              <div className="fgroup">
                <label className="hayday-label">Jenis Satuan *</label>
                <select className="hayday-input" value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                  <option value="pcs">pcs</option>
                  <option value="paket">paket</option>
                  <option value="koin">koin</option>
                  <option value="biji">biji</option>
                  <option value="box">box</option>
                  <option value="kg">kg</option>
                </select>
              </div>

              {/* Harga Satuan (per pcs) */}
              <div className="fgroup full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="hayday-label" style={{ marginBottom: 0 }}>
                    Harga per {unitType || 'pcs'} (Rp) *
                  </label>
                  <span className="hayday-pill-tag">🌾 Harga Pcs</span>
                </div>
                <input
                  type="number"
                  className="hayday-input hayday-input-highlight"
                  min="0"
                  step="any"
                  value={pricePerUnit}
                  onChange={(e) => handlePricePerUnitChange(e.target.value)}
                  placeholder="Contoh: 10 atau 15"
                  required
                />
              </div>

              {/* Minimal Beli */}
              <div className="fgroup">
                <label className="hayday-label">Minimal Beli (Opsional)</label>
                <input
                  type="number"
                  className="hayday-input"
                  min="1"
                  step="1"
                  value={minQty}
                  onChange={(e) => setMinQty(e.target.value)}
                  placeholder={unitType === 'paket' ? 'Default 1' : ((Number(unit) || 1) <= 5 ? 'Default 1' : 'Default 10')}
                />
              </div>

              {/* Warna Label */}
              <div className="fgroup">
                <label className="hayday-label">Warna Aksen Label</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ borderRadius: '10px', height: '42px', width: '50px' }}
                  />
                  <span style={{ fontFamily: 'Lilita One, JetBrains Mono, monospace', fontSize: '13px', color: '#6e4a25' }}>
                    {color}
                  </span>
                </div>
              </div>

              {/* Box Preview Akumulasi Minimal & Satuan */}
              <div className="fgroup full hayday-accum-box">
                <div className="hayday-accum-header">
                  <span>🚜 Rangkuman Akumulasi Harga</span>
                </div>
                {(() => {
                  const effectiveMin = (minQty !== '' && minQty !== null && !isNaN(Number(minQty)) && Number(minQty) > 0)
                    ? Number(minQty)
                    : (unitType === 'paket' ? 1 : ((Number(unit) || 1) <= 5 ? 1 : 10));
                  const ppu = parseFloat(pricePerUnit) || 0;
                  const totalMinPrice = Math.round(ppu * effectiveMin);
                  const totalBasePrice = Math.round(Number(price) || 0);

                  return (
                    <div className="hayday-accum-grid">
                      <div className="hayday-accum-card">
                        <div className="hayday-accum-card-lbl">Harga per {unitType}:</div>
                        <div className="hayday-accum-card-val" style={{ color: '#277220' }}>
                          Rp{ppu.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div className="hayday-accum-card">
                        <div className="hayday-accum-card-lbl">Min. Order ({effectiveMin} {unitType}):</div>
                        <div className="hayday-accum-card-val" style={{ color: '#c2410c' }}>
                          Rp{totalMinPrice.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div className="hayday-accum-card">
                        <div className="hayday-accum-card-lbl">Satuan ({unit} {unitType}):</div>
                        <div className="hayday-accum-card-val" style={{ color: '#277220' }}>
                          Rp{totalBasePrice.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Deskripsi */}
              <div className="fgroup full">
                <label className="hayday-label">Deskripsi / Catatan Tambahan</label>
                <input
                  type="text"
                  className="hayday-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Min. beli 10 • harga per 100 pcs"
                />
              </div>
            </div>

            <div className="modal-actions-bar hayday-actions-bar">
              <button type="button" className="btn hayday-btn-cancel" onClick={onClose}>
                Batal
              </button>
              <button type="submit" className="btn hayday-btn-save">
                {isEditing ? '✓ Simpan Perubahan' : '🌾 Tambahkan Item'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <IconPickerModal
        isOpen={isIconPickerOpen}
        initialIcon={icon}
        initialIcons={icons}
        isPackage={unitType === 'paket'}
        onSelectSingle={(src) => {
          setIcon(src);
          setIcons([]);
        }}
        onSelectMultiple={(bundle) => {
          setIcons(bundle);
          if (bundle.length > 0) setIcon(bundle[0]);
        }}
        onClose={() => setIsIconPickerOpen(false)}
      />
    </>
  );
}
