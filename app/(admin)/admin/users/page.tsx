import { AdminLayout } from "@/components/admin/admin-layout"
import { UserManagement } from "@/components/admin/user-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Management | Pup Admin",
  description: "Manage users on the Pup platform",
}

export default function UsersPage() {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  )
}
