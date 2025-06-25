<template>
    <div class="rounded-lg bg-white shadow">
        <ul role="list" class="divide-y divide-gray-100 px-5">
            <li v-for="caseProfile in props.caseProfiles" :key="caseProfile.uuid"
                class="flex items-center justify-between gap-x-6 py-5">
                <div class="flex min-w-0 gap-x-4">
                    <div class="min-w-0 flex-auto">
                        <p class="text-base font-bold text-violet-600">
                            Case #{{ caseProfile.case_profile_id }}
                        </p>
                        <p class="mt-1 truncate text-sm font-semibold leading-5 text-gray-900">
                            {{ caseProfile.caseCategory.category_name }}
                        </p>
                        <p v-if="caseProfile.abuseCategory"
                            class="mt-1 truncate text-sm font-semibold leading-5 text-gray-900">
                            {{ caseProfile.abuseCategory?.abuse_type }}
                        </p>
                        <p class="mt-1 truncate text-sm font-semibold leading-5 text-gray-900">
                            {{ moment(caseProfile.case_date).format('MMMM D, Y') }}
                        </p>
                    </div>
                </div>
                <button @click="getCaseProfile(caseProfile.uuid)"
                    class="rounded-full bg-white w-16 px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    View
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment'
const emit = defineEmits(['fetchCaseProfile'])

const props = defineProps({
    caseProfiles: {
        type: Object,
        required: true
    }
})

function getCaseProfile(value: any) {
    emit('fetchCaseProfile', value)
}
</script>