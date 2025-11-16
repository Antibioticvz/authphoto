/**
 * Challenge Service
 * API methods for challenge generation and verification
 */

import { apiClient } from './api';
import type { ChallengeResponse, ChallengeVerifyResponse } from '../types';

export class ChallengeService {
  /**
   * Request a new challenge
   * @param clientId - Client identifier
   * @returns Challenge data with polygons
   */
  async requestChallenge(clientId: string): Promise<ChallengeResponse> {
    const response = await apiClient.get<ChallengeResponse>('/api/v1/challenge', {
      params: { clientId },
    });
    return response.data;
  }

  /**
   * Verify a challenge
   * @param challengeId - Challenge ID to verify
   * @returns Challenge verification status
   */
  async verifyChallenge(challengeId: string): Promise<ChallengeVerifyResponse> {
    const response = await apiClient.get<ChallengeVerifyResponse>(
      '/api/v1/challenge/verify',
      {
        params: { challengeId },
      }
    );
    return response.data;
  }
}

export const challengeService = new ChallengeService();
