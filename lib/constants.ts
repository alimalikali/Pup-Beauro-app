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

export const ENV = {
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || '',

  // App URLs
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // App Modes
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
  MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
  ENABLE_PREMIUM_FEATURES: process.env.NEXT_PUBLIC_ENABLE_PREMIUM_FEATURES === 'true',
  DEBUG: process.env.DEBUG === 'true',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'pup',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',

  // Cookie Names
  TOKEN_NAME: process.env.TOKEN_NAME || 'token',
  REFRESH_TOKEN_NAME: process.env.REFRESH_TOKEN_NAME || 'refreshToken',

  // Token Expiry Times (in seconds)
  ACCESS_TOKEN_EXPIRY: parseDuration(process.env.ACCESS_TOKEN_EXPIRY || '1h'),
  REFRESH_TOKEN_EXPIRY: parseDuration(process.env.REFRESH_TOKEN_EXPIRY || '7d'),

  // Cookie Configuration
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },

  // Helper method to get cookie options with maxAge
  getCookieOptions: (maxAge: number) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }),

  // Environment checks
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',

  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
} as const;

// Type-safe environment variable validation
(() => {
  // All variables have default values, so no validation needed
})(); 