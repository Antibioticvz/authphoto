import { Injectable } from '@nestjs/common';
import { CacheService } from './shared/services/cache.service';
import { CryptoService } from './shared/services/crypto.service';
import { LoggerService } from './shared/services/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly loggerService: LoggerService,
    private readonly cacheService: CacheService,
  ) {
    this.loggerService.setContext('AppService');
  }

  getHealth() {
    const timestamp = new Date().toISOString();
    const healthData = {
      status: 'ok',
      timestamp,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        crypto: 'operational',
        logger: 'operational',
        cache: 'operational',
      },
      version: '1.0.0',
    };

    // Log health check
    this.loggerService.log('Health check performed', 'HealthCheck');

    // Test crypto service
    const healthHash = this.cryptoService.generateHash(timestamp);

    // Cache the health check
    this.cacheService.set('last-health-check', healthData, 60);

    return {
      ...healthData,
      meta: {
        healthHash: healthHash.substring(0, 16), // First 16 chars for security
        cacheActive: this.cacheService.has('last-health-check'),
      },
    };
  }
}
