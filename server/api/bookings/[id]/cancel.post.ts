import { eq } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { booking } from '../../../db/schema'
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

        const userId = session.user.id

        // Either mentor or mentee can cancel, but only if PENDING
        if (existingBooking.mentorId !== userId && existingBooking.menteeId !== userId) {
            throw createError({
                statusCode: 403,
                message: 'Not authorized to cancel this booking'
            })
        }

        // CRITICAL: No cancellation allowed after confirmation (no refunds)
        if (existingBooking.status === 'confirmed') {
            throw createError({
                statusCode: 400,
                message: 'Cannot cancel a confirmed booking. No refunds are available after confirmation.'
            })
        }

        // Already cancelled
        if (existingBooking.status === 'cancelled') {
            throw createError({ statusCode: 400, message: 'Booking is already cancelled' })
        }

        // Already completed
        if (existingBooking.status === 'completed') {
            throw createError({ statusCode: 400, message: 'Cannot cancel a completed booking' })
        }

        // Cancel the booking
        const [updatedBooking] = await db
            .update(booking)
            .set({
                status: 'cancelled',
                cancelledAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(booking.id, bookingId))
            .returning()

        return {
            success: true,
            booking: {
                id: updatedBooking.id,
                status: updatedBooking.status,
                cancelledAt: updatedBooking.cancelledAt,
            },
            message: 'Booking cancelled successfully. Note: Confirmed bookings cannot be cancelled.'
        }
    } catch (error: any) {
        if (error.statusCode) throw error

        console.error('[Bookings API] Error cancelling booking:', error)
        throw createError({ statusCode: 500, message: 'Failed to cancel booking' })
    }
})
