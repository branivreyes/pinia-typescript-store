<script setup lang="ts">
const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', quantity: number): void
}>()

function doOperation(callback: (num: number) => number) {
  let valueNumber = Number(props.modelValue)

  emit('update:modelValue', callback(valueNumber))
}
</script>

<template>
  <v-text-field
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', Number($event))"
    hide-details
    single-line
    density="compact"
  >
    <template v-slot:append>
      <v-btn
        size="x-small"
        icon
        @click="doOperation((value) => value + 1)"
      >
        <v-icon color="red"> mdi-plus </v-icon>
      </v-btn>
    </template>

    <template v-slot:prepend>
      <v-btn
        size="x-small"
        icon
        @click="doOperation((value) => value - 1)"
        :disabled="props.modelValue === 0"
      >
        <v-icon color="green"> mdi-minus </v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>
