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
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const currentUser = user[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, currentUser.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!currentUser.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      )
    }

    // Create JWT tokens
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'pup');
    const token = await new SignJWT({
      sub: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRY || '7d')
      .sign(secret)

    const refreshToken = await new SignJWT({
      sub: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY || '7d')
      .sign(secret)

    // Set cookies
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        role: currentUser.role,
      },
    })

    const accessTokenExpiry = parseDuration(process.env.ACCESS_TOKEN_EXPIRY || '1h')
    const refreshTokenExpiry = parseDuration(process.env.REFRESH_TOKEN_EXPIRY || '7d')

    response.cookies.set(process.env.TOKEN_NAME || 'token', token, getCookieOptions(accessTokenExpiry));
    response.cookies.set(process.env.REFRESH_TOKEN_NAME || 'refreshToken', refreshToken, getCookieOptions(refreshTokenExpiry));

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
