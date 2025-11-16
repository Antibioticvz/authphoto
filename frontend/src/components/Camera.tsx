/**
 * Camera Component
 * WebRTC camera preview component
 */

import React, { useEffect, useState } from 'react';

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
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      console.log('Camera: Video started playing');
      setIsPlaying(true);
    };
    const handlePause = () => {
      console.log('Camera: Video paused');
      setIsPlaying(false);
    };
    const handleLoadedData = () => {
      console.log('Camera: Video data loaded');
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadeddata', handleLoadedData);

    // Check if already playing
    if (!video.paused && !video.ended && video.readyState > 2) {
      console.log('Camera: Video is already playing');
      setIsPlaying(true);
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoRef]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
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
          backgroundColor: '#000',
        }}
      />
      {!isPlaying && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: '16px',
          }}
        >
          📹 Starting camera...
        </div>
      )}
    </div>
  );
};
