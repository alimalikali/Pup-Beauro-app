import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/', '/pricing', '/about']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get(process.env.TOKEN_NAME || 'token')?.value

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'pup')
    const { payload } = await jwtVerify(token, secret)

    if (!payload) {
      throw new Error('Invalid token payload')
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      // Token expired, try to refresh
      const refreshToken = request.cookies.get(process.env.REFRESH_TOKEN_NAME || 'refreshToken')?.value

      if (refreshToken) {
        try {
          const refreshSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'pup')
          const { payload: refreshPayload } = await jwtVerify(refreshToken, refreshSecret)

          if (refreshPayload && refreshPayload.exp && refreshPayload.exp > now) {
            // Refresh token is valid, redirect to refresh endpoint
            const refreshUrl = new URL('/api/auth/refresh', request.url)
            refreshUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(refreshUrl)
          }
        } catch (refreshError) {
          // Refresh token is invalid
        }
      }

      // Both tokens are invalid, clear cookies and redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      const options = {
        ...getCookieOptions(0),
      }
      response.cookies.set(process.env.TOKEN_NAME || 'token', "", options);
      response.cookies.set(process.env.REFRESH_TOKEN_NAME || 'refreshToken', "", options);
      return response
    }

    // Token is valid, proceed
    return NextResponse.next()
  } catch (error) {
    // Token verification failed, redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    const options = {
      ...getCookieOptions(0),
    }
    response.cookies.set(process.env.TOKEN_NAME || 'token', "", options);
    response.cookies.set(process.env.REFRESH_TOKEN_NAME || 'refreshToken', "", options);
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}