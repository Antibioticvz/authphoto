/**
 * Challenge Types
 * Types for challenge API responses
 */

import type { Polygon } from './polygon';

export interface ChallengeResponse {
  challengeId: string;
  nonce: string;
  expiresAt: string;
  polygons: Polygon[];
}

export interface ChallengeVerifyResponse {
  valid: boolean;
  challengeId: string;
  expiresAt: string;
  used: boolean;
}
