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
        <Loader v-if="$loading.state.isPageLoading" />
        <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div class="ml-2 mb-2">
            <h3 class="text-lg font-semibold text-green-900">Create Rental</h3>
          </div>
        </div>

        <form
          @submit.prevent="addRental"
          autocomplete="off"
          class="p-4"
        >
          <div class="bg-green-50 shadow-lg rounded-lg">
            <!-- OWNER SECTION -->
            <!-- <div class="flex flex-wrap gap-5 mb-2">
              <div class="w-full md:flex-1 md:min-w-[200px]">
                <FormLabel for="owner-name" label="Owner ID" />
                <div class="mt-1">
                  <FormTextSearch
                    name="owner_name"
                    v-model="state.form.ownerId"
                    @blur="searchOwner(0)"
                    class="w-full"
                  />
                </div>
              </div>

              <div class="w-full md:flex-[3]">
                <div class="mt-1">
                  <FormLabel for="owner-details" label="Owner Name" />
                </div>
                <div
                  v-if="state.owner.details">
                  <p
                    class="text-2xl font-bold text-gray-800 tracking-wide leading-snug break-words"
                  >
                    {{ $capitalizeWords(state.owner.details.full_name) }}
                  </p>
                </div>
                <div v-else class="text-gray-500 italic min-h-[60px]">
                  No owner details found
                </div>
              </div>
            </div> -->
            <div class="flex flex-wrap gap-5 mb-4">
              <!-- Owner ID input -->
              <div class="w-full md:flex-1 md:min-w-[400px]">
                <FormLabel for="owner-name" label="Owner Name" />
                <div class="mt-1">
                  <FormSelectSearch
                    v-model="state.owner.selected"
                    class="w-full"
                  />
                </div>
              </div>
              <div class="w-full md:flex-[3]"></div>
            </div>
           
            <div class="flex flex-wrap gap-2 mb-10">
              <div class="flex-1 min-w-[150px]">
                <FormLabel for="stall_type" label="Type" />
                <div class="mt-1">
                  <FormSelect v-model="state.stall.stallType" :options="state.parameter.types" />
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
                    v-model="state.stall.sectionCode" @update:modelValue="fetchStallNoId"
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

            <!-- STALL SECTION -->
            <div class="flex flex-wrap gap-5 mb-5">
              <!-- Stall No input -->
              <!-- <div class="w-full md:flex-1 md:min-w-[200px]">
                <FormLabel for="stall-no" label="Stall No" />
                <div class="mt-1">
                  <FormTextSearch
                    name="stall_no"
                    v-model="state.form.stallNo"
                    @blur="searchStall(0)"
                    class="w-full"
                  />
                </div>
              </div> -->

              <!-- Stall Description -->
              <!-- <div class="w-full md:flex-[3]">
                <div class="mt-1">
                  <FormLabel for="stall-details" label="Stall Description" />
                </div>
                <div
                  v-if="state.stall.details">
                  <p
                    class="text-1xl font-semibold text-gray-800 tracking-wide leading-snug break-words mt-2"
                  >
                    {{ $capitalizeWords(state.stall.details.stallDescription) }}
                  </p>
                </div>
                <div v-else class="text-gray-500 italic min-h-[60px]">
                  No stall details found
                </div>
              </div> -->
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
                  <FormDate name="period_of_contract" v-model="state.form.contractEndDate" />
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

    <!-- create -->
    <Modal :show="state.openViewDialog">
      <div class="w-full max-w-4xl mx-auto bg-white px-4 py-5 sm:px-6 rounded-lg space-y-4">
        <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap px-4 py-2">
          <div class="ml-2 mb-2">
            <h3 class="text-lg font-semibold text-green-900">
              {{ state.isEdit ? 'Edit Rental' : 'View Rental' }}
            </h3>
          </div>

          <div class="mr-2 mb-2">
              <FormButton
                v-if="state.rentalStatus !== 'cancel'"
                type="button"
                @click="cancelRental"
                buttonStyle="red"
                size="sm"
                class="px-3 py-1 text-sm"
              >
                Cancel Rental
              </FormButton>

              <p v-else class="text-red-600 font-semibold text-sm">
                Rental Cancelled
              </p>
          </div>
        </div>

        <form
          @submit.prevent="updateRental"
          autocomplete="off"
          class="p-4"
        >
          <div class="bg-green-50 shadow-lg rounded-lg">
            <!-- OWNER SECTION -->
            <div class="flex flex-wrap gap-5 mb-2">
              <!-- Owner ID input -->
              <div class="w-full md:flex-1 md:min-w-[200px]">
                <FormLabel for="owner-name" label="Owner ID" />
                <div class="mt-1">
                  <FormTextSearch
                    name="owner_name"
                    v-model="state.form.ownerId"
                    @blur="searchOwner(state.stallRentalId)"
                    class="w-full"
                    :disabled="!state.isEdit"
                  />
                </div>
              </div>

              <!-- Owner Name Display -->
              <div class="w-full md:flex-[3]">
                <div class="mt-1">
                  <FormLabel for="owner-details" label="Owner Name" />
                </div>
                <div
                  v-if="state.owner.details">
                  <p
                    class="text-2xl font-bold text-gray-800 tracking-wide leading-snug break-words"
                  >
                    {{ $capitalizeWords(state.owner.details.full_name) }}
                  </p>
                </div>
                <div v-else class="text-gray-500 italic min-h-[60px]">
                  No owner details found
                </div>
              </div>
            </div>

            <!-- STALL SECTION -->
            <div class="flex flex-wrap gap-5 mb-5">
              <!-- Stall No input -->
              <div class="w-full md:flex-1 md:min-w-[200px]">
                <FormLabel for="stall-no" label="Stall No" />
                <div class="mt-1">
                  <FormTextSearch
                    name="stall_no"
                    v-model="state.form.stallNo"
                    @blur="searchStall(state.stallRentalId)"
                    class="w-full"
                    :disabled="!state.isEdit"
                  />
                </div>
              </div>

              <!-- Stall Description -->
              <div class="w-full md:flex-[3]">
                <div class="mt-1">
                  <FormLabel for="stall-details" label="Stall Description" />
                </div>
                <div
                  v-if="state.stall.details">
                  <p
                    class="text-1xl font-semibold text-gray-800 tracking-wide leading-snug break-words mt-2"
                  >
                    {{ $capitalizeWords(state.stall.details.stallDescription) }}
                  </p>
                </div>
                <div v-else class="text-gray-500 italic min-h-[60px]">
                  No stall details found
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-start">
                <FormLabel for="contract-start-date" label="Contract Start Date" />
                <div class="mt-1">
                  <FormDate name="contract_start_date" v-model="state.form.contractStartDate" :disabled="!state.isEdit"/>
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="period-of-contracy" label="Period of Contract" />
                <div class="mt-1">
                  <FormDate name="period_of_contract" v-model="state.form.contractEndDate" :disabled="!state.isEdit"/>
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="business-id" label="Business ID" />
                <div class="mt-1">
                  <FormText name="business_id" v-model="state.form.busID" :disabled="!state.isEdit"/>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-start">
                <FormLabel for="business-plate-no" label="Business Plate No" />
                <div class="mt-1">
                  <FormText name="business_plate_no" v-model="state.form.busPlateNo" :disabled="!state.isEdit"/>
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="business-started" label="Business Started" />
                <div class="mt-1">
                  <FormDate name="business_started" v-model="state.form.busDateStart" :disabled="!state.isEdit"/>
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="capital" label="Capital" />
                <div class="mt-1">
                  <FormText name="capital" v-model="state.form.capital" :disabled="!state.isEdit"/>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-2">
              <div class="w-full">
                <FormLabel for="line-of-business" label="Line of Business" />
                <div class="mt-1">
                  <FormTextArea name="line_of_business" v-model="state.form.lineOfBusiness" class="w-full" :disabled="!state.isEdit"/>
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
  import { capitalize } from 'vue'

  const { $capitalizeWords } = useNuxtApp()

  const { showError, showSuccess, showConfirm, showLoading, closeLoading } = useSweetLoading()

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
    ownerId: null,
    stallNo: null,
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
    stallRentalId: null,
    user_data: {
        marketcode: userMarketcode,
        stall_type: 'regular',
        sectionCode: '01',
    },
    stall: {
        marketCode: null,
        stallType: null,
        sectionCode: null,
        details: null,
    },
    owner: {
      details: null,
      selected: null,
    },
    rentals: [],
    dataFilter: [],
    sectionCodes: sectionCodes,
    marketCodes: marketCodes,
    open: false,
    openViewDialog: false,
    isEdit: false,
    parameter: {
      types: [],
      markets: [],
      sections: [],
      sub_sections: [],
      buildings: [],
      cfsi: [],
      extension: [],
    },
    rentalStatus: null,
    stall_options: {
      sections: [],
      stallNos: [],
    },
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
    state.owner.details = null
    state.stall.details = null
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

  //get ownerId
  watch(() => state.owner.selected, (ownerId) => {
  if (ownerId) {
    state.form.ownerId = ownerId
  }
})

  //get stall details
  async function fetchStall() {
      $loading.start()
      try {
          let params = {
              type: state.stall.stallType,
              marketcode: state.stall.marketCode,
              sectioncode: state.stall.sectionCode,
              name: state.stall.stallNo,
          }
          console.log(params)
          const response = await stallService.getStallSel(params)
          if (response) {
            console.log(response)
              // state.rentals = response

              // store section options
              state.stall_options.sections = response.data.map((item) => ({
                value: item.sectionCode,
                label: item.stallDescription
              }))

              state.form.stallNo = response.data[0]?.stallNo || null
          }
      } catch (error) {
          console.log(error)
      }
      $loading.stop()
  }

  //get stall details
  async function fetchStallNoId() {
      $loading.start()
      try {
          let params = {
              type: state.stall.stallType,
              marketcode: state.stall.marketCode,
              sectioncode: state.stall.sectionCode,
              name: state.stall.stallNo,
          }
          console.log(params)
          const response = await stallService.getStallNoIdSel(params)
          if (response) {
            console.log(response)

              //store stallnoid options
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

  async function addRental() {
    $loading.start()
    // console.log(state.form)
    try {
        let params = state.form;
        const response = await rentalService.addData(params)
        if (response) {
            fetchRentals()
            toast.success('Rental saved successfully')
        }
      // closeLoading()
      state.open = false
    } catch (error) {
      let errorMessages = []
        Object.entries(error.errors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            errorMessages.push(`${field}: ${message}`)
          })
        })
        showError('', errorMessages.join('<br>'))
    }
    $loading.stop()
  }

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

  //emit functions
  async function view(rentalId, isView) { 
    $loading.start()

    state.isEdit = !isView;
    try {
      const response = await rentalService.getRentalDetails(rentalId);
      if (response.data) {
        console.log(response.data);

        state.stallRentalId = response.data.stallDetailId;
        state.rentalStatus = response.data.rentalStatus;
        // Map API response to form fields
        state.form = {
          stallNo: response.data.stallNo ?? null,
          ownerId: response.data.ownerId ?? null,
          contractStartDate: response.data.contractStartDate ?? null,
          contractEndDate: response.data.contractEndDate ?? null,
          busID: response.data.busID ?? null,
          busPlateNo: response.data.busPlateNo ?? '',
          busDateStart: response.data.busDateStart ?? null,
          capital: response.data.capital ?? '',
          lineOfBusiness: response.data.lineOfBusiness ?? null,
        }

        //load owner details
        if (state.form.ownerId) {
          await searchOwner(state.stallRentalId);
        } else {
          state.owner.details = null;
        }

        //load stall details
        if (state.form.stallNo) {
          await searchStall(state.stallRentalId);
        } else {
          state.stall.details = null;
        }
      }
    } catch (error) {
      console.log(error);
    }
    $loading.stop()
    state.openViewDialog = true;
  } 

  async function updateRental() {
    $loading.start()
      try {
          let params = state.form;
          let id = state.stallRentalId;

          const response = await rentalService.updateRental(params, id)
          if (response) {
              fetchRentals()
              $loading.stop()

              state.openViewDialog = false
              toast.success('Rental updated successfully')
          }
      } catch (error) {
        console.log(error)
        let errorMessages = []
          Object.entries(error.errors).forEach(([field, messages]) => {
            messages.forEach((message) => {
              errorMessages.push(`${field}: ${message}`)
            })
          })
          showError('', errorMessages.join('<br>'))
      }
  }

  function closedDialogView() {
    state.stallRentalId = null
    state.rentalStatus = null
    state.openViewDialog = false
  }
  //end of emit functions

  //cancel rental
  async function cancelRental() {
    const confirm = await showConfirm(
      'Are you sure you want to cancel this rental?'
    )

    if (!confirm) {
      return
    }

    $loading.start()
    try {
      let id = state.stallRentalId
      const response = await rentalService.cancelRental(id)
      if (response) {
        fetchRentals()
        $loading.stop()

        state.openViewDialog = false
        toast.success('Rental cancelled successfully')
      }
    } catch (error) {
      showError(error.message)
    }
    $loading.stop()
  }

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

  async function searchOwner(rentalId) {
    const ownerId = state.form.ownerId
    if (!ownerId) {
      state.owner.details = null
      state.form.ownerId = null
      return
    }

    try {
      const response = await stallOwnerService.getOwner(ownerId, rentalId)
      if (response && response.data) {
        state.owner.details = response.data
      }
    } catch (error) {
      showError(error.message)
      state.owner.details = null
      state.form.ownerId = null
    }
  }

  // async function searchStall(rentalId) {
  //   const stallNo = state.form.stallNo
  //   if (!stallNo) {
  //     state.stall.details = null
  //     state.form.stallNo = null
  //     return
  //   }

  //   try {
  //     const response = await stallService.getStall(stallNo, rentalId)
  //     if (response && response.data) {
  //       state.stall.details = response.data
  //     }
  //   } catch (error) {
  //     showError(error.message)
  //     state.stall.details = null
  //     state.form.stallNo = null
  //   }
  // }

  function loadParameters() {
    fetchTypes()
    fetchParameter('MARKETCODE', 'markets')
    fetchParameter('SECTIONCODE', 'sections')
    fetchParameter('STRUCTCODE', 'buildings')
    // fetchInfluences()
  }
  //end of parameter
   
</script>