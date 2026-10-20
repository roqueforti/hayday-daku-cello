'use client';
import React, { useEffect } from 'react';

export function ConfirmModal({
  isOpen,
  title = 'Konfirmasi',
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'danger', // 'danger' | 'primary' | 'warning'
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = type === 'danger';

  return (
    <div className="modal-bg active" role="dialog" aria-modal="true" onClick={(e) => {
      if (e.target === e.currentTarget) onCancel();
    }}>
      <div className="modal-card confirm-modal-card" style={{ maxWidth: '440px', padding: '24px 20px', textAlign: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: isDanger ? '#fee2e2' : '#fef3c7',
          color: isDanger ? '#dc2626' : '#d97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '28px'
        }}>
          {isDanger ? '⚠️' : '❓'}
        </div>

        <h3 style={{
          margin: '0 0 8px',
          fontSize: '18px',
          fontWeight: 800,
          color: 'var(--text-primary)'
        }}>
          {title}
        </h3>

        <p style={{
          margin: '0 0 24px',
          fontSize: '13.5px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          <button
            type="button"
            className="btn btn-default"
            onClick={onCancel}
            style={{ justifyContent: 'center', padding: '10px' }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            style={{ justifyContent: 'center', padding: '10px' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
