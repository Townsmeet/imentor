import { google } from 'googleapis'

// Google Calendar API for creating Meet links
// Requires: NUXT_GOOGLE_CLIENT_EMAIL and NUXT_GOOGLE_PRIVATE_KEY environment variables

const GOOGLE_CLIENT_EMAIL = process.env.NUXT_GOOGLE_CLIENT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.NUXT_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
const GOOGLE_CALENDAR_ID = process.env.NUXT_GOOGLE_CALENDAR_ID || 'primary'

let calendarClient: ReturnType<typeof google.calendar> | null = null

/**
 * Initialize Google Calendar API client with service account credentials
 */
function getCalendarClient() {
    if (calendarClient) return calendarClient

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        console.warn('[Google Meet] Missing NUXT_GOOGLE_CLIENT_EMAIL or NUXT_GOOGLE_PRIVATE_KEY')
        return null
    }

    try {
        const auth = new google.auth.JWT({
            email: GOOGLE_CLIENT_EMAIL,
            key: GOOGLE_PRIVATE_KEY,
            scopes: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events',
            ],
        })

        calendarClient = google.calendar({ version: 'v3', auth })
        return calendarClient
    } catch (error) {
        console.error('[Google Meet] Failed to initialize calendar client:', error)
        return null
    }
}

export interface MeetingDetails {
    meetingLink: string
    calendarEventId?: string
    startTime: Date
    endTime: Date
    title: string
}

/**
 * Create a Google Meet link via Google Calendar API
 */
export async function createGoogleMeetLink(params: {
    title: string
    description?: string
    startTime: Date
    durationMinutes: number
    mentorEmail?: string
    menteeEmail?: string
}): Promise<MeetingDetails | null> {
    const calendar = getCalendarClient()

    if (!calendar) {
        console.warn('[Google Meet] Calendar client not available, using fallback')
        return null
    }

    const endTime = new Date(params.startTime.getTime() + params.durationMinutes * 60 * 1000)

    try {
        const event = await calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            conferenceDataVersion: 1,
            requestBody: {
                summary: params.title,
                description: params.description || `iMentor Session: ${params.title}`,
                start: {
                    dateTime: params.startTime.toISOString(),
                    timeZone: 'UTC',
                },
                end: {
                    dateTime: endTime.toISOString(),
                    timeZone: 'UTC',
                },
                attendees: [
                    ...(params.mentorEmail ? [{ email: params.mentorEmail }] : []),
                    ...(params.menteeEmail ? [{ email: params.menteeEmail }] : []),
                ],
                conferenceData: {
                    createRequest: {
                        requestId: `imentor-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
                        conferenceSolutionKey: {
                            type: 'hangoutsMeet',
                        },
                    },
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 60 },
                        { method: 'popup', minutes: 15 },
                    ],
                },
            },
        })

        const meetLink = event.data.hangoutLink || event.data.conferenceData?.entryPoints?.[0]?.uri

        if (!meetLink) {
            console.error('[Google Meet] No meeting link in response')
            return null
        }

        return {
            meetingLink: meetLink,
            calendarEventId: event.data.id || undefined,
            startTime: params.startTime,
            endTime,
            title: params.title,
        }
    } catch (error: any) {
        console.error('[Google Meet] Failed to create meeting:', error.message)
        return null
    }
}

/**
 * Generate a fallback meeting link (Jitsi Meet) when Google API is not available
 */
function generateFallbackMeetingLink(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    const segments = []

    for (let i = 0; i < 3; i++) {
        let segment = ''
        const length = i === 1 ? 4 : 3
        for (let j = 0; j < length; j++) {
            segment += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        segments.push(segment)
    }

    const code = segments.join('-')

    // Use Jitsi Meet as fallback (free, no API needed)
    return `https://meet.jit.si/imentor-${code}`
}

/**
 * Generate a meeting link - tries Google Meet first, falls back to Jitsi
 */
export async function generateMeetingLink(params?: {
    title?: string
    description?: string
    startTime?: Date
    durationMinutes?: number
    mentorEmail?: string
    menteeEmail?: string
}): Promise<string> {
    // If params provided, try Google Meet first
    if (params?.startTime && params?.title) {
        const googleMeet = await createGoogleMeetLink({
            title: params.title,
            description: params.description,
            startTime: params.startTime,
            durationMinutes: params.durationMinutes || 60,
            mentorEmail: params.mentorEmail,
            menteeEmail: params.menteeEmail,
        })

        if (googleMeet) {
            return googleMeet.meetingLink
        }
    }

    // Fallback to Jitsi Meet
    return generateFallbackMeetingLink()
}

/**
 * Format booking date for display
 */
export function formatBookingDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(date)
}
