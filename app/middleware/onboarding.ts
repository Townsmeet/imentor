export default defineNuxtRouteMiddleware((to) => {
  const { user, isAuthenticated, hasCompletedOnboarding, initializeAuth } = useAuth()

  if (process.client) {
    initializeAuth()
  }

  // Only apply to authenticated users
  if (!isAuthenticated.value || !user.value) {
    return
  }

  // Skip onboarding check for onboarding pages and auth pages
  if (to.path.startsWith('/onboarding') || to.path.startsWith('/auth')) {
    return
  }

  if (!hasCompletedOnboarding.value) {
    return navigateTo('/onboarding')
  }
})
