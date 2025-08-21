import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Pup",
  description: "Admin dashboard for Pup marriage bureau",
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardOverview />
    </AdminLayout>
  )
}
