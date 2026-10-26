'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedCategory('ALL');
      if (initialIcons && initialIcons.length > 0) {
        setSelectedBundle([...initialIcons]);
      } else if (initialIcon) {
        setSelectedBundle([initialIcon]);
      } else {
        setSelectedBundle([]);
      }
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, initialIcon, initialIcons]);

  const filteredCategories = useMemo(() => {
    let cats = ICON_CATEGORIES;
    if (selectedCategory !== 'ALL') {
      cats = cats.filter(c => c.name === selectedCategory);
    }

    if (!searchTerm.trim()) return cats;

    const q = searchTerm.toLowerCase().trim();
    return cats.map(cat => {
      const catMatches = cat.name.toLowerCase().includes(q);
      const matchedIcons = cat.icons.filter(ic => {
        if (catMatches) return true;
        const labelMatch = ic.label.toLowerCase().includes(q);
        const srcMatch = ic.src.toLowerCase().includes(q);
        return labelMatch || srcMatch;
      });
      if (matchedIcons.length === 0) return null;
      return {
        ...cat,
        icons: matchedIcons
      };
    }).filter(Boolean);
  }, [searchTerm, selectedCategory]);

  const totalFilteredIcons = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.icons.length, 0);
  }, [filteredCategories]);

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
      <div className="modal-card" style={{ maxWidth: '640px', width: '92%' }}>
        <div className="modal-title">
          <span>{isPackage ? 'Pilih Icon Paket (Maks. 4)' : 'Pilih Icon Produk'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {isPackage
            ? 'Klik item di bawah untuk menambah / menghapus ikon paket (maksimal 4 ikon). Klik Simpan jika sudah.'
            : 'Pilih salah satu ikon resmi Hay Day atau gunakan kolom pencarian di bawah.'}
        </p>

        {/* Kotak Pencarian Ikon Cepat & Jelas */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', fontSize: '16px', pointerEvents: 'none', opacity: 0.7 }}>
              🔍
            </span>
            <input
              ref={searchInputRef}
              type="text"
              style={{
                width: '100%',
                padding: '10px 38px 10px 38px',
                borderRadius: '10px',
                border: '2px solid #58b947',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                fontWeight: 500
              }}
              placeholder="Cari ikon Hay Day... (cth: susu, roti, gandum, kapak, baut, kecap, emas)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  searchInputRef.current?.focus();
                }}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: '#e2e8f0',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#475569',
                  fontWeight: 700
                }}
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', padding: '0 4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {searchTerm ? (
                <>Ditemukan <b>{totalFilteredIcons}</b> ikon untuk "{searchTerm}"</>
              ) : (
                <>Tersedia <b>{totalFilteredIcons}</b> ikon resmi</>
              )}
            </span>
            {selectedCategory !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                style={{ fontSize: '11px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Tampilkan Semua Kategori
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '8px',
          scrollbarWidth: 'thin'
        }}>
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            style={{
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '11.5px',
              whiteSpace: 'nowrap',
              border: selectedCategory === 'ALL' ? '1.5px solid #58b947' : '1px solid var(--border-subtle)',
              background: selectedCategory === 'ALL' ? '#58b947' : 'var(--surface-subtle)',
              color: selectedCategory === 'ALL' ? '#fff' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: selectedCategory === 'ALL' ? 700 : 500,
              transition: '0.15s'
            }}
          >
            Semua ({ICON_CATEGORIES.reduce((a, c) => a + c.icons.length, 0)})
          </button>
          {ICON_CATEGORIES.map((cat, idx) => {
            const isCatActive = selectedCategory === cat.name;
            const shortName = cat.name.split(' (')[0].replace('Resmi', '').trim();
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedCategory(isCatActive ? 'ALL' : cat.name)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '11.5px',
                  whiteSpace: 'nowrap',
                  border: isCatActive ? '1.5px solid #58b947' : '1px solid var(--border-subtle)',
                  background: isCatActive ? '#58b947' : 'var(--surface-subtle)',
                  color: isCatActive ? '#fff' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: isCatActive ? 700 : 500,
                  transition: '0.15s'
                }}
              >
                {shortName}
              </button>
            );
          })}
        </div>

        {isPackage && (
          <div className="modal-bundle-bar" style={{ marginBottom: '10px' }}>
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
              Simpan Pilihan Icon
            </button>
          </div>
        )}

        {/* Scrollable Icon List */}
        <div style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredCategories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 10px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌾</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Tidak ada ikon yang cocok</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>Coba cari dengan kata kunci lain (misal: susu, roti, gandum, kapak, baut, dsb.)</div>
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
                style={{
                  marginTop: '12px',
                  padding: '6px 14px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            filteredCategories.map((cat, cIdx) => (
              <div key={cIdx} style={{ marginBottom: '14px' }}>
                <div className="cat-label">{cat.name} ({cat.icons.length})</div>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
