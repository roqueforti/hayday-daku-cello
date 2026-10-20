'use client';
import React, { useState, useEffect } from 'react';

export function CategoryModal({
  isOpen,
  categoryIndex = -1,
  initialTitle = '',
  onSave,
  onClose
}) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle || '');
    }
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  const isEditing = categoryIndex >= 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Nama kategori wajib diisi!");
      return;
    }
    onSave(categoryIndex, title.trim());
    onClose();
  };

  return (
    <div className="modal-bg active" role="dialog" aria-modal="true" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-card">
        <div className="modal-title">
          <span>{isEditing ? '✏️ Edit Kategori' : '📁 Buat Kategori Baru'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Kategori membantu mengelompokkan produk agar mudah ditemukan pelanggan.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="fgroup" style={{ marginBottom: '16px' }}>
            <label>Nama Kategori *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: 🌾 Hasil Tani, 🥛 Olahan Susu..."
              required
              autoFocus
            />
          </div>

          <div className="modal-actions-bar">
            <button type="button" className="btn btn-default" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              ✓ {isEditing ? 'Simpan Kategori' : 'Tambahkan Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
