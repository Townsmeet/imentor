import Stripe from 'stripe'

// Initialize Stripe with secret key from environment
const stripeSecretKey = process.env.NUXT_STRIPE_SECRET_KEY

if (!stripeSecretKey) {
    console.warn('[Stripe] NUXT_STRIPE_SECRET_KEY not set - payments will fail')
}

export const stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey, { apiVersion: '2024-11-20.acacia' })
    : null

/**
 * Create a PaymentIntent for a booking
 */
export async function createPaymentIntent(params: {
    amount: number // in cents
    mentorId: string
    menteeId: string
    bookingId: string
    duration: number
}): Promise<Stripe.PaymentIntent | null> {
    if (!stripe) {
        console.error('[Stripe] Stripe not initialized')
        return null
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: params.amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                mentorId: params.mentorId,
                menteeId: params.menteeId,
                bookingId: params.bookingId,
                duration: params.duration.toString(),
            },
        })

        return paymentIntent
    } catch (error) {
        console.error('[Stripe] Failed to create PaymentIntent:', error)
        throw error
    }
}

/**
 * Retrieve a PaymentIntent by ID
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
    if (!stripe) return null

    try {
        return await stripe.paymentIntents.retrieve(paymentIntentId)
    } catch (error) {
        console.error('[Stripe] Failed to retrieve PaymentIntent:', error)
        return null
    }
}

/**
 * Check if a PaymentIntent is successful
 */
export function isPaymentSuccessful(paymentIntent: Stripe.PaymentIntent): boolean {
    return paymentIntent.status === 'succeeded'
}
