/**
 * Challenge Service
 * API methods for challenge generation and verification
 */

import type { ChallengeResponse, ChallengeVerifyResponse } from "../types"
import { apiClient } from "./api"

export class ChallengeService {
  /**
   * Request a new challenge
   * @param clientId - Client identifier
   * @returns Challenge data with polygons
   */
  async requestChallenge(clientId: string): Promise<ChallengeResponse> {
    const response = await apiClient.get<{
      status: string
      data: ChallengeResponse
      timestamp: string
    }>("/api/v1/challenge", {
      params: { clientId },
    })
    console.log("🔍 Challenge Service - Raw API Response:", response.data)
    // Backend wraps response in { status, data, timestamp }, extract the actual data
    const challengeData = response.data.data || response.data
    console.log(
      "🔍 Challenge Service - Extracted challenge data:",
      challengeData
    )
    return challengeData
  }

  /**
   * Verify a challenge
   * @param challengeId - Challenge ID to verify
   * @returns Challenge verification status
   */
  async verifyChallenge(challengeId: string): Promise<ChallengeVerifyResponse> {
    const response = await apiClient.get<ChallengeVerifyResponse>(
      "/api/v1/challenge/verify",
      {
        params: { challengeId },
      }
    )
    return response.data
  }
}

export const challengeService = new ChallengeService()
