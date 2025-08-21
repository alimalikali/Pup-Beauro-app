import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/lib/utils/auth-helper"

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

    // Validate required fields
    if (!body.name || !body.email || !body.gender) {
      return NextResponse.json(
        { message: "Name, email, and gender are required", ok: false },
        { status: 400 }
      )
    }

    try {
      // Update user profile
      await db
        .update(users)
        .set({
          name: body.name,
          email: body.email,
          gender: body.gender,
          dob: body.dob || null,
          phone: body.phone || null,
          avatar: body.avatar || null,
          religion: body.religion || null,
          education: body.education || null,
          profession: body.profession || null,
          personality: body.personality || null,
          country: body.country || null,
          state: body.state || null,
          city: body.city || null,
          maritalStatus: body.maritalStatus || null,
          lookingFor: body.lookingFor || null,
          height: body.height || null,
          weight: body.weight || null,
          language: body.language || null,
          countryCode: body.countryCode || null,
          stateCode: body.stateCode || null,
          interests: body.interests || [],
          alcohol: body.alcohol || null,
          drugs: body.drugs || null,
          smoking: body.smoking || null,
          politics: body.politics || [],
          updatedAt: new Date(),
        })
        .where(eq(users.id, currentUser.id))

      return NextResponse.json({
        message: "Profile updated successfully",
        ok: true
      })
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { 
          message: "Database error: " + (dbError.message || "Failed to update profile"),
          ok: false 
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { 
        message: error.message || "Failed to update profile",
        ok: false 
      },
      { status: 500 }
    )
  }
} 