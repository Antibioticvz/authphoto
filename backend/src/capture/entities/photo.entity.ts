/**
 * Photo metadata entity
 */
export interface PhotoMetadata {
  /** Unique photo identifier */
  photoId: string;

  /** Challenge ID used for verification */
  challengeId: string;

  /** Client identifier */
  clientId: string;

  /** User-provided message/description */
  message: string;

  /** Verification status */
  verified: boolean;

  /** Video hash from client */
  videoHash: string;

  /** Server-calculated video hash */
  expectedHash?: string;

  /** Verification timestamp */
  timestamp: string;

  /** Photo file path on disk */
  filePath: string;

  /** Photo URL */
  photoUrl: string;

  /** File size in bytes */
  fileSize: number;

  /** Image dimensions */
  dimensions?: {
    width: number;
    height: number;
  };

  /** MIME type */
  mimeType: string;
}

/**
 * Verification result
 */
export interface VerificationResult {
  success: boolean;
  verified: boolean;
  message?: string;
  error?: string;
}
