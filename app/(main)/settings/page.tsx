import { ManageSubscription } from "@/components/subscription/manage-subscription";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function SubscriptionSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
        <ManageSubscription />
      </div>
    </DashboardLayout>
  );
}
