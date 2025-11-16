/**
 * Animation Utilities
 * Functions for animating polygons
 */

import type { Polygon, AnimationType } from '../types';

/**
 * Apply animation to polygon based on elapsed time
 * @param polygon - Polygon to animate
 * @param elapsedMs - Elapsed time in milliseconds
 * @returns Animated polygon (modified opacity)
 */
export function applyAnimation(polygon: Polygon, elapsedMs: number): Polygon {
  const animated = { ...polygon };
  
  switch (polygon.animation) {
    case 'pulse':
      animated.opacity = applyPulseAnimation(
        polygon.opacity,
        elapsedMs,
        polygon.animationSpeed
      );
      break;
    
    case 'fade':
      animated.opacity = applyFadeAnimation(
        polygon.opacity,
        elapsedMs,
        polygon.animationSpeed
      );
      break;
    
    case 'rotate':
      // For rotate, we could modify points, but for simplicity
      // we'll just pulse the opacity as well
      animated.opacity = applyPulseAnimation(
        polygon.opacity,
        elapsedMs,
        polygon.animationSpeed
      );
      break;
    
    case 'none':
    default:
      // No animation
      break;
  }
  
  return animated;
}

/**
 * Pulse animation: oscillate opacity
 * @param baseOpacity - Base opacity value
 * @param elapsedMs - Elapsed time in milliseconds
 * @param speed - Animation speed multiplier
 * @returns Animated opacity value
 */
function applyPulseAnimation(
  baseOpacity: number,
  elapsedMs: number,
  speed: number
): number {
  const cycle = Math.sin((elapsedMs / 1000) * speed * Math.PI);
  const variation = cycle * 0.3; // ±30% opacity variation
  return Math.max(0.1, Math.min(1.0, baseOpacity + variation));
}

/**
 * Fade animation: gradually fade in and out
 * @param baseOpacity - Base opacity value
 * @param elapsedMs - Elapsed time in milliseconds
 * @param speed - Animation speed multiplier
 * @returns Animated opacity value
 */
function applyFadeAnimation(
  _baseOpacity: number,
  elapsedMs: number,
  speed: number
): number {
  const cycle = (Math.sin((elapsedMs / 1000) * speed * Math.PI) + 1) / 2;
  return Math.max(0.1, Math.min(1.0, cycle));
}

/**
 * Get animation types for debugging
 * @returns Array of animation type names
 */
export function getAnimationTypes(): AnimationType[] {
  return ['pulse', 'rotate', 'fade', 'none'];
}
