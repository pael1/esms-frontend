<template>
    <div class="min-h-screen sm:p-3">
        <div class="bg-white">
            <Loader v-if="state.isPageLoading" />
            <div class="py-3"></div>
            <div class="sm:flex sm:items-center sm:justify-end p-2">
              <FormButton
                buttonStyle="green"
                size="md"
                class="flex items-center gap-2"
                @click="registerAwardee()"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Awardee</span>
              </FormButton>
            </div>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <!-- Left side: grouped selects -->
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-2 w-full sm:w-auto">
                <div class="w-full sm:w-44">
                  <!-- <FormSelect
                    v-model="state.user_data.marketcode"
                    @update:modelValue="fetchAwardees"
                    :options="state.marketCodes"
                  /> -->
                </div>
                <div class="w-full sm:w-64">
                  <!-- <FormSelect
                    v-model="state.user_data.sectionCode"
                    @update:modelValue="fetchAwardees"
                    :options="state.sectionCodes"
                  /> -->
                </div>
              </div>

              <!-- Right side: TableSearch -->
              <div class="w-full sm:w-auto">
                <TableSearchSimple @handleFilter="handleFilter" :placeholder="'Enter Name'" />
              </div>
            </div>
            <TableConversionAwardee :awardees="state.awardees.data" />
            <Pagination v-if="state.awardees?.data?.length > 0" :data="state.awardees" @previous="previous" @next="next" />
        </div>
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from '@/store/user'
  import { useParameterStore } from '@/store/parameter'
  import { useMarketcodeStore } from '@/store/marketcode'
  import { useRouter } from 'vue-router'
  import { stallOwnerService } from '~/api/StallOwnerService'


  let currentPage = 1

  const userStore = useUserStore()
  const useParameter = useParameterStore()
  const useMarketCode = useMarketcodeStore()
  const user = userStore.getUser
  const sectionCodes = useParameter.getSectionCode
  const marketCodes = useMarketCode.getMarketCode
  const router = useRouter()

  definePageMeta({
      layout: 'main'
  })

  useHead({
    title: 'Conversion Awardee List | eSMS'
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
    sectionCodes: sectionCodes,
    marketCodes: marketCodes,
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
          
          const response = await stallOwnerService.getOwners(params)
          if (response) {
              state.awardees = response
              console.log(state.awardees);
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

function registerAwardee() {
    router.push('/conversion/awardee/create')
}
   
</script>