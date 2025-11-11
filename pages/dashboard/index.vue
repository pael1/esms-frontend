<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <Loader v-if="state.isPageLoading" />

    <!-- Page Header -->
    <div class="flex flex-wrap items-center justify-between">
      <h1 class="text-2xl font-bold text-green-700">Dashboard</h1>
      <p class="text-gray-500 text-sm">eSMS Analytics Overview</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white shadow-sm border border-green-400 rounded-lg p-5 hover:shadow-md transition-all duration-300">
        <h3 class="text-sm text-gray-500">Over All Payments (Current Month)</h3>
        <p class="text-2xl font-bold text-green-700 mt-2">{{ $formatPeso(state.total.over_all.toLocaleString()) }}</p>
      </div>

      <div class="bg-white shadow-sm border border-green-400 rounded-lg p-5 hover:shadow-md transition-all duration-300">
        <h3 class="text-sm text-gray-500">Payments Collected (Current Month)</h3>
        <p class="text-2xl font-bold text-green-700 mt-2">{{ $formatPeso(state.total.collected.toLocaleString()) }}</p>
      </div>

      <div class="bg-white shadow-sm border border-green-400 rounded-lg p-5 hover:shadow-md transition-all duration-300">
        <h3 class="text-sm text-gray-500">Payments Pending (Current Month)</h3>
        <p class="text-2xl font-bold text-green-700 mt-2">{{ $formatPeso(state.total.un_collected.toLocaleString()) }}</p>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <!-- Sales Trend -->
      <div class="bg-white shadow-md rounded-xl p-5 border border-green-400 hover:shadow-lg transition-all duration-300">
        <h2 class="text-lg font-semibold text-green-700 mb-3">Monthly Payments Collected</h2>
        <apexchart
          type="area"
          height="250"
          :options="chartOptions.sales"
          :series="chartSeries.sales"
        />
      </div>

      <!-- Revenue Breakdown -->
      <div class="bg-white shadow-md rounded-xl p-5 border border-green-400 hover:shadow-lg transition-all duration-300">
        <h2 class="text-lg font-semibold text-green-700 mb-3">Revenue Breakdown</h2>
        <apexchart
          type="donut"
          height="250"
          :options="chartOptions.revenue"
          :series="chartSeries.revenue"
        />
      </div>

      <!-- Stall Utilization -->
      <div class="bg-white shadow-md rounded-xl p-5 border border-green-400 hover:shadow-lg transition-all duration-300">
        <h2 class="text-lg font-semibold text-green-700 mb-3">Stall Utilization</h2>
        <apexchart
          type="bar"
          height="250"
          :options="chartOptions.utilization"
          :series="chartSeries.utilization"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { dashboardService } from '~/api/DashboardService'
import { ref, reactive, onMounted } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import { useUserStore } from '@/store/user'

definePageMeta({ layout: 'main' })
useHead({ title: 'Dashboard | eSMS' })

const userStore = useUserStore()
const user = userStore.getUser

const { $formatPeso } = useNuxtApp()

const apexchart = ApexCharts

const state = reactive({
  isPageLoading: false,
  total: {
    collected: 0,
    un_collected: 0,
    over_all: 0,
  },
  opsCards: 0
})

// const state = reactive({
//   payments: 0,
//   opsCards: 0,
// })

// Chart data placeholders
const chartSeries = reactive({
  sales: [{ name: 'Sales', data: [] }],
  revenue: [45, 30, 15, 10],
  utilization: [{ name: 'Occupied', data: [] }],
})

// Chart options
const chartOptions = reactive({
  sales: {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['#16a34a'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.6,
        opacityFrom: 0.5,
        opacityTo: 0.1,
      },
    },
    grid: { borderColor: '#e5e7eb' },
    xaxis: {
      categories: [],
      labels: { style: { colors: '#4b5563', fontSize: '12px' } },
    },
    yaxis: {
      labels: {
        formatter: (val) => {
          if (val >= 1_000_000) return `₱${(val / 1_000_000).toFixed(1)}M`
          if (val >= 1_000) return `₱${(val / 1_000).toFixed(1)}K`
          return `₱${val.toFixed(2)}`
        },
      },
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `₱${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      },
    },
  },

  revenue: {
    labels: ['Market Fees', 'Rent', 'Permits', 'Others'],
    colors: ['#22c55e', '#16a34a', '#15803d', '#86efac'],
    legend: { position: 'bottom', labels: { colors: '#374151' } },
    dataLabels: { enabled: false },
  },
  utilization: {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '40%',
      },
    },
    dataLabels: { enabled: false },
    grid: { borderColor: '#e5e7eb' },
    xaxis: {
      categories: [],
      labels: { style: { colors: '#4b5563', fontSize: '12px' } },
    },
    colors: ['#16a34a'],
  },
})

// Fetch chart data
onMounted(() => {
  fetchChartData()
  fetchRevenue()
})

async function fetchRevenue() {
    try {
      const response = await dashboardService.getRevenue(user)
      if (response) {
          // Add totals from API
          state.total.collected = response.monthly_total_collected ?? 0
          state.total.un_collected = response.monthly_total_uncollected ?? 0
          state.total.over_all = response.overall_total_m ?? 0

          chartSeries.sales[0].data = response.series[0].data
          chartOptions.sales = {
            ...chartOptions.sales,
            xaxis: { ...chartOptions.sales.xaxis, categories: response.categories },
          }
      }
    } catch (error) {
      console.error(error)
    }
  }

async function fetchChartData() {
  state.isPageLoading = true
  try {
    const { data } = await useFetch('http://127.0.0.1:8000/api/sales-data')

    if (data.value) {
      // Update series & categories
      // chartSeries.sales[0].data = data.value.series[0].data
      // chartOptions.sales = {
      //   ...chartOptions.sales,
      //   xaxis: { ...chartOptions.sales.xaxis, categories: data.value.categories },
      // }

      chartSeries.utilization[0].data = data.value.utilization || [70, 50, 60]
      chartOptions.utilization = {
        ...chartOptions.utilization,
        xaxis: {
          ...chartOptions.utilization.xaxis,
          categories: data.value.categories,
        },
      }

      // Add totals from API
      state.payments = data.value.total_payments ?? 0
      state.opsCards = data.value.total_ops_cards ?? 0
    }
  } catch (error) {
    console.error(error)
  } finally {
    state.isPageLoading = false
  }
}
</script>

<style scoped>
.apexcharts-canvas {
  transition: all 0.3s ease-in-out;
}
</style>
