import { Product } from './Product';

// Model OOP Domain: Category
export class Category {
  constructor(data = {}) {
    this.title = data.t || data.title || 'Kategori Baru';
    this.isPackage = data.pk ? true : Boolean(data.isPackage);
    this.items = (data.items || []).map(it => it instanceof Product ? it : new Product(it));
  }

  addProduct(productData) {
    const product = productData instanceof Product ? productData : new Product(productData);
    this.items.push(product);
    return product;
  }

  removeProduct(index) {
    if (index >= 0 && index < this.items.length) {
      return this.items.splice(index, 1)[0];
    }
    return null;
  }

  updateProduct(index, updatedProduct) {
    if (index >= 0 && index < this.items.length) {
      this.items[index] = updatedProduct instanceof Product ? updatedProduct : new Product(updatedProduct);
      return this.items[index];
    }
    return null;
  }

  toLegacy() {
    return {
      t: this.title,
      pk: this.isPackage ? 1 : 0,
      items: this.items.map(it => it.toLegacy())
    };
  }
}
