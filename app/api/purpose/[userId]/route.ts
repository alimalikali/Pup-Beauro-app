import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { users } from "@/lib/db/schema"
import { purposeProfiles } from "@/lib/db/schema"

// GET /purpose/:userId - Get another user's purpose
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
      const { userId } = params

      // Check if user exists
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Get purpose profile
      const [purposeProfile] = await db
        .select()
        .from(purposeProfiles)
        .where(eq(purposeProfiles.userId, userId))
        .limit(1)

      if (!purposeProfile) {
        return NextResponse.json({ error: "Purpose profile not found for this user" }, { status: 404 })
      }

      return NextResponse.json(purposeProfile)
    } catch (error) {
      console.error("Get purpose error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  
}
