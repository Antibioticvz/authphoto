/**
 * Camera Component
 * WebRTC camera preview component
 */

import React from 'react';

interface CameraProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  width?: number;
  height?: number;
  className?: string;
}

export const Camera: React.FC<CameraProps> = ({
  videoRef,
  width = 640,
  height = 480,
  className = '',
}) => {
  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      autoPlay
      playsInline
      muted
      className={className}
      style={{
        transform: 'scaleX(-1)', // Mirror video
        objectFit: 'cover',
      }}
    />
  );
};
