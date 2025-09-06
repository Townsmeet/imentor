<template>
  <div>
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {{ user?.firstName }}!
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Ready to inspire and guide your mentees?
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <UButton
            to="/availability"
            icon="heroicons:clock"
            variant="outline"
            class="hidden sm:flex"
          >
            Set Availability
          </UButton>
          <UButton
            to="/profile/edit"
            icon="heroicons:pencil"
            variant="outline"
            class="hidden sm:flex"
          >
            Edit Profile
          </UButton>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ monthlyEarnings }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">This Month</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:calendar-days" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ upcomingSessions }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Upcoming Sessions</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:users" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeMentees }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Active Mentees</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:star" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ averageRating }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Upcoming Sessions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Upcoming Sessions
              </h2>
              <UButton
                to="/sessions"
                variant="ghost"
                size="sm"
                icon="heroicons:arrow-right"
              >
                View All
              </UButton>
            </div>
          </div>
          
          <div class="p-6">
            <div v-if="mockUpcomingSessions.length === 0" class="text-center py-8">
              <Icon name="heroicons:calendar-days" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">No upcoming sessions</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="session in mockUpcomingSessions"
                :key="session.id"
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <UAvatar
                    :src="session.menteeAvatar"
                    :alt="session.menteeName"
                    size="md"
                  />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ session.title }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      with {{ session.menteeName }}
                    </p>
                    <p class="text-sm text-blue-600 dark:text-blue-400">
                      {{ formatDate(session.date) }} at {{ session.time }}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <UButton
                    icon="heroicons:video-camera"
                    size="sm"
                    variant="outline"
                  >
                    Join
                  </UButton>
                  <UButton
                    icon="heroicons:chat-bubble-left-right"
                    size="sm"
                    variant="ghost"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Earnings Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Earnings Overview
            </h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ totalEarnings }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ monthlyEarnings }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">This Month</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalSessions }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
              </div>
            </div>
            
            <!-- Simple earnings visualization -->
            <div class="space-y-3">
              <div
                v-for="month in earningsData"
                :key="month.name"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ month.name }}</span>
                <div class="flex items-center space-x-2">
                  <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      class="bg-green-600 h-2 rounded-full"
                      :style="{ width: `${(month.amount / 2000) * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">${{ month.amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Profile Performance -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile Performance
          </h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ profileViews }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Booking Rate</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ bookingRate }}%</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ responseTime }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ completionRate }}%</span>
            </div>
          </div>
        </div>

        <!-- Recent Reviews -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Reviews
            </h3>
            <UButton
              variant="ghost"
              size="sm"
              icon="heroicons:arrow-right"
            >
              View All
            </UButton>
          </div>
          
          <div class="space-y-4">
            <div
              v-for="review in recentReviews"
              :key="review.id"
              class="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0"
            >
              <div class="flex items-center space-x-2 mb-2">
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
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ review.name }}</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                "{{ review.comment }}"
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          
          <div class="space-y-3">
            <UButton
              to="/availability"
              variant="outline"
              block
              icon="heroicons:clock"
            >
              Update Availability
            </UButton>
            
            <UButton
              to="/messages"
              variant="outline"
              block
              icon="heroicons:chat-bubble-left-right"
            >
              Messages
            </UButton>
            
            <UButton
              to="/sessions"
              variant="outline"
              block
              icon="heroicons:calendar-days"
            >
              Manage Sessions
            </UButton>
            
            <UButton
              to="/profile/edit"
              variant="outline"
              block
              icon="heroicons:pencil"
            >
              Edit Profile
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()

// Mock data for mentor dashboard
const monthlyEarnings = ref(1250)
const upcomingSessions = ref(8)
const activeMentees = ref(12)
const averageRating = ref(4.9)
const totalEarnings = ref(8750)
const totalSessions = ref(127)
const profileViews = ref(89)
const bookingRate = ref(78)
const responseTime = ref('2h')
const completionRate = ref(96)

const mockUpcomingSessions = ref([
  {
    id: '1',
    title: 'Career Growth Strategy',
    menteeName: 'Alex Thompson',
    menteeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: '2:00 PM'
  },
  {
    id: '2',
    title: 'Technical Interview Prep',
    menteeName: 'Maria Garcia',
    menteeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '10:00 AM'
  }
])

const earningsData = ref([
  { name: 'Jan', amount: 1100 },
  { name: 'Feb', amount: 1350 },
  { name: 'Mar', amount: 1250 },
  { name: 'Apr', amount: 1450 },
  { name: 'May', amount: 1600 }
])

const recentReviews = ref([
  {
    id: '1',
    name: 'Alex T.',
    rating: 5,
    comment: 'Excellent guidance on career transition. Very helpful!'
  },
  {
    id: '2',
    name: 'Maria G.',
    rating: 5,
    comment: 'Great technical insights and practical advice.'
  }
])

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(date)
}
</script>
