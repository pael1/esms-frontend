<template>
    <div>
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
                <dt>
                    <div class="absolute rounded-md bg-violet-500 p-3">
                        <component :is="UserIcon" class="h-10 w-10 text-white" aria-hidden="true" />
                    </div>
                    <p class="ml-20 truncate text-sm font-medium text-gray-500">Total complainants this year</p>
                </dt>
                <dd class="ml-20 flex items-baseline pb-6 sm:pb-7">
                    <p class="text-5xl font-semibold text-gray-900">{{ state.totalComplainants }}</p>
                </dd>
            </div>
            <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
                <dt>
                    <div class="absolute rounded-md bg-violet-500 p-3">
                        <component :is="UserGroupIcon" class="h-10 w-10 text-white" aria-hidden="true" />
                    </div>
                    <p class="ml-20 truncate text-sm font-medium text-gray-500">Total respondents this year</p>
                </dt>
                <dd class="ml-20 flex items-baseline pb-6 sm:pb-7">
                    <p class="text-5xl font-semibold text-gray-900">{{ state.totalRespondents }}</p>
                </dd>
            </div>
            <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
                <dt>
                    <div class="absolute rounded-md bg-violet-500 p-3">
                        <component :is="ScaleIcon" class="h-10 w-10 text-white" aria-hidden="true" />
                    </div>
                    <p class="ml-20 truncate text-sm font-medium text-gray-500">Total cases this year</p>
                </dt>
                <dd class="ml-20 flex items-baseline pb-6 sm:pb-7">
                    <p class="text-5xl font-semibold text-gray-900">{{ state.totalCases }}</p>
                </dd>
            </div>
        </dl>
    </div>
</template>

<script setup lang="ts">
import { UserIcon, UserGroupIcon, ScaleIcon } from '@heroicons/vue/24/outline'
import { dashboardService } from '@/components/api/DashboardService';

const emit = defineEmits(['isPageLoading'])

const state = reactive({
    totalComplainants: null,
    totalRespondents: null,
    totalCases: null,
})

onMounted(() => {
    fetchComplainantCount()
    fetchRespondentCount()
    fetchCaseCount()
});

async function fetchComplainantCount() {
    emit('isPageLoading', true)
    try {
        const response = await dashboardService.getComplainantCount();
        if (response.data) {
            state.totalComplainants = response.data
        }
    } catch (error) {
        console.error('Error fetching complainant count:', error);
    }
    emit('isPageLoading', false)
}

async function fetchRespondentCount() {
    emit('isPageLoading', true)
    try {
        const response = await dashboardService.getRespondentCount();
        if (response.data) {
            state.totalRespondents = response.data
        }
    } catch (error) {
        console.error('Error fetching respondent count:', error);
    }
    emit('isPageLoading', false)
}

async function fetchCaseCount() {
    emit('isPageLoading', true)
    try {
        const response = await dashboardService.getCaseCount();
        if (response.data) {
            state.totalCases = response.data
        }
    } catch (error) {
        console.error('Error fetching respondent count:', error);
    }
    emit('isPageLoading', false)
}
</script>