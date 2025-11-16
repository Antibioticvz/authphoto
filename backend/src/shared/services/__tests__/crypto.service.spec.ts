import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from '../crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateHash', () => {
    it('should generate a 64-character hex string', () => {
      const hash = service.generateHash('test');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate consistent hashes for the same input', () => {
      const hash1 = service.generateHash('test');
      const hash2 = service.generateHash('test');
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = service.generateHash('test1');
      const hash2 = service.generateHash('test2');
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty strings', () => {
      const hash = service.generateHash('');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('generateUUID', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = service.generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = service.generateUUID();
      const uuid2 = service.generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate 100 unique UUIDs', () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(service.generateUUID());
      }
      expect(uuids.size).toBe(100);
    });
  });

  describe('generateNonce', () => {
    it('should generate a nonce with default length (32 bytes = 64 hex chars)', () => {
      const nonce = service.generateNonce();
      expect(nonce).toHaveLength(64);
      expect(nonce).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate a nonce with custom length', () => {
      const nonce = service.generateNonce(16);
      expect(nonce).toHaveLength(32); // 16 bytes = 32 hex chars
      expect(nonce).toMatch(/^[a-f0-9]{32}$/);
    });

    it('should generate unique nonces', () => {
      const nonce1 = service.generateNonce();
      const nonce2 = service.generateNonce();
      expect(nonce1).not.toBe(nonce2);
    });

    it('should generate 100 unique nonces', () => {
      const nonces = new Set();
      for (let i = 0; i < 100; i++) {
        nonces.add(service.generateNonce());
      }
      expect(nonces.size).toBe(100);
    });
  });

  describe('verifyHash', () => {
    it('should return true for matching hash', () => {
      const data = 'test data';
      const hash = service.generateHash(data);
      expect(service.verifyHash(data, hash)).toBe(true);
    });

    it('should return false for non-matching hash', () => {
      const data = 'test data';
      const wrongHash = service.generateHash('wrong data');
      expect(service.verifyHash(data, wrongHash)).toBe(false);
    });

    it('should return false for invalid hash format', () => {
      const data = 'test data';
      expect(service.verifyHash(data, 'invalid-hash')).toBe(false);
    });
  });
});
