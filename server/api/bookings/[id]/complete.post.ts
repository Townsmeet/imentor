import { eq } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { booking, mentorProfile } from '../../../db/schema'
import { auth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers })

    if (!session?.user) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const bookingId = getRouterParam(event, 'id')

    if (!bookingId) {
        throw createError({ statusCode: 400, message: 'Booking ID is required' })
    }

    try {
        // Get the booking
        const existingBooking = await db.query.booking.findFirst({
            where: eq(booking.id, bookingId)
        })

        if (!existingBooking) {
            throw createError({ statusCode: 404, message: 'Booking not found' })
        }

        // Only the mentor can mark a session as complete
        if (existingBooking.mentorId !== session.user.id) {
            throw createError({
                statusCode: 403,
                message: 'Only the mentor can mark a session as complete'
            })
        }

        // Must be confirmed to complete
        if (existingBooking.status !== 'confirmed') {
            throw createError({
                statusCode: 400,
                message: 'Can only complete confirmed bookings'
            })
        }

        // Update booking to completed
        const [updatedBooking] = await db
            .update(booking)
            .set({
                status: 'completed',
                completedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(booking.id, bookingId))
            .returning()

        // Increment mentor's total sessions
        await db
            .update(mentorProfile)
            .set({
                totalSessions: db.sql`${mentorProfile.totalSessions} + 1`,
                updatedAt: new Date(),
            })
            .where(eq(mentorProfile.userId, existingBooking.mentorId))

        return {
            success: true,
            booking: {
                id: updatedBooking.id,
                status: updatedBooking.status,
                completedAt: updatedBooking.completedAt,
            }
        }
    } catch (error: any) {
        if (error.statusCode) throw error

        console.error('[Bookings API] Error completing booking:', error)
        throw createError({ statusCode: 500, message: 'Failed to complete booking' })
    }
})
