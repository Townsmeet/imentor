<template>
  <NuxtLayout name="admin">
    <!-- Content Management Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Categories Tab -->
    <div v-if="activeTab === 'categories'">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Categories</h2>
          <p class="text-gray-600 dark:text-gray-400">Manage mentoring categories</p>
        </div>
        <UButton
          icon="heroicons:plus"
          @click="showCategoryModal = true"
        >
          Add Category
        </UButton>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mentors
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="category in categories" :key="category.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Icon :name="category.icon" class="w-5 h-5 text-gray-400 mr-3" />
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ category.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ category.description }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ category.mentorCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="category.active ? 'success' : 'neutral'"
                  variant="soft"
                >
                  {{ category.active ? 'Active' : 'Inactive' }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdown :items="getCategoryActions(category)">
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
    </div>

    <!-- Skills Tab -->
    <div v-if="activeTab === 'skills'">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Skills</h2>
          <p class="text-gray-600 dark:text-gray-400">Manage available skills</p>
        </div>
        <UButton
          icon="heroicons:plus"
          @click="showSkillModal = true"
        >
          Add Skill
        </UButton>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="mb-4">
          <UInput
            v-model="skillSearchQuery"
            placeholder="Search skills..."
            icon="heroicons:magnifying-glass"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="skill in filteredSkills"
            :key="skill.id"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ skill.name }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ skill.mentorCount }} mentors
              </p>
            </div>
            <UDropdown :items="getSkillActions(skill)">
              <UButton
                variant="ghost"
                icon="heroicons:ellipsis-horizontal"
                size="sm"
              />
            </UDropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Tab -->
    <div v-if="activeTab === 'settings'">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Platform Settings</h2>
        <p class="text-gray-600 dark:text-gray-400">Configure platform-wide settings</p>
      </div>

      <div class="space-y-6">
        <!-- General Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">General Settings</h3>
          <div class="space-y-4">
            <UFormField label="Platform Name">
              <UInput v-model="settings.platformName" />
            </UFormField>
            
            <UFormField label="Support Email">
              <UInput v-model="settings.supportEmail" type="email" />
            </UFormField>
            
            <UFormField label="Platform Commission (%)">
              <UInput v-model="settings.commission" type="number" min="0" max="100" />
            </UFormField>
          </div>
        </div>

        <!-- Session Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Session Settings</h3>
          <div class="space-y-4">
            <UFormField label="Minimum Session Duration (minutes)">
              <UInput v-model="settings.minSessionDuration" type="number" min="15" />
            </UFormField>
            
            <UFormField label="Maximum Session Duration (hours)">
              <UInput v-model="settings.maxSessionDuration" type="number" min="1" />
            </UFormField>
            
            <UFormField label="Cancellation Window (hours)">
              <UInput v-model="settings.cancellationWindow" type="number" min="1" />
            </UFormField>
          </div>
        </div>

        <!-- Payment Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Settings</h3>
          <div class="space-y-4">
            <UFormField label="Stripe Publishable Key">
              <UInput v-model="settings.stripePublishableKey" type="password" />
            </UFormField>
            
            <UFormField label="Payout Schedule">
              <USelect
                v-model="settings.payoutSchedule"
                :options="payoutScheduleOptions"
              />
            </UFormField>
            
            <UFormField label="Minimum Payout Amount">
              <UInput v-model="settings.minPayoutAmount" type="number" min="0" />
            </UFormField>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
          <UButton
            @click="saveSettings"
            :loading="isSaving"
          >
            Save Settings
          </UButton>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <UModal v-model:open="showCategoryModal" title="Add Category">
      <template #body>
        <form @submit.prevent="saveCategory" class="space-y-4">
          <UFormField label="Category Name" required>
            <UInput v-model="newCategory.name" placeholder="e.g. Software Development" />
          </UFormField>
          
          <UFormField label="Description" required>
            <UTextarea v-model="newCategory.description" placeholder="Brief description of this category" />
          </UFormField>
          
          <UFormField label="Icon">
            <UInput v-model="newCategory.icon" placeholder="heroicons:code-bracket" />
          </UFormField>
        </form>
      </template>
      
      <template #footer="{ close }">
        <div class="flex justify-end space-x-3">
          <UButton variant="ghost" @click="close">Cancel</UButton>
          <UButton @click="saveCategory" :loading="isSavingCategory">Save Category</UButton>
        </div>
      </template>
    </UModal>

    <!-- Skill Modal -->
    <UModal v-model:open="showSkillModal" title="Add Skill">
      <template #body>
        <form @submit.prevent="saveSkill" class="space-y-4">
          <UFormField label="Skill Name" required>
            <UInput v-model="newSkill.name" placeholder="e.g. JavaScript" />
          </UFormField>
          
          <UFormField label="Category">
            <USelect
              v-model="newSkill.categoryId"
              :options="categoryOptions"
              placeholder="Select a category"
            />
          </UFormField>
        </form>
      </template>
      
      <template #footer="{ close }">
        <div class="flex justify-end space-x-3">
          <UButton variant="ghost" @click="close">Cancel</UButton>
          <UButton @click="saveSkill" :loading="isSavingSkill">Save Skill</UButton>
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
const activeTab = ref('categories')
const showCategoryModal = ref(false)
const showSkillModal = ref(false)
const skillSearchQuery = ref('')
const isSaving = ref(false)
const isSavingCategory = ref(false)
const isSavingSkill = ref(false)

const newCategory = reactive({
  name: '',
  description: '',
  icon: 'heroicons:folder'
})

const newSkill = reactive({
  name: '',
  categoryId: ''
})

const settings = reactive({
  platformName: 'iMentor',
  supportEmail: 'support@imentor.com',
  commission: 10,
  minSessionDuration: 30,
  maxSessionDuration: 4,
  cancellationWindow: 24,
  stripePublishableKey: '',
  payoutSchedule: 'weekly',
  minPayoutAmount: 50
})

// Tabs
const tabs = [
  { id: 'categories', name: 'Categories' },
  { id: 'skills', name: 'Skills' },
  { id: 'settings', name: 'Settings' }
]

// Mock data
const categories = ref([
  {
    id: '1',
    name: 'Software Development',
    description: 'Programming, web development, mobile apps',
    icon: 'heroicons:code-bracket',
    mentorCount: 45,
    active: true
  },
  {
    id: '2',
    name: 'Career Growth',
    description: 'Professional development, leadership, career transitions',
    icon: 'heroicons:chart-bar-square',
    mentorCount: 32,
    active: true
  },
  {
    id: '3',
    name: 'Product Management',
    description: 'Product strategy, roadmaps, user research',
    icon: 'heroicons:cube',
    mentorCount: 18,
    active: true
  },
  {
    id: '4',
    name: 'Design',
    description: 'UI/UX design, graphic design, design systems',
    icon: 'heroicons:paint-brush',
    mentorCount: 24,
    active: true
  },
  {
    id: '5',
    name: 'Data Science',
    description: 'Analytics, machine learning, data visualization',
    icon: 'heroicons:chart-pie',
    mentorCount: 15,
    active: false
  }
])

const skills = ref([
  { id: '1', name: 'JavaScript', categoryId: '1', mentorCount: 28 },
  { id: '2', name: 'React', categoryId: '1', mentorCount: 24 },
  { id: '3', name: 'Node.js', categoryId: '1', mentorCount: 19 },
  { id: '4', name: 'Python', categoryId: '1', mentorCount: 22 },
  { id: '5', name: 'Leadership', categoryId: '2', mentorCount: 18 },
  { id: '6', name: 'Team Management', categoryId: '2', mentorCount: 15 },
  { id: '7', name: 'Product Strategy', categoryId: '3', mentorCount: 12 },
  { id: '8', name: 'User Research', categoryId: '3', mentorCount: 10 },
  { id: '9', name: 'UI Design', categoryId: '4', mentorCount: 16 },
  { id: '10', name: 'Figma', categoryId: '4', mentorCount: 14 },
  { id: '11', name: 'Machine Learning', categoryId: '5', mentorCount: 8 },
  { id: '12', name: 'Data Analysis', categoryId: '5', mentorCount: 11 }
])

// Options
const payoutScheduleOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
]

// Computed
const filteredSkills = computed(() => {
  if (!skillSearchQuery.value) return skills.value
  
  const query = skillSearchQuery.value.toLowerCase()
  return skills.value.filter(skill =>
    skill.name.toLowerCase().includes(query)
  )
})

const categoryOptions = computed(() => [
  { label: 'Select a category', value: '' },
  ...categories.value.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
])

// Methods
const getCategoryActions = (category: any) => [
  [{
    label: 'Edit',
    icon: 'heroicons:pencil',
    click: () => editCategory(category)
  }],
  [{
    label: category.active ? 'Deactivate' : 'Activate',
    icon: category.active ? 'heroicons:pause' : 'heroicons:play',
    click: () => toggleCategory(category)
  }],
  [{
    label: 'Delete',
    icon: 'heroicons:trash',
    click: () => deleteCategory(category.id)
  }]
]

const getSkillActions = (skill: any) => [
  [{
    label: 'Edit',
    icon: 'heroicons:pencil',
    click: () => editSkill(skill)
  }],
  [{
    label: 'Delete',
    icon: 'heroicons:trash',
    click: () => deleteSkill(skill.id)
  }]
]

const saveCategory = async () => {
  isSavingCategory.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const category = {
      id: String(categories.value.length + 1),
      ...newCategory,
      mentorCount: 0,
      active: true
    }
    
    categories.value.push(category)
    
    // Reset form
    Object.assign(newCategory, {
      name: '',
      description: '',
      icon: 'heroicons:folder'
    })
    
    showCategoryModal.value = false
  } finally {
    isSavingCategory.value = false
  }
}

const saveSkill = async () => {
  isSavingSkill.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const skill = {
      id: String(skills.value.length + 1),
      ...newSkill,
      mentorCount: 0
    }
    
    skills.value.push(skill)
    
    // Reset form
    Object.assign(newSkill, {
      name: '',
      categoryId: ''
    })
    
    showSkillModal.value = false
  } finally {
    isSavingSkill.value = false
  }
}

const editCategory = (category: any) => {
  // Implementation for editing category
  console.log('Edit category:', category)
}

const toggleCategory = (category: any) => {
  category.active = !category.active
}

const deleteCategory = (categoryId: string) => {
  if (confirm('Are you sure you want to delete this category?')) {
    categories.value = categories.value.filter(cat => cat.id !== categoryId)
  }
}

const editSkill = (skill: any) => {
  // Implementation for editing skill
  console.log('Edit skill:', skill)
}

const deleteSkill = (skillId: string) => {
  if (confirm('Are you sure you want to delete this skill?')) {
    skills.value = skills.value.filter(skill => skill.id !== skillId)
  }
}

const saveSettings = async () => {
  isSaving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    // Save settings to backend
    console.log('Settings saved:', settings)
  } finally {
    isSaving.value = false
  }
}

// SEO
useSeoMeta({
  title: 'Content Management - Admin Dashboard',
  description: 'Manage categories, skills, and platform settings'
})
</script>
