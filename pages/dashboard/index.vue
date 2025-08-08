<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <Loader v-if="state.isPageLoading" />
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
  <!-- Render only the first two cards (line charts) -->
  <div
    v-for="(chart, index) in chartCards1.slice(0, 2)"
    :key="index"
    class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
  >
    <!-- Stat Title + Label -->
    <div class="mb-2">
      <h2 class="text-2xl font-extrabold text-gray-800 dark:text-white">
        {{ chart.value }}
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-300">
        {{ chart.label }}
      </p>
    </div>

    <!-- Line Chart -->
    <ApexChart
      type="line"
      height="60"
      :options="getSparkOptions(chart.color, chart.name)"
      :series="[{ name: chart.name, data: chart.data }]"
    />
  </div>
</div>

<!-- Pie chart on its own row -->
<div class="mt-6">
  <ApexChart
    v-if="chartCards1[2]"
    type="pie"
    height="250"
    :options="getPieOptions(chartCards1[2].label)"
    :series="chartCards1[2].data"
  />
</div>



    <!-- <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <div
        v-for="(chart, index) in chartCards"
        :key="index"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col"
      >
        <div class="mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ chart.title }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            {{ chart.description }}
          </p>
        </div>
        <div class="flex-grow">
          <ApexChart
            width="100%"
            height="300"
            type="line"
            :options="chartOptions"
            :series="series"
          />
        </div>
      </div>
    </div> -->
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useParameterStore } from '@/store/parameter'

definePageMeta({ layout: 'main' })

useHead({
  title: 'Dashboard | eSMS'
})


const state = reactive({
  isPageLoading: false
})

// Example cards to reuse one layout
// const chartCards = ref([
//   {
//     title: '📈 Sales Overview',
//     description: 'Monthly trend for total sales.'
//   },
//   {
//     title: '📊 Sales Comparison',
//     description: 'Comparative performance by region.'
//   },
//   {
//     title: '📉 Revenue Forecast',
//     description: 'Projected revenue growth based on trends.'
//   }
// ])

const series = ref([
  {
    name: 'Sales',
    data: []
  }
])

const chartOptions = ref({
  chart: {
    id: 'vuechart-example',
    toolbar: { show: false }
  },
  xaxis: {
    categories: []
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  grid: {
    borderColor: '#e5e7eb'
  }
})

const chartCards1 = ref([
  {
    type: 'line',
    name: 'collections',
    label: 'Collections (Line)',
    value: '19,000',
    color: '#60a5fa',
    data: [20, 40, 35, 50, 49, 60, 70]
  },
  {
    type: 'pie',
    name: 'sales',
    label: 'Sales Breakdown',
    value: '100%',
    color: '#34d399',
    data: [40, 30, 20, 10] // Pie slices
  },
  {
    type: 'line',
    name: 'revenue',
    label: 'Revenue (Line)',
    value: '12,500',
    color: '#f472b6',
    data: [10, 20, 15, 25, 30, 35, 40]
  }
])

// const getSparkOptions = (color, name) => ({
//   chart: {
//     sparkline: { enabled: true }
//   },
//   stroke: {
//     curve: 'smooth',
//     width: 2
//   },
//   colors: [color],
//   tooltip: {
//     enabled: false
//   },
//   xaxis: {
//     crosshairs: { width: 1 }
//   }
// })

const getPieOptions = (label) => ({
  labels: ['Agdao', 'Bankerohan', 'Calinan', 'Toril', 'Mintal', 'Buhangin', 'Lasang'],
  legend: {
    position: 'bottom'
  },
  tooltip: {
    y: {
      formatter: val => `${val}%`
    }
  }
})


const getSparkOptions = (color, name) => ({
  chart: {
    id: `spark-${name}`,
    toolbar: { show: false },
    sparkline: { enabled: true }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'solid',
    opacity: 0.3
  },
  colors: [color],
  markers: {
    size: 3
  },
  tooltip: {
    x: { show: false },
    theme: 'light',
    marker: { show: true }
  },
  dataLabels: { enabled: false },
  grid: { show: false },
  xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { show: false }
})

// API calls
onMounted(() => {
  // fetchSectionCodes()
  fetchChartData()
})

// async function fetchSectionCodes() {
//   state.isPageLoading = true
//   try {
//     const response = await parameterService.getSectionCodes({ fieldId: 'SECTIONCODE' })
//     if (response) parameterStore.setSectionCode(response)
//   } catch (error) {
//     console.error(error)
//   }
//   state.isPageLoading = false
// }

async function fetchChartData() {
  try {
    const { data } = await useFetch('http://127.0.0.1:8000/api/sales-data')

    if (data.value) {
      series.value[0].data = data.value.series[0].data
      chartOptions.value.xaxis.categories = data.value.categories
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
