/**
 * useCamera Hook
 * Hook for managing WebRTC camera access
 */

import { useState, useEffect, useRef } from "react"

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  stream: MediaStream | null
  error: string | null
  isLoading: boolean
  startCamera: () => Promise<void>
  stopCamera: () => void
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startCamera = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Camera API not supported. Please use HTTPS or localhost."
        )
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream

        // Wait for the video to be ready and play it
        try {
          // Wait for metadata
          await new Promise<void>((resolve, reject) => {
            if (!videoRef.current) {
              reject(new Error("Video element not found"))
              return
            }

            const video = videoRef.current

            const onLoadedMetadata = () => {
              video.removeEventListener("loadedmetadata", onLoadedMetadata)
              video.removeEventListener("error", onError)
              resolve()
            }

            const onError = (e: Event) => {
              video.removeEventListener("loadedmetadata", onLoadedMetadata)
              video.removeEventListener("error", onError)
              console.error("Video element error:", e)
              reject(new Error("Failed to load video metadata"))
            }

            // If already loaded, resolve immediately
            if (video.readyState >= 1) {
              resolve()
              return
            }

            video.addEventListener("loadedmetadata", onLoadedMetadata)
            video.addEventListener("error", onError)
          })

          // Now play the video
          if (videoRef.current) {
            await videoRef.current.play()
            console.log("Camera started successfully")
          }
        } catch (playError) {
          console.error("Failed to play video:", playError)
          throw new Error("Failed to start video playback")
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to access camera"
      setError(errorMessage)
      console.error("Camera error:", err)
      
      // Clean up stream on error
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    videoRef,
    stream,
    error,
    isLoading,
    startCamera,
    stopCamera,
  }
}
