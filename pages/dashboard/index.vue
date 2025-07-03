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
    </div>
  </template>
  
  <script setup>

  import { ref, onMounted } from 'vue'
  import { useParameterStore } from '@/store/parameter'
  import { parameterService } from '~/components/api/ParameterService'


  const parameterStore = useParameterStore()

  let currentPage = 1

  definePageMeta({
      layout: 'main'
  })

  const state = reactive({
    isPageLoading: false,
  })

  onMounted(() => {
      fetchSectionCodes()
  })

  async function fetchSectionCodes() {
      state.isPageLoading = true
      try {
          let params = {
              fieldId: "SECTIONCODE"
          }
          const response = await parameterService.getSectionCodes(params)
          if (response) {
              parameterStore.setSectionCode(response)
          }
      } catch (error) {
          console.log(error)
      }
      state.isPageLoading = false
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
    const { data } = await useFetch('http://127.0.0.1:8000/api/sales-data') // adjust to your Laravel backend

    if (data.value) {
      series.value[0].data = data.value.series[0].data
      chartOptions.value.xaxis.categories = data.value.categories
    }
  })
   
  </script>