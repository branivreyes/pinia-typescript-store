<script setup lang="ts">
import { ref } from 'vue'
import CartProduct from '@/classes/CartProduct'
import { useShoppingCart } from '@/stores/ShoppingCart'

const emit = defineEmits<{
  (e: 'showCart'): void
}>()

const shoppingCart = useShoppingCart()

const undoHistory = ref<string[]>(['[]'])

const redoHistory = ref<string[]>([])

shoppingCart.$onAction(({ name, after, store }) => {
  if (name === 'fetchProducts') return

  if (name === 'clearStore') {
    undoHistory.value = ['[]']
    redoHistory.value = []
    return
  }

  after(() => {
    undoHistory.value.push(JSON.stringify([...store.$state.cart]))
  })
})

function undo() {
  redoHistory.value.push(undoHistory.value.pop()!)

  setCartFromHistory(undoHistory.value.at(-1)!)
}

function redo() {
  const str = redoHistory.value.pop()!

  undoHistory.value.push(str)

  setCartFromHistory(str)
}

function setCartFromHistory(history: string) {
  const mapped: [number, CartProduct][] = JSON.parse(history)

  mapped.forEach((map) => {
    const cartProduct = map[1]
    map[1] = new CartProduct(cartProduct.product, cartProduct.quantity)
  })

  shoppingCart.$state.cart = new Map<number, CartProduct>(mapped)
}
</script>

<template>
  <v-toolbar>
    <v-toolbar-title>Store</v-toolbar-title>

    <v-spacer />

    <v-btn
      class="mr-6"
      icon
      @click="undo"
      :disabled="undoHistory.length === 1"
    >
      <v-icon icon="mdi-undo" />
    </v-btn>

    <v-btn
      class="mr-6"
      icon
      @click="redo"
      :disabled="redoHistory.length === 0"
    >
      <v-icon icon="mdi-redo" />
    </v-btn>

    <v-btn
      class="mr-6"
      icon
      @click="emit('showCart')"
    >
      <v-badge
        :model-value="!shoppingCart.isEmpty"
        :content="shoppingCart.getProductsCount"
        color="error"
        floating
      >
        <v-icon icon="mdi-cart" />
      </v-badge>
    </v-btn>
  </v-toolbar>
</template>
