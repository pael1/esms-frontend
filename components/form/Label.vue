<template>
    <label :for="props.for" v-if="props.label" class="block text-base font-medium leading-6 text-green-900">
        {{ props.label }}
    </label>
</template>

<script setup lang="ts">
const props = defineProps({
    for: {
        type: String,
        required: false,
    },
    label: {
        type: String,
        required: false,
    },
})
</script>