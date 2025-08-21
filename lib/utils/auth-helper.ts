import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// Helper function to parse duration string to seconds
function parseDuration(duration: string): number {
  const units = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };

  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 0;

  const [, value, unit] = match;
  return parseInt(value) * units[unit as keyof typeof units];
}

// Helper function to get cookie options
function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'pup')
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function createToken(payload: any) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'pup')
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRY || '7d')
    .sign(secret)
  return token
}

export async function createRefreshToken(payload: any) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'pup')
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY || '7d')
    .sign(secret)
  return token
}

export async function getTokenFromCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get(process.env.TOKEN_NAME || 'token')?.value
  return token
}

export async function getRefreshTokenFromCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get(process.env.REFRESH_TOKEN_NAME || 'refreshToken')?.value
  return token
}

export async function setTokensInCookie(token: string, refreshToken: string) {
  const cookieStore = await cookies()
  const accessTokenExpiry = parseDuration(process.env.ACCESS_TOKEN_EXPIRY || '1h')
  const refreshTokenExpiry = parseDuration(process.env.REFRESH_TOKEN_EXPIRY || '7d')
  
  cookieStore.set(process.env.TOKEN_NAME || 'token', token, getCookieOptions(accessTokenExpiry))
  cookieStore.set(process.env.REFRESH_TOKEN_NAME || 'refreshToken', refreshToken, getCookieOptions(refreshTokenExpiry))
}

export async function clearTokensFromCookie() {
  const cookieStore = await cookies()
  cookieStore.set(process.env.TOKEN_NAME || 'token', "", getCookieOptions(0))
  cookieStore.set(process.env.REFRESH_TOKEN_NAME || 'refreshToken', "", getCookieOptions(0))
}

// Additional functions that were in the original file
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.TOKEN_NAME || 'token')?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, payload.sub as string)).limit(1)

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

// Alias for backward compatibility
export const clearAuthCookies = clearTokensFromCookie
