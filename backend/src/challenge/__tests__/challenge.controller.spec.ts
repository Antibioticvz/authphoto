import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeController } from '../challenge.controller';
import { ChallengeService } from '../challenge.service';
import { CryptoService } from '../../shared/services/crypto.service';
import { CacheService } from '../../shared/services/cache.service';
import { LoggerService } from '../../shared/services/logger.service';
import { HttpException } from '@nestjs/common';

describe('ChallengeController', () => {
  let controller: ChallengeController;
  let service: ChallengeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengeController],
      providers: [ChallengeService, CryptoService, CacheService, LoggerService],
    }).compile();

    controller = module.get<ChallengeController>(ChallengeController);
    service = module.get<ChallengeService>(ChallengeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createChallenge', () => {
    it('should create a challenge with valid clientId', () => {
      const result = controller.createChallenge({
        clientId: 'test-client',
      });

      expect(result).toHaveProperty('challengeId');
      expect(result).toHaveProperty('nonce');
      expect(result).toHaveProperty('polygons');
      expect(result).toHaveProperty('expiresAt');
      expect(result).toHaveProperty('ttl');
    });

    it('should throw error if clientId is missing', () => {
      expect(() => {
        controller.createChallenge({
          clientId: '',
        });
      }).toThrow(HttpException);
    });

    it('should respect custom polygon count', () => {
      const result = controller.createChallenge({
        clientId: 'test-client',
        polygonCount: 5,
      });

      expect(result.polygons).toHaveLength(5);
    });

    it('should respect custom TTL', () => {
      const result = controller.createChallenge({
        clientId: 'test-client',
        ttlSeconds: 60,
      });

      expect(result.ttl).toBe(60);
    });

    it('should call service.createChallenge', () => {
      const spy = jest.spyOn(service, 'createChallenge');

      controller.createChallenge({
        clientId: 'test-client',
      });

      expect(spy).toHaveBeenCalledWith('test-client', undefined, undefined);
    });
  });

  describe('verifyChallenge', () => {
    it('should verify valid challenge', () => {
      const challenge = service.createChallenge('test-client');

      const result = controller.verifyChallenge(challenge.challengeId);

      expect(result).toEqual({ valid: true });
    });

    it('should return false for invalid challenge', () => {
      const result = controller.verifyChallenge('invalid-id');

      expect(result).toHaveProperty('valid', false);
      expect(result).toHaveProperty('message');
    });

    it('should throw error if challengeId is missing', () => {
      expect(() => {
        controller.verifyChallenge('');
      }).toThrow(HttpException);
    });

    it('should call service.verifyChallenge', () => {
      const spy = jest.spyOn(service, 'verifyChallenge');

      controller.verifyChallenge('test-id');

      expect(spy).toHaveBeenCalledWith('test-id');
    });
  });
});
