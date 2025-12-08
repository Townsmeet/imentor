import { eq, and } from 'drizzle-orm'
import { message, conversation, conversationParticipant } from '~~/server/db/schema'
import { z } from 'zod'

const sendMessageSchema = z.object({
    content: z.string().min(1, 'Message cannot be empty'),
})

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const userId = session.user.id
    const conversationId = getRouterParam(event, 'id')
    const body = await readValidatedBody(event, sendMessageSchema.parse)

    if (!conversationId) {
        throw createError({
            statusCode: 400,
            message: 'Conversation ID is required',
        })
    }

    // Verify user is a participant
    const [participant] = await db
        .select()
        .from(conversationParticipant)
        .where(
            and(
                eq(conversationParticipant.conversationId, conversationId),
                eq(conversationParticipant.userId, userId)
            )
        )
        .limit(1)

    if (!participant) {
        throw createError({
            statusCode: 403,
            message: 'You are not a participant in this conversation',
        })
    }

    // Create message
    const [newMessage] = await db
        .insert(message)
        .values({
            conversationId,
            senderId: userId,
            content: body.content,
        })
        .returning()

    // Update conversation updated_at
    await db
        .update(conversation)
        .set({ updatedAt: new Date() })
        .where(eq(conversation.id, conversationId))

    return newMessage
})
