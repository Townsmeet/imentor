<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="heroicons:academic-cap" class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">iMentorsPro</span>
          </NuxtLink>
          
          <UButton variant="ghost" color="neutral" @click="exitFlow">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </UButton>
        </div>
      </div>
    </nav>

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Step {{ currentStep }} of {{ totalSteps }}
          </p>
          <button 
            v-if="currentStep > 1"
            @click="previousStep"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-1" />
            Back
          </button>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        <!-- Step 1: Goals -->
        <Transition name="slide" mode="out-in">
          <div v-if="currentStep === 1" key="step1" class="p-8">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:rocket-launch" class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What brings you here?
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                Understanding your goals helps us find the right mentor for you
              </p>
            </div>

            <div class="space-y-3">
              <button
                v-for="option in goalOptions"
                :key="option.value"
                @click="selectGoal(option.value)"
                :class="[
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center space-x-4',
                  responses.goal === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                ]"
              >
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  responses.goal === option.value 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                ]">
                  <Icon :name="option.icon" class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ option.label }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ option.description }}</p>
                </div>
                <Icon 
                  v-if="responses.goal === option.value"
                  name="heroicons:check-circle-solid" 
                  class="w-6 h-6 text-blue-500 ml-auto flex-shrink-0" 
                />
              </button>
            </div>
          </div>

          <!-- Step 2: Categories -->
          <div v-else-if="currentStep === 2" key="step2" class="p-8">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:squares-2x2" class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What areas interest you?
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                Select up to 3 categories you'd like to focus on
              </p>
            </div>

            <div v-if="isLoadingCategories" class="grid grid-cols-2 gap-3">
              <div v-for="i in 8" :key="i" class="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>

            <div v-else class="grid grid-cols-2 gap-3">
              <button
                v-for="category in availableCategories"
                :key="category"
                @click="toggleCategory(category)"
                :disabled="!responses.categories.includes(category) && responses.categories.length >= 3"
                :class="[
                  'p-4 rounded-xl border-2 text-left transition-all duration-200',
                  responses.categories.includes(category)
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : responses.categories.length >= 3
                      ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900 dark:text-white text-sm">{{ category }}</span>
                  <Icon 
                    v-if="responses.categories.includes(category)"
                    name="heroicons:check-circle-solid" 
                    class="w-5 h-5 text-purple-500 flex-shrink-0" 
                  />
                </div>
              </button>
            </div>

            <p v-if="responses.categories.length > 0" class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              {{ responses.categories.length }}/3 selected
            </p>
          </div>

          <!-- Step 3: Experience Level -->
          <div v-else-if="currentStep === 3" key="step3" class="p-8">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:chart-bar" class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Where are you in your journey?
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                This helps us match you with the right level of guidance
              </p>
            </div>

            <div class="space-y-3">
              <button
                v-for="option in experienceOptions"
                :key="option.value"
                @click="selectExperience(option.value)"
                :class="[
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center space-x-4',
                  responses.experienceLevel === option.value
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                ]"
              >
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold',
                  responses.experienceLevel === option.value 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                ]">
                  {{ option.emoji }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ option.label }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ option.description }}</p>
                </div>
                <Icon 
                  v-if="responses.experienceLevel === option.value"
                  name="heroicons:check-circle-solid" 
                  class="w-6 h-6 text-green-500 ml-auto flex-shrink-0" 
                />
              </button>
            </div>
          </div>

          <!-- Step 4: Session Type -->
          <div v-else-if="currentStep === 4" key="step4" class="p-8">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:calendar-days" class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What type of mentoring?
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                Choose the format that works best for you
              </p>
            </div>

            <div class="space-y-3">
              <button
                v-for="option in sessionOptions"
                :key="option.value"
                @click="selectSessionType(option.value)"
                :class="[
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center space-x-4',
                  responses.sessionType === option.value
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                ]"
              >
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  responses.sessionType === option.value 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                ]">
                  <Icon :name="option.icon" class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ option.label }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ option.description }}</p>
                </div>
                <Icon 
                  v-if="responses.sessionType === option.value"
                  name="heroicons:check-circle-solid" 
                  class="w-6 h-6 text-orange-500 ml-auto flex-shrink-0" 
                />
              </button>
            </div>
          </div>

          <!-- Step 5: Budget -->
          <div v-else-if="currentStep === 5" key="step5" class="p-8">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:currency-dollar" class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What's your budget?
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                This helps us show mentors within your range
              </p>
            </div>

            <div class="space-y-3">
              <button
                v-for="option in budgetOptions"
                :key="option.value"
                @click="selectBudget(option.value)"
                :class="[
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between',
                  responses.budget === option.value
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                ]"
              >
                <div class="flex items-center space-x-4">
                  <div :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold',
                    responses.budget === option.value 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  ]">
                    {{ option.emoji }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">{{ option.label }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ option.description }}</p>
                  </div>
                </div>
                <Icon 
                  v-if="responses.budget === option.value"
                  name="heroicons:check-circle-solid" 
                  class="w-6 h-6 text-cyan-500 flex-shrink-0" 
                />
              </button>
            </div>
          </div>
        </Transition>

        <!-- Footer -->
        <div class="px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
          <UButton
            @click="handleContinue"
            :disabled="!canProceed"
            size="lg"
            class="w-full justify-center"
            :loading="isNavigating"
          >
            <span v-if="currentStep === totalSteps">Find My Mentors</span>
            <span v-else>Continue</span>
            <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2" />
          </UButton>
        </div>
      </div>

      <!-- Trust indicators -->
      <div class="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
        <div class="flex items-center">
          <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-500 mr-2" />
          Verified mentors
        </div>
        <div class="flex items-center">
          <Icon name="heroicons:lock-closed" class="w-5 h-5 text-blue-500 mr-2" />
          Private & secure
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'Find Your Perfect Mentor - iMentorsPro',
  description: 'Answer a few questions and we\'ll match you with the perfect mentor for your goals.',
})

const { user } = useAuth()

const {
  currentStep,
  totalSteps,
  responses,
  progress,
  canProceed,
  nextStep,
  previousStep,
  setGoal,
  setCategories,
  setExperienceLevel,
  setSessionType,
  setBudget,
  getMentorsUrl,
  reset,
} = useMenteeDiscovery()

// Fetch categories from API
const isLoadingCategories = ref(true)
const availableCategories = ref<string[]>([])

onMounted(async () => {
  try {
    const response = await $fetch<{ categories: string[], skills: string[] }>('/api/mentors/filters')
    availableCategories.value = response.categories
  } catch (e) {
    console.error('Failed to load categories:', e)
    // Fallback categories
    availableCategories.value = [
      'Software Engineering',
      'Product Management',
      'Data Science',
      'UX Design',
      'Marketing',
      'Leadership',
      'Entrepreneurship',
      'Finance'
    ]
  } finally {
    isLoadingCategories.value = false
  }
})

const isNavigating = ref(false)

// Options data
const goalOptions = [
  { 
    value: 'career-advancement', 
    label: 'Career Advancement', 
    description: 'Get promoted or level up in my current role',
    icon: 'heroicons:arrow-trending-up'
  },
  { 
    value: 'skill-development', 
    label: 'Skill Development', 
    description: 'Learn new skills or improve existing ones',
    icon: 'heroicons:academic-cap'
  },
  { 
    value: 'leadership', 
    label: 'Leadership Guidance', 
    description: 'Become a better leader or manager',
    icon: 'heroicons:user-group'
  },
  { 
    value: 'career-transition', 
    label: 'Career Transition', 
    description: 'Switch roles, industries, or career paths',
    icon: 'heroicons:arrows-right-left'
  },
  { 
    value: 'entrepreneurship', 
    label: 'Business & Entrepreneurship', 
    description: 'Start or grow my own business',
    icon: 'heroicons:building-office'
  },
]

const experienceOptions = [
  { 
    value: 'beginner', 
    label: 'Just Starting Out', 
    description: '0-2 years of experience',
    emoji: '🌱'
  },
  { 
    value: 'growing', 
    label: 'Growing Professional', 
    description: '3-5 years of experience',
    emoji: '🌿'
  },
  { 
    value: 'experienced', 
    label: 'Experienced Professional', 
    description: '6-10 years of experience',
    emoji: '🌳'
  },
  { 
    value: 'senior', 
    label: 'Senior Professional', 
    description: '10+ years of experience',
    emoji: '🏔️'
  },
]

const sessionOptions = [
  { 
    value: 'one-time', 
    label: 'One-Time Consultation', 
    description: 'Get specific advice on a particular challenge',
    icon: 'heroicons:chat-bubble-left-right'
  },
  { 
    value: 'ongoing', 
    label: 'Regular Mentorship', 
    description: 'Ongoing guidance over weeks or months',
    icon: 'heroicons:calendar'
  },
  { 
    value: 'project', 
    label: 'Project-Based', 
    description: 'Help with a specific project or goal',
    icon: 'heroicons:clipboard-document-check'
  },
  { 
    value: 'not-sure', 
    label: 'Not Sure Yet', 
    description: 'I\'ll figure it out as I explore',
    icon: 'heroicons:question-mark-circle'
  },
]

const budgetOptions = [
  { 
    value: 'under-50', 
    label: 'Under $50/hour', 
    description: 'Budget-friendly options',
    emoji: '$'
  },
  { 
    value: '50-100', 
    label: '$50 - $100/hour', 
    description: 'Mid-range mentors',
    emoji: '$$'
  },
  { 
    value: '100-200', 
    label: '$100 - $200/hour', 
    description: 'Experienced professionals',
    emoji: '$$$'
  },
  { 
    value: '200-plus', 
    label: '$200+/hour', 
    description: 'Top industry experts',
    emoji: '$$$$'
  },
  { 
    value: 'flexible', 
    label: 'Flexible', 
    description: 'Show me all options',
    emoji: '✨'
  },
]

// Handlers
const selectGoal = (goal: string) => {
  setGoal(goal)
}

const toggleCategory = (category: string) => {
  const current = [...responses.value.categories]
  const index = current.indexOf(category)
  if (index > -1) {
    current.splice(index, 1)
  } else if (current.length < 3) {
    current.push(category)
  }
  setCategories(current)
}

const selectExperience = (level: string) => {
  setExperienceLevel(level)
}

const selectSessionType = (type: string) => {
  setSessionType(type)
}

const selectBudget = (budget: string) => {
  setBudget(budget)
}

const handleContinue = () => {
  if (currentStep.value === totalSteps) {
    isNavigating.value = true
    navigateTo(getMentorsUrl())
  } else {
    nextStep()
  }
}

const exitFlow = () => {
  reset()
  navigateTo('/')
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
