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
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-3">
                      <div class="bg-green-500 p-2 rounded-md">
                          <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2m2-10H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z"></path>
                          </svg>
                      </div>
                      <h2 class="text-lg font-semibold text-gray-800">Sync Data</h2>
                  </div>
                  <button
                      type="button"
                      class="inline-flex items-center gap-x-1 rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-green-400"
                      @click="add()">
                      Add Data
                  </button>
                </div>

                <TableSyncOp :data="state.data" @update:isPageLoading="handlePageLoading" />

                <Pagination v-if="state.data?.data?.length > 0" :data="state.data" @previous="previous" @next="next" />   
            </div>
        </div>

        <Modal :show="state.open">
            <div class="w-full sm:w-1/4 bg-white px-4 py-5 sm:px-6 rounded-lg space-y-4">
                <div
                    class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div class="ml-2 mb-2">
                        <h3 class="text-lg font-semibold text-green-900">
                            Add Sync Data
                        </h3>
                    </div>
                </div>
                <form @submit.prevent="addSyncData" autocomplete="off">
                    <div class="grid grid-cols-1 gap-y-2">
                        <div class="text-start">
                            <FormLabel for="ornumber" label="OR Number" />
                            <div class="mt-1">
                                <FormText name="ornumber" v-model="state.ornumber" />
                            </div>
                        </div>
                        <div class="text-start">
                            <FormLabel for="select_months" label="Month/s" />
                            <div class="mt-1">
                                <FormMultiSelect :options="state.options" v-model="state.months" />
                            </div>
                        </div>
                    </div>
                    <!-- ✅ Small, right-aligned buttons -->
                    <div class="mt-4 flex justify-end gap-x-2">
                        <FormButton
                            type="button"
                            @click="closeAdd"
                            buttonStyle="white"
                            class="px-3 py-1 text-sm rounded-md border border-green-300 text-green-700 hover:bg-green-100"
                        >
                            Cancel
                        </FormButton>
                        <FormButton
                            type="submit"
                            class="px-3 py-1 text-sm rounded-md bg-green text-white hover:bg-green-800"
                        >
                            Submit
                        </FormButton>
                    </div>
                </form>
            </div>
        </Modal>

      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { awardeeService } from '~/api/AwardeeService';
  import { syncService } from '~/api/SyncService';
  import { ArrowLeftIcon, XMarkIcon } from '@heroicons/vue/24/outline'

  const { showError, showSuccess, showLoading, closeLoading } = useSweetLoading()
  
  let currentPage = 1

  const router = useRouter();
  const id = router?.currentRoute?.value?.params?.id;
  
  definePageMeta({
    layout: 'main',
  });
  
  const state = reactive({
    isPageLoading: false,
    awardee: null,
    data: null,
    ornumber: null,
    open: false,
    months: [],
    options: []
  });
  
  onMounted(() => {
    fetch_profile();
    fetch_sync_data();
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

  async function fetch_sync_data() {
    state.isPageLoading = true;
    try {
      let params = {
          page: currentPage,
          ownerId: id,
      }
      const response = await awardeeService.sync_op(params);
      if (response.data) {
        state.data = response;
      }
    } catch (error) {
      console.log(error);
    }
    state.isPageLoading = false;
  }

  async function previous() {
    currentPage--
    fetch_sync_data()
  }

  async function next() {
      currentPage++
      fetch_sync_data()
  }

  const goBack = () => {
   window.history.back()
  }

  //MODALS
  function add() {
    fetch_arrears()
    state.open = true
  }
  function closeAdd() {
    clearForm()
    state.open = false
  }
  //END OF MODALS

  //clear form
  function clearForm(){
    state.ornumber = null
    state.months = []
  }

  async function addSyncData() {
      state.isPageLoading = true
      try {
        showLoading('Saving', '');
          let params = {
              ornumber: state.ornumber,
              months: state.months,
              ownerid: id
          }
          const response = await syncService.addData(params)
          if (response.data) {
              fetch_sync_data()
          }
        closeLoading()
        state.open = false
        clearForm()
      } catch (error) {
        let errorMessages = []
          Object.entries(error.errors).forEach(([field, messages]) => {
            messages.forEach((message) => {
              errorMessages.push(`${field}: ${message}`)
            })
          })
          showError('', errorMessages.join('<br>'))
      }
      state.isPageLoading = false
  }

  async function fetch_arrears() {
    try {
        let params = {
            ownerId: id,
        }
      const response = await syncService.getArrearsSync(params)
        console.log(response.data)
      if (response.data) {
        let options = response.data.map((item) => ({
          value: item.stallOwnerAccountId,
          label: item.date
        }));

        state.options = options
      }
    } catch (error) {
      console.log(error);
    }
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