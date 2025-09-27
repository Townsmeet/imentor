<template>
  <NuxtLayout name="admin">
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon
              :name="stat.icon"
              :class="[
                'w-8 h-8',
                stat.color === 'blue' ? 'text-blue-500' :
                stat.color === 'green' ? 'text-green-500' :
                stat.color === 'yellow' ? 'text-yellow-500' :
                'text-purple-500'
              ]"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ stat.name }}
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stat.value }}
                </div>
                <div
                  :class="[
                    'ml-2 flex items-baseline text-sm font-semibold',
                    stat.change > 0 ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  <Icon
                    :name="stat.change > 0 ? 'heroicons:arrow-up' : 'heroicons:arrow-down'"
                    class="w-4 h-4 mr-1"
                  />
                  {{ Math.abs(stat.change) }}%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Revenue Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Revenue Overview
        </h3>
        <div class="chart-wrapper">
          <LineChart
            :data="revenueData"
            :categories="revenueCategories"
            :height="300"
            :xFormatter="xFormatter"
            xLabel="Month"
            yLabel="Revenue"
          />
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-start space-x-3"
          >
            <div
              :class="[
                'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                activity.type === 'booking' ? 'bg-blue-500' :
                activity.type === 'payment' ? 'bg-green-500' :
                activity.type === 'user' ? 'bg-purple-500' :
                'bg-yellow-500'
              ]"
            />
            <div class="flex-1">
              <p class="text-sm text-gray-900 dark:text-white">
                {{ activity.description }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatTime(activity.timestamp) }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <UButton
            to="/admin/activity"
            variant="ghost"
            size="sm"
            trailing-icon="heroicons:arrow-right"
          >
            View all activity
          </UButton>
        </div>
      </div>
    </div>

    <!-- Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Bookings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Recent Bookings
          </h3>
        </div>
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Session
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="booking in recentBookings" :key="booking.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ booking.title }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ booking.mentorName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge
                    :color="booking.status === 'confirmed' ? 'success' : 
                           booking.status === 'pending' ? 'warning' : 'neutral'"
                    variant="soft"
                  >
                    {{ booking.status }}
                  </UBadge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ booking.amount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-3 bg-gray-50 dark:bg-gray-900">
          <UButton
            to="/admin/sessions"
            variant="ghost"
            size="sm"
            trailing-icon="heroicons:arrow-right"
          >
            View all sessions
          </UButton>
        </div>
      </div>

      <!-- Top Mentors -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Top Mentors
          </h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="mentor in topMentors"
              :key="mentor.id"
              class="flex items-center space-x-4"
            >
              <UAvatar
                :src="mentor.avatar"
                :alt="mentor.name"
                size="md"
              />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ mentor.name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ mentor.sessions }} sessions • ${{ mentor.revenue }}
                </p>
              </div>
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400" />
                <span class="text-sm text-gray-900 dark:text-white">{{ mentor.rating }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-3 bg-gray-50 dark:bg-gray-900">
          <UButton
            to="/admin/mentors"
            variant="ghost"
            size="sm"
            trailing-icon="heroicons:arrow-right"
          >
            View all mentors
          </UButton>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false
})

const stats = ref([
  {
    name: 'Total Users',
    value: '2,847',
    change: 12,
    icon: 'heroicons:users',
    color: 'blue'
  },
  {
    name: 'Active Mentors',
    value: '156',
    change: 8,
    icon: 'heroicons:academic-cap',
    color: 'green'
  },
  {
    name: 'Sessions This Month',
    value: '1,234',
    change: 15,
    icon: 'heroicons:calendar-days',
    color: 'yellow'
  },
  {
    name: 'Revenue',
    value: '$48,392',
    change: 23,
    icon: 'heroicons:currency-dollar',
    color: 'purple'
  }
])

const recentActivity = ref([
  {
    id: '1',
    type: 'booking',
    description: 'New session booked: Career Growth Discussion',
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: '2',
    type: 'payment',
    description: 'Payment received: $75 from John Doe',
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: '3',
    type: 'user',
    description: 'New mentor application from Sarah Chen',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '4',
    type: 'booking',
    description: 'Session completed: Technical Interview Prep',
    timestamp: new Date(Date.now() - 45 * 60 * 1000)
  }
])

const recentBookings = ref([
  {
    id: '1',
    title: 'Career Growth Discussion',
    mentorName: 'Sarah Chen',
    status: 'confirmed',
    amount: 75
  },
  {
    id: '2',
    title: 'Technical Interview Prep',
    mentorName: 'Marcus Johnson',
    status: 'pending',
    amount: 90
  },
  {
    id: '3',
    title: 'UX Design Review',
    mentorName: 'Elena Rodriguez',
    status: 'confirmed',
    amount: 65
  }
])

const topMentors = ref([
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    sessions: 127,
    revenue: 9525,
    rating: 4.9
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    sessions: 89,
    revenue: 8010,
    rating: 4.8
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    sessions: 156,
    revenue: 10140,
    rating: 4.9
  }
])

const formatTime = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (minutes < 60) return `${minutes}m ago`
  return `${hours}h ago`
}

// SEO
useSeoMeta({
  title: 'Admin Dashboard - iMentor',
  description: 'Admin dashboard for managing the iMentor platform'
})

// Revenue chart (dummy data)
const revenueData = [
  { month: 'Jan', revenue: 1200, bookings: 42 },
  { month: 'Feb', revenue: 1450, bookings: 48 },
  { month: 'Mar', revenue: 1780, bookings: 57 },
  { month: 'Apr', revenue: 1620, bookings: 51 },
  { month: 'May', revenue: 1910, bookings: 63 }
]

const revenueCategories = {
  revenue: {
    name: 'Revenue',
    color: '#3b82f6' // Tailwind blue-500
  },
  bookings: {
    name: 'Bookings',
    color: '#10b981' // Tailwind emerald-500
  }
}

const xFormatter = (i: number) => revenueData[i]?.month ?? ''
</script>
