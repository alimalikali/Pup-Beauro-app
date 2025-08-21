import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ENV } from '@/lib/constants';
import { signJWT } from '@/lib/utils/auth-helper';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { googleAccessToken } = await request.json();

    // Verify the Google access token and get user info
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify Google token');
    }

    const googleUser = await response.json();

    // Check if user exists
    const existingUsers = await db.select().from(users).where(eq(users.email, googleUser.email));
    let user = existingUsers[0];

    // If user doesn't exist, create a new one
    if (!user) {
      const [newUser] = await db.insert(users).values({
        name: googleUser.name,
        email: googleUser.email,
        password: '', // No password for Google auth
        isVerified: true, // Google emails are verified
        gender: googleUser.gender,
        dob: googleUser.dob,
        phone: googleUser.phone,
        role: 'USER',
      }).returning();
      
      user = newUser;
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

    // Create the response
    const response2 = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set cookies
    response2.cookies.set(ENV.TOKEN_NAME, token, ENV.getCookieOptions(ENV.ACCESS_TOKEN_EXPIRY));
    response2.cookies.set(ENV.REFRESH_TOKEN_NAME, refreshToken, ENV.getCookieOptions(ENV.REFRESH_TOKEN_EXPIRY));

    return response2;
  } catch (error: any) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 401 }
    );
  }
} 