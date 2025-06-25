<template>
    <div class="mt-2 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-violet-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th v-for="column in columns" :key="column.name" scope="col"
                                    class="py-3.5 px-3 text-left text-base font-semibold text-violet-900">
                                    {{ column.name }}
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span class="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-violet-200 bg-white">
                            <tr v-for="data in datas" :key="data.uuid">
                                <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                    {{ data.firstname }} {{ data.middlename }} {{ data.lastname }}
                                </td>
                                <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                    {{ data.barangay.brgy_name }}
                                </td>
                                <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                    {{ data.contact_no }}
                                </td>
                                <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                    {{ data.age }}
                                </td>
                                <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                    {{ data.sex }}
                                </td>
                                <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                    {{ data.civil_status }}
                                </td>
                                <td
                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-base font-medium sm:pr-6">
                                    <button @click="viewClient(data.uuid)"
                                        class="rounded-full bg-white w-16 px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        View
                                    </button>
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
import { clientService } from '../api/ClientService';

const state = reactive({
    isPageLoading: false
})

const props = defineProps({
    columns: {
        type: Object,
        required: true,
    },
    datas: {
        type: Object,
        required: true,
    },
    sortData: {
        type: Object,
        required: false,
    },
})

const emit = defineEmits(['update:isPageLoading']);

async function viewClient(value) {
    try {
        state.isPageLoading = true;
        emit('update:isPageLoading', state.isPageLoading);

        const response = await clientService.getClient(value);
        if (response.data) {
            await useRouter().push(`/clients/profile/${value}`);
        }
    } catch (error) {
        console.log(error);
    } finally {
        state.isPageLoading = false;
        emit('update:isPageLoading', state.isPageLoading);
    }
}
</script>