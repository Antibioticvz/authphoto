/**
 * CanvasOverlay Component
 * Canvas overlay for rendering polygons over camera
 */

import React, { useRef, useEffect } from 'react';
import type { Polygon } from '../types';
import { drawPolygon, applyAnimation } from '../utils';

interface CanvasOverlayProps {
  polygons: Polygon[];
  width: number;
  height: number;
  className?: string;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const CanvasOverlay: React.FC<CanvasOverlayProps> = ({
  polygons,
  width,
  height,
  className = '',
  canvasRef: externalCanvasRef,
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    startTimeRef.current = Date.now();

    // Animation loop
    const animate = () => {
      if (!startTimeRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw all polygons with animations
      polygons.forEach(polygon => {
        const animatedPolygon = applyAnimation(polygon, elapsed);
        drawPolygon(ctx, animatedPolygon, width, height);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [polygons, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    />
  );
};
