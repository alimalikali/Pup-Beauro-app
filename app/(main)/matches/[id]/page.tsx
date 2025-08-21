import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { MatchDetail } from "@/components/matches/match-detail"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Match Details | Pup",
  description: "View detailed information about your match",
}

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <MatchDetail matchId={params.id} />
    </DashboardLayout>
  )
}
