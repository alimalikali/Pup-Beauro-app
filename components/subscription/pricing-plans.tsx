"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// SUBSCRIPTION MODULE DISABLED
export function PricingPlans() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()

  // Mock plans data since subscription module is disabled
  const plans = [
    {
      id: "free",
      name: "FREE",
      price: 0,
      perks: ["Basic matching", "Profile creation", "Limited messages"],
      isActive: true,
    },
    {
      id: "premium",
      name: "PREMIUM",
      price: 19.99,
      perks: ["Unlimited matches", "Advanced filters", "Priority support"],
      isActive: true,
    },
  ]

  const handleSubscribe = async (planId: string, planName: string) => {
    // If it's the free plan, just redirect to dashboard
    if (planName === "FREE") {
      router.push("/dashboard")
      return
    }

    // Subscription module is disabled
    toast({
      title: "Subscription unavailable",
      description: "Subscription module is currently disabled.",
      variant: "destructive",
    })
  }

  // Check if user is already subscribed to a plan
  const isSubscribed = (planName: string) => {
    return false
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className={`flex flex-col max-w-1/2 ${plan.name === "PREMIUM" ? "border-primary" : ""}`}>
          {plan.name === "PREMIUM" && (
            <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">Most Popular</div>
          )}
          <CardHeader>
            <CardTitle>{formatPlanName(plan.name)}</CardTitle>
            <CardDescription>{getPlanDescription(plan.name)}</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">{plan.name === "FREE" ? "Free" : `$${plan.price}`}</span>
              {plan.name !== "FREE" && <span className="text-muted-foreground">/month</span>}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>{formatPerkName(perk)}</span>
                </li>
              ))}
              {getPlanLimitations(plan.name).map((limitation) => (
                <li key={limitation} className="flex items-start text-muted-foreground">
                  <X className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.name === "PREMIUM" ? "default" : "outline"}
              disabled={isLoading !== null || isSubscribed(plan.name)}
              onClick={() => handleSubscribe(plan.id, plan.name)}
            >
              {isLoading === plan.id
                ? "Processing..."
                : isSubscribed(plan.name)
                  ? "Current Plan"
                  : plan.name === "FREE"
                    ? "Get Started"
                    : "Subscribe"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function formatPlanName(name: string): string {
  switch (name) {
    case "FREE":
      return "Free"
    case "BOOST":
      return "Boost"
    case "PREMIUM":
      return "Premium"
    case "VERIFIED":
      return "Verified"
    default:
      return name
  }
}

function getPlanDescription(name: string): string {
  switch (name) {
    case "FREE":
      return "Basic features to get started"
    case "BOOST":
      return "Enhanced visibility and features"
    case "PREMIUM":
      return "Full access to all features"
    case "VERIFIED":
      return "Premium features with identity verification"
    default:
      return ""
  }
}

function formatPerkName(perk: string): string {
  return perk
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

function getPlanLimitations(name: string): string[] {
  switch (name) {
    case "FREE":
      return [
        "Limited to 5 matches per month",
        "No advanced filters",
        "No priority in search results",
        "No read receipts",
      ]
    case "BOOST":
      return ["No profile highlighting", "No read receipts", "No verified badge"]
    case "PREMIUM":
      return ["No identity verification", "No background check"]
    case "VERIFIED":
      return []
    default:
      return []
  }
}
