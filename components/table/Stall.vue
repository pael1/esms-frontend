<template>
    <div class="mt-2 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Description
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Stall No
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Stall Area
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Stall Area Ext
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Location
                                </th>
                                <!-- <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Rate per Day
                                </th> -->
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Awardee Name
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <!-- If there is data -->
                            <template v-if="props.stalls?.length">
                                <tr v-for="stall in props.stalls" :key="stall.id">
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ $capitalizeWords(stall.stallDescription) }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ stall.stallNo }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ stall.stallArea ?? 0 }} SQM
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ (stall.stallAreaExt ?? 0).toFixed(2) }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ $capitalizeWords(stall.CFSI?.trim() || 'Common') }}
                                    </td>
                                    <!-- <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ stall.ratePerDay }}
                                    </td> -->
                                    <!-- <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ stall.awardee }}
                                    </td> -->
                                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                                        <span
                                            :class="stall.status === null
                                            ? 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                                            : ''"
                                        >
                                            {{ stall.status === null ? 'Available' : stall.awardee }}
                                        </span>
                                    </td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                                        <div class="flex justify-end gap-2">
                                            <FormButton
                                            type="button"
                                            class="py-0.5 px-2 text-xs"
                                            @click="viewStall(stall.stallProfileId, true)"
                                            >
                                            View
                                            </FormButton>
                                            <FormButton
                                            type="button"
                                            class="py-0.5 px-2 text-xs  bg-yellow-600 hover:bg-yellow-500"
                                            @click="viewStall(stall.stallProfileId, false)"
                                            >
                                            Edit
                                            </FormButton>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <!-- If no data -->
                            <template v-else>
                                <tr>
                                    <td colspan="2" class="text-center px-3 py-4 text-sm text-gray-500">
                                        No data
                                    </td>
                                </tr>
                            </template>
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const { $capitalizeWords } = useNuxtApp()

const props = defineProps({
    stalls: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['viewStallClick'])

async function viewStall(stall, isView) {
    emit('viewStallClick', stall, isView)
}

const { $formatPeso } = useNuxtApp()
</script>