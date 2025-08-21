import { AdminLayout } from "@/components/admin/admin-layout"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics | Pup Admin",
  description: "Analytics and insights for Pup marriage bureau",
}

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <AnalyticsDashboard />
    </AdminLayout>
  )
}
