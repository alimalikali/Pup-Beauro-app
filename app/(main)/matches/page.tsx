import { MatchesList } from "@/components/matches/matches-list"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Matches | Pup",
  description: "Find your purpose-aligned partner",
}

export default function MatchesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
          <p className="text-muted-foreground">People who share your purpose and meet your preferences</p>
        </div>
        <MatchesList />
      </div>
    </DashboardLayout>
  )
}
