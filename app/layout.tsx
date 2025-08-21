import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeGradientBackground } from "@/components/theme-gradient-background"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/lib/providers/query-provider"
import { GoogleAuthProvider } from "@/components/auth/google-auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Pup - Find someone who shares your purpose",
  description: "A purpose-first marriage bureau that connects people based on shared values and life missions.",
  generator: 'alidev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`} >
        <QueryProvider>
          <GoogleAuthProvider>
            <ThemeProvider defaultTheme="system">
              <ThemeGradientBackground>
                {children}
                <Toaster />
              </ThemeGradientBackground>
            </ThemeProvider>
          </GoogleAuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
