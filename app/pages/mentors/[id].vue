<template>
  <div v-if="mentor" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back Button -->
    <UButton
      @click="$router.back()"
      variant="ghost"
      icon="heroicons:arrow-left"
      class="mb-6"
    >
      Back to Mentors
    </UButton>

    <!-- Mentor Profile Header -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
      <div class="p-8">
        <div class="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          <!-- Avatar and Basic Info -->
          <div class="flex-shrink-0 text-center lg:text-left mb-6 lg:mb-0">
            <UAvatar
              :src="mentor.avatar"
              :alt="`${mentor.firstName} ${mentor.lastName}`"
              size="2xl"
              class="mx-auto lg:mx-0 mb-4"
            />
            
            <div class="flex items-center justify-center lg:justify-start space-x-1 mb-2">
              <Icon
                v-for="i in 5"
                :key="i"
                name="heroicons:star"
                :class="[
                  'w-5 h-5',
                  i <= mentor.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                ]"
              />
              <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                {{ mentor.rating }}/5
              </span>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {{ mentor.totalSessions }} sessions completed
            </p>

            <div class="text-center lg:text-left">
              <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                ${{ mentor.hourlyRate }}/hr
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ mentor.experience }} experience
              </p>
            </div>
          </div>

          <!-- Main Info -->
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ mentor.firstName }} {{ mentor.lastName }}
            </h1>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <UBadge
                v-for="category in mentor.categories"
                :key="category"
                variant="soft"
                color="primary"
              >
                {{ category }}
              </UBadge>
            </div>

            <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {{ mentor.bio }}
            </p>

            <!-- Quick Info -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div class="flex items-center space-x-2">
                <Icon name="heroicons:globe-alt" class="w-5 h-5 text-gray-400" />
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ mentor.timezone }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5 text-gray-400" />
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ mentor.languages.join(', ') }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Icon name="heroicons:clock" class="w-5 h-5 text-gray-400" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Usually responds in 2-4 hours</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <UButton
                size="lg"
                icon="heroicons:calendar-days"
                @click="showBookingModal = true"
              >
                Book Session
              </UButton>
              
              <UButton
                variant="outline"
                size="lg"
                icon="heroicons:chat-bubble-left-right"
                @click="sendMessage"
              >
                Send Message
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills & Expertise -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Skills & Expertise
      </h2>
      
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="skill in mentor.skills"
          :key="skill"
          variant="soft"
          color="secondary"
          size="md"
        >
          {{ skill }}
        </UBadge>
      </div>
    </div>

    <!-- Availability Preview -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Availability This Week
        </h2>
        <UButton
          variant="ghost"
          size="sm"
          @click="showBookingModal = true"
        >
          View Full Calendar
        </UButton>
      </div>
      
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="(day, index) in weekDays"
          :key="day"
          class="text-center"
        >
          <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {{ day }}
          </p>
          <div class="space-y-1">
            <div
              v-for="slot in getAvailableSlots(index)"
              :key="slot"
              class="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-2 py-1 rounded"
            >
              {{ slot }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Recent Reviews
      </h2>
      
      <div class="space-y-6">
        <div
          v-for="review in mockReviews"
          :key="review.id"
          class="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-6 last:pb-0"
        >
          <div class="flex items-start space-x-4">
            <UAvatar
              :src="review.avatar"
              :alt="review.name"
              size="md"
            />
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ review.name }}
                </h4>
                <div class="flex items-center space-x-1">
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    name="heroicons:star"
                    :class="[
                      'w-4 h-4',
                      i <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    ]"
                  />
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(review.date) }}
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-400">
                {{ review.comment }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <UModal v-model="showBookingModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Book a Session with {{ mentor.firstName }}
        </h3>
        
        <div class="space-y-4">
          <UFormField label="Session Title" required>
            <UInput
              v-model="bookingForm.title"
              placeholder="e.g., Career Growth Discussion"
            />
          </UFormField>
          
          <UFormField label="Description">
            <UTextarea
              v-model="bookingForm.description"
              placeholder="What would you like to discuss?"
              :rows="3"
            />
          </UFormField>
          
          <UFormField label="Preferred Date" required>
            <UInput
              v-model="bookingForm.date"
              type="date"
              :min="new Date().toISOString().split('T')[0]"
            />
          </UFormField>
          
          <UFormField label="Preferred Time" required>
            <USelect
              v-model="bookingForm.time"
              :options="availableTimeSlots"
              placeholder="Select a time"
            />
          </UFormField>
          
          <UFormField label="Duration" required>
            <USelect
              v-model="bookingForm.duration"
              :options="durationOptions"
            />
          </UFormField>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton
            variant="ghost"
            @click="showBookingModal = false"
          >
            Cancel
          </UButton>
          <UButton
            @click="submitBooking"
            :loading="isBooking"
          >
            Book Session
          </UButton>
        </div>
      </div>
    </UModal>
  </div>

  <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Mentor Not Found
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        The mentor you're looking for doesn't exist or has been removed.
      </p>
      <UButton to="/mentors" icon="heroicons:arrow-left">
        Back to Mentors
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const toast = useToast()
const { getMentorById } = useMentors()

const mentorId = route.params.id as string
const mentor = computed(() => getMentorById(mentorId))

const showBookingModal = ref(false)
const isBooking = ref(false)

const bookingForm = reactive({
  title: '',
  description: '',
  date: '',
  time: '',
  duration: 60
})

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const availableTimeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
]

const durationOptions = [
  { label: '30 minutes', value: 30 },
  { label: '60 minutes', value: 60 },
  { label: '90 minutes', value: 90 }
]

const mockReviews = [
  {
    id: '1',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 5,
    date: new Date('2024-01-15'),
    comment: 'Excellent session! Sarah provided clear guidance on my career transition and gave me actionable steps to follow.'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    date: new Date('2024-01-10'),
    comment: 'Very knowledgeable and patient. Helped me understand complex technical concepts in a simple way.'
  }
]

const getAvailableSlots = (dayIndex: number) => {
  // Mock availability - in real app, this would come from the mentor's actual availability
  const slots = ['9:00 AM', '2:00 PM', '4:00 PM']
  return dayIndex < 5 ? slots.slice(0, Math.floor(Math.random() * 3) + 1) : []
}

const sendMessage = () => {
  navigateTo(`/messages?mentor=${mentor.value?.id}`)
}

const submitBooking = async () => {
  if (!bookingForm.title || !bookingForm.date || !bookingForm.time) {
    toast.add({
      title: 'Missing Information',
      description: 'Please fill in all required fields.',
      color: 'error'
    })
    return
  }

  isBooking.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.add({
      title: 'Session Booked!',
      description: `Your session with ${mentor.value?.firstName} has been requested.`,
      color: 'success'
    })
    
    showBookingModal.value = false
    
    // Reset form
    Object.assign(bookingForm, {
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 60
    })
    
    // Navigate to sessions page
    navigateTo('/sessions')
  } catch (error) {
    toast.add({
      title: 'Booking Failed',
      description: 'Unable to book session. Please try again.',
      color: 'error'
    })
  } finally {
    isBooking.value = false
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

// SEO
useSeoMeta({
  title: () => mentor.value ? `${mentor.value.firstName} ${mentor.value.lastName} - Mentor Profile` : 'Mentor Profile',
  description: () => mentor.value ? mentor.value.bio : 'View mentor profile and book sessions'
})
</script>
