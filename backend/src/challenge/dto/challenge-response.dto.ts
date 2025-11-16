import { Polygon } from '../entities/polygon.entity';

/**
 * Response DTO for challenge generation
 */
export class ChallengeResponseDto {
  challengeId!: string;
  nonce!: string;
  polygons!: Polygon[];
  expiresAt!: number;
  ttl!: number;
}
