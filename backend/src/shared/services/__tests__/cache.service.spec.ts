import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    service.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      service.set('key', 'value');
      expect(service.get('key')).toBe('value');
    });

    it('should store and retrieve objects', () => {
      const obj = { name: 'test', value: 123 };
      service.set('key', obj);
      expect(service.get('key')).toEqual(obj);
    });

    it('should return null for non-existent keys', () => {
      expect(service.get('non-existent')).toBeNull();
    });

    it('should overwrite existing keys', () => {
      service.set('key', 'value1');
      service.set('key', 'value2');
      expect(service.get('key')).toBe('value2');
    });
  });

  describe('TTL expiration', () => {
    it('should expire entries after TTL', async () => {
      service.set('key', 'value', 0.1); // 100ms TTL
      expect(service.get('key')).toBe('value');

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(service.get('key')).toBeNull();
    });

    it('should not expire before TTL', async () => {
      service.set('key', 'value', 1); // 1 second TTL
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(service.get('key')).toBe('value');
    });

    it('should use default TTL of 30 seconds', () => {
      service.set('key', 'value'); // default TTL
      expect(service.get('key')).toBe('value');
    });
  });

  describe('delete', () => {
    it('should delete an existing key', () => {
      service.set('key', 'value');
      expect(service.delete('key')).toBe(true);
      expect(service.get('key')).toBeNull();
    });

    it('should return false for non-existent keys', () => {
      expect(service.delete('non-existent')).toBe(false);
    });
  });

  describe('has', () => {
    it('should return true for existing non-expired keys', () => {
      service.set('key', 'value');
      expect(service.has('key')).toBe(true);
    });

    it('should return false for non-existent keys', () => {
      expect(service.has('non-existent')).toBe(false);
    });

    it('should return false for expired keys', async () => {
      service.set('key', 'value', 0.1); // 100ms TTL
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(service.has('key')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.clear();
      expect(service.get('key1')).toBeNull();
      expect(service.get('key2')).toBeNull();
      expect(service.size()).toBe(0);
    });
  });

  describe('size', () => {
    it('should return 0 for empty cache', () => {
      expect(service.size()).toBe(0);
    });

    it('should return correct count', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      expect(service.size()).toBe(2);
    });

    it('should include expired entries', async () => {
      service.set('key1', 'value1', 0.1);
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(service.size()).toBe(1); // expired entry still counted
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', async () => {
      service.set('key1', 'value1', 0.1); // expires
      service.set('key2', 'value2', 10); // doesn't expire
      
      await new Promise((resolve) => setTimeout(resolve, 150));
      const removed = service.cleanup();
      
      expect(removed).toBe(1);
      expect(service.size()).toBe(1);
      expect(service.get('key1')).toBeNull();
      expect(service.get('key2')).toBe('value2');
    });

    it('should return 0 when no expired entries', () => {
      service.set('key', 'value', 10);
      expect(service.cleanup()).toBe(0);
    });

    it('should work with empty cache', () => {
      expect(service.cleanup()).toBe(0);
    });
  });
});
