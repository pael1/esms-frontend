<template>
    <div class="min-h-screen sm:p-3">
        <div class="bg-white">
            <Loader v-if="state.isPageLoading" />
            <div class="py-3"></div>
            <div class="sm:flex sm:items-center p-2">
                <!-- <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">MASTERLIST REPORT</h1>
                </div> -->
            </div>
            <div class="flex items-center justify-between">
            <!-- Left side: select -->
              <div class="flex items-center gap-x-2">
                <div class="w-48">
                  <FormSelect
                    v-model="state.user_data.marketcode"
                    @update:modelValue="fetchReport"
                    :options="state.marketCodes"
                  />
                </div>
                <div class="w-48">
                  <FormSelect
                    v-model="state.user_data.sectionCode"
                    @update:modelValue="fetchReport"
                    :options="state.sectionCodes"
                  />
                </div>
              </div>
              <div>
                <button
                  type="button"
                  class="inline-flex items-center gap-x-1.5 rounded-md bg-gray-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-400"
                  @click="print()"
                >
                  Print
                </button>
              </div>
            </div>
            <TableReportsMasterlist :awardees="state.awardees.data" @update:isPageLoading="handlePageLoading" />
            <Pagination v-if="state.awardees?.data?.length > 0" :data="state.awardees" @previous="previous" @next="next" />
        </div>
    </div>
  </template>
  
  <script setup>
  import { reportService } from '~/api/ReportService'
  import { useUserStore } from '@/store/user'
  import { useParameterStore } from '@/store/parameter'
  import { useMarketcodeStore } from '@/store/marketcode'

  const { showError, showSuccess, showLoading, closeLoading } = useSweetLoading()

  const { $capitalizeWords } = useNuxtApp()

  let currentPage = 1

  const userStore = useUserStore()
  const useParameter = useParameterStore()
  const user = userStore.getUser
  const sectionCodes = useParameter.getSectionCode
  const useMarketCode = useMarketcodeStore()
  let marketCodes = useMarketCode.getMarketCode

  //default marketcode
  let userMarketcode = '07'
  //if user is admin only show all marketcodes else show only marketcode for specific user
  if (user.office != '99' && user.office != '00') {
    marketCodes = marketCodes.filter((m) => m.value === user.office)
    userMarketcode = user.office
  }

  definePageMeta({
      layout: 'main'
  })

  useHead({
    title: 'Masterlist Report | eSMS'
  })

  const state = reactive({
    isPageLoading: false,
    user_data: {
        marketcode: user.office,
        stall_type: 'regular',
        sectionCode: '01',
    },
    awardees: [],
    sectionCodes: sectionCodes,
    marketCodes: marketCodes,
  })

  onMounted(() => {
      fetchReport()
  })

  function getMasterlistParams() {
    return {
      marketcode: state.user_data.marketcode,
      type: state.user_data.stall_type,
      section: state.user_data.sectionCode,
    };
  }

  async function fetchReport() {
      state.isPageLoading = true
      try {
          let params = {
              ...getMasterlistParams(),
              page: currentPage
          }
          console.log(params)
          const response = await reportService.masterlist(params)
          if (response) {
              state.awardees = response
          }
      } catch (error) {
          console.log(error)
      }
      state.isPageLoading = false
  }

  async function previous() {
    currentPage--
    fetchReport()
  }

  async function print() {
      try {
          showLoading('Generating', '');
          let params = getMasterlistParams();
          const response = await reportService.masterlist_print(params)
          if (response) {
            const blobContent = new Blob([response], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blobContent);
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.onload = () => {
              iframe.contentWindow.print();
              iframe.onload = () => {
                URL.revokeObjectURL(blobUrl);
                document.body.removeChild(iframe);
              };
            };
          }
          closeLoading()
      } catch (error) {
          console.log(error)
      }
  }

  async function next() {
      currentPage++
      fetchReport()
  }

  function handlePageLoading(isLoading) {
      state.isPageLoading = isLoading;
  }
   
</script>