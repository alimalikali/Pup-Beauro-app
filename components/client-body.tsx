"use client"

import { useEffect, useState } from "react"

interface ClientBodyProps {
  children: React.ReactNode
  className?: string
}

export function ClientBody({ children, className = "" }: ClientBodyProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only render children on the client side to avoid hydration mismatches
  if (!isClient) {
    return <div className={className} style={{ visibility: "hidden" }} />
  }

  return <div className={className}>{children}</div>
}
