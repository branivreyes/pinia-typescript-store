<script setup lang="ts">
import TheCounter from './TheCounter.vue'
import { ref } from 'vue'

defineProps<{
  image: string
  title: string
  price: number
}>()

const quantity = ref(0)

const emit = defineEmits<{
  (e: 'add', quantity: number): void
}>()

function add() {
  emit('add', quantity.value)
  quantity.value = 0
}
</script>

<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-row
      justify="center"
      class="pa-6"
    >
      <v-avatar
        class="ma-3"
        size="125"
        rounded="0"
      >
        <v-img
          :src="image"
          aspect-ratio="25/14"
          height="200"
        />
      </v-avatar>
    </v-row>

    <v-card-title>{{ title }}</v-card-title>

    <v-card-subtitle>${{ price }}</v-card-subtitle>

    <v-card-actions>
      <v-row>
        <v-col>
          <the-counter v-model="quantity" />

          <v-btn
            class="mt-3"
            width="100%"
            color="primary"
            @click="add"
            :disabled="quantity === 0"
          >
            Add
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
