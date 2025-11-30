<template>
    <div class="min-h-screen p-4 sm:p-6">
    <ButtonBack @click="goBack">
      <span class="flex items-center justify-between">
          <ArrowLeftIcon class="text-green-900 w-5 h-5 mr-2" /> Back
      </span>
  </ButtonBack>
    <Loader v-if="$loading.state.isPageLoading" />
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h11M9 21V3m4 18V3m4 7h4M3 10l7-7m0 0l7 7"></path>
                    </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-gray-800">Stall</h2>
                </div>

                <!-- Stall Information -->
                <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-3">
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border sm:col-span-3">
                        <label class="text-gray-600 text-xs font-medium mb-1">Description</label>
                        <p class="text-gray-700 text-sm">{{state.awardee?.stallRentalDet?.stallProfile?.stallDescription}}</p>
                    </div>
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Business ID</label>
                        <p class="text-gray-700 text-sm">{{state.awardee?.stallRentalDet?.busID}}</p>
                    </div>
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Business Status</label>
                        <p class="text-gray-700 text-sm">{{state.awardee?.stallRentalDet?.busIDStatus}}</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Location Influence</label>
                        <p v-if="state.awardee?.stallRentalDet?.stallProfile?.CFSI" class="text-gray-700 text-sm">{{ state.awardee?.CFSI }}</p>
                        <p v-else class="text-gray-700 text-sm text-gray-400">Common Stall</p>
                    </div>
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Class</label>
                        <p class="text-gray-700 text-sm">{{state.awardee?.stallRentalDet?.stallProfile?.stallClass}}</p>
                    </div>
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">ID</label>
                        <p class="text-gray-700 text-sm">{{state.awardee?.stallRentalDet?.stallProfile?.stallNoId}}</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Stall Area</label>
                        <p class="text-gray-700 text-sm">{{ $formatPeso(state.awardee?.stallRentalDet?.stallProfile?.stallArea) }}</p>
                    </div>
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Stall Ext. Area</label>
                        <p class="text-gray-700 text-sm">{{ $formatPeso(state.awardee?.stallRentalDet?.stallProfile?.StallAreaExt) }}</p>
                    </div>
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Rate per Day</label>
                        <p class="text-gray-700 text-sm">{{ $formatPeso(state.awardee?.stallRentalDet?.stallProfile?.TotalRatePerDay) }}</p>
                    </div>
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Rate per Month (EST)</label>
                        <p class="text-gray-700 text-sm">{{ $formatPeso(state.awardee?.stallRentalDet?.stallProfile?.TotalRatePerDay * 30) }}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { awardeeService } from '~/api/AwardeeService';
  import { PlusIcon } from '@heroicons/vue/20/solid'
  import { ArrowLeftIcon, XMarkIcon } from '@heroicons/vue/24/outline'
  const { showLoading, closeLoading } = useSweetLoading()
  
  const router = useRouter();
  const id = router?.currentRoute?.value?.params?.id;

  const { $formatPeso } = useNuxtApp()

  //global loading
  const { $loading } = useNuxtApp()
  
  definePageMeta({
    layout: 'main',
  });

  useHead({
    title: 'Profile | eSMS'
  })
  
  const state = reactive({
    // isPageLoading: false,
    awardee: null,
    open: false,
    awardee_id: id,
  });
  
  onMounted(() => {
    fetch_awardee_profile();
  });
  
  async function fetch_awardee_profile() {
    $loading.start();
    try {
      const response = await awardeeService.getAwardeeProfile(id);
      if (response.data) {
        console.log(response.data);
        state.awardee = response.data;
      }
    } catch (error) {
      console.log(error);
    }
    $loading.stop();
  }
  
  const activeTab = ref('stall');

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