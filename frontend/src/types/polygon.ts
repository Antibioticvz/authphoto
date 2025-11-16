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
