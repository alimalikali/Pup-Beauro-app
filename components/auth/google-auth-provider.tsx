'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ENV } from '@/lib/constants';

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  // Check if Google OAuth is properly configured
  if (!ENV.GOOGLE_CLIENT_ID) {
    console.warn('Google OAuth Client ID is not configured. Google authentication will be disabled.');
    // Return children without Google OAuth provider if credentials are missing
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
} 