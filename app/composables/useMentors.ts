import type { MentorProfile } from '~/types'

export const useMentors = () => {
  const mentors = ref<MentorProfile[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')
  const selectedCategories = ref<string[]>([])
  const selectedSkills = ref<string[]>([])

  // Mock data - replace with API calls later
  const mockMentors: MentorProfile[] = [
    {
      id: '1',
      email: 'sarah.chen@example.com',
      firstName: 'Sarah',
      lastName: 'Chen',
      role: 'mentor',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      bio: 'Senior Software Engineer with 8+ years of experience in full-stack development. Passionate about mentoring junior developers and helping them grow their careers.',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      categories: ['Software Development', 'Career Growth', 'Technical Leadership'],
      hourlyRate: 75,
      experience: '8+ years',
      availability: [],
      rating: 4.9,
      totalSessions: 127,
      languages: ['English', 'Mandarin'],
      timezone: 'PST',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      email: 'marcus.johnson@example.com',
      firstName: 'Marcus',
      lastName: 'Johnson',
      role: 'mentor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Product Manager at a Fortune 500 company. I help aspiring PMs understand the role and develop essential skills for product management success.',
      skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'Stakeholder Management'],
      categories: ['Product Management', 'Strategy', 'Leadership'],
      hourlyRate: 90,
      experience: '10+ years',
      availability: [],
      rating: 4.8,
      totalSessions: 89,
      languages: ['English', 'Spanish'],
      timezone: 'EST',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      email: 'elena.rodriguez@example.com',
      firstName: 'Elena',
      lastName: 'Rodriguez',
      role: 'mentor',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      bio: 'UX Designer with expertise in design systems and user research. I love helping designers create impactful user experiences.',
      skills: ['UI/UX Design', 'Figma', 'User Research', 'Design Systems', 'Prototyping'],
      categories: ['Design', 'User Experience', 'Creative'],
      hourlyRate: 65,
      experience: '6+ years',
      availability: [],
      rating: 4.9,
      totalSessions: 156,
      languages: ['English', 'Spanish', 'Portuguese'],
      timezone: 'PST',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const fetchMentors = async () => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      mentors.value = mockMentors
    } catch (error) {
      console.error('Error fetching mentors:', error)
    } finally {
      isLoading.value = false
    }
  }

  const filteredMentors = computed(() => {
    let filtered = mentors.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(mentor => 
        mentor.firstName.toLowerCase().includes(query) ||
        mentor.lastName.toLowerCase().includes(query) ||
        mentor.bio.toLowerCase().includes(query) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(query))
      )
    }

    if (selectedCategories.value.length > 0) {
      filtered = filtered.filter(mentor =>
        mentor.categories.some(category => selectedCategories.value.includes(category))
      )
    }

    if (selectedSkills.value.length > 0) {
      filtered = filtered.filter(mentor =>
        mentor.skills.some(skill => selectedSkills.value.includes(skill))
      )
    }

    return filtered
  })

  const getMentorProfile = (id: string) => {
    return mentors.value.find(mentor => mentor.id === id)
  }

  const updateMentorProfile = async (id: string, updatedFields: Partial<MentorProfile>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mentors.value.findIndex(mentor => mentor.id === id)
    if (index !== -1) {
      mentors.value[index] = { ...mentors.value[index], ...updatedFields }
    }
  }

  const getAllCategories = computed(() => {
    const categories = new Set<string>()
    mentors.value.forEach(mentor => {
      mentor.categories.forEach(category => categories.add(category))
    })
    return Array.from(categories).sort()
  })

  const getAllSkills = computed(() => {
    const skills = new Set<string>()
    mentors.value.forEach(mentor => {
      mentor.skills.forEach(skill => skills.add(skill))
    })
    return Array.from(skills).sort()
  })

  return {
    mentors: readonly(mentors),
    isLoading: readonly(isLoading),
    searchQuery,
    selectedCategories,
    selectedSkills,
    filteredMentors,
    fetchMentors,
    getMentorProfile,
    updateMentorProfile,
    getAllCategories,
    getAllSkills
  }
}
