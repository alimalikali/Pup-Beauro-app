import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { calculateMatches } from "@/lib/matching-algorithm"
import { verify } from "jsonwebtoken"
import { ENV } from "@/lib/constants"

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.TOKEN_NAME)

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify token and get user ID
    const decoded = verify(token.value, ENV.JWT_SECRET) as { id: string }
    const [user] = await db.select().from(users).where(eq(users.id, decoded.id))

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Calculate matches for the user
    const matches = await calculateMatches(user.id)
    return NextResponse.json(matches)
  } catch (error) {
    console.error("Error in matches API:", error)
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.TOKEN_NAME)

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify token and get user ID
    const decoded = verify(token.value, ENV.JWT_SECRET) as { id: string }
    const [user] = await db.select().from(users).where(eq(users.id, decoded.id))

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Get request body
    const body = await request.json()
    const { limit = 10 } = body

    // Calculate new matches
    const matches = await calculateMatches(user.id)
    const limitedMatches = matches.slice(0, limit)

    return NextResponse.json({
      success: true,
      matches: limitedMatches,
    })
  } catch (error) {
    console.error("Error in matches API:", error)
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
