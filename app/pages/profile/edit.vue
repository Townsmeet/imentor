<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Edit Profile
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Update your profile information and preferences
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Form -->
      <div class="lg:col-span-2">
        <UForm
          :schema="profileSchema"
          :state="profileForm"
          @submit="saveProfile"
          class="space-y-6"
        >
          <!-- Basic Information -->
          <UCard>
            <template #header>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
            </template>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <UFormField label="First Name" name="firstName" required>
                  <UInput v-model="profileForm.firstName" />
                </UFormField>
                <UFormField label="Last Name" name="lastName" required>
                  <UInput v-model="profileForm.lastName" />
                </UFormField>
              </div>

              <UFormField label="Email" name="email" required>
                <UInput v-model="profileForm.email" type="email" disabled />
              </UFormField>

              <UFormField label="Bio" name="bio">
                <UTextarea
                  v-model="profileForm.bio"
                  placeholder="Tell others about yourself..."
                  :rows="4"
                />
              </UFormField>
            </div>
          </UCard>

          <!-- Role-specific Information -->
          <UCard v-if="user?.role === 'mentor'">
            <template #header>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Mentor Information
              </h2>
            </template>

            <div class="space-y-4">
              <UFormField label="Hourly Rate ($)" name="hourlyRate">
                <UInput
                  v-model="profileForm.hourlyRate"
                  type="number"
                  min="0"
                  step="5"
                />
              </UFormField>

              <UFormField label="Experience" name="experience">
                <USelect
                  v-model="profileForm.experience"
                  :options="experienceOptions"
                />
              </UFormField>

              <UFormField label="Categories" name="categories">
                <USelectMenu
                  v-model="profileForm.categories"
                  :options="categoryOptions"
                  multiple
                  searchable
                />
              </UFormField>

              <UFormField label="Skills" name="skills">
                <USelectMenu
                  v-model="profileForm.skills"
                  :options="skillOptions"
                  multiple
                  searchable
                />
              </UFormField>

              <UFormField label="Languages" name="languages">
                <USelectMenu
                  v-model="profileForm.languages"
                  :options="languageOptions"
                  multiple
                  searchable
                />
              </UFormField>

              <UFormField label="Timezone" name="timezone">
                <USelect
                  v-model="profileForm.timezone"
                  :options="timezoneOptions"
                />
              </UFormField>
            </div>
          </UCard>

          <UCard v-if="user?.role === 'mentee'">
            <template #header>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Learning Goals
              </h2>
            </template>

            <div class="space-y-4">
              <UFormField label="Interests" name="interests">
                <USelectMenu
                  v-model="profileForm.interests"
                  :options="categoryOptions"
                  multiple
                  searchable
                />
              </UFormField>

              <UFormField label="Goals" name="goals">
                <UTextarea
                  v-model="profileForm.goalsText"
                  placeholder="What are your learning and career goals?"
                  :rows="3"
                />
              </UFormField>

              <UFormField label="Experience Level" name="experience">
                <USelect
                  v-model="profileForm.experience"
                  :options="experienceOptions"
                />
              </UFormField>
            </div>
          </UCard>

          <!-- Save Button -->
          <div class="flex justify-end space-x-3">
            <UButton
              variant="ghost"
              @click="$router.back()"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              :loading="isSaving"
              icon="heroicons:check"
            >
              Save Changes
            </UButton>
          </div>
        </UForm>
      </div>

      <!-- Profile Preview -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Preview
            </h3>
          </template>

          <div class="text-center">
            <UAvatar
              :src="user?.avatar"
              :alt="`${profileForm.firstName} ${profileForm.lastName}`"
              size="xl"
              class="mx-auto mb-4"
            />
            
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {{ profileForm.firstName }} {{ profileForm.lastName }}
            </h4>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 capitalize mb-4">
              {{ user?.role }}
            </p>

            <div v-if="profileForm.bio" class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {{ profileForm.bio }}
            </div>

            <div v-if="user?.role === 'mentor'" class="space-y-2">
              <div v-if="profileForm.hourlyRate" class="text-lg font-bold text-gray-900 dark:text-white">
                ${{ profileForm.hourlyRate }}/hr
              </div>
              
              <div v-if="profileForm.experience" class="text-sm text-gray-600 dark:text-gray-400">
                {{ profileForm.experience }} experience
              </div>

              <div v-if="profileForm.categories.length > 0" class="flex flex-wrap gap-1 justify-center">
                <UBadge
                  v-for="category in profileForm.categories.slice(0, 3)"
                  :key="category"
                  variant="soft"
                  size="xs"
                >
                  {{ category }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Completeness
            </h3>
          </template>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Overall</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ profileCompleteness }}%</span>
            </div>
            
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${profileCompleteness}%` }"
              ></div>
            </div>

            <div class="space-y-2 text-sm">
              <div
                v-for="item in completenessItems"
                :key="item.label"
                class="flex items-center justify-between"
              >
                <span :class="item.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                  <Icon
                    :name="item.completed ? 'heroicons:check-circle' : 'heroicons:minus-circle'"
                    class="w-4 h-4 inline mr-2"
                  />
                  {{ item.label }}
                </span>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const toast = useToast()

const isSaving = ref(false)

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  hourlyRate: z.number().min(0).optional(),
  experience: z.string().optional(),
  categories: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  timezone: z.string().optional(),
  interests: z.array(z.string()).optional(),
  goalsText: z.string().optional()
})

const profileForm = reactive({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  bio: '',
  hourlyRate: 75,
  experience: '5-10 years',
  categories: [],
  skills: [],
  languages: ['English'],
  timezone: 'PST',
  interests: [],
  goalsText: ''
})

const experienceOptions = [
  '0-2 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
]

const categoryOptions = [
  'Software Development',
  'Product Management',
  'Design',
  'Marketing',
  'Sales',
  'Data Science',
  'Leadership',
  'Career Growth',
  'Entrepreneurship'
]

const skillOptions = [
  'JavaScript',
  'Python',
  'React',
  'Node.js',
  'AWS',
  'Product Strategy',
  'User Research',
  'UI/UX Design',
  'Figma',
  'Data Analysis',
  'Machine Learning',
  'Leadership',
  'Communication'
]

const languageOptions = [
  'English',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Japanese',
  'Portuguese',
  'Italian'
]

const timezoneOptions = [
  'PST',
  'MST',
  'CST',
  'EST',
  'GMT',
  'CET',
  'JST',
  'AEST'
]

const profileCompleteness = computed(() => {
  let completed = 0
  let total = 0

  // Basic fields
  total += 4
  if (profileForm.firstName) completed++
  if (profileForm.lastName) completed++
  if (profileForm.email) completed++
  if (profileForm.bio) completed++

  if (user.value?.role === 'mentor') {
    total += 5
    if (profileForm.hourlyRate) completed++
    if (profileForm.experience) completed++
    if (profileForm.categories.length > 0) completed++
    if (profileForm.skills.length > 0) completed++
    if (profileForm.languages.length > 0) completed++
  } else {
    total += 3
    if (profileForm.interests.length > 0) completed++
    if (profileForm.goalsText) completed++
    if (profileForm.experience) completed++
  }

  return Math.round((completed / total) * 100)
})

const completenessItems = computed(() => {
  const items = [
    { label: 'Basic info', completed: !!(profileForm.firstName && profileForm.lastName && profileForm.email) },
    { label: 'Bio', completed: !!profileForm.bio }
  ]

  if (user.value?.role === 'mentor') {
    items.push(
      { label: 'Hourly rate', completed: !!profileForm.hourlyRate },
      { label: 'Experience', completed: !!profileForm.experience },
      { label: 'Categories', completed: profileForm.categories.length > 0 },
      { label: 'Skills', completed: profileForm.skills.length > 0 }
    )
  } else {
    items.push(
      { label: 'Interests', completed: profileForm.interests.length > 0 },
      { label: 'Goals', completed: !!profileForm.goalsText },
      { label: 'Experience level', completed: !!profileForm.experience }
    )
  }

  return items
})

const saveProfile = async () => {
  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.add({
      title: 'Profile Updated',
      description: 'Your profile has been saved successfully.',
      color: 'green'
    })
    
    // Navigate back to dashboard
    navigateTo('/dashboard')
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to save profile. Please try again.',
      color: 'red'
    })
  } finally {
    isSaving.value = false
  }
}
</script>
