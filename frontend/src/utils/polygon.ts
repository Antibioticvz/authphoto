/**
 * Polygon Utilities
 * Functions for polygon rendering on canvas
 */

import type { Polygon, Point } from '../types';

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
  if (polygon.points.length < 3) return;

  ctx.save();
  ctx.beginPath();
  
  // Convert normalized coordinates (0-1) to pixel coordinates
  polygon.points.forEach((point, index) => {
    const x = point.x * width;
    const y = point.y * height;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.closePath();
  
  // Parse color and apply opacity
  ctx.fillStyle = polygon.color;
  ctx.globalAlpha = polygon.opacity;
  ctx.fill();
  
  ctx.restore();
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
  if (polygon.points.length < 3) return;

  ctx.save();
  
  // Convert normalized coordinates to pixel coordinates
  const pixelPoints = polygon.points.map(point => ({
    x: point.x * width,
    y: point.y * height,
  }));
  
  // Parse the color and create neon version
  const neonColor = getNeonColor(polygon.color);
  
  // Apply sine wave animation to opacity (0.6 to 1.0 for better visibility)
  const animatedOpacity = 0.6 + 0.4 * Math.abs(glowIntensity);
  
  // Draw outer glow (multiple layers for smooth effect)
  const glowLayers = [
    { width: 15, alpha: 0.2 },
    { width: 10, alpha: 0.3 },
    { width: 6, alpha: 0.5 },
  ];
  
  glowLayers.forEach(layer => {
    ctx.beginPath();
    pixelPoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = layer.width;
    ctx.globalAlpha = layer.alpha * animatedOpacity;
    ctx.shadowBlur = layer.width * 3;
    ctx.shadowColor = neonColor;
    ctx.stroke();
  });
  
  // Draw main line (brightest and thicker)
  ctx.beginPath();
  pixelPoints.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.closePath();
  
  ctx.strokeStyle = neonColor;
  ctx.lineWidth = 4;
  ctx.globalAlpha = 1.0;  // Full opacity for main line
  ctx.shadowBlur = 20;
  ctx.shadowColor = neonColor;
  ctx.stroke();
  
  ctx.restore();
}

/**
 * Convert regular color to neon version
 * @param color - Original color string
 * @returns Neon version of the color
 */
function getNeonColor(color: string): string {
  // Map of common colors to neon equivalents (very bright colors)
  const neonMap: Record<string, string> = {
    'red': '#FF0080',
    'green': '#00FF41',
    'blue': '#00D9FF',
    'yellow': '#FFFF00',
    'purple': '#BF00FF',
    'orange': '#FF6600',
    'pink': '#FF10F0',
    'cyan': '#00FFFF',
    'white': '#FFFFFF',
    'magenta': '#FF00FF',
  };
  
  // Check if color is in the map (case-insensitive)
  const lowerColor = color.toLowerCase();
  if (neonMap[lowerColor]) {
    return neonMap[lowerColor];
  }
  
  // If color starts with #, check if it contains rgb/rgba
  if (color.startsWith('#')) {
    return color;
  }
  
  // Parse rgb/rgba format
  if (color.includes('rgb')) {
    // Extract RGB values and make them brighter
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = Math.min(255, parseInt(match[0]) * 1.5);
      const g = Math.min(255, parseInt(match[1]) * 1.5);
      const b = Math.min(255, parseInt(match[2]) * 1.5);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  
  // Default to bright cyan neon
  return '#00FFFF';
}

/**
 * Normalize point coordinates from pixel to 0-1 range
 * @param point - Point in pixel coordinates
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Normalized point
 */
export function normalizePoint(point: Point, width: number, height: number): Point {
  return {
    x: point.x / width,
    y: point.y / height,
  };
}

/**
 * Denormalize point coordinates from 0-1 range to pixels
 * @param point - Normalized point
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Point in pixel coordinates
 */
export function denormalizePoint(point: Point, width: number, height: number): Point {
  return {
    x: point.x * width,
    y: point.y * height,
  };
}
