<template>
  <div class="bg-white flex items-center w-full flex-wrap border border-green-300 relative px-3 py-1 rounded-md">
    <span class="flex items-center gap-x-1 absolute text-green-800 dark:text-green-800">
      <FunnelIcon class="w-4 text-green-800" />
      <span class="text-green-800">Filter</span>
    </span>

    <div class="flex flex-wrap flex-grow-0 ml-16">
      <div
        v-for="(filter, index) in state.filters"
        :key="index"
        class="bg-green-500 flex items-center justify-center text-white rounded-full text-sm pl-3 pr-2 mx-1"
      >
        {{ columnViewingFilter(filter.column) }}: {{ filter.value }}
        <XCircleIcon class="h-4 m-1 cursor-pointer" @click="deleteFilter(index)" />
      </div>
    </div>

    <input
      list="list"
      type="text"
      v-model="state.searchInput"
      @keyup.enter="addFilter"
      @keyup.tab="addFilter"
      autocomplete="off"
      class="flex-grow text-black text-sm border-0 outline-none focus:outline-none focus:ring-transparent focus:border-green-500 py-1.5"
    />

    <datalist id="list">
      <template v-for="column in props.columnFilter" :key="column.index">
        <template v-if="column.filters">
          <option
            v-for="filter in column.filters"
            :key="filter.index"
            :value="filterValue(column.column) + filter.value"
          />
        </template>
        <template v-else>
          <option :value="filterValue(column.column)" />
        </template>
      </template>
    </datalist>
  </div>
</template>

<script setup>
import { FunnelIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  columnFilter: {
    type: Object,
    required: true,
  },
  dataFilter: {
    type: Object,
    required: false,
  },
})

const emit = defineEmits(['handleFilter'])

const state = reactive({
  filters: [],
  searchInput: '',
  tableFilter: {},
})

watch(() => props.dataFilter, (newVal) => {
  if (newVal) {
    state.filters = Object.entries(newVal).map(([column, value]) => ({
      column,
      value,
    }))
    state.tableFilter = { ...newVal }
  }
})

function addFilter(event) {
  const input = event.target.value.split(': ')
  if (input.length > 1 && input[1].trim() !== '') {
    let column = input[0].replace('(MM/DD/YYYY)', '').trim()
    let value = input[1].trim()

    // Remove existing filter for the same column
    state.filters = state.filters.filter((f) => f.column !== column)

    // Add new filter
    state.filters.push({ column, value })
    state.tableFilter[convertToTableNaming(column)] = value
    state.searchInput = ''
    emit('handleFilter', state.tableFilter)
  }
}

function deleteFilter(index) {
  const item = state.filters[index]
  state.filters.splice(index, 1)
  delete state.tableFilter[convertToTableNaming(item.column)]
  emit('handleFilter', state.tableFilter)
}

function filterValue(column) {
  let label = column.replaceAll('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  if (label.includes('Date')) label += '(MM/DD/YYYY)'
  return `${label}: `
}

function convertToTableNaming(column) {
  return column.replaceAll(' ', '_').toLowerCase()
}

function columnViewingFilter(column) {
  return column.replaceAll('_', ' ').replace('(MM/DD/YYYY)', '').replace(/\b\w/, (l) => l.toUpperCase())
}
</script>

<style scoped>
input::-webkit-calendar-picker-indicator {
  display: none;
}
</style>
