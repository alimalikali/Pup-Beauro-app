import { MatchesList } from "@/components/matches/matches-list"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import type { Metadata } from "next"
import { ProfilesList } from "@/components/profiles/profiles-list"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Profiles | Pup",
  description: "Find your purpose-aligned partner",
}

export default function ProfilesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profiles</h1>
          <p className="text-muted-foreground">Find profiles that match your Vision</p>
        </div>
        <Suspense fallback={<div>Loading profiles...</div>}>
          <ProfilesList />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
