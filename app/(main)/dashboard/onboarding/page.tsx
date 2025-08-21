import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Onboarding | Pup",
  description: "Complete your profile to find your purpose-aligned partner",
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen">
      <OnboardingFlow />
    </div>
  )
}
