<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Manage Your Availability</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Set your schedule to let mentees book sessions with you</p>
      </div>
      <div class="flex items-center space-x-3">
        <UButton
          v-if="!showBulkMode"
          @click="showBulkMode = true"
          variant="outline"
          icon="heroicons:calendar-days"
        >
          Bulk Edit
        </UButton>
        <UButton
          v-if="showBulkMode"
          @click="showBulkMode = false"
          variant="outline"
          icon="heroicons:x-mark"
        >
          Exit Bulk
        </UButton>
        <UButton
          @click="showQuickSetup = true"
          icon="heroicons:bolt"
          color="primary"
        >
          Quick Setup
        </UButton>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-10">
      <UProgress animation="carousel" />
    </div>

    <div v-else-if="!isMentor" class="text-center py-10">
      <Icon name="heroicons:user-plus" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">You must be a mentor to set availability.</p>
      <UButton to="/onboarding/mentor" size="lg">Become a Mentor</UButton>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Calendar View -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <AvailabilityCalendar
            :availability="mentorAvailability"
            :bulk-mode="showBulkMode"
            @update-availability="updateAvailability"
            @select-date="handleDateSelect"
          />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Weekly Overview -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Icon name="heroicons:calendar-days" class="w-5 h-5 mr-2" />
            Weekly Overview
          </h3>
          
          <div v-if="mentorAvailability.length === 0" class="text-center py-8">
            <Icon name="heroicons:clock" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">No availability set yet</p>
            <UButton @click="showQuickSetup = true" size="sm">Get Started</UButton>
          </div>

          <div v-else class="space-y-3">
            <div v-for="(slots, day) in groupedAvailability" :key="day" class="border-l-4 border-primary-500 pl-4">
              <h4 class="font-medium text-gray-800 dark:text-gray-200 text-sm">{{ getDayName(parseInt(day)) }}</h4>
              <div class="space-y-1">
                <div v-for="slot in slots.slice(0, 2)" :key="slot.id" class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>{{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}</span>
                  <UButton
                    icon="heroicons:trash"
                    color="error"
                    variant="ghost"
                    size="xs"
                    @click="removeSlot(slot.id)"
                  />
                </div>
                <p v-if="slots.length > 2" class="text-xs text-gray-500">+{{ slots.length - 2 }} more</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <UButton
              @click="showQuickAdd = true"
              variant="outline"
              block
              icon="heroicons:plus"
            >
              Add Time Slot
            </UButton>
            <UButton
              @click="copyPreviousWeek"
              variant="outline"
              block
              icon="heroicons:document-duplicate"
              :loading="isCopying"
            >
              Copy Last Week
            </UButton>
            <UButton
              @click="clearAllAvailability"
              variant="outline"
              color="error"
              block
              icon="heroicons:trash"
            >
              Clear All
            </UButton>
          </div>
        </div>

        <!-- Statistics -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Week</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Available Hours</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ totalAvailableHours }}h</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Time Slots</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ mentorAvailability.length }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Active Days</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ activeDays }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Setup Modal -->
    <UModal
      v-model:open="showQuickSetup"
      title="Quick Availability Setup"
      description="Set up your weekly availability with a few quick steps."
    >
      <template #body>
        <QuickAvailabilitySetup
          @setup-complete="handleQuickSetup"
          @close="showQuickSetup = false"
        />
      </template>
    </UModal>

    <!-- Quick Add Modal -->
    <UModal
      v-model:open="showQuickAdd"
      title="Add New Time Slot"
      description="Define a specific time slot for your availability."
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UForm :state="newSlot" :schema="newSlotSchema" @submit="addSlot" class="space-y-4 p-4">
          <UFormField label="Day of Week" name="dayOfWeek">
            <USelect
              v-model="newSlot.dayOfWeek"
              :items="dayOptions"
              option-attribute="label"
              class="w-full"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Start Time" name="startTime">
              <UInput v-model="newSlot.startTime" type="time" class="w-full" />
            </UFormField>

            <UFormField label="End Time" name="endTime">
              <UInput v-model="newSlot.endTime" type="time" class="w-full" />
            </UFormField>
          </div>
        </UForm>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <UButton @click="showQuickAdd = false" variant="ghost">Cancel</UButton>
          <UButton type="submit" :loading="isAddingSlot">Add Slot</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { z } from 'zod'
import type { TimeSlot, MentorProfile } from '~/types'
import AvailabilityCalendar from '~/components/AvailabilityCalendar.vue'
import QuickAvailabilitySetup from '~/components/QuickAvailabilitySetup.vue'

const { user } = useAuth()
const { getMentorProfile, updateMentorProfile } = useMentors()

const isLoading = ref(true)
const isAddingSlot = ref(false)
const isCopying = ref(false)
const mentorProfile = ref<MentorProfile | null>(null)
const showBulkMode = ref(false)
const showQuickSetup = ref(false)
const showQuickAdd = ref(false)

const isMentor = computed(() => user.value?.role === 'mentor')

const mentorAvailability = computed<TimeSlot[]>(() => mentorProfile.value?.availability || [])

const groupedAvailability = computed(() => {
  return mentorAvailability.value.reduce((acc, slot) => {
    const day = slot.dayOfWeek.toString()
    if (!acc[day]) {
      acc[day] = []
    }
    acc[day].push(slot)
    return acc
  }, {} as Record<string, TimeSlot[]>)
})

const totalAvailableHours = computed(() => {
  return mentorAvailability.value.reduce((total, slot) => {
    const start = new Date(`2000-01-01T${slot.startTime}:00`)
    const end = new Date(`2000-01-01T${slot.endTime}:00`)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return total + hours
  }, 0).toFixed(1)
})

const activeDays = computed(() => {
  return new Set(mentorAvailability.value.map(slot => slot.dayOfWeek)).size
})

const dayOptions = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
]

const newSlot = ref<Omit<TimeSlot, 'id' | 'isAvailable'>>({
  dayOfWeek: 0,
  startTime: '09:00',
  endTime: '17:00',
})

const newSlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
}).refine(data => data.startTime < data.endTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
})

const getDayName = (dayOfWeek: number) => {
  return dayOptions.find(day => day.value === dayOfWeek)?.label || 'Unknown'
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours || '0')
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const fetchMentorData = async () => {
  if (user.value?.id) {
    isLoading.value = true
    const mentor = await getMentorProfile(user.value.id)
    mentorProfile.value = (mentor || null) as MentorProfile | null
    isLoading.value = false
  }
}

const addSlot = async () => {
  isAddingSlot.value = true
  try {
    if (!mentorProfile.value) return

    const newId = `slot-${Date.now()}`
    const slotToAdd: TimeSlot = {
      id: newId,
      ...newSlot.value,
      isAvailable: true,
    }

    const updatedAvailability = [...mentorProfile.value.availability, slotToAdd]
    await updateMentorProfile(mentorProfile.value.id, { availability: updatedAvailability })
    mentorProfile.value.availability = updatedAvailability
    
    newSlot.value = { dayOfWeek: 0, startTime: '09:00', endTime: '17:00' }
    showQuickAdd.value = false
  } catch (error) {
    console.error('Error adding slot:', error)
  } finally {
    isAddingSlot.value = false
  }
}

const removeSlot = async (slotId: string) => {
  try {
    if (!mentorProfile.value) return

    const updatedAvailability = mentorProfile.value.availability.filter(slot => slot.id !== slotId)
    await updateMentorProfile(mentorProfile.value.id, { availability: updatedAvailability })
    mentorProfile.value.availability = updatedAvailability
  } catch (error) {
    console.error('Error removing slot:', error)
  }
}

const updateAvailability = async (availability: TimeSlot[]) => {
  try {
    if (!mentorProfile.value) return
    await updateMentorProfile(mentorProfile.value.id, { availability })
    mentorProfile.value.availability = availability
  } catch (error) {
    console.error('Error updating availability:', error)
  }
}

const handleDateSelect = (date: Date) => {
  // Handle date selection for detailed editing
  console.log('Selected date:', date)
}

const handleQuickSetup = (availability: TimeSlot[]) => {
  updateAvailability(availability)
  showQuickSetup.value = false
}

const copyPreviousWeek = async () => {
  isCopying.value = true
  try {
    // Mock implementation - in real app, would copy from previous week
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Copying previous week availability...')
  } catch (error) {
    console.error('Error copying previous week:', error)
  } finally {
    isCopying.value = false
  }
}

const clearAllAvailability = async () => {
  try {
    if (!mentorProfile.value) return
    await updateMentorProfile(mentorProfile.value.id, { availability: [] })
    mentorProfile.value.availability = []
  } catch (error) {
    console.error('Error clearing availability:', error)
  }
}

onMounted(() => {
  fetchMentorData()
})
</script>

<style scoped>
/* Add any specific styles for this page here */
</style>
