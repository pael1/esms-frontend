<template>
    <div class="min-h-screen sm:p-3">
      <Toaster richColors position="top-right" />
      <div class="bg-white">
          <Loader v-if="$loading.state.isPageLoading" />
          <div class="py-3"></div>
          <div class="sm:flex sm:items-center sm:justify-end p-2">
            <FormButton
              buttonStyle="green"
              size="md"
              class="flex items-center gap-2"
              @click="addRentalDialog()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Rental</span>
            </FormButton>

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

      <!-- Modal -->
      <!-- create -->
      <Modal :show="state.open">
        <div class="w-full max-w-4xl mx-auto bg-gray-100 px-4 py-5 sm:px-6 rounded-lg space-y-4">
          <Loader v-if="$loading.state.isPageLoading" />

          <!-- Header -->
          <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div class="ml-2 mb-2">
              <h3 class="text-lg font-semibold text-green-900">Create Rental</h3>
            </div>
          </div>

          <!-- FORM -->
          <form @submit.prevent="addRental" autocomplete="off" class="p-4 space-y-8">
            <!-- =======================
                  Section 1: Owner & Stall Details
            ========================== -->
            <div class="bg-white shadow-md rounded-lg p-4 space-y-4">
              <h4 class="text-md font-semibold text-green-800 border-b border-green-200 pb-2">
                Stall Owner & Stall Details
              </h4>

              <!-- Owner -->
              <div class="flex flex-wrap gap-5">
                <div class="w-full md:flex-1 md:min-w-[400px]">
                  <FormLabel for="owner-name" label="Owner Name" required/>
                  <div class="mt-1">
                    <FormSelectSearch v-model="state.owner.selected" class="w-full" :class="[
                      'rounded-md transition-all',
                      state.errors.ownerId
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]" @change="clearError('ownerId')" />
                    <p v-if="state.errors.ownerId" class="text-sm text-red-500 mt-1">
                      {{ state.errors.ownerId[0] }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Stall Details -->
              <div class="flex flex-wrap gap-2">
                <div class="flex-1 min-w-[150px]">
                  <FormLabel for="stall_type" label="Type" required/>
                  <FormSelect v-model="state.stall.stallType" :options="state.parameter.types" />
                </div>

                <div class="flex-1 min-w-[150px]">
                  <FormLabel for="market" label="Market" required/>
                  <FormSelect
                    v-model="state.stall.marketCode"
                    @update:modelValue="fetchStall"
                    :options="state.parameter.markets"
                  />
                </div>

                <div class="flex-[2] min-w-[200px]">
                  <FormLabel for="section" label="Section" required/>
                  <FormSelect
                    v-model="state.stall.sectionCode"
                    @update:modelValue="fetchStall"
                    :options="state.stall_options.sections"
                  />
                </div>

                <div class="flex-1 min-w-[150px]">
                  <FormLabel for="stall_no" label="Stall No" required/>
                  <FormSelect
                    v-model="state.stall.stallNo"
                    @update:modelValue="fetchStall"
                    :options="state.stall_options.stallNos" :class="[
                      'rounded-md transition-all',
                      state.errors.stallNo
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]" @change="clearError('stallNo')"
                  />
                  <p v-if="state.errors.stallNo" class="text-sm text-red-500 mt-1">
                    {{ state.errors.stallNo[0] }}
                  </p>
                </div>
              </div>
            </div>

            <!-- =======================
                  Section 2: Contract & Business Details
            ========================== -->
            <div class="bg-white shadow-sm rounded-lg p-4 space-y-4">
              <h4 class="text-md font-semibold text-green-800 border-b border-green-200 pb-2">
                Contract & Business Details
              </h4>

              <!-- Contract Dates -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <FormLabel for="contract-start-date" label="Contract Start Date" />
                  <FormDate name="contract_start_date" v-model="state.form.contractStartDate" />
                </div>

                <div>
                  <FormLabel for="period-of-contract" label="Period of Contract" />
                  <FormDate name="period_of_contract" v-model="state.form.contractEndDate" />
                </div>

                <div>
                  <FormLabel for="business-id" label="Business ID" />
                  <FormText name="business_id" v-model="state.form.busID" />
                </div>
              </div>

              <!-- Business Details -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <FormLabel for="business-plate-no" label="Business Plate No" />
                  <FormText name="business_plate_no" v-model="state.form.busPlateNo" />
                </div>
                <div>
                  <FormLabel for="business-started" label="Business Started" />
                  <FormDate name="business_started" v-model="state.form.busDateStart" />
                </div>
                <div>
                  <FormLabel for="capital" label="Capital" />
                  <FormText name="capital" v-model="state.form.capital" />
                </div>
              </div>
              <div>
                <FormLabel for="line-of-business" label="Line of Business" />
                <FormTextArea
                  name="line_of_business"
                  v-model="state.form.lineOfBusiness"
                  class="w-full"
                />
              </div>
              <!-- File Upload Form -->
              <div class="grid grid-cols-12 gap-3 items-center">
                <!-- File Input (3 cols) -->
                <div class="col-span-6 md:col-span-10">
                  <input
                    id="file-upload"
                    type="file"
                    class="block w-full text-sm text-gray-700 border rounded-lg cursor-pointer focus:ring focus:ring-green-300"
                    @change="onFileUploadChange"
                  />
                </div>
              </div>
              <!-- File Preview -->
              <div v-if="state.filePreview" class="mt-3">
                <!-- Image Preview -->
                <img 
                  v-if="state.form.selectedFile.type.startsWith('image/')" 
                  :src="state.filePreview" 
                  class="w-32 h-auto border rounded shadow"
                />

                <!-- PDF Preview -->
                <iframe 
                  v-else-if="state.form.selectedFile.type === 'application/pdf'" 
                  :src="state.filePreview"
                  class="w-full h-64 border rounded"
                ></iframe>

                <!-- Other File Types -->
                <div v-else class="text-sm text-gray-600">
                  File ready to attach: {{ state.form.selectedFile.name }}
                </div>
              </div>
            </div>

            <!-- =======================
                  Buttons
            ========================== -->
            <div class="flex flex-wrap justify-end gap-2 border-t border-green-100 pt-4">
              <FormButton
                type="button"
                @click="closedDialog"
                buttonStyle="white"
                class="px-3 py-1 text-sm"
              >
                Cancel
              </FormButton>
              <FormButton type="submit" class="px-3 py-1 text-sm">
                Save
              </FormButton>
            </div>
          </form>
        </div>
      </Modal>

      <!-- Update / View Rental Modal -->
      <Modal :show="state.openViewDialog">
        <div class="w-full max-w-4xl mx-auto bg-gray-100 px-4 py-5 sm:px-6 rounded-lg space-y-4">
          <Loader v-if="$loading.state.isPageLoading" />

          <!-- Header -->
          <div
            class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap px-4 py-2"
          >
            <div class="ml-2 mb-2">
              <h3 class="text-lg font-semibold text-green-900">
                {{ state.isEdit ? 'Edit Rental' : 'View Rental' }}
              </h3>
            </div>
            <!-- disabled sa nako kay wala pa ginagamit -->
            <div class="mr-2 mb-2">
              <!-- <FormButton
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
              </p> -->
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="updateRental" autocomplete="off" class="p-4 space-y-8">
            <!-- =======================
                  Section 1: Stall Owner & Stall Details
            ========================== -->
            <div class="bg-white shadow-md rounded-lg p-5 space-y-5">
              <!-- Header -->
              <div class="flex items-center justify-between border-b border-green-200 pb-2">
                <h4 class="text-md font-semibold text-green-800">
                  Stall Owner & Stall Details
                </h4>

                <FormButton
                  type="button"
                  @click="editOwnerAndStall"
                  buttonStyle="yellow"
                  size="sm"
                  class="px-3 py-1 text-sm"
                >
                  {{ state.isEditOwnerStall ? 'Cancel' : 'Edit' }}
                </FormButton>
              </div>

              <!-- When in edit mode -->
              <div v-if="state.isEditOwnerStall" class="space-y-4">
                <div class="flex flex-wrap gap-5">
                  <div class="w-full md:flex-1 md:min-w-[400px]">
                    <FormLabel for="owner-name" label="Owner Name" />
                    <div class="mt-1">
                      <FormSelectSearch
                        v-model="state.owner.selected"
                        class="w-full"
                        :disabled="!state.isEdit"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap gap-3">
                  <div class="flex-1 min-w-[150px]">
                    <FormLabel for="stall_type" label="Type" />
                    <FormSelect
                      v-model="state.stall.stallType"
                      :options="state.parameter.types"
                      :disabled="!state.isEdit"
                    />
                  </div>

                  <div class="flex-1 min-w-[150px]">
                    <FormLabel for="market" label="Market" />
                    <FormSelect
                      v-model="state.stall.marketCode"
                      @update:modelValue="fetchStall"
                      :options="state.parameter.markets"
                      :disabled="!state.isEdit"
                    />
                  </div>

                  <div class="flex-[2] min-w-[200px]">
                    <FormLabel for="section" label="Section" />
                    <FormSelect
                      v-model="state.stall.sectionCode"
                      @update:modelValue="fetchStall"
                      :options="state.stall_options.sections"
                      :disabled="!state.isEdit"
                    />
                  </div>

                  <div class="flex-1 min-w-[150px]">
                    <FormLabel for="stall_no" label="Stall No" />
                    <FormSelect
                      v-model="state.stall.stallNo"
                      @update:modelValue="fetchStall"
                      :options="state.stall_options.stallNos"
                      :disabled="!state.isEdit"
                    />
                  </div>
                </div>
              </div>

              <!-- When in view mode -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 text-md text-gray-700">
                <div class="bg-white p-3 rounded-md border border-green-100 shadow-sm">
                  <h5 class="text-green-700 font-medium mb-2">Stall Owner</h5>
                  <p><span class="font-semibold">Name:</span> {{ state.owner.details.stallOwner?.full_name || '—' }}</p>
                  <p><span class="font-semibold">Contact Number:</span> {{ state.owner.details.stallOwner?.contactnumber || '—' }}</p>
                  <p><span class="font-semibold">Address:</span> {{ state.owner.details.stallOwner?.address || '—' }}</p>
                </div>

                <div class="bg-white p-3 rounded-md border border-green-100 shadow-sm">
                  <h5 class="text-green-700 font-medium mb-2">Stall Details</h5>
                  <p><span class="font-semibold">Market:</span> {{ state.owner.details.stallProfile?.stallDescription || '—' }}</p>
                  <p><span class="font-semibold">Rate Per Day:</span> {{ $formatPeso(state.owner.details.stallProfile?.TotalRatePerDay || '—') }}</p>
                  <p><span class="font-semibold">Estimated Rate Per Month:</span> {{ $formatPeso(state.owner.details.stallProfile?.TotalRatePerDay * 30 || '—') }}</p>
                </div>
              </div>
            </div>

            <!-- =======================
                  Section 2: Contract & Business Details
            ========================== -->
            <div class="bg-white shadow-sm rounded-lg p-4 space-y-4">
              <h4 class="text-md font-semibold text-green-800 border-b border-green-200 pb-2">
                Contract & Business Details
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <FormLabel for="contract-start-date" label="Contract Start Date" />
                  <FormDate
                    name="contract_start_date"
                    v-model="state.form.contractStartDate"
                    :disabled="!state.isEdit"
                  />
                </div>

                <div>
                  <FormLabel for="period-of-contract" label="Period of Contract" />
                  <FormDate
                    name="period_of_contract"
                    v-model="state.form.contractEndDate"
                    :disabled="!state.isEdit"
                  />
                </div>

                <div>
                  <FormLabel for="business-id" label="Business ID" />
                  <FormText
                    name="business_id"
                    v-model="state.form.busID"
                    :disabled="!state.isEdit"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <FormLabel for="business-plate-no" label="Business Plate No" />
                  <FormText
                    name="business_plate_no"
                    v-model="state.form.busPlateNo"
                    :disabled="!state.isEdit"
                  />
                </div>
                <div>
                  <FormLabel for="business-started" label="Business Started" />
                  <FormDate
                    name="business_started"
                    v-model="state.form.busDateStart"
                    :disabled="!state.isEdit"
                  />
                </div>
                <div>
                  <FormLabel for="capital" label="Capital" />
                  <FormText
                    name="capital"
                    v-model="state.form.capital"
                    :disabled="!state.isEdit"
                  />
                </div>
              </div>

              <div>
                <FormLabel for="line-of-business" label="Line of Business" />
                <FormTextArea
                  name="line_of_business"
                  v-model="state.form.lineOfBusiness"
                  class="w-full"
                  :disabled="!state.isEdit"
                />
              </div>
            </div>

            <!-- =======================
                  Footer Buttons
            ========================== -->
            <div class="flex flex-wrap justify-end gap-2 border-t border-green-100 pt-4">
              <FormButton
                type="button"
                @click="closedDialogView"
                buttonStyle="white"
                class="px-3 py-1 text-sm"
              >
                Close
              </FormButton>

              <FormButton
                v-if="state.isEdit"
                type="submit"
                class="px-3 py-1 text-sm"
              >
                Update
              </FormButton>
            </div>
          </form>
        </div>
      </Modal>
    </div>
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
  if (user.office != '99' && user.office != '00') {
    marketCodes = marketCodes.filter((m) => m.value === user.office)
    userMarketcode = user.office
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
    selectedFile: null, 
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
    isEditOwnerStall: false,
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
    errors: [],
    filePreview: null
  })

  onMounted(() => {
      fetchRentals()
  })

  function getSubSection(selectedSection) {
    subSection(selectedSection);
  }

  function clearError(field) {
    if (state.errors[field]) {
      delete state.errors[field]
    }
  }

  function addRentalDialog() {
    loadParameters()
    Object.assign(state.form, defaultForm)
    state.owner.details = null
    state.stall.details = null
    state.owner.selected = null
    state.stall.marketCode = null
    state.stall.sectionCode = null
    state.stall.stallNo = null
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
              stallNoId: state.stall.stallNo,
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

              state.stall_options.stallNos = response.data.map((item) => ({
                value: item.stallNoId,
                label: item.stallNoId
              }))

              state.form.stallNo = response.data[0]?.stallNo || null
          }
      } catch (error) {
          console.log(error)
      }
      $loading.stop()
  }

  //get stall details
  // async function fetchStallNoId() {
  //     $loading.start()
  //     try {
  //         let params = {
  //             type: state.stall.stallType,
  //             marketcode: state.stall.marketCode,
  //             sectioncode: state.stall.sectionCode,
  //             name: state.stall.stallNo,
  //         }
  //         console.log(params)
  //         const response = await stallService.getStallNoIdSel(params)
  //         if (response) {
  //           console.log(response)

  //             //store stallnoid options
  //             state.stall_options.stallNos = response.data.map((item) => ({
  //               value: item.stallNoId,
  //               label: item.stallNoId
  //             }))
  //         }
  //     } catch (error) {
  //         console.log(error)
  //     }
  //     $loading.stop()
  // }

  async function addRental() {
    $loading.start()
    try {
      console.log('Submitting form:', state.form);
        let params = toFormData(state.form);
        for (let pair of params.entries()) {
  console.log(pair[0], pair[1]);
}
        // return;
        const response = await rentalService.addData(params)
        if (response) {
            fetchRentals()
            toast.success('Rental saved successfully')
        }
      state.open = false
    } catch (error) {
      if (error.errors) {
        state.errors = error.errors
      } else {
        toast.error('Creation failed', {
          description: error.message || 'Something went wrong.',
          duration: 8000, // stays until manually closed
        })
      }
    }
    $loading.stop()
  }

  function toFormData(obj) {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // If file
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    return formData;
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
              console.log("fetch rental: ", response);
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
        const rental = response.data;
        state.owner.details = rental;
        console.log('Rental Details:', state.owner.details);

        state.stallRentalId = rental.stallDetailId;
        state.rentalStatus = rental.rentalStatus;
        // Map API response to form fields
        state.form = {
          stallNo: rental.stallNo ?? null,
          ownerId: rental.ownerId ?? null,
          contractStartDate: rental.contractStartDate ?? null,
          contractEndDate: rental.contractEndDate ?? null,
          busID: rental.busID ?? null,
          busPlateNo: rental.busPlateNo ?? '',
          busDateStart: rental.busDateStart ?? null,
          capital: rental.capital ?? '',
          lineOfBusiness: rental.lineOfBusiness ?? null,
        }

        //stall owner name
        // state.owner.selected = {
        //   value: rental.stallOwner.ownerId,
        //   label: rental.stallOwner.full_name,
        // };

        console.log('Selected Owner:', state.owner.selected);

        // //load owner details
        // if (state.form.ownerId) {
        //   await searchOwner(state.stallRentalId);
        // } else {
        //   state.owner.details = null;
        // }

        // //load stall details
        // if (state.form.stallNo) {
        //   await searchStall(state.stallRentalId);
        // } else {
        //   state.stall.details = null;
        // }
      }
    } catch (error) {
      console.log(error);
    }
    loadParameters()
    $loading.stop()
    state.openViewDialog = true;
  } 

  //edit owner and stall details
  function editOwnerAndStall() {
    // Toggle edit mode
    state.isEditOwnerStall = !state.isEditOwnerStall

    if (state.isEditOwnerStall) {
      // When entering edit mode
      console.log('Editing Stall Owner & Stall Details...')
    } else {
      // When leaving edit mode (Cancel)
      console.log('Cancelled editing — reverting data')
    }
  }

  async function updateRental() {
    $loading.start()
      try {
          let params = state.form;
          let id = state.stallRentalId;

          const response = await rentalService.updateRental(params, id)
          if (response) {
              fetchRentals()

              state.openViewDialog = false
              toast.success('Rental updated successfully')
          }
      } catch (error) {
        // let errorMessages = []
        //   Object.entries(error.errors).forEach(([field, messages]) => {
        //     messages.forEach((message) => {
        //       errorMessages.push(`${field}: ${message}`)
        //     })
        //   })
        //   showError('', errorMessages.join('<br>'))
        if (error.errors) {
          state.errors = error.errors
        } else {
          console.error('Unexpected error:', error)
          toast.error('Something went wrong.')
        }
      }
      $loading.stop()
  }

  function closedDialogView() {
    state.stallRentalId = null
    state.rentalStatus = null
    state.openViewDialog = false
  }
  //end of emit functions

  //disabled sa nako kay wala pa ginagapagamit
  // //cancel rental
  // async function cancelRental() {
  //   const confirm = await showConfirm(
  //     'Are you sure you want to cancel this rental?'
  //   )

  //   if (!confirm) {
  //     return
  //   }

  //   $loading.start()
  //   try {
  //     let id = state.stallRentalId
  //     const response = await rentalService.cancelRental(id)
  //     if (response) {
  //       fetchRentals()
  //       $loading.stop()

  //       state.openViewDialog = false
  //       toast.success('Rental cancelled successfully')
  //     }
  //   } catch (error) {
  //     toast.error(error.message || 'Something went wrong.')
  //   }
  //   $loading.stop()
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

  // async function searchOwner(rentalId) {
  //   const ownerId = state.form.ownerId
  //   if (!ownerId) {
  //     state.owner.details = null
  //     state.form.ownerId = null
  //     return
  //   }

  //   try {
  //     const response = await stallOwnerService.getOwner(ownerId, rentalId)
  //     if (response && response.data) {
  //       state.owner.details = response.data
  //     }
  //   } catch (error) {
  //     showError(error.message)
  //     state.owner.details = null
  //     state.form.ownerId = null
  //   }
  // }

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

  const onFileUploadChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    state.form.selectedFile = file;

    // Preview when image or pdf
    state.filePreview = URL.createObjectURL(file)
  }

  const { $formatPeso } = useNuxtApp()
</script>