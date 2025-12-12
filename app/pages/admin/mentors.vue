<template>
  <NuxtLayout name="admin">

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:academic-cap" class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Mentors</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalMentors }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:check-badge" class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Verified</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ verifiedMentors }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:clock" class="h-8 w-8 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Review</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pendingMentors }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:star" class="h-8 w-8 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Rating</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ averageRating }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <UInput
              v-model="searchQuery"
              placeholder="Search mentors..."
              icon="heroicons:magnifying-glass"
              size="md"
              class="w-full"
            />
          </div>
          <div>
            <USelect
              v-model="selectedStatus"
              :items="statusOptions"
              placeholder="All Statuses"
              size="md"
              class="w-full"
            />
          </div>
          <div>
            <USelect
              v-model="selectedCategory"
              :items="categoryOptions"
              placeholder="All Categories"
              size="md"
              class="w-full"
            />
          </div>
          <div>
            <USelect
              v-model="selectedRating"
              :items="ratingOptions"
              placeholder="All Ratings"
              size="md"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mb-6 px-6 py-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              {{ error }}
            </div>
          </div>
        </div>
        <button 
          @click="fetchMentors()" 
          class="ml-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="ml-2 text-gray-600 dark:text-gray-400">Loading mentors...</span>
      </div>
    </div>

    <!-- Mentors Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Mentors ({{ mentors.length }})
          </h3>
          <div class="flex space-x-2">
            <UButton
              @click="exportMentors"
              variant="outline"
              icon="heroicons:arrow-down-tray"
              size="sm"
            >
              Export
            </UButton>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="mentors.length === 0" class="p-8 text-center">
        <Icon name="heroicons:academic-cap" class="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No mentors found</h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all' ? 'Try adjusting your filters' : 'No mentors have registered yet' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Mentor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rating
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Sessions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Revenue
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Joined
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="mentor in mentors"
              :key="mentor.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <UAvatar
                    :src="mentor.avatar"
                    :alt="mentor.name"
                    size="md"
                    class="mr-3"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ mentor.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ mentor.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ mentor.category }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ mentor.experience }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="getStatusColor(mentor.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ mentor.status }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Icon name="heroicons:star" class="h-4 w-4 text-yellow-400 mr-1" />
                  <span class="text-sm text-gray-900 dark:text-white">{{ mentor.rating.toFixed(1) }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">({{ mentor.reviews }})</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ mentor.totalSessions }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ mentor.totalRevenue.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(mentor.joinedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdownMenu :items="getMentorActions(mentor)">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    icon="heroicons:ellipsis-horizontal"
                    size="sm"
                  />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="mentors.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalMentors) }} of {{ totalMentors }} mentors
          </div>
          <div class="flex space-x-2">
            <UButton
              @click="previousPage"
              :disabled="currentPage === 1"
              variant="outline"
              size="sm"
              icon="heroicons:chevron-left"
            >
              Previous
            </UButton>
            <UButton
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              variant="outline"
              size="sm"
              icon="heroicons:chevron-right"
            >
              Next
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Mentor Details Modal -->
    <UModal v-model:open="showMentorModal">
      <div class="p-6" v-if="selectedMentor">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Mentor Details
          </h3>
          <UButton
            @click="showMentorModal = false"
            variant="ghost"
            icon="heroicons:x-mark"
            size="sm"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Profile Info -->
          <div class="lg:col-span-2">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <div class="flex items-center space-x-4 mb-4">
                <UAvatar
                  :src="selectedMentor.avatar"
                  :alt="selectedMentor.name"
                  size="xl"
                />
                <div>
                  <h4 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ selectedMentor.name }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400">{{ selectedMentor.email }}</p>
                  <div class="flex items-center mt-2">
                    <Icon name="heroicons:star" class="h-4 w-4 text-yellow-400 mr-1" />
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedMentor.rating.toFixed(1) }}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">({{ selectedMentor.reviews }} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-500 dark:text-gray-400">Category:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ selectedMentor.category }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-500 dark:text-gray-400">Experience:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ selectedMentor.experience }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-500 dark:text-gray-400">Hourly Rate:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">${{ selectedMentor.hourlyRate }}/hr</span>
                </div>
                <div>
                  <span class="font-medium text-gray-500 dark:text-gray-400">Joined:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ formatDate(selectedMentor.joinedAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Bio -->
            <div class="mb-6">
              <h5 class="font-semibold text-gray-900 dark:text-white mb-2">Bio</h5>
              <p class="text-gray-600 dark:text-gray-400">{{ selectedMentor.bio || 'No bio provided' }}</p>
            </div>

            <!-- Skills -->
            <div class="mb-6">
              <h5 class="font-semibold text-gray-900 dark:text-white mb-2">Skills</h5>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="skill in selectedMentor.skills"
                  :key="skill"
                  variant="soft"
                  size="sm"
                >
                  {{ skill }}
                </UBadge>
                <span v-if="selectedMentor.skills.length === 0" class="text-gray-500 dark:text-gray-400">No skills listed</span>
              </div>
            </div>
          </div>

          <!-- Stats & Actions -->
          <div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h5 class="font-semibold text-gray-900 dark:text-white mb-4">Performance</h5>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Total Sessions</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedMentor.totalSessions }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">${{ selectedMentor.totalRevenue.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Response Rate</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedMentor.responseRate }}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Completion Rate</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedMentor.completionRate }}%</span>
                </div>
              </div>
            </div>

            <!-- Status Actions -->
            <div class="space-y-3">
              <UButton
                v-if="selectedMentor.status === 'pending'"
                @click="updateMentorStatus(selectedMentor.id, 'verified')"
                block
                color="success"
                icon="heroicons:check-circle"
              >
                Verify Mentor
              </UButton>
              
              <UButton
                v-if="selectedMentor.status === 'verified'"
                @click="updateMentorStatus(selectedMentor.id, 'suspended')"
                block
                color="error"
                variant="outline"
                icon="heroicons:pause-circle"
              >
                Suspend Mentor
              </UButton>
              
              <UButton
                v-if="selectedMentor.status === 'suspended'"
                @click="updateMentorStatus(selectedMentor.id, 'verified')"
                block
                color="success"
                variant="outline"
                icon="heroicons:play-circle"
              >
                Reactivate Mentor
              </UButton>
              
              <UButton
                @click="sendMessage(selectedMentor)"
                block
                variant="outline"
                icon="heroicons:chat-bubble-left-right"
              >
                Send Message
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false
})

useSeoMeta({
  title: 'Mentor Management - Admin Dashboard',
  description: 'Manage mentor profiles, verification status, and performance metrics'
})

const toast = useToast()

// Use admin mentors composable
const {
  mentors,
  isLoading,
  error,
  searchQuery,
  selectedStatus,
  selectedCategory,
  selectedRating,
  statusOptions,
  categoryOptions,
  ratingOptions,
  currentPage,
  totalPages,
  totalMentors,
  pageSize,
  showMentorModal,
  selectedMentor,
  verifiedMentors,
  pendingMentors,
  fetchMentors,
  viewMentorDetails,
  updateMentorStatus,
  toggleMentorStatus,
  previousPage,
  nextPage,
} = useAdminMentors()

// Computed
const averageRating = computed(() => {
  if (mentors.value.length === 0) return '0.0'
  const sum = mentors.value.reduce((acc, m) => acc + m.rating, 0)
  return (sum / mentors.value.length).toFixed(1)
})

// Methods
const getStatusColor = (status: string) => {
  switch (status) {
    case 'verified': return 'success'
    case 'pending': return 'warning'
    case 'suspended': return 'error'
    default: return 'neutral'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getMentorActions = (mentor: any) => {
  return [
    [{
      label: 'View Details',
      icon: 'heroicons:eye',
      click: () => viewMentorDetails(mentor)
    }],
    [{
      label: 'Send Message',
      icon: 'heroicons:chat-bubble-left-right',
      click: () => sendMessage(mentor)
    }],
    [{
      label: mentor.status === 'verified' ? 'Suspend' : 'Verify',
      icon: mentor.status === 'verified' ? 'heroicons:pause-circle' : 'heroicons:check-circle',
      click: () => toggleMentorStatus(mentor)
    }]
  ]
}

const sendMessage = (mentor: any) => {
  toast.add({
    title: 'Message Sent',
    description: `Message sent to ${mentor.name}`,
    color: 'success'
  })
}

const exportMentors = () => {
  toast.add({
    title: 'Export Started',
    description: 'Mentor data export has been initiated',
    color: 'success'
  })
}

// Initial data fetch
onMounted(() => {
  fetchMentors()
})
</script>
