<template>
  <NuxtLayout name="admin">
    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="metric in keyMetrics"
        :key="metric.name"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon
              :name="metric.icon"
              :class="['w-8 h-8', `text-${metric.color}-500`]"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ metric.name }}
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ metric.value }}
                </div>
                <div
                  :class="[
                    'ml-2 flex items-baseline text-sm font-semibold',
                    metric.change > 0 ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  <Icon
                    :name="metric.change > 0 ? 'heroicons:arrow-up' : 'heroicons:arrow-down'"
                    class="w-4 h-4 mr-1"
                  />
                  {{ Math.abs(metric.change) }}%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Revenue Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Revenue Trends
          </h3>
          <USelect
            v-model="revenueTimeframe"
            :items="timeframeOptions"
            size="sm"
          />
        </div>
        <div class="chart-wrapper">
          <LineChart
            :data="revenueTrendData"
            :categories="revenueTrendCategories"
            :height="320"
            :xFormatter="revenueXFormatter"
            xLabel="Month"
            yLabel="Revenue"
          />
        </div>
      </div>

      <!-- User Growth Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            User Growth
          </h3>
          <USelect
            v-model="userGrowthTimeframe"
            :items="timeframeOptions"
            size="sm"
          />
        </div>
        <div class="chart-wrapper">
          <LineChart
            :data="userGrowthData"
            :categories="userGrowthCategories"
            :height="320"
            :xFormatter="userGrowthXFormatter"
            xLabel="Month"
            yLabel="Users"
          />
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Session Analytics -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Session Analytics
        </h3>
        <div class="space-y-4">
          <div
            v-for="stat in sessionStats"
            :key="stat.label"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</span>
            <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ stat.value }}</span>
          </div>
        </div>
      </div>

      <!-- Top Categories -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Popular Categories
        </h3>
        <div class="space-y-3">
          <div
            v-for="category in topCategories"
            :key="category.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div
                :class="[
                  'w-3 h-3 rounded-full',
                  `bg-${category.color}-500`
                ]"
              />
              <span class="text-sm text-gray-900 dark:text-white">{{ category.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ category.sessions }}</span>
              <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  :class="[
                    'h-2 rounded-full',
                    `bg-${category.color}-500`
                  ]"
                  :style="{ width: `${category.percentage}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mentor Performance -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Mentor Performance
        </h3>
        <div class="space-y-4">
          <div
            v-for="mentor in topPerformingMentors"
            :key="mentor.id"
            class="flex items-center space-x-3"
          >
            <UAvatar
              :src="mentor.avatar"
              :alt="mentor.name"
              size="sm"
            />
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ mentor.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
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
    </div>

    <!-- Detailed Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Geographic Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Geographic Distribution
          </h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="location in geographicData"
              :key="location.country"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="text-2xl">{{ location.flag }}</span>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ location.country }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ location.city }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ location.users }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ location.percentage }}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Platform Activity
          </h3>
        </div>
        <div class="p-6">
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
              <span class="text-xs text-gray-400 dark:text-gray-500">
                {{ activity.count }}
              </span>
            </div>
          </div>
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

// State
const revenueTimeframe = ref('30d')
const userGrowthTimeframe = ref('30d')

// Options
const timeframeOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Last year', value: '1y' }
]

// Mock data
const keyMetrics = ref([
  {
    name: 'Total Revenue',
    value: '$48,392',
    change: 23,
    icon: 'heroicons:currency-dollar',
    color: 'green'
  },
  {
    name: 'Active Users',
    value: '2,847',
    change: 12,
    icon: 'heroicons:users',
    color: 'blue'
  },
  {
    name: 'Sessions Completed',
    value: '1,234',
    change: 15,
    icon: 'heroicons:calendar-days',
    color: 'purple'
  },
  {
    name: 'Avg Session Rating',
    value: '4.8',
    change: 5,
    icon: 'heroicons:star',
    color: 'yellow'
  }
])

const sessionStats = ref([
  { label: 'Total Sessions', value: '3,247' },
  { label: 'Completion Rate', value: '94%' },
  { label: 'Avg Duration', value: '1.2h' },
  { label: 'Cancellation Rate', value: '6%' },
  { label: 'Rebooking Rate', value: '78%' }
])

const topCategories = ref([
  { name: 'Software Development', sessions: 456, percentage: 85, color: 'blue' },
  { name: 'Career Growth', sessions: 342, percentage: 64, color: 'green' },
  { name: 'Product Management', sessions: 289, percentage: 54, color: 'purple' },
  { name: 'Design', sessions: 234, percentage: 44, color: 'pink' },
  { name: 'Data Science', sessions: 187, percentage: 35, color: 'yellow' }
])

const topPerformingMentors = ref([
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

const geographicData = ref([
  { country: 'United States', city: 'San Francisco', flag: '🇺🇸', users: 1247, percentage: 44 },
  { country: 'United Kingdom', city: 'London', flag: '🇬🇧', users: 523, percentage: 18 },
  { country: 'Canada', city: 'Toronto', flag: '🇨🇦', users: 342, percentage: 12 },
  { country: 'Germany', city: 'Berlin', flag: '🇩🇪', users: 289, percentage: 10 },
  { country: 'Australia', city: 'Sydney', flag: '🇦🇺', users: 234, percentage: 8 },
  { country: 'India', city: 'Bangalore', flag: '🇮🇳', users: 212, percentage: 8 }
])

const recentActivity = ref([
  {
    id: '1',
    type: 'booking',
    description: 'New sessions booked',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    count: 23
  },
  {
    id: '2',
    type: 'payment',
    description: 'Payments processed',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    count: 18
  },
  {
    id: '3',
    type: 'user',
    description: 'New user registrations',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    count: 12
  },
  {
    id: '4',
    type: 'mentor',
    description: 'Mentor applications',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    count: 5
  }
])

// Methods
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
  title: 'Analytics - Admin Dashboard',
  description: 'Platform analytics and insights'
})

// Charts: Revenue Trends (dummy data)
const revenueTrendData = [
  { month: 'Jan', revenue: 1200, bookings: 40 },
  { month: 'Feb', revenue: 1450, bookings: 48 },
  { month: 'Mar', revenue: 1780, bookings: 57 },
  { month: 'Apr', revenue: 1620, bookings: 51 },
  { month: 'May', revenue: 1910, bookings: 63 },
  { month: 'Jun', revenue: 2050, bookings: 67 }
]

const revenueTrendCategories = {
  revenue: { name: 'Revenue', color: '#3b82f6' }, // blue-500
  bookings: { name: 'Bookings', color: '#10b981' } // emerald-500
}

const revenueXFormatter = (i: number) => revenueTrendData[i]?.month ?? ''

// Charts: User Growth (dummy data)
const userGrowthData = [
  { month: 'Jan', mentors: 420, mentees: 980 },
  { month: 'Feb', mentors: 450, mentees: 1050 },
  { month: 'Mar', mentors: 470, mentees: 1120 },
  { month: 'Apr', mentors: 500, mentees: 1180 },
  { month: 'May', mentors: 540, mentees: 1260 },
  { month: 'Jun', mentors: 565, mentees: 1330 }
]

const userGrowthCategories = {
  mentors: { name: 'Mentors', color: '#8b5cf6' }, // violet-500
  mentees: { name: 'Mentees', color: '#f59e0b' }  // amber-500
}

const userGrowthXFormatter = (i: number) => userGrowthData[i]?.month ?? ''
</script>
