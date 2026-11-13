'use client';

import React, { useState, useEffect } from 'react';
import { generateDynamicQris, generateQrDataUrl } from '../lib/qris';
import { STORE_NAME, STORE_NMID } from '../lib/constants';

export function QrisModal({
  isOpen,
  onClose,
  totalAmount,
  totalCount,
  totalQuantity,
  customerNote,
  cart,
  storeData,
  onOrderSuccess
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [dynamicQrString, setDynamicQrString] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    if (!isOpen || totalAmount <= 0) return;

    let isMounted = true;
    setIsLoading(true);

    try {
      const qrisBase = storeData?.qris;
      const dynamicPayload = generateDynamicQris(qrisBase, totalAmount);
      setDynamicQrString(dynamicPayload);

      generateQrDataUrl(dynamicPayload, { width: 360, margin: 2 })
        .then((url) => {
          if (isMounted) {
            setQrDataUrl(url);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error("Gagal generate QR Code:", err);
          if (isMounted) setIsLoading(false);
        });
    } catch (err) {
      console.error("Error setting up dynamic QRIS:", err);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, totalAmount, storeData?.qris]);

  if (!isOpen) return null;

  const formattedAmount = 'Rp' + Math.round(totalAmount).toLocaleString('id-ID');

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QRIS-DakuCello-${Math.round(totalAmount)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(Math.round(totalAmount)));
    setCopyStatus('Disalin!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const handleSendProofToWA = () => {
    if (!cart) return;
    const paymentStatusNote = `[STATUS: SUDAH DIBAYAR VIA QRIS ${formattedAmount}]` + (customerNote ? `\nCatatan: ${customerNote}` : '');
    const msg = cart.generateWhatsAppMessage(paymentStatusNote);
    const cleanWa = (storeData?.wa || '6287719747833').replace(/\D/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanWa}&text=${encodeURIComponent(msg)}`;
    if (onOrderSuccess) onOrderSuccess();
    onClose();
    window.open(waUrl, '_blank');
  };

  return (
    <div className="modal-bg active" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-card modal-card-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          width: '95%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden',
          borderRadius: '20px'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #2b6a22 0%, #3e8832 100%)',
            color: '#fff',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>💳</span>
            <div>
              <div style={{ fontFamily: 'Fredoka, Nunito, sans-serif', fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                QRIS Pembayaran Otomatis
              </div>
              <small style={{ opacity: 0.9, fontSize: '12px' }}>Dinamis • Nominal Terkunci Otomatis</small>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          {/* Card Info Merchant & Nominal */}
          <div
            style={{
              background: '#fdfaf5',
              border: '1.5px solid #ebdcc8',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '14px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '13px', color: '#7a5229', fontWeight: 600 }}>
              {STORE_NAME}
            </div>
            <div style={{ fontSize: '11px', color: '#9b7653', letterSpacing: '0.5px' }}>
              NMID: {STORE_NMID}
            </div>

            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #e4d0b8' }}>
              <div style={{ fontSize: '12px', color: '#6e4a25' }}>Total yang Harus Dibayar:</div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: '#246b1c',
                  fontFamily: 'JetBrains Mono, monospace',
                  margin: '2px 0'
                }}
              >
                {formattedAmount}
              </div>
              <div style={{ fontSize: '11.5px', color: '#8d5d36' }}>
                Pesanan: {totalCount} jenis produk • {totalQuantity} item
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              border: '2px solid #e7d5bf',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
            }}
          >
            {/* Header Badge QRIS */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '8px', padding: '0 8px' }}>
              <span style={{ fontWeight: 900, letterSpacing: '1px', color: '#d32f2f', fontSize: '16px' }}>QRIS</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#666', background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px' }}>
                GPN
              </span>
            </div>

            {/* QR Image */}
            <div
              style={{
                width: '240px',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #eee',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {isLoading ? (
                <div style={{ textAlign: 'center', color: '#6e4a25', fontSize: '13px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>⏳</div>
                  Membuat QRIS Dinamis...
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QRIS Dinamis"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ color: '#d32f2f', fontSize: '12px' }}>Gagal memuat QRIS</div>
              )}
            </div>

            {/* Quick Helper Tools: Download & Copy */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', width: '100%' }}>
              <button
                type="button"
                onClick={handleDownloadQr}
                disabled={isLoading || !qrDataUrl}
                style={{
                  flex: 1,
                  background: '#f5f0e8',
                  border: '1px solid #d4c1aa',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#4e3319',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                📥 Unduh QR Image
              </button>
              <button
                type="button"
                onClick={handleCopyAmount}
                style={{
                  background: '#f5f0e8',
                  border: '1px solid #d4c1aa',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#4e3319',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                📋 {copyStatus || 'Salin Nominal'}
              </button>
            </div>
          </div>

          {/* Alert Notice: Auto Nominal */}
          <div
            style={{
              marginTop: '12px',
              padding: '10px 12px',
              background: '#eef8eb',
              border: '1px solid #b7e3b0',
              borderRadius: '10px',
              fontSize: '12px',
              color: '#215c19',
              lineHeight: 1.4
            }}
          >
            ✅ <b>Nominal Terkunci Otomatis:</b> Saat QR di atas discan di m-Banking atau E-Wallet, nominal <b>{formattedAmount}</b> langsung otomatis terisi tanpa perlu Anda ketik lagi.
          </div>

          {/* Cara Bayar Singkat */}
          <div
            style={{
              marginTop: '12px',
              padding: '10px 12px',
              background: '#fbf8f2',
              border: '1px solid #edd9c2',
              borderRadius: '10px',
              fontSize: '11.5px',
              color: '#6e4a25'
            }}
          >
            <b>📱 Cara Pembayaran:</b>
            <ol style={{ margin: '4px 0 0', paddingLeft: '18px', lineHeight: 1.45 }}>
              <li>
                <b>Jika pakai 1 HP:</b> Klik tombol <i>"Unduh QR Image"</i> atau Screenshot layar ini ➔ Buka m-Banking/E-Wallet ➔ Pilih Scan QR ➔ Ambil dari Galeri.
              </li>
              <li>
                <b>Jika ada HP lain / Laptop:</b> Cukup buka aplikasi bayar di HP lalu arahkan kamera ke layar ini.
              </li>
              <li>
                Mendukung: <b>BCA, Livin Mandiri, BRImo, BNI, GoPay, OVO, DANA, ShopeePay</b> & semua aplikasi QRIS.
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '12px 20px',
            background: '#faf6ee',
            borderTop: '1.5px solid #ebdcc8',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSendProofToWA}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 800,
              background: 'linear-gradient(180deg, #25D366 0%, #1ea851 100%)',
              borderColor: '#178a41',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
            }}
          >
            Konfirmasi & Kirim Bukti ke WA 💬
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#7a5229',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ✕ Tutup / Ubah Pesanan
          </button>
        </div>
      </div>
    </div>
  );
}

