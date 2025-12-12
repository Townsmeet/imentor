import { pgTable, text, timestamp, boolean, integer, decimal, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const userRoleEnum = pgEnum('user_role', ['mentor', 'mentee', 'admin'])
export const onboardingStepEnum = pgEnum('onboarding_step', ['verification', 'profile', 'role_setup', 'preferences', 'complete'])

// ==================== Better Auth Tables ====================

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  // iMentor specific fields
  role: userRoleEnum('role').notNull().default('mentee'),
  hasCompletedOnboarding: boolean('has_completed_onboarding').notNull().default(false),
  onboardingStep: onboardingStepEnum('onboarding_step').notNull().default('verification'),
  onboardingCompletedAt: timestamp('onboarding_completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


// ==================== iMentor Profile Tables ====================

export const mentorProfile = pgTable('mentor_profile', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  location: text('location'),
  experience: text('experience'), // '0-2 years', '3-5 years', etc.
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
  skills: text('skills'), // JSON array as text
  categories: text('categories'), // JSON array as text
  languages: text('languages'), // JSON array as text
  timezone: text('timezone'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  totalSessions: integer('total_sessions').default(0),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const menteeProfile = pgTable('mentee_profile', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  location: text('location'),
  experience: text('experience'), // '0-2 years', '3-5 years', etc.
  interests: text('interests'), // JSON array as text
  goals: text('goals'), // JSON array as text
  languages: text('languages'), // JSON array as text
  timezone: text('timezone'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const userPreferences = pgTable('user_preferences', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  emailNotifications: boolean('email_notifications').default(true),
  weeklyDigest: boolean('weekly_digest').default(true),
  marketingEmails: boolean('marketing_emails').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ==================== Waitlist (existing) ====================

export const waitlist = pgTable('waitlist', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})


// ==================== Availability Tables ====================

export const availabilitySlot = pgTable('availability_slot', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  mentorId: text('mentor_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0-6 (Sunday-Saturday)
  startTime: text('start_time').notNull(), // HH:MM format
  endTime: text('end_time').notNull(), // HH:MM format
  isAvailable: boolean('is_available').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


// ==================== Booking Tables ====================

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',      // Payment pending
  'confirmed',    // Payment successful, session scheduled
  'completed',    // Session completed
  'cancelled'     // Cancelled before confirmation (no refund after confirmation)
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'succeeded',
  'failed',
  'refunded'
])

export const booking = pgTable('booking', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  mentorId: text('mentor_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  menteeId: text('mentee_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  scheduledDate: timestamp('scheduled_date').notNull(),
  duration: integer('duration').notNull(), // minutes
  status: bookingStatusEnum('status').notNull().default('pending'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  meetingLink: text('meeting_link'), // Auto-generated on confirmation
  notes: text('notes'),
  // Payment tracking
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  confirmedAt: timestamp('confirmed_at'),
  completedAt: timestamp('completed_at'),
  cancelledAt: timestamp('cancelled_at'),
})

// ==================== Review Tables ====================

export const review = pgTable('review', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingId: text('booking_id')
    .notNull()
    .unique()
    .references(() => booking.id, { onDelete: 'cascade' }),
  mentorId: text('mentor_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  menteeId: text('mentee_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


// ==================== Content Management Tables ====================

export const category = pgTable('category', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull().default('heroicons:folder'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const skill = pgTable('skill', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  categoryId: text('category_id').references(() => category.id, { onDelete: 'cascade' }),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


// ==================== Chat Tables ====================

export const conversation = pgTable('conversation', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const conversationParticipant = pgTable('conversation_participant', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text('conversation_id')
    .notNull()
    .references(() => conversation.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  lastReadAt: timestamp('last_read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const message = pgTable('message', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text('conversation_id')
    .notNull()
    .references(() => conversation.id, { onDelete: 'cascade' }),
  senderId: text('sender_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isRead: boolean('is_read').notNull().default(false), // Optional, can rely on lastReadAt
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
