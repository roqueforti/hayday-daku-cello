// Model OOP Domain: Product
export class Product {
  constructor(data = {}) {
    this.id = data.id || ('item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4));
    this.name = data.n || data.name || '';
    this.icon = data.e || data.icon || '🌾';
    this.icons = Array.isArray(data.icons) ? [...data.icons] : (this.icon ? [this.icon] : []);
    this.unit = (data.u !== undefined && data.u !== null && data.u !== '') ? Number(data.u) : 100;
    this.unitType = data.ut || data.unitType || 'pcs';
    this.price = Number(data.p !== undefined ? data.p : (data.price || 0));
    this.description = data.d || data.description || '';
    this.color = data.c || data.color || '#46b23c';
    this.minQty = data.min !== undefined ? Number(data.min) : null;
    this.options = data.opsi || data.options || '';
  }

  getUnitValue() {
    return this.unit > 0 ? this.unit : 1;
  }

  getUnitLabel() {
    if (this.unitType === 'paket' && this.unit === 1) return 'paket';
    return this.unit === 1 ? this.unitType : `${this.unit} ${this.unitType}`;
  }

  getMinQuantity() {
    if (this.minQty && this.minQty > 0) return this.minQty;
    if (this.unitType === 'paket') return 1;
    const u = this.getUnitValue();
    return u <= 5 ? 1 : 10;
  }

  getStepQuantity() {
    if (this.unitType === 'paket') return 1;
    const u = this.getUnitValue();
    return u === 1 ? 1 : (u <= 10 ? u : 10);
  }

  calculatePriceForQuantity(qty) {
    if (!qty || qty <= 0) return 0;
    return (this.price / this.getUnitValue()) * qty;
  }

  getQuickOptions() {
    if (this.options && String(this.options).trim()) {
      return String(this.options)
        .split(/[,;\s]+/)
        .map(x => parseInt(x.trim(), 10))
        .filter(x => !isNaN(x) && x > 0);
    }
    return [];
  }

  // Serializer format lama kompatibel dengan data.js
  toLegacy() {
    const obj = {
      id: this.id,
      n: this.name,
      e: this.icon,
      u: this.unit,
      ut: this.unitType,
      p: this.price,
      d: this.description,
      c: this.color
    };
    if (this.icons && this.icons.length > 1) {
      obj.icons = this.icons;
    }
    if (this.minQty !== null && this.minQty !== undefined) {
      obj.min = this.minQty;
    }
    if (this.options) {
      obj.opsi = this.options;
    }
    return obj;
  }
}
