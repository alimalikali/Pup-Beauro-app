import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { hashPassword } from '@/lib/utils/auth-helper';
import { ENV } from '@/lib/constants';

// Registration validation schema
const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dob: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        gender: validatedData.gender,
        dob: validatedData.dob ? new Date(validatedData.dob).toISOString() : null,
        phone: validatedData.phone,
        role: 'USER',
      })
      .returning();

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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
