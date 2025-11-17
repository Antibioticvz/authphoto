/**
 * useChallenge Hook
 * Hook for managing challenge requests and verification with auto-rotation
 */

import { useEffect, useRef, useState } from "react"
import { challengeService } from "../services"
import type { ChallengeResponse } from "../types"
import { normalizePolygon } from "../utils"

interface UseChallengeReturn {
  challenge: ChallengeResponse | null
  isLoading: boolean
  error: string | null
  timeRemaining: number
  isNearExpiry: boolean
  requestChallenge: (clientId: string) => Promise<void>
  clearChallenge: () => void
}

export function useChallenge(): UseChallengeReturn {
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isNearExpiry, setIsNearExpiry] = useState(false)

  const clientIdRef = useRef<string | null>(null)
  const nextChallengeRef = useRef<ChallengeResponse | null>(null)
  const rotationTimerRef = useRef<number | null>(null)
  const countdownTimerRef = useRef<number | null>(null)
  const preloadTimerRef = useRef<number | null>(null)

  const normalizeChallenge = (
    response: ChallengeResponse
  ): ChallengeResponse => {
    return {
      ...response,
      polygons: Array.isArray(response.polygons)
        ? response.polygons.map(p => normalizePolygon(p))
        : [],
      expiresAt:
        typeof response.expiresAt === "string"
          ? parseInt(response.expiresAt, 10)
          : response.expiresAt,
    }
  }

  const fetchChallenge = async (
    clientId: string,
    isPreload = false
  ): Promise<ChallengeResponse | null> => {
    if (!isPreload) {
      setIsLoading(true)
      setError(null)
    }

    try {
      const response = await challengeService.requestChallenge(clientId)
      const normalized = normalizeChallenge(response)

      if (isPreload) {
        console.log("🔄 Preloaded next challenge:", normalized.challengeId)
        nextChallengeRef.current = normalized
      } else {
        console.log("✅ Set current challenge:", normalized.challengeId)
        setChallenge(normalized)
        setupRotation(clientId, normalized)
      }

      return normalized
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to request challenge"
      if (!isPreload) {
        setError(errorMessage)
      }
      console.error("Challenge error:", err)
      return null
    } finally {
      if (!isPreload) {
        setIsLoading(false)
      }
    }
  }

  const setupRotation = (
    clientId: string,
    currentChallenge: ChallengeResponse
  ) => {
    // Clear existing timers
    if (rotationTimerRef.current) {
      clearTimeout(rotationTimerRef.current)
      rotationTimerRef.current = null
    }
    if (preloadTimerRef.current) {
      clearTimeout(preloadTimerRef.current)
      preloadTimerRef.current = null
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }

    const expiresAt =
      typeof currentChallenge.expiresAt === "string"
        ? parseInt(currentChallenge.expiresAt, 10)
        : currentChallenge.expiresAt
    const now = Date.now()
    const ttl = expiresAt - now

    if (ttl <= 0) {
      console.warn("⚠️ Challenge already expired, requesting new one")
      fetchChallenge(clientId, false)
      return
    }

    console.log(`⏰ Challenge TTL: ${Math.floor(ttl / 1000)}s`)

    // Set initial countdown
    setTimeRemaining(Math.floor(ttl / 1000))
    setIsNearExpiry(ttl <= 5000)

    // Preload next challenge 10 seconds before expiry (or immediately if less than 10s left)
    const preloadTime = Math.max(0, ttl - 10000)
    preloadTimerRef.current = window.setTimeout(() => {
      console.log("🔄 Preloading next challenge...")
      fetchChallenge(clientId, true)
    }, preloadTime)

    // Setup countdown timer (updates every second)
    countdownTimerRef.current = window.setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      setTimeRemaining(remaining)
      setIsNearExpiry(remaining <= 5)

      // Auto-rotate when countdown reaches 0
      if (remaining === 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current)
          countdownTimerRef.current = null
        }
      }
    }, 1000) as unknown as number

    // Rotate to next challenge when current expires
    rotationTimerRef.current = window.setTimeout(() => {
      console.log("🔄 Rotating to next challenge...")

      const preloadedChallenge = nextChallengeRef.current

      if (preloadedChallenge) {
        console.log(
          "✅ Using preloaded challenge:",
          preloadedChallenge.challengeId
        )
        setChallenge(preloadedChallenge)
        nextChallengeRef.current = null // Clear next challenge
        setupRotation(clientId, preloadedChallenge)

        // Immediately preload another next challenge
        setTimeout(() => fetchChallenge(clientId, true), 100)
      } else {
        console.warn("⚠️ No preloaded challenge, fetching synchronously")
        fetchChallenge(clientId, false)
      }
    }, ttl)
  }

  const requestChallenge = async (clientId: string) => {
    clientIdRef.current = clientId
    await fetchChallenge(clientId, false)
  }

  const clearChallenge = () => {
    setChallenge(null)
    nextChallengeRef.current = null
    setError(null)
    setTimeRemaining(0)
    setIsNearExpiry(false)

    if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current)
    if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current)
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
  }

  useEffect(() => {
    return () => {
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current)
      if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current)
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
    }
  }, [])

  return {
    challenge,
    isLoading,
    error,
    timeRemaining,
    isNearExpiry,
    requestChallenge,
    clearChallenge,
  }
}
