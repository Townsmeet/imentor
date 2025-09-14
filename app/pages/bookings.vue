<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        My Bookings
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Manage your upcoming and past mentoring sessions
      </p>
    </div>

    <!-- Tabs -->
    <div class="mb-8">
      <nav class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          {{ tab.name }}
          <span
            v-if="tab.count > 0"
            :class="[
              'ml-2 py-0.5 px-2 rounded-full text-xs',
              activeTab === tab.id
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <!-- Upcoming Bookings -->
    <div v-else-if="activeTab === 'upcoming'">
      <div v-if="upcomingBookings.length === 0" class="text-center py-12">
        <Icon name="heroicons:calendar-days" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No upcoming sessions
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Book a session with a mentor to get started
        </p>
        <UButton to="/mentors" icon="heroicons:plus">
          Browse Mentors
        </UButton>
      </div>
      
      <div v-else class="space-y-6">
        <BookingCard
          v-for="booking in upcomingBookings"
          :key="booking.id"
          :booking="booking"
          @reschedule="handleReschedule"
          @cancel="handleCancel"
          @join="handleJoin"
        />
      </div>
    </div>

    <!-- Pending Bookings -->
    <div v-else-if="activeTab === 'pending'">
      <div v-if="pendingBookings.length === 0" class="text-center py-12">
        <Icon name="heroicons:clock" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No pending bookings
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          All your bookings have been confirmed or completed
        </p>
      </div>
      
      <div v-else class="space-y-6">
        <BookingCard
          v-for="booking in pendingBookings"
          :key="booking.id"
          :booking="booking"
          @cancel="handleCancel"
        />
      </div>
    </div>

    <!-- Past Bookings -->
    <div v-else-if="activeTab === 'past'">
      <div v-if="pastBookings.length === 0" class="text-center py-12">
        <Icon name="heroicons:archive-box" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No past sessions
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Your completed sessions will appear here
        </p>
      </div>
      
      <div v-else class="space-y-6">
        <BookingCard
          v-for="booking in pastBookings"
          :key="booking.id"
          :booking="booking"
          @review="handleReview"
          @book-again="handleBookAgain"
        />
      </div>
    </div>

    <!-- Reschedule Modal -->
    <UModal
      v-model:open="showRescheduleModal"
      :title="selectedBooking ? `Reschedule ${selectedBooking.title || ''}` : 'Reschedule Session'"
      :description="selectedBooking ? `Current: ${formatDate(selectedBooking.scheduledDate) || ''}` : undefined"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <BookingCalendar
          v-if="selectedBooking?.mentor"
          :mentor="selectedBooking.mentor"
          v-model="rescheduleSelection"
        />
      </template>

      <template #footer="{ close }">
        <UButton
          label="Cancel"
          color="neutral"
          variant="ghost"
          @click="showRescheduleModal = false"
        />
        <UButton
          label="Reschedule"
          @click="confirmReschedule"
          :disabled="!rescheduleSelection.date || !rescheduleSelection.timeSlot"
          :loading="isRescheduling"
        />
      </template>
    </UModal>

    <!-- Review Modal -->
    <UModal
      v-model:open="showReviewModal"
      :title="selectedBooking ? `Review Session with ${selectedBooking.mentor?.firstName || ''}` : 'Review Session'"
      :description="selectedBooking ? `Session: ${selectedBooking.title || ''}` : undefined"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField label="Rating" required>
            <div class="flex items-center space-x-1">
              <button
                v-for="i in 5"
                :key="i"
                @click="reviewForm.rating = i"
                class="p-1"
              >
                <Icon
                  name="heroicons:star"
                  :class="[
                    'w-6 h-6 transition-colors',
                    i <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                  ]"
                />
              </button>
            </div>
          </UFormField>
          
          <UFormField label="Review">
            <UTextarea
              v-model="reviewForm.comment"
              placeholder="Share your experience with this session..."
              :rows="4"
            />
          </UFormField>
        </div>
      </template>
      
      <template #footer="{ close }">
        <UButton
          label="Cancel"
          color="neutral"
          variant="ghost"
          @click="showReviewModal = false"
        />
        <UButton
          label="Submit Review"
          @click="submitReview"
          :disabled="reviewForm.rating === 0"
          :loading="isSubmittingReview"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Booking, AvailabilitySlot } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const {
  fetchBookings,
  getUpcomingBookings,
  getPastBookings,
  getPendingBookings,
  rescheduleBooking,
  cancelBooking,
  isLoading
} = useBookings()

const { getMentorProfile, fetchMentors } = useMentors()
const toast = useToast()

const activeTab = ref('upcoming')
const showRescheduleModal = ref(false)
const showReviewModal = ref(false)
const selectedBooking = ref<Booking | null>(null)
const isRescheduling = ref(false)
const isSubmittingReview = ref(false)

const rescheduleSelection = ref<{
  date: Date | null
  timeSlot: AvailabilitySlot | null
  duration: number
}>({
  date: null,
  timeSlot: null,
  duration: 60
})

const reviewForm = reactive({
  rating: 0,
  comment: ''
})

const tabs = computed(() => [
  {
    id: 'upcoming',
    name: 'Upcoming',
    count: getUpcomingBookings.value.length
  },
  {
    id: 'pending',
    name: 'Pending',
    count: getPendingBookings.value.length
  },
  {
    id: 'past',
    name: 'Past',
    count: getPastBookings.value.length
  }
])

const upcomingBookings = computed(() => {
  return getUpcomingBookings.value.map(booking => {
    const mentor = getMentorProfile(booking.mentorId)
    return {
      ...booking,
      mentor
    }
  })
})

const pendingBookings = computed(() => {
  return getPendingBookings.value.map(booking => ({
    ...booking,
    mentor: getMentorProfile(booking.mentorId)
  }))
})

const pastBookings = computed(() => {
  return getPastBookings.value.map(booking => ({
    ...booking,
    mentor: getMentorProfile(booking.mentorId)
  }))
})

const handleReschedule = (booking: Booking) => {
  selectedBooking.value = { ...booking, mentor: getMentorProfile(booking.mentorId) }
  showRescheduleModal.value = true
}

const handleCancel = async (booking: Booking) => {
  try {
    await cancelBooking(booking.id)
    toast.add({
      title: 'Session Cancelled',
      description: 'Your session has been cancelled successfully.',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Cancellation Failed',
      description: 'Unable to cancel session. Please try again.',
      color: 'error'
    })
  }
}

const handleJoin = (booking: Booking) => {
  if (booking.meetingLink) {
    window.open(booking.meetingLink, '_blank')
  } else {
    toast.add({
      title: 'Meeting Link Not Available',
      description: 'The meeting link will be provided closer to the session time.',
      color: 'warning'
    })
  }
}

const handleReview = (booking: Booking) => {
  selectedBooking.value = booking
  reviewForm.rating = 0
  reviewForm.comment = ''
  showReviewModal.value = true
}

const handleBookAgain = (booking: Booking) => {
  navigateTo(`/mentors/${booking.mentorId}`)
}

const confirmReschedule = async () => {
  if (!selectedBooking.value || !rescheduleSelection.value.date || !rescheduleSelection.value.timeSlot) return
  
  isRescheduling.value = true
  try {
    const newDate = new Date(rescheduleSelection.value.date)
    const [hours, minutes] = rescheduleSelection.value.timeSlot.startTime.split(':')
    newDate.setHours(parseInt(hours || '0'), parseInt(minutes || '0'))
    
    await rescheduleBooking(selectedBooking.value.id, newDate)
    
    toast.add({
      title: 'Session Rescheduled',
      description: 'Your session has been rescheduled successfully.',
      color: 'success'
    })
    
    showRescheduleModal.value = false
  } catch (error) {
    toast.add({
      title: 'Reschedule Failed',
      description: 'Unable to reschedule session. Please try again.',
      color: 'error'
    })
  } finally {
    isRescheduling.value = false
  }
}

const submitReview = async () => {
  if (!selectedBooking.value || reviewForm.rating === 0) return
  
  isSubmittingReview.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.add({
      title: 'Review Submitted',
      description: 'Thank you for your feedback!',
      color: 'success'
    })
    
    showReviewModal.value = false
  } catch (error) {
    toast.add({
      title: 'Review Failed',
      description: 'Unable to submit review. Please try again.',
      color: 'error'
    })
  } finally {
    isSubmittingReview.value = false
  }
}

const formatDate = (date: Date | undefined) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
}

// Fetch bookings and mentors on mount
onMounted(async () => {
  await fetchBookings()
  await fetchMentors()
})

// SEO
useSeoMeta({
  title: 'My Bookings - iMentor',
  description: 'Manage your mentoring sessions and bookings'
})
</script>
