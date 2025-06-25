<template>
    <div class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
        <div class="px-4 py-3 sm:px-6 flex items-center justify-between">
            <div>
                <h2 id="applicant-information-title" class="text-lg font-medium leading-6 text-gray-900">
                    Respondent Information
                </h2>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Personal details of the respondent.</p>
            </div>
            <div v-if="props.respondent">
                <FormButton
                    @click="navigateTo(`/clients/respondents/create/case-profile/${props.uuid}?ruuid=${props.respondent?.uuid}`)">
                    <DocumentPlusIcon class="w-5 mr-2" />
                    New Case
                </FormButton>
            </div>
        </div>
        <div class="px-4 py-5 sm:p-6">
            <div v-if="!props.respondent" class="h-fit">
                <div class="flex justify-center">
                    <ArchiveBoxXMarkIcon class="h-36 w-36 text-gray-200" />
                </div>
                <div class="text-center">
                    <p class="text-gray-500">Select a respondent to view information</p>
                </div>
            </div>
            <div v-else>
                <div class="px-4 py-5 sm:px-6">
                    <dl class="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Full name</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900">
                                {{ props.respondent?.firstname }}
                                {{ props.respondent?.middlename }}
                                {{ props.respondent?.lastname }}
                            </dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Contact number</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900">
                                {{ props.respondent?.contact_no ?? 'N/A' }}
                            </dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Date of birth</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900">
                                {{ moment(props.respondent?.birthdate).format('MMMM D, Y') ?? 'N/A' }}
                            </dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Age</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900">
                                {{ props.respondent?.age ?? 'N/A' }}
                            </dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Sex</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900">
                                {{ props.respondent?.sex ?? 'N/A' }}
                            </dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Civil status</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900">
                                {{ props.respondent?.civil_status ?? 'N/A' }}
                            </dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Educational attainment</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900">
                                {{ props.respondent?.educ_attain ?? 'N/A' }}
                            </dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Occupation</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900" v-if="props.respondent?.occupation">
                                {{ props.respondent?.occupation?.name ?? 'N/A' }}
                            </dd>
                            <dd class="mt-1 text-base font-semibold text-gray-900" v-else>
                                {{ props.respondent?.suboccupation?.name ?? 'N/A' }}
                            </dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Barangay</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900">
                                {{ props.respondent?.barangay?.brgy_name }}
                            </dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Home address</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900">
                                {{ props.respondent?.home_address }}
                            </dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-violet-500">Work address</dt>
                            <dd class="mt-1 text-base font-semibold text-gray-900">
                                {{ props.respondent?.work_address }}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArchiveBoxXMarkIcon, DocumentPlusIcon } from '@heroicons/vue/24/outline'
import moment from 'moment';

const props = defineProps({
    respondent: {
        type: Object,
        required: true
    },
    uuid: {
        type: String,
        required: true
    }
})
</script>