<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="flex min-h-screen">
      <!-- Left Side - Branding -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 pointer-events-none"></div>
        <div class="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <NuxtLink to="/" class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 hover:bg-white/30 transition-colors">
            <Icon name="heroicons:academic-cap" class="w-10 h-10 text-white" />
          </NuxtLink>
          
          <h1 class="text-4xl font-bold mb-4 text-center">
            Welcome to iMentorsPro
          </h1>
          
          <p class="text-xl text-blue-100 text-center max-w-md mb-8">
            Connect with world-class mentors and accelerate your career growth
          </p>

          <div class="grid grid-cols-1 gap-6 max-w-sm">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon name="heroicons:users" class="w-4 h-4 text-white" />
              </div>
              <span class="text-blue-100">Expert mentors from top companies</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon name="heroicons:calendar-days" class="w-4 h-4 text-white" />
              </div>
              <span class="text-blue-100">Flexible scheduling that fits your life</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon name="heroicons:rocket-launch" class="w-4 h-4 text-white" />
              </div>
              <span class="text-blue-100">Accelerate your career growth</span>
            </div>
          </div>
        </div>

        <!-- Decorative Elements -->
        <div class="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div class="absolute bottom-20 right-20 w-40 h-40 bg-purple-300/20 rounded-full blur-xl pointer-events-none"></div>
        <div class="absolute top-1/2 left-10 w-24 h-24 bg-blue-300/20 rounded-full blur-xl pointer-events-none"></div>
      </div>

      <!-- Right Side - Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-20">
        <div class="w-full max-w-md">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
