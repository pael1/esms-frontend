<template>
    <div class="mt-2 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    ORNumber
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Month/s
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <!-- If there is data -->
                            <template v-if="props.data?.data?.length">
                                <tr v-for="sync in props.data.data" :key="sync.id">
                                    <td class="whitespace-nowrap px-3 text-center py-4 text-sm text-gray-500">
                                        {{ sync.ornumber }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 text-center py-4 text-sm text-gray-500">
                                        {{ sync.month_names.join(', ') }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 text-center py-4 text-sm">
                                        <span
                                            :class="statusClass(sync.is_processed)"
                                        >
                                            {{ statusLabel(sync.is_processed) }}

                                        </span>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <div class="flex justify-center gap-2">
                                            <FormButton
                                            v-if="String(sync.is_processed) === '0' || String(sync.is_processed) === '2'"
                                            type="button"
                                            class="py-0.5 px-2 text-xs"
                                            buttonStyle="red"
                                            size="sm"
                                            @click="remove(sync)"
                                            >
                                            Remove
                                            </FormButton>
                                            <FormButton
                                            v-if="String(sync.is_processed) === '2'"
                                            type="button"
                                            class="py-0.5 px-2 text-xs"
                                            buttonStyle="yellow"
                                            size="sm"
                                            @click="paidManually(sync)"
                                            >
                                                Paid Manually
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

<script setup lang="ts">

const STATUS_CLASS_MAP = {
  0: 'inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20',
  1: 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20',
  2: 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20',
  3: 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20',
}

const statusClass = (value) => {
  return STATUS_CLASS_MAP[value] ?? 
    'inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20'
}

const statusLabel = (value) => {
  switch (String(value)) {
    case '0':
      return 'Processing'
    case '1':
      return 'Processed'
    case '2':
      return 'Not Found'
    case '3':
      return 'Processed Manually'
    default:
      return 'Unknown'
  }
}

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['removeClick', 'paidManuallyModalClick'])

async function remove(sync) {
    emit('removeClick', sync)
}

async function paidManually(sync) {
  emit('paidManuallyModalClick', sync)
}
</script>