<template>
    <div class="mt-2 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Stall Description
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Stall No
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Owner Name
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Rental Per Day
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <!-- If there is data -->
                            <template v-if="props.rentals?.length">
                                <tr v-for="rental in props.rentals" :key="rental.stallDetailId">
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ $capitalizeWords(rental.stallProfile.stallDescription) }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ rental.stallProfile.stallNo }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ $capitalizeWords(rental.stallOwner.full_name) }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ $formatPeso(rental.stallProfile.TotalRatePerDay) }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                                        <span
                                            :class="rental.rentalStatus && rental.rentalStatus.toLowerCase() === 'active'
                                            ? 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
                                            : ''"
                                        >
                                            {{ $capitalizeWords(rental.rentalStatus) }}
                                        </span>
                                    </td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                                        <div class="flex justify-end gap-2">
                                            <FormButton
                                            type="button"
                                            class="py-0.5 px-2 text-xs"
                                            @click="view(rental.stallDetailId, true)"
                                            >
                                            View
                                            </FormButton>
                                            <FormButton
                                            type="button"
                                            class="py-0.5 px-2 text-xs  bg-yellow-600 hover:bg-yellow-500"
                                            @click="view(rental.stallDetailId, false)"
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
                                    <td colspan="6" class="px-3 py-10">
                                        <div class="flex items-center justify-center text-gray-500 text-sm">
                                            No data
                                        </div>
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
    rentals: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['viewRentalClick'])

async function view(stall, isView) {
    emit('viewRentalClick', stall, isView)
}

const { $formatPeso } = useNuxtApp()
</script>