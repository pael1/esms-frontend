<template>
    <ul role="list"
        class="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <li v-for="agency in agencies.data" :key="agency.uuid"
            class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
            <div class="flex min-w-0 gap-x-4">
                <div class="min-w-0 flex-auto">
                    <p class="text-base font-semibold leading-6 text-violet-600">
                        <NuxtLink :to="`/resources/agency/${agency.uuid}`">
                            <span class="absolute inset-x-0 -top-px bottom-0" />
                            {{ agency.agency_name }}
                        </NuxtLink>
                    </p>
                </div>
            </div>
            <div class="flex shrink-0 items-center gap-x-4">
                <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </div>
        </li>
    </ul>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
    agencies: {
        type: Object,
        required: true
    }
})
</script>