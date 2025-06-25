<template>
    <button :type="props.type"
        class="flex items-center justify-center rounded-md px-3 py-1.5 text-base font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        :class="[props.buttonStyle === 'white' ? 'bg-white text-gray-900 border border-gray hover:bg-gray-50' : 'bg-green-600 text-white hover:bg-green-500']">
        <slot />
    </button>
</template>

<script setup lang="ts">
const props = defineProps({
    buttonStyle: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
})
</script>