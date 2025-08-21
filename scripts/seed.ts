import { ENV } from "@/lib/constants"
import {
    educationLevelEnum,
    genderEnum,
    maritalStatusEnum,
    personalityTypeEnum,
    professionFieldEnum,
    purposeProfiles,
    religionEnum,
    substanceUsageEnum,
    users,
    roleEnum
} from "@/lib/db/schema"
import { faker } from '@faker-js/faker'
import { Pool } from "@neondatabase/serverless"
import { hash } from "bcryptjs"
import { drizzle } from "drizzle-orm/neon-serverless"

// Initialize database connection
const pool = new Pool({ connectionString: ENV.DATABASE_URL })
const db = drizzle(pool, { schema: { users, purposeProfiles } })

type UserInput = {
  name: string
  email: string
  password: string
  phone: string
  role: typeof roleEnum.enumValues[number]
  gender: typeof genderEnum.enumValues[number]
  religion: typeof religionEnum.enumValues[number]
  education: typeof educationLevelEnum.enumValues[number]
  profession: typeof professionFieldEnum.enumValues[number]
  personality: typeof personalityTypeEnum.enumValues[number]
  maritalStatus: typeof maritalStatusEnum.enumValues[number]
  lookingFor: typeof maritalStatusEnum.enumValues[number]
  dob: string
  avatar: string | null
  country: string
  state: string
  city: string
  height: number
  weight: number
  motherTounge: string
  interests: string[]
  alcohol: typeof substanceUsageEnum.enumValues[number]
  drugs: typeof substanceUsageEnum.enumValues[number]
  smoking: typeof substanceUsageEnum.enumValues[number]
  politics: string[]
  purpose: {
    domain: string
    archetype: string
    modality: string
    narrative: string
  }
}

// Helper function to get random enum value
const getRandomEnumValue = <T extends readonly string[]>(enumValues: T): T[number] => {
  return enumValues[Math.floor(Math.random() * enumValues.length)]
}

// Purpose generation data
const purposeDomains = [
  "Technology & Innovation",
  "Healthcare Innovation",
  "Islamic Education",
  "Social Enterprise",
  "Environmental Sustainability",
  "Arts & Culture",
  "Community Development",
  "Scientific Research",
  "Humanitarian Aid",
  "Islamic Finance",
  "Media & Communication",
  "Sports & Wellness",
] as const

const purposeArchetypes = [
  "Digital Pioneer",
  "Healing Pioneer",
  "Modern Educator",
  "Community Builder",
  "Environmental Steward",
  "Cultural Ambassador",
  "Social Innovator",
  "Research Scholar",
  "Humanitarian Leader",
  "Financial Innovator",
  "Media Storyteller",
  "Wellness Advocate",
] as const

const purposeModalities = [
  "Building",
  "Research",
  "Teaching",
  "Entrepreneurship",
  "Advocacy",
  "Creating",
  "Organizing",
  "Analyzing",
  "Supporting",
  "Innovating",
  "Communicating",
  "Mentoring",
] as const

// Languages commonly spoken in Muslim-majority countries
const languages = [
  "Arabic",
  "Urdu",
  "Persian",
  "Turkish",
  "Bengali",
  "Malay",
  "Indonesian",
  "Hausa",
  "Swahili",
  "Kurdish",
  "Pashto",
  "English",
] as const

// Common Muslim-majority countries and their cities
const locations = [
  {
    country: "Pakistan",
    states: ["Punjab", "Sindh", "KPK", "Balochistan"],
    cities: ["Lahore", "Karachi", "Islamabad", "Peshawar", "Faisalabad"],
  },
  {
    country: "United Arab Emirates",
    states: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain"],
  },
  {
    country: "Malaysia",
    states: ["Selangor", "Kuala Lumpur", "Penang", "Johor"],
    cities: ["Kuala Lumpur", "Shah Alam", "George Town", "Johor Bahru"],
  },
  {
    country: "Indonesia",
    states: ["Jakarta", "West Java", "East Java", "Central Java"],
    cities: ["Jakarta", "Surabaya", "Bandung", "Medan"],
  },
  {
    country: "Turkey",
    states: ["Istanbul", "Ankara", "Izmir", "Bursa"],
    cities: ["Istanbul", "Ankara", "Izmir", "Bursa"],
  },
] as const

// Interests relevant to Muslim professionals
const possibleInterests = [
  "Islamic finance",
  "Halal entrepreneurship",
  "Islamic art",
  "Calligraphy",
  "Muslim tech innovation",
  "Islamic history",
  "Community service",
  "Charity work",
  "Environmental conservation",
  "Islamic architecture",
  "Muslim fashion",
  "Halal food",
  "Islamic education",
  "Quranic studies",
  "Arabic language",
  "Muslim literature",
  "Islamic science",
  "Mental health awareness",
  "Youth mentoring",
  "Sports",
  "Photography",
  "Travel",
  "Reading",
  "Writing",
  "Technology",
  "Business",
  "Healthcare",
  "Research",
  "Teaching",
  "Social work",
] as const

// Political views considering Muslim perspectives
const politicalViews = [
  "CONSERVATIVE",
  "MODERATE",
  "PROGRESSIVE",
  "CENTRIST",
  "TRADITIONAL",
  "REFORMIST",
] as const

const generateUser = async (): Promise<UserInput> => {
  const gender = getRandomEnumValue(genderEnum.enumValues)
  const firstName = faker.person.firstName(gender.toLowerCase() as "male" | "female")
  const lastName = faker.person.lastName()
  const location = faker.helpers.arrayElement(locations)
  const state = faker.helpers.arrayElement(location.states)
  const city = faker.helpers.arrayElement(location.cities)
  const dob = faker.date.between({ from: '1980-01-01', to: '2000-12-31' }).toISOString().split('T')[0]
  
  // Generate 3-6 random interests
  const interestCount = faker.number.int({ min: 3, max: 6 })
  const interests = faker.helpers.arrayElements(possibleInterests, interestCount)
  
  // Generate 1-3 political views
  const politicsCount = faker.number.int({ min: 1, max: 3 })
  const politics = faker.helpers.arrayElements(politicalViews, politicsCount)

  const purposeDomain = faker.helpers.arrayElement(purposeDomains)
  const purposeArchetype = faker.helpers.arrayElement(purposeArchetypes)
  const purposeModality = faker.helpers.arrayElement(purposeModalities)

  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: "password123", // Default password for all test users
    phone: faker.phone.number('+###########'),
    role: "USER",
    gender,
    religion: getRandomEnumValue(religionEnum.enumValues),
    education: getRandomEnumValue(educationLevelEnum.enumValues),
    profession: getRandomEnumValue(professionFieldEnum.enumValues),
    personality: getRandomEnumValue(personalityTypeEnum.enumValues),
    maritalStatus: getRandomEnumValue(maritalStatusEnum.enumValues),
    lookingFor: getRandomEnumValue(maritalStatusEnum.enumValues),
    dob,
    avatar: faker.image.avatar(),
    country: location.country,
    state,
    city,
    height: faker.number.int({ min: 150, max: 190 }),
    weight: faker.number.int({ min: 45, max: 100 }),
    motherTounge: faker.helpers.arrayElement(languages),
    interests,
    alcohol: getRandomEnumValue(substanceUsageEnum.enumValues),
    drugs: getRandomEnumValue(substanceUsageEnum.enumValues),
    smoking: getRandomEnumValue(substanceUsageEnum.enumValues),
    politics,
    purpose: {
      domain: purposeDomain,
      archetype: purposeArchetype,
      modality: purposeModality,
      narrative: faker.lorem.paragraph(),
    }
  }
}

async function main() {
  console.log("🌱 Starting seeding...")
  
  // Number of users to generate
  const USER_COUNT = 500

  // Generate users in batches to avoid overwhelming the database
  const BATCH_SIZE = 50
  const batches = Math.ceil(USER_COUNT / BATCH_SIZE)

  for (let i = 0; i < batches; i++) {
    const batchStart = i * BATCH_SIZE
    const batchSize = Math.min(BATCH_SIZE, USER_COUNT - batchStart)
    console.log(`Processing batch ${i + 1}/${batches} (users ${batchStart + 1}-${batchStart + batchSize})`)

    const userPromises = Array.from({ length: batchSize }, async () => {
      try {
        const userData = await generateUser()
        const { purpose, ...userInfo } = userData
        const hashedPassword = await hash(userInfo.password, 12)

        // Create user
        const [user] = await db
          .insert(users)
          .values({
            ...userInfo,
            password: hashedPassword,
            isVerified: faker.datatype.boolean({ probability: 0.8 }), // 80% verified
            isActive: faker.datatype.boolean({ probability: 0.9 }), // 90% active
            isDeleted: false,
          })
          .returning()

        // Create purpose profile
        await db.insert(purposeProfiles).values({
          userId: user.id,
          ...purpose,
        })

        console.log(`✓ Created user: ${user.email}`)
        return user
      } catch (error) {
        console.error("Error creating user:", error)
        return null
      }
    })

    await Promise.all(userPromises)
  }

  console.log("✅ Seeding completed!")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
    process.exit(0)
  })