import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, purposeProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/lib/utils/auth-helper"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      const cookieStore = await cookies()
      const token = cookieStore.get('token')?.value
      console.log('Token from cookies:', token)
      
      return NextResponse.json(
        { message: "Unauthorized", ok: false },
        { status: 401 }
      )
    }

    // Get user profile with purpose profile
    const [user] = await db
      .select({
        user: users,
        purpose: purposeProfiles,
      })
      .from(users)
      .leftJoin(purposeProfiles, eq(users.id, purposeProfiles.userId))
      .where(eq(users.id, currentUser.id))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { message: "User not found", ok: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.user.id,
        name: user.user.name,
        email: user.user.email,
        gender: user.user.gender,
        dob: user.user.dob,
        phone: user.user.phone,
        avatar: user.user.avatar,
        religion: user.user.religion,
        education: user.user.education,
        profession: user.user.profession,
        personality: user.user.personality,
        country: user.user.country,
        state: user.user.state,
        city: user.user.city,
        maritalStatus: user.user.maritalStatus,
        lookingFor: user.user.lookingFor,
        height: user.user.height,
        weight: user.user.weight,
        language: user.user.language,
        countryCode: user.user.countryCode,
        stateCode: user.user.stateCode,
        interests: user.user.interests,
        alcohol: user.user.alcohol,
        drugs: user.user.drugs,
        smoking: user.user.smoking,
        politics: user.user.politics,
        // Include purpose profile data
        domain: user.purpose?.domain,
        archetype: user.purpose?.archetype,
        modality: user.purpose?.modality,
        narrative: user.purpose?.narrative,
      }
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch profile", ok: false },
      { status: 500 }
    )
  }
} 