<template>
  <div class="dark:text-white dark:bg-black">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
          enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full" enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
            leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-100 px-6 pb-4">
                <div class="flex h-16 items-center justify-center text-xl font-semibold text-green-100">
                  <img class="w-[4.5rem]" src="/public/images/logo_inside.png" alt="Your Company">
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <NuxtLink :to="item.href" @click="sidebarOpen = false"
                            :class="[item.activeRouteNames.includes($route.name) ? 'bg-green-100 text-green-900' : 'text-green-900 hover:bg-green-100 hover:text-green-900', 'group flex items-center gap-x-3 rounded-md p-2 py-2 text-lg font-semibold leading-6']">
                            <component :is="item.icon"
                              :class="[item.activeRouteNames.includes($route.name) ? 'text-green-900' : 'text-green-900 group-hover:text-green-900', 'h-6 w-6 shrink-0']"
                              aria-hidden="true" />
                            {{ item.name }}
                          </NuxtLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col dark:text-white dark:bg-black">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-100 px-6 pb-4">
        <div class="flex h-16 items-center justify-center text-xl font-semibold text-green-100">
          <img class="w-[4.5rem]" src="/public/images/logo_inside.png" alt="Your Company">
        </div>

        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <!-- <li v-for="item in navigation" :key="item.name">
                  <NuxtLink :to="item.href" @click="sidebarOpen = false"
                    :class="[item.activeRouteNames.includes($route.name) ? 'bg-green-100 text-green-900' : 'text-gray-900 hover:bg-green-100 hover:text-green-900', 'group flex items-center gap-x-3 rounded-md p-2 py-2 text-lg font-semibold leading-6']">
                    <component :is="item.icon"
                      :class="[item.activeRouteNames.includes($route.name) ? 'text-green-900' : 'text-green-900 group-hover:text-green-900', 'h-6 w-6 shrink-0']"
                      aria-hidden="true" />
                    {{ item.name }}
                  </NuxtLink>
                </li> -->
                <li v-for="(item, index) in navigation" :key="item.name">
                  <div>
                    <div
                      @click="item.children ? toggleSubmenu(index) : navigate(item.href)"
                      class="group flex items-center gap-x-3 rounded-md p-2 py-2 text-lg font-semibold leading-6 cursor-pointer"
                      :class="[
                        item.activeRouteNames.includes($route.name)
                          ? 'bg-green-100 text-green-900'
                          : 'text-gray-900 hover:bg-green-100 hover:text-green-900'
                      ]"
                    >
                      <component
                        :is="item.icon"
                        :class="[
                          item.activeRouteNames.includes($route.name)
                            ? 'text-green-900'
                            : 'text-green-900 group-hover:text-green-900',
                          'h-6 w-6 shrink-0'
                        ]"
                        aria-hidden="true"
                      />
                      <span>{{ item.name }}</span>
                      <ChevronRightIcon
                        v-if="item.children"
                        :class="[
                          'ml-auto h-5 w-5 transform transition-transform duration-300',
                          openSubmenus[index] ? 'rotate-90 text-green-800' : 'rotate-0 text-green-800'
                        ]"
                      />
                    </div>

                    <!-- Submenu -->
                    <ul
                      v-if="item.children && openSubmenus[index]"
                      class="ml-10 mt-1 space-y-1"
                    >
                      <li v-for="sub in item.children" :key="sub.name">
                        <NuxtLink
                          :to="sub.href"
                          @click="sidebarOpen = false"
                          class="group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-green-900"
                          :class="{
                            'bg-green-100 text-green-900': sub.activeRouteNames.includes($route.name),
                          }"
                        >
                        <!-- <component
                        :is="item.icon"
                        :class="[
                          item.activeRouteNames.includes($route.name)
                            ? 'text-green-900'
                            : 'text-green-900 group-hover:text-green-900',
                          'h-6 w-6 shrink-0'
                        ]"
                        aria-hidden="true"
                      /> -->
                          {{ sub.name }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72 dark:text-white dark:bg-black">
      <div
        class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="relative flex flex-1">
            <!-- Breadcrumb -->
            <ol class="flex items-center text-sm font-semibold uppercase">
              <!-- Home -->
              <li class="flex items-center">
                <NuxtLink 
                  to="/dashboard" 
                  class="flex items-center text-green-600 hover:underline"
                >
                  <HomeIcon class="w-5 h-5 mr-1" /> <!-- Heroicons Home -->
                </NuxtLink>
              </li>

              <!-- Other breadcrumbs -->
              <li 
                v-for="(crumb, index) in breadcrumbs" 
                :key="index" 
                class="flex items-center"
              >
                <span class="mx-2 text-gray-400 font-normal">/</span>
                
                <NuxtLink
                  v-if="index < breadcrumbs.length - 1"
                  :to="crumb.href"
                  class="text-green-600"
                >
                  {{ crumb.label }}
                </NuxtLink>

                <span v-else class="text-green-800">
                  {{ crumb.label }}
                </span>
              </li>
            </ol>
          </div>
          <!-- <button
            @click="toggleTheme"
            class="rounded-full p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            :title="colorMode.preference === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <span v-if="colorMode.preference === 'dark'">🌞</span>
            <span v-else>🌙</span>
          </button> -->
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="-m-1.5 flex items-center p-1.5">
                <span class="sr-only">Open user menu</span>
                <span class="hidden lg:flex lg:items-center">
                  <span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">{{
                    user?.UserFirstName + ' ' + user?.UserLastName }}</span>
                  <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem>
                  <a @click="updateProfile"
                    class='block px-3 py-1 text-base leading-6 text-green-900 hover:bg-green-50 cursor-pointer'>
                    Your profile
                  </a>
                  </MenuItem>
                  <MenuItem>
                  <a @click="logoutUser"
                    class='block px-3 py-1 text-base leading-6 text-green-900 hover:bg-green-50 cursor-pointer'>
                    Sign out
                  </a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main>
        <div class="px-4 sm:px-6 lg:px-8 dark:text-white dark:bg-black">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { authService } from '~/api/AuthService'
import { useUserStore } from '@/store/user'
import { useParameterStore } from '@/store/parameter'
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  Bars3Icon,
  ChartPieIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  DocumentMinusIcon
} from '@heroicons/vue/24/outline'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'
import { useMarketcodeStore } from '~/store/marketcode'

const openSubmenus = ref({})

const userStore = useUserStore()
const user = userStore.getUser

const parameterStore = useParameterStore()
const marketStore = useMarketcodeStore()

const route = useRouter()
const route1 = useRoute()

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    activeRouteNames: ['dashboard'],
  },
  {
    name: 'Awardee', href: '/awardee', icon: UsersIcon, activeRouteNames: [
        'awardee',
        'awardee-profile-id',
        'awardee-profile-files-id',
        'awardee-profile-childrens-id',
        'awardee-profile-employee-data-id',
        'awardee-profile-transactions-id',
        'awardee-profile-ledger-id',
    ]
  },
  {
    name: 'Reports',
    icon: ChartPieIcon,
    activeRouteNames: ['reports'],
    children: [
      { name: 'MasterList', href: '/reports/master-list', activeRouteNames: ['reports-master-list'] },
      // { name: 'Monthly Collection', href: '/awardee/ledger', activeRouteNames: ['awardee-profile-ledger-id'] },
    ]
  },
  {
    name: 'Conversion',
    icon: DocumentMinusIcon,
    activeRouteNames: ['conversion'],
    children: [
      { name: 'Awardee', href: '/conversion/awardee', activeRouteNames: ['conversion-awardee'] },
      { name: 'Stall', href: '/conversion/stall', activeRouteNames: ['conversion-stall'] },
    ]
  },
];

// Auto-open submenu if current route matches any child
onMounted(() => {
  navigation.forEach((item, index) => {
    if (item.children) {
      const isChildActive = item.children.some(child =>
        child.activeRouteNames.includes(route.name)
      )
      openSubmenus.value[index] = isChildActive
    }
  })
})

// Generate breadcrumb array based on route path
const breadcrumbs = computed(() => {
  const segments = route1.path.split('/').filter(Boolean)
  return segments.map((segment, idx) => {
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1)
    }
  })
})

function toggleSubmenu(index) {
  openSubmenus.value[index] = !openSubmenus.value[index]
}

function navigate(href) {
  openSubmenus.value = {}
  route.push(href)
}

// const colorMode = useColorMode()
// function toggleTheme() {
//   const newTheme = colorMode.preference === 'light' ? 'dark' : 'light'
//   colorMode.preference = newTheme
// }

const state = reactive({
  error: null,
  isPageLoading: false
})

async function logoutUser() {
  state.isPageLoading = true
  try {
    const response = await authService.logout()
    if (response.message) {
      localStorage.removeItem('_token')
      userStore.resetUser()
      parameterStore.resetSectionCode()
      marketStore.resetMarketCode()
      await navigateTo(`/`)
    }
  } catch (error) {
    state.error = error
  }
  state.isPageLoading = false
}

const sidebarOpen = ref(false)
</script>