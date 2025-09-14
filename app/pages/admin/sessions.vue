<template>
  <NuxtLayout name="admin">
    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex-1 max-w-lg">
          <UInput
            v-model="searchQuery"
            placeholder="Search sessions..."
            icon="heroicons:magnifying-glass"
          />
        </div>
        
        <div class="flex items-center space-x-4">
          <USelect
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="All Status"
          />
          
          <USelect
            v-model="selectedMentor"
            :options="mentorOptions"
            placeholder="All Mentors"
          />
          
          <UButton
            icon="heroicons:funnel"
            variant="outline"
            @click="showFilters = !showFilters"
          >
            Filters
          </UButton>
        </div>
      </div>
      
      <!-- Advanced Filters -->
      <div v-if="showFilters" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormField label="Date Range">
            <UInput
              v-model="dateRange"
              type="date"
              placeholder="Select date range"
            />
          </UFormField>
          
          <UFormField label="Duration">
            <USelect
              v-model="selectedDuration"
              :options="durationOptions"
              placeholder="Any duration"
            />
          </UFormField>
          
          <UFormField label="Price Range">
            <UInput
              v-model="priceRange"
              placeholder="$0 - $200"
            />
          </UFormField>
        </div>
      </div>
    </div>

    <!-- Sessions Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Sessions ({{ filteredSessions.length }})
          </h3>
          <div class="flex items-center space-x-2">
            <UButton
              icon="heroicons:arrow-down-tray"
              variant="outline"
              size="sm"
              @click="exportSessions"
            >
              Export
            </UButton>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Session
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Participants
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duration
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="session in paginatedSessions" :key="session.id">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ session.title }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  ID: {{ session.id }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="flex -space-x-2">
                    <UAvatar
                      :src="session.mentor.avatar"
                      :alt="session.mentor.name"
                      size="sm"
                    />
                    <UAvatar
                      :src="session.mentee.avatar"
                      :alt="session.mentee.name"
                      size="sm"
                    />
                  </div>
                  <div>
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ session.mentor.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      with {{ session.mentee.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ formatDate(session.date) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ session.time }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ session.duration }}h
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="getStatusColor(session.status)"
                  variant="soft"
                >
                  {{ session.status }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ session.amount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdown :items="getSessionActions(session)">
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
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredSessions.length) }} of {{ filteredSessions.length }} results
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

    <!-- Session Details Modal -->
    <UModal v-model:open="showDetailsModal" :title="selectedSession?.title">
      <template #body>
        <div v-if="selectedSession" class="space-y-6">
          <!-- Participants -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Participants</h4>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <UAvatar
                  :src="selectedSession.mentor.avatar"
                  :alt="selectedSession.mentor.name"
                  size="md"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ selectedSession.mentor.name }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Mentor</p>
                </div>
              </div>
              <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-400" />
              <div class="flex items-center space-x-3">
                <UAvatar
                  :src="selectedSession.mentee.avatar"
                  :alt="selectedSession.mentee.name"
                  size="md"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ selectedSession.mentee.name }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Mentee</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Session Details -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
              <p class="text-sm text-gray-900 dark:text-white">
                {{ formatDate(selectedSession.date) }} at {{ selectedSession.time }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
              <p class="text-sm text-gray-900 dark:text-white">{{ selectedSession.duration }} hours</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <UBadge :color="getStatusColor(selectedSession.status)" variant="soft">
                {{ selectedSession.status }}
              </UBadge>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <p class="text-sm text-gray-900 dark:text-white">${{ selectedSession.amount }}</p>
            </div>
          </div>
          
          <!-- Description -->
          <div v-if="selectedSession.description">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <p class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              {{ selectedSession.description }}
            </p>
          </div>
          
          <!-- Payment Info -->
          <div v-if="selectedSession.paymentId">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Information</label>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p class="text-sm text-gray-900 dark:text-white">
                Payment ID: {{ selectedSession.paymentId }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Processed on {{ formatDate(selectedSession.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </template>
      
      <template #footer="{ close }">
        <div class="flex justify-end space-x-3">
          <UButton variant="ghost" @click="close">Close</UButton>
          <UButton
            v-if="selectedSession?.status === 'pending'"
            @click="updateSessionStatus(selectedSession.id, 'confirmed')"
          >
            Confirm Session
          </UButton>
        </div>
      </template>
    </UModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false
})

// State
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedMentor = ref('')
const selectedDuration = ref('')
const dateRange = ref('')
const priceRange = ref('')
const showFilters = ref(false)
const currentPage = ref(1)
const pageSize = 15
const showDetailsModal = ref(false)
const selectedSession = ref(null)

// Mock data
const sessions = ref([
  {
    id: 'SES-001',
    title: 'Career Growth Discussion',
    mentor: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    mentee: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    date: new Date('2024-01-25'),
    time: '2:00 PM',
    duration: 1,
    status: 'confirmed',
    amount: 75,
    description: 'Discussing career advancement strategies and goal setting',
    paymentId: 'PAY-12345',
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'SES-002',
    title: 'Technical Interview Prep',
    mentor: {
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    mentee: {
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    date: new Date('2024-01-26'),
    time: '10:00 AM',
    duration: 1.5,
    status: 'pending',
    amount: 135,
    description: 'Mock technical interviews and coding practice',
    paymentId: 'PAY-12346',
    createdAt: new Date('2024-01-21')
  },
  {
    id: 'SES-003',
    title: 'UX Design Review',
    mentor: {
      name: 'Elena Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    mentee: {
      name: 'Mike Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    date: new Date('2024-01-24'),
    time: '3:30 PM',
    duration: 1,
    status: 'completed',
    amount: 65,
    description: 'Portfolio review and design feedback session',
    paymentId: 'PAY-12347',
    createdAt: new Date('2024-01-19')
  },
  {
    id: 'SES-004',
    title: 'Startup Strategy Session',
    mentor: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    mentee: {
      name: 'Alex Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    date: new Date('2024-01-27'),
    time: '1:00 PM',
    duration: 2,
    status: 'cancelled',
    amount: 150,
    description: 'Business model validation and go-to-market strategy',
    paymentId: 'PAY-12348',
    createdAt: new Date('2024-01-22')
  }
])

// Options
const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const mentorOptions = computed(() => [
  { label: 'All Mentors', value: '' },
  ...Array.from(new Set(sessions.value.map(s => s.mentor.name)))
    .map(name => ({ label: name, value: name }))
])

const durationOptions = [
  { label: 'Any duration', value: '' },
  { label: '30 minutes', value: '0.5' },
  { label: '1 hour', value: '1' },
  { label: '1.5 hours', value: '1.5' },
  { label: '2+ hours', value: '2+' }
]

// Computed
const filteredSessions = computed(() => {
  let filtered = sessions.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(session =>
      session.title.toLowerCase().includes(query) ||
      session.mentor.name.toLowerCase().includes(query) ||
      session.mentee.name.toLowerCase().includes(query) ||
      session.id.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(session => session.status === selectedStatus.value)
  }

  if (selectedMentor.value) {
    filtered = filtered.filter(session => session.mentor.name === selectedMentor.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredSessions.value.length / pageSize))

const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredSessions.value.slice(start, end)
})

// Methods
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'green'
    case 'pending': return 'yellow'
    case 'completed': return 'blue'
    case 'cancelled': return 'red'
    default: return 'gray'
  }
}

const getSessionActions = (session: any) => [
  [{
    label: 'View Details',
    icon: 'heroicons:eye',
    click: () => {
      selectedSession.value = session
      showDetailsModal.value = true
    }
  }],
  [{
    label: session.status === 'pending' ? 'Confirm' : 'Edit',
    icon: session.status === 'pending' ? 'heroicons:check' : 'heroicons:pencil',
    click: () => {
      if (session.status === 'pending') {
        updateSessionStatus(session.id, 'confirmed')
      }
    }
  }],
  [{
    label: 'Cancel Session',
    icon: 'heroicons:x-mark',
    click: () => updateSessionStatus(session.id, 'cancelled')
  }]
]

const updateSessionStatus = (sessionId: string, newStatus: string) => {
  const session = sessions.value.find(s => s.id === sessionId)
  if (session) {
    session.status = newStatus
    showDetailsModal.value = false
  }
}

const exportSessions = () => {
  // Create CSV data
  const csvData = filteredSessions.value.map(session => ({
    ID: session.id,
    Title: session.title,
    Mentor: session.mentor.name,
    Mentee: session.mentee.name,
    Date: formatDate(session.date),
    Time: session.time,
    Duration: `${session.duration}h`,
    Status: session.status,
    Amount: `$${session.amount}`
  }))

  // Convert to CSV string
  const headers = Object.keys(csvData[0]).join(',')
  const rows = csvData.map(row => Object.values(row).join(',')).join('\n')
  const csv = `${headers}\n${rows}`

  // Download
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `sessions-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// SEO
useSeoMeta({
  title: 'Session Management - Admin Dashboard',
  description: 'Manage mentoring sessions and bookings'
})
</script>
