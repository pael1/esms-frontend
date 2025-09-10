<template>
  <button
    :type="props.type"
    class="rounded-md font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
    required: false,
    default: 'green', // default color
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: false,
    default: 'md', // sm, md, lg
  }
})

// Size map
const sizeClasses: Record<string, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-5 py-2.5 text-base",
}

// Style map
const styleClasses: Record<string, string> = {
  green: "bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-600",
  red: "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600",
  blue: "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600",
  white: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus-visible:outline-gray-400",
}
</script>
