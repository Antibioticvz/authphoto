/**
 * Capture Types
 * Types for photo capture API
 */

export interface CaptureRequest {
  photo: Blob;
  challengeId: string;
  videoHash: string;
  message?: string;
}

export interface CaptureResponse {
  photoId: string;
  photoUrl: string;
  verified: boolean;
  timestamp: string;
  message?: string;
}

export interface PhotoMetadata {
  photoId: string;
  challengeId: string;
  timestamp: string;
  message?: string;
  videoHash: string;
  verified: boolean;
}
