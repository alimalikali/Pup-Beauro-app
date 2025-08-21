// SUBSCRIPTION MODULE DISABLED
// This file has been disabled as the subscription module is not currently in use

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useSubscription() {
  return {
    plans: [],
    subscription: null,
    createSubscription: async () => {},
    isLoading: false,
  }
}
