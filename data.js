// Konfigurasi Default & Shared Data Hay Day Daku Cello
var DEFAULT_WA = "6287719747833";
var DEFAULT_THX = "🌻 Terima kasih sudah percaya! WA: 087719747833 🌻";

var DEFAULT_SECTIONS = [
  {
    t: "🧰 Alat & Bahan",
    items: [
      { id: "sekop", e: "assets/icons/sekop.png", n: "100 Sekop", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#7a2fe0" },
      { id: "kapak", e: "assets/icons/kapak.png", n: "100 Kapak", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#e8359b" },
      { id: "gergaji", e: "assets/icons/gergaji.png", n: "100 Gergaji", u: 100, ut: "pcs", p: 1500, d: "Min. beli 10 • harga per 100 pcs", c: "#e0232f" }
    ]
  },
  {
    t: "🥛 Dapur & Peternakan",
    items: [
      { id: "krim", e: "assets/icons/krim.png", n: "100 Krim", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#f57c1f" },
      { id: "gulaputih", e: "assets/icons/gulaputih.png", n: "100 Gula Putih", u: 100, ut: "pcs", p: 1500, d: "Min. beli 10 • harga per 100 pcs", c: "#e9b200" },
      { id: "gulamerah", e: "assets/icons/gulamerah.png", n: "100 Gula Merah", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#27b83a" },
      { id: "babi", e: "assets/icons/babi.png", n: "100 Daging Babi", u: 100, ut: "pcs", p: 1200, d: "Min. beli 10 • harga per 100 pcs", c: "#13a9a0" },
      { id: "telor", e: "assets/icons/telor.png", n: "100 Telor", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#2d73e6" },
      { id: "mentega", e: "assets/icons/mentega.png", n: "100 Mentega", u: 100, ut: "pcs", p: 1000, d: "Min. beli 10 • harga per 100 pcs", c: "#7a2fe0" },
      { id: "keju", e: "assets/icons/keju.png", n: "100 Keju", u: 100, ut: "pcs", p: 1500, d: "Min. beli 10 • harga per 100 pcs", c: "#e8359b" },
      { id: "madu", e: "assets/icons/madu.png", n: "100 Madu", u: 100, ut: "pcs", p: 2000, d: "Min. beli 10 • harga per 100 pcs", c: "#e0232f" }
    ]
  },
  {
    t: "🌊 Laut",
    items: [
      { id: "ikan", e: "assets/icons/ikan.png", n: "100 Ikan", u: 100, ut: "pcs", p: 1500, d: "Min. beli 10 • harga per 100 pcs", c: "#7a2fe0" },
      { id: "lopster", e: "assets/icons/lopster.png", n: "100 Lopster", u: 100, ut: "pcs", p: 2500, d: "Min. beli 10 • harga per 100 pcs", c: "#13a9a0" }
    ]
  },
  {
    t: "🏡 Tagar BEM (per paket)",
    pk: 1,
    items: [
      { id: "bem1", e: "assets/icons/bem.png", n: "1 Tagar BEM", u: 1, ut: "paket", p: 1500, d: "Per paket", c: "#2e9a3a" },
      { id: "bem30", e: "assets/icons/bem.png", n: "30 Tagar BEM", u: 1, ut: "paket", p: 28500, d: "Per paket", c: "#2d73e6" }
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
  var opts = parseQuickOptions(it);
  if (opts.length > 0) return opts[0];
  if (it.min !== undefined && it.min !== null && it.min !== "") {
    var m = Number(it.min);
    if (m > 0) return m;
  }
  if (it.pk || getUnitName(it) === "paket") return 1;
  var u = getUnitVal(it);
  return u <= 5 ? 1 : (u <= 10 ? 10 : 10);
}

function getStepQty(it) {
  var opts = parseQuickOptions(it);
  if (opts.length > 0) return opts[0];
  if (it.pk || getUnitName(it) === "paket") return 1;
  var u = getUnitVal(it);
  return u === 1 ? 1 : (u <= 10 ? u : 10);
}

function calcPrice(it, qty) {
  return (it.p / getUnitVal(it)) * (qty || 0);
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
      }
    }
  } catch (e) {
    console.warn("Gagal membaca localStorage, memakai default:", e);
  }
  return data;
}
