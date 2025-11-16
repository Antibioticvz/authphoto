import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from '../challenge.service';
import { CryptoService } from '../../shared/services/crypto.service';
import { CacheService } from '../../shared/services/cache.service';
import { LoggerService } from '../../shared/services/logger.service';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let cryptoService: CryptoService;
  let cacheService: CacheService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallengeService, CryptoService, CacheService, LoggerService],
    }).compile();

    service = module.get<ChallengeService>(ChallengeService);
    cryptoService = module.get<CryptoService>(CryptoService);
    cacheService = module.get<CacheService>(CacheService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    cacheService.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createChallenge', () => {
    it('should create a challenge with default polygon count', () => {
      const challenge = service.createChallenge('test-client');

      expect(challenge).toHaveProperty('challengeId');
      expect(challenge).toHaveProperty('nonce');
      expect(challenge).toHaveProperty('polygons');
      expect(challenge).toHaveProperty('expiresAt');
      expect(challenge).toHaveProperty('ttl');
    });

    it('should generate valid UUID for challengeId', () => {
      const challenge = service.createChallenge('test-client');

      expect(challenge.challengeId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    });

    it('should generate 7 polygons by default', () => {
      const challenge = service.createChallenge('test-client');

      expect(challenge.polygons).toHaveLength(7);
    });

    it('should respect custom polygon count', () => {
      const challenge = service.createChallenge('test-client', 5);

      expect(challenge.polygons).toHaveLength(5);
    });

    it('should generate polygons with valid structure', () => {
      const challenge = service.createChallenge('test-client');

      challenge.polygons.forEach((polygon) => {
        expect(polygon).toHaveProperty('id');
        expect(polygon).toHaveProperty('points');
        expect(polygon).toHaveProperty('color');
        expect(polygon).toHaveProperty('opacity');
        expect(polygon).toHaveProperty('animation');
        expect(polygon).toHaveProperty('duration');
      });
    });

    it('should generate polygons with valid coordinates', () => {
      const challenge = service.createChallenge('test-client');

      challenge.polygons.forEach((polygon) => {
        expect(Array.isArray(polygon.points)).toBe(true);
        expect(polygon.points.length).toBeGreaterThanOrEqual(3);

        polygon.points.forEach(([x, y]) => {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(1);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should generate polygons with valid colors', () => {
      const challenge = service.createChallenge('test-client');

      challenge.polygons.forEach((polygon) => {
        expect(polygon.color).toMatch(/^#[0-9A-F]{6}$/);
      });
    });

    it('should generate polygons with opacity between 0 and 1', () => {
      const challenge = service.createChallenge('test-client');

      challenge.polygons.forEach((polygon) => {
        expect(polygon.opacity).toBeGreaterThan(0);
        expect(polygon.opacity).toBeLessThanOrEqual(1);
      });
    });

    it('should generate polygons with valid animations', () => {
      const challenge = service.createChallenge('test-client');
      const validAnimations = ['pulse', 'rotate', 'fade', 'none'];

      challenge.polygons.forEach((polygon) => {
        expect(validAnimations).toContain(polygon.animation);
      });
    });

    it('should set expiration time correctly (default 30s)', () => {
      const beforeCreate = Date.now();
      const challenge = service.createChallenge('test-client');
      const afterCreate = Date.now();

      const expectedExpiry = beforeCreate + 30000;
      expect(challenge.expiresAt).toBeGreaterThanOrEqual(expectedExpiry);
      expect(challenge.expiresAt).toBeLessThanOrEqual(afterCreate + 30000);
    });

    it('should respect custom TTL', () => {
      const beforeCreate = Date.now();
      const challenge = service.createChallenge('test-client', 7, 60);
      const afterCreate = Date.now();

      const expectedExpiry = beforeCreate + 60000;
      expect(challenge.expiresAt).toBeGreaterThanOrEqual(expectedExpiry);
      expect(challenge.expiresAt).toBeLessThanOrEqual(afterCreate + 60000);
    });

    it('should store challenge in cache', () => {
      const challenge = service.createChallenge('test-client');

      const cached = cacheService.get(`challenge:${challenge.challengeId}`);
      expect(cached).toBeDefined();
      expect(cached).toHaveProperty('nonce', challenge.nonce);
    });

    it('should generate unique challengeIds', () => {
      const challenge1 = service.createChallenge('test-client');
      const challenge2 = service.createChallenge('test-client');

      expect(challenge1.challengeId).not.toBe(challenge2.challengeId);
    });

    it('should generate unique nonces', () => {
      const challenge1 = service.createChallenge('test-client');
      const challenge2 = service.createChallenge('test-client');

      expect(challenge1.nonce).not.toBe(challenge2.nonce);
    });

    it('should generate different polygon configurations each time', () => {
      const challenge1 = service.createChallenge('test-client');
      const challenge2 = service.createChallenge('test-client');

      const polygons1JSON = JSON.stringify(challenge1.polygons);
      const polygons2JSON = JSON.stringify(challenge2.polygons);

      expect(polygons1JSON).not.toBe(polygons2JSON);
    });
  });

  describe('verifyChallenge', () => {
    it('should verify valid challenge', () => {
      const challenge = service.createChallenge('test-client');

      const isValid = service.verifyChallenge(challenge.challengeId);

      expect(isValid).toBe(true);
    });

    it('should reject non-existent challenge', () => {
      const isValid = service.verifyChallenge('non-existent-id');

      expect(isValid).toBe(false);
    });

    it('should reject expired challenge', async () => {
      const challenge = service.createChallenge('test-client', 7, 1);

      await new Promise((resolve) => setTimeout(resolve, 1100));

      const isValid = service.verifyChallenge(challenge.challengeId);

      expect(isValid).toBe(false);
    });

    it('should return challenge data if valid', () => {
      const challenge = service.createChallenge('test-client');

      const result = service.getChallenge(challenge.challengeId);

      expect(result).toBeDefined();
      expect(result?.challengeId).toBe(challenge.challengeId);
      expect(result?.nonce).toBe(challenge.nonce);
    });

    it('should return null for invalid challenge', () => {
      const result = service.getChallenge('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('deleteChallenge', () => {
    it('should delete challenge from cache', () => {
      const challenge = service.createChallenge('test-client');

      expect(cacheService.has(`challenge:${challenge.challengeId}`)).toBe(true);

      service.deleteChallenge(challenge.challengeId);

      expect(cacheService.has(`challenge:${challenge.challengeId}`)).toBe(false);
    });

    it('should return true if challenge existed', () => {
      const challenge = service.createChallenge('test-client');

      const deleted = service.deleteChallenge(challenge.challengeId);

      expect(deleted).toBe(true);
    });

    it('should return false if challenge did not exist', () => {
      const deleted = service.deleteChallenge('non-existent-id');

      expect(deleted).toBe(false);
    });
  });

  describe('polygon generation algorithms', () => {
    it('should generate different polygon shapes', () => {
      const challenge = service.createChallenge('test-client', 10);

      const pointCounts = challenge.polygons.map((p) => p.points.length);
      const uniquePointCounts = new Set(pointCounts);

      // Should have some variety in polygon shapes (triangles, squares, etc)
      expect(uniquePointCounts.size).toBeGreaterThan(1);
    });

    it('should not generate overlapping polygons excessively', () => {
      const challenge = service.createChallenge('test-client', 10);

      // Simple overlap check: centers should be reasonably distributed
      const centers = challenge.polygons.map((p) => {
        const sumX = p.points.reduce((sum, [x]) => sum + x, 0);
        const sumY = p.points.reduce((sum, [, y]) => sum + y, 0);
        return [sumX / p.points.length, sumY / p.points.length];
      });

      // Check that not all polygons are in the same small area
      const centerDistances = [];
      for (let i = 0; i < centers.length; i++) {
        for (let j = i + 1; j < centers.length; j++) {
          const [x1, y1] = centers[i];
          const [x2, y2] = centers[j];
          const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          centerDistances.push(distance);
        }
      }

      const avgDistance = centerDistances.reduce((a, b) => a + b, 0) / centerDistances.length;

      // Average distance should be reasonable (not all clustered)
      expect(avgDistance).toBeGreaterThan(0.1);
    });
  });

  describe('performance', () => {
    it('should generate challenge quickly', () => {
      const start = Date.now();

      service.createChallenge('test-client');

      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100); // Should take less than 100ms
    });

    it('should handle multiple concurrent challenge creations', () => {
      const challenges = [];

      for (let i = 0; i < 10; i++) {
        challenges.push(service.createChallenge(`client-${i}`));
      }

      expect(challenges).toHaveLength(10);

      // All should be unique
      const ids = challenges.map((c) => c.challengeId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });
  });
});
