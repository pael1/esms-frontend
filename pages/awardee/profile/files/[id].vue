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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8V6a2 2 0 012-2h6l2 2h2a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V8z"></path>
                        </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-gray-800">Files</h2>
                </div>
                <TableFiles :files="state.files" @update:isPageLoading="handlePageLoading" />

                <Pagination v-if="state.files?.data?.length > 0" :data="state.files" @previous="previous" @next="next" />  
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
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
    files: null,
  });
  
  onMounted(() => {
    fetch_profile();
    fetch_files();
  });
  
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

  async function fetch_files() {
    state.isPageLoading = true;
    try {
      let params = {
          page: currentPage,
          ownerId: id,
      }
      const response = await awardeeService.getAwardeeFiles(params);
      if (response.data) {
        console.log(response.data)
        state.files = response.data;
      }
    } catch (error) {
      console.log(error);
    }
    state.isPageLoading = false;
  }

  async function previous() {
    currentPage--
    fetch_files()
  }

  async function next() {
    currentPage++
    fetch_files()
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