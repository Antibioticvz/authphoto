import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from '../../challenge/challenge.service';
import { CacheService } from '../../shared/services/cache.service';
import { CryptoService } from '../../shared/services/crypto.service';
import { LoggerService } from '../../shared/services/logger.service';
import { CaptureService } from '../capture.service';

// Mock Multer File type
type MockFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

describe('CaptureService', () => {
  let service: CaptureService;
  let challengeService: ChallengeService;
  let cryptoService: CryptoService;

  const mockPhoto: MockFile = {
    buffer: Buffer.from('fake-image-data'),
    originalname: 'test.jpg',
    mimetype: 'image/jpeg',
    size: 1024,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaptureService,
        ChallengeService,
        CryptoService,
        CacheService,
        LoggerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'PHOTOS_DIR') return './test-photos';
              if (key === 'BASE_URL') return 'http://localhost:3000';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CaptureService>(CaptureService);
    challengeService = module.get<ChallengeService>(ChallengeService);
    cryptoService = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('capturePhoto', () => {
    it('should reject if challenge not found', async () => {
      const dto = {
        challengeId: 'non-existent',
        clientId: 'test',
        videoHash: 'hash123',
        message: 'test',
      };

      await expect(service.capturePhoto(mockPhoto, dto)).rejects.toThrow();
    });

    it('should accept valid challenge and photo', async () => {
      const challenge = challengeService.createChallenge('test-client');

      const dto = {
        challengeId: challenge.challengeId,
        clientId: 'test-client',
        videoHash: 'a'.repeat(64),
        message: 'Test photo',
      };

      const result = await service.capturePhoto(mockPhoto, dto);

      expect(result).toHaveProperty('photoId');
      expect(result).toHaveProperty('photoUrl');
      expect(result).toHaveProperty('verified');
      expect(result).toHaveProperty('timestamp');
    });

    it('should generate unique photoId', async () => {
      const challenge1 = challengeService.createChallenge('test');
      const challenge2 = challengeService.createChallenge('test');

      const result1 = await service.capturePhoto(mockPhoto, {
        challengeId: challenge1.challengeId,
        clientId: 'test',
        videoHash: 'a'.repeat(64),
      });

      const result2 = await service.capturePhoto(mockPhoto, {
        challengeId: challenge2.challengeId,
        clientId: 'test',
        videoHash: 'b'.repeat(64),
      });

      expect(result1.photoId).not.toBe(result2.photoId);
    });

    it('should include client message in response', async () => {
      const challenge = challengeService.createChallenge('test');

      const result = await service.capturePhoto(mockPhoto, {
        challengeId: challenge.challengeId,
        clientId: 'test',
        videoHash: 'a'.repeat(64),
        message: 'Car damage on left wing',
      });

      expect(result.message).toBe('Car damage on left wing');
    });

    it('should generate photoUrl', async () => {
      const challenge = challengeService.createChallenge('test');

      const result = await service.capturePhoto(mockPhoto, {
        challengeId: challenge.challengeId,
        clientId: 'test',
        videoHash: 'a'.repeat(64),
      });

      expect(result.photoUrl).toContain('http://');
      expect(result.photoUrl).toContain(result.photoId);
    });

    it('should set verified status', async () => {
      const challenge = challengeService.createChallenge('test');

      const result = await service.capturePhoto(mockPhoto, {
        challengeId: challenge.challengeId,
        clientId: 'test',
        videoHash: 'a'.repeat(64),
      });

      expect(typeof result.verified).toBe('boolean');
    });

    it('should include timestamp in ISO format', async () => {
      const challenge = challengeService.createChallenge('test');

      const result = await service.capturePhoto(mockPhoto, {
        challengeId: challenge.challengeId,
        clientId: 'test',
        videoHash: 'a'.repeat(64),
      });

      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should validate videoHash format', async () => {
      const challenge = challengeService.createChallenge('test');

      await expect(
        service.capturePhoto(mockPhoto, {
          challengeId: challenge.challengeId,
          clientId: 'test',
          videoHash: 'invalid-hash',
        }),
      ).rejects.toThrow();
    });

    it('should validate videoHash length (64 chars)', async () => {
      const challenge = challengeService.createChallenge('test');

      await expect(
        service.capturePhoto(mockPhoto, {
          challengeId: challenge.challengeId,
          clientId: 'test',
          videoHash: 'abc123',
        }),
      ).rejects.toThrow();
    });
  });

  describe('verifyVideoHash', () => {
    it('should verify SHA-256 hash format', () => {
      const validHash = 'a'.repeat(64);
      expect(() => service.verifyVideoHash(validHash)).not.toThrow();
    });

    it('should reject invalid hash format', () => {
      expect(() => service.verifyVideoHash('invalid')).toThrow();
    });

    it('should reject hash with wrong length', () => {
      expect(() => service.verifyVideoHash('abc123')).toThrow();
    });

    it('should reject hash with non-hex characters', () => {
      const invalidHash = 'g'.repeat(64);
      expect(() => service.verifyVideoHash(invalidHash)).toThrow();
    });
  });

  describe('generatePhotoId', () => {
    it('should generate photoId with prefix', () => {
      const photoId = service.generatePhotoId();
      expect(photoId).toMatch(/^photo_[a-f0-9]{16}$/);
    });

    it('should generate unique photoIds', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(service.generatePhotoId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('savePhotoMetadata', () => {
    it('should save metadata to disk', async () => {
      const metadata = {
        photoId: 'photo_test123',
        challengeId: 'challenge-123',
        clientId: 'test-client',
        message: 'Test',
        verified: true,
        videoHash: 'a'.repeat(64),
        timestamp: new Date().toISOString(),
        filePath: '/test/photo.jpg',
        photoUrl: 'http://test/photo.jpg',
        fileSize: 1024,
        mimeType: 'image/jpeg',
      };

      await expect(service.savePhotoMetadata(metadata)).resolves.not.toThrow();
    });
  });

  describe('getPhoto', () => {
    it('should retrieve photo metadata', async () => {
      // First capture a photo
      const challenge = challengeService.createChallenge('test');
      const captured = await service.capturePhoto(mockPhoto, {
        challengeId: challenge.challengeId,
        clientId: 'test',
        videoHash: 'a'.repeat(64),
        message: 'Test photo',
      });

      // Then retrieve it
      const retrieved = await service.getPhoto(captured.photoId);

      expect(retrieved).toBeDefined();
      expect(retrieved?.photoId).toBe(captured.photoId);
      expect(retrieved?.message).toBe('Test photo');
    });

    it('should return null for non-existent photo', async () => {
      const result = await service.getPhoto('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('validatePhotoFile', () => {
    it('should accept valid JPEG', () => {
      const file = {
        buffer: Buffer.from(''),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024 * 1024, // 1MB
      };

      expect(() => service.validatePhotoFile(file as unknown)).not.toThrow();
    });

    it('should accept valid PNG', () => {
      const file = {
        buffer: Buffer.from(''),
        originalname: 'test.png',
        mimetype: 'image/png',
        size: 1024 * 1024,
      };

      expect(() => service.validatePhotoFile(file as unknown)).not.toThrow();
    });

    it('should reject non-image files', () => {
      const file = {
        buffer: Buffer.from(''),
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
      };

      expect(() => service.validatePhotoFile(file as unknown)).toThrow();
    });

    it('should reject files over 10MB', () => {
      const file = {
        buffer: Buffer.from(''),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 11 * 1024 * 1024, // 11MB
      };

      expect(() => service.validatePhotoFile(file as unknown)).toThrow();
    });

    it('should reject empty files', () => {
      const file = {
        buffer: Buffer.from(''),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 0,
      };

      expect(() => service.validatePhotoFile(file as unknown)).toThrow();
    });
  });

  describe('integration', () => {
    it('should handle complete capture flow', async () => {
      // 1. Create challenge
      const challenge = challengeService.createChallenge('insurance-corp');

      // 2. Capture photo
      const result = await service.capturePhoto(mockPhoto, {
        challengeId: challenge.challengeId,
        clientId: 'insurance-corp',
        videoHash: cryptoService.generateHash('test-video-data'),
        message: 'Car damage photo',
      });

      // 3. Verify result
      expect(result.photoId).toBeDefined();
      expect(result.verified).toBeDefined();
      expect(result.clientId).toBe('insurance-corp');

      // 4. Retrieve photo
      const retrieved = await service.getPhoto(result.photoId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.photoId).toBe(result.photoId);
    });

    it('should delete challenge after successful capture', async () => {
      const challenge = challengeService.createChallenge('test');

      await service.capturePhoto(mockPhoto, {
        challengeId: challenge.challengeId,
        clientId: 'test',
        videoHash: 'a'.repeat(64),
      });

      // Challenge should be deleted
      const stillValid = challengeService.verifyChallenge(challenge.challengeId);
      expect(stillValid).toBe(false);
    });
  });

  describe('performance', () => {
    it('should process photo capture quickly', async () => {
      const challenge = challengeService.createChallenge('test');

      const start = Date.now();

      await service.capturePhoto(mockPhoto, {
        challengeId: challenge.challengeId,
        clientId: 'test',
        videoHash: 'a'.repeat(64),
      });

      const duration = Date.now() - start;

      expect(duration).toBeLessThan(500); // Should take less than 500ms
    });
  });
});
