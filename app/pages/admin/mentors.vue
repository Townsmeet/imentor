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
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ mentors.length }}</p>
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
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">4.8</p>
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
              v-model="statusFilter"
              :items="statusOptions"
              placeholder="All Statuses"
              size="md"
              class="w-full"
            />
          </div>
          <div>
            <USelect
              v-model="categoryFilter"
              :items="categoryOptions"
              placeholder="All Categories"
              size="md"
              class="w-full"
            />
          </div>
          <div>
            <USelect
              v-model="ratingFilter"
              :items="ratingOptions"
              placeholder="All Ratings"
              size="md"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Mentors Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Mentors ({{ filteredMentors.length }})
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

      <div class="overflow-x-auto">
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
              v-for="mentor in paginatedMentors"
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
                  <span class="text-sm text-gray-900 dark:text-white">{{ mentor.rating }}</span>
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
                <UDropdown :items="getMentorActions(mentor)">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    icon="heroicons:ellipsis-horizontal"
                    size="sm"
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
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredMentors.length) }} of {{ filteredMentors.length }} mentors
          </div>
          <div class="flex space-x-2">
            <UButton
              @click="currentPage--"
              :disabled="currentPage === 1"
              variant="outline"
              size="sm"
              icon="heroicons:chevron-left"
            >
              Previous
            </UButton>
            <UButton
              @click="currentPage++"
              :disabled="currentPage * pageSize >= filteredMentors.length"
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
    <UModal v-model="showMentorModal">
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
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedMentor.rating }}</span>
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
              <p class="text-gray-600 dark:text-gray-400">{{ selectedMentor.bio }}</p>
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

// State
interface Mentor {
  id: string
  name: string
  email: string
  avatar: string
  category: string
  experience: string
  status: 'verified' | 'pending' | 'suspended'
  rating: number
  reviews: number
  totalSessions: number
  totalRevenue: number
  hourlyRate: number
  responseRate: number
  completionRate: number
  joinedAt: string
  bio: string
  skills: string[]
}

const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const ratingFilter = ref('')
const currentPage = ref(1)
const pageSize = 10
const showMentorModal = ref(false)
const selectedMentor = ref<Mentor | null>(null)

// Filter options
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Verified', value: 'verified' },
  { label: 'Pending Review', value: 'pending' },
  { label: 'Suspended', value: 'suspended' }
]

const categoryOptions = [
  { label: 'All Categories', value: '' },
  { label: 'Software Development', value: 'Software Development' },
  { label: 'Product Management', value: 'Product Management' },
  { label: 'Design', value: 'Design' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Leadership', value: 'Leadership' }
]

const ratingOptions = [
  { label: 'All Ratings', value: '' },
  { label: '4.5+ Stars', value: '4.5' },
  { label: '4.0+ Stars', value: '4.0' },
  { label: '3.5+ Stars', value: '3.5' },
  { label: 'Below 3.5', value: '3.5-below' }
]

// Mock data
const mentors = ref<Mentor[]>([
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    category: 'Software Development',
    experience: '8+ years',
    status: 'verified',
    rating: 4.9,
    reviews: 127,
    totalSessions: 243,
    totalRevenue: 18225,
    hourlyRate: 85,
    responseRate: 98,
    completionRate: 96,
    joinedAt: '2023-01-15',
    bio: 'Senior Software Engineer with expertise in React, Node.js, and system architecture. Passionate about mentoring junior developers.',
    skills: ['React', 'Node.js', 'TypeScript', 'System Design', 'AWS']
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.r@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    category: 'Product Management',
    experience: '6+ years',
    status: 'verified',
    rating: 4.8,
    reviews: 89,
    totalSessions: 156,
    totalRevenue: 12480,
    hourlyRate: 95,
    responseRate: 95,
    completionRate: 94,
    joinedAt: '2023-02-20',
    bio: 'Product Manager at a Fortune 500 company. Expert in product strategy, user research, and agile methodologies.',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics', 'Leadership']
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    category: 'Design',
    experience: '5+ years',
    status: 'pending',
    rating: 4.7,
    reviews: 45,
    totalSessions: 78,
    totalRevenue: 5850,
    hourlyRate: 75,
    responseRate: 92,
    completionRate: 89,
    joinedAt: '2023-11-10',
    bio: 'UX/UI Designer with a passion for creating user-centered designs. Experienced in design systems and user research.',
    skills: ['UI/UX Design', 'Figma', 'Design Systems', 'User Research', 'Prototyping']
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    category: 'Marketing',
    experience: '7+ years',
    status: 'suspended',
    rating: 4.2,
    reviews: 67,
    totalSessions: 134,
    totalRevenue: 8020,
    hourlyRate: 70,
    responseRate: 85,
    completionRate: 82,
    joinedAt: '2023-03-05',
    bio: 'Digital Marketing Specialist with expertise in SEO, content marketing, and social media strategy.',
    skills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics', 'PPC']
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.t@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    category: 'Leadership',
    experience: '10+ years',
    status: 'verified',
    rating: 4.9,
    reviews: 156,
    totalSessions: 289,
    totalRevenue: 26010,
    hourlyRate: 120,
    responseRate: 99,
    completionRate: 97,
    joinedAt: '2022-12-01',
    bio: 'Executive Coach and Leadership Development expert. Former VP at tech startup, now helping others grow their careers.',
    skills: ['Leadership', 'Executive Coaching', 'Team Management', 'Strategy', 'Communication']
  }
])

// Computed
const verifiedMentors = computed(() => mentors.value.filter(m => m.status === 'verified').length)
const pendingMentors = computed(() => mentors.value.filter(m => m.status === 'pending').length)

const filteredMentors = computed(() => {
  let filtered = mentors.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(mentor =>
      mentor.name.toLowerCase().includes(query) ||
      mentor.email.toLowerCase().includes(query) ||
      mentor.category.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(mentor => mentor.status === statusFilter.value)
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(mentor => mentor.category === categoryFilter.value)
  }

  if (ratingFilter.value) {
    const rating = parseFloat(ratingFilter.value)
    if (ratingFilter.value === '3.5-below') {
      filtered = filtered.filter(mentor => mentor.rating < 3.5)
    } else {
      filtered = filtered.filter(mentor => mentor.rating >= rating)
    }
  }

  return filtered
})

const paginatedMentors = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredMentors.value.slice(start, end)
})

// Methods
const getStatusColor = (status: Mentor['status'] | string) => {
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

const getMentorActions = (mentor: Mentor) => {
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

const viewMentorDetails = (mentor: Mentor) => {
  selectedMentor.value = mentor
  showMentorModal.value = true
}

const updateMentorStatus = (mentorId: string, newStatus: Mentor['status']) => {
  const mentor = mentors.value.find(m => m.id === mentorId)
  if (mentor) {
    mentor.status = newStatus
    toast.add({
      title: 'Status Updated',
      description: `Mentor status changed to ${newStatus}`,
      color: 'success'
    })
    showMentorModal.value = false
  }
}

const toggleMentorStatus = (mentor: Mentor) => {
  const newStatus = mentor.status === 'verified' ? 'suspended' : 'verified'
  updateMentorStatus(mentor.id, newStatus)
}

const sendMessage = (mentor: Mentor) => {
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

// Watch for filter changes to reset pagination
watch([searchQuery, statusFilter, categoryFilter, ratingFilter], () => {
  currentPage.value = 1
})
</script>
