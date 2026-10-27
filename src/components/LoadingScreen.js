'use client';
import React, { useState, useEffect } from 'react';

export function LoadingScreen({ isLoading, text = "Menyiapkan toko & produk pertanian..." }) {
  const [mounted, setMounted] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(25);
  const [statusIdx, setStatusIdx] = useState(0);

  const statuses = [
    "Menyiapkan lumbung pertanian... 🌾",
    "Memeriksa stok alat & bahan... 🧰",
    "Menyiapkan harga resmi terbaru... ✨",
    "Hampir siap, selamat berbelanja! 🌻"
  ];

  useEffect(() => {
    // Animasi progress bar naik bertahap secara dinamis
    const p1 = setTimeout(() => setProgress(55), 180);
    const p2 = setTimeout(() => setProgress(82), 400);
    const s1 = setTimeout(() => setStatusIdx(1), 260);
    const s2 = setTimeout(() => setStatusIdx(2), 520);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(s1);
      clearTimeout(s2);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setStatusIdx(3);

      // Mulai efek fade out halus
      const fadeTimer = setTimeout(() => {
        setFadingOut(true);
      }, 150);

      // Lepas elemen dari DOM setelah animasi fade selesai
      const unmountTimer = setTimeout(() => {
        setMounted(false);
      }, 650);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isLoading]);

  if (!mounted) return null;

  return (
    <div
      className={`hayday-loading-screen ${fadingOut ? 'fade-out' : ''}`}
      aria-live="polite"
      role="status"
    >
      {/* Background Awan Animasi */}
      <div className="loading-clouds-bg" aria-hidden="true">
        <div className="loading-cloud lcloud-1"></div>
        <div className="loading-cloud lcloud-2"></div>
        <div className="loading-cloud lcloud-3"></div>
      </div>

      {/* Papan Kayu Loading Hay Day */}
      <div className="loading-board">
        {/* Hiasan Baut Kayu / Gantungan */}
        <div className="loading-board-hangers">
          <span className="hanger-bolt"></span>
          <span className="hanger-bolt"></span>
        </div>

        {/* Logo Avatar Toko Hay Day */}
        <div className="loading-avatar-wrap">
          <div className="loading-logo-glow"></div>
          <img
            src="/logo-daku-cello.jpeg"
            alt="Hay Day Daku Cello Logo"
            className="loading-logo-img"
          />
          <span className="loading-avatar-badge">🌾</span>
        </div>

        {/* Judul & Keterangan */}
        <h2 className="loading-title">HAY DAY DAKU CELLO</h2>
        <p className="loading-sub">{text}</p>

        {/* Progress Bar Khas Game Pertanian */}
        <div className="loading-progress-track">
          <div
            className="loading-progress-fill"
            style={{ width: `${progress}%` }}
          >
            <div className="loading-progress-shine"></div>
          </div>
        </div>

        {/* Teks Status Berputar */}
        <div className="loading-status-badge">
          <span>{statuses[statusIdx]}</span>
        </div>

        {/* Ikon Karakter Peternakan */}
        <div className="loading-farm-icons">
          <span>🐄</span>
          <span>🐔</span>
          <span>🌾</span>
          <span>🚜</span>
          <span>🐖</span>
        </div>
      </div>
    </div>
  );
}
