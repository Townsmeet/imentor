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
        Join iMentor
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Choose how you want to use the platform
      </p>
    </div>

    <!-- Role Selection -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 gap-4">
        <button
          type="button"
          @click="selectRole('mentee')"
          class="group p-6 rounded-2xl border-2 transition-all duration-200 text-left flex items-center space-x-4 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <Icon name="heroicons:user" class="w-6 h-6 text-blue-600 group-hover:text-white" />
          </div>
          <div>
            <p class="font-bold text-lg text-gray-900 dark:text-white">Find a Mentor</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Learn from industry experts and grow your career</p>
          </div>
          <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-600" />
        </button>
        
        <button
          type="button"
          @click="selectRole('mentor')"
          class="group p-6 rounded-2xl border-2 transition-all duration-200 text-left flex items-center space-x-4 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
            <Icon name="heroicons:academic-cap" class="w-6 h-6 text-purple-600 group-hover:text-white" />
          </div>
          <div>
            <p class="font-bold text-lg text-gray-900 dark:text-white">Become a Mentor</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Share your expertise and guide the next generation</p>
          </div>
          <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 ml-auto group-hover:text-purple-600" />
        </button>
      </div>

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
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '~/types'

definePageMeta({
  layout: 'auth'
})

const route = useRoute()

const selectRole = (role: UserRole) => {
  const query: any = { role }
  if (route.query.redirect) {
    query.redirect = route.query.redirect
  }
  
  navigateTo({
    path: '/auth/register',
    query
  })
}
</script>

