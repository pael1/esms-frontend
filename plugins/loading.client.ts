import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default defineNuxtPlugin(() => {
  const state = reactive({
    isPageLoading: false
  })

  function startLoading() {
    state.isPageLoading = true
    NProgress.start()
  }

  function stopLoading() {
    state.isPageLoading = false
    NProgress.done()
  }

  // Expose globally with provide()
  return {
    provide: {
      loading: {
        state,
        start: startLoading,
        stop: stopLoading
      }
    }
  }
})
