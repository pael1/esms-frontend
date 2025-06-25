<template>
    <div class="divide-y divide-gray-200 py-2 overflow-hidden rounded-lg bg-white shadow">
        <div class="px-4 py-3 sm:px-6 flex items-center justify-between">
            <div>
                <h2 id="applicant-information-title" class="text-lg font-medium leading-6 text-gray-900">
                    Case Information
                </h2>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Complete details of the case. Case logs cannot be viewed
                    on mobile devices for security purposes.</p>
            </div>
            <div v-if="props.caseProfile" class="hidden sm:block">
                <FormButton @click="open">
                    <FolderOpenIcon class="w-5 mr-2" />
                    View Case Logs
                </FormButton>
            </div>
        </div>
        <div class="p-4 sm:p-6">
            <div v-if="!props.caseProfile" class="h-fit">
                <div class="flex justify-center">
                    <ArchiveBoxXMarkIcon class="h-36 w-36 text-gray-200" />
                </div>
                <div class="text-center">
                    <p class="text-gray-500">Select a case to view information</p>
                </div>
            </div>
            <div v-else class="px-4 sm:px-6">
                <dl class="grid grid-cols-1 gap-y-4 sm:grid-cols-3">
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-violet-500">Case Number</dt>
                        <dd class="mt-1 text-base font-semibold text-gray-900">
                            {{ props.caseProfile?.case_profile_id }}
                        </dd>
                    </div>
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-violet-500">Case Category</dt>
                        <dd class="mt-1 text-base font-semibold text-gray-900">
                            {{ props.caseProfile?.caseCategory?.category_name }}
                        </dd>
                    </div>
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-violet-500">Abuse Category</dt>
                        <dd class="mt-1 text-base font-semibold text-gray-900">
                            {{ props.caseProfile?.abuseCategory?.abuse_type ?? 'N/A' }}
                        </dd>
                    </div>
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-violet-500">Abuse Type</dt>
                        <dd class="mt-1 text-base font-semibold text-gray-900">
                            {{ props.caseProfile?.abuseSubcategory?.type ?? 'N/A' }}
                        </dd>
                    </div>
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-violet-500">Respondent</dt>
                        <dd class="mt-1 text-base font-semibold text-gray-900">
                            {{ props.caseProfile?.respondent?.firstname + ' ' +
                                props.caseProfile?.respondent?.middlename + ' ' +
                                props.caseProfile?.respondent?.lastname }}
                        </dd>
                    </div>
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-violet-500">Received By</dt>
                        <dd class="mt-1 text-base font-semibold text-gray-900">
                            {{ props.caseProfile?.receivedBy?.firstname + ' ' +
                                props.caseProfile?.receivedBy?.lastname }}
                        </dd>
                    </div>
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-violet-500">Relationship to complainant</dt>
                        <dd class="mt-1 text-base font-semibold text-gray-900">
                            {{ props.caseProfile?.relationship?.relationship_type ?? 'N/A' }}
                        </dd>
                    </div>
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-violet-500">Case Date</dt>
                        <dd class="mt-1 text-base font-semibold text-gray-900">
                            {{ props.caseProfile?.case_date ?? 'N/A' }}
                        </dd>
                    </div>
                    <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-violet-500">Envelop number</dt>
                        <dd class="mt-1 text-base font-semibold text-gray-900">
                            {{ props.caseProfile?.envelope_number ?? 'N/A' }}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderOpenIcon } from '@heroicons/vue/20/solid'
import { ArchiveBoxXMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['openDrawer'])

const props = defineProps({
    caseProfile: {
        type: Object,
        required: true
    }
})

function open() {
    emit('openDrawer', true)
}
</script>