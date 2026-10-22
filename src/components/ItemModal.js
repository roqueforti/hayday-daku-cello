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
      <div className="modal-bg active" role="dialog" aria-modal="true" onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
        <div className="modal-card modal-card-lg">
          <div className="modal-title">
            <span>{isEditing ? `✏️ Edit Item Produk: ${name}` : `✨ Tambah Item ke: ${categoryTitle}`}</span>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Kelola detail produk, ikon resmi, satuan, harga, dan catatan dengan rapi.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Icon Row */}
            <div className="fgroup" style={{ marginBottom: '14px' }}>
              <label>Icon Produk</label>
              <div className="modal-icon-select-row">
                <div
                  className="modal-icon-select-preview"
                  title="Klik untuk memilih ikon"
                  onClick={() => setIsIconPickerOpen(true)}
                >
                  {icons && icons.length > 0 ? (
                    <div className="ico-bundle-preview">
                      {icons.slice(0, 4).map((ic, i) => (
                        <img key={i} src={ic} alt="item" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                      ))}
                    </div>
                  ) : (
                    icon.startsWith('assets/') || icon.startsWith('data:') ? (
                      <img src={icon} alt="item" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                    ) : (
                      <span>{icon}</span>
                    )
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-default btn-sm"
                      onClick={() => setIsIconPickerOpen(true)}
                    >
                      Pilih Icon
                    </button>
                    <label className="btn btn-default btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                      Upload Gambar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadCustomImage}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {icons.length > 0
                      ? `${icons.length} ikon paket dipilih.`
                      : 'Bisa pilih icon satuan atau multi-icon paket (maksimal 4).'}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-form-grid">
              {/* Nama Item */}
              <div className="fgroup full">
                <label>Nama Item / Produk *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kapak, Sekop, Tagar BEM..."
                  required
                  autoFocus
                />
              </div>

              {/* Satuan Dasar */}
              <div className="fgroup">
                <label>Jumlah Satuan Dasar *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={unit}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  required
                />
              </div>

              {/* Tipe Satuan */}
              <div className="fgroup">
                <label>Jenis Satuan *</label>
                <select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                  <option value="pcs">pcs</option>
                  <option value="paket">paket</option>
                  <option value="koin">koin</option>
                  <option value="biji">biji</option>
                  <option value="box">box</option>
                  <option value="kg">kg</option>
                </select>
              </div>

              {/* Harga Satuan (per pcs) */}
              <div className="fgroup">
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Harga per {unitType || 'pcs'} (Rp) *</span>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>⭐ Prioritas</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={pricePerUnit}
                  onChange={(e) => handlePricePerUnitChange(e.target.value)}
                  placeholder="Contoh: 15"
                  required
                />
              </div>

              {/* Total Harga Satuan Dasar */}
              <div className="fgroup">
                <label>Total Harga {unit} {unitType} (Rp) *</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => handleTotalBasePriceChange(e.target.value)}
                  required
                />
              </div>

              {/* Minimal Beli */}
              <div className="fgroup">
                <label>Minimal Beli (Opsional)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={minQty}
                  onChange={(e) => setMinQty(e.target.value)}
                  placeholder={unitType === 'paket' ? 'Default 1' : ((Number(unit) || 1) <= 5 ? 'Default 1' : 'Default 10')}
                />
              </div>

              {/* Box Preview Akumulasi Minimal & Satuan */}
              <div className="fgroup full" style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: '1.5px solid #86efac',
                borderRadius: '12px',
                padding: '12px 14px',
                marginTop: '2px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💡 Rangkuman Akumulasi Otomatis</span>
                </div>
                {(() => {
                  const effectiveMin = (minQty !== '' && minQty !== null && !isNaN(Number(minQty)) && Number(minQty) > 0)
                    ? Number(minQty)
                    : (unitType === 'paket' ? 1 : ((Number(unit) || 1) <= 5 ? 1 : 10));
                  const ppu = parseFloat(pricePerUnit) || 0;
                  const totalMinPrice = Math.round(ppu * effectiveMin);
                  const totalBasePrice = Math.round(Number(price) || 0);

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', fontSize: '12.5px' }}>
                      <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <div style={{ color: '#166534', fontSize: '11px', fontWeight: 600 }}>Harga per {unitType}:</div>
                        <div style={{ fontWeight: 800, color: '#15803d', fontSize: '14px', marginTop: '2px' }}>
                          Rp{ppu.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <div style={{ color: '#166534', fontSize: '11px', fontWeight: 600 }}>Minimal Order ({effectiveMin} {unitType}):</div>
                        <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '14px', marginTop: '2px' }}>
                          Rp{totalMinPrice.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <div style={{ color: '#166534', fontSize: '11px', fontWeight 600 }}>Harga Satuan Dasar ({unit} {unitType}):</div>
                        <div style={{ fontWeight: 800, color: '#15803d', fontSize: '14px', marginTop: '2px' }}>
                          Rp{totalBasePrice.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Warna Label */}
              <div className="fgroup">
                <label>Warna Aksen Label</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {color}
                  </span>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="fgroup full">
                <label>Deskripsi / Catatan Tambahan</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Min. beli 10 • harga per 100 pcs"
                />
              </div>
            </div>

            <div className="modal-actions-bar">
              <button type="button" className="btn btn-default" onClick={onClose}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Simpan Perubahan' : 'Tambahkan Item'}
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
