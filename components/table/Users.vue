<template>
    <div class="mt-2 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Name
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Office
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Position
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Supervisor
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Administrator
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span class="sr-only">Action</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="user in props.users" :key="user.uuid">
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ $capitalizeWords(user.details.name) }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ $capitalizeWords(user.details.office_name) }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ $capitalizeWords(user.details.position) }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span
                                        :class="user.is_supervisor
                                        ? 'inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium'
                                        : 'inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium'"
                                    >
                                        {{ user.is_supervisor ? 'Yes' : 'No' }}
                                    </span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span
                                        :class="user.is_admin
                                        ? 'inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium'
                                        : 'inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium'"
                                    >
                                        {{ user.is_admin ? 'Yes' : 'No' }}
                                    </span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span
                                        :class="user.status
                                        ? 'inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium'
                                        : 'inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium'"
                                    >
                                        {{ user.status ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td
                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <div class="flex justify-end gap-2">
                                        <FormButton
                                        type="button"
                                        class="py-0.5 px-2 text-xs"
                                        buttonStyle="green"
                                        size="sm"
                                        @click="viewUser(user.id, true)"
                                        >
                                        View
                                        </FormButton>
                                        <FormButton
                                        type="button"
                                        class="py-0.5 px-2 text-xs"
                                        buttonStyle="yellow"
                                        size="sm"
                                        @click="viewUser(user.id, false)"
                                        >
                                        Edit
                                        </FormButton>
                                    </div>
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

const props = defineProps({
    users: {
        type: Object,
        required: true
    }
})

const { $capitalizeWords } = useNuxtApp()

const emit = defineEmits(['viewUserClick'])

async function viewUser(user, isView) {
    emit('viewUserClick', user, isView)
}
</script>