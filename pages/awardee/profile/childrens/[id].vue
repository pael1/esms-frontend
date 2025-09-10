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
        <ModulesAwardeeProfile :profile="state.awardee"/>
  
        <!-- Tabs -->
        <ModulesAwardeeTabs :awardeeId="id" :routeName="$route.name" />
  
        <!-- Tab Content -->
        <div v-if="activeTab === 'stall'">
            <div class="bg-white shadow-md rounded-xl p-4 border border-green-300">
                <!-- Header -->
                <div class="flex items-center space-x-3 mb-3">
                    <div class="bg-green-500 p-2 rounded-md">
                        <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14c3.866 0 7 1.5 7 3.5v3H5v-3C5 15.5 8.134 14 12 14zm0-4a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-gray-800">Children</h2>
                </div>
                <TableChildrens :childrens="state.childrens" @update:isPageLoading="handlePageLoading" />

                <Pagination v-if="state.childrens?.data?.length > 0" :data="state.childrens" @previous="previous" @next="next" />   
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { awardeeService } from '~/api/AwardeeService';
  import { childrenService } from '~/api/ChildrenService';
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
    childrens: null,
  });
  
  onMounted(() => {
    fetchAwardee();
    fetchChildrens();
  });
  
  async function fetchAwardee() {
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

  async function fetchChildrens() {
    state.isPageLoading = true;
    try {
      let params = {
          page: currentPage,
          ownerId: id,
      }
      const response = await childrenService.getAwardeeChildrens(params);
      if (response.data) {
        state.childrens = response.data;
      }
    } catch (error) {
      console.log(error);
    }
    state.isPageLoading = false;
  }

  async function previous() {
    currentPage--
    fetchChildrens()
  }

  async function next() {
      currentPage++
      fetchChildrens()
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