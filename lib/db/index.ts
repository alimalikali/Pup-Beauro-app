import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool } from "@neondatabase/serverless"
import * as schema from "./schema"
import { ENV } from "@/lib/constants"

// Initialize Neon connection
const connectionString = ENV.DATABASE_URL || 'postgresql://pup_owner:npg_Go8diSCvgr3L@ep-bold-rain-a1wjgjjz-pooler.ap-southeast-1.aws.neon.tech/pup?sslmode=require'
const pool = new Pool({ connectionString })

// Create Drizzle client
export const db = drizzle(pool, { schema })

// Export schema for convenience
export * from "./schema"
