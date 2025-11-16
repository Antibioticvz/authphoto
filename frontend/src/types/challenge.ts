/**
 * Challenge Types
 * Types for challenge API responses
 */

import type { Polygon } from "./polygon"

export interface ChallengeResponse {
  challengeId: string
  nonce: string
  expiresAt: number | string
  polygons: Polygon[]
  ttl?: number
}

export interface ChallengeVerifyResponse {
  valid: boolean
  challengeId: string
  expiresAt: string
  used: boolean
}
