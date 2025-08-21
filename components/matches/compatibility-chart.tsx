"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface Purpose {
  domain: string
  archetype: string
  modality: string
  anchor?: string
}

interface CompatibilityChartProps {
  userPurpose: Purpose
  matchPurpose: Purpose
}

export function CompatibilityChart({ userPurpose, matchPurpose }: CompatibilityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(var(--primary-rgb), 0.1)"
    ctx.fill()

    // Define the categories and their values
    const categories = [
      { name: "Domain", userValue: 1, matchValue: userPurpose.domain === matchPurpose.domain ? 1 : 0.5 },
      { name: "Archetype", userValue: 1, matchValue: userPurpose.archetype === matchPurpose.archetype ? 1 : 0.5 },
      { name: "Modality", userValue: 1, matchValue: userPurpose.modality === matchPurpose.modality ? 1 : 0.5 },
    ]

    const numCategories = categories.length
    const angleStep = (2 * Math.PI) / numCategories

    // Draw axes
    ctx.strokeStyle = "rgba(var(--muted-foreground-rgb), 0.3)"
    ctx.lineWidth = 1

    for (let i = 0; i < numCategories; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Draw category labels
      const labelX = centerX + (radius + 20) * Math.cos(angle)
      const labelY = centerY + (radius + 20) * Math.sin(angle)

      ctx.fillStyle = "var(--foreground)"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(categories[i].name, labelX, labelY)
    }

    // Draw user polygon
    drawPolygon(
      ctx,
      centerX,
      centerY,
      radius,
      categories.map((c) => c.userValue),
      angleStep,
      "rgba(var(--primary-rgb), 0.2)",
      "rgba(var(--primary-rgb), 0.8)",
    )

    // Draw match polygon
    drawPolygon(
      ctx,
      centerX,
      centerY,
      radius,
      categories.map((c) => c.matchValue),
      angleStep,
      "rgba(var(--secondary-rgb), 0.2)",
      "rgba(var(--secondary-rgb), 0.8)",
    )

    // Draw legend
    const legendY = height - 30

    // User legend
    ctx.fillStyle = "rgba(var(--primary-rgb), 0.8)"
    ctx.fillRect(20, legendY, 15, 15)
    ctx.fillStyle = "var(--foreground)"
    ctx.textAlign = "left"
    ctx.fillText("You", 45, legendY + 7.5)

    // Match legend
    ctx.fillStyle = "rgba(var(--secondary-rgb), 0.8)"
    ctx.fillRect(100, legendY, 15, 15)
    ctx.fillStyle = "var(--foreground)"
    ctx.fillText("Match", 125, legendY + 7.5)
  }, [userPurpose, matchPurpose])

  function drawPolygon(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    values: number[],
    angleStep: number,
    fillColor: string,
    strokeColor: string,
  ) {
    ctx.beginPath()

    for (let i = 0; i < values.length; i++) {
      const angle = i * angleStep - Math.PI / 2
      const value = values[i]
      const x = centerX + radius * value * Math.cos(angle)
      const y = centerY + radius * value * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()
    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 2
    ctx.stroke()
  }

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-4 text-center">Purpose Overlap</h4>
      <canvas ref={canvasRef} width={300} height={300} className="w-full h-auto" />
    </Card>
  )
}
