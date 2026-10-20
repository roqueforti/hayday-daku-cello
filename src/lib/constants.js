export const DEFAULT_WA = "6287719747833";
export const DEFAULT_THX = "🌻 Terima kasih sudah percaya! WA: 087719747833 🌻";

export const DEFAULT_SECTIONS = [
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

export const ICON_CATEGORIES = [
  {
    name: "⭐ Alat & Pertambangan Resmi (Tools & Mining)",
    isImg: true,
    icons: [
      { label: "Sekop", src: "assets/icons/Shovel.png" },
      { label: "Kapak", src: "assets/icons/Axe.png" },
      { label: "Gergaji", src: "assets/icons/Saw.png" },
      { label: "Beliung (Pickaxe)", src: "assets/icons/Pickaxe.png" },
      { label: "Dinamit", src: "assets/icons/Dynamite.png" },
      { label: "TNT Barrel", src: "assets/icons/TNT Barrel.png" }
    ]
  },
  {
    name: "🏡 Tagar BEM, SEM, LEM (Alat Upgrade Lumbung & Tanah)",
    isImg: true,
    icons: [
      { label: "Plank (Papan)", src: "assets/icons/Plank.png" },
      { label: "Bolt (Baut)", src: "assets/icons/Bolt.png" },
      { label: "Duct Tape (Lakban)", src: "assets/icons/Duct Tape.png" },
      { label: "Nail (Paku)", src: "assets/icons/Nail.png" },
      { label: "Screw (Sekrup)", src: "assets/icons/Screw.png" },
      { label: "Wood Panel", src: "assets/icons/Wood Panel.png" },
      { label: "Land Deed", src: "assets/icons/Land Deed.png" },
      { label: "Mallet (Palu Kayu)", src: "assets/icons/Mallet.png" },
      { label: "Marker Stake", src: "assets/icons/Marker Stake.png" },
      { label: "Map Piece", src: "assets/icons/Map Piece.png" },
      { label: "Expansion Permit", src: "assets/icons/Expansion Permit.png" }
    ]
  },
  {
    name: "🌾 Hasil Tani Resmi (Crops)",
    isImg: true,
    icons: [
      { label: "Gandum (Wheat)", src: "assets/icons/Wheat.png" },
      { label: "Jagung (Corn)", src: "assets/icons/Corn.png" },
      { label: "Kedelai (Soybean)", src: "assets/icons/Soybean.png" },
      { label: "Tebu (Sugarcane)", src: "assets/icons/Sugarcane.png" },
      { label: "Wortel (Carrot)", src: "assets/icons/Carrot.png" },
      { label: "Indigo", src: "assets/icons/Indigo.png" },
      { label: "Labu (Pumpkin)", src: "assets/icons/Pumpkin.png" },
      { label: "Kapas (Cotton)", src: "assets/icons/Cotton.png" },
      { label: "Apel (Apple)", src: "assets/icons/Apple.png" },
      { label: "Ceri (Cherry)", src: "assets/icons/Cherry.png" },
      { label: "Tomat (Tomato)", src: "assets/icons/Tomato.png" },
      { label: "Kentang (Potato)", src: "assets/icons/Potato.png" },
      { label: "Stroberi (Strawberry)", src: "assets/icons/Strawberry.png" },
      { label: "Blackberry", src: "assets/icons/Blackberry.png" },
      { label: "Kopi (Coffee Bean)", src: "assets/icons/Coffee Bean.png" },
      { label: "Beras (Rice)", src: "assets/icons/Rice.png" },
      { label: "Selada (Lettuce)", src: "assets/icons/Lettuce.png" }
    ]
  },
  {
    name: "🥛 Peternakan & Dapur Resmi (Dairy & Animal Goods)",
    isImg: true,
    icons: [
      { label: "Telor (Egg)", src: "assets/icons/Egg.png" },
      { label: "Susu (Milk)", src: "assets/icons/Milk.png" },
      { label: "Daging Babi (Bacon)", src: "assets/icons/Bacon.png" },
      { label: "Wol (Wool)", src: "assets/icons/Wool.png" },
      { label: "Ikan Fillet", src: "assets/icons/Fish Fillet.png" },
      { label: "Lopster Tail", src: "assets/icons/Lobster Tail.png" },
      { label: "Madu (Honey)", src: "assets/icons/Honey.png" },
      { label: "Susu Kambing", src: "assets/icons/Goat Milk.png" },
      { label: "Krim (Cream)", src: "assets/icons/Cream.png" },
      { label: "Mentega (Butter)", src: "assets/icons/Butter.png" },
      { label: "Keju (Cheese)", src: "assets/icons/Cheese.png" },
      { label: "Keju Kambing", src: "assets/icons/Goat Cheese.png" },
      { label: "Gula Putih", src: "assets/icons/White Sugar.png" },
      { label: "Gula Merah", src: "assets/icons/Brown Sugar.png" },
      { label: "Sirup (Syrup)", src: "assets/icons/Syrup.png" }
    ]
  },
  {
    name: "🍞 Makanan & Kue Resmi (Bakery & Foods)",
    isImg: true,
    icons: [
      { label: "Roti (Bread)", src: "assets/icons/Bread.png" },
      { label: "Corn Bread", src: "assets/icons/Corn Bread.png" },
      { label: "Cookie", src: "assets/icons/Cookie.png" },
      { label: "Pancake", src: "assets/icons/Pancake.png" },
      { label: "Bacon & Eggs", src: "assets/icons/Bacon and Eggs.png" },
      { label: "Carrot Pie", src: "assets/icons/Carrot Pie.png" },
      { label: "Pumpkin Pie", src: "assets/icons/Pumpkin Pie.png" },
      { label: "Apple Pie", src: "assets/icons/Apple Pie.png" },
      { label: "Fish Pie", src: "assets/icons/Fish Pie.png" },
      { label: "Pizza", src: "assets/icons/Pizza.png" },
      { label: "Popcorn", src: "assets/icons/Popcorn.png" }
    ]
  },
  {
    name: "💰 Koin, Logam Mulia & Perhiasan Resmi",
    isImg: true,
    icons: [
      { label: "Koin Emas", src: "assets/icons/Coins.png" },
      { label: "Berlian (Diamond)", src: "assets/icons/Diamond.png" },
      { label: "Gold Bar (Batang Emas)", src: "assets/icons/Gold Bar.png" },
      { label: "Silver Bar", src: "assets/icons/Silver Bar.png" },
      { label: "Platinum Bar", src: "assets/icons/Platinum Bar.png" },
      { label: "Cincin Berlian", src: "assets/icons/Diamond Ring.png" },
      { label: "Kalung (Necklace)", src: "assets/icons/Necklace.png" },
      { label: "Gelang (Bracelet)", src: "assets/icons/Bracelet.png" }
    ]
  }
];
