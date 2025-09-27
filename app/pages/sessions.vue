<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          My Sessions
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your upcoming and past mentoring sessions
        </p>
      </div>
      
      <UButton
        v-if="user?.role === 'mentee'"
        to="/mentors"
        icon="heroicons:plus"
      >
        Book New Session
      </UButton>
    </div>

    <!-- Tabs -->
    <div class="mb-8">
      <UTabs
        v-model="activeTab"
        :items="tabs"
        class="w-full"
      />
    </div>

    <!-- Upcoming Sessions -->
    <div v-if="activeTab === 0" class="space-y-6">
      <div v-if="upcomingSessions.length === 0" class="text-center py-12">
        <Icon name="heroicons:calendar-days" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No upcoming sessions
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ user?.role === 'mentee' ? 'Book your first session with a mentor' : 'No sessions scheduled yet' }}
        </p>
        <UButton
          v-if="user?.role === 'mentee'"
          to="/mentors"
          icon="heroicons:magnifying-glass"
        >
          Find Mentors
        </UButton>
      </div>

      <div v-else class="grid gap-6">
        <div
          v-for="session in upcomingSessions"
          :key="session.id"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
              <UAvatar
                :src="session.avatar"
                :alt="session.participantName"
                size="lg"
              />
              
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {{ session.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-2">
                  {{ user?.role === 'mentee' ? 'with' : 'for' }} {{ session.participantName }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {{ session.description }}
                </p>
                
                <div class="flex items-center space-x-6 text-sm">
                  <div class="flex items-center space-x-2">
                    <Icon name="heroicons:calendar-days" class="w-4 h-4 text-blue-600" />
                    <span class="text-gray-900 dark:text-white font-medium">
                      {{ formatDate(session.scheduledAt) }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Icon name="heroicons:clock" class="w-4 h-4 text-blue-600" />
                    <span class="text-gray-900 dark:text-white font-medium">
                      {{ formatTime(session.scheduledAt) }} ({{ session.duration }}min)
                    </span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <UBadge
                      :color="getStatusColor(session.status)"
                      variant="soft"
                    >
                      {{ session.status }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <UButton
                v-if="session.status === 'confirmed' && isSessionSoon(session.scheduledAt)"
                icon="heroicons:video-camera"
                size="sm"
                @click="joinSession(session)"
              >
                Join
              </UButton>
              
              <UButton
                icon="heroicons:chat-bubble-left-right"
                variant="outline"
                size="sm"
                @click="openChat(session.participantId)"
              >
                Chat
              </UButton>
              
              <UDropdownMenu :items="getSessionActions(session)">
                <UButton
                  icon="heroicons:ellipsis-vertical"
                  variant="ghost"
                  size="sm"
                />
              </UDropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Past Sessions -->
    <div v-if="activeTab === 1" class="space-y-6">
      <div v-if="pastSessions.length === 0" class="text-center py-12">
        <Icon name="heroicons:clock" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No past sessions
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Your completed sessions will appear here
        </p>
      </div>

      <div v-else class="grid gap-6">
        <div
          v-for="session in pastSessions"
          :key="session.id"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
              <UAvatar
                :src="session.avatar"
                :alt="session.participantName"
                size="lg"
              />
              
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {{ session.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-2">
                  {{ user?.role === 'mentee' ? 'with' : 'for' }} {{ session.participantName }}
                </p>
                
                <div class="flex items-center space-x-6 text-sm mb-4">
                  <div class="flex items-center space-x-2">
                    <Icon name="heroicons:calendar-days" class="w-4 h-4 text-gray-400" />
                    <span class="text-gray-600 dark:text-gray-400">
                      {{ formatDate(session.scheduledAt) }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Icon name="heroicons:clock" class="w-4 h-4 text-gray-400" />
                    <span class="text-gray-600 dark:text-gray-400">
                      {{ session.duration }}min
                    </span>
                  </div>
                  <UBadge
                    :color="getStatusColor(session.status)"
                    variant="soft"
                  >
                    {{ session.status }}
                  </UBadge>
                </div>

                <div v-if="session.notes" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Notes:</strong> {{ session.notes }}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <UButton
                v-if="user?.role === 'mentee' && session.status === 'completed' && !session.reviewed"
                variant="outline"
                size="sm"
                icon="heroicons:star"
                @click="openReviewModal(session)"
              >
                Review
              </UButton>
              
              <UButton
                icon="heroicons:chat-bubble-left-right"
                variant="ghost"
                size="sm"
                @click="openChat(session.participantId)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <UModal v-model:open="showReviewModal" :overlay="true" :prevent-body-scroll="true">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Review Session
          </h3>
          
          <div v-if="selectedSession" class="space-y-4">
            <div class="text-center">
              <UAvatar
                :src="selectedSession.avatar"
                :alt="selectedSession.participantName"
                size="lg"
                class="mx-auto mb-2"
              />
              <p class="font-medium text-gray-900 dark:text-white">
                {{ selectedSession.participantName }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ selectedSession.title }}
              </p>
            </div>

            <UFormField label="Rating" required>
              <div class="flex justify-center space-x-2">
                <button
                  v-for="i in 5"
                  :key="i"
                  @click="reviewForm.rating = i"
                  class="p-1"
                >
                  <Icon
                    name="heroicons:star"
                    :class="[
                      'w-8 h-8 transition-colors',
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
          
          <div class="flex justify-end space-x-3 mt-6">
            <UButton
              variant="ghost"
              @click="showReviewModal = false"
            >
              Cancel
            </UButton>
            <UButton
              @click="submitReview"
              :loading="isSubmittingReview"
              :disabled="reviewForm.rating === 0"
            >
              Submit Review
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Session {
  id: string
  title: string
  description: string
  participantId: string
  participantName: string
  avatar: string
  scheduledAt: Date
  duration: number
  status: string
  meetingLink?: string
  notes?: string
  reviewed?: boolean
}

definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const toast = useToast()

const activeTab = ref(0)
const showReviewModal = ref(false)
const isSubmittingReview = ref(false)
const selectedSession = ref<Session | null>(null)

const tabs = [
  { label: 'Upcoming', icon: 'heroicons:calendar-days' },
  { label: 'Past', icon: 'heroicons:clock' }
]

const reviewForm = reactive({
  rating: 0,
  comment: ''
})

// Mock data - replace with actual API calls
const upcomingSessions = ref<Session[]>([
  {
    id: '1',
    title: 'Career Growth Strategy',
    description: 'Discussing next steps for career advancement and skill development',
    participantId: '2',
    participantName: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    duration: 60,
    status: 'confirmed',
    meetingLink: 'https://meet.example.com/abc123'
  }
])

const pastSessions = ref<Session[]>([
  {
    id: '2',
    title: 'Technical Interview Preparation',
    description: 'Mock interview and feedback session',
    participantId: '3',
    participantName: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 90,
    status: 'completed',
    notes: 'Great session! Covered system design and behavioral questions.',
    reviewed: false
  }
])

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'success'
    case 'pending': return 'warning'
    case 'completed': return 'primary'
    case 'cancelled': return 'error'
    default: return 'neutral'
  }
}

const isSessionSoon = (scheduledAt: Date) => {
  const now = new Date()
  const timeDiff = scheduledAt.getTime() - now.getTime()
  return timeDiff <= 30 * 60 * 1000 && timeDiff > 0 // Within 30 minutes
}

const joinSession = (session: Session) => {
  if (session.meetingLink) {
    window.open(session.meetingLink, '_blank')
  } else {
    toast.add({
      title: 'Meeting link not available',
      description: 'The meeting link will be provided closer to the session time.',
      color: 'warning'
    })
  }
}

const openChat = (participantId: string) => {
  navigateTo(`/messages?user=${participantId}`)
}

const getSessionActions = (session: Session) => {
  const actions = []
  
  if (session.status === 'pending' || session.status === 'confirmed') {
    actions.push([{
      label: 'Reschedule',
      icon: 'heroicons:calendar-days',
      click: () => rescheduleSession(session)
    }])
    
    actions.push([{
      label: 'Cancel',
      icon: 'heroicons:x-mark',
      click: () => cancelSession(session)
    }])
  }
  
  return actions
}

const rescheduleSession = (session: Session) => {
  toast.add({
    title: 'Reschedule Session',
    description: 'Reschedule functionality will be available soon.',
    color: 'primary'
  })
}

const cancelSession = async (session: Session) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update session status
    session.status = 'cancelled'
    
    toast.add({
      title: 'Session Cancelled',
      description: 'The session has been cancelled successfully.',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to cancel session. Please try again.',
      color: 'error'
    })
  }
}

const openReviewModal = (session: Session) => {
  selectedSession.value = session
  reviewForm.rating = 0
  reviewForm.comment = ''
  showReviewModal.value = true
}

const submitReview = async () => {
  isSubmittingReview.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mark session as reviewed
    if (selectedSession.value) {
      selectedSession.value.reviewed = true
    }
    
    toast.add({
      title: 'Review Submitted',
      description: 'Thank you for your feedback!',
      color: 'success'
    })
    
    showReviewModal.value = false
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to submit review. Please try again.',
      color: 'error'
    })
  } finally {
    isSubmittingReview.value = false
  }
}
</script>
