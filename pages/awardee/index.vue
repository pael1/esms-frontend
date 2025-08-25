<template>
    <div class="min-h-screen sm:p-3">
        <div class="bg-white">
            <Loader v-if="$loading.state.isPageLoading" />
            <div class="py-3"></div>
            <div class="sm:flex sm:items-center p-2">
            </div>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <!-- Left side: select -->
              <div class="sm:w-48 w-full">
                <FormSelect
                  v-model="state.user_data.sectionCode"
                  @update:modelValue="fetchAwardees"
                  :options="state.sectionCodes"
                />
              </div>

              <!-- Right side: TableSearch -->
              <div class="w-full sm:w-auto">
                <TableSearchSimple @handleFilter="handleFilter" :placeholder="'Enter Name'" />
              </div>
            </div>
            <!-- <TableAwardees :awardees="state.awardees.data" @update:isPageLoading="handlePageLoading" /> -->
            <TableAwardees :awardees="state.awardees.data" />
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

    //global loading
  const { $loading } = useNuxtApp()

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
    sectionCodes: sectionCodes
  })

  onMounted(() => {
      fetchAwardees()
  })

  async function fetchAwardees() {
      $loading.start()
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
            console.log(response)
              state.awardees = response
          }
      } catch (error) {
          console.log(error)
      }
      $loading.stop()
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

// function handlePageLoading(isLoading) {
//     state.isPageLoading = isLoading;
// }
   
</script>