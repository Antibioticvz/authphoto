import { ValidationPipe } from '@nestjs/common';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { NestFactory } from '@nestjs/core';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggerService } from './shared/services/logger.service';

interface HttpsConfigResult {
  httpsOptions?: HttpsOptions;
  reason?: string;
}

function loadHttpsConfig(): HttpsConfigResult {
  const httpsEnv = process.env.HTTPS_ENABLED?.toLowerCase();

  if (httpsEnv === 'false') {
    return {
      reason: 'HTTPS explicitly disabled via HTTPS_ENABLED env flag.',
    };
  }

  const defaultKeyPath = resolve(__dirname, '..', '.cert', 'key.pem');
  const defaultCertPath = resolve(__dirname, '..', '.cert', 'cert.pem');

  const keyPath = process.env.HTTPS_KEY_PATH || defaultKeyPath;
  const certPath = process.env.HTTPS_CERT_PATH || defaultCertPath;

  const hasKey = existsSync(keyPath);
  const hasCert = existsSync(certPath);
  const hasCertificates = hasKey && hasCert;

  const shouldUseHttps = httpsEnv === 'true' || hasCertificates;

  if (!shouldUseHttps) {
    return {
      reason: 'HTTPS certificates not found in backend/.cert. Falling back to HTTP.',
    };
  }

  if (!hasCertificates) {
    throw new Error(
      `HTTPS is enabled but certificates were not found. Expected files at:\n- key: ${keyPath}\n- cert: ${certPath}`,
    );
  }

  return {
    httpsOptions: {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    },
  };
}

async function bootstrap() {
  const { httpsOptions, reason: httpsReason } = loadHttpsConfig();
  const app = await NestFactory.create(AppModule, httpsOptions ? { httpsOptions } : {});
  const logger = app.get(LoggerService);

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  const allowedOrigins = [
    'http://localhost:5173',
    'https://localhost:5173',
    'http://192.168.100.4:5173',
    'https://192.168.100.4:5173',
  ];

  if (process.env.CORS_ORIGIN) {
    allowedOrigins.push(process.env.CORS_ORIGIN);
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Listen on all network interfaces

  const protocol = httpsOptions ? 'https' : 'http';
  logger.log(`🚀 Server is running on: ${protocol}://localhost:${port}/api/v1`, 'Bootstrap');
  logger.log(`📋 Health check: ${protocol}://localhost:${port}/api/v1/health`, 'Bootstrap');

  if (httpsOptions) {
    logger.log('🔐 HTTPS enabled for API responses.', 'Bootstrap');
  } else if (httpsReason) {
    logger.warn(httpsReason, 'Bootstrap');
  }
}

bootstrap();
