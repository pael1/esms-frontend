<template>
  <div class="dark:text-white dark:bg-black px-4 sm:px-6 lg:px-8">
    <!-- Profile Section -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0 mb-6">
      <embed
        :src="pdfSrc"
        type="application/pdf"
        class="w-full sm:w-32 h-32 rounded-lg border-4 border-green-500 object-contain"
      />

      <div class="text-center sm:text-left w-full">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
          {{ profile?.full_name }}
        </h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-white">{{ profile?.address }}</p>
        <p class="text-sm sm:text-base text-gray-600 dark:text-white">{{ profile?.contactnumber }}</p>
      </div>
    </div>

    <!-- Heading & Buttons -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
        Awardee Information
      </h2>
      <div class="flex flex-wrap gap-2 sm:ml-auto">
        <button
          type="button"
          class="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          @click="openDialog(true)"
        >
          Generate TOP (Current)
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          @click="openDialog(false)"
        >
          Generate TOP (Arrears)
        </button>
      </div>
    </div>

    <!-- Modal -->
    <Modal :show="state.open">
      <div class="w-full max-w-2xl mx-auto bg-white px-4 py-5 sm:px-6 rounded-lg space-y-4">
        <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div class="ml-2 mb-2">
            <h3 class="text-lg font-semibold text-green-900">OP Details</h3>
          </div>
        </div>

        <div>
          <p class="text-sm font-medium text-gray-500">Name</p>
          <p class="text-base text-gray-800 mt-1">
            {{ profile.full_name || '—' }}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-gray-500">Address</p>
          <p class="text-base text-gray-800 mt-1">
            {{ profile.stallRentalDet.stallProfile.stallDescription || '—' }}
          </p>
        </div>

        <form @submit.prevent="Generate" autocomplete="off">
          <FormLabel for="select_months" label="Month/s" />
          <FormMultiSelect :options="state.options" v-model="state.ledgerIdSelected" />
          <FormError :error="v$?.ledgerIdSelected?.$errors[0]?.$message.toString()" />
          <FormError :error="state.error?.errors?.ledgerIdSelected?.[0]" />

          <!-- Table of selected options -->
          <div class="overflow-x-auto">
            <table class="w-full mt-4 table-auto text-sm text-left text-gray-700">
              <thead class="bg-green-100 text-green-700 uppercase text-xs tracking-wider">
                <tr>
                  <th class="px-4 py-2 text-center">Date</th>
                  <th class="px-4 py-2 text-center">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-green-200">
                <template v-for="(id, index) in state.ledgerIdSelected" :key="id">
                  <tr
                    v-if="getOption(id)?.extensionRate > 0"
                    class="hover:bg-green-50 transition text-gray-500 text-sm"
                  >
                    <td class="px-4 py-2 text-center">Extension</td>
                    <td class="px-4 py-2 text-center">
                      {{
                        new Intl.NumberFormat('en-PH', {
                          style: 'currency',
                          currency: 'PHP',
                          minimumFractionDigits: 2,
                        }).format(getOption(id)?.extensionRate)
                      }}
                    </td>
                  </tr>
                  <tr class="hover:bg-green-50 transition">
                    <td class="px-4 py-2 text-center">
                      {{ getOption(id)?.label }}
                    </td>
                    <td class="px-4 py-2 text-center">
                      {{
                        new Intl.NumberFormat('en-PH', {
                          style: 'currency',
                          currency: 'PHP',
                          minimumFractionDigits: 2,
                        }).format(getOption(id)?.amountBasic || 0)
                      }}
                    </td>
                  </tr>
                </template>
                <tr class="bg-green-50 font-semibold text-green-800">
                  <td class="px-4 py-3 text-right">Total:</td>
                  <td class="px-4 py-3 text-center">
                    {{
                      new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP',
                        minimumFractionDigits: 2,
                      }).format(totalAmountBasic)
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex flex-wrap justify-end gap-2">
            <FormButton
              type="button"
              @click="closedDialog"
              buttonStyle="white"
              class="px-3 py-1 text-sm"
            >
              Cancel
            </FormButton>

            <FormButton type="submit" class="px-3 py-1 text-sm">Generate</FormButton>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>


<script setup>

import { awardeeService } from '@/components/api/AwardeeService';
import { useVuelidate } from "@vuelidate/core"
import { required, helpers } from '@vuelidate/validators'
import { defineProps } from 'vue';
import { useUserStore } from '@/store/user'
import { computed } from 'vue'

const { showError, showSuccess, showLoading, closeLoading } = useSweetLoading()

const userStore = useUserStore()
const user = userStore.getUser

const router = useRouter();
const id = router?.currentRoute?.value?.params?.id;

const state = reactive({
    open: false,
    options: [],
    ledgerIdSelected: [],

})

const emit = defineEmits(['newOPGenerated']);

const props = defineProps({
    profile: {
        type: Object,
        required: true
    },
    options: {
        type: Object,
        required: true
    }
})

onMounted(() => {
});

const getSelectedLedgerObjects = () => {
  return state.options.filter(opt => state.ledgerIdSelected.includes(opt.value))
}

function getDaysFromMonth(monthDate) {
  // Convert "June 2022" to a date
  const date = new Date(monthDate + ' 1') // creates date like: June 1, 2022
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // month is 0-based in JS

  return new Date(year, month, 0).getDate()
}

const daysInEach = computed(() =>
  selectedOptions.value.map(opt => ({
    days: getDaysFromMonth(opt.label)
  }))
)

//get the base API files
const config = useRuntimeConfig()
const pdfSrc = computed(() => {
  return `${config.public.apiPublicStorage}/profile_pic/${props.profile?.ownerId}/${props.profile?.attachIdPhoto}`
})

const getOption = (id) => {
  return state.options.find(opt => opt.value === id);
};

const totalAmountBasic = computed(() => {
  return state.ledgerIdSelected.reduce((sum, id) => {
    const match = state.options.find(opt => opt.value === id);

    const amountBasic = parseFloat(match?.amountBasic) || 0;
    const extensionRate = parseFloat(match?.extensionRate) || 0;

    return sum + amountBasic + extensionRate;
  }, 0);
});


function openDialog(isCurrent) {
    state.open = true
    if(isCurrent){
      fetch_current()
    } else {
      // showError("", "This feature is not yet ready")
      fetch_arrears()
      // closedDialog()
    }
}
function closedDialog() {
    state.open = false
    state.ledgerIdSelected = []
}

const rules = computed(() => {
    return {
        ledgerIdSelected: {
            required: helpers.withMessage('This field is required.', required),
        },
    }
})

const v$ = useVuelidate(rules, state)

async function Generate() {
    v$.value.$validate()
    if (!v$.value.$error) {
      const selectedObjects = getSelectedLedgerObjects()
      try {
        showLoading('Generating', '');
          let params = {
            name: props.profile.full_name,
            stallNo: props.profile.stallRentalDet.stallNo,
            ownerId: props.profile.ownerId,
            extension: props.profile.stallRentalDet.stallProfileViews.Total_extensionRate,
            stallprofile: props.profile.stallRentalDet.stallProfile,
            items: JSON.stringify(selectedObjects),
            postBy: user?.UserFirstName + ' ' +user?.UserLastName,
          };
          const response = await awardeeService.generateCurrentOP(params);

          if (response) {
            const blobContent = new Blob([response], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blobContent);
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.onload = () => {
              iframe.contentWindow.print();
              iframe.onload = () => {
                URL.revokeObjectURL(blobUrl);
                document.body.removeChild(iframe);
              };
            };
          }
          closeLoading()
          emit('newOPGenerated', true)
          closedDialog()
      } catch (error) {
          showError('', error.message)
      }
    }
}

async function fetch_arrears() {
  try {
      let params = {
          ownerId: id,
      }
    const response = await awardeeService.getAwardeeProfileArrears(params)

    if (response.data) {
      //NOTE::: NO NEED NA NAKO ANG EXTENSION KAY COMPUTED NA SIYA SA AMOUNTBASIC
      const givenMonth = parseInt(response.data.month) // e.g., 6 for June
      const givenYear = parseInt(response.data.year)   // e.g., 2025

      // Ensure month is 0-based for JS Date (Jan = 0)
      const jsMonth = givenMonth - 1

      // Get number of days in the given month
      const daysInMonth = new Date(givenYear, givenMonth, 0).getDate()
      const extensionRatePerDay = props.profile.stallRentalDet.stallProfileViews.Total_extensionRate
      const extensionRate = daysInMonth * extensionRatePerDay

      let options = response.data.map((item) => ({
        value: item.stallOwnerAccountId,
        label: item.date,
        amountBasic: item.amountBasic,
        extensionRate: extensionRate
      }));

      state.options = options
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetch_current() {
  const today = new Date()
  const currentMonth = today.getMonth() // 0 = Jan, 1 = Feb, ..., 11 = Dec
  const currentYear = today.getFullYear()

  // If today's day < 20, use previous month
  const targetDate = today.getDate() >= 21
    ? new Date(currentYear, currentMonth + 1) // Next month
    : new Date(currentYear, currentMonth)

  const currentMonthYear = targetDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  })
  
  // Convert 'June 2025' into a Date object for the 1st of the month
  const date = new Date(currentMonthYear + ' 1') // June 1, 2025

  const year = date.getFullYear()
  const month = date.getMonth() + 1 // JS months are 0-based

  // Get total days in the month
  const daysInMonth = new Date(year, month, 0).getDate()
  const ratePerDay = props.profile.stallRentalDet.stallProfileViews.RatePerDay
  const ratePerMonth = parseFloat((daysInMonth * ratePerDay).toFixed(2))
  const extensionRatePerDay = props.profile.stallRentalDet.stallProfileViews.Total_extensionRate
  const extensionRate = daysInMonth * extensionRatePerDay
  
  state.options = [
    { 
      value: "current",
      label: currentMonthYear,
      amountBasic: ratePerMonth,
      extensionRate: extensionRate
    }
  ]
}
</script>