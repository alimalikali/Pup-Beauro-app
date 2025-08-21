import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../lib/db/schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const db = drizzle(pool, { schema })

async function seedSingleUser() {
  try {
    console.log('🌱 Starting single user seed...')
    console.log("Database URL:", process.env.DATABASE_URL)

    // Create a single user
    const [user] = await db
      .insert(schema.users)
      .values({
        name: 'Test User',
        email: 'test@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ3qKre', // password123
        role: 'USER',
        isActive: true,
        isVerified: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    console.log('👤 Created user:', user)

    // Create profile for the user
    const [profile] = await db
      .insert(schema.profiles)
      .values({
        userId: user.id,
        purpose: 'MARRIAGE',
        age: 25,
        gender: 'MALE',
        location: 'Test City, TC',
        bio: 'This is a test profile for development purposes.',
        interests: ['testing', 'development', 'coding'],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    console.log('📝 Created profile:', profile)

    console.log('✅ Single user seed completed successfully!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

seedSingleUser().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})