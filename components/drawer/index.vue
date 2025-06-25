<template>
    <TransitionRoot as="template" :show="props.openSideDrawer">
        <Dialog class="relative z-10" @close="close">
            <div class="fixed inset-0" />

            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <TransitionChild as="template"
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enter-from="translate-x-full" enter-to="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leave-from="translate-x-0" leave-to="translate-x-full">
                            <DialogPanel class="pointer-events-auto w-screen max-w-md">
                                <div class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                                    <div class="flex min-h-0 flex-1 flex-col overflow-y-scroll pt-6">
                                        <div class="bg-violet-50 mt-10 px-4 py-6 sm:px-6">
                                            <div class="flex items-center justify-between space-x-3">
                                                <div class="space-y-1">
                                                    <DialogTitle
                                                        class="text-base font-semibold leading-6 text-violet-900">
                                                        Case log #{{ props.caseLog?.case_log_number }}
                                                    </DialogTitle>
                                                </div>
                                                <div class="flex h-7 items-center">
                                                    <button type="button"
                                                        class="relative text-violet-400 hover:text-violet-500"
                                                        @click="close">
                                                        <span class="absolute -inset-2.5" />
                                                        <span class="sr-only">Close panel</span>
                                                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex item-center px-5 py-4">
                                            <dl class="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6">
                                                <div class="sm:col-span-1">
                                                    <dt class="text-sm font-medium text-violet-500">Assistance
                                                        Required</dt>
                                                    <dd class="mt-1 text-sm font-semibold text-gray-900">
                                                        {{ props.caseLog?.service?.service_type }}
                                                    </dd>
                                                </div>
                                                <div class="sm:col-span-1">
                                                    <dt class="text-sm font-medium text-violet-500">Referred By</dt>
                                                    <dd class="mt-1 text-sm font-semibold text-gray-900">
                                                        {{ props.caseLog?.referredBy?.agency_name }}
                                                    </dd>
                                                </div>
                                                <div class="sm:col-span-1">
                                                    <dt class="text-sm font-medium text-violet-500">Referred To</dt>
                                                    <dd class="mt-1 text-sm font-semibold text-gray-900">
                                                        {{ props.caseLog?.referralAgency?.agency_name }}
                                                    </dd>
                                                </div>
                                                <div class="sm:col-span-1">
                                                    <dt class="text-sm font-medium text-violet-500">Status</dt>
                                                    <dd class="mt-1 text-sm font-semibold text-gray-900">
                                                        {{ props.caseLog?.assistance_log?.status }}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                        <div class="px-6 border-y py-2 flex justify-between items-center">
                                            <h2 id="notes-title" class="text-lg font-medium text-gray-900">
                                                Assistance History
                                            </h2>
                                            <div>
                                                <input ref="fileInput" type="file" multiple @change="handleFileChange"
                                                    class="hidden" />
                                                <FormButton @click="triggerFileInput">
                                                    <PaperClipIcon class="w-5 h-5 mr-2 text-white-400 rounded-full" />
                                                    <span class="text-sm text-white-400">Upload files</span>
                                                </FormButton>
                                            </div>
                                        </div>
                                        <div class="relative flex-1 overflow-y-auto flex-grow h-96">
                                            <slot />
                                        </div>
                                    </div>
                                    <div class="bg-violet-50 px-4 py-2 sm:px-6">
                                        <div class="flex space-x-3">
                                            <div class="flex items-star flex-shrink-0">
                                                <span
                                                    class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-500">
                                                    <span class="text-xl font-medium leading-none text-white">
                                                        {{ user?.firstname.charAt(0) }}{{ user?.lastname.charAt(0)
                                                        }}
                                                    </span>
                                                </span>
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <form @submit.prevent="addMessage">
                                                    <div>
                                                        <FormLabel for="comment" class="sr-only" label="Message" />
                                                        <FormTextArea :name="'message'"
                                                            v-model="state.logForm.message" />
                                                        <FormError
                                                            :error="v$?.logForm?.message?.$errors[0]?.$message.toString()" />
                                                        <FormError :error="props?.error?.errors?.message?.[0]" />
                                                    </div>
                                                    <div class="mt-3 flex items-center justify-between space-x-4">
                                                        <div>
                                                            <select id="status" name="status"
                                                                v-model="state.logForm.status"
                                                                class="py-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                <option value="" selected disabled>
                                                                    Select status
                                                                </option>
                                                                <optgroup label="Case Conference">
                                                                    <option value="Settled">Settled</option>
                                                                    <option value="Unsettled">Unsettled</option>
                                                                    <option value="Archive">Archive</option>
                                                                    <option value="Client no show">
                                                                        Client no show
                                                                    </option>
                                                                    <option value="Respondent no show">
                                                                        Respondent no show
                                                                    </option>
                                                                    <option value="Both Parties no show">
                                                                        Both Parties no show
                                                                    </option>
                                                                </optgroup>
                                                                <optgroup label="Other Cases">
                                                                    <option value="Complaint Prepared">
                                                                        Complaint Prepared
                                                                    </option>
                                                                    <option
                                                                        value="Complaint Filed at City Prosecutor's Office - Info Filed">
                                                                        Complaint Filed at City Prosecutor's Office -
                                                                        Info Filed
                                                                    </option>
                                                                    <option
                                                                        value="Complaint Filed at City Prosecutor's Office - Dismissed">
                                                                        Complaint Filed at City Prosecutor's Office
                                                                        - Dismissed
                                                                    </option>
                                                                    <option value="Case Filed at Court - Ongoing">
                                                                        Case Filed at Court - Ongoing
                                                                    </option>
                                                                    <option value="Case Filed at Court - Archived">
                                                                        Case Filed at Court - Archived
                                                                    </option>
                                                                    <option value="Case Filed at Court - Dismissed">
                                                                        Case Filed at Court - Dismissed</option>
                                                                    <option value="Terminated">
                                                                        Terminated
                                                                    </option>
                                                                </optgroup>
                                                                <optgroup label="Social Welfare Documents">
                                                                    <option value="Certificate of Indigency">
                                                                        Certificate of Indigency
                                                                    </option>
                                                                    <option value="Certificate of Eligibility">
                                                                        Certificate of Eligibility
                                                                    </option>
                                                                    <option value="Social Case Study Report">
                                                                        Social Case Study Report
                                                                    </option>
                                                                    <option value="Brief Case Study Report">
                                                                        Brief Case Study Report
                                                                    </option>
                                                                </optgroup>
                                                            </select>
                                                        </div>
                                                        <div class="flex justify-end">
                                                            <FormButton :type="'submit'">
                                                                Submit
                                                            </FormButton>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, PaperClipIcon } from '@heroicons/vue/24/outline'
import { assistanceLogAttachmentService } from '@/components/api/AssistanceLogAttachmentService';
import { useVuelidate } from "@vuelidate/core"
import { required, helpers } from '@vuelidate/validators'

const userStore = useUserStore()
const user = userStore.getUser

const fileInput = ref<HTMLInputElement | null>(null)

const emit = defineEmits(['closeSideDrawer', 'isPageLoading', 'updateLogs', 'saveAssistanceMessage'])

const props = defineProps({
    openSideDrawer: {
        type: Boolean,
        required: true
    },
    caseLog: {
        type: Object,
        required: true
    },
})

const state = reactive({
    logForm: {
        message: null,
        status: ''
    },
    error: null
})

function close() {
    emit('closeSideDrawer', false)
}

const rules = computed(() => {
    return {
        logForm: {
            message: {
                required: helpers.withMessage('This field is required.', required),
            },
        },
    }
})

const v$ = useVuelidate(rules, state)

function addMessage() {
    v$.value.$validate()
    if (!v$.value.$error) {
        try {
            emit('saveAssistanceMessage', state.logForm)
        } catch (error) {
            console.log(error)
        } finally {
            state.logForm.message = null
            state.logForm.status = ''
        }
    }
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileChange = (event: any) => {
    uploadFiles(event.target.files)
}

const uploadFiles = async (files: any) => {
    emit('isPageLoading', true)
    try {
        const params = new FormData()
        params.append('case_log_uuid', props.caseLog.uuid)
        for (let i = 0; i < files.length; i++) {
            params.append('file[]', files[i])
        }
        const response = await assistanceLogAttachmentService.createAttachment(params)
        if (response.data) {
            emit('updateLogs')
        }
    } catch (error: any) {
        console.log(error)
    }
    emit('isPageLoading', false)
}
</script>
