<template>
    <main class="pb-4">
        <div class="mx-auto sm:px-6">
            <div class="px-4 sm:px-0">
                <div class="block">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px mt-2 overflow-x-auto flex space-x-8" aria-label="Tabs">
                            <NuxtLink v-for="tab in tabs" :key="tab.name" :to="tab.href"
                                :class="[tab.activeRouteNames.includes(props.routeName) ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700', 'whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium']">
                                {{ tab.name }}
                            </NuxtLink>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">

const props = defineProps({
    awardeeId: {
        type: String,
        required: true
    },
    routeName: {
        type: String,
        required: true
    }
})

const tabs = [
    { name: 'Profile', href: `/awardee/profile/${props.awardeeId}`, activeRouteNames: ['awardee-profile-id'] },
    { name: 'Files', href: `/awardee/files/${props.awardeeId}`, activeRouteNames: ['awardee-files-id'] },
    { name: 'Childrens', href: `/awardee/childrens/${props.awardeeId}`, activeRouteNames: ['awardee-childrens-id'] },
    { name: 'Employee', href: `/awardee/employeesdata/${props.awardeeId}`, activeRouteNames: ['awardee-employeesdata-id'] },
    { name: 'Transactions', href: `/awardee/transactions/${props.awardeeId}`, activeRouteNames: ['awardee-transactions-id'] },
    { name: 'Ledger', href: `/awardee/ledger/${props.awardeeId}`, activeRouteNames: ['awardee-ledger-id'] },
]
</script>