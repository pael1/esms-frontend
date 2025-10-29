export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('formatPeso', (value: any) => {
    if (value == null || value === '') return '₱0.00'

    // Convert string like "2,010.20" → 2010.20
    const numericValue = typeof value === 'string'
      ? parseFloat(value.replace(/,/g, ''))
      : value

    if (isNaN(numericValue)) return '₱0.00'

    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(numericValue)
  })
})
