export type UserRole = 'mentor' | 'mentee' | 'admin'
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface MentorProfile extends User {
  role: 'mentor'
  bio: string
  skills: string[]
  categories: string[]
  hourlyRate: number
  experience: string
  availability: TimeSlot[]
  rating: number
  totalSessions: number
  languages: string[]
  timezone: string
}

export interface MenteeProfile extends User {
  role: 'mentee'
  bio?: string
  interests: string[]
  goals: string[]
  experience: string
}

export interface TimeSlot {
  id: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  isAvailable: boolean
}

export interface Session {
  id: string
  mentorId: string
  menteeId: string
  title: string
  description: string
  scheduledAt: Date
  duration: number // minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  meetingLink?: string
  notes?: string
  createdAt: Date
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
  sessionId?: string
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  hasCompletedOnboarding: boolean
}

export interface BookingRequest {
  mentorId: string
  date: string
  time: string
  duration: number
  title: string
  description?: string
  menteeId?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
  price?: number
  paymentIntentId?: string
}

export interface Booking {
  id: string
  mentorId: string
  menteeId: string
  title: string
  description: string
  scheduledDate: Date
  duration: number // minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'
  price: number
  meetingLink?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  mentor?: MentorProfile
  mentee?: MenteeProfile
  paymentIntentId?: string
  paymentStatus?: 'pending' | 'succeeded' | 'failed' | 'refunded'
}

export interface AvailabilitySlot {
  id: string
  mentorId: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
  isAvailable: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: 'booking' | 'availability' | 'blocked'
  status?: string
  mentorId?: string
  menteeId?: string
}
