interface AdminMentor {
    id: string
    name: string
    email: string
    avatar?: string
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
    isAvailable: boolean
}

interface CategoryOption {
    id: string
    name: string
}

interface AdminMentorsResponse {
    mentors: AdminMentor[]
    categories: CategoryOption[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export const useAdminMentors = () => {
    const mentors = ref<AdminMentor[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Categories for filter
    const categories = ref<CategoryOption[]>([])

    // Filters
    const searchQuery = ref('')
    const selectedStatus = ref<string>('all')
    const selectedCategory = ref<string>('all')
    const selectedRating = ref<string>('all')

    // Pagination
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalMentors = ref(0)
    const pageSize = 10

    // Modal state
    const showMentorModal = ref(false)
    const selectedMentor = ref<AdminMentor | null>(null)

    const fetchMentors = async (page = 1) => {
        isLoading.value = true
        error.value = null

        try {
            const params = new URLSearchParams()

            if (searchQuery.value) params.set('search', searchQuery.value)
            if (selectedStatus.value && selectedStatus.value !== 'all') params.set('status', selectedStatus.value)
            if (selectedCategory.value && selectedCategory.value !== 'all') params.set('category', selectedCategory.value)
            if (selectedRating.value && selectedRating.value !== 'all') params.set('rating', selectedRating.value)
            params.set('page', page.toString())
            params.set('limit', pageSize.toString())

            const response = await $fetch<AdminMentorsResponse>(`/api/admin/mentors?${params.toString()}`)

            mentors.value = response.mentors
            categories.value = response.categories
            currentPage.value = response.pagination.page
            totalPages.value = response.pagination.totalPages
            totalMentors.value = response.pagination.total
        } catch (e: any) {
            error.value = e.data?.message || e.message || 'Failed to fetch mentors'
            console.error('[useAdminMentors] Error:', e)
        } finally {
            isLoading.value = false
        }
    }

    const viewMentorDetails = (mentor: AdminMentor) => {
        selectedMentor.value = mentor
        showMentorModal.value = true
    }

    const updateMentorStatus = async (mentorId: string, newStatus: AdminMentor['status']) => {
        try {
            // TODO: Implement API call to update mentor status
            // await $fetch(`/api/admin/mentors/${mentorId}/status`, { method: 'PUT', body: { status: newStatus } })

            // Optimistic update
            const mentor = mentors.value.find(m => m.id === mentorId)
            if (mentor) {
                mentor.status = newStatus
            }

            showMentorModal.value = false
            console.log(`Mentor ${mentorId} status updated to ${newStatus}`)
        } catch (e: any) {
            error.value = e.data?.message || 'Failed to update mentor status'
            console.error('[useAdminMentors] Error updating status:', e)
        }
    }

    const toggleMentorStatus = async (mentor: AdminMentor) => {
        const newStatus = mentor.status === 'verified' ? 'suspended' : 'verified'
        await updateMentorStatus(mentor.id, newStatus)
    }

    // Computed properties
    const verifiedMentors = computed(() => mentors.value.filter(m => m.status === 'verified').length)
    const pendingMentors = computed(() => mentors.value.filter(m => m.status === 'pending').length)

    const categoryOptions = computed(() => [
        { label: 'All Categories', value: 'all' },
        ...categories.value.map(cat => ({
            label: cat.name,
            value: cat.name
        }))
    ])

    // Filter options
    const statusOptions = [
        { label: 'All Statuses', value: 'all' },
        { label: 'Verified', value: 'verified' },
        { label: 'Pending Review', value: 'pending' },
        { label: 'Suspended', value: 'suspended' }
    ]

    const ratingOptions = [
        { label: 'All Ratings', value: 'all' },
        { label: '4.5+ Stars', value: '4.5' },
        { label: '4.0+ Stars', value: '4.0' },
        { label: '3.5+ Stars', value: '3.5' },
        { label: 'Below 3.5', value: 'below-3.5' }
    ]

    // Watch for filter changes and refetch (with debounce for search)
    let searchTimeout: ReturnType<typeof setTimeout> | null = null

    watch(searchQuery, () => {
        if (searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            currentPage.value = 1
            fetchMentors(1)
        }, 300)
    })

    watch([selectedStatus, selectedCategory, selectedRating], () => {
        currentPage.value = 1
        fetchMentors(1)
    })

    // Navigation methods
    const previousPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--
            fetchMentors(currentPage.value)
        }
    }

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++
            fetchMentors(currentPage.value)
        }
    }

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
            fetchMentors(page)
        }
    }

    return {
        // Data
        mentors: readonly(mentors),
        categories: readonly(categories),
        // State
        isLoading: readonly(isLoading),
        error: readonly(error),
        // Filters
        searchQuery,
        selectedStatus,
        selectedCategory,
        selectedRating,
        // Options
        statusOptions,
        categoryOptions,
        ratingOptions,
        // Pagination
        currentPage: readonly(currentPage),
        totalPages: readonly(totalPages),
        totalMentors: readonly(totalMentors),
        pageSize,
        // Modal
        showMentorModal,
        selectedMentor,
        // Computed
        verifiedMentors,
        pendingMentors,
        // Methods
        fetchMentors,
        viewMentorDetails,
        updateMentorStatus,
        toggleMentorStatus,
        previousPage,
        nextPage,
        goToPage,
    }
}
