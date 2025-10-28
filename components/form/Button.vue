<template>
  <button
    :type="props.type"
    class="inline-flex items-center justify-center font-medium rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
    :class="[
      sizeClasses[props.size],
      styleClasses[props.buttonStyle] || styleClasses['green']
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  buttonStyle: {
    type: String,
    default: 'green',
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
})

// Balanced padding per size
const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
}

// Modern flat color palette (no gradient)
const styleClasses: Record<string, string> = {
  green:
    "bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-600",
  red:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600",
  blue:
    "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600",
  yellow:
    "bg-yellow-600 text-white hover:bg-yellow-400 focus-visible:outline-yellow-600",
  white:
    "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 focus-visible:outline-gray-300",
  gray:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:outline-gray-400",
}
</script>

<style scoped>
button {
  transition-property: background-color, color, box-shadow, transform;
}
</style>
