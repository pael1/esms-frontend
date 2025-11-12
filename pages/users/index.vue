<template>
    <div class="min-h-screen sm:p-3">
      <Toaster richColors position="top-right" />
      <div class="bg-white">
          <Loader v-if="$loading.state.isPageLoading" />
          <div class="py-3"></div>
          <div class="sm:flex sm:items-center sm:justify-end p-2">
            <FormButton
              buttonStyle="green"
              size="md"
              class="flex items-center gap-2"
              @click="addDialog()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create User</span>
            </FormButton>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <!-- Left side: grouped selects -->
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-2 w-full sm:w-auto">
              <!-- another div -->
            </div>

            <!-- Right side: TableSearch -->
            <div class="w-full sm:w-auto">
              <TableSearchSimple @handleFilter="handleFilter" :placeholder="'Enter Name'" />
            </div>
          </div>
          <TableUsers :users="state.users.data" @viewUserClick="viewUser" />

          <Pagination v-if="state.users?.data?.length > 0" :data="state.users" @previous="previous" @next="next" />
      </div>

      <!-- MODAL -->
      <!-- CREATE -->
      <Modal :show="state.open">
        <div class="w-full max-w-3xl mx-auto bg-gray-100 px-4 py-5 sm:px-6 rounded-lg space-y-4">
          <Loader v-if="$loading.state.isPageLoading" />

          <!-- Header -->
          <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div class="ml-2 mb-2">
              <h3 class="text-lg font-semibold text-green-900">Create User</h3>
            </div>
          </div>

          <!-- FORM -->
          <form @submit.prevent="addUser" autocomplete="off" class="p-4 space-y-8">
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
                    placeholder="Enter password"
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
                  <FormLabel for="password_confirmation" label="Confirm Password" />
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

              <div class="flex gap-6 items-center">
                <!-- Is Supervisor -->
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="state.form.is_supervisor"
                    class="rounded text-green-600 focus:ring-green-600"
                  />
                  <span class="text-sm text-gray-700">Is Supervisor</span>
                </label>

                <!-- Is Admin -->
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="state.form.is_admin"
                    class="rounded text-green-600 focus:ring-green-600"
                  />
                  <span class="text-sm text-gray-700">Is Admin</span>
                </label>
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
                <!-- First Name -->
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

                <!-- Middle Initial -->
                <div>
                  <FormLabel for="midinit" label="Middle Initial" />
                  <FormText
                    v-model="state.form.midinit"
                    placeholder="M"
                    maxlength="1"
                    :class="[
                      'w-full rounded-md transition-all',
                      state.errors.midinit
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]"
                    @input="clearError('midinit')"
                  />
                  <p v-if="state.errors.midinit" class="text-sm text-red-500 mt-1">
                    {{ state.errors.midinit[0] }}
                  </p>
                </div>

                <!-- Last Name -->
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
                <!-- Office -->
                <div>
                  <FormLabel for="office" label="Office" />
                  <FormSelect
                    v-model="state.form.office"
                    :options="state.parameter.offices"
                    placeholder="Select office"
                    :class="[
                      'w-full rounded-md transition-all',
                      state.errors.office
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]"
                    @change="clearError('office')"
                  />
                  <p v-if="state.errors.office" class="text-sm text-red-500 mt-1">
                    {{ state.errors.office[0] }}
                  </p>
                </div>

                <!-- Position -->
                <div>
                  <FormLabel for="position" label="Position" />
                  <FormText
                    v-model="state.form.position"
                    placeholder="Position title"
                    :class="[
                      'w-full rounded-md transition-all',
                      state.errors.position
                        ? 'ring-1 ring-red-500 focus:ring-red-500'
                        : 'ring-1 ring-gray-300 focus:ring-green-600'
                    ]"
                    @input="clearError('position')"
                  />
                  <p v-if="state.errors.position" class="text-sm text-red-500 mt-1">
                    {{ state.errors.position[0] }}
                  </p>
                </div>
              </div>
            </div>

            <!-- =======================
                  Buttons
            ========================== -->
            <div class="flex flex-wrap justify-end gap-2 border-t border-green-100 pt-4">
              <FormButton
                type="button"
                @click="closedAddDialog"
                buttonStyle="white"
                class="px-3 py-1 text-sm"
              >
                Cancel
              </FormButton>
              <FormButton type="submit" class="px-3 py-1 text-sm">
                Save
              </FormButton>
            </div>
          </form>
        </div>
      </Modal>

      <!-- User View / Edit Modal -->
      <Modal :show="state.openView">
        <div class="w-full max-w-3xl mx-auto bg-gray-100 px-4 py-5 sm:px-6 rounded-lg space-y-4">
          <Loader v-if="$loading.state.isPageLoading" />

          <!-- Header -->
          <div class="border-b border-green-200 -ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap px-4 py-2">
            <div class="ml-2 mb-2">
              <h3 class="text-lg font-semibold text-green-900">
                {{ state.isEdit ? 'Edit User' : 'View User' }}
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
                    :disabled="!state.isEdit"
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
                    :disabled="!state.isEdit"
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

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" v-if="state.isEdit">
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

              <div class="flex gap-6 items-center">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="state.form.is_supervisor"
                    class="rounded text-green-600 focus:ring-green-600"
                    :disabled="!state.isEdit"
                  />
                  <span class="text-sm text-gray-700">Is Supervisor</span>
                </label>

                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="state.form.is_admin"
                    class="rounded text-green-600 focus:ring-green-600"
                    :disabled="!state.isEdit"
                  />
                  <span class="text-sm text-gray-700">Is Admin</span>
                </label>
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
                    :disabled="!state.isEdit"
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
                    :disabled="!state.isEdit"
                  />
                </div>

                <div>
                  <FormLabel for="lastname" label="Last Name" />
                  <FormText
                    v-model="state.form.lastname"
                    placeholder="Last name"
                    :disabled="!state.isEdit"
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
                    :disabled="!state.isEdit"
                  />
                </div>

                <div>
                  <FormLabel for="position" label="Position" />
                  <FormText
                    v-model="state.form.position"
                    placeholder="Position title"
                    :disabled="!state.isEdit"
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
                v-if="state.isEdit"
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
  import { userService } from '~/api/UserService'
  import { Toaster, toast } from 'vue-sonner'
  import 'vue-sonner/style.css'

  //global loading
  const { $loading } = useNuxtApp()
  const { $capitalizeWords } = useNuxtApp()

  let currentPage = 1

  definePageMeta({
      layout: 'main'
  })

  useHead({
    title: 'Conversion Awardee List | eSMS'
  })

  //default form for easy reset
  const defaultForm = {
    username: null,
    password: null,
    password_confirmation: null, 
    is_supervisor: null,
    is_admin: null,
    employee_id: null,
    firstname: null,
    midinit: null,
    lastname: null,
    office: null,
    position: null,
  }

  const state = reactive({
    users: [],
    user_id: null,
    dataFilter: [],
    open: false,
    openView: false,
    form: { ...defaultForm },
    errors: {},
    isEdit: false,
    parameter: {
      offices: []
    }
  })

  onMounted(() => {
      fetchUsers()
  })

  async function fetchUsers() {
      $loading.start()
      try {
          let params = {
              page: currentPage,
              ...state.dataFilter
          }

          const response = await userService.getUsers(params)
          if (response) {
            console.log(response)
              state.users = response
          }
      } catch (error) {
          console.log(error)
      }
      $loading.stop()
  }

  function handleFilter(value) {
      currentPage = 1
      state.dataFilter = value
      fetchUsers()
  }

  async function previous() {
    currentPage--
    fetchUsers()
  }

  async function next() {
      currentPage++
      fetchUsers()
  }

  function clearError(field) {
    if (state.errors[field]) delete state.errors[field]
  }

  //BUTTONS ACTION
  function addDialog() {
    state.errors = {}
    Object.assign(state.form, defaultForm)
    fetchOffices()
    state.open = true
  }

  function closedAddDialog() {
    state.open = false
  }

  function closedViewDialog() {
    state.openView = false
  }

  async function addUser() {
    $loading.start()
    try {
        let params = state.form;
        const response = await userService.createUser(params)
        if (response) {
            fetchUsers()
            toast.success('User saved successfully')
        }
      state.open = false
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

  async function viewUser(userId, isView) { 
    $loading.start()

    state.isEdit = !isView;
    try {
      const response = await userService.getUser(userId);
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

    fetchOffices()
    state.openView = true;
  } 

  async function updateUser() {
    $loading.start()
      try {
          let params = state.form;
          let id = state.user_id;

          const response = await userService.updateUser(params, id)
          if (response) {
              fetchUsers()

              state.openView = false
              toast.success('User updated successfully')
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
  //BUTTONS END ACTION

  // PARAMETERS
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
  // END PARAMETERS
</script>