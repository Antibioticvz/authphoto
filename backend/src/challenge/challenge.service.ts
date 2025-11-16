import { Injectable } from '@nestjs/common';
import { CryptoService } from '../shared/services/crypto.service';
import { CacheService } from '../shared/services/cache.service';
import { LoggerService } from '../shared/services/logger.service';
import { Challenge, Polygon } from './entities/polygon.entity';
import { ChallengeResponseDto } from './dto/challenge-response.dto';

/**
 * Service for generating and managing cryptographic challenges
 * Uses polygon overlays for photo verification
 */
@Injectable()
export class ChallengeService {
  private readonly CACHE_PREFIX = 'challenge:';

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly cacheService: CacheService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('ChallengeService');
  }

  /**
   * Creates a new cryptographic challenge with random polygons
   * @param clientId - Client identifier
   * @param polygonCount - Number of polygons to generate (default: 7)
   * @param ttlSeconds - Time to live in seconds (default: 30)
   * @returns Challenge response DTO
   */
  createChallenge(
    clientId: string,
    polygonCount: number = 7,
    ttlSeconds: number = 30,
  ): ChallengeResponseDto {
    const challengeId = this.cryptoService.generateUUID();
    const nonce = this.cryptoService.generateNonce(32);
    const polygons = this.generatePolygons(polygonCount);
    const createdAt = Date.now();
    const expiresAt = createdAt + ttlSeconds * 1000;

    const challenge: Challenge = {
      challengeId,
      nonce,
      polygons,
      expiresAt,
      clientId,
      createdAt,
    };

    // Store in cache with TTL + grace period (10 seconds)
    this.cacheService.set(this.getCacheKey(challengeId), challenge, ttlSeconds + 10);

    this.loggerService.log(`Challenge created: ${challengeId} for client: ${clientId}`);

    return {
      challengeId,
      nonce,
      polygons,
      expiresAt,
      ttl: ttlSeconds,
    };
  }

  /**
   * Verifies if a challenge exists and is not expired
   * @param challengeId - Challenge identifier
   * @returns True if challenge is valid
   */
  verifyChallenge(challengeId: string): boolean {
    const challenge = this.getChallenge(challengeId);

    if (!challenge) {
      return false;
    }

    // Check if expired
    if (Date.now() > challenge.expiresAt) {
      this.deleteChallenge(challengeId);
      return false;
    }

    return true;
  }

  /**
   * Retrieves a challenge from cache
   * @param challengeId - Challenge identifier
   * @returns Challenge or null if not found/expired
   */
  getChallenge(challengeId: string): Challenge | null {
    const challenge = this.cacheService.get<Challenge>(this.getCacheKey(challengeId));

    if (!challenge) {
      return null;
    }

    // Double-check expiration
    if (Date.now() > challenge.expiresAt) {
      this.deleteChallenge(challengeId);
      return null;
    }

    return challenge;
  }

  /**
   * Deletes a challenge from cache
   * @param challengeId - Challenge identifier
   * @returns True if challenge was deleted
   */
  deleteChallenge(challengeId: string): boolean {
    const deleted = this.cacheService.delete(this.getCacheKey(challengeId));

    if (deleted) {
      this.loggerService.log(`Challenge deleted: ${challengeId}`);
    }

    return deleted;
  }

  /**
   * Generates random polygons for challenge
   * @param count - Number of polygons to generate
   * @returns Array of polygons
   */
  private generatePolygons(count: number): Polygon[] {
    const polygons: Polygon[] = [];
    const animations: Polygon['animation'][] = ['pulse', 'rotate', 'fade', 'none'];
    const colors = [
      '#FF5733',
      '#33FF57',
      '#3357FF',
      '#FF33F5',
      '#F5FF33',
      '#33FFF5',
      '#FF8C33',
      '#8C33FF',
    ];

    for (let i = 0; i < count; i++) {
      const shapeType = this.getRandomInt(0, 3); // 0: triangle, 1: square, 2: pentagon, 3: hexagon
      const pointCount = shapeType + 3;

      const polygon: Polygon = {
        id: i,
        points: this.generatePolygonPoints(pointCount),
        color: colors[this.getRandomInt(0, colors.length - 1)],
        opacity: this.getRandomFloat(0.4, 0.8),
        animation: animations[this.getRandomInt(0, animations.length - 1)],
        duration: this.getRandomInt(1000, 3000),
      };

      // Add rotation center for rotate animation
      if (polygon.animation === 'rotate') {
        const center = this.calculatePolygonCenter(polygon.points);
        polygon.rotationCenter = center;
      }

      polygons.push(polygon);
    }

    return polygons;
  }

  /**
   * Generates random points for a polygon
   * Ensures points don't overlap too much with existing polygons
   * @param pointCount - Number of points to generate
   * @returns Array of coordinate pairs
   */
  private generatePolygonPoints(pointCount: number): [number, number][] {
    // Generate center point
    const centerX = this.getRandomFloat(0.15, 0.85);
    const centerY = this.getRandomFloat(0.15, 0.85);

    // Generate radius
    const radius = this.getRandomFloat(0.08, 0.15);

    const points: [number, number][] = [];

    for (let i = 0; i < pointCount; i++) {
      const angle = (i / pointCount) * 2 * Math.PI;
      // Add some randomness to make irregular polygons
      const r = radius * this.getRandomFloat(0.8, 1.2);

      const x = Math.max(0, Math.min(1, centerX + r * Math.cos(angle)));
      const y = Math.max(0, Math.min(1, centerY + r * Math.sin(angle)));

      points.push([this.roundToDecimal(x, 3), this.roundToDecimal(y, 3)]);
    }

    return points;
  }

  /**
   * Calculates the center point of a polygon
   * @param points - Array of coordinate pairs
   * @returns Center point [x, y]
   */
  private calculatePolygonCenter(points: [number, number][]): [number, number] {
    const sumX = points.reduce((sum, [x]) => sum + x, 0);
    const sumY = points.reduce((sum, [, y]) => sum + y, 0);

    return [
      this.roundToDecimal(sumX / points.length, 3),
      this.roundToDecimal(sumY / points.length, 3),
    ];
  }

  /**
   * Generates random integer between min and max (inclusive)
   */
  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generates random float between min and max
   */
  private getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Rounds number to specified decimal places
   */
  private roundToDecimal(value: number, decimals: number): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Gets cache key for challenge
   */
  private getCacheKey(challengeId: string): string {
    return `${this.CACHE_PREFIX}${challengeId}`;
  }
}
