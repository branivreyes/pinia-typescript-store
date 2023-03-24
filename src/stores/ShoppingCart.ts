import { defineStore } from 'pinia'
import type Product from '@/classes/Product'
import axios from 'axios'
import CartProduct from '@/classes/CartProduct'

export const useShoppingCart = defineStore('shoppingCart', {
  state() {
    return {
      products: [] as Product[],
      cart: new Map<number, CartProduct>()
    }
  },
  getters: {
    groupedProducts() {
      const productsMap: Map<string, Product[]> = this.products.reduce((groups, product) => {
        groups.get(product.category)?.push(product) || groups.set(product.category, [product])

        return groups
      }, new Map<string, Product[]>())

      return [...productsMap]
    },
    getProductQuantity() {
      return (product: Product) => this.cart.get(product.id)?.quantity || 0
    },
    getProductsCount(): number {
      const count = [...this.cart].reduce((prev, [, cartProduct]) => {
        return (prev += cartProduct.quantity)
      }, 0)
      return count
    },
    isEmpty(): boolean {
      const isEmpty = this.getProductsCount === 0
      return isEmpty
    },
    hasProducts(): boolean {
      const hasProducts = !![...this.cart.keys()].length
      return hasProducts
    },
    getCartProducts(): CartProduct[] {
      const products = [...this.cart.values()]
      return products
    },
    getTotal(): number {
      const total = this.getCartProducts.reduce((total, cartProduct) => {
        return (total += cartProduct.total)
      }, 0)
      return total
    }
  },
  actions: {
    async fetchProducts() {
      const { data }: { data: Product[] } = await axios.get('https://fakestoreapi.com/products')

      this.products = data
    },
    addProduct(product: Product, quantity: number) {
      this.cart.set(product.id, new CartProduct(product, quantity))
    },
    removeProduct(product: Product) {
      this.cart.delete(product.id)
    },
    clearStore() {
      this.cart = new Map<number, CartProduct>()
    }
  }
})
