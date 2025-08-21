"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, User, Users, Settings, CreditCard, Menu, X, LogOut, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { useAuthStore } from "@/lib/store/auth-store"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUserProfile } from "@/lib/hooks/use-queries"
interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: profileData, isLoading: isLoadingProfile } = useCurrentUserProfile()
  const { logout } = useAuthStore()
  const { toast } = useToast()
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: User },
    { name: "Matches", href: "/matches", icon: Heart },
    { name: "Discovery", href: "/discover", icon: Target },
    { name: "Profiles", href: "/profiles", icon: Users },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const logoutHandler = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out successfully",
      });

    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "Please try again",
      });
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <div className="w-64 bg-muted/50 border-r flex flex-col">
          <div className="p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="font-bold text-xl">Pup</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={logoutHandler}>
              <LogOut className="h-5 w-5 mr-3" />
              Log out
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-6">
          {isMobile && (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetTitle className="hidden">Pup</SheetTitle>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4 border-b flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2" onClick={closeSidebar}>
                    <Heart className="h-6 w-6 text-primary" fill="currentColor" />
                    <span className="font-bold text-xl">Pup</span>
                  </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      onClick={closeSidebar}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={logoutHandler}>
                    <LogOut className="h-5 w-5 mr-3" />
                    Log out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {isMobile && (
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="font-bold text-xl">Pup</span>
            </Link>
          )}

          <div className="flex items-center ml-auto gap-2">
            <ModeToggle />
            <Link href="/dashboard/profile">
              <Avatar>
                <AvatarImage src={profileData?.user?.avatar || 'placeholder.svg?height=32&width=32'} alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
