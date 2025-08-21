import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Pup",
  description: "Your Pup dashboard",
}

export default function DashboardPage() {
  return (
    <DashboardOverview />
  )
}
