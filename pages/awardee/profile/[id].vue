<template>
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
                        <p class="text-gray-700 text-sm">{{state.awardee?.stallRentalDet?.stallProfile?.stallArea}}</p>
                    </div>
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Stall Ext. Area</label>
                        <p class="text-gray-700 text-sm">{{state.awardee?.stallRentalDet?.stallProfile?.StallAreaExt
                        }}</p>
                    </div>
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Rate per Day</label>
                        <p class="text-gray-700 text-sm">{{state.awardee?.stallRentalDet?.stallProfile?.ratePerDay}}</p>
                    </div>
                    <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg border">
                        <label class="text-gray-600 text-xs font-medium mb-1">Rate per Month</label>
                        <p class="text-gray-700 text-sm">{{state.awardee?.rate_per_month}}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <Modal :show="state.open">
            <div class="w-full sm:w-1/4 bg-white px-4 py-5 sm:px-6 rounded-lg space-y-4">
                <div
                    class="border-b border-violet-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div class="ml-2 mb-2">
                        <h3 class="text-lg font-semibold text-green-900">
                            Choose Billing
                        </h3>
                    </div>
                    <div class="ml-2 mb-2">
                        <FormButton @click="closeDialog">
                            <XMarkIcon class="h-4 w-4 font-semibold" />
                        </FormButton>
                    </div>
                </div>
                
            </div>
        </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { awardeeService } from '@/components/api/AwardeeService';
  import { PlusIcon } from '@heroicons/vue/20/solid'
  import { ArrowLeftIcon, XMarkIcon } from '@heroicons/vue/24/outline'
  const { showLoading, closeLoading } = useSweetLoading()
  
  const router = useRouter();
  const id = router?.currentRoute?.value?.params?.id;
  
  definePageMeta({
    layout: 'main',
  });
  
  const state = reactive({
    isPageLoading: false,
    awardee: null,
    open: false,
    awardee_id: id,
  });
  
  onMounted(() => {
    fetch_awardee_profile();
  });
  
  async function fetch_awardee_profile() {
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
  
  const activeTab = ref('stall');

  function openDialog() {
    state.open = true
  }

  function closeDialog() {
      state.open = false
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