import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoService } from './shared/services/crypto.service';
import { LoggerService } from './shared/services/logger.service';
import { CacheService } from './shared/services/cache.service';

describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, CryptoService, LoggerService, CacheService],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const result = controller.getHealth();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
    });

    it('should call appService.getHealth', () => {
      const getHealthSpy = jest.spyOn(appService, 'getHealth');

      controller.getHealth();

      expect(getHealthSpy).toHaveBeenCalled();
    });

    it('should return result from appService', () => {
      const mockHealth = {
        status: 'ok',
        timestamp: '2025-11-16T00:00:00.000Z',
        uptime: 123,
        environment: 'test',
        services: {
          crypto: 'operational',
          logger: 'operational',
          cache: 'operational',
        },
        version: '1.0.0',
        meta: {
          healthHash: 'abcd1234',
          cacheActive: true,
        },
      };

      jest.spyOn(appService, 'getHealth').mockReturnValue(mockHealth);

      const result = controller.getHealth();

      expect(result).toEqual(mockHealth);
    });
  });
});
