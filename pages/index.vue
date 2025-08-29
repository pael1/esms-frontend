<template>
    <div class="flex h-screen flex-1">
        <Loader v-if="$loading.state.isPageLoading" />
        <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
            <div class="flex flex-col min-h-full">
                <div class="mx-auto w-full max-w-sm lg:w-96 flex-grow">
                    <div>
                        <div class="flex justify-center">
                            <NuxtLink to="/" class="text-green-400 hover:text-green-500">
                                <img class="w-[150px]" src="/public/images/logo2.png" alt="Your Company">
                            </NuxtLink>
                        </div>
                        <div class="flex justify-center">
                            <h2 class="text-2xl font-bold leading-9 tracking-tight text-green-700">
                                e-Stall Management System
                            </h2>
                        </div>
                    </div>

                    <div class="mt-5">
                        <Alert v-if="state.error" :message="state.error" />
                        <form @submit.prevent="login" class="space-y-6" autocomplete="off">
                            <div>
                                <FormLabel for="username" label="username" />
                                <div class="mt-2">
                                    <FormText name="username" v-model="state.username" />
                                    <FormError :error="v$?.clientForm?.home_address?.$errors[0]?.$message.toString()" />
                                    <FormError :error="state.error?.errors?.home_address?.[0]" />
                                </div>
                            </div>

                            <div>
                                <FormLabel for="password" label="Password" />
                                <div class="mt-2 flex rounded-md shadow-sm">
                                    <div class="relative flex flex-grow items-stretch focus-within:z-10">
                                        <FormPassword :type="state.type" name="password" v-model="state.password" />
                                    </div>
                                    <button type="button" @click="viewPassword"
                                        class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-green-900 ring-1 ring-inset ring-green-300 hover:bg-green-50">
                                        <EyeIcon v-if="!state.showPassword" class="-ml-0.5 h-5 w-5 text-green-500" />
                                        <EyeSlashIcon v-else class="-ml-0.5 h-5 w-5 text-green-500" />
                                    </button>
                                </div>
                                <FormError :error="v$?.clientForm?.home_address?.$errors[0]?.$message.toString()" />
                                <FormError :error="state.error?.errors?.home_address?.[0]" />
                            </div>

                            <div>
                                <FormButton class="w-full">Sign in</FormButton>
                            </div>
                        </form>
                    </div>
                </div>

                <footer class="bg-white">
                    <div class="grid grid-cols-1">
                        <div class="flex justify-center">
                            <a href="https://www.davaocity.gov.ph/" class="text-green-400 hover:text-green-500">
                                <img class="w-36" src="/public/images/dc_logo.png" alt="Your Company">
                            </a>
                        </div>
                        <div class="flex justify-center mt-2">
                            <p class="text-center text-xs leading-5 text-green-500">
                                &copy; 2024 City Government of Davao City.<br>All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
        <div class="relative hidden w-0 flex-1 lg:block">
            <img class="absolute inset-0 h-full w-full object-cover" src="/public/images/bg_stall.jpg" alt="" />
            <div class="absolute inset-0 bg-green-900 opacity-60"></div>
        </div>
    </div>
</template>

<script setup>
import { authService } from '~/api/AuthService'
import { useUserStore } from '@/store/user'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useParameterStore } from '@/store/parameter'
import { useMarketcodeStore } from '@/store/marketcode'
import { parameterService } from '~/api/ParameterService'
import NProgress from 'nprogress'

const userStore = useUserStore()
const parameterStore = useParameterStore()
const marketStore = useMarketcodeStore()

//global loading
const { $loading } = useNuxtApp()

const state = reactive({
    username: null,
    password: null,
    showPassword: false,
    type: 'password',
    error: null,
    // isPageLoading: false,
})

const rules = computed(() => {
    return {
        username: {
            required: helpers.withMessage('This field is required.', required),
        },
        password: {
            required: helpers.withMessage('This field is required.', required),
        },
    }
})

const v$ = useVuelidate(rules, state)

async function login() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        $loading.start()
        try {
            let params = {
                username: state.username,
                password: state.password
            }
            const response = await authService.login(params)
            if (response.data) {
                localStorage.setItem("_token", response.data.token)
                userStore.setUser(response.data.user.user_detail)

                //set user section and market code
                fetchMarkets()  
                fetchSectionCodes()  

                await navigateTo(`/dashboard`)
            }
        } catch (error) {
            state.error = error
        }
        $loading.stop()
    }
}

async function fetchSectionCodes() {
  try {
    const response = await parameterService.getParameter({ fieldId: 'SECTIONCODE' })
    if (response) {
        let options = response.data.map((item) => ({
            value: item.fieldValue,
            label: item.fieldDescription
        }));
        parameterStore.setSectionCode(options)
    }
  } catch (error) {
    console.error(error)
  }
}

async function fetchMarkets() {
  try {
    const response = await parameterService.getMarkets({ fieldId: 'MARKETCODE' })
    if (response) {
        let options = response.data.map((item) => ({
            value: item.fieldValue,
            label: item.fieldDescription
        }));
        marketStore.setMarketCode(options)
    }
  } catch (error) {
    console.error(error)
  }
}

function viewPassword() {
    if (!state.showPassword) {
        state.showPassword = true
        state.type = 'text'
    } else {
        state.showPassword = false
        state.type = 'password'
    }
}

</script>