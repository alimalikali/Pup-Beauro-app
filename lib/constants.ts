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

// Safe environment variable getter
function getEnvVar(key: string, defaultValue: string = ''): string {
  if (typeof window !== 'undefined') {
    // Client-side: only use NEXT_PUBLIC_ prefixed variables
    if (key.startsWith('NEXT_PUBLIC_')) {
      return process.env[key] || defaultValue;
    }
    return defaultValue;
  }
  // Server-side: can access all environment variables
  return process.env[key] || defaultValue;
}

export const ENV = {
  // Database Configuration
  DATABASE_URL: getEnvVar('DATABASE_URL', ''),

  // App URLs
  APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),

  // App Modes
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  DEV_MODE: getEnvVar('NEXT_PUBLIC_DEV_MODE', 'false') === 'true',
  MAINTENANCE_MODE: getEnvVar('NEXT_PUBLIC_MAINTENANCE_MODE', 'false') === 'true',
  ENABLE_PREMIUM_FEATURES: getEnvVar('NEXT_PUBLIC_ENABLE_PREMIUM_FEATURES', 'false') === 'true',
  DEBUG: getEnvVar('DEBUG', 'false') === 'true',

  // JWT Configuration
  JWT_SECRET: getEnvVar('JWT_SECRET', 'pup'),
  JWT_EXPIRY: getEnvVar('JWT_EXPIRY', '7d'),

  // Cookie Names
  TOKEN_NAME: getEnvVar('TOKEN_NAME', 'token'),
  REFRESH_TOKEN_NAME: getEnvVar('REFRESH_TOKEN_NAME', 'refreshToken'),

  // Token Expiry Times (in seconds)
  ACCESS_TOKEN_EXPIRY: parseDuration(getEnvVar('ACCESS_TOKEN_EXPIRY', '1h')),
  REFRESH_TOKEN_EXPIRY: parseDuration(getEnvVar('REFRESH_TOKEN_EXPIRY', '7d')),

  // Cookie Configuration
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: getEnvVar('NODE_ENV', 'development') === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },

  // Helper method to get cookie options with maxAge
  getCookieOptions: (maxAge: number) => ({
    httpOnly: true,
    secure: getEnvVar('NODE_ENV', 'development') === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }),

  // Environment checks
  isProd: getEnvVar('NODE_ENV', 'development') === 'production',
  isDev: getEnvVar('NODE_ENV', 'development') === 'development',
  isTest: getEnvVar('NODE_ENV', 'development') === 'test',

  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: getEnvVar('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: getEnvVar('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: getEnvVar('CLOUDINARY_API_SECRET', ''),

  GOOGLE_CLIENT_ID: getEnvVar('GOOGLE_CLIENT_ID', ''),
  GOOGLE_CLIENT_SECRET: getEnvVar('GOOGLE_CLIENT_SECRET', ''),
  GOOGLE_REDIRECT_URI: getEnvVar('GOOGLE_REDIRECT_URI', ''),
} as const;

// Type-safe environment variable validation
(() => {
  // All variables have default values, so no validation needed
})(); 