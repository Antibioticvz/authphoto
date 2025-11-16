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
