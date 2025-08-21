import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { purposeSchema } from "@/lib/validation"
import { getCurrentUser } from "@/lib/utils/auth-helper"
import { purposeProfiles } from "@/lib/db/schema"

// POST /purpose - Set/update purpose
export async function POST(req: NextRequest) {
    try {
      // Get authenticated user
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const userId = currentUser.id
      const body = await req.json()

      // Validate request body
      const result = purposeSchema.safeParse(body)
      if (!result.success) {
        return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 })
      }

      const { domain, archetype, modality, narrative } = result.data

      // Check if purpose profile exists
      const [existingPurpose] = await db
        .select()
        .from(purposeProfiles)
        .where(eq(purposeProfiles.userId, userId))
        .limit(1)

      let purposeProfile

      if (existingPurpose) {
        // Update existing purpose profile
        const [updatedProfile] = await db
          .update(purposeProfiles)
          .set({ domain, archetype, modality, narrative })
          .where(eq(purposeProfiles.userId, userId))
          .returning()
        purposeProfile = updatedProfile
      } else {
        // Create new purpose profile
        const [newProfile] = await db
          .insert(purposeProfiles)
          .values({
            userId,
            domain,
            archetype,
            modality,
            narrative,
          })
          .returning()
        purposeProfile = newProfile
      }

      return NextResponse.json({
        message: "Purpose profile updated successfully",
        purposeProfile,
      })
    } catch (error) {
      console.error("Update purpose error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
