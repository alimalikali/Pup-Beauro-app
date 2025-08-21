import { NextRequest, NextResponse } from 'next/server'
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
    const { access_token } = await request.json()

    if (!access_token) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    // Get user info from Google
    const userInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    )

    if (!userInfoResponse.ok) {
      return NextResponse.json({ error: 'Failed to get user info from Google' }, { status: 400 })
    }

    const userInfo = await userInfoResponse.json()

    // Check if user already exists
    let user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, userInfo.email))
      .limit(1)

    if (user.length === 0) {
      // Create new user
      const [newUser] = await db
        .insert(schema.users)
        .values({
          email: userInfo.email,
          name: userInfo.name,
          password: '', // No password for Google users
          role: 'USER',
          isActive: true,
          isVerified: true, // Google users are verified
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      user = [newUser]
    }

    const currentUser = user[0]

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
    const response2 = NextResponse.json({
      message: 'Google authentication successful',
      user: {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        role: currentUser.role,
      },
    })

    const accessTokenExpiry = parseDuration(process.env.ACCESS_TOKEN_EXPIRY || '1h')
    const refreshTokenExpiry = parseDuration(process.env.REFRESH_TOKEN_EXPIRY || '7d')

    response2.cookies.set(process.env.TOKEN_NAME || 'token', token, getCookieOptions(accessTokenExpiry));
    response2.cookies.set(process.env.REFRESH_TOKEN_NAME || 'refreshToken', refreshToken, getCookieOptions(refreshTokenExpiry));

    return response2
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 