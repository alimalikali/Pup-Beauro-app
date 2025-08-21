import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ENV } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Verify refresh token
    const secret = new TextEncoder().encode(ENV.JWT_SECRET);
    const { payload } = await jwtVerify(refreshToken, secret);

    if (payload.type !== 'refresh') {
      return NextResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub as string),
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const newToken = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(ENV.JWT_EXPIRY)
      .sign(secret);

    const newRefreshToken = await new SignJWT({
      sub: user.id,
      type: 'refresh',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(ENV.JWT_EXPIRY)
      .sign(secret);

    // Create response
    const response = NextResponse.json({
      token: newToken,
      refreshToken: newRefreshToken,
    });

    // Set cookies
    response.cookies.set(ENV.TOKEN_NAME, newToken, ENV.getCookieOptions(ENV.ACCESS_TOKEN_EXPIRY));
    response.cookies.set(ENV.REFRESH_TOKEN_NAME, newRefreshToken, ENV.getCookieOptions(ENV.REFRESH_TOKEN_EXPIRY));

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { message: 'Invalid refresh token' },
      { status: 401 }
    );
  }
} 