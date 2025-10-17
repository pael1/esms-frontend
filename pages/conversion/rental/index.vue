<template>
  <Toaster richColors position="top-right" />
    <div class="min-h-screen sm:p-3">
        <div class="bg-white">
            <Loader v-if="$loading.state.isPageLoading" />
            <div class="py-3"></div>
            <div class="sm:flex sm:items-center sm:justify-end p-2">
              <FormButton type="submit" class="text-sm" @click="addRentalDialog()">Create Rental</FormButton>
            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <!-- Left side: grouped selects -->
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-2 w-full sm:w-auto">
                <div class="w-full sm:w-44">
                  <FormSelect
                    v-model="state.user_data.marketcode"
                    @update:modelValue="fetchRentals"
                    :options="state.marketCodes"
                  />
                </div>
                <div class="w-full sm:w-64">
                  <FormSelect
                    v-model="state.user_data.sectionCode"
                    @update:modelValue="fetchRentals"
                    :options="state.sectionCodes"
                  />
                </div>
              </div>

              <!-- Right side: TableSearch -->
              <div class="w-full sm:w-auto">
                <TableSearchSimple @handleFilter="handleFilter" :placeholder="'Enter Name'" />
              </div>
            </div>
            <TableRental :rentals="state.rentals.data" @viewRentalClick="view" />
            <Pagination v-if="state.rentals?.data?.length > 0" :data="state.rentals" @previous="previous" @next="next" />
        </div>
    </div>

    <!-- Modal -->
     <!-- create -->
    <Modal :show="state.open">
      <div class="w-full max-w-4xl mx-auto bg-white px-4 py-5 sm:px-6 rounded-lg space-y-4">
        <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div class="ml-2 mb-2">
            <h3 class="text-lg font-semibold text-green-900">Create Rental</h3>
          </div>
        </div>

        <form
          @submit.prevent="addStall"
          autocomplete="off"
          class="p-4"
        >
          <div class="bg-green-50 shadow-lg rounded-lg">
            <div class="flex flex-wrap gap-2">
              <div class="flex-1 min-w-[100px] mb-5">
                <FormLabel for="owner-name" label="Owner ID" />
                <div class="mt-1">
                  <FormTextSearch
                    name="owner_name"
                    v-model="state.owner.ownerId"
                    @search-change="searchOwner"
                    class="w-full"
                  />
                </div>
              </div>
              <!-- Make Section wider -->
              <div class="flex-[3] min-w-[300px] bg-gray-50 p-3 rounded-md border">
                <div v-if="state.owner.details">
                  <p><strong>Name:</strong> {{ state.owner.details.full_name }}</p>
                  <p><strong>Address:</strong> {{ state.owner.details.address }}</p>
                  <p><strong>Contact:</strong> {{ state.owner.details.contactnumber }}</p>
                </div>
                <div v-else class="text-gray-500 italic">
                  No owner details found
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-10">
              <div class="flex-1 min-w-[150px]">
                <FormLabel for="stall_type" label="Type" />
                <div class="mt-1">
                  <FormSelect v-model="state.stall.stallType" @update:modelValue="fetchStall" :options="state.parameter.types" />
                </div>
              </div>

              <div class="flex-1 min-w-[150px]">
                <FormLabel for="market" label="Market" />
                <div class="mt-1">
                  <FormSelect v-model="state.stall.marketCode" @update:modelValue="fetchStall" :options="state.parameter.markets" />
                </div>
              </div>

              <!-- Make Section wider -->
              <div class="flex-[2] min-w-[200px]">
                <FormLabel for="section" label="Section" />
                <div class="mt-1">
                  <FormSelect
                    v-model="state.stall.sectionCode" @update:modelValue="fetchStall"
                    :options="state.stall_options.sections"
                  />
                </div>
              </div>

              <div class="flex-1 min-w-[150px]">
                <FormLabel for="stall_no" label="Stall No" />
                <div class="mt-1">
                  <FormSelect
                    v-model="state.stall.stallNo" @update:modelValue="fetchStall"
                    :options="state.stall_options.stallNos"
                  />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-start">
                <FormLabel for="contract-start-date" label="Contract Start Date" />
                <div class="mt-1">
                  <FormDate name="contract_start_date" v-model="state.form.contractStartDate" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="period-of-contracy" label="Period of Contract" />
                <div class="mt-1">
                  <FormText name="period_of_contract" v-model="state.form.contractEndDate" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="business-id" label="Business ID" />
                <div class="mt-1">
                  <FormText name="business_id" v-model="state.form.busID" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-start">
                <FormLabel for="business-plate-no" label="Business Plate No" />
                <div class="mt-1">
                  <FormText name="business_plate_no" v-model="state.form.busPlateNo" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="business-started" label="Business Started" />
                <div class="mt-1">
                  <FormDate name="business_started" v-model="state.form.busDateStart" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="capital" label="Capital" />
                <div class="mt-1">
                  <FormText name="capital" v-model="state.form.capital" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-2">
              <div class="w-full">
                <FormLabel for="line-of-business" label="Line of Business" />
                <div class="mt-1">
                  <FormTextArea name="line_of_business" v-model="state.form.lineOfBusiness" class="w-full" />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Buttons -->
          <div class="mt-4 flex flex-wrap justify-end gap-2">
            <FormButton type="button" @click="closedDialog" buttonStyle="white" class="px-3 py-1 text-sm">
              Cancel
            </FormButton>
            <FormButton type="submit" class="px-3 py-1 text-sm">
              Save
            </FormButton>
          </div>
        </form>
      </div>
    </Modal>

    <!-- view/edit -->
     <Modal :show="state.openViewDialog">
      <div class="w-full max-w-4xl mx-auto bg-white px-4 py-5 sm:px-6 rounded-lg space-y-4">
        <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div class="ml-2 mb-2">
            <h3 class="text-lg font-semibold text-green-900">{{ state.isEdit ? 'Edit Stall' : 'View Stall' }}</h3>
          </div>
        </div>

        <form
          @submit.prevent="updateStall"
          autocomplete="off"
          class="p-4"
        >
          <div class="bg-green-50 shadow-lg rounded-lg p-4 mb-10 space-y-5">
            
            <!-- First row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-start">
                <FormLabel for="stall_type" label="Type" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.type" :options="state.parameter.types" :disabled="!state.isEdit" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="market" label="Market" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.market" :options="state.parameter.markets" :disabled="!state.isEdit" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="section" label="Section" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.section" :options="state.parameter.sections" @change="getSubSection($event)" :disabled="!state.isEdit" />
                </div>
              </div>
            </div>

            <!-- Second row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-start">
                <FormLabel for="sub-section" label="Sub Section" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.sub_section" :options="state.parameter.sub_sections" :disabled="!state.isEdit" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="building" label="Building" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.building" :options="state.parameter.buildings" :disabled="!state.isEdit" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="cfsi" label="Local Influence" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.cfsi" :options="state.parameter.cfsi" :disabled="!state.isEdit" />
                </div>
              </div>
            </div>

            <!-- Third row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <div class="sm:col-span-2 text-start">
                <FormLabel for="class" label="Class" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.class" :options="classOptions" :disabled="!state.isEdit" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="id" label="ID" />
                <div class="mt-1">
                  <FormNumber name="id" v-model="state.form.stall_id" :disabled="!state.isEdit" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="Extension" label="Extension" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.extension" :options="extensions" :disabled="!state.isEdit" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="area" label="Area" />
                <div class="mt-1">
                  <FormNumber name="area" v-model="state.form.area" :disabled="!state.isEdit" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="area-ext" label="Area Extension" />
                <div class="mt-1">
                  <FormNumber name="area_extension" v-model="state.form.area_extension" :disabled="!state.isEdit" />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Buttons -->
          <div class="mt-4 flex flex-wrap justify-end gap-2">
            <FormButton type="button" @click="closedDialogView" buttonStyle="white" class="px-3 py-1 text-sm">
              Close
            </FormButton>
            <FormButton v-if="state.isEdit" type="submit" class="px-3 py-1 text-sm">
              Update
            </FormButton>
          </div>
        </form>
      </div>
    </Modal>
  </template>
  
  <script setup>
  import { stallService } from '~/api/StallService'
  import { rentalService } from '~/api/RentalService'
  import { useUserStore } from '@/store/user'
  import { useParameterStore } from '@/store/parameter'
  import { useMarketcodeStore } from '@/store/marketcode'
  import { parameterService } from '~/api/ParameterService'
  import { Toaster, toast } from 'vue-sonner'
  import 'vue-sonner/style.css'
  import { debounce } from 'lodash-es'
  import { stallOwnerService } from '~/api/StallOwnerService'

  const { showError, showSuccess, showLoading, closeLoading } = useSweetLoading()

  let currentPage = 1

  const userStore = useUserStore()
  const useParameter = useParameterStore()
  const useMarketCode = useMarketcodeStore()
  const user = userStore.getUser
  const sectionCodes = useParameter.getSectionCode
  let marketCodes = useMarketCode.getMarketCode

  //default marketcode
  let userMarketcode = '07'
  //if user is admin only show all marketcodes else show only marketcode for specific user
  if (user.MarketCode != '99' && user.MarketCode != '00') {
    marketCodes = marketCodes.filter((m) => m.value === user.MarketCode)
    userMarketcode = user.MarketCode
  }

  //global loading
  const { $loading } = useNuxtApp()

  definePageMeta({
      layout: 'main'
  })

  useHead({
    title: 'Conversion Rental List | eSMS'
  })

  //default form for easy reset
  const defaultForm = {
    contractStartDate: null, 
    contractEndDate: null,
    busID: null,
    busPlateNo: null,
    busDateStart: null,
    capital: null,
    lineOfBusiness: null,
  }

  const state = reactive({
    form: { ...defaultForm },
    stallProfileId: null,
    user_data: {
        marketcode: userMarketcode,
        stall_type: 'regular',
        sectionCode: '01',
    },
    stall: {
        marketCode: null,
        stallType: null,
        sectionCode: null,
        stallNo: null,
    },
    owner: {
      ownerId: null,
      owners: [],
      details: null,
    },
    rentals: [],
    dataFilter: [],
    sectionCodes: sectionCodes,
    marketCodes: marketCodes,
    open: false,
    openViewDialog: false,
    isEdit: false,
    stall_options: {
      sections: [],
      stallNos: [],
    },
    parameter: {
      types: [],
      markets: [],
      sections: [],
      sub_sections: [],
      buildings: [],
      cfsi: [],
      class: [],
      extension: [],
    }
  })

  onMounted(() => {
      fetchRentals()
  })

  function getSubSection(selectedSection) {
    subSection(selectedSection);
  }

  function addRentalDialog() {
    loadParameters()
    Object.assign(state.form, defaultForm)
    state.open = true
  }
  function closedDialog() {
    state.open = false
  }

  function handleFilter(value) {
      currentPage = 1
      state.dataFilter = value
      fetchRentals()
  }

  async function previous() {
      currentPage--
      fetchRentals()
  }

  async function next() {
      currentPage++
      fetchRentals()
  }

  // async function addStall() {
  //   $loading.start()
  //     try {
  //         let params = state.form;
  //         const response = await stallService.addData(params)
  //         if (response) {
  //             fetchRentals()
  //             toast.success('Stall saved successfully')
  //         }
  //       // closeLoading()
  //       state.open = false
  //       // clearForm()
  //     } catch (error) {
  //       let errorMessages = []
  //         Object.entries(error.errors).forEach(([field, messages]) => {
  //           messages.forEach((message) => {
  //             errorMessages.push(`${field}: ${message}`)
  //           })
  //         })
  //         showError('', errorMessages.join('<br>'))
  //     }
  //     $loading.stop()
  // }

  async function fetchRentals() {
      $loading.start()
      try {
          let params = {
              page: currentPage,
              marketcode: state.user_data.marketcode,
              type: state.user_data.stall_type,
              section: state.user_data.sectionCode,
              ...state.dataFilter
          }
          const response = await rentalService.getRental(params)
          if (response) {
              state.rentals = response
          }
      } catch (error) {
          console.log(error)
      }
      $loading.stop()
  }

  //get stall details
  async function fetchStall() {
      $loading.start()
      try {
          let params = {
              type: state.stall.stallType,
              marketcode: state.stall.marketCode,
              section: state.stall.sectionCode,
              name: state.stall.stallNo,
          }
          console.log(params)
          const response = await stallService.getStalls(params)
          if (response) {
            console.log(response)
              // state.rentals = response

              //store section options
              state.stall_options.sections = response.data.map((item) => ({
                value: item.sectionCode,
                label: item.stallDescription
              }))

              state.stall_options.stallNos = response.data.map((item) => ({
                value: item.stallNoId,
                label: item.stallNoId
              }))
          }
      } catch (error) {
          console.log(error)
      }
      $loading.stop()
  }

  //get owners details
  async function fetchOwners() {
      $loading.start()
      try {
          let params = {
              name: state.owner.ow,
          }
          console.log(params)
          const response = await stallService.getStalls(params)
          if (response) {
            console.log(response)
              // state.rentals = response

              //store section options
              state.stall_options.sections = response.data.map((item) => ({
                value: item.sectionCode,
                label: item.stallDescription
              }))

              state.stall_options.stallNos = response.data.map((item) => ({
                value: item.stallNoId,
                label: item.stallNoId
              }))
          }
      } catch (error) {
          console.log(error)
      }
      $loading.stop()
  }

  //emit functions
  async function view(stallId, isView) { 
    $loading.start()

    //load datas
    loadParameters()

    state.isEdit = !isView;
    try {
      const response = await stallService.getStallDetails(stallId);
      if (response.data) {
        console.log(response.data);

        state.stallProfileId = response.data.stallProfileId;
        // Map API response to form fields
        state.form = {
          type: response.data.stallType ?? null,
          market: response.data.marketCode ?? null,
          section: response.data.section_id ?? null,
          sub_section: response.data.sub_section_id ?? null,
          building: response.data.building_id ?? null,
          cfsi: response.data.CFSI ?? '',
          class: response.data.stallClass ?? null,
          stall_id: response.data.stall_no_id ?? '',
          extension: response.data.stall_id_ext ?? null,
          area: response.data.stallArea ?? '',
          area_extension: response.data.StallAreaExt ?? ''
        }
      }
    } catch (error) {
      console.log(error);
    }
    $loading.stop()
    state.openViewDialog = true;
  } 

  // async function updateStall() {
  //   $loading.start()
  //     try {
  //       // showLoading('Saving', '');
  //         let params = state.form;
  //         let id = state.stallProfileId;
          
  //         const response = await stallService.updateStall(params, id)
  //         if (response) {
  //             fetchRentals()
  //             $loading.stop()

  //             state.openViewDialog = false
  //             toast.success('Stall updated successfully')
  //         }
  //       // clearForm()
  //     } catch (error) {
  //       console.log(error)
  //       let errorMessages = []
  //         Object.entries(error.errors).forEach(([field, messages]) => {
  //           messages.forEach((message) => {
  //             errorMessages.push(`${field}: ${message}`)
  //           })
  //         })
  //         showError('', errorMessages.join('<br>'))
  //     }
  // }

  function closedDialogView() {
    state.openViewDialog = false
  }
  //end of emit functions

  // async function subSection(section) {
  //   try {
  //     let params = {
  //       fieldId: 'SERIESCODE',
  //       section_id: section
  //     }
  //     const response = await parameterService.getSubSection(params)
  //     if (response) {
  //       console.log(response)
  //         let options = response.data.map((item) => ({
  //             value: item.fieldValue,
  //             label: item.fieldDescription
  //         }));
  //         state.parameter.sub_sections = options;
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async function fetchTypes() {
    try {
      let params = {
        fieldId: 'STALLTYPE'
      }
      const response = await parameterService.getParameter(params)
      if (response) {
          let options = response.data.map((item) => ({
              value: item.fieldDescription,
              label: item.fieldDescription
          }));
          state.parameter.types = options;
      }
    } catch (error) {
      console.error(error)
    }
  }

  // async function fetchInfluences() {
  //   try {
  //     let params = {
  //       fieldId: 'CFSI'
  //     }
  //     const response = await parameterService.getParameter(params)
  //     if (response) {
  //         let options = response.data.map((item) => ({
  //             value: item.fieldDescription,
  //             label: item.fieldDescription
  //         }));
  //         state.parameter.cfsi = options;
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async function fetchParameter(fieldId, stateKey) {
    try {
      const response = await parameterService.getParameter({ fieldId })
      if (response) {
        const options = response.data.map((item) => ({
          value: item.fieldValue, // fallback
          label: item.fieldDescription,
        }))
        state.parameter[stateKey] = options
      }
    } catch (error) {
      console.error(`Failed to fetch ${fieldId}`, error)
    }
  }
  function searchOwner(ownerId) {
    fetchOptions(ownerId)
  }

  const fetchOptions = debounce(async (ownerId) => {
    if (!ownerId) {
      state.owner.details = null
      return
    }

    try {
      const response = await stallOwnerService.getOwner(ownerId)
      if (response && response.data) {
        console.log(response)
        state.owner.details = response.data // adjust this based on your API response
      } else {
        console.log("response")
        state.owner.details = null
      }
    } catch (error) {
      console.error('Failed to fetch owner:', error)
    }
  }, 400)

  function loadParameters() {
    fetchTypes()
    fetchParameter('MARKETCODE', 'markets')
    fetchParameter('SECTIONCODE', 'sections')
    fetchParameter('STRUCTCODE', 'buildings')
    // fetchInfluences()
  }
  //end of parameter
   
</script>