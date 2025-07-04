<style scoped>
select.decorated option:hover {
    box-shadow: 0 0 10px 100px #6abe31 inset;
}
</style>
<template>
    <div class="min-h-screen bg-gray-100 sm:p-3">
        <div class="bg-white">
            <Loader v-if="state.isPageLoading" />
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">AWARDEE</h1>
                </div>
            </div>
            <div class="flex items-center justify-between">
            <!-- Left side: select -->
              <div class="flex items-center gap-x-2">
                <select
                  v-model="state.user_data.sectionCode"
                  @change="fetchAwardees"
                  id="sectionCode"
                  class="border rounded px-2 py-1 decorated"
                >
                  <option
                    class="block px-3 py-1 text-base leading-6 text-green-900"
                    v-for="type in state.sectionCodes"
                    :key="type.fieldValue"
                    :value="type.fieldValue"
                  >
                    {{ $capitalizeWords(type.fieldDescription) }}
                  </option>
                </select>
              </div>
              <!-- Right side: TableSearch -->
              <div>
                <TableSearch
                  :columnFilter="state.columnFilter"
                  :dataFilter="state.dataFilter"
                  @handleFilter="handleFilter"
                />
              </div>
            </div>
            <TableAwardees :awardees="state.awardees.data" @update:isPageLoading="handlePageLoading" />
            <Pagination v-if="state.awardees?.data?.length > 0" :data="state.awardees" @previous="previous" @next="next" />
        </div>
    </div>
  </template>
  
  <script setup>
  import { awardeeService } from '@/components/api/AwardeeService'
  import { useUserStore } from '@/store/user'
  import { useParameterStore } from '@/store/parameter'

  const { $capitalizeWords } = useNuxtApp()

  let currentPage = 1

  const userStore = useUserStore()
  const useParameter = useParameterStore()
  const user = userStore.getUser
  const sectionCodes = useParameter.getSectionCode

  definePageMeta({
      layout: 'main'
  })

  const state = reactive({
    isPageLoading: false,
    user_data: {
        marketcode: user.MarketCode,
        stall_type: 'regular',
        sectionCode: '01',
    },
    awardees: [],
    dataFilter: [],
    columnFilter: [
        { column: 'First Name' },
        { column: 'Last Name' },
    ],
    sectionCodes: sectionCodes.data
  })

  onMounted(() => {
      fetchAwardees()
  })

  async function fetchAwardees() {
      state.isPageLoading = true
      try {
          let params = {
              page: currentPage,
              marketcode: state.user_data.marketcode,
              type: state.user_data.stall_type,
              section: state.user_data.sectionCode,
              ...state.dataFilter
          }
          console.log(params);
          const response = await awardeeService.getAwardees(params)
          if (response) {
              state.awardees = response
          }
      } catch (error) {
          console.log(error)
      }
      state.isPageLoading = false
  }

  function handleFilter(value) {
      currentPage = 1
      state.dataFilter = value
      console.log(state.dataFilter);
      fetchAwardees()
  }

  async function previous() {
    currentPage--
    fetchAwardees()
}

async function next() {
    currentPage++
    fetchAwardees()
}

function handlePageLoading(isLoading) {
    state.isPageLoading = isLoading;
}
   
</script>