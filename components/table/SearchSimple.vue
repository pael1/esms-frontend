<template>
  <div class="bg-white flex items-center w-full border border-green-600 px-3 rounded-md">
    <span class="flex items-center gap-x-1 text-green-800">
      <FunnelIcon class="w-4 text-green-800" />
    </span>

    <input
      type="text"
      v-model="search"
      @keyup.enter="onSearch"
      :placeholder="placeholder"
      class="ml-4 flex-grow text-black text-sm border-0 outline-none focus:ring-transparent focus:border-green-500 py-1.5 h-[40px]"
    />

    <!-- Show clear button only if there's text -->
    <button
      v-if="search"
      @click="clearSearch"
      class="text-sm text-red-600 hover:text-red-800 ml-2"
      title="Clear search"
    >
      ✕
    </button>
  </div>
</template>
<script setup>
import { FunnelIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    placeholder: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['handleFilter'])

const search = ref('')

function onSearch() {
  emit('handleFilter', { name: search.value })
}

function clearSearch() {
  search.value = ''
  emit('handleFilter', {}) // Send empty filter
}
</script>
