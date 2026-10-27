import { Product } from './Product';

// Model OOP Domain: CartItem
export class CartItem {
  constructor(product, quantity = 0) {
    this.product = product instanceof Product ? product : new Product(product);
    this.quantity = Number(quantity);
  }

  getSubtotal() {
    return this.product.calculatePriceForQuantity(this.quantity);
  }
}

// Model OOP Domain: Cart
export class Cart {
  constructor() {
    this.items = new Map(); // key: product.id -> CartItem
  }

  setItem(product, quantity) {
    const q = Number(quantity);
    if (!product || !product.id) return;
    if (q <= 0) {
      this.items.delete(product.id);
    } else {
      this.items.set(product.id, new CartItem(product, q));
    }
  }

  getItem(productId) {
    return this.items.get(productId) || null;
  }

  getQuantity(productId) {
    const item = this.items.get(productId);
    return item ? item.quantity : 0;
  }

  removeItem(productId) {
    this.items.delete(productId);
  }

  clear() {
    this.items.clear();
  }

  getTotalPrice() {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.getSubtotal();
    }
    return total;
  }

  getTotalItemCount() {
    return this.items.size;
  }

  getAllItems() {
    return Array.from(this.items.values());
  }

  generateWhatsAppMessage(note = '') {
    const lines = [];
    let count = 0;
    let total = 0;

    for (const item of this.items.values()) {
      const p = item.product;
      const subtotal = item.getSubtotal();
      total += subtotal;
      count++;
      const subtotalFormatted = 'Rp' + Math.round(subtotal).toLocaleString('id-ID');
      lines.push(`• *${p.name}*: ${item.quantity} ${p.unitType} = *${subtotalFormatted}*`);
    }

    if (lines.length === 0) return '';

    let res = "Halo Daku Cello, saya ingin memesan item Hay Day:\n\n" +
      "📋 *RINCIAN PESANAN:*\n\n" +
      lines.join("\n\n") +
      "\n\n━━━━━━━━━━━━━━━━━\n" +
      "📦 *Total Item:* " + count + " jenis produk\n" +
      "💰 *TOTAL PEMBAYARAN:* *Rp" + Math.round(total).toLocaleString('id-ID') + "*\n" +
      "━━━━━━━━━━━━━━━━━\n";

    if (note && note.trim()) {
      res += "📝 *Catatan:* " + note.trim() + "\n━━━━━━━━━━━━━━━━━\n";
    }

    res += "Mohon diproses ya kak, terima kasih! 🌻\n\nJangan lupa kirim *TAGARMU*";
    return res;
  }
}
