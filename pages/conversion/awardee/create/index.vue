<template>
  <div class="max-w-5xl mx-auto space-y-6 my-10">
    <Loader v-if="state.isPageLoading" />
    <form @submit.prevent="awardeeAddForm"
          autocomplete="off">
    <!-- Profile Photo -->
      <div class="flex justify-center">
        <div class="text-center relative">
          <label
            v-if="!previewUrl"
            for="profile-upload"
            class="relative w-[150px] h-[150px] mx-auto block cursor-pointer"
          >
            <div
              class="w-[150px] h-[150px] flex items-center justify-center bg-gray-100 border text-gray-400 shadow rounded-lg"
            >
              Select Image
            </div>
          </label>

          <!-- Image Preview -->
          <div v-else class="relative w-[150px] h-[150px] mx-auto">
            <img
              :src="previewUrl"
              alt="Profile Preview"
              class="w-full h-full object-cover border shadow rounded-lg"
            />
            <!-- Remove Button -->
            <button
              type="button"
              @click="removeImage"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-600"
            >
              ✕
            </button>
          </div>
          <span class="text-red-500">{{ state.errors.attachIdPhoto }}</span>

          <!-- Hidden Input -->
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            class="hidden"
            ref="fileInput"
            @change="onFileChange"
          />
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
            <span class="text-red-500">{{ state.errors.lastname }}</span>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Owner First Name</label>
            <FormText v-model="state.form.firstname" />
            <span class="text-red-500">{{ state.errors.firstname }}</span>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Owner Middle Initial</label>
            <FormText v-model="state.form.midinit" maxlength="1"/>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Contact Number</label>
            <FormText v-model="state.form.contactnumber" maxlength="11"/>
            <span class="text-red-500">{{ state.errors.contactnumber }}</span>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Civil Status</label>
            <FormSelect v-model="state.form.civilStatus" :options="civilStatusOptions" />
            <span class="text-red-500">{{ state.errors.civilStatus }}</span>
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium mb-1">Home Address</label>
          <FormTextArea v-model="state.form.address" rows="2" />
          <span class="text-red-500">{{ state.errors.address }}</span>
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

        <div v-if="state.form.children.length === 0" class="text-sm bg-yellow-50 p-3 text-gray-500 italic py-2">
          Sorry, no new children have been added.
        </div>

        <!-- List of Children -->
        <div
          v-for="(child, index) in state.form.children"
          :key="index"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-2"
        >
          <div>
            <label class="block text-sm font-medium mb-1">Child Name</label>
            <FormText v-model="child.childName" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Birthdate</label>
            <FormDate v-model="child.childBDate" />
          </div>
          <FormButton type="submit" class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" @click="removeChild(index)">
            Remove
          </FormButton>
        </div>

        <!-- Add Child Button -->
        <FormButton type="button" class="px-3 py-1 text-sm" @click="addChild">
            Add Child
        </FormButton>
      </div>

      <!-- Employees Data Box -->
      <div class="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h3 class="text-xl font-semibold border-b pb-2">Employees Data</h3>

        <div v-if="state.form.employees.length === 0" class="text-sm bg-yellow-50 p-3 text-gray-500 italic py-2">
          Sorry, no new employee have been added.
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
            <FormText v-model="employee.employeeName" />
          </div>

          <!-- Birthdate (1 col) -->
          <div class="md:col-span-1">
            <label class="block text-sm font-medium mb-1">Birthdate</label>
            <FormDate v-model="employee.dateOfBirth" />
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
            <FormButton type="submit" class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full" @click="removeEmployee(index)">
                Remove
            </FormButton>
          </div>
        </div>

        <!-- Add Employee Button -->
        <FormButton type="button" class="px-3 py-1 text-sm" @click="addEmployee">
          Add Employee
        </FormButton>
      </div>

      <!-- Stall Owner Files -->
      <div class="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h3 class="text-xl font-semibold border-b pb-2">Stall Owner Files</h3>

        <!-- File List -->
        <div class="border rounded-lg bg-yellow-50 p-3 text-gray-600">
          <p v-if="state.form.files.length === 0" class="text-sm italic">
            Sorry, no new file have been added.
          </p>
          <ul v-else class="text-sm space-y-2">
            <li
              v-for="(file, index) in state.form.files"
              :key="index"
              class="flex items-center justify-between"
            >
              <span>{{ file.filePath }} ({{ file.attachFileType }})</span>
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
        <div class="grid grid-cols-6 gap-3 items-center">
          <!-- File Input (3 cols) -->
          <div class="col-span-6 md:col-span-3">
            <input
              id="file-upload"
              type="file"
              class="block w-full text-sm text-gray-700 border rounded-lg cursor-pointer focus:ring focus:ring-green-300"
              @change="onFileUploadChange"
            />
          </div>

          <!-- File Type Select (1 col) -->
          <div class="col-span-6 md:col-span-1">
            <FormSelect
              v-model="state.form.selectedFileType"
              :options="fileTypes"
            />
          </div>

          <!-- Attach Button (2 cols) -->
          <div class="col-span-6 md:col-span-2">
            <FormButton type="button" class="px-3 py-1 text-sm" @click="attachFile">
              Attach File
            </FormButton>
          </div>
        </div>
      </div>

      <!-- Business Information -->
      <!-- <div class="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h3 class="text-xl font-semibold border-b pb-2">Business Information</h3>

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
        <div>
          <label class="block text-sm font-medium mb-1">Line of Business/es</label>
          <FormTextArea v-model="state.form.lineOfBusiness" rows="2" />
        </div>
      </div> -->

      <!-- Submit -->
      <div class="pt-4 flex justify-end">
        <FormButton type="submit" class="px-3 py-1 text-sm">
          Save
        </FormButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { awardeeService } from '~/api/AwardeeService'
import { stallOwnerService } from '~/api/StallOwnerService'
import * as yup from "yup";

const { showError, showSuccess, showConfirmOkay } = useSweetLoading()

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
    children: [], // children array
    employees: [],   // employees array
    files: [],                // file list
    selectedFile: null,       // temp selected file
    selectedFileType: 'CONTRACT', // dropdown default

    // Business info fields
    // contractStartDate: '',
    // periodOfContract: '',
    // businessId: '',
    // businessPlateNo: '',
    // businessStarted: '',
    // capital: '',
    // lineOfBusiness: ''
  },
  errors: {} // validation errors
})

const previewUrl = ref(null)
const fileInput = ref(null)

function onFileChange(event) {
  const file = event.target.files?.[0]
  if (file) {
    state.form.attachIdPhoto = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

function removeImage() {
  previewUrl.value = null
  if (fileInput.value) {
    fileInput.value.value = "" // reset input so user can re-upload same file
  }
}

// Add child row
function addChild() {
  state.form.children.push({
    childName: '',
    childBDate: ''
  })
}

// Remove child row
function removeChild(index) {
  state.form.children.splice(index, 1)
}

// Add employee row
function addEmployee() {
  state.form.employees.push({
    employeeName: '',
    dateOfBirth: '',
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

const fileTypes = [
  { label: 'CONTRACT', value: 'CONTRACT' },
  { label: 'PHOTO', value: 'PHOTO' },
  { label: 'OTHERS', value: 'WIDOWED' },
]

//files
function onFileUploadChange(e) {
  state.form.selectedFile = e.target.files[0] || null
}

function attachFile() {
  if (!state.form.selectedFile) return
  state.form.files.push({
    filePath: state.form.selectedFile,
    attachFileType: state.form.selectedFileType
  })
  console.log(state.form.files)
  state.form.selectedFile = null
  document.getElementById('file-upload').value = '' // reset input
}

function removeFile(index) {
  state.form.files.splice(index, 1)
}
//end files

// Define form schema
const FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

const awardeeSchema = yup.object({
  lastname: yup.string().required("Lastname is required"),
  firstname: yup.string().required("Firstname is required"),
  midinit: yup
  .string().nullable()
  .min(1, "Middle Initial must be at least 1 character")
  .max(1, "Middle Initial must not exceed 1 character"),
  civilStatus: yup.string().required("Civil status is required"),
  address: yup.string().required("Address is required"),
  spouseLastname: yup.string().nullable(),
  spouseFirstname: yup.string().nullable(),
  spouseMidint: yup.string().nullable(),
  contactnumber: yup
    .string()
    .required("Contact number is required")
    .matches(/^[0-9]+$/, "Contact number must be numbers only")
    .min(11, "Contact number must be at least 11 digits")
    .max(11, "Contact number must not exceed 11 digits"),
  attachIdPhoto: yup
    .mixed()
    .required("ID Photo is required")
    .test("fileSize", "File too large (max 2MB)", (file) => {
      return !file || (file && file.size <= FILE_SIZE);
    })
    .test("fileType", "Unsupported file format", (file) => {
      return !file || (file && SUPPORTED_FORMATS.includes(file.type));
    }),
});

// async function awardeeAddForm() {
//   try {
//     // Validate state.form before sending
//     await awardeeSchema.validate(state.form, { abortEarly: false });

//     const formData = objectToFormData(state.form);
//     let params = formData;

//     const response = await awardeeService.create(params);
//     if (response) {
//       const confirmed = await showConfirmOkay("Success", "Awardee saved successfully.");
//       if (!confirmed) return;
//       window.location.reload();
//     }
//   } catch (error) {
//     let errorMessages = [];

//     if (error.name === "ValidationError") {
//       // Handle frontend validation errors
//       error.inner.forEach((err) => {
//         errorMessages.push(err.message);
//       });
//       showError("", errorMessages.join("<br>"));
//     } else {
//       // Handle backend/Laravel validation errors
//       if (error.errors) {
//         Object.entries(error.errors).forEach(([field, messages]) => {
//           messages.forEach((message) => {
//             errorMessages.push(`${field}: ${message}`);
//           });
//         });
//         showError("Server Validation", errorMessages.join("<br>"));
//       } else {
//         showError("", error.message || "An error occurred while saving the awardee.");
//       }
//     }
//   }
// }

async function awardeeAddForm() {
  try {
    state.errors = {}; // reset errors

    // frontend validation
    await awardeeSchema.validate(state.form, { abortEarly: false });

    // prepare formData
    const formData = objectToFormData(state.form);

    const response = await stallOwnerService.create(formData);
    if (response) {
      const confirmed = await showConfirmOkay("Success", "Awardee saved successfully.");
      if (!confirmed) return;
      window.location.reload();
    }
  } catch (error) {
    state.errors = {}; // clear old errors
    let errorMessages = [];

    if (error.name === "ValidationError") {
      // Yup validation errors
      error.inner.forEach((err) => {
        if (!state.errors[err.path]) {
          state.errors[err.path] = err.message;
        }
        errorMessages.push(err.message);
      });
      showError("Validation Failed", errorMessages.join("<br>"));
    } else if (error.errors) {
      // Laravel backend validation errors
      Object.entries(error.errors).forEach(([field, messages]) => {
        state.errors[field] = messages[0]; // first error
        messages.forEach((msg) => errorMessages.push(`${field}: ${msg}`));
      });
      showError("Server Validation", errorMessages.join("<br>"));
    } else {
      showError("", error.message || "An error occurred while saving the awardee.");
    }
  }
}


//format the object form before sending to backend to FormData since it contains file object
function objectToFormData(obj, form = new FormData(), namespace = '') {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue
    const formKey = namespace ? `${namespace}[${key}]` : key
    const value = obj[key]

    if (value instanceof File) {
      form.append(formKey, value)
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (typeof v === 'object' && !(v instanceof File)) {
          objectToFormData(v, form, `${formKey}[${i}]`)
        } else {
          form.append(`${formKey}[${i}]`, v)
        }
      })
    } else if (typeof value === 'object' && value !== null) {
      objectToFormData(value, form, formKey)
    } else {
      form.append(formKey, value ?? '')
    }
  }
  return form
}

</script>
