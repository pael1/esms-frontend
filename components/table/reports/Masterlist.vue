<template>
    <div class="mt-2 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Owner Name
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Owner ID
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Stall No.
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Area/SQ Meter
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Stall Area Ext.
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Location of Influence
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Rental Per Day
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Bus Id
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Line of Business
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="awardee in props.awardees" :key="awardee.id">
                                <td class="px-3 py-4 text-sm text-gray-500 break-words max-w-[200px]">
                                    {{ $capitalizeWords(awardee.full_name) }}
                                </td>
                                <td class="px-3 py-4 text-sm text-gray-500 break-words max-w-[200px]">
                                    {{ awardee.ownerId }}
                                </td>
                                <td class="px-3 py-4 text-sm text-gray-500 break-words max-w-[200px]">
                                    {{ $capitalizeWords(awardee.stallNoId) }}
                                </td>
                                <td class="px-3 py-4 text-sm text-gray-500 break-words max-w-[200px]">
                                    {{ awardee.stallArea }}
                                </td>
                                <td class="px-3 py-4 text-sm text-gray-500 break-words max-w-[200px]">
                                    {{ awardee.StallAreaExt }}
                                </td>
                                <td class="px-3 py-4 text-sm text-gray-500 break-words max-w-[200px]">
                                    {{ (awardee.CFSI) ? $capitalizeWords(awardee.CFSI) : "Common Stall" }}
                                </td>
                                <td class="px-3 py-4 text-sm text-gray-500 break-words max-w-[200px]">
                                    {{ awardee.ratePerDay }}
                                </td>
                                <td class="px-3 py-4 text-sm text-gray-500 break-words max-w-[200px]">
                                    {{ awardee.busID }}
                                </td>
                                <td class="px-3 py-4 text-sm text-gray-500 break-words max-w-[200px]">
                                    {{ $capitalizeWords(awardee.lineOfBusiness) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { awardeeService } from '@/components/api/AwardeeService'

const { $capitalizeWords } = useNuxtApp()

const state = reactive({
    isPageLoading: false
})

const props = defineProps({
    awardees: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:isPageLoading']);

async function view_profile(ownerId) {
    try {
        state.isPageLoading = true;
        emit('update:isPageLoading', state.isPageLoading);

        const response = await awardeeService.getAwardeeProfile(ownerId);
        console.log(response.data)
        if (response.data) {
            await useRouter().push(`/awardee/profile/${ownerId}`);
        }
    } catch (error) {
        console.log(error);
    } finally {
        state.isPageLoading = false;
        emit('update:isPageLoading', state.isPageLoading);
    }
}
</script>