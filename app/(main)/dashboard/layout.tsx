import { DashboardLayout as DashboardLayoutComponent } from "@/components/dashboard/dashboard-layout"


    

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <DashboardLayoutComponent>
                {children}
            </DashboardLayoutComponent>
        </div>
    )
}
