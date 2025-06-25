<template>
    <form @submit.prevent="submitForm" class="mt-6 max-w-3xl" autocomplete="off">
        <div class="grid grid-cols-1 gap-y-3">
            <div class="space-y-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <FormLabel for="firstname" label="First name" />
                        <FormText name="firstname" v-model="state.clientForm.firstname" />
                        <FormError :error="v$?.clientForm?.firstname?.$errors[0]?.$message.toString()" />
                        <FormError :error="state.error?.errors?.firstname?.[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="middlename" label="Middle name" />
                        <FormText name="middlename" v-model="state.clientForm.middlename" />
                        <FormError :error="v$?.clientForm?.middlename?.$errors[0]?.$message.toString()" />
                        <FormError :error="state.error?.errors?.middlename?.[0]" />
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <FormLabel for="lastname" label="Last name" />
                        <FormText name="lastname" v-model="state.clientForm.lastname" />
                        <FormError :error="v$?.clientForm?.lastname?.$errors[0]?.$message.toString()" />
                        <FormError :error="state.error?.errors?.lastname?.[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="contactnumber" label="Contact number" />
                        <FormText name="contactnumber" v-model="state.clientForm.contact_no" />
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <FormLabel for="birthdate" label="Date of birth" />
                        <FormDate name="birthdate" v-model="state.clientForm.birthdate" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="sex" label="Sex" />
                        <FormSelect id="sex" name="sex" :options="state.genders" v-model="state.clientForm.sex" />
                        <FormError :error="v$?.clientForm?.sex?.$errors[0]?.$message.toString()" />
                        <FormError :error="state.error?.errors?.sex?.[0]" />
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <FormLabel for="age" label="Age" />
                        <FormNumber name="age" v-model="state.clientForm.age" />
                        <FormError :error="v$?.clientForm?.age?.$errors[0]?.$message.toString()" />
                        <FormError :error="state.error?.errors?.age?.[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="civil_status" label="Civil status" />
                        <FormSelect id="civil_status" name="civil_status" :options="state.civil_statuses"
                            v-model="state.clientForm.civil_status" />
                        <FormError :error="v$?.clientForm?.civil_status?.$errors[0]?.$message.toString()" />
                        <FormError :error="state.error?.errors?.civil_status?.[0]" />
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <FormLabel for="education" label="Educational attainment" />
                        <FormSelect id="education" name="education" :options="state.educations"
                            v-model="state.clientForm.educ_attain" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="barangay" label="Barangay" />
                        <FormSelect id="barangay" name="barangay" :options="state.barangays.options"
                            v-model="state.clientForm.barangay_id" />
                        <FormError :error="v$?.clientForm?.barangay_id?.$errors[0]?.$message.toString()" />
                        <FormError :error="state.error?.errors?.barangay_id?.[0]" />
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <FormLabel for="occupation" label="Occupation" />
                        <FormSelect id="occupation" name="occupation" :options="state.occupations.options"
                            v-model="state.clientForm.occupation_id" />
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <FormLabel for="ethnicity" label="Ethnicity" />
                        <FormSelect id="ethnicity" name="ethnicity" :options="state.ethnicities"
                            v-model="state.clientForm.ethnicity" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="fourPs" label="4Ps Beneficiary" />
                        <FormSelect id="fourPs" name="fourPs" :options="state.fourPs.options"
                            v-model="state.clientForm.is_4ps_beneficiary" />
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <FormLabel for="homeAddress" label="Home address" />
                        <FormTextArea name="homeAddress" v-model="state.clientForm.home_address" />
                        <FormError :error="v$?.clientForm?.home_address?.$errors[0]?.$message.toString()" />
                        <FormError :error="state.error?.errors?.home_address?.[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="workAddress" label="Work address" />
                        <FormTextArea name="workAddress" v-model="state.clientForm.work_address" />
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-center mt-2">
                <FormButton type="submit" class="w-full">
                    Submit
                </FormButton>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core"
import { required, minValue, helpers } from '@vuelidate/validators'
import { barangayService } from '@/components/api/BarangayService'
import { occupationService } from '@/components/api/OccupationService'
import { clientService } from "@/components/api/ClientService"

const props = defineProps({
    params: {
        type: Object,
        required: false,
    }
})

const state = reactive({
    clientForm: {
        firstname: props?.params?.firstname ?? '',
        middlename: props?.params?.middlename ?? '',
        lastname: props?.params?.lastname ?? '',
        contact_no: '',
        birthdate: '',
        sex: '',
        age: '',
        civil_status: '',
        educ_attain: '',
        occupation_id: '',
        barangay_id: '',
        home_address: '',
        work_address: '',
        ethnicity: '',
        is_4ps_beneficiary: '',
    },
    genders: ['male', 'female'],
    civil_statuses: ['single', 'married', 'widowed', 'divorced'],
    educations: ['elementary', 'high school', 'senior highschool', 'vocational', 'college', 'post graduate', 'als', 'no information'],
    ethnicities: ['non-ip', 'ip', 'muslim'],
    barangays: {
        options: []
    },
    occupations: {
        options: []
    },
    fourPs: {
        options: [
            { value: true, label: 'member' },
            { value: false, label: 'non-member' },
        ]
    },
})

const emit = defineEmits(['isPageLoading', 'submitForm'])

onMounted(() => {
    fetchBarangays()
    fetchOccupations()
    fetchClient()
})

async function fetchClient() {
    if (props.params?.uuid) {
        emit('isPageLoading', true)
        try {
            const response = await clientService.getClient(props.params?.uuid)
            if (response.data) {
                state.clientForm.firstname = response.data.firstname
                state.clientForm.middlename = response.data.middlename
                state.clientForm.lastname = response.data.lastname
                state.clientForm.contact_no = response.data.contact_no
                state.clientForm.birthdate = response.data.birthdate
                state.clientForm.sex = response.data.sex
                state.clientForm.age = response.data.age
                state.clientForm.civil_status = response.data.civil_status
                state.clientForm.educ_attain = response.data.educ_attain
                state.clientForm.occupation_id = response.data.occupation_id
                state.clientForm.barangay_id = response.data.barangay_id
                state.clientForm.home_address = response.data.home_address
                state.clientForm.work_address = response.data.work_address
                state.clientForm.ethnicity = response.data.ethnicity
                state.clientForm.is_4ps_beneficiary = response.data.is_4ps_beneficiary
            }
        } catch (error) {
            console.log(error)
        }
        emit('isPageLoading', false)
    }
}

async function fetchBarangays() {
    emit('isPageLoading', true)
    try {
        const response = await barangayService.getBarangays()
        if (response.data) {
            let options: any = []
            response.data.forEach(
                (item: any) => options.push({
                    value: item.id,
                    label: item.brgy_name,
                })
            )
            state.barangays.options = options
        }
    } catch (error) {
        console.log(error)
    }
    emit('isPageLoading', false)
}

async function fetchOccupations() {
    emit('isPageLoading', true)
    try {
        const response = await occupationService.getOccupations()
        if (response.data) {
            let options: any = []
            response.data.forEach(
                (item: any) => options.push({
                    value: item.id,
                    label: item.name,
                })
            )
            state.occupations.options = options
        }
    } catch (error) {
        console.log(error)
    }
    emit('isPageLoading', false)
}

const rules = computed(() => {
    return {
        clientForm: {
            firstname: {
                required: helpers.withMessage('This field is required.', required),
            },
            middlename: {
                required: helpers.withMessage('This field is required.', required),
            },
            lastname: {
                required: helpers.withMessage('This field is required.', required),
            },
            barangay_id: {
                required: helpers.withMessage('This field is required.', required),
            },
            sex: {
                required: helpers.withMessage('This field is required.', required),
            },
            civil_status: {
                required: helpers.withMessage('This field is required.', required),
            },
            home_address: {
                required: helpers.withMessage('This field is required.', required),
            },
            age: {
                minValue: helpers.withMessage('Age must be greater than 0.', minValue(1)),
            },
        }
    }
})

const v$ = useVuelidate(rules, state)

function submitForm() {
    v$.value.$validate()
    if (!v$.value.$error) {
        emit('submitForm', state.clientForm)
    }
}
</script>