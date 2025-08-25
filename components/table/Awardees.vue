<template>
  <div class="mt-2 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">OwnerID</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stall Description</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stall No.</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <!-- ✅ Check if awardees array has items -->
              <template v-if="props.awardees && props.awardees.length">
                <tr v-for="awardee in props.awardees" :key="awardee.uuid">
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ awardee.ownerId }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ $capitalizeWords(awardee.full_name) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ $capitalizeWords(awardee.stallDescription) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ awardee.stallNoId }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <!-- <button
                      @click="view_profile(awardee.ownerId)"
                      class="rounded-md bg-green-600 w-16 px-2.5 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-500"
                    >
                      View
                    </button> -->
                    <FormButton type="submit" class="py-0.5 text-xs" @click="view_profile(awardee.ownerId)">View</FormButton>
                  </td>
                </tr>
              </template>

              <!-- ✅ No data row -->
              <template v-else>
                <tr>
                  <td colspan="5" class="text-center px-3 py-4 text-sm text-gray-500">
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { awardeeService } from '~/api/AwardeeService'

const { $capitalizeWords } = useNuxtApp()
const router = useRouter()

// const state = reactive({
//   isPageLoading: false,
// })

const props = defineProps({
  awardees: {
    type: Array,
    required: true,
  },
})

// const emit = defineEmits(['update:isPageLoading'])

async function view_profile(ownerId) {
  try {
    // state.isPageLoading = true
    // emit('update:isPageLoading', state.isPageLoading)

    // Optionally: await awardeeService.getAwardeeProfile(ownerId)
    await router.push(`/awardee/profile/${ownerId}`)
  } catch (error) {
    console.error(error)
  } finally {
    // state.isPageLoading = false
    // emit('update:isPageLoading', state.isPageLoading)
  }
}
</script>
