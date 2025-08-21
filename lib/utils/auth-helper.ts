import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { ENV } from "@/lib/constants"

export interface JWTPayload {
  sub: string
  email: string
  role: "USER" | "ADMIN"
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function signJWT(payload: Omit<JWTPayload, "sub"> & { userId: string }): Promise<string> {
  const secret = new TextEncoder().encode(ENV.JWT_SECRET)
  return new SignJWT({
    ...payload,
    sub: payload.userId
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(ENV.JWT_EXPIRY)
    .sign(secret)
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(ENV.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.TOKEN_NAME)?.value

    if (!token) {
      return null
    }

    const payload = await verifyJWT(token)
    if (!payload) {
      return null
    }

    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, payload.sub)).limit(1)

    if (!user || !user.isActive || user.isDeleted) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function setAuthCookies(token: string, refreshToken: string) {
  const cookieStore = await cookies()
  cookieStore.set(ENV.TOKEN_NAME, token, ENV.getCookieOptions(ENV.ACCESS_TOKEN_EXPIRY))
  cookieStore.set(ENV.REFRESH_TOKEN_NAME, refreshToken, ENV.getCookieOptions(ENV.REFRESH_TOKEN_EXPIRY))
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.set(ENV.TOKEN_NAME, "", ENV.getCookieOptions(0))
  cookieStore.set(ENV.REFRESH_TOKEN_NAME, "", ENV.getCookieOptions(0))
}
