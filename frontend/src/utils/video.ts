/**
 * Video Utilities
 * Functions for video recording and capture
 */

/**
 * Record video from canvas stream
 * @param canvas - Canvas element to record
 * @param durationMs - Duration in milliseconds
 * @returns Promise resolving to video blob
 */
export async function recordCanvasVideo(
  canvas: HTMLCanvasElement,
  durationMs: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const stream = canvas.captureStream(30); // 30 FPS
    
    let mimeType = 'video/webm';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/mp4';
    }
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 2500000,
    });
    
    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };
    
    mediaRecorder.onerror = (error) => {
      reject(error);
    };
    
    mediaRecorder.start();
    
    setTimeout(() => {
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    }, durationMs);
  });
}

/**
 * Capture still image from video element
 * @param video - Video element
 * @param width - Desired width
 * @param height - Desired height
 * @returns Promise resolving to image blob
 */
export async function captureVideoFrame(
  video: HTMLVideoElement,
  width: number,
  height: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }
    
    ctx.drawImage(video, 0, 0, width, height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Capture still image from canvas
 * @param canvas - Canvas element
 * @returns Promise resolving to image blob
 */
export async function captureCanvasFrame(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Convert blob to base64 string
 * @param blob - Blob to convert
 * @returns Promise resolving to base64 string
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
