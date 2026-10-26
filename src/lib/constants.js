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
    "name": "⭐ Alat & Pertambangan Resmi (Tools & Mining)",
    "isImg": true,
    "icons": [
      {
        "label": "Sekop",
        "src": "assets/icons/Shovel.png"
      },
      {
        "label": "Kapak",
        "src": "assets/icons/Axe.png"
      },
      {
        "label": "Gergaji",
        "src": "assets/icons/Saw.png"
      },
      {
        "label": "Beliung (Pickaxe)",
        "src": "assets/icons/Pickaxe.png"
      },
      {
        "label": "Dinamit",
        "src": "assets/icons/Dynamite.png"
      },
      {
        "label": "TNT Barrel",
        "src": "assets/icons/TNT Barrel.png"
      }
    ]
  },
  {
    "name": "🏡 Tagar BEM, SEM, LEM (Alat Upgrade Lumbung & Tanah)",
    "isImg": true,
    "icons": [
      {
        "label": "Plank (Papan)",
        "src": "assets/icons/Plank.png"
      },
      {
        "label": "Bolt (Baut)",
        "src": "assets/icons/Bolt.png"
      },
      {
        "label": "Duct Tape (Lakban)",
        "src": "assets/icons/Duct Tape.png"
      },
      {
        "label": "Nail (Paku)",
        "src": "assets/icons/Nail.png"
      },
      {
        "label": "Screw (Sekrup)",
        "src": "assets/icons/Screw.png"
      },
      {
        "label": "Wood Panel",
        "src": "assets/icons/Wood Panel.png"
      },
      {
        "label": "Land Deed (Surat Tanah)",
        "src": "assets/icons/Land Deed.png"
      },
      {
        "label": "Mallet (Palu Kayu)",
        "src": "assets/icons/Mallet.png"
      },
      {
        "label": "Marker Stake (Patok)",
        "src": "assets/icons/Marker Stake.png"
      },
      {
        "label": "Map Piece (Peta)",
        "src": "assets/icons/Map Piece.png"
      },
      {
        "label": "Expansion Permit (Izin)",
        "src": "assets/icons/Expansion Permit.png"
      }
    ]
  },
  {
    "name": "🏛️ Material Kota Resmi (Town Supplies)",
    "isImg": true,
    "icons": [
      {
        "label": "Batu Bata (Brick)",
        "src": "assets/icons/Brick.png"
      },
      {
        "label": "Bor Tangan (Hand Drill)",
        "src": "assets/icons/Hand Drill.png"
      },
      {
        "label": "Ember Cat (Paint Bucket)",
        "src": "assets/icons/Paint Bucket.png"
      },
      {
        "label": "Ember Aspal (Tar Bucket)",
        "src": "assets/icons/Tar Bucket.png"
      },
      {
        "label": "Palu (Hammer)",
        "src": "assets/icons/Hammer.png"
      },
      {
        "label": "Balok Batu (Stone Block)",
        "src": "assets/icons/Stone Block.png"
      }
    ]
  },
  {
    "name": "🎣 Alat Pancing, Umpan & Jaring (Fishing)",
    "isImg": true,
    "icons": [
      {
        "label": "Umpan Merah",
        "src": "assets/icons/Red Lure.png"
      },
      {
        "label": "Umpan Hijau",
        "src": "assets/icons/Green Lure.png"
      },
      {
        "label": "Umpan Biru",
        "src": "assets/icons/Blue Lure.png"
      },
      {
        "label": "Umpan Ungu",
        "src": "assets/icons/Purple Lure.png"
      },
      {
        "label": "Umpan Emas",
        "src": "assets/icons/Gold Lure.png"
      },
      {
        "label": "Jaring Ikan",
        "src": "assets/icons/Fishing Net.png"
      },
      {
        "label": "Jaring Misteri",
        "src": "assets/icons/Mystery Net.png"
      },
      {
        "label": "Perangkap Lopster",
        "src": "assets/icons/Lobster Trap.png"
      },
      {
        "label": "Perangkap Bebek",
        "src": "assets/icons/Duck Trap.png"
      }
    ]
  },
  {
    "name": "🌾 Hasil Tani, Kebun & Pohon Resmi (Crops & Fruits)",
    "isImg": true,
    "icons": [
      {
        "label": "Gandum (Wheat)",
        "src": "assets/icons/Wheat.png"
      },
      {
        "label": "Jagung (Corn)",
        "src": "assets/icons/Corn.png"
      },
      {
        "label": "Kedelai (Soybean)",
        "src": "assets/icons/Soybean.png"
      },
      {
        "label": "Tebu (Sugarcane)",
        "src": "assets/icons/Sugarcane.png"
      },
      {
        "label": "Wortel (Carrot)",
        "src": "assets/icons/Carrot.png"
      },
      {
        "label": "Indigo",
        "src": "assets/icons/Indigo.png"
      },
      {
        "label": "Labu (Pumpkin)",
        "src": "assets/icons/Pumpkin.png"
      },
      {
        "label": "Kapas (Cotton)",
        "src": "assets/icons/Cotton.png"
      },
      {
        "label": "Cabai (Chili Pepper)",
        "src": "assets/icons/Chili Pepper.png"
      },
      {
        "label": "Tomat (Tomato)",
        "src": "assets/icons/Tomato.png"
      },
      {
        "label": "Stroberi (Strawberry)",
        "src": "assets/icons/Strawberry.png"
      },
      {
        "label": "Kentang (Potato)",
        "src": "assets/icons/Potato.png"
      },
      {
        "label": "Wijen (Sesame)",
        "src": "assets/icons/Sesame.png"
      },
      {
        "label": "Nanas (Pineapple)",
        "src": "assets/icons/Pineapple.png"
      },
      {
        "label": "Bunga Lily",
        "src": "assets/icons/Lily.png"
      },
      {
        "label": "Beras (Rice)",
        "src": "assets/icons/Rice.png"
      },
      {
        "label": "Selada (Lettuce)",
        "src": "assets/icons/Lettuce.png"
      },
      {
        "label": "Bawang Putih (Garlic)",
        "src": "assets/icons/Garlic.png"
      },
      {
        "label": "Bunga Matahari",
        "src": "assets/icons/Sunflower.png"
      },
      {
        "label": "Kubis / Kol (Cabbage)",
        "src": "assets/icons/Cabbage.png"
      },
      {
        "label": "Bawang Bombay (Onion)",
        "src": "assets/icons/Onion.png"
      },
      {
        "label": "Mentimun (Cucumber)",
        "src": "assets/icons/Cucumber.png"
      },
      {
        "label": "Apel (Apple)",
        "src": "assets/icons/Apple.png"
      },
      {
        "label": "Ceri (Cherry)",
        "src": "assets/icons/Cherry.png"
      },
      {
        "label": "Blackberry",
        "src": "assets/icons/Blackberry.png"
      },
      {
        "label": "Raspberry",
        "src": "assets/icons/Raspberry.png"
      },
      {
        "label": "Cacao (Cokelat)",
        "src": "assets/icons/Cacao.png"
      },
      {
        "label": "Kopi (Coffee Bean)",
        "src": "assets/icons/Coffee Bean.png"
      },
      {
        "label": "Zaitun (Olive)",
        "src": "assets/icons/Olive.png"
      },
      {
        "label": "Lemon",
        "src": "assets/icons/Lemon.png"
      },
      {
        "label": "Jeruk (Orange)",
        "src": "assets/icons/Orange.png"
      },
      {
        "label": "Persik (Peach)",
        "src": "assets/icons/Peach.png"
      },
      {
        "label": "Pisang (Banana)",
        "src": "assets/icons/Banana.png"
      },
      {
        "label": "Plum",
        "src": "assets/icons/Plum.png"
      },
      {
        "label": "Mangga (Mango)",
        "src": "assets/icons/Mango.png"
      },
      {
        "label": "Kelapa (Coconut)",
        "src": "assets/icons/Coconut.png"
      },
      {
        "label": "Jambu Biji (Guava)",
        "src": "assets/icons/Guava.png"
      },
      {
        "label": "Delima (Pomegranate)",
        "src": "assets/icons/Pomegranate.png"
      },
      {
        "label": "Semangka (Watermelon)",
        "src": "assets/icons/Watermelon.png"
      },
      {
        "label": "Teh (Tea Leaf)",
        "src": "assets/icons/Tea Leaf.png"
      },
      {
        "label": "Jamur (Mushroom)",
        "src": "assets/icons/Mushroom.png"
      },
      {
        "label": "Asparagus",
        "src": "assets/icons/Asparagus.png"
      },
      {
        "label": "Paprika (Bell Pepper)",
        "src": "assets/icons/Bell Pepper.png"
      },
      {
        "label": "Kacang Tanah (Peanuts)",
        "src": "assets/icons/Peanuts.png"
      }
    ]
  },
  {
    "name": "🥛 Hasil Hewan Ternak & Dapur Dasar (Animal Goods & Dairy)",
    "isImg": true,
    "icons": [
      {
        "label": "Telor (Egg)",
        "src": "assets/icons/Egg.png"
      },
      {
        "label": "Susu Sapi (Milk)",
        "src": "assets/icons/Milk.png"
      },
      {
        "label": "Daging Babi (Bacon)",
        "src": "assets/icons/Bacon.png"
      },
      {
        "label": "Wol Domba (Wool)",
        "src": "assets/icons/Wool.png"
      },
      {
        "label": "Ikan Fillet",
        "src": "assets/icons/Fish Fillet.png"
      },
      {
        "label": "Ekor Lopster",
        "src": "assets/icons/Lobster Tail.png"
      },
      {
        "label": "Madu (Honey)",
        "src": "assets/icons/Honey.png"
      },
      {
        "label": "Susu Kambing",
        "src": "assets/icons/Goat Milk.png"
      },
      {
        "label": "Krim (Cream)",
        "src": "assets/icons/Cream.png"
      },
      {
        "label": "Mentega (Butter)",
        "src": "assets/icons/Butter.png"
      },
      {
        "label": "Keju (Cheese)",
        "src": "assets/icons/Cheese.png"
      },
      {
        "label": "Keju Kambing",
        "src": "assets/icons/Goat Cheese.png"
      },
      {
        "label": "Sarang Lebah (Honeycomb)",
        "src": "assets/icons/Honeycomb.png"
      },
      {
        "label": "Lilin Lebah (Beeswax)",
        "src": "assets/icons/Beeswax.png"
      },
      {
        "label": "Bulu Bebek (Duck Feather)",
        "src": "assets/icons/Duck Feather.png"
      },
      {
        "label": "Daging Domba (Lamb Chop)",
        "src": "assets/icons/Lamb Chop.png"
      },
      {
        "label": "Daging Kerang (Mussel Meat)",
        "src": "assets/icons/Mussel Meat.png"
      }
    ]
  },
  {
    "name": "🍞 Toko Roti, Roti Lapis & Pasta (Bakery, Sandwich & Pasta)",
    "isImg": true,
    "icons": [
      {
        "label": "Roti Tawar (Bread)",
        "src": "assets/icons/Bread.png"
      },
      {
        "label": "Roti Jagung (Corn Bread)",
        "src": "assets/icons/Corn Bread.png"
      },
      {
        "label": "Kukis (Cookie)",
        "src": "assets/icons/Cookie.png"
      },
      {
        "label": "Roti Kentang (Potato Bread)",
        "src": "assets/icons/Potato Bread.png"
      },
      {
        "label": "Bagel Sayur (Veggie Bagel)",
        "src": "assets/icons/Veggie Bagel.png"
      },
      {
        "label": "Roti Bakar Daging (Bacon Toast)",
        "src": "assets/icons/Bacon Toast.png"
      },
      {
        "label": "Sandwich Telur (Egg Sandwich)",
        "src": "assets/icons/Egg Sandwich.png"
      },
      {
        "label": "Roti Bakar Madu (Honey Toast)",
        "src": "assets/icons/Honey Toast.png"
      },
      {
        "label": "Roti Bawang Putih (Garlic Bread)",
        "src": "assets/icons/Garlic Bread.png"
      },
      {
        "label": "Pasta Segar (Fresh Pasta)",
        "src": "assets/icons/Fresh Pasta.png"
      },
      {
        "label": "Mi Beras (Rice Noodles)",
        "src": "assets/icons/Rice Noodles.png"
      },
      {
        "label": "Pasta Pedas (Spicy Pasta)",
        "src": "assets/icons/Spicy Pasta.png"
      }
    ]
  },
  {
    "name": "🥧 Oven Pai, Kue & Camilan Manis (Pies, Cakes & Donuts)",
    "isImg": true,
    "icons": [
      {
        "label": "Pai Wortel (Carrot Pie)",
        "src": "assets/icons/Carrot Pie.png"
      },
      {
        "label": "Pai Labu (Pumpkin Pie)",
        "src": "assets/icons/Pumpkin Pie.png"
      },
      {
        "label": "Pai Apel (Apple Pie)",
        "src": "assets/icons/Apple Pie.png"
      },
      {
        "label": "Pai Ikan (Fish Pie)",
        "src": "assets/icons/Fish Pie.png"
      },
      {
        "label": "Pai Daging (Bacon Pie)",
        "src": "assets/icons/Bacon Pie.png"
      },
      {
        "label": "Pai Feta (Feta Pie)",
        "src": "assets/icons/Feta Pie.png"
      },
      {
        "label": "Pai Gembala (Shepherd's Pie)",
        "src": "assets/icons/Shepherd's Pie.png"
      },
      {
        "label": "Pai Lemon (Lemon Pie)",
        "src": "assets/icons/Lemon Pie.png"
      },
      {
        "label": "Pai Cokelat (Chocolate Pie)",
        "src": "assets/icons/Chocolate Pie.png"
      },
      {
        "label": "Kue Wortel (Carrot Cake)",
        "src": "assets/icons/Carrot Cake.png"
      },
      {
        "label": "Kue Krim (Cream Cake)",
        "src": "assets/icons/Cream Cake.png"
      },
      {
        "label": "Kue Buah Merah (Red Berry Cake)",
        "src": "assets/icons/Red Berry Cake.png"
      },
      {
        "label": "Cheesecake",
        "src": "assets/icons/Cheesecake.png"
      },
      {
        "label": "Kue Stroberi (Strawberry Cake)",
        "src": "assets/icons/Strawberry Cake.png"
      },
      {
        "label": "Kue Cokelat (Chocolate Cake)",
        "src": "assets/icons/Chocolate Cake.png"
      },
      {
        "label": "Kue Kentang Feta",
        "src": "assets/icons/Potato Feta Cake.png"
      },
      {
        "label": "Kue Apel Madu",
        "src": "assets/icons/Honey Apple Cake.png"
      },
      {
        "label": "Kue Mewah (Fancy Cake)",
        "src": "assets/icons/Fancy Cake.png"
      },
      {
        "label": "Kue Lemon (Lemon Cake)",
        "src": "assets/icons/Lemon Cake.png"
      },
      {
        "label": "Donat Polos (Plain Donut)",
        "src": "assets/icons/Plain Donut.png"
      },
      {
        "label": "Donat Krim (Cream Donut)",
        "src": "assets/icons/Cream Donut.png"
      },
      {
        "label": "Donat Renyah (Crunchy Donut)",
        "src": "assets/icons/Crunchy Donut.png"
      },
      {
        "label": "Muffin Raspberry",
        "src": "assets/icons/Raspberry Muffin.png"
      },
      {
        "label": "Muffin Blackberry",
        "src": "assets/icons/Blackberry Muffin.png"
      },
      {
        "label": "Muffin Blueberry",
        "src": "assets/icons/Blueberry Muffin.png"
      }
    ]
  },
  {
    "name": "🍖 Pemanggang, Taco & Masakan Gurih (BBQ Grill, Taco, Wok)",
    "isImg": true,
    "icons": [
      {
        "label": "Pancake",
        "src": "assets/icons/Pancake.png"
      },
      {
        "label": "Telur & Daging (Bacon and Eggs)",
        "src": "assets/icons/Bacon and Eggs.png"
      },
      {
        "label": "Hamburger",
        "src": "assets/icons/Hamburger.png"
      },
      {
        "label": "Burger Ikan (Fish Burger)",
        "src": "assets/icons/Fish Burger.png"
      },
      {
        "label": "Tomat Panggang (Roasted Tomatoes)",
        "src": "assets/icons/Roasted Tomatoes.png"
      },
      {
        "label": "Kentang Panggang (Baked Potato)",
        "src": "assets/icons/Baked Potato.png"
      },
      {
        "label": "Fish and Chips",
        "src": "assets/icons/Fish and Chips.png"
      },
      {
        "label": "Sate Lopster (Lobster Skewer)",
        "src": "assets/icons/Lobster Skewer.png"
      },
      {
        "label": "Sate Domba (Grilled Lamb Skewer)",
        "src": "assets/icons/Grilled Lamb Skewer.png"
      },
      {
        "label": "Nasi Goreng (Fried Rice)",
        "src": "assets/icons/Fried Rice.png"
      },
      {
        "label": "Pizza Klasik",
        "src": "assets/icons/Pizza.png"
      },
      {
        "label": "Pizza Pedas (Spicy Pizza)",
        "src": "assets/icons/Spicy Pizza.png"
      },
      {
        "label": "Pizza Frutti di Mare",
        "src": "assets/icons/Frutti di Mare Pizza.png"
      },
      {
        "label": "Taco",
        "src": "assets/icons/Taco.png"
      },
      {
        "label": "Taco Ikan (Fish Taco)",
        "src": "assets/icons/Fish Taco.png"
      },
      {
        "label": "Quesadilla",
        "src": "assets/icons/Quesadilla.png"
      },
      {
        "label": "Nachos",
        "src": "assets/icons/Nachos.png"
      },
      {
        "label": "Hot Dog Klasik",
        "src": "assets/icons/Hot Dog.png"
      },
      {
        "label": "Sushi Roll",
        "src": "assets/icons/Sushi Roll.png"
      },
      {
        "label": "Lobster Sushi",
        "src": "assets/icons/Lobster Sushi.png"
      },
      {
        "label": "Egg Sushi",
        "src": "assets/icons/Egg Sushi.png"
      }
    ]
  },
  {
    "name": "🍲 Aneka Sup & Salad Segar (Soup Kitchen & Salad Bar)",
    "isImg": true,
    "icons": [
      {
        "label": "Sup Lobster (Lobster Soup)",
        "src": "assets/icons/Lobster Soup.png"
      },
      {
        "label": "Sup Tomat (Tomato Soup)",
        "src": "assets/icons/Tomato Soup.png"
      },
      {
        "label": "Sup Labu (Pumpkin Soup)",
        "src": "assets/icons/Pumpkin Soup.png"
      },
      {
        "label": "Sup Ikan (Fish Soup)",
        "src": "assets/icons/Fish Soup.png"
      },
      {
        "label": "Sup Kubis (Cabbage Soup)",
        "src": "assets/icons/Cabbage Soup.png"
      },
      {
        "label": "Sup Asparagus",
        "src": "assets/icons/Asparagus Soup.png"
      },
      {
        "label": "Sup Bawang (Onion Soup)",
        "src": "assets/icons/Onion Soup.png"
      },
      {
        "label": "Salad Feta",
        "src": "assets/icons/Feta Salad.png"
      },
      {
        "label": "Salad BLT",
        "src": "assets/icons/BLT Salad.png"
      },
      {
        "label": "Salad Makanan Laut (Seafood Salad)",
        "src": "assets/icons/Seafood Salad.png"
      },
      {
        "label": "Salad Pasta",
        "src": "assets/icons/Pasta Salad.png"
      },
      {
        "label": "Salad Buah (Fruit Salad)",
        "src": "assets/icons/Fruit Salad.png"
      },
      {
        "label": "Kebab Domba (Lamb Doner Wrap)",
        "src": "assets/icons/Lamb Doner Wrap.png"
      }
    ]
  },
  {
    "name": "🥫 Bumbu, Minyak & Aneka Saus (Sauce Maker)",
    "isImg": true,
    "icons": [
      {
        "label": "Kecap Asin (Soy Sauce)",
        "src": "assets/icons/Soy Sauce.png"
      },
      {
        "label": "Minyak Zaitun (Olive Oil)",
        "src": "assets/icons/Olive Oil.png"
      },
      {
        "label": "Saus Tomat (Tomato Sauce)",
        "src": "assets/icons/Tomato Sauce.png"
      },
      {
        "label": "Mayones (Mayonnaise)",
        "src": "assets/icons/Mayonnaise.png"
      },
      {
        "label": "Didih Lemon (Lemon Curd)",
        "src": "assets/icons/Lemon Curd.png"
      },
      {
        "label": "Salsa",
        "src": "assets/icons/Salsa.png"
      },
      {
        "label": "Saus Celup Zaitun (Olive Dip)",
        "src": "assets/icons/Olive Dip.png"
      },
      {
        "label": "Tart Dressing",
        "src": "assets/icons/Tart Dressing.png"
      },
      {
        "label": "Hummus",
        "src": "assets/icons/Hummus.png"
      },
      {
        "label": "Saus Celup Kacang (Bean Dip)",
        "src": "assets/icons/Bean Dip.png"
      }
    ]
  },
  {
    "name": "🍨 Gula, Permen, Popcorn & Es Krim (Candy, Ice Cream & Sweets)",
    "isImg": true,
    "icons": [
      {
        "label": "Gula Putih (White Sugar)",
        "src": "assets/icons/White Sugar.png"
      },
      {
        "label": "Gula Merah (Brown Sugar)",
        "src": "assets/icons/Brown Sugar.png"
      },
      {
        "label": "Sirup (Syrup)",
        "src": "assets/icons/Syrup.png"
      },
      {
        "label": "Popcorn Polos",
        "src": "assets/icons/Popcorn.png"
      },
      {
        "label": "Popcorn Mentega",
        "src": "assets/icons/Buttered Popcorn.png"
      },
      {
        "label": "Popcorn Cabai",
        "src": "assets/icons/Chili Popcorn.png"
      },
      {
        "label": "Popcorn Madu",
        "src": "assets/icons/Honey Popcorn.png"
      },
      {
        "label": "Popcorn Cokelat",
        "src": "assets/icons/Chocolate Popcorn.png"
      },
      {
        "label": "Es Krim Vanila",
        "src": "assets/icons/Vanilla Ice Cream.png"
      },
      {
        "label": "Es Lilin Ceri",
        "src": "assets/icons/Cherry Popsicle.png"
      },
      {
        "label": "Es Krim Stroberi",
        "src": "assets/icons/Strawberry Ice Cream.png"
      },
      {
        "label": "Es Krim Cokelat",
        "src": "assets/icons/Chocolate Ice Cream.png"
      },
      {
        "label": "Es Krim Wijen",
        "src": "assets/icons/Sesame Ice Cream.png"
      },
      {
        "label": "Es Krim Persik",
        "src": "assets/icons/Peach Ice Cream.png"
      },
      {
        "label": "Apel Karamel (Caramel Apple)",
        "src": "assets/icons/Caramel Apple.png"
      },
      {
        "label": "Toffee",
        "src": "assets/icons/Toffee.png"
      },
      {
        "label": "Cokelat Batang (Chocolate)",
        "src": "assets/icons/Chocolate.png"
      },
      {
        "label": "Permen Lolipop (Lollipop)",
        "src": "assets/icons/Lollipop.png"
      },
      {
        "label": "Jelly Beans",
        "src": "assets/icons/Jelly Beans.png"
      },
      {
        "label": "Kacang Madu (Honey Peanuts)",
        "src": "assets/icons/Honey Peanuts.png"
      },
      {
        "label": "Selai Apel (Apple Jam)",
        "src": "assets/icons/Apple Jam.png"
      },
      {
        "label": "Selai Raspberry",
        "src": "assets/icons/Raspberry Jam.png"
      },
      {
        "label": "Selai Blackberry",
        "src": "assets/icons/Blackberry Jam.png"
      },
      {
        "label": "Selai Ceri (Cherry Jam)",
        "src": "assets/icons/Cherry Jam.png"
      },
      {
        "label": "Selai Stroberi (Strawberry Jam)",
        "src": "assets/icons/Strawberry Jam.png"
      }
    ]
  },
  {
    "name": "☕ Minuman Segar, Jus, Kopi & Teh (Drinks, Juices, Coffee & Tea)",
    "isImg": true,
    "icons": [
      {
        "label": "Jus Wortel (Carrot Juice)",
        "src": "assets/icons/Carrot Juice.png"
      },
      {
        "label": "Jus Apel (Apple Juice)",
        "src": "assets/icons/Apple Juice.png"
      },
      {
        "label": "Jus Ceri (Cherry Juice)",
        "src": "assets/icons/Cherry Juice.png"
      },
      {
        "label": "Jus Tomat (Tomato Juice)",
        "src": "assets/icons/Tomato Juice.png"
      },
      {
        "label": "Jus Beri (Berry Juice)",
        "src": "assets/icons/Berry Juice.png"
      },
      {
        "label": "Jus Nanas (Pineapple Juice)",
        "src": "assets/icons/Pineapple Juice.png"
      },
      {
        "label": "Jus Jeruk (Orange Juice)",
        "src": "assets/icons/Orange Juice.png"
      },
      {
        "label": "Jus Semangka",
        "src": "assets/icons/Watermelon Juice.png"
      },
      {
        "label": "Espresso",
        "src": "assets/icons/Espresso.png"
      },
      {
        "label": "Caffe Latte",
        "src": "assets/icons/Caffe Latte.png"
      },
      {
        "label": "Caffe Mocha",
        "src": "assets/icons/Caffe Mocha.png"
      },
      {
        "label": "Raspberry Mocha",
        "src": "assets/icons/Raspberry Mocha.png"
      },
      {
        "label": "Cokelat Panas (Hot Chocolate)",
        "src": "assets/icons/Hot Chocolate.png"
      },
      {
        "label": "Teh Hijau (Green Tea)",
        "src": "assets/icons/Green Tea.png"
      },
      {
        "label": "Teh Susu (Milk Tea)",
        "src": "assets/icons/Milk Tea.png"
      },
      {
        "label": "Teh Madu (Honey Tea)",
        "src": "assets/icons/Honey Tea.png"
      },
      {
        "label": "Teh Lemon (Lemon Tea)",
        "src": "assets/icons/Lemon Tea.png"
      },
      {
        "label": "Smoothie Beri (Berry Smoothie)",
        "src": "assets/icons/Berry Smoothie.png"
      },
      {
        "label": "Smoothie Hijau (Green Smoothie)",
        "src": "assets/icons/Green Smoothie.png"
      },
      {
        "label": "Smoothie Yogurt",
        "src": "assets/icons/Yogurt Smoothie.png"
      },
      {
        "label": "Milkshake Vanila",
        "src": "assets/icons/Vanilla Milkshake.png"
      },
      {
        "label": "Milkshake Cokelat",
        "src": "assets/icons/Mocha Milkshake.png"
      },
      {
        "label": "Milkshake Buah (Fruity Milkshake)",
        "src": "assets/icons/Fruity Milkshake.png"
      }
    ]
  },
  {
    "name": "👗 Pakaian, Bunga, Lilin & Perawatan (Loom, Sewing, Flowers & Spa)",
    "isImg": true,
    "icons": [
      {
        "label": "Sweter Wol (Sweater)",
        "src": "assets/icons/Sweater.png"
      },
      {
        "label": "Kain Katun (Cotton Fabric)",
        "src": "assets/icons/Cotton Fabric.png"
      },
      {
        "label": "Topi Wol Biru",
        "src": "assets/icons/Blue Woolly Hat.png"
      },
      {
        "label": "Kemeja Katun (Cotton Shirt)",
        "src": "assets/icons/Cotton Shirt.png"
      },
      {
        "label": "Sweter Biru (Blue Sweater)",
        "src": "assets/icons/Blue Sweater.png"
      },
      {
        "label": "Celana Kulit Wol (Wooly Chaps)",
        "src": "assets/icons/Wooly Chaps.png"
      },
      {
        "label": "Gaun Ungu (Violet Dress)",
        "src": "assets/icons/Violet Dress.png"
      },
      {
        "label": "Bantal Tidur (Pillow)",
        "src": "assets/icons/Pillow.png"
      },
      {
        "label": "Selimut Hangat (Blanket)",
        "src": "assets/icons/Blanket.png"
      },
      {
        "label": "Buket Bunga Cantik (Rustic Bouquet)",
        "src": "assets/icons/Rustic Bouquet.png"
      },
      {
        "label": "Buket Bunga Cerah (Bright Bouquet)",
        "src": "assets/icons/Bright Bouquet.png"
      },
      {
        "label": "Lilin Stroberi (Strawberry Candle)",
        "src": "assets/icons/Strawberry Candle.png"
      },
      {
        "label": "Lilin Raspberry",
        "src": "assets/icons/Raspberry Candle.png"
      },
      {
        "label": "Minyak Esensial Lemon",
        "src": "assets/icons/Lemon Essential Oil.png"
      }
    ]
  },
  {
    "name": "💰 Koin, Logam, Tambang, Perhiasan & Tiket (Coins, Jeweler & Vouchers)",
    "isImg": true,
    "icons": [
      {
        "label": "Koin Emas",
        "src": "assets/icons/Coins.png"
      },
      {
        "label": "Berlian (Diamond)",
        "src": "assets/icons/Diamond.png"
      },
      {
        "label": "Bijih Perak (Silver Ore)",
        "src": "assets/icons/Silver Ore.png"
      },
      {
        "label": "Bijih Emas (Gold Ore)",
        "src": "assets/icons/Gold Ore.png"
      },
      {
        "label": "Bijih Platinum (Platinum Ore)",
        "src": "assets/icons/Platinum Ore.png"
      },
      {
        "label": "Bijih Besi (Iron Ore)",
        "src": "assets/icons/Iron Ore.png"
      },
      {
        "label": "Batubara (Coal)",
        "src": "assets/icons/Coal.png"
      },
      {
        "label": "Batang Perak (Silver Bar)",
        "src": "assets/icons/Silver Bar.png"
      },
      {
        "label": "Batang Emas (Gold Bar)",
        "src": "assets/icons/Gold Bar.png"
      },
      {
        "label": "Batang Platinum (Platinum Bar)",
        "src": "assets/icons/Platinum Bar.png"
      },
      {
        "label": "Batang Besi (Iron Bar)",
        "src": "assets/icons/Iron Bar.png"
      },
      {
        "label": "Batubara Halus (Refined Coal)",
        "src": "assets/icons/Refined Coal.png"
      },
      {
        "label": "Gelang Emas (Bracelet)",
        "src": "assets/icons/Bracelet.png"
      },
      {
        "label": "Kalung Mewah (Necklace)",
        "src": "assets/icons/Necklace.png"
      },
      {
        "label": "Cincin Berlian (Diamond Ring)",
        "src": "assets/icons/Diamond Ring.png"
      },
      {
        "label": "Gelang Besi (Iron Bracelet)",
        "src": "assets/icons/Iron Bracelet.png"
      },
      {
        "label": "Tiket Hijau (Green Voucher)",
        "src": "assets/icons/Green Voucher.png"
      },
      {
        "label": "Tiket Biru (Blue Voucher)",
        "src": "assets/icons/Blue Voucher.png"
      },
      {
        "label": "Tiket Ungu (Purple Voucher)",
        "src": "assets/icons/Purple Voucher.png"
      },
      {
        "label": "Tiket Emas (Golden Voucher)",
        "src": "assets/icons/Golden Voucher.png"
      },
      {
        "label": "Tiket Anak Ayam (Chick Voucher)",
        "src": "assets/icons/Chick Voucher.png"
      }
    ]
  }
];
