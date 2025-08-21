"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

// SUBSCRIPTION MODULE DISABLED
export function ManageSubscription() {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Module Disabled</CardTitle>
        <CardDescription>Subscription management is currently unavailable</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          The subscription module has been temporarily disabled. Please check back later for updates.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push("/pricing")}>View Plans</Button>
      </CardFooter>
    </Card>
  )
}
