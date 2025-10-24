<template>
  <input
    :type="props.type ?? 'text'"
    :name="props.name"
    class="block w-full rounded-md pl-3 border-0 px-1 py-[9px] text-green-900 ring-1 ring-inset ring-green-600 placeholder:text-green-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
    :value="props.modelValue"
    @input="onInput"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  name: { type: String, required: true },
  modelValue: String,
  type: { type: String, required: false }
})

const emit = defineEmits(['update:modelValue', 'search-change'])

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('search-change', value) // 🔥 emit custom search-change event
}
</script>
