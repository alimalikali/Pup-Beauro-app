'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { ReactNode } from 'react'

interface GoogleAuthProviderProps {
  children: ReactNode
}

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    // In development, show a helpful error message
    if (process.env.NODE_ENV === 'development') {
      console.error('Missing GOOGLE_CLIENT_ID environment variable. Please set it in your .env.local file.');
      return (
        <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded">
          Missing GOOGLE_CLIENT_ID environment variable. Please check your .env.local file.
        </div>
      );
    }
    // In production, just render children without Google auth
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  )
} 