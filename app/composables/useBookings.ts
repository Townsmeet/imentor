import type { Booking, BookingRequest, AvailabilitySlot, CalendarEvent, MentorProfile, MenteeProfile } from '~/types'

export const useBookings = () => {
  const bookings = ref<Booking[]>([])
  const availabilitySlots = ref<AvailabilitySlot[]>([])
  const isLoading = ref(false)
  const isBooking = ref(false)

  // Mock data - replace with API calls later
  const mockBookings: Booking[] = [
    {
      id: '1',
      mentorId: '1',
      menteeId: 'current-user',
      title: 'Career Growth Strategy',
      description: 'Discussing career transition and growth opportunities',
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      duration: 60,
      status: 'confirmed',
      price: 75,
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      mentorId: '2',
      menteeId: 'current-user',
      title: 'Product Management Fundamentals',
      description: 'Introduction to product management principles',
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      duration: 90,
      status: 'pending',
      price: 135,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const fetchBookings = async (userId?: string) => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      bookings.value = mockBookings
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      isLoading.value = false
    }
  }

  const createBooking = async (bookingRequest: BookingRequest): Promise<Booking> => {
    isBooking.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newBooking: Booking = {
        id: Date.now().toString(),
        mentorId: bookingRequest.mentorId,
        menteeId: bookingRequest.menteeId || 'current-user',
        title: bookingRequest.title,
        description: bookingRequest.description,
        scheduledDate: new Date(`${bookingRequest.date}T${bookingRequest.time}`),
        duration: bookingRequest.duration,
        status: 'pending',
        price: bookingRequest.price || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      bookings.value.push(newBooking)
      return newBooking
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    } finally {
      isBooking.value = false
    }
  }

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const booking = bookings.value.find(b => b.id === bookingId)
      if (booking) {
        booking.status = status
        booking.updatedAt = new Date()
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  const cancelBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, 'cancelled')
  }

  const confirmBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, 'confirmed')
  }

  const rescheduleBooking = async (bookingId: string, newDate: Date) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const booking = bookings.value.find(b => b.id === bookingId)
      if (booking) {
        booking.scheduledDate = newDate
        booking.status = 'rescheduled'
        booking.updatedAt = new Date()
      }
    } catch (error) {
      console.error('Error rescheduling booking:', error)
      throw error
    }
  }

  const getBookingById = (id: string) => {
    return bookings.value.find(booking => booking.id === id)
  }

  const getBookingsByMentor = (mentorId: string) => {
    return bookings.value.filter(booking => booking.mentorId === mentorId)
  }

  const getBookingsByMentee = (menteeId: string) => {
    return bookings.value.filter(booking => booking.menteeId === menteeId)
  }

  const getUpcomingBookings = computed(() => {
    const now = new Date()
    return bookings.value
      .filter(booking => booking.scheduledDate > now && booking.status !== 'cancelled')
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
  })

  const getPastBookings = computed(() => {
    const now = new Date()
    return bookings.value
      .filter(booking => booking.scheduledDate <= now || booking.status === 'completed')
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
  })

  const getPendingBookings = computed(() => {
    return bookings.value.filter(booking => booking.status === 'pending')
  })

  // Availability management
  const fetchAvailability = async (mentorId: string, startDate: Date, endDate: Date) => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Generate mock availability slots
      const slots: AvailabilitySlot[] = []
      const current = new Date(startDate)
      
      while (current <= endDate) {
        // Skip weekends for simplicity
        if (current.getDay() !== 0 && current.getDay() !== 6) {
          const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
          
          timeSlots.forEach(time => {
            slots.push({
              id: `${mentorId}-${current.toISOString().split('T')[0]}-${time}`,
              mentorId,
              date: current.toISOString().split('T')[0],
              startTime: time,
              endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
              isBooked: Math.random() > 0.7, // 30% chance of being booked
              isAvailable: true
            })
          })
        }
        current.setDate(current.getDate() + 1)
      }
      
      availabilitySlots.value = slots
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      isLoading.value = false
    }
  }

  const getAvailableSlots = (mentorId: string, date: string) => {
    return availabilitySlots.value.filter(slot => 
      slot.mentorId === mentorId && 
      slot.date === date && 
      slot.isAvailable && 
      !slot.isBooked
    )
  }

  // Calendar events for display
  const getCalendarEvents = computed((): CalendarEvent[] => {
    return bookings.value.map(booking => ({
      id: booking.id,
      title: booking.title,
      start: booking.scheduledDate,
      end: new Date(booking.scheduledDate.getTime() + booking.duration * 60000),
      type: 'booking' as const,
      status: booking.status,
      mentorId: booking.mentorId,
      menteeId: booking.menteeId
    }))
  })

  const getTotalEarnings = computed(() => {
    return bookings.value
      .filter(booking => booking.status === 'completed')
      .reduce((total, booking) => total + booking.price, 0)
  })

  const getMonthlyEarnings = computed(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return bookings.value
      .filter(booking => {
        const bookingDate = booking.scheduledDate
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear &&
               booking.status === 'completed'
      })
      .reduce((total, booking) => total + booking.price, 0)
  })

  return {
    // State
    bookings: readonly(bookings),
    availabilitySlots: readonly(availabilitySlots),
    isLoading: readonly(isLoading),
    isBooking: readonly(isBooking),
    
    // Actions
    fetchBookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    confirmBooking,
    rescheduleBooking,
    fetchAvailability,
    
    // Getters
    getBookingById,
    getBookingsByMentor,
    getBookingsByMentee,
    getAvailableSlots,
    
    // Computed
    getUpcomingBookings,
    getPastBookings,
    getPendingBookings,
    getCalendarEvents,
    getTotalEarnings,
    getMonthlyEarnings
  }
}
