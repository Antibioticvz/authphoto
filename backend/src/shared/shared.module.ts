import { Module } from '@nestjs/common';
import { CryptoService } from './services/crypto.service';
import { LoggerService } from './services/logger.service';
import { CacheService } from './services/cache.service';

@Module({
  providers: [CryptoService, LoggerService, CacheService],
  exports: [CryptoService, LoggerService, CacheService],
})
export class SharedModule {}
