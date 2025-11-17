/**
 * Polygon Types
 * Types for polygon rendering and animations
 */

export type AnimationType = 'pulse' | 'rotate' | 'fade' | 'none';

export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  id: string;
  points: Point[];
  color: string;
  opacity: number;
  animation: AnimationType;
  animationSpeed: number;
}

export interface PolygonRenderOptions {
  width: number;
  height: number;
  timestamp: number;
}

/**
 * Backend API polygon format
 * Matches the backend API contract for polygon data
 */
export interface BackendPolygon {
  id: number | string;
  points: [number, number][] | Point[];
  color: string;
  opacity: number;
  animation: AnimationType;
  duration?: number;
  rotationCenter?: [number, number];
}
