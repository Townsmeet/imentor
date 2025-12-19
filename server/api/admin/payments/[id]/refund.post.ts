import { eq } from 'drizzle-orm'
import { db } from '../../../../utils/drizzle'
import { booking } from '../../../../db/schema'
import { auth } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers })

    if (!session?.user) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    if (session.user.role !== 'admin') {
        throw createError({ statusCode: 403, message: 'Admin access required' })
    }

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, message: 'Payment ID is required' })
    }

    try {
        // Check if booking exists and is in a refundable state
        const existingBooking = await db.query.booking.findFirst({
            where: eq(booking.id, id)
        })

        if (!existingBooking) {
            throw createError({ statusCode: 404, message: 'Payment not found' })
        }

        if (existingBooking.paymentStatus !== 'succeeded') {
            throw createError({ statusCode: 400, message: 'Only successful payments can be refunded' })
        }

        // Update payment status to refunded
        await db.update(booking)
            .set({
                paymentStatus: 'refunded',
                status: 'cancelled', // Also cancel the session if it was refunded
                cancelledAt: new Date()
            })
            .where(eq(booking.id, id))

        return {
            success: true,
            message: 'Payment refunded successfully'
        }
    } catch (error: any) {
        console.error('[Admin Refund API] Error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to process refund',
        })
    }
})
