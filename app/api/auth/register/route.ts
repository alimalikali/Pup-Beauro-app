import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const [newUser] = await db
      .insert(schema.users)
      .values({
        email,
        password: hashedPassword,
        name,
        role: 'USER',
        isActive: true,
        isVerified: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    // Create JWT tokens
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'pup');
    const token = await new SignJWT({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRY || '7d')
      .sign(secret)

    const refreshToken = await new SignJWT({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY || '7d')
      .sign(secret)

    // Set cookies
    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    )

    const accessTokenExpiry = parseDuration(process.env.ACCESS_TOKEN_EXPIRY || '1h')
    const refreshTokenExpiry = parseDuration(process.env.REFRESH_TOKEN_EXPIRY || '7d')

    response.cookies.set(process.env.TOKEN_NAME || 'token', token, getCookieOptions(accessTokenExpiry));
    response.cookies.set(process.env.REFRESH_TOKEN_NAME || 'refreshToken', refreshToken, getCookieOptions(refreshTokenExpiry));

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
