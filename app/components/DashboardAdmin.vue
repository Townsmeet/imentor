<template>
  <div>
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Platform overview and management tools
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <UButton
            icon="heroicons:cog-6-tooth"
            variant="outline"
            class="hidden sm:flex"
          >
            Settings
          </UButton>
          <UButton
            icon="heroicons:document-chart-bar"
            variant="outline"
            class="hidden sm:flex"
          >
            Reports
          </UButton>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:users" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalUsers }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:academic-cap" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeMentors }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Active Mentors</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:calendar-days" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalSessions }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Sessions This Month</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ platformRevenue }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Platform Revenue</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Platform Activity
            </h2>
          </div>
          
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  getActivityColor(activity.type)
                ]">
                  <Icon
                    :name="activity.icon"
                    class="w-4 h-4 text-white"
                  />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ activity.description }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ formatTimeAgo(activity.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Management -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                User Management
              </h2>
              <UButton
                icon="heroicons:plus"
                size="sm"
              >
                Add User
              </UButton>
            </div>
          </div>
          
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="user in recentUsers"
                :key="user.id"
                class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <UAvatar
                    :src="user.avatar"
                    :alt="user.name"
                    size="md"
                  />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ user.name }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ user.email }} • {{ user.role }}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <UBadge
                    :color="user.status === 'active' ? 'success' : 'neutral'"
                    variant="soft"
                  >
                    {{ user.status }}
                  </UBadge>
                  <UDropdownMenu :items="getUserActions(user)">
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
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Platform Health -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Platform Health
          </h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">System Status</span>
              <UBadge color="success" variant="soft">Operational</UBadge>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Server Load</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ serverLoad }}%</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Database</span>
              <UBadge color="success" variant="soft">Healthy</UBadge>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">API Response</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ apiResponse }}ms</span>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's Stats
          </h3>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">New Signups</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ todaySignups }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Sessions Booked</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ todaySessions }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Messages Sent</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ todayMessages }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ todayRevenue }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Admin Actions
          </h3>
          
          <div class="space-y-3">
            <UButton
              variant="outline"
              block
              icon="heroicons:users"
            >
              Manage Users
            </UButton>
            
            <UButton
              variant="outline"
              block
              icon="heroicons:document-chart-bar"
            >
              View Reports
            </UButton>
            
            <UButton
              variant="outline"
              block
              icon="heroicons:cog-6-tooth"
            >
              Platform Settings
            </UButton>
            
            <UButton
              variant="outline"
              block
              icon="heroicons:shield-check"
            >
              Security Center
            </UButton>
          </div>
        </div>

        <!-- Pending Approvals -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Approvals
            </h3>
            <UBadge color="warning" variant="soft">{{ pendingApprovals }}</UBadge>
          </div>
          
          <div class="space-y-3">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              • 3 Mentor applications
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              • 2 Profile updates
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              • 1 Dispute resolution
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock admin dashboard data
const totalUsers = ref(1247)
const activeMentors = ref(89)
const totalSessions = ref(342)
const platformRevenue = ref(15750)
const serverLoad = ref(23)
const apiResponse = ref(145)
const todaySignups = ref(12)
const todaySessions = ref(28)
const todayMessages = ref(156)
const todayRevenue = ref(890)
const pendingApprovals = ref(6)

const recentActivity = ref([
  {
    id: '1',
    type: 'user',
    icon: 'heroicons:user-plus',
    description: 'New mentor Sarah Chen joined the platform',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '2',
    type: 'session',
    icon: 'heroicons:calendar-days',
    description: '15 sessions completed successfully today',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '3',
    type: 'payment',
    icon: 'heroicons:currency-dollar',
    description: 'Payment of $450 processed for Marcus Johnson',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: '4',
    type: 'system',
    icon: 'heroicons:cog-6-tooth',
    description: 'System maintenance completed successfully',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
])

const recentUsers = ref([
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'mentor',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
  },
  {
    id: '2',
    name: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    role: 'mentee',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: '3',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    role: 'mentee',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  }
])

const getActivityColor = (type: string) => {
  switch (type) {
    case 'user': return 'bg-blue-500'
    case 'session': return 'bg-green-500'
    case 'payment': return 'bg-yellow-500'
    case 'system': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}

const getUserActions = (user: any) => {
  return [
    [{
      label: 'View Profile',
      icon: 'heroicons:eye',
      click: () => viewUserProfile(user)
    }],
    [{
      label: 'Edit User',
      icon: 'heroicons:pencil',
      click: () => editUser(user)
    }],
    [{
      label: user.status === 'active' ? 'Suspend' : 'Activate',
      icon: user.status === 'active' ? 'heroicons:pause' : 'heroicons:play',
      click: () => toggleUserStatus(user)
    }]
  ]
}

const viewUserProfile = (user: any) => {
  console.log('View profile for:', user.name)
}

const editUser = (user: any) => {
  console.log('Edit user:', user.name)
}

const toggleUserStatus = (user: any) => {
  user.status = user.status === 'active' ? 'suspended' : 'active'
}

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}
</script>
