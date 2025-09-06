export default defineNuxtPlugin(() => {
  const { initializeAuth } = useAuth()
  
  // Initialize authentication state on client side
  initializeAuth()
})
