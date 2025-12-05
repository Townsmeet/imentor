import type { TimeSlot } from '~/types'

interface ApiSlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export const useAvailability = () => {
  const slots = ref<TimeSlot[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const transformSlot = (slot: ApiSlot): TimeSlot => ({
    id: slot.id,
    dayOfWeek: slot.dayOfWeek,
    startTime: slot.startTime,
    endTime: slot.endTime,
    isAvailable: slot.isAvailable,
  })

  const fetchAvailability = async (mentorId?: string) => {
    isLoading.value = true
    error.value = null

    try {
      const params = mentorId ? `?mentorId=${mentorId}` : ''
      const response = await $fetch<{ slots: ApiSlot[] }>(`/api/availability${params}`)
      slots.value = response.slots.map(transformSlot)
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to fetch availability'
      console.error('[useAvailability] Error:', e)
    } finally {
      isLoading.value = false
    }
  }

  const addSlot = async (slot: Omit<TimeSlot, 'id'>) => {
    try {
      const response = await $fetch<{ slot: ApiSlot }>('/api/availability', {
        method: 'POST',
        body: {
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable,
        },
      })
      slots.value.push(transformSlot(response.slot))
      return { success: true, slot: response.slot }
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to add slot'
      return { success: false, error: error.value }
    }
  }

  const removeSlot = async (slotId: string) => {
    try {
      await $fetch(`/api/availability/${slotId}`, { method: 'DELETE' })
      slots.value = slots.value.filter(s => s.id !== slotId)
      return { success: true }
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to remove slot'
      return { success: false, error: error.value }
    }
  }

  const bulkSetSlots = async (newSlots: Omit<TimeSlot, 'id'>[], replaceAll = false) => {
    isLoading.value = true
    try {
      const response = await $fetch<{ slots: ApiSlot[] }>('/api/availability/bulk', {
        method: 'POST',
        body: {
          slots: newSlots.map(s => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            isAvailable: s.isAvailable,
          })),
          replaceAll,
        },
      })
      
      if (replaceAll) {
        slots.value = response.slots.map(transformSlot)
      } else {
        slots.value.push(...response.slots.map(transformSlot))
      }
      
      return { success: true }
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to set availability'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const clearAllSlots = async () => {
    isLoading.value = true
    try {
      await $fetch('/api/availability/clear', { method: 'DELETE' })
      slots.value = []
      return { success: true }
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to clear availability'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Computed helpers
  const groupedByDay = computed(() => {
    return slots.value.reduce((acc, slot) => {
      const day = slot.dayOfWeek.toString()
      if (!acc[day]) acc[day] = []
      acc[day].push(slot)
      return acc
    }, {} as Record<string, TimeSlot[]>)
  })

  const totalHours = computed(() => {
    return slots.value.reduce((total, slot) => {
      const [startH, startM] = slot.startTime.split(':').map(Number)
      const [endH, endM] = slot.endTime.split(':').map(Number)
      const hours = (endH + endM / 60) - (startH + startM / 60)
      return total + hours
    }, 0)
  })

  const activeDays = computed(() => {
    return new Set(slots.value.map(s => s.dayOfWeek)).size
  })

  return {
    slots: readonly(slots),
    isLoading: readonly(isLoading),
    error: readonly(error),
    groupedByDay,
    totalHours,
    activeDays,
    fetchAvailability,
    addSlot,
    removeSlot,
    bulkSetSlots,
    clearAllSlots,
  }
}
