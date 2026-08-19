export const Routes = {
  // Auth stack
  Splash: 'Splash',
  Login: 'Login',
  Register: 'Register',
  // Onboarding stack
  PurposeSetup: 'PurposeSetup',
  Verification: 'Verification',
  // Main tabs
  Discover: 'Discover',
  Messages: 'Messages',
  Profile: 'Profile',
  Purpose: 'Purpose',
  // Nested
  DiscoverFeed: 'DiscoverFeed',
  MatchDetail: 'MatchDetail',
  Chat: 'Chat',
} as const;

export type RouteKey = keyof typeof Routes;
