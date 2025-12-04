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
