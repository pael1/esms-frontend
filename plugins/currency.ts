export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('formatPeso', (value: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(value)
    })
})
