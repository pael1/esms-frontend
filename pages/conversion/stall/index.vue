<template>
    <div class="min-h-screen sm:p-3">
        <div class="bg-white">
            <Loader v-if="state.isPageLoading" />
            <div class="sm:flex sm:items-center p-2">
                <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">STALL</h1>
                </div>
            </div>
            <div class="flex items-center justify-between">
              <!-- Left side: grouped selects -->
              <div class="flex items-center gap-x-2">
                <div class="w-44">
                  <FormSelect
                    v-model="state.user_data.marketcode"
                    @update:modelValue="fetchStalls"
                    :options="state.marketCodes"
                  />
                </div>
                <!-- <select
                  v-model="state.user_data.marketcode"
                  @change="fetchStalls"
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
                </select> -->

                <div class="w-64">
                  <FormSelect
                    v-model="state.user_data.sectionCode"
                    @update:modelValue="fetchStalls"
                    :options="state.sectionCodes"
                  />
                </div>
                <!-- <select
                  v-model="state.user_data.sectionCode"
                  @change="fetchStalls"
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
                </select> -->
              </div>

              <!-- Right side: TableSearch -->
              <div>
                <TableSearchSimple @handleFilter="handleFilter" />
              </div>
            </div>
            <TableStall :stalls="state.stalls.data" />
            <Pagination v-if="state.stalls?.data?.length > 0" :data="state.stalls" @previous="previous" @next="next" />
        </div>
    </div>
  </template>
  
  <script setup>
  import { stallService } from '@/components/api/StallService'
  import { useUserStore } from '@/store/user'
  import { useParameterStore } from '@/store/parameter'
  import { useMarketcodeStore } from '@/store/marketcode'

  const { $capitalizeWords } = useNuxtApp()

  let currentPage = 1

  const userStore = useUserStore()
  const useParameter = useParameterStore()
  const useMarketCode = useMarketcodeStore()
  const user = userStore.getUser
  const sectionCodes = useParameter.getSectionCode
  const marketCodes = useMarketCode.getMarketCode

  definePageMeta({
      layout: 'main'
  })

  useHead({
    title: 'Stall | eSMS'
  })

  const state = reactive({
    isPageLoading: false,
    user_data: {
        marketcode: user.MarketCode,
        stall_type: 'regular',
        sectionCode: '01',
    },
    stalls: [],
    dataFilter: [],
    columnFilter: [
        { column: 'First Name' },
        { column: 'Last Name' },
    ],
    sectionCodes: sectionCodes,
    marketCodes: marketCodes
  })

  onMounted(() => {
      fetchStalls()
  })

  async function fetchStalls() {
      state.isPageLoading = true
      try {
          let params = {
              page: currentPage,
              marketcode: state.user_data.marketcode,
              type: state.user_data.stall_type,
              section: state.user_data.sectionCode,
              ...state.dataFilter
          }
          const response = await stallService.getStalls(params)
          if (response) {
              state.stalls = response
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
      fetchStalls()
  }

  async function previous() {
    currentPage--
    fetchStalls()
}

async function next() {
    currentPage++
    fetchStalls()
}

function handlePageLoading(isLoading) {
    state.isPageLoading = isLoading;
}
   
</script>