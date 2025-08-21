import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'

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
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get(process.env.REFRESH_TOKEN_NAME || 'refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token not found' }, { status: 401 })
    }

    // Verify refresh token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'pup');
    const { payload } = await jwtVerify(refreshToken, secret)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
    }

    // Check if refresh token is expired
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return NextResponse.json({ error: 'Refresh token expired' }, { status: 401 })
    }

    // Generate new tokens
    const newToken = await new SignJWT({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRY || '7d')
      .sign(secret)

    const newRefreshToken = await new SignJWT({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY || '7d')
      .sign(secret)

    // Set new cookies
    const response = NextResponse.json({ message: 'Tokens refreshed successfully' })

    const accessTokenExpiry = parseDuration(process.env.ACCESS_TOKEN_EXPIRY || '1h')
    const refreshTokenExpiry = parseDuration(process.env.REFRESH_TOKEN_EXPIRY || '7d')

    response.cookies.set(process.env.TOKEN_NAME || 'token', newToken, getCookieOptions(accessTokenExpiry));
    response.cookies.set(process.env.REFRESH_TOKEN_NAME || 'refreshToken', newRefreshToken, getCookieOptions(refreshTokenExpiry));

    return response
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 