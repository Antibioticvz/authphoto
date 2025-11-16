/**
 * useCapture Hook
 * Hook for managing photo capture and upload
 */

import { useState } from "react"
import { captureService } from "../services"
import type { CaptureResponse } from "../types"

interface UseCaptureReturn {
  result: CaptureResponse | null
  isLoading: boolean
  error: string | null
  capturePhoto: (
    photo: Blob,
    challengeId: string,
    clientId: string,
    videoHash: string,
    message?: string
  ) => Promise<void>
  clearResult: () => void
}

export function useCapture(): UseCaptureReturn {
  const [result, setResult] = useState<CaptureResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const capturePhoto = async (
    photo: Blob,
    challengeId: string,
    clientId: string,
    videoHash: string,
    message?: string
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await captureService.capturePhoto(
        photo,
        challengeId,
        clientId,
        videoHash,
        message
      )
      setResult(response)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to capture photo"
      setError(errorMessage)
      console.error("Capture error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const clearResult = () => {
    setResult(null)
    setError(null)
  }

  return {
    result,
    isLoading,
    error,
    capturePhoto,
    clearResult,
  }
}
