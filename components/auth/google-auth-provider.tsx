'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ENV } from '@/lib/constants';

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
} 