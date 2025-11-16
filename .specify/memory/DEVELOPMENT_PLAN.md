# AuthPhoto — План разработки прототипа
## Лучшие практики, мобильная оптимизация, расширяемая архитектура

**Версия:** 1.0 (Детальный план)  
**Дата:** 16 ноября 2025  
**Приоритеты:** Быстрая разработка + мобильная оптимизация + расширяемость  
**Язык:** TypeScript, React, NestJS

---

## 📋 ОБЗОР ПЛАНА

### Цели
- ✅ **Скорость:** Прототип за 2-3 недели
- ✅ **Мобильность:** Отзывчивый дизайн (mobile-first)
- ✅ **Расширяемость:** Архитектура для легкого расширения
- ✅ **Качество:** Лучшие практики, паттерны проектирования

### Основные решения
| Аспект | Решение | Причина |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Быстрая разработка + HMR |
| **Styling** | Tailwind CSS + shadcn/ui | Готовые компоненты, mobile-first |
| **State Management** | Zustand | Минимальный боилерплейт |
| **Backend Framework** | NestJS | Enterprise-ready, scalable |
| **Package Manager** | pnpm | Быстрее npm, меньше дискового пространства |
| **Архитектура Frontend** | Feature-based + hooks + contexts | Легко расширяется |
| **Архитектура Backend** | Модульная с инъекцией зависимостей | DI паттерн |
| **CSS Architecture** | BEM + Tailwind | Согласованность + скорость |
| **API Design** | REST с версионированием | Стандартно, легко расширяется |

---

## 🏗️ АРХИТЕКТУРА И ПАТТЕРНЫ ПРОЕКТИРОВАНИЯ

### Фронтенд: Feature-based архитектура

```
src/
├── features/
│   ├── camera/                    ← Feature: камера
│   │   ├── components/
│   │   │   ├── CameraCapture.tsx
│   │   │   ├── PolygonOverlay.tsx
│   │   │   └── CameraPreview.tsx
│   │   ├── hooks/
│   │   │   ├── useCamera.ts       ← Custom hook
│   │   │   ├── useChallengePolygons.ts
│   │   │   └── useVideoCapture.ts
│   │   ├── services/
│   │   │   ├── cameraService.ts   ← Бизнес-логика
│   │   │   └── polygonDrawer.ts
│   │   ├── types/
│   │   │   └── camera.types.ts    ← TypeScript типы
│   │   └── store/
│   │       └── cameraStore.ts     ← Zustand store
│   │
│   ├── verification/               ← Feature: проверка
│   │   ├── components/
│   │   │   ├── ResultScreen.tsx
│   │   │   └── VerificationStatus.tsx
│   │   ├── hooks/
│   │   │   └── usePhotoVerification.ts
│   │   ├── types/
│   │   │   └── verification.types.ts
│   │   └── store/
│   │       └── verificationStore.ts
│   │
│   └── auth/
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── services/
│       │   └── authService.ts
│       └── types/
│           └── auth.types.ts
│
├── shared/                         ← Переиспользуемое
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── Button.types.ts
│   │   ├── Card/
│   │   ├── Spinner/
│   │   └── Modal/
│   ├── hooks/
│   │   ├── useMediaQuery.ts        ← Responsive
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── services/
│   │   ├── api.ts                  ← Axios instance
│   │   ├── crypto.ts               ← Криптография
│   │   └── logger.ts               ← Логирование
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── types/
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   └── styles/
│       ├── globals.css
│       ├── tailwind.config.ts
│       └── variables.css
│
├── layouts/
│   ├── MainLayout.tsx
│   └── CameraLayout.tsx
│
├── pages/
│   ├── HomePage.tsx
│   ├── CameraPage.tsx
│   └── ResultPage.tsx
│
├── App.tsx
├── main.tsx
└── .env.example
```

### Бэкенд: Модульная архитектура с DI

```
src/
├── main.ts                        ← Entry point
├── app.module.ts                  ← Root module
│
├── config/
│   ├── configuration.ts           ← Environment config
│   ├── database.config.ts
│   ├── crypto.config.ts
│   └── logger.config.ts
│
├── common/
│   ├── filters/
│   │   ├── http-exception.filter.ts
│   │   └── validation.filter.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   ├── transform.interceptor.ts
│   │   └── cache.interceptor.ts
│   ├── guards/
│   │   ├── api-key.guard.ts
│   │   └── rate-limit.guard.ts
│   ├── pipes/
│   │   ├── validation.pipe.ts
│   │   └── parse-id.pipe.ts
│   ├── decorators/
│   │   ├── api-response.decorator.ts
│   │   └── public.decorator.ts
│   └── types/
│       └── common.types.ts
│
├── shared/
│   ├── services/
│   │   ├── crypto.service.ts      ← SHA-256, ECDSA
│   │   ├── logger.service.ts
│   │   ├── cache.service.ts       ← Redis wrapper
│   │   └── file-storage.service.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   └── validators.ts
│   └── types/
│       └── shared.types.ts
│
├── modules/
│   │
│   ├── challenge/                 ← Challenge generation
│   │   ├── challenge.module.ts
│   │   ├── challenge.service.ts   ← Business logic
│   │   ├── challenge.controller.ts
│   │   ├── dto/
│   │   │   ├── create-challenge.dto.ts
│   │   │   └── challenge-response.dto.ts
│   │   ├── entities/
│   │   │   └── challenge.entity.ts
│   │   ├── types/
│   │   │   └── challenge.types.ts
│   │   └── __tests__/
│   │       ├── challenge.service.spec.ts
│   │       └── challenge.controller.spec.ts
│   │
│   ├── capture/                   ← Photo capture
│   │   ├── capture.module.ts
│   │   ├── capture.service.ts
│   │   ├── capture.controller.ts
│   │   ├── dto/
│   │   │   └── capture-photo.dto.ts
│   │   ├── entities/
│   │   │   └── photo.entity.ts
│   │   ├── types/
│   │   │   └── capture.types.ts
│   │   └── __tests__/
│   │       └── capture.service.spec.ts
│   │
│   ├── verification/              ← Photo verification
│   │   ├── verification.module.ts
│   │   ├── verification.service.ts
│   │   ├── verification.controller.ts
│   │   ├── types/
│   │   │   └── verification.types.ts
│   │   └── __tests__/
│   │       └── verification.service.spec.ts
│   │
│   ├── storage/                   ← File storage
│   │   ├── storage.module.ts
│   │   ├── storage.service.ts
│   │   ├── types/
│   │   │   └── storage.types.ts
│   │   └── __tests__/
│   │       └── storage.service.spec.ts
│   │
│   └── health/
│       ├── health.module.ts
│       ├── health.controller.ts
│       └── health.service.ts
│
├── photos/                        ← Photo storage (runtime)
│   └── .gitkeep
│
└── .env.example
```

---

## 🎨 ФРОНТЕНД: ЛУЧШИЕ ПРАКТИКИ

### 1. React компоненты (Functional Components + Hooks)

```typescript
// ✅ ПРАВИЛЬНО: Feature-based, reusable, well-typed
// src/features/camera/components/CameraCapture.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useCamera } from '../hooks/useCamera';
import { useChallengePolygons } from '../hooks/useChallengePolygons';
import { PolygonOverlay } from './PolygonOverlay';
import { Button } from '@shared/components/Button';
import { Spinner } from '@shared/components/Spinner';
import type { CameraCaptureProps } from '../types/camera.types';
import styles from './CameraCapture.module.css';

/**
 * CameraCapture Component
 * 
 * Responsible for:
 * - Stream camera video
 * - Display challenge polygons
 * - Capture photo and video
 * 
 * @param clientId - Client identifier from query params
 * @param onCapture - Callback when photo is captured
 */
export const CameraCapture: React.FC<CameraCaptureProps> = ({
  clientId,
  onCapture
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Custom hooks for business logic
  const { 
    initCamera, 
    stopCamera, 
    takePhoto, 
    captureVideo,
    isCameraReady 
  } = useCamera(videoRef, canvasRef);

  const { 
    challenge, 
    isPolygonsReady, 
    drawPolygons 
  } = useChallengePolygons(clientId);

  // Initialize camera on mount
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await initCamera();
      } catch (err) {
        setError('Ошибка при доступе к камере');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    return () => {
      stopCamera();
    };
  }, [initCamera, stopCamera]);

  // Animation loop for drawing
  useEffect(() => {
    if (!isCameraReady || !isPolygonsReady) return;

    const animationFrame = requestAnimationFrame(() => {
      if (canvasRef.current) {
        drawPolygons(canvasRef.current);
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isCameraReady, isPolygonsReady, drawPolygons]);

  const handleCapture = async () => {
    if (!challenge) return;

    try {
      setIsLoading(true);
      setError(null);

      const photo = await takePhoto();
      const video = await captureVideo();

      onCapture({ photo, video, challenge });
    } catch (err) {
      setError('Ошибка при съёмке фото');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <div className={styles.cameraWrapper}>
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
        />
      </div>

      <Button
        onClick={handleCapture}
        disabled={isLoading || !isCameraReady}
        loading={isLoading}
        fullWidth
      >
        📷 Снять фото
      </Button>
    </div>
  );
};

CameraCapture.displayName = 'CameraCapture';
```

### 2. Custom Hooks (DRY, Business Logic Separation)

```typescript
// src/features/camera/hooks/useCamera.ts
import { useCallback, useState, useRef } from 'react';

export const useCamera = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaStreamRef.current = stream;
      setIsCameraReady(true);
    } catch (error) {
      throw new Error('Failed to access camera');
    }
  }, [videoRef]);

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraReady(false);
    }
  }, []);

  const takePhoto = useCallback(async (): Promise<Blob> => {
    if (!canvasRef.current || !videoRef.current) {
      throw new Error('Canvas or video not available');
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get 2D context');

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0);

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) throw new Error('Failed to create blob');
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  }, []);

  const captureVideo = useCallback(async (): Promise<Blob> => {
    if (!canvasRef.current) {
      throw new Error('Canvas not available');
    }

    const stream = canvasRef.current.captureStream(30);
    const chunks: BlobPart[] = [];

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.start();

    await new Promise(resolve => setTimeout(resolve, 2000));
    mediaRecorder.stop();

    return new Promise(resolve => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };
    });
  }, []);

  return {
    initCamera,
    stopCamera,
    takePhoto,
    captureVideo,
    isCameraReady
  };
};
```

### 3. State Management (Zustand - минимальный, мощный)

```typescript
// src/features/camera/store/cameraStore.ts
import { create } from 'zustand';
import type { CameraStoreState } from '../types/camera.types';

/**
 * Camera Store
 * Centralized state management for camera feature
 * Benefits:
 * - Simple, minimal boilerplate
 * - No Redux/Context Provider hell
 * - Easy to test
 */
export const useCameraStore = create<CameraStoreState>((set) => ({
  challenge: null,
  isChallengeLoading: false,
  error: null,

  // Actions
  setChallenge: (challenge) => set({ challenge }),
  setChallengeLoading: (loading) => set({ isChallengeLoading: loading }),
  setError: (error) => set({ error }),

  // Reset
  reset: () => set({
    challenge: null,
    isChallengeLoading: false,
    error: null
  })
}));
```

### 4. TypeScript (Strict mode, complete types)

```typescript
// src/features/camera/types/camera.types.ts
import type { Challenge } from '@shared/types/api.types';

export interface CameraCaptureProps {
  clientId: string;
  onCapture: (data: CaptureData) => void;
  onError?: (error: Error) => void;
}

export interface CaptureData {
  photo: Blob;
  video: Blob;
  challenge: Challenge;
  timestamp: number;
}

export interface CameraState {
  isReady: boolean;
  hasPermission: boolean;
  error: Error | null;
}

// Strict discriminated unions for better type safety
export type CameraEvent =
  | { type: 'INIT_START' }
  | { type: 'INIT_SUCCESS'; payload: CameraState }
  | { type: 'INIT_ERROR'; payload: Error }
  | { type: 'CAPTURE_START' }
  | { type: 'CAPTURE_SUCCESS'; payload: CaptureData }
  | { type: 'CAPTURE_ERROR'; payload: Error };
```

### 5. Mobile-First Responsive Design (Tailwind)

```typescript
// src/features/camera/components/CameraCapture.module.css
import { tv } from 'tailwind-variants';

export const cameraStyles = tv({
  slots: {
    container: 'w-full h-screen max-h-screen flex flex-col gap-4 p-4 bg-black',
    cameraWrapper: 'flex-1 relative rounded-xl overflow-hidden shadow-lg',
    canvas: 'w-full h-full object-cover',
    video: 'hidden',
    button: 'sticky bottom-0 w-full',
    error: 'bg-red-500/90 text-white p-4 rounded-lg text-sm text-center'
  },
  variants: {
    isPortrait: {
      true: {
        container: 'portrait:h-screen landscape:h-auto'
      }
    },
    isLoading: {
      true: {
        button: 'opacity-50 cursor-not-allowed'
      }
    }
  }
});

// Usage with media queries
// Mobile: 100% width, full height
// Tablet: max-width 600px, centered
// Desktop: max-width 800px, centered
```

### 6. API Service (Centralized, Singleton)

```typescript
// src/shared/services/api.ts
import axios, { AxiosInstance } from 'axios';
import type { ApiResponse } from '@shared/types/api.types';

class ApiClient {
  private static instance: AxiosInstance;

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Response interceptor
      this.instance.interceptors.response.use(
        (response) => response.data,
        (error) => {
          // Global error handling
          console.error('API Error:', error);
          throw error;
        }
      );
    }

    return this.instance;
  }
}

export const api = ApiClient.getInstance();

// Usage
export const challengeApi = {
  getChallenge: (clientId: string) =>
    api.get<ApiResponse<Challenge>>('/challenge', { params: { clientId } }),

  postCapture: (formData: FormData) =>
    api.post<ApiResponse<CaptureResult>>('/capture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};
```

### 7. Error Handling (Centralized)

```typescript
// src/shared/utils/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class CameraError extends AppError {
  constructor(message: string) {
    super('CAMERA_ERROR', message, 400);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400);
  }
}

// Usage in error boundary
export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundaryComponent
      FallbackComponent={({ error, reset }) => (
        <div className="error-container">
          <h1>Произошла ошибка</h1>
          <p>{error.message}</p>
          <button onClick={reset}>Попробовать снова</button>
        </div>
      )}
    >
      {children}
    </ErrorBoundaryComponent>
  );
};
```

---

## ⚙️ БЭКЕНД: ЛУЧШИЕ ПРАКТИКИ

### 1. Модульная архитектура (NestJS)

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { CaptureModule } from './modules/capture/capture.module';
import { VerificationModule } from './modules/verification/verification.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,      // Global providers (logger, cache, etc)
    ChallengeModule,
    CaptureModule,
    VerificationModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
```

### 2. Dependency Injection (NestJS built-in)

```typescript
// src/modules/challenge/challenge.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@shared/services/logger.service';
import { CryptoService } from '@shared/services/crypto.service';
import { CacheService } from '@shared/services/cache.service';

/**
 * ChallengeService
 * Manages challenge generation and validation
 * 
 * Injected dependencies:
 * - LoggerService: logging
 * - CryptoService: random generation
 * - CacheService: TTL storage
 */
@Injectable()
export class ChallengeService {
  constructor(
    private readonly logger: LoggerService,
    private readonly crypto: CryptoService,
    private readonly cache: CacheService
  ) {}

  async generateChallenge(clientId: string) {
    this.logger.debug(`Generating challenge for client: ${clientId}`);

    const challenge = {
      challengeId: this.crypto.generateUUID(),
      nonce: this.crypto.generateNonce(),
      polygons: this.generateRandomPolygons(),
      expiry: Date.now() + 30_000, // 30 seconds TTL
      createdAt: Date.now()
    };

    // Cache with TTL
    await this.cache.set(
      `challenge:${challenge.challengeId}`,
      challenge,
      { ttl: 30 } // seconds
    );

    return challenge;
  }

  private generateRandomPolygons() {
    // Implementation here
  }
}
```

### 3. DTO Pattern (Data Validation)

```typescript
// src/modules/capture/dto/capture-photo.dto.ts
import { IsString, IsNotEmpty, MaxLength, IsBase64 } from 'class-validator';

/**
 * DTO for photo capture
 * Automatically validated by NestJS pipes
 */
export class CapturePhotoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @IsString()
  @IsNotEmpty()
  challengeId: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsBase64()
  @IsNotEmpty()
  videoBase64: string;

  @IsString()
  @IsNotEmpty()
  videoHash: string;
}

// Auto-validation in controller
@Post('capture')
async capture(@Body() dto: CapturePhotoDto, @UploadedFile() photo: Express.Multer.File) {
  // DTO is automatically validated before reaching this method
  // If validation fails, 400 error is thrown automatically
}
```

### 4. Error Handling (Filters)

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse()['message'] || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`Exception: ${message}`, exception);

    response.status(status).json({
      status: 'error',
      statusCode: status,
      message,
      timestamp: new Date().toISOString()
    });
  }
}
```

### 5. Logging (Structured)

```typescript
// src/shared/services/logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: string, context?: string) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      context,
      message
    }));
  }

  error(message: string, trace?: string, context?: string) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      context,
      message,
      trace
    }));
  }

  debug(message: string, context?: string) {
    if (process.env.DEBUG) {
      console.debug(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        context,
        message
      }));
    }
  }
}
```

### 6. API Response Format (Consistent)

```typescript
// src/shared/types/api.types.ts
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

// src/common/interceptors/transform.interceptor.ts
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        status: 'success',
        data,
        timestamp: new Date().toISOString()
      }))
    );
  }
}
```

### 7. Testing (Unit + Integration)

```typescript
// src/modules/challenge/challenge.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from './challenge.service';
import { CryptoService } from '@shared/services/crypto.service';
import { CacheService } from '@shared/services/cache.service';
import { LoggerService } from '@shared/services/logger.service';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let cryptoService: CryptoService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeService,
        {
          provide: CryptoService,
          useValue: {
            generateUUID: jest.fn(() => 'test-uuid'),
            generateNonce: jest.fn(() => 'test-nonce')
          }
        },
        {
          provide: CacheService,
          useValue: {
            set: jest.fn()
          }
        },
        {
          provide: LoggerService,
          useValue: { debug: jest.fn() }
        }
      ]
    }).compile();

    service = module.get<ChallengeService>(ChallengeService);
    cryptoService = module.get<CryptoService>(CryptoService);
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('generateChallenge', () => {
    it('should generate challenge with correct structure', async () => {
      const result = await service.generateChallenge('client-123');

      expect(result).toHaveProperty('challengeId');
      expect(result).toHaveProperty('nonce');
      expect(result).toHaveProperty('polygons');
      expect(result).toHaveProperty('expiry');
      expect(result.expiry).toBe(Date.now() + 30_000);
    });

    it('should cache challenge', async () => {
      await service.generateChallenge('client-123');

      expect(cacheService.set).toHaveBeenCalled();
    });
  });
});
```

---

## 📱 МОБИЛЬНАЯ ОПТИМИЗАЦИЯ

### 1. Viewport Configuration

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
<meta name="theme-color" content="#1f2937" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### 2. Mobile-First CSS

```css
/* Mobile First Approach */

/* Mobile (default) */
.container {
  width: 100%;
  padding: 1rem;
  font-size: 16px; /* Prevent zoom on input focus */
}

.button {
  width: 100%;
  padding: 1rem;
  font-size: 16px; /* Prevent zoom */
  min-height: 44px; /* iOS touch target */
}

.camera-wrapper {
  aspect-ratio: 16 / 9;
  max-height: 80vh;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 600px;
    margin: 0 auto;
  }

  .button {
    width: auto;
    min-width: 200px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 800px;
  }
}
```

### 3. Performance Optimization

```typescript
// Code splitting - lazy load features
const CameraPage = lazy(() => import('@pages/CameraPage'));
const ResultPage = lazy(() => import('@pages/ResultPage'));

// Suspense with loading state
<Suspense fallback={<Spinner />}>
  <CameraPage />
</Suspense>

// Image optimization - use WebP with fallback
<picture>
  <source srcSet="/logo.webp" type="image/webp" />
  <img src="/logo.png" alt="Logo" />
</picture>

// Debounce expensive operations
const debouncedSearch = useDebounce((query: string) => {
  // Search logic
}, 500);
```

### 4. Battery & Data Optimization

```typescript
// Stop unnecessary animations on low-power mode
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Use animations
  animate();
} else {
  // Use static state instead
  applyStaticState();
}

// Reduce video quality on slow connections
const connection = navigator.connection || navigator.mozConnection;
const effectiveType = connection?.effectiveType; // '4g' | '3g' | '2g'

if (effectiveType === '2g' || effectiveType === '3g') {
  // Lower resolution video
  videoSettings = { width: 640, height: 480 };
}
```

---

## 🧪 ТЕСТИРОВАНИЕ

### Frontend Testing Strategy

```typescript
// Unit tests (Jest)
// - Services
// - Utilities
// - Hooks

// Component tests (Vitest + React Testing Library)
// - User interactions
// - State changes
// - Props rendering

describe('CameraCapture', () => {
  it('should render button', () => {
    const { getByRole } = render(<CameraCapture clientId="test" />);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should call onCapture when button is clicked', async () => {
    const onCapture = jest.fn();
    const { getByRole } = render(
      <CameraCapture clientId="test" onCapture={onCapture} />
    );

    const button = getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(onCapture).toHaveBeenCalled();
    });
  });
});

// E2E tests (Playwright)
// - Full user flows
// - Cross-browser compatibility
// - Mobile device testing
test('Full photo capture flow', async ({ page }) => {
  await page.goto('http://localhost:5173/?clientId=test');
  await page.getByRole('button', { name: /снять фото/i }).click();
  await expect(page).toHaveURL(/result/);
});
```

### Backend Testing Strategy

```typescript
// Unit tests - Services
describe('ChallengeService', () => {
  // Test business logic in isolation
});

// Integration tests - Controllers
describe('ChallengeController', () => {
  // Test HTTP endpoints with real module
});

// E2E tests - Full flow
describe('Photo Capture Flow', () => {
  it('should complete full capture flow', async () => {
    // 1. Get challenge
    // 2. Send photo + video
    // 3. Verify success
  });
});
```

---

## 🚀 РАЗРАБОТКА ПО НЕДЕЛЯМ

### Week 1: Backend Core

- ✅ Challenge Service (polynomial generation)
- ✅ Capture Service (photo validation)
- ✅ API Endpoints (GET /challenge, POST /capture)
- ✅ Unit tests for services
- ✅ Error handling & logging

**Deliverable:** Working backend API

### Week 2: Frontend Core

- ✅ Camera component with polygon overlay
- ✅ Custom hooks (useCamera, useChallengePolygons)
- ✅ State management (Zustand)
- ✅ API integration
- ✅ Result screen

**Deliverable:** Working web app

### Week 3: Optimization & Polish

- ✅ Mobile responsiveness testing
- ✅ Performance optimization (code splitting, lazy loading)
- ✅ Error handling & user feedback
- ✅ Integration testing (full flows)
- ✅ Docker setup

**Deliverable:** Production-ready prototypeype

---

## 📦 PACKAGE.JSON DEPENDENCIES

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### Backend
```json
{
  "dependencies": {
    "@nestjs/common": "^10.2.0",
    "@nestjs/core": "^10.2.0",
    "@nestjs/platform-express": "^10.2.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.2.0",
    "@nestjs/testing": "^10.2.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "typescript": "^5.3.0"
  }
}
```

---

## 🔄 GIT WORKFLOW

```bash
# Feature branches
git checkout -b feature/camera-component
git checkout -b feature/challenge-api
git checkout -b feature/mobile-optimization

# Commit conventions (Conventional Commits)
git commit -m "feat(camera): add polygon overlay"
git commit -m "fix(api): fix video hash validation"
git commit -m "docs(readme): update setup instructions"
git commit -m "test(challenge): add service tests"

# Merge strategy
git pull origin main
git rebase main
git push origin feature/camera-component
# Create Pull Request with detailed description
# Require code review before merge
```

---

## 📋 QUALITY CHECKLIST

Перед каждым merge в main:

- ✅ Все тесты проходят (unit + integration)
- ✅ Code coverage > 80%
- ✅ No console.log (except logging service)
- ✅ No TypeScript errors
- ✅ ESLint passed
- ✅ Code reviewed (min 1 approval)
- ✅ Mobile tested
- ✅ Performance checked (Lighthouse > 90)

---

## 🎯 SUMMARY

**Ключевые решения для быстрой, расширяемой разработки:**

| Аспект | Решение | Преимущество |
|---|---|---|
| **Architecture** | Feature-based (frontend) + Modular DI (backend) | Легко добавлять новые фичи |
| **State** | Zustand | Минимальный боилерплейт vs Redux |
| **API** | Singleton axios instance | Централизованное управление |
| **Styling** | Tailwind + mobile-first | Быстро, responsive, consistent |
| **Testing** | Vitest + Jest + Playwright | Полное покрытие |
| **Performance** | Code splitting, lazy loading | Быстрый initial load |
| **Mobile** | Viewport meta + responsive CSS | Отлично смотрится везде |
| **Deployment** | Docker + docker-compose | Easy production setup |

Эта архитектура позволит вам разработать прототип за 2-3 недели и легко масштабировать позже.
