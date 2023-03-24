import type Product from './Product'

export default class CartProduct {
  constructor(public product: Product, public quantity: number) {}

  get total() {
    return this.product.price * this.quantity
  }
}
