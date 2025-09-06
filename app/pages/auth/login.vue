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

      <div class="flex items-center justify-between">
        <UCheckbox
          v-model="loginForm.rememberMe"
          label="Remember me"
          :disabled="isLoading"
        />
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

    <!-- Demo Credentials -->
    <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <p class="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">Demo Credentials:</p>
      <div class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
        <p><strong>Email:</strong> demo@example.com</p>
        <p><strong>Password:</strong> password123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'auth'
})

const { login } = useAuth()
const toast = useToast()

const isLoading = ref(false)
const showPassword = ref(false)

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
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
      
      await navigateTo('/dashboard')
    } else {
      toast.add({
        title: 'Sign in failed',
        description: result.error || 'Invalid credentials. Please try again.',
        color: 'error'
      })
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

// Auto-fill demo credentials for easier testing
onMounted(() => {
  loginForm.email = 'demo@example.com'
  loginForm.password = 'password123'
})
</script>
