<template>
    <div class="mt-2 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    OP Ref ID
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Date
                                </th>
                                 <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="transaction in props.transactions?.data" :key="transaction.id">
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    {{ transaction.OPRefId }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    {{ transaction.opDate }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span
                                    :class="transaction.ORNum ? 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20' : 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20'"
                                    >
                                        {{ transaction.ORNum ? 'Paid' : 'Unpaid' }}
                                    </span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <button
                                    type="button"
                                    class="inline-flex items-center gap-x-1 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-green-500"
                                    @click="openOpModal(transaction)"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <Modal :show="state.open">
        <div class="w-full sm:w-1/2 bg-white px-4 py-5 sm:px-6 rounded-lg space-y-4">
            <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap w-full px-4 py-2">
                <h3 class="text-lg font-semibold text-green-900">
                    OP Details [{{ state.oprefId }}]
                </h3>

                <button
                    type="button"
                    class="inline-flex items-center gap-x-1 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-green-500"
                    @click="openPDF(state.oprefId)"
                >
                    View TOP PDF
                </button>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500">Name</p>
                <p class="text-base text-gray-800 mt-1">
                {{ awardee.full_name }}
                </p>
            </div>
            <!-- Address -->
            <div>
                <p class="text-sm font-medium text-gray-500">Address</p>
                <p class="text-base text-gray-800 mt-1">
                {{ awardee.stallRentalDet.stallProfile.stallDescription }}
                </p>
            </div>
            <table class="w-full mt-4 table-auto text-sm text-left text-gray-700">
                <thead class="bg-green-100 text-green-700 uppercase text-xs tracking-wider">
                <tr>
                    <th class="px-4 py-2 text-center">Date</th>
                    <th class="px-4 py-2 text-center">Amount</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-green-200">
                <template v-for="item in state.items" :key="id">
                    <!-- Only show if there's an extension rate -->
                    <tr class="hover:bg-green-50 transition">
                    <td class="px-4 py-2 text-center">
                        {{ item.purpose }}
                    </td>
                    <td class="px-4 py-2 text-center">
                        {{
                        new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2,
                        }).format(item.amountBasic)
                        }}
                    </td>
                    </tr>
                </template>
                <tr class="bg-green-50 font-semibold text-green-800">
                    <td colspan="1" class="px-4 py-3 text-right">Total:</td>
                    <td class="px-4 py-3 text-center">
                        {{
                        new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2,
                        }).format(totalAmount)
                        }}
                    </td>
                </tr>
                </tbody>
            </table>
            <!-- Wrap buttons in a flex container and align to right -->
            <div class="mt-4 flex justify-end gap-2">
                <FormButton
                type="button"
                @click="closedDialog"
                buttonStyle="white"
                class="px-3 py-1 text-sm"
                >
                Close
                </FormButton>
            </div>
        </div>
    </Modal>
</template>

<script setup>
import { opService } from '@/components/api/OpService.ts';

const { showError, showSuccess, showLoading, closeLoading } = useSweetLoading()
const config = useRuntimeConfig()

const state = reactive({
  open: false,
  profile: {},
  oprefId: {},
  items: [],
  totalAmountBasic: 0,
})

const totalAmount = computed(() => {
  return state.items.reduce((sum, item) => {
    return sum + (parseFloat(item.amountBasic) || 0)
  }, 0)
})

function openOpModal(transaction) {
  state.oprefId = transaction.OPRefId
  get_items(state.oprefId)
}

async function get_items(oprefid) {
    showLoading();
    try {
        let params = {
            oprefid: oprefid
        }
        const response = await opService.getItems(params)
        if (response) {
            state.items = response.data
            closeLoading()
            state.open = true
        }
    } catch (error) {
        console.log(error)
    }
}

function closedDialog() {
  state.open = false
  state.items = []
  state.totalAmountBasic = 0
}

function openPDF(oprefId) {
  if (!oprefId) return;
  console.log(props.awardee);

  const url = `${config.public.apiPublicStorage}/ops/${props.awardee.ownerId}/${oprefId}.pdf`;
  window.open(url, '_blank');
}

const props = defineProps({
    transactions: {
        type: Object,
        required: true
    },
    awardee: {
        type: Object,
        required: true
    }
})
</script>