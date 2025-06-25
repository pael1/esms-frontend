<template>
    <TransitionRoot as="template" :show="props.show">
    <Dialog class="fixed inset-0 z-50"> <!-- Topmost z-index -->
        
        <!-- Backdrop -->
        <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
        >
        <div class="fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <!-- Modal Wrapper -->
        <div class="fixed inset-0 z-50 w-full h-full overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <slot />
        </div>
        </div>
    </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { Dialog, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    }
})
</script>