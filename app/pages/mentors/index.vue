<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Find Your Perfect Mentor
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Connect with industry experts who can accelerate your career growth
      </p>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="lg:col-span-2">
          <UInput
            v-model="searchQuery"
            placeholder="Search mentors by name, skills, or expertise..."
            icon="heroicons:magnifying-glass"
            size="lg"
          />
        </div>

        <!-- Category Filter -->
        <USelectMenu
          v-model="selectedCategories"
          :options="getAllCategories"
          placeholder="Categories"
          multiple
          searchable
          size="lg"
        />

        <!-- Skills Filter -->
        <USelectMenu
          v-model="selectedSkills"
          :options="getAllSkills"
          placeholder="Skills"
          multiple
          searchable
          size="lg"
        />
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
        <UBadge
          v-for="category in selectedCategories"
          :key="`category-${category}`"
          variant="soft"
          color="blue"
          class="cursor-pointer"
          @click="removeCategory(category)"
        >
          {{ category }}
          <Icon name="heroicons:x-mark" class="w-3 h-3 ml-1" />
        </UBadge>
        
        <UBadge
          v-for="skill in selectedSkills"
          :key="`skill-${skill}`"
          variant="soft"
          color="purple"
          class="cursor-pointer"
          @click="removeSkill(skill)"
        >
          {{ skill }}
          <Icon name="heroicons:x-mark" class="w-3 h-3 ml-1" />
        </UBadge>

        <UButton
          variant="ghost"
          size="xs"
          @click="clearAllFilters"
          class="text-gray-500 hover:text-gray-700"
        >
          Clear all
        </UButton>
      </div>
    </div>

    <!-- Results -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
      >
        <div class="flex items-center space-x-4 mb-4">
          <div class="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredMentors.length === 0" class="text-center py-12">
      <Icon name="heroicons:magnifying-glass" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No mentors found
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Try adjusting your search criteria or filters
      </p>
      <UButton @click="clearAllFilters" variant="outline">
        Clear Filters
      </UButton>
    </div>

    <div v-else>
      <!-- Results Count -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-gray-600 dark:text-gray-400">
          {{ filteredMentors.length }} mentor{{ filteredMentors.length !== 1 ? 's' : '' }} found
        </p>
        
        <USelectMenu
          v-model="sortBy"
          :options="sortOptions"
          size="sm"
        />
      </div>

      <!-- Mentor Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="mentor in sortedMentors"
          :key="mentor.id"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateTo(`/mentors/${mentor.id}`)"
        >
          <!-- Mentor Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-4">
              <UAvatar
                :src="mentor.avatar"
                :alt="`${mentor.firstName} ${mentor.lastName}`"
                size="lg"
              />
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ mentor.firstName }} {{ mentor.lastName }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ mentor.experience }} experience
                </p>
              </div>
            </div>
            
            <div class="text-right">
              <div class="flex items-center space-x-1 mb-1">
                <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400" />
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ mentor.rating }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ mentor.totalSessions }} sessions
              </p>
            </div>
          </div>

          <!-- Bio -->
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {{ mentor.bio }}
          </p>

          <!-- Skills -->
          <div class="mb-4">
            <div class="flex flex-wrap gap-1">
              <UBadge
                v-for="skill in mentor.skills.slice(0, 3)"
                :key="skill"
                variant="soft"
                size="xs"
              >
                {{ skill }}
              </UBadge>
              <UBadge
                v-if="mentor.skills.length > 3"
                variant="soft"
                size="xs"
                color="gray"
              >
                +{{ mentor.skills.length - 3 }} more
              </UBadge>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:globe-alt" class="w-4 h-4" />
                <span>{{ mentor.timezone }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:chat-bubble-left-right" class="w-4 h-4" />
                <span>{{ mentor.languages.join(', ') }}</span>
              </div>
            </div>
            
            <div class="text-right">
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                ${{ mentor.hourlyRate }}/hr
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const {
  mentors,
  isLoading,
  searchQuery,
  selectedCategories,
  selectedSkills,
  filteredMentors,
  fetchMentors,
  getAllCategories,
  getAllSkills
} = useMentors()

const sortBy = ref('rating')

const sortOptions = [
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Sessions', value: 'sessions' },
  { label: 'Lowest Price', value: 'price' },
  { label: 'Highest Price', value: 'price-desc' }
]

const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 || 
         selectedSkills.value.length > 0 || 
         searchQuery.value.length > 0
})

const sortedMentors = computed(() => {
  const sorted = [...filteredMentors.value]
  
  switch (sortBy.value) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'sessions':
      return sorted.sort((a, b) => b.totalSessions - a.totalSessions)
    case 'price':
      return sorted.sort((a, b) => a.hourlyRate - b.hourlyRate)
    case 'price-desc':
      return sorted.sort((a, b) => b.hourlyRate - a.hourlyRate)
    default:
      return sorted
  }
})

const removeCategory = (category: string) => {
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  }
}

const removeSkill = (skill: string) => {
  const index = selectedSkills.value.indexOf(skill)
  if (index > -1) {
    selectedSkills.value.splice(index, 1)
  }
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
  selectedSkills.value = []
}

// Fetch mentors on mount
onMounted(() => {
  fetchMentors()
})

// SEO
useSeoMeta({
  title: 'Find Mentors - iMentorsPro',
  description: 'Browse and connect with expert mentors to accelerate your career growth.'
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
