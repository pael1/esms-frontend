<template>
  <div class="mt-2 flex flex-row items-center gap-y-3 mb-2 sm:mb-0" v-if="props.data && props.data.links">
    <div class="text-xs flex items-center text-black">
      Showing from
      {{ props.data.meta && props.data.meta.from ? props.data.meta.from : 0 }}
      to
      {{ props.data.meta && props.data.meta.to ? props.data.meta.to : 0 }}
      of
      {{ props.data.meta && props.data.meta.total ? props.data.meta.total : 0 }}
    </div>
    <div class="grow flex flex-row justify-end gap-x-2">
      <button
        type="button"
        class="w-20 rounded bg-green-200 px-2 py-1 text-xs text-green-800 shadow-sm hover:bg-green-300"
        v-if="props.data.links && props.data.links.prev !== null"
        @click="$emit('previous')"
      >
        Previous
      </button>
      <button
        type="button"
        class="w-20 rounded bg-green-200 px-2 py-1 text-xs text-green-800 shadow-sm hover:bg-green-300"
        v-if="props.data.links && props.data.links.next !== null"
        @click="$emit('next')"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
</script>
