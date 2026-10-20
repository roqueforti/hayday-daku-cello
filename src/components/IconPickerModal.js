'use client';
import React, { useState, useEffect } from 'react';
import { ICON_CATEGORIES } from '../lib/constants';

export function IconPickerModal({
  isOpen,
  initialIcon = '🌾',
  initialIcons = [],
  isPackage = false,
  onSelectSingle,
  onSelectMultiple,
  onClose
}) {
  const [selectedBundle, setSelectedBundle] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (initialIcons && initialIcons.length > 0) {
        setSelectedBundle([...initialIcons]);
      } else if (initialIcon) {
        setSelectedBundle([initialIcon]);
      } else {
        setSelectedBundle([]);
      }
    }
  }, [isOpen, initialIcon, initialIcons]);

  if (!isOpen) return null;

  const handleIconClick = (src) => {
    if (isPackage) {
      const idx = selectedBundle.indexOf(src);
      if (idx !== -1) {
        setSelectedBundle(selectedBundle.filter((_, i) => i !== idx));
      } else {
        if (selectedBundle.length >= 4) {
          alert("Maksimal 4 ikon untuk 1 paket produk ya");
          return;
        }
        setSelectedBundle([...selectedBundle, src]);
      }
    } else {
      onSelectSingle(src);
      onClose();
    }
  };

  const handleSaveBundle = () => {
    onSelectMultiple(selectedBundle);
    onClose();
  };

  const removeBundlePill = (idx) => {
    setSelectedBundle(selectedBundle.filter((_, i) => i !== idx));
  };

  return (
    <div className="modal-bg active" role="dialog" aria-modal="true" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-card">
        <div className="modal-title">
          <span>{isPackage ? '📦 Pilih Icon Paket (Bisa Pilih Beberapa)' : '🎨 Pilih Icon Produk'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {isPackage
            ? 'Klik item di bawah untuk menambah / menghapus ikon paket (maksimal 4 ikon). Klik Selesai jika sudah.'
            : 'Pilih salah satu ikon resmi Hay Day di bawah ini.'}
        </p>

        {isPackage && (
          <div className="modal-bundle-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <b style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Icon Terpilih:</b>
              <div className="modal-bundle-pills">
                {selectedBundle.length === 0 ? (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ada ikon</span>
                ) : (
                  selectedBundle.map((src, i) => (
                    <span key={i} className="modal-bundle-pill">
                      <img src={src} alt="icon" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                      <button type="button" className="modal-bundle-del" onClick={() => removeBundlePill(i)}>✕</button>
                    </span>
                  ))
                )}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSaveBundle}
              style={{ padding: '6px 14px', fontWeight: 700 }}
            >
              ✓ Selesai & Simpan Icon
            </button>
          </div>
        )}

        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
          {ICON_CATEGORIES.map((cat, cIdx) => (
            <div key={cIdx}>
              <div className="cat-label">{cat.name}</div>
              <div className="icon-grid">
                {cat.icons.map((item, iIdx) => {
                  const isSelected = selectedBundle.includes(item.src);
                  return (
                    <div
                      key={iIdx}
                      className={`icon-opt ${isSelected ? 'selected' : ''}`}
                      title={item.label}
                      onClick={() => handleIconClick(item.src)}
                    >
                      {isSelected && <span className="icon-opt-check">✓</span>}
                      <img src={item.src} alt={item.label} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
