import QRCode from 'qrcode';
import { DEFAULT_QRIS } from './constants';

/**
 * Menghitung CRC16-CCITT (polynomial 0x1021, initial 0xFFFF)
 * Standar spesifikasi EMVCo QRIS MPM.
 */
export function calculateCRC16(data) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Parse string QRIS standar EMVCo ke dalam array tag TLV (Tag, Length, Value)
 */
export function parseTLV(qrString) {
  let i = 0;
  const tags = [];
  while (i < qrString.length) {
    const tag = qrString.substring(i, i + 2);
    const len = parseInt(qrString.substring(i + 2, i + 4), 10);
    if (isNaN(len)) break;
    const val = qrString.substring(i + 4, i + 4 + len);
    tags.push({ tag, len, val });
    i += 4 + len;
    if (tag === '63') break;
  }
  return tags;
}

/**
 * Mengubah QRIS statis menjadi QRIS dinamis dengan nominal custom.
 * @param {string} staticQr - String QRIS statis toko
 * @param {number|string} amount - Nominal transaksi (Rupiah)
 * @returns {string} String QRIS dinamis lengkap dengan tag 54 dan CRC16 baru
 */
export function generateDynamicQris(staticQr = DEFAULT_QRIS, amount = 0) {
  const cleanQr = (staticQr || DEFAULT_QRIS).trim();
  const amtStr = String(Math.max(1, Math.round(Number(amount) || 0)));
  const tags = parseTLV(cleanQr);
  const newTags = [];
  let hasAmount = false;

  for (const { tag, val } of tags) {
    // Tag 63 adalah CRC checksum, dihitung ulang di akhir
    if (tag === '63') continue;

    if (tag === '01') {
      // Ubah dari 11 (Statis) menjadi 12 (Dinamis)
      newTags.push({ tag: '01', val: '12' });
    } else if (tag === '54') {
      // Jika sudah ada tag nominal, timpa dengan nominal baru
      newTags.push({ tag: '54', val: amtStr });
      hasAmount = true;
    } else if (tag === '58' && !hasAmount) {
      // Menurut spesifikasi EMVCo, Tag 54 diletakkan sebelum Tag 58 (Country Code)
      newTags.push({ tag: '54', val: amtStr });
      hasAmount = true;
      newTags.push({ tag, val });
    } else {
      newTags.push({ tag, val });
    }
  }

  if (!hasAmount) {
    newTags.push({ tag: '54', val: amtStr });
  }

  let payload = '';
  for (const { tag, val } of newTags) {
    const lenStr = String(val.length).padStart(2, '0');
    payload += tag + lenStr + val;
  }

  // Tambahkan identifier tag 63 dengan panjang 04
  payload += '6304';
  const checksum = calculateCRC16(payload);
  return payload + checksum;
}

/**
 * Generate data URL gambar QR code (Base64 PNG) dari string payload
 */
export async function generateQrDataUrl(qrPayload, options = {}) {
  try {
    const defaultOptions = {
      width: 340,
      margin: 2,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    };
    return await QRCode.toDataURL(qrPayload, { ...defaultOptions, ...options });
  } catch (err) {
    console.error('Failed generating QR code image:', err);
    throw err;
  }
}

