import { Global, Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { CryptoService } from './services/crypto.service';
import { LoggerService } from './services/logger.service';

/**
 * SharedModule provides globally available services for the application.
 * Services include: CryptoService, LoggerService, CacheService
 */
@Global()
@Module({
  providers: [CryptoService, LoggerService, CacheService],
  exports: [CryptoService, LoggerService, CacheService],
})
export class SharedModule {}
