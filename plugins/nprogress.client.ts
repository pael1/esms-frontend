import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Trigger on route navigation
  nuxtApp.hook('page:start', () => {
    NProgress.start()
  })
  nuxtApp.hook('page:finish', () => {
    NProgress.done()
  })
})
