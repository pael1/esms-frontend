<template>
    <div>
        <section aria-labelledby="notes-title" class="flex-grow">
            <div class="bg-white flex flex-col h-full">
                <div class="divide-y divide-gray-200 flex-grow flex flex-col">
                    <div ref="commentsContainer" class="px-4 py-2 w-full sm:px-6 ">
                        <ul role="list" class="space-y-8">
                            <li v-for="message in props.messages" :key="message.uuid">
                                <div class="flex flex-col sm:flex-row justify-between space-x-3">
                                    <div class="flex items-start sm:items-center space-x-4">
                                        <div>
                                            <span
                                                class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-500">
                                                <span class="text-xl font-medium leading-none text-white">
                                                    {{ message?.user?.firstname.charAt(0) }}{{
                                                        message?.user?.lastname.charAt(0) }}
                                                </span>
                                            </span>
                                        </div>
                                        <div>
                                            <div class="text-lg space-x-2 flex items-center">
                                                <a href="#" class="font-medium text-gray-900">
                                                    {{ message?.user?.firstname }} {{ message?.user?.lastname }}
                                                </a>
                                                <span class="font-medium text-xs text-gray-500">
                                                    {{ moment(message?.created_at).format('MM/DD/YY-h:mm A') }}
                                                </span>
                                            </div>
                                            <div class="mt-1 text-sm font-semibold text-gray-700 w-64">
                                                <p>
                                                    {{ message?.description }}
                                                </p>
                                            </div>
                                            <div v-if="message?.assistanceLogAttachments?.length > 0"
                                                class="mt-1 text-lg font-semibold text-gray-700">
                                                <a v-for="document in message?.assistanceLogAttachments"
                                                    :key="document.uuid" :href="document.file" target="_blank"
                                                    class="text-blue-500 text-xs flex items-center w-52">
                                                    <DocumentIcon class="h-4 w-4 mr-1" />
                                                    <span class="truncate w-full">{{ document.name }}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { DocumentIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    messages: {
        type: Object,
        required: false
    },
})
</script>
