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
  "wa": "6287719747833",
  "thx": "🌻 Terima kasih sudah percaya! WA: 087719747833 🌻",
  "qris": "00020101021126570011ID.DANA.WWW011893600915303627511802090362751180303UMI51440014ID.CO.QRIS.WWW0215ID10266220774970303UMI5204594553033605802ID5918Daku cello, Mainan6007Cilacap610553274630419E6",
  "sections": [
    {
      "pk": 0,
      "items": [
        {
          "id": "sekop",
          "n": "Sekop",
          "p": 1000,
          "d": "Min. beli 10 • harga per 100 pcs",
          "e": "assets/icons/sekop.png",
          "ut": "pcs",
          "c": "#7a2fe0",
          "u": 100
        },
        {
          "e": "assets/icons/kapak.png",
          "id": "kapak",
          "c": "#e8359b",
          "u": 100,
          "n": "Kapak",
          "p": 1000,
          "d": "Min. beli 10 • harga per 100 pcs",
          "ut": "pcs"
        },
        {
          "p": 1500,
          "d": "Min. beli 10 • harga per 100 pcs",
          "id": "gergaji",
          "n": "Gergaji",
          "c": "#e0232f",
          "ut": "pcs",
          "u": 100,
          "e": "assets/icons/gergaji.png"
        }
      ],
      "t": "🧰 Alat & Bahan"
    },
    {
      "pk": 0,
      "items": [
        {
          "n": "Krim",
          "ut": "pcs",
          "d": "Min. beli 10 • harga per 100 pcs",
          "p": 1000,
          "id": "krim",
          "e": "assets/icons/krim.png",
          "u": 100,
          "c": "#f57c1f"
        },
        {
          "c": "#e9b200",
          "u": 100,
          "e": "assets/icons/gulaputih.png",
          "ut": "pcs",
          "d": "Min. beli 10 • harga per 100 pcs",
          "p": 1500,
          "id": "gulaputih",
          "n": "Gula Putih"
        },
        {
          "ut": "pcs",
          "d": "Min. beli 10 • harga per 100 pcs",
          "p": 1000,
          "n": "Gula Merah",
          "u": 100,
          "c": "#27b83a",
          "id": "gulamerah",
          "e": "assets/icons/gulamerah.png"
        },
        {
          "id": "babi",
          "n": "Daging Babi",
          "p": 1200,
          "d": "Min. beli 10 • harga per 100 pcs",
          "ut": "pcs",
          "e": "assets/icons/babi.png",
          "c": "#13a9a0",
          "u": 100
        },
        {
          "e": "assets/icons/telor.png",
          "id": "telor",
          "u": 100,
          "c": "#2d73e6",
          "n": "Telor",
          "ut": "pcs",
          "d": "Min. beli 10 • harga per 100 pcs",
          "p": 1000
        },
        {
          "ut": "pcs",
          "p": 1000,
          "d": "Min. beli 10 • harga per 100 pcs",
          "n": "Mentega",
          "u": 100,
          "c": "#7a2fe0",
          "id": "mentega",
          "e": "assets/icons/mentega.png"
        },
        {
          "c": "#e8359b",
          "min": 20,
          "u": 100,
          "ut": "pcs",
          "p": 1500,
          "id": "keju",
          "n": "Keju",
          "e": "assets/icons/keju.png",
          "d": "Min. beli 20 • harga per 100 pcs"
        },
        {
          "id": "item_1792585533841",
          "d": "Min. Beli 20.harga per 100pcs",
          "ut": "pcs",
          "e": "assets/icons/Goat Cheese.png",
          "n": "Keju kambing",
          "p": 2500,
          "min": 20,
          "c": "#46b23c",
          "u": 100
        },
        {
          "p": 1500,
          "d": "Min. Beli 10.harga per 100pcs",
          "id": "item_1792620525627",
          "n": "Sirup",
          "c": "#46b23c",
          "ut": "pcs",
          "u": 100,
          "e": "assets/icons/Syrup.png"
        },
        {
          "d": "Min. Beli 10.harga per 100pcs",
          "e": "assets/icons/Milk.png",
          "min": 0,
          "id": "item_1792672242168",
          "n": "Susu sapi",
          "p": 1200,
          "ut": "pcs",
          "u": 100,
          "c": "#46b23c"
        }
      ],
      "t": "🥛 Dapur & Peternakan"
    },
    {
      "items": [
        {
          "d": "Min. beli 10 • harga per 100 pcs",
          "p": 1500,
          "ut": "pcs",
          "n": "Ikan",
          "c": "#7a2fe0",
          "id": "ikan",
          "u": 100,
          "e": "assets/icons/ikan.png"
        },
        {
          "n": "Lopster",
          "ut": "pcs",
          "d": "Min. beli 10 • harga per 100 pcs",
          "p": 2500,
          "id": "lopster",
          "e": "assets/icons/lopster.png",
          "u": 100,
          "c": "#13a9a0"
        },
        {
          "ut": "pcs",
          "c": "#46b23c",
          "u": 100,
          "n": "Bulu bebek",
          "id": "item_1793150328793",
          "p": 2500,
          "e": "assets/icons/Duck Feather.png",
          "min": 20,
          "d": "Min. beli 20 • harga per 100 pcs"
        }
      ],
      "t": "🌊 Laut",
      "pk": 0
    },
    {
      "pk": 1,
      "items": [
        {
          "p": 1500,
          "ut": "paket",
          "icons": [
            "assets/icons/Bolt.png",
            "assets/icons/Plank.png",
            "assets/icons/Duct Tape.png"
          ],
          "n": "Tagar BEM",
          "c": "#2e9a3a",
          "u": 1,
          "id": "bem1",
          "d": "Per paket",
          "e": "assets/icons/bem.png"
        },
        {
          "e": "assets/icons/bem.png",
          "icons": [
            "assets/icons/Bolt.png",
            "assets/icons/Plank.png",
            "assets/icons/Duct Tape.png"
          ],
          "min": 0,
          "d": "Per paket",
          "u": 1,
          "id": "bem30",
          "c": "#2d73e6",
          "n": "30Tagar BEM",
          "ut": "paket",
          "p": 30000
        }
      ],
      "t": "🏡 Tagar BEM (per paket)"
    },
    {
      "items": [
        {
          "id": "k1",
          "n": "Juta Koin lv 40++",
          "d": "Lumbung kosong 250",
          "p": 8000,
          "ut": "paket",
          "e": "assets/icons/koin.png",
          "u": 1,
          "c": "#7a2fe0"
        },
        {
          "u": 1,
          "c": "#e8359b",
          "e": "assets/icons/koin.png",
          "id": "k10",
          "d": "Lumbung kosong 250",
          "p": 70000,
          "n": "Juta Koin lv 40++",
          "ut": "paket"
        }
      ],
      "t": "🪙 Koin LV 40++ (Lumbung kosong 250)",
      "pk": 1
    },
    {
      "items": [
        {
          "id": "item_1792640988855",
          "d": "Min. Beli 20.harga per 100pcs",
          "min": 20,
          "ut": "pcs",
          "e": "assets/icons/Soy Sauce.png",
          "n": "Kecap asin",
          "p": 3200,
          "c": "#46b23c",
          "u": 100
        },
        {
          "p": 3000,
          "n": "Minyak zaitun",
          "u": 100,
          "c": "#46b23c",
          "ut": "pcs",
          "d": "Min. Beli 10.harga per 100pcs",
          "id": "item_1792641515177",
          "min": 0,
          "e": "assets/icons/Olive Oil.png"
        },
        {
          "ut": "pcs",
          "n": "Saus tomat",
          "min": 0,
          "p": 3000,
          "id": "item_1792641574420",
          "u": 100,
          "c": "#46b23c",
          "d": "Min. Beli 10.harga per 100pcs",
          "e": "assets/icons/Tomato Sauce.png"
        },
        {
          "e": "assets/icons/Mayonnaise.png",
          "d": "Min. Beli 10.harga per 100pcs",
          "min": 0,
          "u": 100,
          "c": "#46b23c",
          "id": "item_1792641709687",
          "p": 3200,
          "n": "Mayones",
          "ut": "pcs"
        },
        {
          "e": "assets/icons/Lemon Curd.png",
          "id": "item_1792641751669",
          "min": 20,
          "ut": "pcs",
          "d": "Min. Beli 10.harga per 100pcs",
          "u": 100,
          "c": "#46b23c",
          "n": "Didih lemon",
          "p": 3700
        },
        {
          "e": "assets/icons/Salsa.png",
          "min": 0,
          "d": "Min. Beli 10.harga per 100pcs",
          "id": "item_1792641813955",
          "u": 100,
          "c": "#46b23c",
          "n": "Salsa",
          "ut": "pcs",
          "p": 3100
        }
      ],
      "pk": 0,
      "t": "Pembuat saus"
    },
    {
      "items": [
        {
          "id": "item_1793149029931",
          "d": "Min. beli 20 • harga per 100 pcs",
          "min": 20,
          "ut": "pcs",
          "e": "assets/icons/Beeswax.png",
          "p": 2500,
          "n": "Lilin lebah",
          "u": 100,
          "c": "#46b23c"
        },
        {
          "e": "assets/icons/Honey.png",
          "id": "item_1793149143512",
          "min": 20,
          "d": "Min. beli 20 • harga per 100 pcs",
          "ut": "pcs",
          "c": "#46b23c",
          "u": 100,
          "n": "Madu",
          "p": 2000
        }
      ],
      "t": "Pengekstrak madu",
      "pk": 0
    },
    {
      "items": [
        {
          "e": "assets/icons/Bread.png",
          "d": "Min. beli 10 • harga per 100 pcs",
          "c": "#46b23c",
          "id": "item_1794226541035",
          "u": 100,
          "n": "Roti",
          "min": 10,
          "ut": "pcs",
          "p": 4000
        }
      ],
      "t": "Toko Roti",
      "pk": 0
    },
    {
      "items": [
        {
          "p": 4000,
          "n": "Besi batanga",
          "u": 100,
          "c": "#46b23c",
          "ut": "pcs",
          "d": "Min. beli 10 • harga per 100 pcs",
          "min": 10,
          "id": "item_1794655121551",
          "e": "assets/icons/Iron Bar.png"
        },
        {
          "p": 4000,
          "ut": "pcs",
          "n": "Batu bara",
          "c": "#46b23c",
          "id": "item_1794801507513",
          "u": 100,
          "d": "Min. beli 10 • harga per 100 pcs",
          "min": 10,
          "e": "assets/icons/Refined Coal.png"
        },
        {
          "id": "item_1794801655243",
          "d": "Min. beli 10 • harga per 100 pcs",
          "ut": "pcs",
          "e": "assets/icons/Gold Bar.png",
          "p": 4000,
          "n": "Emas",
          "min": 10,
          "u": 100,
          "c": "#46b23c"
        },
        {
          "ut": "pcs",
          "u": 100,
          "c": "#46b23c",
          "n": "Perak",
          "id": "item_1794801834044",
          "p": 4000,
          "min": 10,
          "e": "assets/icons/Silver Bar.png",
          "d": "Min. beli 10 • harga per 100 pcs"
        },
        {
          "c": "#46b23c",
          "u": 100,
          "min": 10,
          "p": 4000,
          "n": "Platinum",
          "e": "assets/icons/Platinum Bar.png",
          "ut": "pcs",
          "d": "Min. beli 10 • harga per 100 pcs",
          "id": "item_1794801987793"
        }
      ],
      "t": "Peleburan",
      "pk": 0
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
