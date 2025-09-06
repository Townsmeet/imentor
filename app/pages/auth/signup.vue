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
        Create your account
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Join thousands of professionals growing their careers
      </p>
    </div>

    <!-- Role Selection -->
    <div class="mb-8">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        I want to:
      </p>
      <div class="grid grid-cols-2 gap-4">
        <button
          @click="signupForm.role = 'mentee'"
          :class="[
            'p-4 rounded-xl border-2 transition-all duration-200',
            signupForm.role === 'mentee'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
        >
          <Icon name="heroicons:user" class="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p class="font-medium text-gray-900 dark:text-white">Find a Mentor</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Learn from experts</p>
        </button>
        
        <button
          @click="signupForm.role = 'mentor'"
          :class="[
            'p-4 rounded-xl border-2 transition-all duration-200',
            signupForm.role === 'mentor'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
        >
          <Icon name="heroicons:academic-cap" class="w-6 h-6 mx-auto mb-2 text-purple-600" />
          <p class="font-medium text-gray-900 dark:text-white">Become a Mentor</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Share your expertise</p>
        </button>
        
        <!-- Admin option (hidden by default, can be enabled for testing) -->
        <button
          v-if="showAdminOption"
          @click="signupForm.role = 'admin'"
          :class="[
            'p-4 rounded-xl border-2 transition-all duration-200',
            signupForm.role === 'admin'
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
        >
          <Icon name="heroicons:shield-check" class="w-6 h-6 mx-auto mb-2 text-red-600" />
          <p class="font-medium text-gray-900 dark:text-white">Admin Access</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Platform management</p>
        </button>
      </div>
    </div>

    <UForm
      :schema="signupSchema"
      :state="signupForm"
      @submit="handleSignup"
      class="space-y-6"
    >

      <UFormField label="Email" name="email" required>
        <UInput
          v-model="signupForm.email"
          type="email"
          placeholder="john@example.com"
          icon="heroicons:envelope"
          size="lg"
          :disabled="isLoading"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput
          v-model="signupForm.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Create a strong password"
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

      <UFormField label="Confirm Password" name="confirmPassword" required>
        <UInput
          v-model="signupForm.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm your password"
          icon="heroicons:lock-closed"
          size="lg"
          :disabled="isLoading"
          class="w-full"
        >
          <template #trailing>
            <UButton
              :icon="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="showConfirmPassword = !showConfirmPassword"
              :disabled="isLoading"
            />
          </template>
        </UInput>
      </UFormField>

      <div class="space-y-4">
        <div class="flex items-start space-x-3">
          <input
            id="agreeToTerms"
            v-model="signupForm.agreeToTerms"
            type="checkbox"
            :disabled="isLoading"
            class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="agreeToTerms" class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            I agree to the 
            <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms of Service</a>
            and 
            <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>
          </label>
        </div>

        <div class="flex items-start space-x-3">
          <input
            id="subscribeToUpdates"
            v-model="signupForm.subscribeToUpdates"
            type="checkbox"
            :disabled="isLoading"
            class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="subscribeToUpdates" class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            Send me updates about new features and mentorship opportunities
          </label>
        </div>
      </div>

      <UButton
        type="submit"
        size="lg"
        block
        :loading="isLoading"
        :disabled="isLoading || !signupForm.agreeToTerms"
        icon="heroicons:user-plus"
      >
        Create Account
      </UButton>
    </UForm>

    <div class="mt-8 text-center">
      <p class="text-gray-600 dark:text-gray-400">
        Already have an account?
        <NuxtLink
          to="/auth/login"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { UserRole } from '~/types'

definePageMeta({
  layout: 'auth'
})

const { signup } = useAuth()
const toast = useToast()
const route = useRoute()

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showAdminOption = ref(false) // Enable for testing: set to true

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['mentor', 'mentee', 'admin']),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  subscribeToUpdates: z.boolean().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

const signupForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  role: (route.query.role as UserRole) || 'mentee',
  agreeToTerms: false,
  subscribeToUpdates: true
})

const handleSignup = async () => {
  isLoading.value = true
  
  try {
    const result = await signup({
      email: signupForm.email,
      password: signupForm.password,
      role: signupForm.role
    })
    
    if (result.success) {
      toast.add({
        title: 'Welcome to iMentorsPro!',
        description: 'Your account has been created successfully.',
        color: 'success'
      })
      
      // Redirect new users to onboarding
      if (result.isNewUser) {
        await navigateTo('/onboarding')
      } else {
        await navigateTo('/dashboard')
      }
    } else {
      toast.add({
        title: 'Registration failed',
        description: result.error || 'Failed to create account. Please try again.',
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
</script>
