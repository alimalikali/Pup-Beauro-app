import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { ENV } from '@/lib/constants';

// Public paths that don't require authentication
const PUBLIC_PATHS = ['/', '/auth/login', '/auth/register', '/auth/forgot-password'];
const ADMIN_PATHS = ['/admin'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ENV.TOKEN_NAME)?.value;

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some(path => request.nextUrl.pathname === path);
  const isAdminPath = ADMIN_PATHS.some(path => request.nextUrl.pathname.startsWith(path));

  // Skip middleware for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Handle public paths
  if (isPublicPath) {
    if (token) {
      // If user is authenticated and tries to access auth pages, redirect to dashboard
      if (request.nextUrl.pathname.startsWith('/auth/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (!token) {
    // Redirect to login only for protected routes
    if (!request.nextUrl.pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(ENV.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Check admin access
    if (isAdminPath && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Add user info to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.sub as string);
    requestHeaders.set('x-user-role', payload.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Token is invalid, clear both tokens and redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    const options = {
      ...ENV.COOKIE_OPTIONS,
      maxAge: 0,
    };
    
    response.cookies.set(ENV.TOKEN_NAME, "", options);
    response.cookies.set(ENV.REFRESH_TOKEN_NAME, "", options);
    return response;
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};