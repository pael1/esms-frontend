<template>
    <input :type="props.type ?? 'text'" :name="props.name"
        class="block w-full rounded-md border-0 pl-3 px-1 py-[9px] text-green-900 ring-1 ring-inset ring-green-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
        :value="props.modelValue" @input="updateValue($event)" />
</template>

<script setup lang="ts">
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    modelValue: String,
    type: {
        type: String,
        required: false
    }
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
    emit('update:modelValue', event.target.value)
}
</script>