export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('capitalizeWords', (text: string) => {
        return text
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
    })
})
