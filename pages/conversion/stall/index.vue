<template>
  <Toaster richColors position="top-right" />
    <div class="min-h-screen sm:p-3">
        <div class="bg-white">
            <Loader v-if="$loading.state.isPageLoading" />
            <div class="py-3"></div>
            <div class="sm:flex sm:items-center sm:justify-end p-2">
              <FormButton type="submit" class="text-sm" @click="addStallDialog()">Create Stall</FormButton>
            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <!-- Left side: grouped selects -->
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-2 w-full sm:w-auto">
                <div class="w-full sm:w-44">
                  <FormSelect
                    v-model="state.user_data.marketcode"
                    @update:modelValue="fetchStalls"
                    :options="state.marketCodes"
                  />
                </div>
                <div class="w-full sm:w-64">
                  <FormSelect
                    v-model="state.user_data.sectionCode"
                    @update:modelValue="fetchStalls"
                    :options="state.sectionCodes"
                  />
                </div>
              </div>

              <!-- Right side: TableSearch -->
              <div class="w-full sm:w-auto">
                <TableSearchSimple @handleFilter="handleFilter" :placeholder="'Enter Stall ID'" />
              </div>
            </div>
            <TableStall :stalls="state.stalls" @viewStallClick="viewStall" />
            <Pagination v-if="state.stalls?.length > 0" :data="state.stalls" @previous="previous" @next="next" />
        </div>
    </div>

    <!-- Modal -->
     <!-- create -->
    <Modal :show="state.open">
      <div class="w-full max-w-4xl mx-auto bg-white px-4 py-5 sm:px-6 rounded-lg space-y-4">
        <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div class="ml-2 mb-2">
            <h3 class="text-lg font-semibold text-green-900">Create Stall</h3>
          </div>
        </div>

        <form
          @submit.prevent="addStall"
          autocomplete="off"
          class="p-4"
        >
          <div class="bg-green-50 shadow-lg rounded-lg p-4 mb-10 space-y-5">
            
            <!-- First row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-start">
                <FormLabel for="stall_type" label="Type" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.type" :options="state.parameter.types" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="market" label="Market" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.market" :options="state.parameter.markets" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="section" label="Section" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.section" :options="state.parameter.sections" @change="getSubSection($event)" />
                </div>
              </div>
            </div>

            <!-- Second row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-start">
                <FormLabel for="sub-section" label="Sub Section" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.sub_section" :options="state.parameter.sub_sections" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="building" label="Building" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.building" :options="state.parameter.buildings" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="cfsi" label="Local Influence" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.cfsi" :options="state.parameter.cfsi" />
                </div>
              </div>
            </div>

            <!-- Third row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <div class="sm:col-span-2 text-start">
                <FormLabel for="class" label="Class" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.class" :options="classOptions" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="id" label="ID" />
                <div class="mt-1">
                  <FormNumber name="id" v-model="state.form.stall_id" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="Extension" label="Extension" />
                <div class="mt-1">
                  <FormSelect v-model="state.form.extension" :options="extensions" />
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="area" label="Area" />
                <div class="mt-1">
                  <FormNumber name="area" v-model="state.form.area"/>
                </div>
              </div>
              <div class="text-start">
                <FormLabel for="area-ext" label="Area Extension" />
                <div class="mt-1">
                  <FormNumber name="area_extension" v-model="state.form.area_extension"/>
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
  import { useUserStore } from '@/store/user'
  import { useParameterStore } from '@/store/parameter'
  import { useMarketcodeStore } from '@/store/marketcode'
  import { parameterService } from '~/api/ParameterService'
  import { Toaster, toast } from 'vue-sonner'
  import 'vue-sonner/style.css'

  const { $capitalizeWords } = useNuxtApp()
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
    title: 'Conversion Stall List | eSMS'
  })

  //default form for easy reset
  const defaultForm = {
    type: null, 
    market: null,
    section: null,
    sub_section: null,
    building: null,
    cfsi: null,
    class: null,
    stall_id: null,
    extension: null,
    area: null,
    area_extension: null,
  }

  const state = reactive({
    form: { ...defaultForm },
    stallProfileId: null,
    user_data: {
        marketcode: userMarketcode,
        stall_type: 'regular',
        sectionCode: '01',
    },
    stalls: [],
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
      class: [],
      extension: [],
    }
  })

  onMounted(() => {
      fetchStalls()
  })

  //static data
  const classOptions = [
    { label: 'CLASS A', value: 'CLASS A' },
    { label: 'CLASS B', value: 'CLASS B' },
    { label: 'CLASS C', value: 'CLASS C' },
    { label: 'CLASS D', value: 'CLASS D' }
  ]
  const extensions = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
  ]
  //ed nof static data

  function getSubSection(selectedSection) {
    subSection(selectedSection);
  }

  function addStallDialog() {
    $loading.start()
    //load datas
    loadParameters()
    $loading.stop()
    Object.assign(state.form, defaultForm)
    //open modal
    state.open = true
  }
  function closedDialog() {
    state.open = false
  }

  function handleFilter(value) {
      currentPage = 1
      state.dataFilter = value
      fetchStalls()
  }

  async function previous() {
      currentPage--
      fetchStalls()
  }

  async function next() {
      currentPage++
      fetchStalls()
  }

  async function addStall() {
    $loading.start()
      try {
        // showLoading('Saving', '');
          let params = {
              area: state.form.area,
              area_extension: state.form.area_extension,
              building: state.form.building,
              cfsi: state.form.cfsi,
              class: state.form.class,
              extension: state.form.extension,
              market: state.form.market,
              section: state.form.section,
              stall_id: state.form.stall_id,
              sub_section: state.form.sub_section,
              type: state.form.type,
          }
          const response = await stallService.addData(params)
          if (response) {
              fetchStalls()
              toast.success('Stall saved successfully')
          }
        // closeLoading()
        state.open = false
        // clearForm()
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

  async function fetchStalls() {
      $loading.start()
      try {
          let params = {
              page: currentPage,
              marketcode: state.user_data.marketcode,
              type: state.user_data.stall_type,
              section: state.user_data.sectionCode,
              ...state.dataFilter
          }
          const response = await stallService.getStalls(params)
          if (response) {
              state.stalls = response.data
          }
      } catch (error) {
          console.log(error)
      }
      $loading.stop()
  }

  //emit functions
  async function viewStall(stallId, isView) { 
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

  async function updateStall() {
    $loading.start()
      try {
        // showLoading('Saving', '');
          let params = {
              area: state.form.area,
              area_extension: state.form.area_extension,
              building: state.form.building,
              cfsi: state.form.cfsi,
              class: state.form.class,
              extension: state.form.extension,
              market: state.form.market,
              section: state.form.section,
              stall_id: state.form.stall_id,
              sub_section: state.form.sub_section,
              type: state.form.type,
          }
          let id = state.stallProfileId;
          
          const response = await stallService.updateStall(params, id)
          if (response) {
              fetchStalls()
              $loading.stop()

              state.openViewDialog = false
              toast.success('Stall updated successfully')
          }
        // clearForm()
      } catch (error) {
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
    state.openViewDialog = false
  }
  //end of emit functions

  //parameter
  // function loadParameters() {
  //   fetchTypes()
  //   fetchMArkets()
  //   fetchSections()
  //   fetchBuildings()
  //   fetchInfluences()
  // }

  // async function fetchTypes() {
  //   try {
  //     let params = {
  //       fieldId: 'STALLTYPE'
  //     }
  //     const response = await parameterService.getParameter(params)
  //     if (response) {
  //         let options = response.data.map((item) => ({
  //             value: item.fieldDescription,
  //             label: item.fieldDescription
  //         }));
  //         state.parameter.types = options;
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  // async function fetchMArkets() {
  //   try {
  //     let params = {
  //       fieldId: 'MARKETCODE'
  //     }
  //     const response = await parameterService.getParameter(params)
  //     if (response) {
  //         let options = response.data.map((item) => ({
  //             value: item.fieldValue,
  //             label: item.fieldDescription
  //         }));
  //         state.parameter.markets = options;
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  // async function fetchSections() {
  //   try {
  //     let params = {
  //       fieldId: 'SECTIONCODE'
  //     }
  //     const response = await parameterService.getParameter(params)
  //     if (response) {
  //         let options = response.data.map((item) => ({
  //             value: item.fieldValue,
  //             label: item.fieldDescription
  //         }));
  //         state.parameter.sections = options;
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  // async function fetchBuildings() {
  //   try {
  //     let params = {
  //       fieldId: 'STRUCTCODE'
  //     }
  //     const response = await parameterService.getParameter(params)
  //     if (response) {
  //         let options = response.data.map((item) => ({
  //             value: item.fieldValue,
  //             label: item.fieldDescription
  //         }));
  //         state.parameter.buildings = options;
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  // //influence
  // async function fetchInfluences() {
  //   try {
  //     let params = {
  //       fieldId: 'CFSI'
  //     }
  //     const response = await parameterService.getParameter(params)
  //     if (response) {
  //         let options = response.data.map((item) => ({
  //             value: item.fieldValue,
  //             label: item.fieldDescription
  //         }));
  //         // Add default placeholder at the top
  //         // options.unshift({ value: '0', label: 'COMMON STALL' })  
  //         state.parameter.cfsi = options;
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  async function subSection(section) {
    try {
      let params = {
        fieldId: 'SERIESCODE',
        section_id: section
      }
      const response = await parameterService.getSubSection(params)
      if (response) {
        console.log(response)
          let options = response.data.map((item) => ({
              value: item.fieldValue,
              label: item.fieldDescription
          }));
          state.parameter.sub_sections = options;
      }
    } catch (error) {
      console.error(error)
    }
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

  async function fetchInfluences() {
    try {
      let params = {
        fieldId: 'CFSI'
      }
      const response = await parameterService.getParameter(params)
      if (response) {
          let options = response.data.map((item) => ({
              value: item.fieldDescription,
              label: item.fieldDescription
          }));
          state.parameter.cfsi = options;
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

  function loadParameters() {
    fetchTypes()
    fetchParameter('MARKETCODE', 'markets')
    fetchParameter('SECTIONCODE', 'sections')
    fetchParameter('STRUCTCODE', 'buildings')
    fetchInfluences()
  }
  //end of parameter
   
</script>