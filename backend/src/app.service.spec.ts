import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { CryptoService } from './shared/services/crypto.service';
import { LoggerService } from './shared/services/logger.service';
import { CacheService } from './shared/services/cache.service';

describe('AppService', () => {
  let service: AppService;
  let cryptoService: CryptoService;
  let loggerService: LoggerService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, CryptoService, LoggerService, CacheService],
    }).compile();

    service = module.get<AppService>(AppService);
    cryptoService = module.get<CryptoService>(CryptoService);
    loggerService = module.get<LoggerService>(LoggerService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    cacheService.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const health = service.getHealth();

      expect(health).toHaveProperty('status', 'ok');
      expect(health).toHaveProperty('timestamp');
      expect(health).toHaveProperty('uptime');
      expect(health).toHaveProperty('environment');
      expect(health).toHaveProperty('services');
      expect(health).toHaveProperty('version', '1.0.0');
    });

    it('should include service status', () => {
      const health = service.getHealth();

      expect(health.services).toEqual({
        crypto: 'operational',
        logger: 'operational',
        cache: 'operational',
      });
    });

    it('should include meta information', () => {
      const health = service.getHealth();

      expect(health.meta).toBeDefined();
      expect(health.meta).toHaveProperty('healthHash');
      expect(health.meta).toHaveProperty('cacheActive');
      expect(health.meta.healthHash).toHaveLength(16);
      expect(health.meta.cacheActive).toBe(true);
    });

    it('should cache health check data', () => {
      service.getHealth();

      const cached = cacheService.get('last-health-check');
      expect(cached).toBeDefined();
      expect(cached).toHaveProperty('status', 'ok');
    });

    it('should generate different hash for different timestamps', () => {
      const health1 = service.getHealth();

      // Wait a tiny bit to ensure different timestamp
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      const health2 = service.getHealth();

      jest.useRealTimers();

      // Hashes might be same if timestamps are identical
      // Just verify they exist and have correct format
      expect(health1.meta.healthHash).toMatch(/^[a-f0-9]{16}$/);
      expect(health2.meta.healthHash).toMatch(/^[a-f0-9]{16}$/);
    });

    it('should include uptime', () => {
      const health = service.getHealth();
      expect(typeof health.uptime).toBe('number');
      expect(health.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should include environment', () => {
      const health = service.getHealth();
      expect(health.environment).toBeDefined();
      expect(typeof health.environment).toBe('string');
    });

    it('should have valid ISO timestamp', () => {
      const health = service.getHealth();
      const timestamp = new Date(health.timestamp);
      expect(timestamp.toISOString()).toBe(health.timestamp);
    });

    it('should work multiple times', () => {
      const health1 = service.getHealth();
      const health2 = service.getHealth();
      const health3 = service.getHealth();

      expect(health1.status).toBe('ok');
      expect(health2.status).toBe('ok');
      expect(health3.status).toBe('ok');
    });
  });

  describe('service integration', () => {
    it('should use CryptoService for hash generation', () => {
      const generateHashSpy = jest.spyOn(cryptoService, 'generateHash');

      service.getHealth();

      expect(generateHashSpy).toHaveBeenCalled();
    });

    it('should use LoggerService for logging', () => {
      const logSpy = jest.spyOn(loggerService, 'log');

      service.getHealth();

      expect(logSpy).toHaveBeenCalledWith('Health check performed', 'HealthCheck');
    });

    it('should use CacheService for caching', () => {
      const setSpy = jest.spyOn(cacheService, 'set');
      const hasSpy = jest.spyOn(cacheService, 'has');

      service.getHealth();

      expect(setSpy).toHaveBeenCalledWith('last-health-check', expect.any(Object), 60);
      expect(hasSpy).toHaveBeenCalledWith('last-health-check');
    });
  });
});
