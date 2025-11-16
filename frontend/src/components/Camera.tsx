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
  const [hasVideo, setHasVideo] = useState(false);

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
      setHasVideo(true);
    };
    
    const handleLoadedMetadata = () => {
      console.log('Camera: Video metadata loaded', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      });
      setHasVideo(true);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Check initial state (use requestAnimationFrame to avoid synchronous setState)
    requestAnimationFrame(() => {
      if (!video.paused && !video.ended && video.readyState > 2) {
        console.log('Camera: Video is already playing');
        setIsPlaying(true);
        setHasVideo(true);
      }

      // Check if video has dimensions (indicates it's loaded)
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        console.log('Camera: Video dimensions detected');
        setHasVideo(true);
      }
    });

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef]);

  const showLoading = !isPlaying || !hasVideo;

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
          display: 'block', // Prevent inline spacing issues
        }}
      />
      {showLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: '16px',
            gap: '10px',
          }}
        >
          <div>📹 Starting camera...</div>
          <div style={{ fontSize: '12px', color: '#ccc' }}>
            {!hasVideo && 'Loading video...'}
            {hasVideo && !isPlaying && 'Preparing playback...'}
          </div>
        </div>
      )}
    </div>
  );
};
