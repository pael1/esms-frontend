<template>
    <div class="mt-2 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    ORNumber
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Month/s
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <!-- If there is data -->
                            <template v-if="props.data?.data?.length">
                                <tr v-for="synce in props.data.data" :key="synce.id">
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ synce.ornumber }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ synce.month_names.join(', ') }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                                        <span
                                            :class="synce.is_processed == '0' 
                                                ? 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20' 
                                                : 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'"
                                        >
                                            {{ synce.is_processed == '0' ? 'Processing' : 'Processed' }}
                                        </span>
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

<script setup lang="ts">

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const { $formatPeso } = useNuxtApp()
</script>