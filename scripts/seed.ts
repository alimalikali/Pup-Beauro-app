import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../lib/db/schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const db = drizzle(pool, { schema })

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Clear existing data
    await db.delete(schema.users)
    await db.delete(schema.profiles)
    await db.delete(schema.matches)

    console.log('🗑️  Cleared existing data')

    // Create users
    const users = await db
      .insert(schema.users)
      .values([
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ3qKre', // password123
          role: 'USER',
          isActive: true,
          isVerified: true,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ3qKre', // password123
          role: 'USER',
          isActive: true,
          isVerified: true,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Admin User',
          email: 'admin@example.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ3qKre', // password123
          role: 'ADMIN',
          isActive: true,
          isVerified: true,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      .returning()

    console.log('👥 Created users:', users.length)

    // Create profiles
    const profiles = await db
      .insert(schema.profiles)
      .values([
        {
          userId: users[0].id,
          purpose: 'MARRIAGE',
          age: 28,
          gender: 'MALE',
          location: 'New York, NY',
          bio: 'Looking for a life partner to build a family with.',
          interests: ['reading', 'traveling', 'cooking'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: users[1].id,
          purpose: 'MARRIAGE',
          age: 26,
          gender: 'FEMALE',
          location: 'Los Angeles, CA',
          bio: 'Seeking a committed relationship leading to marriage.',
          interests: ['yoga', 'photography', 'hiking'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      .returning()

    console.log('📝 Created profiles:', profiles.length)

    // Create some matches
    const matches = await db
      .insert(schema.matches)
      .values([
        {
          userId: users[0].id,
          targetUserId: users[1].id,
          status: 'LIKED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      .returning()

    console.log('💕 Created matches:', matches.length)

    console.log('✅ Database seed completed successfully!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})