export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('capitalizeWords', (text: string | null | undefined) => {
    // Return "--" if empty, null, undefined, or only spaces
    if (!text || text.trim() === '') {
      return '--'
    }

    return text
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  })
})
