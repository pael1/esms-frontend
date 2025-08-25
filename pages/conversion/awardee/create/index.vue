<template>
  <div class="max-w-5xl mx-auto space-y-6 my-10">
    <Loader v-if="state.isPageLoading" />

    <!-- Profile Photo -->
    <div class="flex justify-center">
      <div class="text-center">
        <label for="profile-upload" class="relative w-48 h-48 mx-auto block cursor-pointer">
          <img
            v-if="previewUrl"
            :src="previewUrl"
            alt="Profile Preview"
            class="w-48 h-48 object-cover border shadow rounded-lg" 
          />
          <div
            v-else
            class="w-48 h-48 flex items-center justify-center bg-gray-100 border text-gray-400 shadow rounded-lg"
          >
            No Image
          </div>
        </label>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        />
        <p class="text-sm text-gray-500 mt-2">Add Profile</p>
      </div>
    </div>

    <!-- Personal Data Box -->
    <div class="bg-white shadow-lg rounded-lg p-6 space-y-6">
      <h2 class="text-xl font-semibold border-b pb-2">Personal Data</h2>

      <!-- Owner Names -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Owner Last Name</label>
          <FormText v-model="state.form.lastname" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Owner First Name</label>
          <FormText v-model="state.form.firstname" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Owner Middle Initial</label>
          <FormText v-model="state.form.midinit" />
        </div>
      </div>

      <!-- Contact + Civil Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Contact Number</label>
          <FormText v-model="state.form.contactnumber" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Civil Status</label>
          <FormSelect v-model="state.form.civilStatus" :options="civilStatusOptions" />
        </div>
      </div>

      <!-- Address -->
      <div>
        <label class="block text-sm font-medium mb-1">Home Address</label>
        <FormTextArea v-model="state.form.address" rows="2" />
      </div>

      <!-- Spouse Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Spouse Last Name</label>
          <FormText v-model="state.form.spouseLastname" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Spouse First Name</label>
          <FormText v-model="state.form.spouseFirstname" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Spouse Mid Initial</label>
          <FormText v-model="state.form.spouseMidint" />
        </div>
      </div>
    </div>

    <!-- Children Data Box -->
    <div class="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h3 class="text-xl font-semibold border-b pb-2">Children</h3>

      <div v-if="state.form.children.length === 0" class="text-sm text-gray-500 italic py-2">
        Sorry, no record found.
      </div>

      <!-- List of Children -->
      <div
        v-for="(child, index) in state.form.children"
        :key="index"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-2"
      >
        <div>
          <label class="block text-sm font-medium mb-1">Child Name</label>
          <FormText v-model="child.name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Birthdate</label>
          <FormDate v-model="child.birthdate" />
        </div>
        <button
          type="button"
          class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          @click="removeChild(index)"
        >
          Remove
        </button>
      </div>

      <!-- Add Child Button -->
      <button
        type="button"
        class="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        @click="addChild"
      >
        Add Child
      </button>
    </div>

    <!-- Employees Data Box -->
    <div class="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h3 class="text-xl font-semibold border-b pb-2">Employees Data</h3>

      <div v-if="state.form.employees.length === 0" class="text-sm text-gray-500 italic py-2">
        Sorry, no record found.
      </div>

      <!-- List of Employees -->
      <div
        v-for="(employee, index) in state.form.employees"
        :key="index"
        class="grid grid-cols-1 md:grid-cols-8 gap-4 items-end mb-2"
      >
        <!-- Employee Name (2 cols) -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Employee Name</label>
          <FormText v-model="employee.name" />
        </div>

        <!-- Birthdate (1 col) -->
        <div class="md:col-span-1">
          <label class="block text-sm font-medium mb-1">Birthdate</label>
          <FormDate v-model="employee.birthdate" />
        </div>

        <!-- Age (1 col) -->
        <div class="md:col-span-1">
          <label class="block text-sm font-medium mb-1">Age</label>
          <FormText v-model="employee.age" type="number" />
        </div>

        <!-- Address (2 cols) -->
        <div class="md:col-span-3">
          <label class="block text-sm font-medium mb-1">Address</label>
          <FormText v-model="employee.address" />
        </div>

        <!-- Remove Button (1 col) -->
        <div class="md:col-span-1 flex">
          <button
            type="button"
            class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
            @click="removeEmployee(index)"
          >
            Remove
          </button>
        </div>
      </div>

      <!-- Add Employee Button -->
      <button
        type="button"
        class="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        @click="addEmployee"
      >
        Add Employee
      </button>
    </div>

    <!-- Business Information -->
    <div class="bg-white shadow-lg rounded-lg p-6 space-y-6">
      <h3 class="text-xl font-semibold border-b pb-2">Business Information</h3>

      <!-- Row 1 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Contract Start Date</label>
          <FormDate v-model="state.form.contractStartDate" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Period of Contract</label>
          <FormText v-model="state.form.periodOfContract" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Business ID</label>
          <FormText v-model="state.form.businessId" />
        </div>
      </div>

      <!-- Row 2 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Business Plate No.</label>
          <FormText v-model="state.form.businessPlateNo" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Bus. Started (YYYY-MM-DD)</label>
          <FormDate v-model="state.form.businessStarted" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Capital</label>
          <FormText v-model="state.form.capital" type="number" />
        </div>
      </div>

      <!-- Row 3 -->
      <div>
        <label class="block text-sm font-medium mb-1">Line of Business/es</label>
        <FormTextArea v-model="state.form.lineOfBusiness" rows="2" />
      </div>
    </div>

    <!-- Stall Owner Files -->
    <div class="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h3 class="text-xl font-semibold border-b pb-2">Stall Owner Files</h3>

      <!-- File List -->
      <div class="border rounded-lg bg-yellow-50 p-3 text-gray-600">
        <p v-if="state.form.files.length === 0" class="text-sm italic">
          Sorry, no file found.
        </p>
        <ul v-else class="text-sm space-y-2">
          <li
            v-for="(file, index) in state.form.files"
            :key="index"
            class="flex items-center justify-between"
          >
            <span>{{ file.name }} ({{ file.type }})</span>
            <button
              type="button"
              class="text-red-600 hover:underline text-xs"
              @click="removeFile(index)"
            >
              Remove
            </button>
          </li>
        </ul>
      </div>

      <!-- File Upload Form -->
      <div class="flex flex-col md:flex-row md:items-center gap-3">
        <!-- File Input -->
        <input
          id="file-upload"
          type="file"
          class="block w-full text-sm text-gray-700 border rounded-lg cursor-pointer focus:ring focus:ring-green-300"
          @change="onFileUploadChange"
        />

        <!-- File Type Select -->
        <select
          v-model="state.form.selectedFileType"
          class="block w-full md:w-40 border rounded-lg text-sm p-2"
        >
          <option value="contract">Contract</option>
          <option value="id">ID</option>
          <option value="permit">Permit</option>
        </select>

        <!-- Attach Button -->
        <button
          type="button"
          class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
          @click="attachFile"
        >
          Attach File
        </button>
      </div>
    </div>

    <!-- Submit -->
    <div class="pt-4 flex justify-end">
      <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { awardeeService } from '~/api/AwardeeService'

const { showError, showSuccess } = useSweetLoading()

definePageMeta({
  layout: 'main'
})

useHead({
  title: 'Conversion Create Awardee | eSMS'
})

const state = reactive({
  isPageLoading: false,
  form: {
    lastname: '',
    firstname: '',
    midinit: '',
    civilStatus: '',
    address: '',
    spouseLastname: '',
    spouseFirstname: '',
    spouseMidint: '',
    attachIdPhoto: null,
    contactnumber: '',
    children: [], // ✅ children array
    employees: [],   // ✅ employees array
    files: [],                // ✅ file list
    selectedFile: null,       // ✅ temp selected file
    selectedFileType: 'contract', // ✅ dropdown default

    // ✅ Business info fields
    contractStartDate: '',
    periodOfContract: '',
    businessId: '',
    businessPlateNo: '',
    businessStarted: '',
    capital: '',
    lineOfBusiness: ''
  },
})

const previewUrl = ref(null)

function onFileChange(event) {
  const file = event.target.files?.[0]
  if (file) {
    state.form.attachIdPhoto = file.name
    previewUrl.value = URL.createObjectURL(file)
  }
}

// Add child row
function addChild() {
  state.form.children.push({
    name: '',
    birthdate: ''
  })
}

// Remove child row
function removeChild(index) {
  state.form.children.splice(index, 1)
}

// Add employee row
function addEmployee() {
  state.form.employees.push({
    name: '',
    birthdate: '',
    age: '',
    address: ''
  })
}

// Remove employee row
function removeEmployee(index) {
  state.form.employees.splice(index, 1)
}

// Static options
const civilStatusOptions = [
  { label: 'SINGLE', value: 'SINGLE' },
  { label: 'MARRIED', value: 'MARRIED' },
  { label: 'WIDOWED', value: 'WIDOWED' },
  { label: 'SEPARATED', value: 'SEPARATED' }
]

//files
function onFileUploadChange(e) {
  state.form.selectedFile = e.target.files[0] || null
}

function attachFile() {
  if (!state.form.selectedFile) return
  state.form.files.push({
    name: state.form.selectedFile.name,
    type: state.form.selectedFileType
  })
  state.form.selectedFile = null
  document.getElementById('file-upload').value = '' // reset input
}

function removeFile(index) {
  state.form.files.splice(index, 1)
}
//end files

async function submitForm() {
  state.isPageLoading = true
  try {
    let params = state.form
    const response = await awardeeService.create(params)
    if (response.data) {
      console.log('Data saved successfully:', response.data)
      showSuccess('Success', 'Awardee saved successfully!')
    }
  } catch (error) {
    let errorMessages = []
    Object.entries(error.errors).forEach(([field, messages]) => {
      messages.forEach((message) => {
        errorMessages.push(`${field}: ${message}`)
      })
    })
    showError('', errorMessages.join('<br>'))
  }
  state.isPageLoading = false
}
</script>
