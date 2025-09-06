export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, initializeAuth } = useAuth()
  
  // Initialize auth state on client side
  if (process.client) {
    initializeAuth()
  }
  
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
})
