import { useUserStore } from '@/store/user'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useUserStore()

  // If user is NOT logged in
  if (!auth.getUser) {
    // Allow access to login pages
    if (to.path === '/') return

    // Otherwise, redirect to login
    return navigateTo('/')
  }
  // Prevent access to login page once logged in
  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
