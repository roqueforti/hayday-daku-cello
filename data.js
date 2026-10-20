// Konfigurasi Default & Shared Data Hay Day Daku Cello
var DEFAULT_WA = "6287719747833";
var DEFAULT_THX = "🌻 Terima kasih sudah percaya! WA: 087719747833 🌻";

var DEFAULT_SECTIONS = [
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
];

// Helper Functions Universal
function rp(n) {
  return "Rp" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getUnitVal(it) {
  if (it.u !== undefined && it.u !== null && it.u !== "") {
    var customUnit = Number(it.u);
    return customUnit > 0 ? customUnit : 1;
  }
  return it.pk ? 1 : 100;
}

function getUnitName(it) {
  if (it.ut && String(it.ut).trim()) return String(it.ut).trim();
  return it.pk ? "paket" : "pcs";
}

function getUnitLabel(it) {
  var name = getUnitName(it);
  var u = getUnitVal(it);
  if (name === "paket" && u === 1) return "paket";
  return u === 1 ? name : u + " " + name;
}

function parseQuickOptions(it) {
  if (it.opsi && String(it.opsi).trim()) {
    var arr = String(it.opsi)
      .split(/[,;\s]+/)
      .map(function (x) {
        return parseInt(x.trim(), 10);
      })
      .filter(function (x) {
        return !isNaN(x) && x > 0;
      });
    if (arr.length > 0) return arr;
  }
  return [];
}

function getMinQty(it) {
  if (it.min !== undefined && it.min !== null && it.min !== "") {
    var m = Number(it.min);
    if (m > 0) return m;
  }
  if (it.pk || getUnitName(it) === "paket") return 1;
  var u = getUnitVal(it);
  return u <= 5 ? 1 : 10;
}

function getStepQty(it) {
  if (it.pk || getUnitName(it) === "paket") return 1;
  var u = getUnitVal(it);
  return u === 1 ? 1 : (u <= 10 ? u : 10);
}

function calcPrice(it, qty) {
  if (!qty || qty <= 0) return 0;
  return (it.p / getUnitVal(it)) * qty;
}

// Membersihkan awalan angka/jumlah seperti "100 Kapak" -> "Kapak"
function cleanItemName(n) {
  if (!n) return "";
  var trimmed = String(n).trim();
  // Hanya bersihkan awalan angka bulat murni diikuti spasi (misal "100 Kapak", "1 Tagar BEM", bukan "1 Juta Koin" / "10 Juta Koin")
  var m = trimmed.match(/^(\d+)\s+(.+)$/);
  if (m) {
    var firstWord = m[2].trim().split(/\s+/)[0].toLowerCase();
    if (firstWord === "juta" || firstWord === "k" || firstWord === "m" || firstWord === "coin" || firstWord === "koin") {
      return trimmed;
    }
    return m[2].trim();
  }
  return trimmed;
}

function getStoreData() {
  var data = {
    wa: DEFAULT_WA,
    thx: DEFAULT_THX,
    sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS))
  };
  try {
    var saved = localStorage.getItem("hayday_daku_cello_data");
    if (saved) {
      var parsed = JSON.parse(saved);
      if (parsed.wa) data.wa = parsed.wa;
      if (parsed.thx) data.thx = parsed.thx;
      if (parsed.sections && Array.isArray(parsed.sections) && parsed.sections.length > 0) {
        data.sections = parsed.sections;
        // Bersihkan nama produk lama dari angka di depannya (misal "100 Kapak" -> "Kapak")
        data.sections.forEach(function (sec) {
          if (sec && Array.isArray(sec.items)) {
            sec.items.forEach(function (it) {
              if (it && it.n) {
                it.n = cleanItemName(it.n);
              }
              // Dukungan bawaan icons bundle untuk paket BEM jika belum tersetup
              if (it && (it.id === "bem1" || it.id === "bem30" || (it.n && it.n.toLowerCase().indexOf("bem") !== -1))) {
                if (!it.icons || !Array.isArray(it.icons) || it.icons.length === 0) {
                  it.icons = ["assets/icons/Bolt.png", "assets/icons/Plank.png", "assets/icons/Duct Tape.png"];
                }
              }
            });
          }
        });
      }
    }
  } catch (e) {
    console.warn("Gagal membaca localStorage, memakai default:", e);
  }
  return data;
}

// ==========================================
// FIREBASE CLOUD DATABASE REALTIME SYNC
// ==========================================
var FIREBASE_CONFIG = {
  apiKey: "AIzaSyB2vKWEt55J6A5mBJaCyI3eB70tvXkkQnk",
  authDomain: "dakucello.firebaseapp.com",
  projectId: "dakucello",
  storageBucket: "dakucello.firebasestorage.app",
  messagingSenderId: "395549212760",
  appId: "1:395549212760:web:5b7374880a31023862ca2d",
  measurementId: "G-103C816WWQ"
};

var firestoreDb = null;

function initFirebaseDb() {
  if (firestoreDb) return firestoreDb;
  try {
    if (typeof firebase !== "undefined" && firebase.initializeApp) {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      firestoreDb = firebase.firestore();
      return firestoreDb;
    }
  } catch (err) {
    console.warn("Inisialisasi Firebase gagal, fallback ke offline:", err);
  }
  return null;
}

// Simpan data toko ke Cloud Firestore
function saveStoreDataToCloud(dataObj, callback) {
  var db = initFirebaseDb();
  if (!db) {
    if (callback) callback(null);
    return;
  }
  try {
    var payload = {
      wa: dataObj.wa || DEFAULT_WA,
      thx: dataObj.thx || DEFAULT_THX,
      sections: dataObj.sections || DEFAULT_SECTIONS,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    db.collection("settings").doc("store").set(payload, { merge: true })
      .then(function() {
        console.log("Data berhasil tersimpan di Firebase Firestore Cloud ✅");
        if (callback) callback(true);
      })
      .catch(function(err) {
        console.error("Gagal simpan ke Firestore:", err);
        if (callback) callback(false, err);
      });
  } catch (e) {
    console.error("Error saveStoreDataToCloud:", e);
    if (callback) callback(false, e);
  }
}

// Berlangganan (listen) perubahan data secara realtime dari Firestore
function listenStoreDataCloud(onUpdateCallback) {
  var db = initFirebaseDb();
  if (!db) return;
  try {
    db.collection("settings").doc("store").onSnapshot(function(doc) {
      if (doc.exists) {
        var cloudData = doc.data();
        if (cloudData && cloudData.sections && Array.isArray(cloudData.sections)) {
          // Bersihkan nama jika perlu
          cloudData.sections.forEach(function (sec) {
            if (sec && Array.isArray(sec.items)) {
              sec.items.forEach(function (it) {
                if (it && it.n && typeof cleanItemName === "function") {
                  it.n = cleanItemName(it.n);
                }
              });
            }
          });
          // Update cache lokal
          try {
            localStorage.setItem("hayday_daku_cello_data", JSON.stringify(cloudData));
          } catch(e) {}
          if (onUpdateCallback) onUpdateCallback(cloudData);
        }
      }
    }, function(err) {
      console.warn("Firestore listener error:", err);
    });
  } catch(e) {
    console.warn("listenStoreDataCloud error:", e);
  }
}

