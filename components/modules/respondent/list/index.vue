<template>
    <div class="rounded-lg bg-white shadow">
        <ul role="list" class="divide-y divide-gray-100 px-5">
            <li v-for="respondent in props.respondents" :key="respondent.uuid"
                class="flex items-center justify-between gap-x-6 py-5">
                <div class="flex min-w-0 gap-x-4">
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm font-semibold text-gray-900">
                            {{ respondent.firstname }}
                            {{ respondent.middlename }}
                            {{ respondent.lastname }}
                        </p>
                        <p class="mt-1 truncate text-xs leading-5 text-gray-500">
                            {{ respondent.civil_status }}
                        </p>
                    </div>
                </div>
                <Menu :clientUuid="props.uuid" :respondentUuid="respondent.uuid"
                    @showRespondent="getRespondent(respondent.uuid)" />
                <!-- <button @click="getRespondent(respondent.uuid)"
                    class="rounded-full bg-white w-16 px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    View
                </button> -->
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['fetchRespondent'])

const props = defineProps({
    respondents: {
        type: Object,
        required: true
    },
    uuid: {
        type: String,
        required: true
    }
})

function getRespondent(value: any) {
    emit('fetchRespondent', value)
}
</script>