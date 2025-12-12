import type { AdminUser } from '~/types'

interface AdminUsersResponse {
  users: AdminUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface ApiAdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'mentee'
  avatar?: string
  status: 'active' | 'pending' | 'suspended'
  createdAt: string // ISO string from API
  updatedAt: string // ISO string from API
  lastActive: string // ISO string from API
  bio?: string
  location?: string | null
  experience?: string
  interests: string[]
  goals: string[]
  languages: string[]
  timezone?: string
}

export const useAdminUsers = () => {
  const users = ref<AdminUser[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Filters
  const searchQuery = ref('')
  const selectedStatus = ref<string>('all')
  
  // Pagination
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalUsers = ref(0)
  const pageSize = 10

  // Transform API user to AdminUser type
  const transformUser = (u: ApiAdminUser): AdminUser => {
    return {
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      avatar: u.avatar,
      createdAt: new Date(u.createdAt),
      updatedAt: new Date(u.updatedAt),
      status: u.status,
      lastActive: new Date(u.lastActive),
    }
  }

  const fetchUsers = async (page = 1) => {
    isLoading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams()
      
      if (searchQuery.value) params.set('search', searchQuery.value)
      if (selectedStatus.value && selectedStatus.value !== 'all') params.set('status', selectedStatus.value)
      params.set('page', page.toString())
      params.set('limit', pageSize.toString())

      const response = await $fetch<AdminUsersResponse>(`/api/admin/users?${params.toString()}`)
      
      users.value = response.users.map((user: any) => transformUser(user))
      currentPage.value = response.pagination.page
      totalPages.value = response.pagination.totalPages
      totalUsers.value = response.pagination.total
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to fetch users'
      console.error('[useAdminUsers] Error:', e)
    } finally {
      isLoading.value = false
    }
  }

  const getUserById = async (id: string): Promise<AdminUser | null> => {
    try {
      // For now, get from the local ref. Could be extended to fetch from API
      return users.value.find(u => u.id === id) || null
    } catch (e) {
      console.error('[useAdminUsers] Error fetching user:', e)
      return null
    }
  }

  const toggleUserStatus = async (user: AdminUser) => {
    try {
      // This would be an API call to update user status
      const newStatus = user.status === 'active' ? 'suspended' : 'active'
      
      // Optimistic update
      const originalStatus = user.status
      user.status = newStatus
      
      // API call would go here
      // await $fetch(`/api/admin/users/${user.id}/status`, { method: 'PUT', body: { status: newStatus } })
      
      console.log(`User ${user.id} status updated to ${newStatus}`)
    } catch (e: any) {
      // Revert on error
      user.status = user.status === 'active' ? 'suspended' : 'active'
      error.value = e.data?.message || 'Failed to update user status'
      console.error('[useAdminUsers] Error updating user status:', e)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      // This would be an API call to delete user
      // await $fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      
      // Optimistic update
      users.value = users.value.filter(user => user.id !== userId)
      totalUsers.value -= 1
      
      console.log(`User ${userId} deleted`)
    } catch (e: any) {
      // Refetch on error to restore state
      await fetchUsers(currentPage.value)
      error.value = e.data?.message || 'Failed to delete user'
      console.error('[useAdminUsers] Error deleting user:', e)
    }
  }

  // Client-side filtering for instant feedback (while typing search)
  const filteredUsers = computed(() => {
    // When using API, users are already filtered server-side
    // This is kept for instant client-side filtering while typing
    let filtered = users.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    }

    if (selectedStatus.value && selectedStatus.value !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus.value)
    }

    return filtered
  })

  // Watch for filter changes and refetch (with debounce for search)
  let searchTimeout: ReturnType<typeof setTimeout> | null = null
  
  watch(searchQuery, () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      currentPage.value = 1
      fetchUsers(1)
    }, 300)
  })

  watch(selectedStatus, () => {
    currentPage.value = 1
    fetchUsers(1)
  })

  watch(currentPage, () => {
    fetchUsers(currentPage.value)
  })

  return {
    users: readonly(users),
    isLoading: readonly(isLoading),
    error: readonly(error),
    searchQuery,
    selectedStatus,
    currentPage: readonly(currentPage),
    totalPages: readonly(totalPages),
    totalUsers: readonly(totalUsers),
    pageSize: pageSize,
    filteredUsers,
    fetchUsers,
    getUserById,
    toggleUserStatus,
    deleteUser,
  }
}
