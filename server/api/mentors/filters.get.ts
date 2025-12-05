import { eq, and } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { user, mentorProfile } from '../../db/schema'

export default defineEventHandler(async () => {
  try {
    // Get all mentor profiles for verified, onboarded mentors
    const mentors = await db
      .select({
        skills: mentorProfile.skills,
        categories: mentorProfile.categories,
        hourlyRate: mentorProfile.hourlyRate,
      })
      .from(user)
      .innerJoin(mentorProfile, eq(user.id, mentorProfile.userId))
      .where(
        and(
          eq(user.role, 'mentor'),
          eq(user.emailVerified, true),
          eq(user.hasCompletedOnboarding, true)
        )
      )

    // Collect unique values
    const categoriesSet = new Set<string>()
    const skillsSet = new Set<string>()
    let minPrice = Infinity
    let maxPrice = 0

    for (const mentor of mentors) {
      // Parse categories
      const categories = parseJsonArray(mentor.categories)
      categories.forEach(c => categoriesSet.add(c))

      // Parse skills
      const skills = parseJsonArray(mentor.skills)
      skills.forEach(s => skillsSet.add(s))

      // Track price range
      if (mentor.hourlyRate) {
        const rate = parseFloat(mentor.hourlyRate)
        if (rate < minPrice) minPrice = rate
        if (rate > maxPrice) maxPrice = rate
      }
    }

    return {
      categories: Array.from(categoriesSet).sort(),
      skills: Array.from(skillsSet).sort(),
      priceRange: {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice,
      },
    }
  } catch (error: any) {
    console.error('[Mentors API] Error fetching filters:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch filters',
    })
  }
})

function parseJsonArray(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
