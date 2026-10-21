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
  const [price, setPrice] = useState(1000);
  const [color, setColor] = useState('#46b23c');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🌾');
  const [icons, setIcons] = useState([]);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialProduct) {
        setName(initialProduct.name || '');
        setUnit(initialProduct.unit || 100);
        setUnitType(initialProduct.unitType || 'pcs');
        setPrice(initialProduct.price || 0);
        setColor(initialProduct.color || '#46b23c');
        setDescription(initialProduct.description || '');
        setIcon(initialProduct.icon || '🌾');
        setIcons(Array.isArray(initialProduct.icons) ? [...initialProduct.icons] : []);
      } else {
        setName('');
        setUnit(100);
        setUnitType('pcs');
        setPrice(1000);
        setColor('#46b23c');
        setDescription('');
        setIcon('assets/icons/Wheat.png');
        setIcons([]);
      }
    }
  }, [isOpen, initialProduct]);

  if (!isOpen) return null;

  const isEditing = productIndex >= 0 && initialProduct;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nama produk wajib diisi!");
      return;
    }

    const product = new Product({
      id: initialProduct?.id || ('item_' + Date.now()),
      name: name.trim(),
      u: Number(unit) || 1,
      ut: unitType,
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
                  onChange={(e) => setUnit(e.target.value)}
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

              {/* Harga */}
              <div className="fgroup">
                <label>Harga Jual (Rp) *</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
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
