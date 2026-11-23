# 🚀 Panduan Setup Database Google Apps Script (Lifetime & 100% Gratis)

Panduan ini digunakan untuk menghubungkan website Hay Day Daku Cello ke Google Sheets menggunakan Google Apps Script sebagai database cloud permanen (lifetime) tanpa biaya langganan dan tanpa batas waktu (menggantikan Firebase).

---

### Langkah 1: Buat Google Spreadsheet Baru
1. Buka browser dan kunjungi: **[https://sheets.new](https://sheets.new)**
2. Beri judul spreadsheet Anda di kiri atas, misalnya:
   `Database Hay Day Daku Cello`

---

### Langkah 2: Buka Apps Script & Masukkan Kode
1. Di Google Sheets tersebut, klik menu bar atas:
   **Ekstensi (Extensions)** ➔ **Apps Script**.
2. Editor kode Google Apps Script akan terbuka di tab baru.
3. Hapus seluruh kode bawaan yang ada di file `Code.gs`.
4. Buka file [`google-apps-script/Code.gs`](./Code.gs) di proyek ini, **Salin (Copy) semua isinya**, lalu **Tempel (Paste)** ke editor Apps Script.
5. Klik ikon **Disket (Simpan)** atau tekan `Ctrl + S`.

---

### Langkah 3: Deploy (Terapkan) Sebagai Web App
1. Di pojok kanan atas Apps Script, klik tombol biru **Terapkan (Deploy)** ➔ pilih **Deployment baru (New deployment)**.
2. Klik ikon gerigi ⚙️ di sebelah *Pilih jenis (Select type)* ➔ pilih **Aplikasi web (Web app)**.
3. Atur pengaturannya persis seperti ini:
   * **Deskripsi:** `Hay Day API v1`
   * **Jalankan sebagai (Execute as):** `Saya (Me)` *(email Google Anda)*
   * **Siapa yang memiliki akses (Who has access):** **`Siapa saja (Anyone)`**  <-- ⚠️ *PENTING: Jangan pilih "Only myself" agar website bisa membaca data!*
4. Klik tombol **Terapkan (Deploy)**.
5. Jika muncul jendela izin akses:
   * Klik **Beri akses (Authorize access)**.
   * Pilih akun Google Anda.
   * Jika muncul peringatan *"Google hasn't verified this app"*, klik **Advanced** (Lanjutan) di bawah, lalu klik **Go to Untitled project (unsafe)**.
   * Klik **Allow (Izinkan)**.
6. Salin **URL Aplikasi Web (Web App URL)** yang berakhiran `/exec`.
   Contoh formatnya:
   `https://script.google.com/macros/s/AKfycbx.../exec`

---

### Langkah 4: Masukkan URL ke Dashboard Admin Hay Day
1. Buka Dashboard Admin website Anda: `/admin`.
2. Buka tab **Pengaturan**.
3. Di bagian **Database Cloud (Google Apps Script)**, tempelkan URL Web App yang sudah disalin tadi.
4. Klik tombol **⚡ Tes Koneksi**. Jika muncul notifikasi hijau, klik **Simpan Pengaturan Toko** atau klik **📤 Upload Data ke Google Sheets**.
5. Selesai! Sekarang semua data toko Anda tersimpan permanen di Google Sheets seumur hidup! 🎉
