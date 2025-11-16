import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggerService } from './shared/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  logger.log(`🚀 Server is running on: http://localhost:${port}/api/v1`, 'Bootstrap');
  logger.log(`📋 Health check: http://localhost:${port}/api/v1/health`, 'Bootstrap');
}

bootstrap();
