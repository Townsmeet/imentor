import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './drizzle'
import * as schema from '../db/schema'
import { sendEmail } from './email'
import { createEmailVerificationEmail, createPasswordResetEmail } from '../email-templates'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'mentee',
      },
      hasCompletedOnboarding: {
        type: 'boolean',
        defaultValue: false,
      },
      onboardingStep: {
        type: 'string',
        defaultValue: 'verification',
      },
      onboardingCompletedAt: {
        type: 'date',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        console.log('[Auth] Sending password reset email to:', user.email)
        const { subject, htmlContent } = createPasswordResetEmail(url, user.name ?? undefined)
        await sendEmail({ to: user.email, subject, htmlContent })
        console.log('[Auth] Password reset email sent successfully to:', user.email)
      } catch (error: any) {
        console.error('[Auth] Failed to send password reset email:', {
          email: user.email,
          error: error.message,
        })
        throw error
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        console.log('[Auth] Sending verification email to:', user.email)
        const { subject, htmlContent } = createEmailVerificationEmail(url, user.name ?? undefined)
        await sendEmail({ to: user.email, subject, htmlContent })
        console.log('[Auth] Verification email sent successfully to:', user.email)
      } catch (error: any) {
        console.error('[Auth] Failed to send verification email:', {
          email: user.email,
          error: error.message,
        })
        throw error
      }
    },
  },
  baseURL: process.env.NUXT_BETTER_AUTH_URL,
  secret: process.env.NUXT_BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 7, // Update session every 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
})
