<script setup lang="ts">
import type CartProduct from '@/classes/CartProduct'
import type Product from '@/classes/Product'
import TheCounter from '@/components/TheCounter.vue'

defineProps<{
  cartProducts: CartProduct[]
  total: number
}>()

const emit = defineEmits<{
  (e: 'addProduct', product: Product, quantity: number): void
  (e: 'removeProduct', product: Product): void
}>()
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Product</th>
        <th class="text-left">Quantity</th>
        <th class="text-left">Total</th>
        <th class="text-left">Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="{ product, quantity, total } in cartProducts"
        :key="product.id"
      >
        <td>
          <v-avatar
            class="ma-3"
            size="100"
            rounded="0"
          >
            <v-img
              :src="product.image"
              aspect-ratio="25/14"
            />
          </v-avatar>

          {{ product.title }}
        </td>

        <td style="width: 200px">
          <the-counter
            :model-value="quantity"
            @update:model-value="emit('addProduct', product, $event)"
          />
        </td>

        <td style="width: 200px">${{ total.toFixed(2) }}</td>

        <td style="width: 120px">
          <v-btn
            icon
            @click="emit('removeProduct', product)"
          >
            <v-icon icon="mdi-trash-can" />
          </v-btn>
        </td>
      </tr>
      <tr>
        <td colspan="2"></td>

        <td colspan="2">
          <strong>${{ total.toFixed(2) }}</strong>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
