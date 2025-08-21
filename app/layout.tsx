import { GoogleAuthProvider } from "@/components/auth/google-auth-provider"
import { LoadingProvider } from "@/components/loading-provider"
import { ThemeGradientBackground } from "@/components/theme-gradient-background"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { QueryProvider } from "@/lib/providers/query-provider"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

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
        {/* <ErrorBoundary> */}
          <LoadingProvider>
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
          </LoadingProvider>
        {/* </ErrorBoundary> */}
      </body>
    </html>
  )
}
