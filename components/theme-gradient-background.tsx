"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ThemeGradientBackgroundProps {
  children: React.ReactNode
}

export function ThemeGradientBackground({ children }: ThemeGradientBackgroundProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Handle mouse movement for interactive gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-screen">
      {/* Gradient background */}
      <div
        className="fixed inset-0 -z-10 transition-opacity duration-1000"
        style={{
          background:
            theme === "dark"
              ? `radial-gradient(circle at ${mousePosition.x * 100}% ${
                  mousePosition.y * 100
                }%, rgba(var(--primary-rgb), 0.15) 0%, rgba(20, 20, 30, 0.2) 40%, transparent 70%),
                 linear-gradient(to bottom right, rgba(30, 30, 40, 0.8), rgba(15, 15, 25, 1))`
              : `radial-gradient(circle at ${mousePosition.x * 100}% ${
                  mousePosition.y * 100
                }%, rgba(var(--primary-rgb), 0.08) 0%, rgba(245, 245, 255, 0.1) 40%, transparent 70%),
                 linear-gradient(to bottom right, rgba(250, 250, 255, 0.8), rgba(255, 255, 255, 1))`,
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="fixed top-1/4 left-1/3 w-64 h-64 rounded-full opacity-20 blur-3xl -z-10"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 20,
          ease: "easeInOut",
        }}
        style={{
          background: theme === "dark" ? "rgba(var(--primary-rgb), 0.2)" : "rgba(var(--primary-rgb), 0.1)",
        }}
      />

      <motion.div
        className="fixed bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl -z-10"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 25,
          ease: "easeInOut",
        }}
        style={{
          background: theme === "dark" ? "rgba(100, 100, 150, 0.2)" : "rgba(100, 100, 150, 0.1)",
        }}
      />

      {children}
    </div>
  )
}
