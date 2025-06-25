<template>
    <div class="px-4 sm:px-6 lg:px-8">
      <Loader v-if="state.isPageLoading" />
      
    <div class="grid grid-cols-1 sm:grid-cols-2 mt-8 gap-y-4 sm:gap-x-4">
        <div class="border-b border-gray-200 bg-white rounded-lg shadow-sm">
            <div class="ml-4 mt-4">
                <h3 class="text-lg font-bold">title</h3>
            </div>
            <div class="mt-4">
                <ApexChart
      width="100%"
      type="line"
      :options="chartOptions"
      :series="series"
    />
            </div>
        </div>
        <div class="border-b border-gray-200 bg-white rounded-lg shadow-sm">
            <div class="ml-4 mt-4">
                <h3 class="text-lg font-bold">title</h3>
            </div>
            <div class="mt-4">
                <ApexChart
      width="100%"
      type="line"
      :options="chartOptions"
      :series="series"
    />
            </div>
        </div>
    </div>
      <!-- <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Users</h1>
          <p class="mt-2 text-sm text-gray-700">A list of all the users in your account including their name, title, email and role.</p>
        </div>
        <FormButton type="button" @click="editClient">
            <PlusCircleIcon class="h-5 w-5 text-white mr-2" aria-hidden="true" />
            Add
        </FormButton>
      </div>
      <div class="flex items-center justify-between">
          <div>
              <TableSearch :columnFilter="state.columnFilter" :dataFilter="state.dataFilter"
                  @handleFilter="handleFilter" />
          </div>
      </div>
      <TableUsers :users="state.users.data" />
      <Pagination v-if="state.users?.data?.length > 0" :data="state.users" @previous="previous" @next="next" /> -->
    </div>
  </template>
  
  <script setup lang="ts">
//   import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/20/solid'
import { ref, onMounted } from 'vue'
  import { userService } from '@/components/api/UserService'
  import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon } from '@heroicons/vue/24/outline'
  import { UserIcon, ScaleIcon, CakeIcon, PencilIcon, UserPlusIcon, PlusCircleIcon  } from '@heroicons/vue/20/solid'

  let currentPage = 1

  definePageMeta({
      layout: 'main'
  })

  const state = reactive({
    isPageLoading: false,
    // userForm: {
    //     role: '',
    //     agency_id: '',
    //     firstname: '',
    //     lastname: '',
    //     telephone_number: '',
    //     mobile_number: '',
    //     agency_address: '',
    //     email: '',
    //     password: '',
    // },
    users: [],
    dataFilter: [],
    columnFilter: [
        { column: 'password' },
        { column: 'test' },
    ],
    // open: false,
    // agencies: {
    //     options: []
    // },
    // roles: {
    //     options: []
    // },
    // error: null
    sortData: {
        sortField: 'id',
        sortOrder: 'ascend',
    }
  })

  onMounted(() => {
      // fetchUsers()
  })

  async function fetchUsers() {
      state.isPageLoading = true
      try {
          let params = {
              page: currentPage,
              sortField: state.sortData.sortField,
              sortOrder: state.sortData.sortOrder,
              ...state.dataFilter
          }
          const response = await userService.getUsers(params)
          if (response) {
              console.log(response);
              state.users = response
          }
      } catch (error) {
          console.log(error)
      }
      state.isPageLoading = false
  }

  function handleFilter(value: any) {
      currentPage = 1
      state.dataFilter = value
      fetchUsers()
  }

  async function previous() {
    currentPage--
    fetchUsers()
}

async function next() {
    currentPage++
    fetchUsers()
}

const series = ref([
  {
    name: 'Sales',
    data: []
  }
])

const chartOptions = ref({
  chart: {
    id: 'vuechart-example'
  },
  xaxis: {
    categories: []
  }
})

// Fetch from Laravel API
onMounted(async () => {
  const { data } = await useFetch('http://192.168.61.145/api/sales-data') // adjust to your Laravel backend

  if (data.value) {
    series.value[0].data = data.value.series[0].data
    chartOptions.value.xaxis.categories = data.value.categories
  }
})
   
  </script>