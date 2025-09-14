<template>
  <NuxtLayout name="admin">
    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1 max-w-lg">
          <UInput
            v-model="searchQuery"
            placeholder="Search users..."
            icon="heroicons:magnifying-glass"
          />
        </div>
        
        <div class="flex items-center space-x-4">
          <USelect
            v-model="selectedRole"
            :options="roleOptions"
            placeholder="All Roles"
          />
          
          <USelect
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="All Status"
          />
          
          <UButton
            icon="heroicons:plus"
            @click="showCreateModal = true"
          >
            Add User
          </UButton>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Users ({{ filteredUsers.length }})
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Joined
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Active
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <UAvatar
                    :src="user.avatar"
                    :alt="`${user.firstName} ${user.lastName}`"
                    size="md"
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="user.role === 'mentor' ? 'blue' : user.role === 'mentee' ? 'green' : 'purple'"
                  variant="soft"
                >
                  {{ user.role }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="user.status === 'active' ? 'green' : user.status === 'pending' ? 'yellow' : 'red'"
                  variant="soft"
                >
                  {{ user.status }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(user.lastActive) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdown :items="getUserActions(user)">
                  <UButton
                    variant="ghost"
                    icon="heroicons:ellipsis-horizontal"
                  />
                </UDropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredUsers.length) }} of {{ filteredUsers.length }} results
          </div>
          <div class="flex items-center space-x-2">
            <UButton
              variant="ghost"
              icon="heroicons:chevron-left"
              :disabled="currentPage === 1"
              @click="currentPage--"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <UButton
              variant="ghost"
              icon="heroicons:chevron-right"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <UModal v-model:open="showCreateModal" title="Add New User">
      <template #body>
        <form @submit.prevent="createUser" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="First Name" required>
              <UInput v-model="newUser.firstName" placeholder="John" />
            </UFormField>
            <UFormField label="Last Name" required>
              <UInput v-model="newUser.lastName" placeholder="Doe" />
            </UFormField>
          </div>
          
          <UFormField label="Email" required>
            <UInput v-model="newUser.email" type="email" placeholder="john@example.com" />
          </UFormField>
          
          <UFormField label="Role" required>
            <USelect
              v-model="newUser.role"
              :options="[
                { label: 'Mentee', value: 'mentee' },
                { label: 'Mentor', value: 'mentor' },
                { label: 'Admin', value: 'admin' }
              ]"
            />
          </UFormField>
          
          <UFormField label="Password" required>
            <UInput v-model="newUser.password" type="password" placeholder="••••••••" />
          </UFormField>
        </form>
      </template>
      
      <template #footer="{ close }">
        <div class="flex justify-end space-x-3">
          <UButton variant="ghost" @click="close">Cancel</UButton>
          <UButton @click="createUser" :loading="isCreating">Create User</UButton>
        </div>
      </template>
    </UModal>

    <!-- User Details Modal -->
    <UModal v-model:open="showDetailsModal" :title="`${selectedUser?.firstName} ${selectedUser?.lastName}`">
      <template #body>
        <div v-if="selectedUser" class="space-y-6">
          <div class="flex items-center space-x-4">
            <UAvatar
              :src="selectedUser.avatar"
              :alt="`${selectedUser.firstName} ${selectedUser.lastName}`"
              size="xl"
            />
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ selectedUser.firstName }} {{ selectedUser.lastName }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">{{ selectedUser.email }}</p>
              <div class="flex items-center space-x-2 mt-2">
                <UBadge :color="selectedUser.role === 'mentor' ? 'blue' : 'green'" variant="soft">
                  {{ selectedUser.role }}
                </UBadge>
                <UBadge :color="selectedUser.status === 'active' ? 'green' : 'yellow'" variant="soft">
                  {{ selectedUser.status }}
                </UBadge>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Joined</label>
              <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedUser.createdAt) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Active</label>
              <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedUser.lastActive) }}</p>
            </div>
          </div>
          
          <div v-if="selectedUser.role === 'mentor'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mentor Stats</label>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedUser.stats?.sessions || 0 }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedUser.stats?.rating || 0 }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ selectedUser.stats?.revenue || 0 }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { User } from '~/types'

definePageMeta({
  middleware: 'admin',
  layout: false
})

// State
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = 10
const showCreateModal = ref(false)
const showDetailsModal = ref(false)
const selectedUser = ref<User | null>(null)
const isCreating = ref(false)

const newUser = reactive({
  firstName: '',
  lastName: '',
  email: '',
  role: 'mentee',
  password: ''
})

// Mock data
const users = ref<(User & { status: string; lastActive: Date; stats?: any })[]>([
  {
    id: '1',
    email: 'sarah.chen@example.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    status: 'active',
    lastActive: new Date('2024-01-20'),
    stats: { sessions: 127, rating: 4.9, revenue: 9525 }
  },
  {
    id: '2',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'mentee',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date(),
    status: 'active',
    lastActive: new Date('2024-01-19')
  },
  {
    id: '3',
    email: 'marcus.johnson@example.com',
    firstName: 'Marcus',
    lastName: 'Johnson',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date(),
    status: 'active',
    lastActive: new Date('2024-01-18'),
    stats: { sessions: 89, rating: 4.8, revenue: 8010 }
  },
  {
    id: '4',
    email: 'elena.rodriguez@example.com',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date(),
    status: 'pending',
    lastActive: new Date('2024-01-17'),
    stats: { sessions: 156, rating: 4.9, revenue: 10140 }
  }
])

// Options
const roleOptions = [
  { label: 'All Roles', value: '' },
  { label: 'Mentee', value: 'mentee' },
  { label: 'Mentor', value: 'mentor' },
  { label: 'Admin', value: 'admin' }
]

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Suspended', value: 'suspended' }
]

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(user => user.status === selectedStatus.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredUsers.value.slice(start, end)
})

// Methods
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const getUserActions = (user: any) => [
  [{
    label: 'View Details',
    icon: 'heroicons:eye',
    click: () => {
      selectedUser.value = user
      showDetailsModal.value = true
    }
  }],
  [{
    label: user.status === 'active' ? 'Suspend' : 'Activate',
    icon: user.status === 'active' ? 'heroicons:pause' : 'heroicons:play',
    click: () => toggleUserStatus(user)
  }],
  [{
    label: 'Delete',
    icon: 'heroicons:trash',
    click: () => deleteUser(user.id)
  }]
]

const createUser = async () => {
  isCreating.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = {
      id: String(users.value.length + 1),
      ...newUser,
      avatar: `https://images.unsplash.com/photo-${Math.random().toString().slice(2, 15)}?w=150`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      lastActive: new Date()
    }
    
    users.value.push(user)
    
    // Reset form
    Object.assign(newUser, {
      firstName: '',
      lastName: '',
      email: '',
      role: 'mentee',
      password: ''
    })
    
    showCreateModal.value = false
  } finally {
    isCreating.value = false
  }
}

const toggleUserStatus = (user: any) => {
  user.status = user.status === 'active' ? 'suspended' : 'active'
}

const deleteUser = (userId: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    users.value = users.value.filter(user => user.id !== userId)
  }
}

// SEO
useSeoMeta({
  title: 'User Management - Admin Dashboard',
  description: 'Manage users, mentors, and mentees'
})
</script>
