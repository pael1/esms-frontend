<template>
    <div class="px-4 sm:px-6 lg:px-8">
      <Loader v-if="state.isPageLoading" />
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">AWARDEE</h1>
        </div>
      </div>
      <div class="flex items-center justify-between">
          <div>
              <TableSearch :columnFilter="state.columnFilter" :dataFilter="state.dataFilter"
                  @handleFilter="handleFilter" />
          </div>
          <!-- <div class="flex items-center">
              <FormButton type="button" @click="state.open = true">Client Intake</FormButton>
          </div> -->
      </div>
      <TableAwardees :awardees="state.awardees.data" @update:isPageLoading="handlePageLoading" />
      <Pagination v-if="state.awardees?.data?.length > 0" :data="state.awardees" @previous="previous" @next="next" />
    </div>
  </template>
  
  <script setup>
//   import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/20/solid'
  import { awardeeService } from '@/components/api/AwardeeService'
  import { useUserStore } from '@/store/user'
  import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon } from '@heroicons/vue/24/outline'
  import { UserIcon, ScaleIcon, CakeIcon, PencilIcon, UserPlusIcon, PlusCircleIcon  } from '@heroicons/vue/20/solid'

  let currentPage = 1

  const userStore = useUserStore()
  const user = userStore.getUser

  definePageMeta({
      layout: 'main'
  })

  const state = reactive({
    isPageLoading: false,
    user_data: {
        marketcode: user.MarketCode,
        stall_type: 'regular',
        section: '07',
    },
    awardees: [],
    dataFilter: [],
    columnFilter: [
        { column: 'First Name' },
        { column: 'Last Name' },
    ],
    // open: false,
    // agencies: {
    //     options: []
    // },
    // roles: {
    //     options: []
    // },
    // error: null
    // sortData: {
    //     sortField: 'id',
    //     sortOrder: 'ascend',
    // }
  })

  onMounted(() => {
      fetchAwardees()
  })

  async function fetchAwardees() {
      state.isPageLoading = true
      try {
          let params = {
              page: currentPage,
            //   sortField: state.sortData.sortField,
            //   sortOrder: state.sortData.sortOrder,
              marketcode: state.user_data.marketcode,
              type: state.user_data.stall_type,
              section: state.user_data.stall_type,
              ...state.dataFilter
          }
          console.log(params);
          const response = await awardeeService.getAwardees(params)
          if (response) {
              console.log(response);
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