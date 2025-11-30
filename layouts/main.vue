<template>
  <div class="">
    <Loader v-if="$loading.state.isPageLoading" />
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
                  <img class="w-[90px]" src="/public/images/logo2.png" alt="Your Company">
                </div>
                <!-- mobile sidebar -->
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="(item, index) in filteredNavigation" :key="item.name">
                          <div>
                            <!-- Parent Link -->
                            <div v-if="!item.children">
                              <NuxtLink
                                :to="item.href"
                                @click="sidebarOpen = false"
                                class="group flex items-center gap-x-3 rounded-md p-2 py-2 text-lg font-semibold leading-6"
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
                              </NuxtLink>
                            </div>

                            <!-- Parent with Submenu -->
                            <div v-else>
                              <button
                                type="button"
                                @click="toggleSubmenu(index)"
                                class="group flex w-full items-center gap-x-3 rounded-md p-2 py-2 text-lg font-semibold leading-6 text-left cursor-pointer"
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
                                  :class="[
                                    'ml-auto h-5 w-5 transform transition-transform duration-300',
                                    openSubmenus[index]
                                      ? 'rotate-90 text-green-800'
                                      : 'rotate-0 text-green-800'
                                  ]"
                                />
                              </button>

                              <!-- Submenu -->
                              <ul v-if="openSubmenus[index]" class="ml-10 mt-1 space-y-1">
                                <li v-for="sub in item.children" :key="sub.name">
                                  <NuxtLink
                                    :to="sub.href"
                                    @click="sidebarOpen = false"
                                    class="group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-green-900"
                                    :class="{
                                      'bg-green-100 text-green-900': sub.activeRouteNames.includes($route.name)
                                    }"
                                  >
                                    {{ sub.name }}
                                  </NuxtLink>
                                </li>
                              </ul>
                            </div>
                          </div>
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
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col ">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-100 px-6 pb-4">
        <div class="flex h-16 items-center justify-center text-xl font-semibold text-green-100">
          <img class="w-[90px]" src="/public/images/logo2.png" alt="Your Company">
        </div>

        <!-- desktop sidebar -->
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="(item, index) in filteredNavigation" :key="item.name">
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
                          :class="sub.activeRouteNames.includes($route.name) ? 'bg-green-100 text-green-900' : ''"
                        >
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

    <div class="lg:pl-72 ">
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
            <Toaster richColors position="top-right" />
            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="-m-1.5 flex items-center p-1.5">
                <span class="sr-only">Open user menu</span>
                <span class="hidden lg:flex lg:items-center">
                  <span class="ml-4 text-sm font-semibold leading-6 text-green-700" aria-hidden="true">{{
                    $capitalizeWords(user?.firstname + ' ' + user?.midinit + ' ' + user?.lastname) }}</span>
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
                  <a @click="viewProfile"
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
        <div class="px-4 sm:px-6 lg:px-8 ">
          <slot />
        </div>
      </main>
    </div>

    <!-- MODAL -->
     <!-- User View / Edit Modal -->
      <Modal :show="state.openView">
        <div class="w-full max-w-3xl mx-auto bg-gray-100 px-4 py-5 sm:px-6 rounded-lg space-y-4">
          <Loader v-if="$loading.state.isPageLoading" />

          <!-- Header -->
          <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap px-4 py-2">
            <div class="ml-2 mb-2">
              <h3 class="text-lg font-semibold text-green-900">
                {{ 'Profile' }}
              </h3>
            </div>
          </div>

          <!-- FORM -->
          <form @submit.prevent="updateUser" autocomplete="off" class="p-4 space-y-8">
            <!-- =======================
                  Section 1: Account Information
            ========================== -->
            <div class="bg-white shadow-md rounded-lg p-4 space-y-4">
              <h4 class="text-md font-semibold text-green-800 border-b border-green-200 pb-2">
                Account Information
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Username -->
                <div>
                  <FormLabel for="username" label="Username" />
                  <FormText
                    v-model="state.form.username"
                    placeholder="Enter username"
                    :disabled="true"
                    :class="[
                      'w-full rounded-md transition-all',
                      state.errors.username
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]"
                    @input="clearError('username')"
                  />
                  <p v-if="state.errors.username" class="text-sm text-red-500 mt-1">
                    {{ state.errors.username[0] }}
                  </p>
                </div>

                <!-- Employee ID -->
                <div>
                  <FormLabel for="employee_id" label="Employee ID" />
                  <FormText
                    v-model="state.form.employee_id"
                    placeholder="Enter employee ID"
                    :disabled="true"
                    :class="[
                      'w-full rounded-md transition-all',
                      state.errors.employee_id
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]"
                    @input="clearError('employee_id')"
                  />
                  <p v-if="state.errors.employee_id" class="text-sm text-red-500 mt-1">
                    {{ state.errors.employee_id[0] }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Password -->
                <div>
                  <FormLabel for="password" label="Password" />
                  <FormText
                    type="password"
                    v-model="state.form.password"
                    placeholder="Enter new password"
                    :class="[
                      'w-full rounded-md transition-all',
                      state.errors.password
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]"
                    @input="clearError('password')"
                  />
                  <p v-if="state.errors.password" class="text-sm text-red-500 mt-1">
                    {{ state.errors.password[0] }}
                  </p>
                </div>

                <!-- Confirm Password -->
                <div>
                  <FormLabel for="confirm_password" label="Confirm Password" />
                  <FormText
                    type="password"
                    v-model="state.form.password_confirmation"
                    placeholder="Re-enter password"
                    :class="[
                      'w-full rounded-md transition-all',
                      state.errors.password_confirmation
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]"
                    @input="clearError('password_confirmation')"
                  />
                  <p v-if="state.errors.password_confirmation" class="text-sm text-red-500 mt-1">
                    {{ state.errors.password_confirmation[0] }}
                  </p>
                </div>
              </div>
            </div>

            <!-- =======================
                  Section 2: Personal Information
            ========================== -->
            <div class="bg-white shadow-md rounded-lg p-4 space-y-4">
              <h4 class="text-md font-semibold text-green-800 border-b border-green-200 pb-2">
                Personal Information
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <FormLabel for="firstname" label="First Name" />
                  <FormText
                    v-model="state.form.firstname"
                    placeholder="First name"
                    :class="[
                      'w-full rounded-md transition-all',
                      state.errors.firstname
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]"
                    @input="clearError('firstname')"
                  />
                  <p v-if="state.errors.firstname" class="text-sm text-red-500 mt-1">
                    {{ state.errors.firstname[0] }}
                  </p>
                </div>

                <div>
                  <FormLabel for="midinit" label="Middle Initial" />
                  <FormText
                    v-model="state.form.midinit"
                    placeholder="M"
                    maxlength="1"
                  />
                </div>

                <div>
                  <FormLabel for="lastname" label="Last Name" />
                  <FormText
                    v-model="state.form.lastname"
                    placeholder="Last name"
                    :class="[
                      'w-full rounded-md transition-all',
                      state.errors.lastname
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]"
                    @input="clearError('lastname')"
                  />
                  <p v-if="state.errors.lastname" class="text-sm text-red-500 mt-1">
                    {{ state.errors.lastname[0] }}
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FormLabel for="office" label="Office" />
                  <FormSelect
                    v-model="state.form.office"
                    :options="state.parameter.offices"
                    placeholder="Select office"
                    :disabled="true"
                  />
                </div>

                <div>
                  <FormLabel for="position" label="Position" />
                  <FormText
                    v-model="state.form.position"
                    placeholder="Position title"
                    :disabled="true"
                  />
                </div>
              </div>
            </div>

            <!-- =======================
                  Buttons
            ========================== -->
            <div class="flex flex-wrap justify-end gap-2 border-t border-green-100 pt-4">
              <FormButton
                type="button"
                @click="closedViewDialog"
                buttonStyle="white"
                class="px-3 py-1 text-sm"
              >
                Close
              </FormButton>

              <FormButton
                type="submit"
                class="px-3 py-1 text-sm"
              >
                Update
              </FormButton>
            </div>
          </form>
        </div>
      </Modal>
    <!-- END MODAL -->
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
  DocumentMinusIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'
import { useMarketcodeStore } from '~/store/marketcode'
import NProgress from 'nprogress'
import { useIdle } from '~/composables/useIdle'
import { userService } from '~/api/UserService'
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'


const openSubmenus = ref({})

const userStore = useUserStore()
const user = userStore.getUser

const parameterStore = useParameterStore()
const marketStore = useMarketcodeStore()

const route = useRouter()
const route1 = useRoute()

const { $capitalizeWords } = useNuxtApp()
const { $loading } = useNuxtApp()

const { setup, cleanup } = useIdle(60 * 60 * 1000)

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
      { name: 'Stall Owner', href: '/conversion/awardee', activeRouteNames: ['conversion-awardee'] },
      { name: 'Stall Profile', href: '/conversion/stall', activeRouteNames: ['conversion-stall'] },
      { name: 'Rental', href: '/conversion/rental', activeRouteNames: ['conversion-rental'] },
    ]
  },
  {
    name: 'Users',
    href: '/users',
    icon: UserIcon,
    activeRouteNames: ['users'],
  },
];

// Auto-open submenu if current route matches any child
onMounted(() => {
  setup() // Start idle timer
  navigation.forEach((item, index) => {
    if (item.children) {
      const isChildActive = item.children.some(child =>
        child.activeRouteNames.includes(route.name)
      )
      openSubmenus.value[index] = isChildActive
    }
  })
})

onBeforeUnmount(() => {
  cleanup()
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

//submenu filtered
const filteredNavigation = computed(() =>
  navigation.filter(item => {
    if (!item) return false
    //show the conversion module for the CEE users only
    if (item.name === 'Conversion' && user.office !== '00' && user.office !== '99') {
      return false
    } 
    //show the users module for admin users only
    if (item.name === 'Users' && user.office !== '00') {
      return false
    } 

    return true
  })
)

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

//default form for easy reset
const defaultForm = {
  username: null,
  password: null,
  password_confirmation: null, 
  firstname: null,
  midinit: null,
  lastname: null,
}

const state = reactive({
  error: null,
  isPageLoading: false,
  openView: false,
  errors: {},
  form: { ...defaultForm },
  parameter: {
    offices: []
  }
})

async function logoutUser() {
  NProgress.start()
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
  NProgress.done()
}

// MODAL
async function viewProfile() { 
  $loading.start()
  try {
    const response = await userService.getUser(user.id);
    if (response.data) {

      state.user_id = response.data.id;
      // Map API response to form fields
      state.form = {
        username: response.data.username ?? '',
        employee_id: response.data.details.employee_id ?? '',
        is_admin: !!response.data.is_admin,
        is_supervisor: !!response.data.is_supervisor,
        firstname: response.data.details.firstname ?? '',
        midinit: response.data.details.midinit ?? '',
        lastname: response.data.details.lastname ?? '',
        office: response.data.details.office ?? '',
        position: response.data.details.position ?? ''
      }

    }
  } catch (error) {
    console.log(error);
  }
  $loading.stop()

  // Clear previous errors
  state.errors = {}
  fetchOffices();
  state.openView = true;
}
function closedViewDialog() {
  state.openView = false
}
async function updateUser() {
  $loading.start()
  try {
      let params = state.form;
      let id = state.user_id;

      const response = await userService.updateUser(params, id)
      if (response) {
          state.openView = false
          toast.info('Your profile has been updated', {
            description: 'Please log out and log back in to apply the changes.',
            action: {
              label: 'x',
              onClick: (t) => toast.dismiss(t.id)
            },
            duration: Infinity, // stays until manually closed
          })
      }
  } catch (error) {
    if (error.errors) {
      state.errors = error.errors
    } else {
      console.error('Unexpected error:', error)
      toast.error('Something went wrong.')
    }
  }
  $loading.stop()
}

async function fetchOffices() {
  try {
    const response = await userService.getOffices()
    if (response) {
        let options = response.data.map((item) => ({
            value: item.marketOfficeCode,
            label: $capitalizeWords(item.officeName)
        }));
        state.parameter.offices = options;
    }
  } catch (error) {
    console.error(error)
  }
}

const sidebarOpen = ref(false)
</script>