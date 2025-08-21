import { PurposeDiscovery } from "@/components/discovery/purpose-discovery"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Purpose Discovery | Pup",
  description: "Discover partners based on purpose alignment and shared values",
}

export default function DiscoverPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Purpose Discovery</h1>
          <p className="text-muted-foreground">
            Find partners whose life purpose aligns with yours. Discover meaningful connections based on shared values and goals.
          </p>
        </div>
        <PurposeDiscovery />
      </div>
    </DashboardLayout>
  )
}



