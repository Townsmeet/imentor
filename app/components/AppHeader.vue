<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/dashboard" class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:academic-cap" class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            iMentorsPro
          </span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="/dashboard" 
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            active-class="text-blue-600 dark:text-blue-400"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/mentors" 
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            active-class="text-blue-600 dark:text-blue-400"
          >
            Find Mentors
          </NuxtLink>
          <NuxtLink 
            to="/sessions" 
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            active-class="text-blue-600 dark:text-blue-400"
          >
            Sessions
          </NuxtLink>
          <NuxtLink 
            to="/messages" 
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative"
            active-class="text-blue-600 dark:text-blue-400"
          >
            Messages
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </NuxtLink>
        </nav>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <UButton
            icon="heroicons:bell"
            variant="ghost"
            color="gray"
            size="sm"
            class="relative"
          >
            <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </UButton>

          <!-- User Dropdown -->
          <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
            <UButton
              variant="ghost"
              color="gray"
              class="flex items-center space-x-2"
            >
              <UAvatar
                :src="user?.avatar"
                :alt="`${user?.firstName} ${user?.lastName}`"
                size="sm"
              />
              <span class="hidden sm:block text-sm font-medium">
                {{ user?.firstName }}
              </span>
              <Icon name="heroicons:chevron-down" class="w-4 h-4" />
            </UButton>
          </UDropdown>

          <!-- Mobile Menu Button -->
          <UButton
            icon="heroicons:bars-3"
            variant="ghost"
            color="gray"
            size="sm"
            class="md:hidden"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          />
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
        <nav class="flex flex-col space-y-2">
          <NuxtLink 
            to="/dashboard" 
            class="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors rounded-md"
            active-class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
            @click="isMobileMenuOpen = false"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/mentors" 
            class="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors rounded-md"
            active-class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
            @click="isMobileMenuOpen = false"
          >
            Find Mentors
          </NuxtLink>
          <NuxtLink 
            to="/sessions" 
            class="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors rounded-md"
            active-class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
            @click="isMobileMenuOpen = false"
          >
            Sessions
          </NuxtLink>
          <NuxtLink 
            to="/messages" 
            class="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors rounded-md"
            active-class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
            @click="isMobileMenuOpen = false"
          >
            Messages
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const isMobileMenuOpen = ref(false)

// Mock data - replace with actual data later
const unreadCount = ref(2)
const notificationCount = ref(3)

const userMenuItems = [
  [{
    label: 'Profile',
    icon: 'heroicons:user',
    click: () => navigateTo('/profile')
  }],
  [{
    label: 'Settings',
    icon: 'heroicons:cog-6-tooth',
    click: () => navigateTo('/settings')
  }],
  [{
    label: 'Sign out',
    icon: 'heroicons:arrow-right-on-rectangle',
    click: logout
  }]
]

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
  isMobileMenuOpen.value = false
})
</script>
