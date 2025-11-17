/**
 * useChallenge Hook
 * Hook for managing challenge requests and verification
 */

import { useState } from "react"
import { challengeService } from "../services"
import type { ChallengeResponse } from "../types"
import { normalizePolygon } from "../utils"

interface UseChallengeReturn {
  challenge: ChallengeResponse | null
  isLoading: boolean
  error: string | null
  requestChallenge: (clientId: string) => Promise<void>
  clearChallenge: () => void
}

export function useChallenge(): UseChallengeReturn {
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestChallenge = async (clientId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await challengeService.requestChallenge(clientId)

      console.log("🔍 useChallenge - Response from service:", response)

      // Normalize response: ensure polygons is array and expiresAt is a number
      const normalizedResponse: ChallengeResponse = {
        ...response,
        polygons: Array.isArray(response.polygons)
          ? response.polygons.map(p => normalizePolygon(p))
          : [],
        expiresAt:
          typeof response.expiresAt === "string"
            ? parseInt(response.expiresAt, 10)
            : response.expiresAt,
      }

      console.log("🔍 useChallenge - Normalized response:", normalizedResponse)
      console.log(
        "🔍 useChallenge - First polygon points:",
        normalizedResponse.polygons[0]?.points
      )

      if (!Array.isArray(response.polygons)) {
        console.warn(
          "Challenge response missing polygons array. Defaulting to empty list."
        )
      }

      setChallenge(normalizedResponse)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to request challenge"
      setError(errorMessage)
      console.error("Challenge error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChallenge = () => {
    setChallenge(null)
    setError(null)
  }

  return {
    challenge,
    isLoading,
    error,
    requestChallenge,
    clearChallenge,
  }
}
