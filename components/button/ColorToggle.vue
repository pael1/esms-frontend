<script setup>
const colorMode = useColorMode()

function toggleMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    @click="toggleMode"
    class="rounded-full p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    :title="colorMode.preference === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <span v-if="colorMode.preference === 'dark'">🌞</span>
    <span v-else>🌙</span>
  </button>
</template>
