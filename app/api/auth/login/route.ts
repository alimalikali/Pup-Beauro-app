import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/utils/auth-helper';
import { ENV } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate tokens
    const secret = new TextEncoder().encode(ENV.JWT_SECRET);
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(ENV.JWT_EXPIRY)
      .sign(secret);

    const refreshToken = await new SignJWT({
      sub: user.id,
      type: 'refresh',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(ENV.JWT_EXPIRY)
      .sign(secret);

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    });

    // Set cookies
    response.cookies.set(ENV.TOKEN_NAME, token, ENV.getCookieOptions(ENV.ACCESS_TOKEN_EXPIRY));
    response.cookies.set(ENV.REFRESH_TOKEN_NAME, refreshToken, ENV.getCookieOptions(ENV.REFRESH_TOKEN_EXPIRY));

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
