<template>
    <div class="min-h-screen sm:p-3">
        <div class="bg-white">
            <Loader v-if="state.isPageLoading" />
            <div class="sm:flex sm:items-center p-2">
                <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">AWARDEE</h1>
                </div>
            </div>
            <div class="flex items-center justify-between">
              <!-- Left side: grouped selects -->
              <div class="flex items-center gap-x-2">
                <select
                  v-model="state.user_data.marketcode"
                  @change="fetchAwardees"
                  id="marketCode"
                  class="border border-green-300 rounded px-2 py-1"
                >
                  <option
                    class="block px-3 py-1 text-base leading-6 text-green-900"
                    v-for="type in state.marketCodes"
                    :key="type.fieldValue"
                    :value="type.fieldValue"
                  >
                    {{ $capitalizeWords(type.fieldDescription) }}
                  </option>
                </select>

                <select
                  v-model="state.user_data.sectionCode"
                  @change="fetchAwardees"
                  id="sectionCode"
                  class="border border-green-300 rounded px-2 py-1"
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
                <TableSearchSimple @handleFilter="handleFilter" />
              </div>
            </div>
            <TableAwardees :awardees="state.awardees.data" @update:isPageLoading="handlePageLoading" />
            <Pagination v-if="state.awardees?.data?.length > 0" :data="state.awardees" @previous="previous" @next="next" />
        </div>
    </div>
  </template>
  
  <script setup>
  import { awardeeService } from '~/api/AwardeeService'
  import { useUserStore } from '@/store/user'
  import { useParameterStore } from '@/store/parameter'

  const { $capitalizeWords } = useNuxtApp()

  let currentPage = 1

  const userStore = useUserStore()
  const useParameter = useParameterStore()
  const user = userStore.getUser
  const sectionCodes = useParameter.getSectionCode
  const marketCodes = useParameter.getMarketCode

  definePageMeta({
      layout: 'main'
  })

  useHead({
    title: 'Awardee | eSMS'
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
    sectionCodes: sectionCodes,
    marketCodes: marketCodes
  })

  onMounted(() => {
      fetchAwardees()
      console.log(state.marketCodes)
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