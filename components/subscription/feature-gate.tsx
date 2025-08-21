"use client"

import type { ReactNode } from "react"
import { useSubscription } from "@/lib/subscription-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { useRouter } from "next/navigation"

interface FeatureGateProps {
  feature: string
  children: ReactNode
  fallback?: ReactNode
  showUpgrade?: boolean
}

export function FeatureGate({ feature, children, fallback, showUpgrade = true }: FeatureGateProps) {
  const { hasFeature } = useSubscription()
  const router = useRouter()

  const hasAccess = hasFeature(feature)

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (showUpgrade) {
    return (
      <Card className="w-full h-full flex flex-col items-center justify-center text-center p-6">
        <CardHeader>
          <div className="mx-auto bg-muted rounded-full p-3 mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Premium Feature</CardTitle>
          <CardDescription>This feature requires a subscription upgrade</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Upgrade your subscription to unlock {formatFeatureName(feature)} and many other premium features.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/pricing")}>View Pricing Plans</Button>
        </CardFooter>
      </Card>
    )
  }

  return null
}

function formatFeatureName(feature: string): string {
  return feature
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}
