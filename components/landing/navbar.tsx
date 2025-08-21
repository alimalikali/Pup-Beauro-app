"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { useBrowserExtensionFix } from "@/hooks/use-browser-extension-fix"
import { useAuthStore } from "@/lib/store/auth-store"
import { motion } from "framer-motion"
import { Heart, Menu } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean | null;
  role?: "USER" | "ADMIN";
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const isMobile = useMobile()
  // const [user, setUser] = useState<User | null>(null)
  const { isAuthenticated, user } = useAuthStore()
  
  // Use the browser extension fix hook
  useBrowserExtensionFix()


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#success-stories", label: "Success Stories" },
    { href: "#pricing", label: "Pricing" },
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          <span className="font-bold text-xl">Pup</span>
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-lg font-medium">
                      {link.label}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 mt-4">
                    {isAuthenticated ? (
                      <Button asChild variant="ghost">
                        <Link href="/">{user?.name}</Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <Link href="/login">Log in</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/signup">Sign up</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <ModeToggle />
              {isAuthenticated ? (
                <Button asChild variant="ghost">
                  <Link href="/">{user?.name}</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  )
}
