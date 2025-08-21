import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purposeProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/lib/utils/auth-helper"
import { purposeSchema } from "@/lib/validation"

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized", ok: false },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate request body
    const result = purposeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", details: result.error.format(), ok: false },
        { status: 400 }
      )
    }

    const { domain, archetype, modality, narrative } = result.data

    // Check if purpose profile exists
    const [existingProfile] = await db
      .select()
      .from(purposeProfiles)
      .where(eq(purposeProfiles.userId, currentUser.id))
      .limit(1)

    if (existingProfile) {
      // Update existing purpose profile
      await db
        .update(purposeProfiles)
        .set({
          domain,
          archetype,
          modality,
          narrative,
        })
        .where(eq(purposeProfiles.userId, currentUser.id))
    } else {
      // Create new purpose profile
      await db.insert(purposeProfiles).values({
        userId: currentUser.id,
        domain,
        archetype,
        modality,
        narrative,
      })
    }

    return NextResponse.json({
      message: "Purpose profile updated successfully",
      ok: true
    })
  } catch (error) {
    console.error("Purpose profile update error:", error)
    return NextResponse.json(
      { message: "Failed to update purpose profile", ok: false },
      { status: 500 }
    )
  }
} 