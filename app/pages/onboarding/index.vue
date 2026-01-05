<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Complete Your Profile
          </h1>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            Step {{ currentStep }} of {{ totalSteps }}
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Step 1: Welcome & Role Confirmation -->
        <div v-if="currentStep === 1" class="p-8">
          <div class="text-center mb-8">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="heroicons:hand-raised" class="w-10 h-10 text-white" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to iMentorsPro, {{ parsedName.firstName || 'there' }}!
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Let's set up your profile so you can get the most out of your {{ userRole === 'mentor' ? 'mentoring' : 'learning' }} journey.
            </p>
          </div>

          <div class="max-w-md mx-auto">
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
              <div class="flex items-center space-x-4">
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  userRole === 'mentor' ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
                ]">
                  <Icon 
                    :name="userRole === 'mentor' ? 'heroicons:academic-cap' : 'heroicons:user'"
                    :class="[
                      'w-6 h-6',
                      userRole === 'mentor' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'
                    ]"
                  />
                </div>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white capitalize">
                    {{ userRole }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ userRole === 'mentor' ? 'Share your expertise and guide others' : 'Learn from experienced professionals' }}
                  </p>
                </div>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              This will take about 3-5 minutes to complete.
            </p>
          </div>
        </div>

        <!-- Step 2: Basic Profile Info -->
        <div v-else-if="currentStep === 2" class="p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tell us about yourself
          </h2>
          
          <UForm :state="profileForm" class="space-y-6">
            <!-- Profile Photo Upload -->
            <div class="flex flex-col items-center mb-6">
              <div class="relative group">
                <UAvatar
                  :src="profileForm.profileImage"
                  :alt="`${profileForm.firstName} ${profileForm.lastName}`"
                  size="3xl"
                  class="border-4 border-gray-200 dark:border-gray-600"
                />
                <label 
                  class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <input 
                    type="file" 
                    class="hidden" 
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    @change="handleProfileImageUpload"
                  />
                  <div v-if="isUploadingImage" class="text-white">
                    <UIcon name="heroicons:arrow-path" class="animate-spin w-8 h-8" />
                  </div>
                  <div v-else class="text-center text-white">
                    <UIcon name="heroicons:camera" class="w-8 h-8 mb-1" />
                    <p class="text-xs">Upload Photo</p>
                  </div>
                </label>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">
                {{ userRole === 'mentor' ? 'Add a professional photo to help mentees connect with you' : 'Add a profile photo (optional)' }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormField label="First Name" name="firstName" required>
                <UInput
                  v-model="profileForm.firstName"
                  placeholder="Your first name"
                  size="lg"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Last Name" name="lastName" required>
                <UInput
                  v-model="profileForm.lastName"
                  placeholder="Your last name"
                  size="lg"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField label="Bio" name="bio" required>
              <UTextarea
                v-model="profileForm.bio"
                :placeholder="userRole === 'mentor' 
                  ? 'Describe your experience and what you can help with...' 
                  : 'Tell us about your background and what you want to learn...'"
                :rows="4"
                resize
                class="w-full"
              />
            </UFormField>

            <UFormField label="Location (Optional)" name="location">
              <GooglePlacesAutocomplete
                v-model="profileForm.location"
                placeholder="Search for your city"
                size="lg"
                icon="heroicons:map-pin"
              />
            </UFormField>
          </UForm>
        </div>

        <!-- Step 3: Role-specific Setup -->
        <div v-else-if="currentStep === 3" class="p-8">
          <!-- Mentor Setup -->
          <div v-if="userRole === 'mentor'">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Your Expertise
            </h2>
            
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormField label="Years of Experience" name="experience" required>
                  <USelect
                    v-model="mentorForm.experience"
                    :items="experienceOptions"
                    placeholder="Select your experience level"
                    size="lg"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Hourly Rate (USD)" name="hourlyRate" required>
                  <UInput
                    v-model="mentorForm.hourlyRate"
                    type="number"
                    placeholder="75"
                    size="lg"
                    icon="heroicons:currency-dollar"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormField label="Date of Birth" name="dateOfBirth" required>
                  <UInput
                    v-model="mentorForm.dateOfBirth"
                    type="date"
                    size="lg"
                    icon="heroicons:calendar"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Expertise Document" name="expertiseDocument" required help="Upload a portfolio, certificate, or CV that proves your expertise (PDF, Word, or Image).">
                  <div class="flex items-center space-x-3 w-full">
                    <UInput
                      type="file"
                      size="lg"
                      icon="heroicons:document-text"
                      class="flex-1"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                      @change="handleFileUpload"
                    />
                    <div v-if="isUploading" class="flex items-center">
                      <UIcon name="heroicons:arrow-path" class="animate-spin w-5 h-5 text-blue-600" />
                    </div>
                    <div v-else-if="mentorForm.expertiseDocument" class="flex items-center">
                      <UIcon name="heroicons:check-circle" class="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p v-if="mentorForm.expertiseDocument" class="text-xs text-gray-500 mt-1 truncate max-w-xs">
                    Uploaded: {{ mentorForm.expertiseDocument.split('/').pop() }}
                  </p>
                </UFormField>
              </div>

              <!-- ID Document Upload -->
              <UFormField label="ID Document" name="idDocument" required help="Upload a government-issued ID (Passport, National ID, or Driver's License) for identity verification.">
                <div class="flex items-center space-x-3 w-full">
                  <UInput
                    type="file"
                    size="lg"
                    icon="heroicons:identification"
                    class="flex-1"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    @change="handleIdDocumentUpload"
                  />
                  <div v-if="isUploadingId" class="flex items-center">
                    <UIcon name="heroicons:arrow-path" class="animate-spin w-5 h-5 text-blue-600" />
                  </div>
                  <div v-else-if="mentorForm.idDocument" class="flex items-center">
                    <UIcon name="heroicons:check-circle" class="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p v-if="mentorForm.idDocument" class="text-xs text-gray-500 mt-1 truncate max-w-xs">
                  Uploaded: {{ mentorForm.idDocument.split('/').pop() }}
                </p>
                <p class="text-xs text-gray-400 mt-2">
                  <UIcon name="heroicons:lock-closed" class="w-3 h-3 inline" />
                  Your ID is securely stored and only used for verification purposes.
                </p>
              </UFormField>

              <UFormField label="Skills & Expertise" name="skills" required>
                <div class="space-y-3">
                  <UInput
                    v-model="skillInput"
                    placeholder="Add a skill (e.g., JavaScript, Leadership)"
                    size="lg"
                    @keyup.enter="addSkill"
                    class="w-full"
                  >
                    <template #trailing>
                      <UButton
                        @click="addSkill"
                        size="xs"
                        variant="ghost"
                        icon="heroicons:plus"
                      />
                    </template>
                  </UInput>
                  <div v-if="mentorForm.skills.length > 0" class="flex flex-wrap gap-2">
                    <UBadge
                      v-for="skill in mentorForm.skills"
                      :key="skill"
                      variant="soft"
                      class="cursor-pointer"
                      @click="removeSkill(skill)"
                    >
                      {{ skill }}
                      <Icon name="heroicons:x-mark" class="w-3 h-3 ml-1" />
                    </UBadge>
                  </div>
                </div>
              </UFormField>

              <UFormField label="Categories" name="categories" required>
                <USelectMenu
                  v-model="mentorForm.categories"
                  :items="categoryOptions"
                  multiple
                  placeholder="Select categories you can mentor in"
                  size="lg"
                  class="w-full"
                />
              </UFormField>
            </div>
          </div>

          <!-- Mentee Setup -->
          <div v-else>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Your Learning Goals
            </h2>
            
            <div class="space-y-6">
              <UFormField label="Experience Level" name="experience" required>
                <USelect
                  v-model="menteeForm.experience"
                  :items="experienceOptions"
                  placeholder="Select your current level"
                  size="lg"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Areas of Interest" name="interests" required>
                <USelectMenu
                  v-model="menteeForm.interests"
                  :items="categoryOptions"
                  multiple
                  placeholder="What would you like to learn about?"
                  size="lg"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Goals" name="goals" required>
                <div class="space-y-3">
                  <UInput
                    v-model="goalInput"
                    placeholder="Add a goal (e.g., Get promoted, Learn React)"
                    size="lg"
                    @keyup.enter="addGoal"
                    class="w-full"
                  >
                    <template #trailing>
                      <UButton
                        @click="addGoal"
                        size="xs"
                        variant="ghost"
                        icon="heroicons:plus"
                      />
                    </template>
                  </UInput>
                  <div v-if="menteeForm.goals.length > 0" class="flex flex-wrap gap-2">
                    <UBadge
                      v-for="goal in menteeForm.goals"
                      :key="goal"
                      variant="soft"
                      class="cursor-pointer"
                      @click="removeGoal(goal)"
                    >
                      {{ goal }}
                      <Icon name="heroicons:x-mark" class="w-3 h-3 ml-1" />
                    </UBadge>
                  </div>
                </div>
              </UFormField>
            </div>
          </div>
        </div>

        <!-- Step 4: Preferences -->
        <div v-else-if="currentStep === 4" class="p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Preferences & Settings
          </h2>
          
          <div class="space-y-6">
            <UFormField label="Timezone" name="timezone" required>
              <USelect
                v-model="preferencesForm.timezone"
                :items="timezoneOptions"
                placeholder="Select your timezone"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Languages" name="languages" required>
              <USelectMenu
                v-model="preferencesForm.languages"
                :items="languageOptions"
                multiple
                placeholder="Languages you speak"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Communication Preferences
              </h3>
              
              <UCheckbox
                v-model="preferencesForm.emailNotifications"
                label="Email notifications for new messages and bookings"
              />
              
              <UCheckbox
                v-model="preferencesForm.weeklyDigest"
                label="Weekly digest with platform updates"
              />
              
              <UCheckbox
                v-model="preferencesForm.marketingEmails"
                label="Marketing emails about new features"
              />
            </div>
          </div>
        </div>

        <!-- Step 5: Complete -->
        <div v-else-if="currentStep === 5" class="p-8 text-center">
          <div class="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon name="heroicons:check-circle" class="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            You're all set!
          </h2>
          
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {{ userRole === 'mentor' 
              ? 'Your mentor profile is complete. Start connecting with mentees and share your expertise!'
              : 'Your profile is ready! You can now browse mentors and book your first session.'
            }}
          </p>

          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 max-w-md mx-auto mb-8">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
              Next Steps:
            </h3>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li v-if="userRole === 'mentor'">• Set your availability schedule</li>
              <li v-if="userRole === 'mentor'">• Review your profile and make it shine</li>
              <li v-if="userRole === 'mentee'">• Browse available mentors</li>
              <li v-if="userRole === 'mentee'">• Book your first mentoring session</li>
              <li>• Complete your profile with a photo</li>
            </ul>
          </div>
        </div>

        <!-- Navigation -->
        <div class="px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <UButton
              v-if="currentStep > 1"
              @click="previousStep"
              variant="outline"
              icon="heroicons:arrow-left"
            >
              Back
            </UButton>
            <div v-else></div>

            <UButton
              v-if="currentStep < totalSteps"
              @click="nextStep"
              :disabled="!canProceed"
              icon="heroicons:arrow-right"
              trailing
            >
              {{ currentStep === 1 ? 'Get Started' : 'Continue' }}
            </UButton>
            
            <UButton
              v-else
              @click="completeOnboardingFlow"
              :loading="isCompleting"
              icon="heroicons:rocket-launch"
            >
              Go to Dashboard
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: 'auth',
  layout: false
})

const { user, authUser, refreshSession, userRole, logout } = useAuth()
const { categoryOptions, fetchCategories } = useCategories()
const toast = useToast()

const currentStep = ref(1)
const totalSteps = 5
const isCompleting = ref(false)
const isUploading = ref(false)
const isUploadingImage = ref(false)
const isUploadingId = ref(false)

// Parse user name into first/last
const parsedName = computed(() => {
  const name = user.value?.name || ''
  const parts = name.split(' ')
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  }
})

// Form data
const profileForm = reactive({
  firstName: parsedName.value.firstName,
  lastName: parsedName.value.lastName,
  bio: '',
  location: '',
  profileImage: ''
})

const mentorForm = reactive({
  experience: 'Entry Level (0-2 years)',
  hourlyRate: 75,
  skills: [] as string[],
  categories: [] as string[],
  dateOfBirth: '',
  expertiseDocument: '',
  idDocument: ''
})

const menteeForm = reactive({
  experience: 'Entry Level (0-2 years)',
  interests: [] as string[],
  goals: [] as string[]
})

const preferencesForm = reactive({
  timezone: 'America/New_York',
  languages: ['English'] as string[],
  emailNotifications: true,
  weeklyDigest: true,
  marketingEmails: false
})

// Input helpers
const skillInput = ref('')
const goalInput = ref('')

// Options
const experienceOptions = [
  { label: 'Entry Level (0-2 years)', value: '0-2 years' },
  { label: 'Mid Level (3-5 years)', value: '3-5 years' },
  { label: 'Senior Level (6-10 years)', value: '6-10 years' },
  { label: 'Expert Level (10+ years)', value: '10+ years' }
]


const timezoneOptions = [
  { label: 'Eastern Time (ET)', value: 'America/New_York' },
  { label: 'Central Time (CT)', value: 'America/Chicago' },
  { label: 'Mountain Time (MT)', value: 'America/Denver' },
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { label: 'UTC', value: 'UTC' }
]

const languageOptions = [
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Mandarin',
  'Japanese',
  'Korean'
]

// Computed
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return true
    case 2:
      return profileForm.firstName && profileForm.lastName && profileForm.bio
    case 3:
      if (userRole.value === 'mentor') {
        return mentorForm.experience && mentorForm.hourlyRate && 
               mentorForm.skills.length > 0 && mentorForm.categories.length > 0 &&
               mentorForm.dateOfBirth && mentorForm.expertiseDocument && mentorForm.idDocument
      } else {
        return menteeForm.experience && menteeForm.interests.length > 0 && 
               menteeForm.goals.length > 0
      }
    case 4:
      return preferencesForm.timezone && preferencesForm.languages.length > 0
    default:
      return true
  }
})

// Methods
const nextStep = () => {
  if (canProceed.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)

  isUploading.value = true
  try {
    const response = await $fetch<{ url: string }>('/api/uploads', {
      method: 'POST',
      body: formData
    })
    mentorForm.expertiseDocument = response.url
    toast.add({
      title: 'Success',
      description: 'Document uploaded successfully',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({
      title: 'Upload Failed',
      description: error.data?.message || 'Failed to upload document',
      color: 'error'
    })
  } finally {
    isUploading.value = false
  }
}

const handleProfileImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)

  isUploadingImage.value = true
  try {
    const response = await $fetch<{ url: string }>('/api/profile/image', {
      method: 'POST',
      body: formData
    })
    profileForm.profileImage = response.url
    toast.add({
      title: 'Success',
      description: 'Profile photo uploaded successfully',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({
      title: 'Upload Failed',
      description: error.data?.message || 'Failed to upload profile photo',
      color: 'error'
    })
  } finally {
    isUploadingImage.value = false
  }
}

const handleIdDocumentUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)

  isUploadingId.value = true
  try {
    const response = await $fetch<{ url: string }>('/api/uploads', {
      method: 'POST',
      body: formData
    })
    mentorForm.idDocument = response.url
    toast.add({
      title: 'Success',
      description: 'ID document uploaded successfully',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({
      title: 'Upload Failed',
      description: error.data?.message || 'Failed to upload ID document',
      color: 'error'
    })
  } finally {
    isUploadingId.value = false
  }
}

const addSkill = () => {
  if (skillInput.value.trim() && !mentorForm.skills.includes(skillInput.value.trim())) {
    mentorForm.skills.push(skillInput.value.trim())
    skillInput.value = ''
  }
}

const removeSkill = (skill: string) => {
  const index = mentorForm.skills.indexOf(skill)
  if (index > -1) {
    mentorForm.skills.splice(index, 1)
  }
}

const addGoal = () => {
  if (goalInput.value.trim() && !menteeForm.goals.includes(goalInput.value.trim())) {
    menteeForm.goals.push(goalInput.value.trim())
    goalInput.value = ''
  }
}

const removeGoal = (goal: string) => {
  const index = menteeForm.goals.indexOf(goal)
  if (index > -1) {
    menteeForm.goals.splice(index, 1)
  }
}

const completeOnboardingFlow = async () => {
  isCompleting.value = true
  
  try {
    // Save onboarding data to backend
    await $fetch('/api/onboarding/complete', {
      method: 'POST',
      body: {
        profile: {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          bio: profileForm.bio,
          location: profileForm.location,
        },
        roleData: userRole.value === 'mentor' 
          ? {
              experience: mentorForm.experience,
              hourlyRate: mentorForm.hourlyRate,
              skills: mentorForm.skills,
              categories: mentorForm.categories,
              dateOfBirth: mentorForm.dateOfBirth,
              expertiseDocument: mentorForm.expertiseDocument,
              idDocument: mentorForm.idDocument,
            }
          : {
              experience: menteeForm.experience,
              interests: menteeForm.interests,
              goals: menteeForm.goals,
            },
        preferences: {
          timezone: preferencesForm.timezone,
          languages: preferencesForm.languages,
          emailNotifications: preferencesForm.emailNotifications,
          weeklyDigest: preferencesForm.weeklyDigest,
          marketingEmails: preferencesForm.marketingEmails,
        },
      },
    })
    
    // Refresh session to get updated user data
    await refreshSession()
    
    // Directly update the user state to ensure middleware doesn't redirect back
    // This is a fallback in case refreshSession doesn't return fresh data
    if (authUser.value) {
      authUser.value = {
        ...authUser.value,
        hasCompletedOnboarding: true,
        onboardingStep: 'complete',
        onboardingCompletedAt: new Date()
      }
    }
    
    toast.add({
      title: 'Profile Complete!',
      description: 'Welcome to iMentorsPro. Your journey begins now!',
      color: 'success'
    })
    
    const dest = userRole.value === 'admin' ? '/admin' : '/dashboard'
    await navigateTo(dest)
  } catch (error: any) {
    if (error.statusCode === 401) {
      toast.add({
        title: 'Session Expired',
        description: 'Please log in again to continue.',
        color: 'error'
      })
      await logout()
      return
    }

    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to complete onboarding. Please try again.',
      color: 'error'
    })
  } finally {
    isCompleting.value = false
  }
}

// Initialize form with user data
onMounted(async () => {
  // Fetch categories for the selects
  await fetchCategories()

  if (user.value?.name) {
    const parts = user.value.name.split(' ')
    profileForm.firstName = parts[0] || ''
    profileForm.lastName = parts.slice(1).join(' ') || ''
  }
})
</script>
