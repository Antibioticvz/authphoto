/**
 * PolygonLinesOverlay Component
 * Canvas overlay for rendering animated neon polygon lines for demonstration
 */

import React, { useRef, useEffect } from "react"
import type { Polygon } from "../types"
import { drawPolygonOutline } from "../utils"

interface PolygonLinesOverlayProps {
  polygons: Polygon[]
  width: number
  height: number
  visible: boolean
  className?: string
}

export const PolygonLinesOverlay: React.FC<PolygonLinesOverlayProps> = ({
  polygons,
  width,
  height,
  visible,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!visible) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = undefined
      }
      
      // Clear canvas when hidden
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, width, height)
        }
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    startTimeRef.current = Date.now()

    // Animation loop with sine wave effect
    const animate = () => {
      if (!startTimeRef.current) return
      const elapsed = Date.now() - startTimeRef.current

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Calculate sine wave intensity (0.5 second period = 500ms)
      const t = elapsed % 500 // 0-500ms cycle
      const glowIntensity = Math.sin((2 * Math.PI * t) / 500)

      // Draw all polygon outlines with animated glow
      polygons?.forEach(polygon => {
        drawPolygonOutline(ctx, polygon, width, height, glowIntensity)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [polygons, width, height, visible])

  if (!visible) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  )
}
