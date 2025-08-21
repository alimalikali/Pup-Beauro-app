import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool } from "@neondatabase/serverless"
import { users, purposeProfiles, genderEnum, religionEnum, educationLevelEnum, professionFieldEnum, personalityTypeEnum, maritalStatusEnum, substanceUsageEnum, roleEnum, domainEnum, archetypeEnum, modalityEnum, languageEnum } from "@/lib/db/schema"
import { hash } from "bcryptjs"
import { ENV } from "@/lib/constants"

// Initialize database connection
const pool = new Pool({ connectionString: ENV.DATABASE_URL })
const db = drizzle(pool, { schema: { users, purposeProfiles } })

async function main() {
  console.log("🌱 Starting seeding...")
  console.log("Database URL:", ENV.DATABASE_URL)

  // Create a single user with purpose profile
  const userData = {
    name: "Fatima Al-Haj",
    email: "fatima.alhaj@gmail.com",
    password: "password123",
    phone: "+971526374859",
    role: roleEnum.enumValues[0], // "USER"
    gender: genderEnum.enumValues[1], // "FEMALE"
    religion: religionEnum.enumValues[0], // "ISLAM"
    education: educationLevelEnum.enumValues[1],    // "PRIMARY"
    profession: professionFieldEnum.enumValues[1], // "SOFTWARE_DEVELOPMENT"
    personality: personalityTypeEnum.enumValues[0], // "EXTROVERT"
    maritalStatus: maritalStatusEnum.enumValues[0], // "SINGLE"
    lookingFor: maritalStatusEnum.enumValues[0], // "SINGLE"

    // Optional fields
    dob: "2000-01-01", // Date as string for SQL
    avatar: "https://res.cloudinary.com/duwexuaai/image/upload/v1748175915/pup_marrige_uploads/zctt80x55el6ywmaxhej.jpg",
    country: "Pakistan",
    state: "Punjab",
    city: "Lahore",
    height: 170, // in cm
    weight: 70, // in kg
    language: languageEnum.enumValues[1], // "URDU"
    
    // Arrays and enums
    interests: ["reading", "traveling"] as string[],
    alcohol: substanceUsageEnum.enumValues[0], // "NONE"
    drugs: substanceUsageEnum.enumValues[0], // "NONE"
    smoking: substanceUsageEnum.enumValues[0], // "NONE"
    politics: ["FUNDAMENTALIST", "CONSERVATIVE"] as string[],

    // Booleans
    isVerified: true,
    isDeleted: false,
    isActive: true,
  }

  const purposeData = {
    domain: domainEnum.enumValues[0], // "PERSONAL_GROWTH"
    archetype: archetypeEnum.enumValues[0], // "LEADER"
    modality: modalityEnum.enumValues[0], // "ONLINE"
    narrative: "I am passionate about transforming education through innovative teaching methods and technology. My goal is to make quality education accessible to underserved communities while preserving cultural values. I believe in creating inclusive learning environments that honor diverse perspectives and cultural traditions.",
  }

  const hashedPassword = await hash(userData.password, 12)

  try {
    console.log("Creating user with data:", { ...userData, password: "[HIDDEN]" })
    
    // Create user
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning()

    console.log("✅ Created user:", user.email)
    console.log("User ID:", user.id)

    // Create purpose profile
    const [purposeProfile] = await db.insert(purposeProfiles).values({
      userId: user.id,
      ...purposeData,
    }).returning()

    console.log("✅ Created purpose profile for user:", user.email)
    console.log("Purpose Profile ID:", purposeProfile.id)
    console.log("🎉 Seeding completed successfully!")
    
  } catch (error) {
    console.error("❌ Error during seeding:")
    console.error("Error details:", error)
    
    // Check if it's a connection error
    if (error instanceof Error) {
      if (error.message.includes("connection")) {
        console.error("🔌 Database connection failed. Please check:")
        console.error("1. Your DATABASE_URL environment variable")
        console.error("2. Network connectivity")
        console.error("3. Database server status")
      }
    }
    
    throw error
  }
}

main()
  .catch((e) => {
    console.error("❌ Fatal error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    console.log("🔄 Closing database connection...")
    await pool.end()
    console.log("✅ Database connection closed")
    process.exit(0)
  })