/**
 * Polygon entity representing a geometric shape overlay
 * for challenge verification
 */
export interface Polygon {
  /** Unique identifier for the polygon */
  id: number;

  /** Array of [x, y] coordinate pairs (normalized 0-1) */
  points: [number, number][];

  /** Hex color code */
  color: string;

  /** Opacity (0-1) */
  opacity: number;

  /** Animation type */
  animation: 'pulse' | 'rotate' | 'fade' | 'none';

  /** Animation duration in milliseconds */
  duration: number;

  /** Rotation center point for rotate animation [x, y] */
  rotationCenter?: [number, number];
}

/**
 * Challenge entity containing verification data
 */
export interface Challenge {
  /** Unique challenge identifier (UUID) */
  challengeId: string;

  /** Cryptographic nonce for verification */
  nonce: string;

  /** Array of polygons to render */
  polygons: Polygon[];

  /** Challenge expiration timestamp (Unix milliseconds) */
  expiresAt: number;

  /** Client identifier */
  clientId: string;

  /** Creation timestamp (Unix milliseconds) */
  createdAt: number;
}
