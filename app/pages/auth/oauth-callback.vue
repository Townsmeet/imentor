<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { user, refreshSession, hasCompletedOnboarding } = useAuth()
const toast = useToast()
const route = useRoute()

// Handle OAuth redirect
onMounted(async () => {
  // Wait a moment for auth state to settle
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Refresh session to get the latest user data
  if (!user.value) {
    await refreshSession()
  }

  // If still no user, redirect to login
  if (!user.value) {
    toast.add({
      title: 'Authentication failed',
      description: 'Unable to complete sign in. Please try again.',
      color: 'error'
    })
    navigateTo('/auth/login')
    return
  }

  // Get the role from query param or sessionStorage (set before OAuth redirect)
  const roleFromQuery = route.query.role as string
  const roleFromStorage = sessionStorage.getItem('pendingOAuthRole')
  const pendingRole = roleFromQuery || roleFromStorage
  
  // Clear the stored role
  sessionStorage.removeItem('pendingOAuthRole')

  // If this is a new user (hasn't completed onboarding) and we have a pending role, update it
  if (!hasCompletedOnboarding.value && pendingRole && ['mentor', 'mentee'].includes(pendingRole)) {
    try {
      // Update the user's role via API
      await $fetch('/api/auth/update-role', {
        method: 'POST',
        body: { role: pendingRole }
      })
      // Refresh session to get updated role
      await refreshSession()
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  // Show success message
  toast.add({
    title: 'Successfully signed in!',
    description: `Welcome${user.value.firstName ? ', ' + user.value.firstName : ''}!`,
    color: 'success'
  })

  // Check onboarding status and redirect accordingly
  if (!hasCompletedOnboarding.value) {
    // New user or incomplete onboarding -> start/continue onboarding
    // OAuth users have verified emails, so they might skip email verification step
    navigateTo('/onboarding')
  } else {
    // Existing user with completed onboarding -> go to dashboard
    if (user.value.role === 'admin') {
      navigateTo('/admin')
    } else {
      navigateTo('/dashboard')
    }
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh]">
    <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
      <Icon name="heroicons:academic-cap" class="w-8 h-8 text-white" />
    </div>
    
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Completing sign in...
    </h2>
    
    <p class="text-gray-600 dark:text-gray-400 text-center max-w-md">
      Please wait while we set up your account
    </p>

    <div class="mt-8 flex space-x-2">
      <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
      <div class="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
      <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
    </div>
  </div>
</template>
