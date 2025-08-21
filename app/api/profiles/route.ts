import { db } from "@/lib/db"
import { educationLevelEnum, genderEnum, languageEnum, maritalStatusEnum, personalityTypeEnum, professionFieldEnum, religionEnum } from "@/lib/db/index"
import { getCurrentUser } from "@/lib/utils/auth-helper"
import { and, or, sql, eq, ne } from "drizzle-orm"
import { NextResponse } from "next/server"
import { users, purposeProfiles } from "@/lib/db/schema"

const ITEMS_PER_PAGE = 12

interface FilterParams {
  gender?: typeof genderEnum.enumValues[number]
  minAge?: number
  maxAge?: number
  religion?: typeof religionEnum.enumValues[number]
  education?: typeof educationLevelEnum.enumValues[number]
  profession?: typeof professionFieldEnum.enumValues[number]
  personality?: typeof personalityTypeEnum.enumValues[number]
  country?: string
  state?: string
  city?: string
  maritalStatus?: typeof maritalStatusEnum.enumValues[number]
  lookingFor?: typeof maritalStatusEnum.enumValues[number]
  motherTounge?: typeof languageEnum.enumValues[number]
  interests?: string[]
  purposeDomain?: string
  purposeArchetype?: string
  purposeModality?: string
}

function getFiltersFromUrl(url: URL): FilterParams {
  return {
    gender: url.searchParams.get("gender") as typeof genderEnum.enumValues[number] || undefined,
    minAge: url.searchParams.get("minAge") ? parseInt(url.searchParams.get("minAge")!) : undefined,
    maxAge: url.searchParams.get("maxAge") ? parseInt(url.searchParams.get("maxAge")!) : undefined,
    religion: url.searchParams.get("religion") as typeof religionEnum.enumValues[number] || undefined,
    education: url.searchParams.get("education") as typeof educationLevelEnum.enumValues[number] || undefined,
    profession: url.searchParams.get("profession") as typeof professionFieldEnum.enumValues[number] || undefined,
    personality: url.searchParams.get("personality") as typeof personalityTypeEnum.enumValues[number] || undefined,
    country: url.searchParams.get("country") || undefined,
    state: url.searchParams.get("state") || undefined,
    city: url.searchParams.get("city") || undefined,
    maritalStatus: url.searchParams.get("maritalStatus") as typeof maritalStatusEnum.enumValues[number] || undefined,
    lookingFor: url.searchParams.get("lookingFor") as typeof maritalStatusEnum.enumValues[number] || undefined,
    motherTounge: url.searchParams.get("motherTounge") as typeof languageEnum.enumValues[number] || undefined,
    interests: url.searchParams.get("interests")?.split(",") || undefined,
    purposeDomain: url.searchParams.get("purposeDomain") || undefined,
    purposeArchetype: url.searchParams.get("purposeArchetype") || undefined,
    purposeModality: url.searchParams.get("purposeModality") || undefined,
  }
}

export async function GET(request: Request) {
  try {
    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Build the where conditions for users table
    const userConditions = []
    
    // Handle text search
    const search = searchParams.get("search")
    if (search) {
      userConditions.push(
        or(
          sql`${users.name} ILIKE ${`%${search}%`}`,
          sql`${users.email} ILIKE ${`%${search}%`}`,
          sql`${users.city} ILIKE ${`%${search}%`}`,
          sql`${users.country} ILIKE ${`%${search}%`}`
        )
      )
    }

    // Handle individual parameters for users table
    const gender = searchParams.get("gender")
    if (gender) {
      userConditions.push(eq(users.gender, gender as typeof genderEnum.enumValues[number]))
    }

    const religion = searchParams.get("religion")
    if (religion) {
      userConditions.push(eq(users.religion, religion as typeof religionEnum.enumValues[number]))
    }

    const education = searchParams.get("education")
    if (education) {
      userConditions.push(eq(users.education, education as typeof educationLevelEnum.enumValues[number]))
    }

    const profession = searchParams.get("profession")
    if (profession) {
      userConditions.push(eq(users.profession, profession as typeof professionFieldEnum.enumValues[number]))
    }

    const personality = searchParams.get("personality")
    if (personality) {
      userConditions.push(eq(users.personality, personality as typeof personalityTypeEnum.enumValues[number]))
    }

    const maritalStatus = searchParams.get("maritalStatus")
    if (maritalStatus) {
      userConditions.push(eq(users.maritalStatus, maritalStatus as typeof maritalStatusEnum.enumValues[number]))
    }

    const lookingFor = searchParams.get("lookingFor")
    if (lookingFor) {
      userConditions.push(eq(users.lookingFor, lookingFor as typeof maritalStatusEnum.enumValues[number]))
    }

    const motherTongue = searchParams.get("motherTounge")
    if (motherTongue) {
      userConditions.push(eq(users.language, motherTongue as typeof languageEnum.enumValues[number]))
    }

    const country = searchParams.get("country")
    if (country) {
      userConditions.push(eq(users.country, country))
    }

    const state = searchParams.get("state")
    if (state) {
      userConditions.push(eq(users.state, state))
    }

    const city = searchParams.get("city")
    if (city) {
      userConditions.push(eq(users.city, city))
    }

    const interests = searchParams.getAll("interests")
    if (interests.length > 0) {
      userConditions.push(sql`${users.interests} && ${interests}`)
    }

    const politics = searchParams.getAll("politics")
    if (politics.length > 0) {
      userConditions.push(sql`${users.politics} && ${politics}`)
    }

    // Handle age range
    const minAge = searchParams.get("minAge")
    const maxAge = searchParams.get("maxAge")
    if (minAge || maxAge) {
      const now = new Date()
      if (minAge) {
        const maxDate = new Date(now.getFullYear() - parseInt(minAge), now.getMonth(), now.getDate())
        userConditions.push(sql`${users.dob} <= ${maxDate}`)
      }
      if (maxAge) {
        const minDate = new Date(now.getFullYear() - parseInt(maxAge), now.getMonth(), now.getDate())
        userConditions.push(sql`${users.dob} >= ${minDate}`)
      }
    }

    // Add basic user conditions
    userConditions.push(
      eq(users.isActive, true),
      eq(users.isDeleted, false),
      ne(users.id, currentUser.id) // Exclude current user
    )

    // Build purpose profile conditions
    const purposeConditions = []
    
    if (searchParams.get("purposeDomain")) {
      purposeConditions.push(eq(purposeProfiles.domain, searchParams.get("purposeDomain")! as typeof purposeProfiles.domain.enumValues[number]))
    }
    if (searchParams.get("purposeArchetype")) {
      purposeConditions.push(eq(purposeProfiles.archetype, searchParams.get("purposeArchetype")! as typeof purposeProfiles.archetype.enumValues[number]))
    }
    if (searchParams.get("purposeModality")) {
      purposeConditions.push(eq(purposeProfiles.modality, searchParams.get("purposeModality")! as typeof purposeProfiles.modality.enumValues[number]))
    }

    // Get pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const perPage = ITEMS_PER_PAGE
    const offset = (page - 1) * perPage

    // Get total count for pagination
    const totalCountQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .leftJoin(purposeProfiles, eq(users.id, purposeProfiles.userId))
      .where(
        and(
          ...userConditions,
          ...purposeConditions
        )
      )

    const totalCount = totalCountQuery[0]?.count || 0

    // Get profiles with purpose profiles, pagination, and ordering
    const profilesWithPurpose = await db
      .select({
        user: users,
        purpose: purposeProfiles
      })
      .from(users)
      .leftJoin(purposeProfiles, eq(users.id, purposeProfiles.userId))
      .where(
        and(
          ...userConditions,
          ...purposeConditions
        )
      )
      .limit(perPage)
      .offset(offset)
      .orderBy(sql`${users.createdAt} DESC`)

    // Transform the data to match the Profile type
    const profiles = profilesWithPurpose.map(({ user, purpose }) => {
      // Calculate age from date of birth
      const age = user.dob ? Math.floor((Date.now() - new Date(user.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0
      
      return {
        id: user.id,
        userId: user.id,
        name: user.name || "",
        avatar: user.avatar || "",
        dob: user.dob || "",
        gender: user.gender || "",
        age,
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        religion: user.religion || "",
        education: user.education || "",
        profession: user.profession || "",
        purpose: purpose ? {
          domain: purpose.domain || "Not specified",
          archetype: purpose.archetype || "Not specified",
          modality: purpose.modality || "Not specified",
          narrative: purpose.narrative || "Not specified"
        } : {
          domain: "Not specified",
          archetype: "Not specified",
          modality: "Not specified",
          narrative: "Not specified"
        },
        isNew: true, // You can implement logic to determine if profile is new
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        interests: user.interests || [],
        personality: user.personality || "",
        maritalStatus: user.maritalStatus || "",
        lookingFor: user.lookingFor || "",
        language: user.language || "",
        height: user.height || 0,
        weight: user.weight || 0,
        smoke: user.smoking || "",
        alcohol: user.alcohol || "",
        drugs: user.drugs || "",
        politics: user.politics || [],
        isVerified: user.isVerified || false,
        isDeleted: user.isDeleted || false,
        isActive: user.isActive || false
      }
    })

    return NextResponse.json({
      profiles,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / perPage),
        current: page,
        perPage
      }
    })
  } catch (error: any) {
    console.error("Error fetching profiles:", error)
    return NextResponse.json(
      { message: error.message || "Failed to fetch profiles" },
      { status: 500 }
    )
  }
} 