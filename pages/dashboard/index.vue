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
        <h3 class="text-sm text-gray-500">Total Payments Collected (This Month)</h3>
        <p class="text-2xl font-bold text-green-700 mt-2">₱{{ totals.payments.toLocaleString() }}</p>
      </div>

      <div class="bg-white shadow-sm border border-green-400 rounded-lg p-5 hover:shadow-md transition-all duration-300">
        <h3 class="text-sm text-gray-500">Total Payments Pending (This Month)</h3>
        <p class="text-2xl font-bold text-green-700 mt-2">₱{{ totals.payments.toLocaleString() }}</p>
      </div>

      <div class="bg-white shadow-sm border border-green-400 rounded-lg p-5 hover:shadow-md transition-all duration-300">
        <h3 class="text-sm text-gray-500">Total Order Payments Issued</h3>
        <p class="text-2xl font-bold text-green-700 mt-2">{{ totals.opsCards.toLocaleString() }}</p>
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

definePageMeta({ layout: 'main' })
useHead({ title: 'Dashboard | eSMS' })

const apexchart = ApexCharts

const state = reactive({
  isPageLoading: false,
})

const totals = reactive({
  payments: 0,
  opsCards: 0,
})

// Chart data placeholders
const chartSeries = reactive({
  sales: [{ name: 'Sales', data: [] }],
  revenue: [45, 30, 15, 10],
  utilization: [{ name: 'Occupied', data: [] }],
})

// Chart options
const chartOptions = reactive({
  sales: {
    chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
    colors: ['#16a34a'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    grid: { borderColor: '#e5e7eb' },
    xaxis: {
      categories: [],
      labels: {
        style: { colors: '#4b5563', fontSize: '12px' },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `₱${val}`,
      },
    },
    tooltip: { theme: 'light' },
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
      const response = await dashboardService.getRevenue()
      if (response) {
          console.log(response)
          // Add totals from API
          totals.payments = response.current_month_total ?? 0
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
      chartSeries.sales[0].data = data.value.series[0].data
      chartOptions.sales = {
        ...chartOptions.sales,
        xaxis: { ...chartOptions.sales.xaxis, categories: data.value.categories },
      }

      chartSeries.utilization[0].data = data.value.utilization || [70, 50, 60]
      chartOptions.utilization = {
        ...chartOptions.utilization,
        xaxis: {
          ...chartOptions.utilization.xaxis,
          categories: data.value.categories,
        },
      }

      // Add totals from API
      totals.payments = data.value.total_payments ?? 0
      totals.opsCards = data.value.total_ops_cards ?? 0
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
