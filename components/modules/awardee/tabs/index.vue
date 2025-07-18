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
    { name: 'Stall', href: `/awardee/profile/${props.awardeeId}`, activeRouteNames: ['awardee-profile-id'] },
    { name: 'Files', href: `/awardee/profile/files/${props.awardeeId}`, activeRouteNames: ['awardee-profile-files-id'] },
    { name: 'Children', href: `/awardee/profile/childrens/${props.awardeeId}`, activeRouteNames: ['awardee-profile-childrens-id'] },
    { name: "Employee", href: `/awardee/profile/employee-data/${props.awardeeId}`, activeRouteNames: ['awardee-profile-employee-data-id'] },
    { name: 'Transactions', href: `/awardee/profile/transactions/${props.awardeeId}`, activeRouteNames: ['awardee-profile-transactions-id'] },
    { name: 'Ledger', href: `/awardee/profile/ledger/${props.awardeeId}`, activeRouteNames: ['awardee-profile-ledger-id'] },
    { name: 'Sync Data', href: `/awardee/profile/sync-op/${props.awardeeId}`, activeRouteNames: ['awardee-profile-sync-op-id'] },
]
</script>