import { authService } from '~/api/AuthService'
import { useUserStore } from '@/store/user'
import { useParameterStore } from '@/store/parameter'
import { useMarketcodeStore } from '~/store/marketcode'

const userStore = useUserStore()
const parameterStore = useParameterStore()
const marketStore = useMarketcodeStore()
const { showWarning } = useSweetLoading()

export function useIdle(timeout = 60 * 60 * 1000) { // 60 min default
  let timer: ReturnType<typeof setTimeout> | null = null

  function resetTimer() {
    if (timer) clearTimeout(timer)
    timer = setTimeout(async () => {   // ✅ make callback async
        showWarning('', 'Your session has expired due to inactivity. You have been logged out.')
        try {
            const response = await authService.logout()
            if (response?.message) {
                localStorage.removeItem('_token')
                userStore.resetUser()
                parameterStore.resetSectionCode()
                marketStore.resetMarketCode()

                // redirect back to login page
                await navigateTo('/')
            }
        } catch (error) {
            console.error("Logout failed:", error)
            localStorage.removeItem('_token')
            userStore.resetUser()
            parameterStore.resetSectionCode()
            marketStore.resetMarketCode()
            await navigateTo('/')
            }
        }, timeout)
    }

  function setup() {
    // reset on user activity
    window.addEventListener("mousemove", resetTimer)
    window.addEventListener("keydown", resetTimer)
    window.addEventListener("click", resetTimer)
    window.addEventListener("scroll", resetTimer)
    resetTimer()
  }

  function cleanup() {
    if (timer) clearTimeout(timer)
    window.removeEventListener("mousemove", resetTimer)
    window.removeEventListener("keydown", resetTimer)
    window.removeEventListener("click", resetTimer)
    window.removeEventListener("scroll", resetTimer)
  }

  return { setup, cleanup, resetTimer }
}
