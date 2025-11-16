import { Module, Global } from '@nestjs/common';
import { CryptoService } from './services/crypto.service';
import { LoggerService } from './services/logger.service';
import { CacheService } from './services/cache.service';

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
