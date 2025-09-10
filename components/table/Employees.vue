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
                  Birthdate
                </th>
                <th 
                  v-if="props.canRemove"
                  scope="col" 
                  class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="employee in props.employees_data" :key="employee.stallOwnerEmpId">
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ employee.employeeName }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ employee.dateOfBirth }}
                </td>
                <td v-if="props.canRemove" class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    <FormButton type="button" size="sm" buttonStyle="red" @click="$emit('remove', employee.stallOwnerEmpId)">Delete</FormButton>
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
    employees_data: {
        type: Object,
        required: true
    },
    canRemove: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['remove'])
</script>