/**
 * ====================================================================
 * BACKEND DATABASE GOOGLE APPS SCRIPT - HAY DAY DAKU CELLO
 * ====================================================================
 * Lifetime Database 100% Gratis & Tanpa Batas Waktu Menggunakan Google Sheets.
 * 
 * CARA SETUP:
 * 1. Buka Google Sheets baru di https://sheets.new
 * 2. Beri nama spreadsheet, misal: "Database Hay Day Daku Cello"
 * 3. Klik menu: Ekstensi > Apps Script
 * 4. Hapus semua kode yang ada di editor, lalu PASTE SELURUH KODE INI.
 * 5. Klik ikon Disket (Simpan) / Ctrl+S.
 * 6. (Opsional) Klik tombol "Run" pada fungsi "initDatabase" untuk inisialisasi sheet otomatis.
 * 7. Klik tombol biru di kanan atas: "Deploy" (Terapkan) > "New deployment" (Deployment baru).
 *    - Pilih jenis: "Web app" (Aplikasi Web)
 *    - Deskripsi: "Hayday API v1"
 *    - Execute as: "Me" (Saya - email Anda)
 *    - Who has access: "Anyone" (Siapa saja, bahkan anonim)  <-- PENTING!
 * 8. Klik "Deploy", izinkan akses akun Google Anda jika diminta (Pilih Advanced > Go to Untitled (unsafe)).
 * 9. Salin "Web App URL" (yang berakhiran "/exec") dan masukkan ke Dashboard Admin Hay Day.
 * ====================================================================
 */

// Data Default Migrasi Lengkap Terbaru (Cadangan jika Sheet masih kosong)
var INITIAL_DATA = {
  wa: "6287719747833",
  thx: "🌻 Terima kasih sudah percaya! WA: 087719747833 🌻",
  qris: "00020101021126570011ID.DANA.WWW011893600915303627511802090362751180303UMI51440014ID.CO.QRIS.WWW0215ID10266220774970303UMI5204594553033605802ID5918Daku cello, Mainan6007Cilacap610553274630419E6",
  sections: [
    {
      t: "🧰 Alat & Bahan",
      items: [
        { id: "sekop", e: "assets/icons/sekop.png", n: "Sekop", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#7a2fe0" },
        { id: "kapak", e: "assets/icons/kapak.png", n: "Kapak", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#e8359b" },
        { id: "gergaji", e: "assets/icons/gergaji.png", n: "Gergaji", u: 100, ut: "pcs", p: 1500, d: "Min. beli 10 • harga per 100 pcs", c: "#e0232f" }
      ]
    },
    {
      t: "🥛 Dapur & Peternakan",
      items: [
        { id: "krim", e: "assets/icons/krim.png", n: "Krim", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#f57c1f" },
        { id: "gulaputih", e: "assets/icons/gulaputih.png", n: "Gula Putih", u: 100, ut: "pcs", p: 1500, d: "Min. beli 10 • harga per 100 pcs", c: "#e9b200" },
        { id: "gulamerah", e: "assets/icons/gulamerah.png", n: "Gula Merah", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#27b83a" },
        { id: "babi", e: "assets/icons/babi.png", n: "Daging Babi", u: 100, ut: "pcs", p: 1200, d: "Min. beli 10 • harga per 100 pcs", c: "#13a9a0" },
        { id: "telor", e: "assets/icons/telor.png", n: "Telor", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#2d73e6" },
        { id: "mentega", e: "assets/icons/mentega.png", n: "Mentega", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#7a2fe0" },
        { id: "keju", e: "assets/icons/keju.png", n: "Keju", u: 100, ut: "pcs", p: 1500, d: "Min. beli 10 • harga per 100 pcs", c: "#e8359b" },
        { id: "madu", e: "assets/icons/madu.png", n: "Madu", u: 100, ut: "pcs", p: 2000, d: "Min. beli 10 • harga per 100 pcs", c: "#e0232f" }
      ]
    },
    {
      t: "🌊 Laut",
      items: [
        { id: "ikan", e: "assets/icons/ikan.png", n: "Ikan", u: 100, ut: "pcs", p: 1500, d: "Min. beli 10 • harga per 100 pcs", c: "#7a2fe0" },
        { id: "lopster", e: "assets/icons/lopster.png", n: "Lopster", u: 100, ut: "pcs", p: 2500, d: "Min. beli 10 • harga per 100 pcs", c: "#13a9a0" }
      ]
    },
    {
      t: "🏡 Tagar BEM (per paket)",
      pk: 1,
      items: [
        {
          id: "bem1",
          e: "assets/icons/bem.png",
          icons: ["assets/icons/Bolt.png", "assets/icons/Plank.png", "assets/icons/Duct Tape.png"],
          n: "Tagar BEM",
          u: 1,
          ut: "paket",
          p: 1500,
          d: "Include Baut, Papan, Lakban",
          c: "#2e9a3a"
        },
        {
          id: "bem30",
          e: "assets/icons/bem.png",
          icons: ["assets/icons/Bolt.png", "assets/icons/Plank.png", "assets/icons/Duct Tape.png"],
          n: "Tagar BEM (30 pcs)",
          u: 1,
          ut: "paket",
          p: 28500,
          d: "Include Baut, Papan, Lakban (30 pcs)",
          c: "#2d73e6"
        }
      ]
    },
    {
      t: "🪙 Koin LV 40++ (Lumbung kosong 250)",
      pk: 1,
      items: [
        { id: "k1", e: "assets/icons/koin.png", n: "1 Juta Koin", u: 1, ut: "paket", p: 8000, d: "Lumbung kosong 250", c: "#7a2fe0" },
        { id: "k10", e: "assets/icons/koin.png", n: "10 Juta Koin", u: 1, ut: "paket", p: 70000, d: "Lumbung kosong 250", c: "#e8359b" }
      ]
    }
  ]
};

/**
 * Handle HTTP GET Request
 * Mengambil data produk dan setting toko
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    
    // Ping check untuk tes koneksi
    if (params && params.action === 'ping') {
      return createJsonResponse({
        status: "ok",
        message: "Google Apps Script Hayday Database Terhubung! 🌾",
        timestamp: new Date().toISOString()
      });
    }

    var storeData = loadStoreData();
    return createJsonResponse(storeData);
  } catch (err) {
    return createJsonResponse({
      error: true,
      message: err.toString()
    });
  }
}

/**
 * Handle HTTP POST Request
 * Menyimpan data perubahan dari Dashboard Admin
 */
function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : "";
    if (!raw) {
      throw new Error("Payload kosong.");
    }

    var payload = JSON.parse(raw);
    saveStoreData(payload);

    return createJsonResponse({
      success: true,
      message: "Data toko berhasil disimpan ke Google Sheets! 💾✨",
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    return createJsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

/**
 * Membaca data toko dari Sheet 'Raw_JSON' atau Sheet 'Pengaturan' + 'Katalog_Produk'
 */
function loadStoreData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return INITIAL_DATA;

  var rawSheet = ss.getSheetByName("Raw_JSON");
  if (rawSheet) {
    var rawVal = rawSheet.getRange(1, 1).getValue();
    if (rawVal && typeof rawVal === 'string' && rawVal.trim().startsWith('{')) {
      try {
        var parsed = JSON.parse(rawVal);
        if (parsed && Array.isArray(parsed.sections)) {
          return parsed;
        }
      } catch (e) {
        Logger.log("Gagal parse Raw_JSON, fallback ke parsing tabel: " + e);
      }
    }
  }

  // Jika Raw_JSON belum ada atau kosong, inisialisasi sheet dengan INITIAL_DATA
  initDatabase();
  return INITIAL_DATA;
}

/**
 * Menyimpan data toko ke Sheet 'Raw_JSON' dan menyusun tabel human-readable
 */
function saveStoreData(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Spreadsheet tidak ditemukan.");

  var payload = {
    wa: data.wa || INITIAL_DATA.wa,
    thx: data.thx || INITIAL_DATA.thx,
    qris: data.qris || INITIAL_DATA.qris,
    sections: Array.isArray(data.sections) ? data.sections : INITIAL_DATA.sections,
    updatedAt: new Date().toISOString()
  };

  var jsonStr = JSON.stringify(payload);

  // 1. Simpan ke tab 'Raw_JSON' (A1) untuk kecepatan read maksimal
  var rawSheet = getOrCreateSheet(ss, "Raw_JSON");
  rawSheet.getRange(1, 1).setValue(jsonStr);

  // 2. Simpan ke tab 'Pengaturan' agar rapi dan bisa dibaca manual
  var setSheet = getOrCreateSheet(ss, "Pengaturan");
  setSheet.clear();
  setSheet.getRange(1, 1, 5, 2).setValues([
    ["Kunci Pengaturan", "Nilai"],
    ["Nomor WhatsApp", payload.wa],
    ["Catatan Footer", payload.thx],
    ["String QRIS Statis", payload.qris],
    ["Terakhir Diperbarui", payload.updatedAt]
  ]);
  formatHeaderRow(setSheet, 1, 2);

  // 3. Simpan ke tab 'Katalog_Produk' agar rapi dan bisa dibaca manual
  var prodSheet = getOrCreateSheet(ss, "Katalog_Produk");
  prodSheet.clear();

  var rows = [
    ["Kategori", "Tipe Kategori", "ID Produk", "Nama Produk", "Satuan Dasar", "Jenis Satuan", "Harga (Rp)", "Minimal Beli", "Deskripsi", "Icon / Gambar", "Warna"]
  ];

  payload.sections.forEach(function(sec) {
    var katName = sec.t || "Lain-lain";
    var isPk = sec.pk ? "paket" : "biasa";
    var items = Array.isArray(sec.items) ? sec.items : [];

    items.forEach(function(it) {
      rows.push([
        katName,
        isPk,
        it.id || "",
        it.n || it.name || "",
        it.u !== undefined ? it.u : 100,
        it.ut || it.unitType || "pcs",
        it.p !== undefined ? it.p : (it.price || 0),
        it.min !== undefined && it.min !== null ? it.min : "",
        it.d || it.description || "",
        it.e || it.icon || "",
        it.c || it.color || "#46b23c"
      ]);
    });
  });

  if (rows.length > 1) {
    prodSheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
    formatHeaderRow(prodSheet, 1, rows[0].length);
  }
}

/**
 * Fungsi inisialisasi sheet otomatis
 */
function initDatabase() {
  saveStoreData(INITIAL_DATA);
  Logger.log("Inisialisasi database Hay Day berhasil diselesaikan!");
}

/**
 * Helper: Ambil atau buat sheet jika belum ada
 */
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * Helper: Beri styling header tabel Google Sheet agar cantik
 */
function formatHeaderRow(sheet, rowNum, colCount) {
  var header = sheet.getRange(rowNum, 1, 1, colCount);
  header.setBackground("#38761d");
  header.setFontColor("#ffffff");
  header.setFontWeight("bold");
  sheet.setFrozenRows(1);
}

/**
 * Helper: Output JSON dengan header CORS lengkap
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
