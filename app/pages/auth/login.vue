<template>
  <div>
    <!-- Logo for mobile -->
    <div class="lg:hidden flex justify-center mb-8">
      <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
        <Icon name="heroicons:academic-cap" class="w-8 h-8 text-white" />
      </div>
    </div>

    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome back
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Sign in to your account to continue
      </p>
    </div>

    <UForm
      :schema="loginSchema"
      :state="loginForm"
      @submit="handleLogin"
      class="space-y-6"
    >
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="loginForm.email"
          type="email"
          placeholder="Enter your email"
          icon="heroicons:envelope"
          size="lg"
          :disabled="isLoading"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput
          v-model="loginForm.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          icon="heroicons:lock-closed"
          size="lg"
          :disabled="isLoading"
          class="w-full"
        >
          <template #trailing>
            <UButton
              :icon="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="showPassword = !showPassword"
              :disabled="isLoading"
            />
          </template>
        </UInput>
      </UFormField>

      <div class="flex items-center justify-end">
        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Forgot password?
        </NuxtLink>
      </div>

      <UButton
        type="submit"
        size="lg"
        block
        :loading="isLoading"
        :disabled="isLoading"
        icon="heroicons:arrow-right-on-rectangle"
      >
        Sign In
      </UButton>
    </UForm>

    <div class="mt-8 text-center">
      <p class="text-gray-600 dark:text-gray-400">
        Don't have an account?
        <NuxtLink
          to="/auth/signup"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'auth'
})

const { login, user, hasCompletedOnboarding } = useAuth()
const toast = useToast()

const isLoading = ref(false)
const showPassword = ref(false)

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const loginForm = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    const result = await login(loginForm.email, loginForm.password)
    
    if (result.success) {
      toast.add({
        title: 'Welcome back!',
        description: 'You have been successfully signed in.',
        color: 'success'
      })
      
      // Redirect based on onboarding status and role
      if (!hasCompletedOnboarding.value) {
        await navigateTo('/onboarding')
      } else if (user.value?.role === 'admin') {
        await navigateTo('/admin')
      } else {
        await navigateTo('/dashboard')
      }
    } else {
      // Check for email verification error
      if (result.error?.toLowerCase().includes('verify') || result.error?.toLowerCase().includes('verification')) {
        toast.add({
          title: 'Email not verified',
          description: 'Please verify your email before signing in.',
          color: 'warning'
        })
        await navigateTo(`/auth/verify-email?email=${encodeURIComponent(loginForm.email)}`)
      } else {
        toast.add({
          title: 'Sign in failed',
          description: result.error || 'Invalid credentials. Please try again.',
          color: 'error'
        })
      }
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
