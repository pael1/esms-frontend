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
        <ModulesAwardeeProfile :profile="state.awardee" @newOPGenerated="onOpGenerated" />
  
        <!-- Tabs -->
        <ModulesAwardeeTabs :awardeeId="id" :routeName="$route.name" />
  
        <!-- Tab Content -->
        <div v-if="activeTab === 'stall'">
            <div class="bg-white shadow-md rounded-xl p-4 border border-green-300">
                <!-- Header -->
                <div class="flex items-center space-x-3 mb-3">
                    <div class="bg-green-500 p-2 rounded-md">
                        <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m4-3h-4m0 0l2-2m-2 2l2 2"></path>
                        </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-gray-800">Transactions</h2>
                </div>
                <TableTransactions :awardee="state.awardee" :transactions="state.transactions" @update:isPageLoading="handlePageLoading" />

                <Pagination v-if="state.transactions?.data?.length > 0" :data="state.transactions" @previous="previous" @next="next" />   
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { awardeeService } from '~/api/AwardeeService';
  import { ArrowLeftIcon, XMarkIcon } from '@heroicons/vue/24/outline'
  
  let currentPage = 1

  const router = useRouter();
  const id = router?.currentRoute?.value?.params?.id;
  
  definePageMeta({
    layout: 'main',
  });
  
  const state = reactive({
    isPageLoading: false,
    awardee: null,
    transactions: null,
  });
  
  onMounted(() => {
    fetch_profile();
    fetch_transactions();
  });

  //refresh the table if theres new op generated
  function onOpGenerated(data) {
    // console.log(data)
    fetch_transactions()
  }
  
  async function fetch_profile() {
    state.isPageLoading = true;
    try {
      const response = await awardeeService.getAwardeeProfile(id);
      if (response.data) {
        state.awardee = response.data;
      }
    } catch (error) {
      console.log(error);
    }
    state.isPageLoading = false;
  }

  async function fetch_transactions() {
    state.isPageLoading = true;
    try {
      let params = {
          page: currentPage,
          ownerId: id,
      }
      const response = await awardeeService.getAwardeeTransactions(params, id);
      if (response.data) {
        console.log(response.data)
        state.transactions = response;
      }
    } catch (error) {
      console.log(error);
    }
    state.isPageLoading = false;
  }

  async function previous() {
    currentPage--
    fetch_transactions()
  }

  async function next() {
      currentPage++
      fetch_transactions()
  }

  const goBack = () => {
   window.history.back()
  }
  
  const activeTab = ref('stall');
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