import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, and, ne } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.TOKEN_NAME || 'token')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET || 'pup')) as { payload: { id: string } }
    const userId = decoded.payload.id

    // Get user's purpose profile
    const userProfile = await db
      .select()
      .from(schema.purposeProfiles)
      .where(eq(schema.purposeProfiles.userId, userId))
      .limit(1)

    if (!userProfile.length) {
      return NextResponse.json({ error: 'Purpose profile not found' }, { status: 404 })
    }

    const profile = userProfile[0]

    // Get potential matches based on domain
    const matches = await db
      .select()
      .from(schema.purposeProfiles)
      .where(
        and(
          eq(schema.purposeProfiles.domain, profile.domain),
          ne(schema.purposeProfiles.userId, userId)
        )
      )

    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.TOKEN_NAME || 'token')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET || 'pup')) as { payload: { id: string } }
    const userId = decoded.payload.id

    const { targetUserId, action } = await request.json()

    if (!targetUserId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if match already exists
    const existingMatch = await db
      .select()
      .from(schema.matches)
      .where(
        and(
          eq(schema.matches.userAId, userId),
          eq(schema.matches.userBId, targetUserId)
        )
      )
      .limit(1)

    if (existingMatch.length > 0) {
      return NextResponse.json({ error: 'Match already exists' }, { status: 409 })
    }

    // Create new match
    const [newMatch] = await db
      .insert(schema.matches)
      .values({
        userAId: userId,
        userBId: targetUserId,
        compatibilityScore: 0.8, // Default score
        domainScore: 0.8,
        archetypeScore: 0.7,
        modalityScore: 0.8,
        matchNarrative: 'Match created through user action',
        status: action === 'like' ? 'LIKED' : 'REJECTED',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json({ match: newMatch }, { status: 201 })
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
