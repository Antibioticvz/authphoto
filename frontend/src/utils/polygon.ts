/**
 * Polygon Utilities
 * Functions for polygon rendering on canvas
 */

import type { Point, Polygon, BackendPolygon } from "../types"

/**
 * Validate if a value is a valid Point object
 * @param value - Value to validate
 * @returns true if valid Point object
 */
function isValidPoint(value: unknown): value is Point {
  return (
    typeof value === "object" &&
    value !== null &&
    "x" in value &&
    "y" in value &&
    typeof (value as Point).x === "number" &&
    typeof (value as Point).y === "number"
  )
}

/**
 * Validate if a value is a valid point tuple [x, y]
 * @param value - Value to validate
 * @returns true if valid tuple
 */
function isValidPointTuple(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  )
}

/**
 * Validate backend polygon data structure
 * @param data - Data to validate
 * @returns true if data matches BackendPolygon interface
 */
function isValidBackendPolygon(data: unknown): data is BackendPolygon {
  if (typeof data !== "object" || data === null) {
    return false
  }

  const polygon = data as Record<string, unknown>

  // Validate required fields
  if (
    (typeof polygon.id !== "number" && typeof polygon.id !== "string") ||
    !Array.isArray(polygon.points) ||
    typeof polygon.color !== "string" ||
    typeof polygon.opacity !== "number" ||
    typeof polygon.animation !== "string"
  ) {
    return false
  }

  // Validate animation type
  const validAnimations = ["pulse", "rotate", "fade", "none"]
  if (!validAnimations.includes(polygon.animation as string)) {
    return false
  }

  // Validate points array - each point must be either a tuple or Point object
  if (
    !polygon.points.every(
      (point: unknown) => isValidPointTuple(point) || isValidPoint(point)
    )
  ) {
    return false
  }

  // Validate optional fields if present
  if (
    polygon.duration !== undefined &&
    typeof polygon.duration !== "number"
  ) {
    return false
  }

  if (
    polygon.rotationCenter !== undefined &&
    !isValidPointTuple(polygon.rotationCenter)
  ) {
    return false
  }

  return true
}

/**
 * Convert backend polygon format (with tuple points) to frontend format (with Point objects)
 * @param backendPolygon - Polygon from backend API with [x, y] tuple points
 * @returns Normalized Polygon with Point objects
 * @throws Error if backend polygon data is invalid
 */
export function normalizePolygon(backendPolygon: unknown): Polygon {
  // Validate the input data
  if (!isValidBackendPolygon(backendPolygon)) {
    console.error("Invalid backend polygon data:", backendPolygon)
    throw new Error(
      "Invalid polygon data received from backend. Data does not match expected format."
    )
  }

  // Convert points to Point objects with validation
  const points = backendPolygon.points.map((point, index) => {
    if (isValidPointTuple(point)) {
      return { x: point[0], y: point[1] }
    } else if (isValidPoint(point)) {
      return point
    } else {
      // This should never happen due to validation above, but handle gracefully
      console.error(`Invalid point at index ${index}:`, point)
      throw new Error(
        `Invalid point data at index ${index}. Expected [x, y] tuple or {x, y} object.`
      )
    }
  })

  return {
    id: String(backendPolygon.id),
    points,
    color: backendPolygon.color,
    opacity: backendPolygon.opacity,
    animation: backendPolygon.animation,
    animationSpeed: backendPolygon.duration ? 1000 / backendPolygon.duration : 1,
  }
}

/**
 * Draw a polygon on canvas
 * @param ctx - Canvas 2D context
 * @param polygon - Polygon to draw
 * @param width - Canvas width
 * @param height - Canvas height
 */
export function drawPolygon(
  ctx: CanvasRenderingContext2D,
  polygon: Polygon,
  width: number,
  height: number
): void {
  if (polygon.points.length < 3) return

  ctx.save()
  ctx.beginPath()

  // Convert normalized coordinates (0-1) to pixel coordinates
  polygon.points.forEach((point, index) => {
    const x = point.x * width
    const y = point.y * height

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.closePath()

  // Parse color and apply opacity
  ctx.fillStyle = polygon.color
  ctx.globalAlpha = polygon.opacity
  ctx.fill()

  ctx.restore()
}

/**
 * Draw polygon outline with neon glow effect
 * @param ctx - Canvas 2D context
 * @param polygon - Polygon to draw
 * @param width - Canvas width
 * @param height - Canvas height
 * @param glowIntensity - Intensity of glow effect (0-1)
 */
export function drawPolygonOutline(
  ctx: CanvasRenderingContext2D,
  polygon: Polygon,
  width: number,
  height: number,
  glowIntensity: number = 1.0
): void {
  if (polygon.points.length < 3) {
    console.warn("drawPolygonOutline: Not enough points", polygon.points.length)
    return
  }

  ctx.save()

  // Convert normalized coordinates to pixel coordinates
  const pixelPoints = polygon.points.map(point => ({
    x: point.x * width,
    y: point.y * height,
  }))

  // Debug logging for first polygon
  if (String(polygon.id) === "0") {
    console.log("🎨 drawPolygonOutline - First polygon:", {
      polygonId: polygon.id,
      pointCount: polygon.points.length,
      firstPoint: polygon.points[0],
      firstPixelPoint: pixelPoints[0],
      color: polygon.color,
      width,
      height,
    })
  }

  // Parse the color and create neon version
  const neonColor = getNeonColor(polygon.color)

  // Apply sine wave animation to opacity (0.6 to 1.0 for better visibility)
  const animatedOpacity = 0.6 + 0.4 * Math.abs(glowIntensity)

  // Draw outer glow (multiple layers for smooth effect)
  const glowLayers = [
    { width: 15, alpha: 0.2 },
    { width: 10, alpha: 0.3 },
    { width: 6, alpha: 0.5 },
  ]

  glowLayers.forEach(layer => {
    ctx.beginPath()
    pixelPoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.closePath()

    ctx.strokeStyle = neonColor
    ctx.lineWidth = layer.width
    ctx.globalAlpha = layer.alpha * animatedOpacity
    ctx.shadowBlur = layer.width * 3
    ctx.shadowColor = neonColor
    ctx.stroke()
  })

  // Draw main line (brightest and thicker)
  ctx.beginPath()
  pixelPoints.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  })
  ctx.closePath()

  ctx.strokeStyle = neonColor
  ctx.lineWidth = 4
  ctx.globalAlpha = 1.0 // Full opacity for main line
  ctx.shadowBlur = 20
  ctx.shadowColor = neonColor
  ctx.stroke()

  ctx.restore()
}

/**
 * Convert regular color to neon version
 * @param color - Original color string
 * @returns Neon version of the color
 */
function getNeonColor(color: string): string {
  // Map of common colors to neon equivalents (very bright colors)
  const neonMap: Record<string, string> = {
    red: "#FF0080",
    green: "#00FF41",
    blue: "#00D9FF",
    yellow: "#FFFF00",
    purple: "#BF00FF",
    orange: "#FF6600",
    pink: "#FF10F0",
    cyan: "#00FFFF",
    white: "#FFFFFF",
    magenta: "#FF00FF",
  }

  // Check if color is in the map (case-insensitive)
  const lowerColor = color.toLowerCase()
  if (neonMap[lowerColor]) {
    return neonMap[lowerColor]
  }

  // If color is already in hex format, use it as-is
  if (color.startsWith("#")) {
    return color
  }

  // Parse rgb/rgba format
  if (color.includes("rgb")) {
    // Extract RGB values and make them brighter
    const match = color.match(/\d+/g)
    if (match && match.length >= 3) {
      const r = Math.min(255, parseInt(match[0]) * 1.5)
      const g = Math.min(255, parseInt(match[1]) * 1.5)
      const b = Math.min(255, parseInt(match[2]) * 1.5)
      return `rgb(${r}, ${g}, ${b})`
    }
  }

  // Default to bright cyan neon
  return "#00FFFF"
}

/**
 * Normalize point coordinates from pixel to 0-1 range
 * @param point - Point in pixel coordinates
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Normalized point
 */
export function normalizePoint(
  point: Point,
  width: number,
  height: number
): Point {
  return {
    x: point.x / width,
    y: point.y / height,
  }
}

/**
 * Denormalize point coordinates from 0-1 range to pixels
 * @param point - Normalized point
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Point in pixel coordinates
 */
export function denormalizePoint(
  point: Point,
  width: number,
  height: number
): Point {
  return {
    x: point.x * width,
    y: point.y * height,
  }
}
