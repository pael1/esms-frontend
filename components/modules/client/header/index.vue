<template>
    <header class="bg-violet-50">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 sm:flex sm:items-center sm:justify-between">
            <div class="min-w-0 flex-1">
                <h1 class="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    {{ props.client?.firstname }} {{ props.client?.middlename }} {{ props.client?.lastname }}
                </h1>
                <div class="mt-1 flex flex-row sm:mt-0 sm:flex-row sm:flex-wrap space-x-8">
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                        <UserIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {{ props.client?.sex }}
                    </div>
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                        <ScaleIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {{ props.client?.civil_status }}
                    </div>
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                        <CakeIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {{ moment(props.client?.birthdate).format('MMMM D, Y') }}
                    </div>
                </div>
            </div>
            <div class="mt-5">
                <span class="block" v-if="$route.name === 'clients-profile-uuid'">
                    <FormButton type="button" @click="editClient" class="w-full">
                        <PencilIcon class="h-5 w-5 text-white mr-2" aria-hidden="true" />
                        Edit
                    </FormButton>
                </span>
                <span class="block" v-if="$route.name === 'clients-respondents-uuid'">
                    <FormButton type="button" @click="open" class="w-full">
                        <UserPlusIcon class=" h-5 w-5 text-white mr-2" aria-hidden="true" />
                        Create Respondent
                    </FormButton>
                </span>
                <span class="block" v-if="$route.name === 'clients-children-uuid'">
                    <FormButton type="button" @click="open" class="w-full">
                        <UserPlusIcon class=" h-5 w-5 text-white mr-2" aria-hidden="true" />
                        Add Dependent
                    </FormButton>
                </span>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import moment from 'moment'
import { UserIcon, ScaleIcon, CakeIcon, PencilIcon, UserPlusIcon } from '@heroicons/vue/20/solid'

const emit = defineEmits(['openModal'])

const props = defineProps({
    client: {
        type: Object,
        required: true
    },
})

function open() {
    emit('openModal', true)
}

function editClient() {
    navigateTo(`/clients/profile/edit/${props.client.uuid}`)
}
</script>