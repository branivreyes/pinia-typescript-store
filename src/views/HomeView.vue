<script setup lang="ts">
import { onMounted } from 'vue'
import { useShoppingCart } from '@/stores/ShoppingCart'
import { ref } from 'vue'
import TheProduct from '@/components/TheProduct.vue'
import type Product from '@/classes/Product'
import CartProductsTable from '@/components/CartProductsTable.vue'
import TheToolbar from '@/components/TheToolbar.vue'

const shoppingCart = useShoppingCart()

const loading = ref(true)

const showCart = ref(false)

onMounted(async () => {
  await shoppingCart.fetchProducts()

  loading.value = false
})

function addProduct(product: Product, quantity: number) {
  const newQuantity = shoppingCart.getProductQuantity(product) + quantity

  shoppingCart.addProduct(product, newQuantity)
}

function toggleShowCart() {
  showCart.value = !showCart.value
}

function clearStore() {
  toggleShowCart()

  shoppingCart.clearStore()
}
</script>

<template>
  <v-app id="inspire">
    <v-app-bar>
      <the-toolbar @show-cart="toggleShowCart" />
    </v-app-bar>

    <v-dialog
      v-model="showCart"
      persistent
      width="1024"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Shopping Cart</span>
        </v-card-title>

        <v-card-text v-if="!shoppingCart.hasProducts">
          <v-alert
            type="info"
            title="Cart is empty."
            variant="tonal"
          />
        </v-card-text>

        <cart-products-table
          v-else
          :cart-products="shoppingCart.getCartProducts"
          :total="shoppingCart.getTotal"
          @add-product="(product, quantity) => shoppingCart.addProduct(product, quantity)"
          @remove-product="(product) => shoppingCart.removeProduct(product)"
        />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="toggleShowCart"
          >
            Close
          </v-btn>

          <v-btn
            color="blue-darken-1"
            variant="text"
            :disabled="shoppingCart.isEmpty"
            @click="clearStore"
          >
            Purchase
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main class="bg-grey-lighten-2">
      <v-container>
        <v-row
          v-if="loading"
          justify="center"
          class="mt-16"
        >
          <v-progress-circular
            indeterminate
            :size="100"
          />
        </v-row>

        <v-row
          v-for="[category, products] in shoppingCart.groupedProducts"
          :key="category"
        >
          <v-col
            class="mt-2"
            cols="12"
          >
            <strong style="text-transform: capitalize">{{ category }}</strong>
          </v-col>

          <v-col
            v-for="(product, index) in products"
            :key="`${category}-${index}`"
            lg="2"
            md="3"
            sm="4"
          >
            <the-product
              :image="product.image"
              :title="product.title"
              :price="product.price"
              @add="addProduct(product, $event)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
