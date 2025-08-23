<template>
    <ButtonBack @click="goBack">
        <span class="flex items-center justify-between">
            <ArrowLeftIcon class="text-green-900 w-5 h-5 mr-2" /> Back
        </span>
    </ButtonBack>
    <div class="min-h-screen bg-gray-100 p-4 sm:p-6">
    <Loader v-if="state.isPageLoading" />
      <div class="bg-white shadow-lg rounded-2xl p-4 sm:p-6">
        <!-- Profile Section -->
        <!-- <ModulesAwardeeProfile :profile="state.awardee" :options="state.options" /> -->
        <ModulesAwardeeProfile :profile="state.awardee" />
  
        <!-- Tabs -->
        <ModulesAwardeeTabs :awardeeId="id" :routeName="$route.name" />
  
        <!-- Tab Content -->
        <div v-if="activeTab === 'stall'">
            <div class="bg-white shadow-md rounded-xl p-4 border border-green-300">
                <!-- Header -->
                <div class="flex items-center space-x-3 mb-3">
                    <div class="bg-green-500 p-2 rounded-md">
                        <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2m2-10H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z"></path>
                        </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-gray-800">Ledger</h2>
                </div>
                <TableLedger :ledger_datas="state.ledger_datas" @update:isPageLoading="handlePageLoading" />  

                <Pagination v-if="state.ledger_datas?.data?.length > 0" :data="state.ledger_datas" @previous="previous" @next="next" />             
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { awardeeService } from '~/api/AwardeeService';
  import { ArrowLeftIcon, XMarkIcon } from '@heroicons/vue/24/outline'
//   import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
  // import moment from 'moment';

  let currentPage = 1
  
  const router = useRouter();
  const id = router?.currentRoute?.value?.params?.id;
  
  definePageMeta({
    layout: 'main',
  });
  
  const state = reactive({
    isPageLoading: false,
    awardee: null,
    ledger_datas: null,
    options: null,
  });
  
  onMounted(() => {
    fetch_tallowner();
    fetch_ledger();
  });
  
  async function fetch_tallowner() {
    state.isPageLoading = true;
    try {
      const response = await awardeeService.getAwardeeProfile(id);
      if (response.data) {
        console.log(response.data);
        state.awardee = response.data;
      }
    } catch (error) {
      console.log(error);
    }
    state.isPageLoading = false;
  }
  async function fetch_ledger() {
    state.isPageLoading = true;
    try {
        let params = {
            page: currentPage,
            ownerId: id,
        }
      const response = await awardeeService.getAwardeeProfileLedger(params);
      if (response.data) {
        console.log(response.data)
        state.ledger_datas = response;
        // state.options = response.data.map((item) => ({
        //   value: item.stallOwnerAccountId,
        //   label: item.date,
        // }));
      }
    } catch (error) {
      console.log(error);
    }
    state.isPageLoading = false;
  }
  
  const activeTab = ref('stall');

async function previous() {
    currentPage--
    fetch_ledger()
}

async function next() {
    currentPage++
    fetch_ledger()
}
const goBack = () => {
  window.history.back()
}

  </script>
  
  <style>
  .hide-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
  }
  </style>