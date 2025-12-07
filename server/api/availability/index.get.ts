import { eq } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { availabilitySlot } from '../../db/schema'
import { auth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Get mentor ID from query or use current user
  const query = getQuery(event)
  const mentorId = (query.mentorId as string) || session.user.id

  try {
    const slots = await db
      .select()
      .from(availabilitySlot)
      .where(eq(availabilitySlot.mentorId, mentorId))
      .orderBy(availabilitySlot.dayOfWeek, availabilitySlot.startTime)

    return {
      slots: slots.map(slot => ({
        id: slot.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable,
      })),
    }
  } catch (error: any) {
    console.error('[Availability API] Error fetching slots:', error)
    throw createError({ statusCode: 500, message: 'Failed to fetch availability' })
  }
})
