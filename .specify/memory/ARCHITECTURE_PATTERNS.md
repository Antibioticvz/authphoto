# Паттерны проектирования — AuthPhoto

## Конкретные примеры для расширяемости

**Версия:** 1.0  
**Язык:** TypeScript  
**Framework:** React, NestJS

---

## 📐 ПАТТЕРНЫ И РЕАЛИЗАЦИЯ

### 1. FACTORY PATTERN (Создание сложных объектов)

**Когда использовать:** Для создания экземпляров сервисов с разными реализациями

#### Backend: Service Factory

```typescript
// src/shared/factories/service.factory.ts
import { Injectable } from "@nestjs/common"
import { CryptoService } from "../services/crypto.service"
import { StorageService } from "../services/storage.service"

/**
 * Factory для создания storage сервисов
 * Позволяет легко переключаться между хранилищами (FS, S3, DB)
 */
@Injectable()
export class StorageFactory {
  createStorage(type: "file" | "s3" | "database"): StorageService {
    switch (type) {
      case "file":
        return new FileSystemStorageService()
      case "s3":
        return new S3StorageService()
      case "database":
        return new DatabaseStorageService()
      default:
        throw new Error(`Unknown storage type: ${type}`)
    }
  }
}

// Использование
@Injectable()
export class CaptureService {
  private storage: StorageService

  constructor(private factory: StorageFactory, private config: ConfigService) {
    const storageType = this.config.get("STORAGE_TYPE") || "file"
    this.storage = this.factory.createStorage(storageType)
  }

  async savePhoto(photoBuffer: Buffer): Promise<string> {
    return this.storage.save(photoBuffer)
  }
}

// Абстрактная base class
abstract class StorageService {
  abstract save(data: Buffer): Promise<string>
  abstract get(id: string): Promise<Buffer>
  abstract delete(id: string): Promise<void>
}

// Конкретные реализации
class FileSystemStorageService extends StorageService {
  async save(data: Buffer): Promise<string> {
    const id = uuid()
    await fs.promises.writeFile(`./photos/${id}.jpg`, data)
    return id
  }

  async get(id: string): Promise<Buffer> {
    return await fs.promises.readFile(`./photos/${id}.jpg`)
  }

  async delete(id: string): Promise<void> {
    await fs.promises.unlink(`./photos/${id}.jpg`)
  }
}

class S3StorageService extends StorageService {
  constructor(private s3Client: AWS.S3) {}

  async save(data: Buffer): Promise<string> {
    const id = uuid()
    await this.s3Client
      .putObject({
        Bucket: "authphoto-photos",
        Key: `${id}.jpg`,
        Body: data,
      })
      .promise()
    return id
  }

  async get(id: string): Promise<Buffer> {
    const object = await this.s3Client
      .getObject({
        Bucket: "authphoto-photos",
        Key: `${id}.jpg`,
      })
      .promise()
    return object.Body as Buffer
  }

  async delete(id: string): Promise<void> {
    await this.s3Client
      .deleteObject({
        Bucket: "authphoto-photos",
        Key: `${id}.jpg`,
      })
      .promise()
  }
}
```

#### Frontend: Component Factory

```typescript
// src/shared/factories/component.factory.tsx
import React from "react"
import type { InputType } from "@shared/types/form.types"

/**
 * Factory для создания input компонентов
 * Позволяет единообразно работать с разными типами input
 */
export const createInputComponent = (
  type: InputType
): React.ComponentType<InputProps> => {
  const components: Record<InputType, React.ComponentType<InputProps>> = {
    text: TextInput,
    email: EmailInput,
    textarea: TextareaInput,
    select: SelectInput,
    checkbox: CheckboxInput,
    file: FileInput,
  }

  return components[type] || TextInput
}

// Использование
interface FormConfig {
  fields: Array<{ name: string; type: InputType }>
}

const FormBuilder: React.FC<{ config: FormConfig }> = ({ config }) => {
  return (
    <form>
      {config.fields.map(field => {
        const InputComponent = createInputComponent(field.type)
        return <InputComponent key={field.name} name={field.name} />
      })}
    </form>
  )
}
```

---

### 2. STRATEGY PATTERN (Различные алгоритмы)

**Когда использовать:** Для разных способов обработки данных (компрессия, валидация, хеширование)

#### Backend: Validation Strategy

```typescript
// src/shared/strategies/validation.strategy.ts
export interface ValidationStrategy {
  validate(data: unknown): Promise<boolean>
  getErrorMessage(): string
}

/**
 * Различные стратегии валидации видео
 */
export class VideoFormatValidation implements ValidationStrategy {
  async validate(blob: Blob): Promise<boolean> {
    // Проверяем MIME type и размер
    const maxSize = 50 * 1024 * 1024 // 50MB
    return blob.type.startsWith("video/") && blob.size < maxSize
  }

  getErrorMessage(): string {
    return "Invalid video format or size > 50MB"
  }
}

export class VideoHashValidation implements ValidationStrategy {
  constructor(private expectedHash: string) {}

  async validate(blob: Blob): Promise<boolean> {
    const buffer = await blob.arrayBuffer()
    const hash = await this.calculateHash(buffer)
    return hash === this.expectedHash
  }

  private async calculateHash(buffer: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
  }

  getErrorMessage(): string {
    return "Video hash mismatch - possible tampering detected"
  }
}

export class VideoContentValidation implements ValidationStrategy {
  async validate(blob: Blob): Promise<boolean> {
    // Проверяем наличие polygons на видео (ML model или frame analysis)
    return await this.detectPolygons(blob)
  }

  private async detectPolygons(blob: Blob): Promise<boolean> {
    // TensorFlow.js для detection
    return true // Mock
  }

  getErrorMessage(): string {
    return "No polygons detected in video"
  }
}

// Backend Service: Strategy Pattern
@Injectable()
export class CaptureService {
  private validationStrategies: ValidationStrategy[] = []

  async validateVideo(
    blob: Blob,
    expectedHash: string
  ): Promise<{ valid: boolean; errors: string[] }> {
    this.validationStrategies = [
      new VideoFormatValidation(),
      new VideoHashValidation(expectedHash),
      new VideoContentValidation(),
    ]

    const errors: string[] = []

    for (const strategy of this.validationStrategies) {
      const isValid = await strategy.validate(blob)
      if (!isValid) {
        errors.push(strategy.getErrorMessage())
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
```

#### Frontend: Compression Strategy

```typescript
// src/shared/strategies/compression.strategy.ts
export interface CompressionStrategy {
  compress(blob: Blob): Promise<Blob>
}

export class JPEGCompressionStrategy implements CompressionStrategy {
  constructor(private quality: number = 0.8) {}

  async compress(blob: Blob): Promise<Blob> {
    return new Promise(resolve => {
      const canvas = document.createElement("canvas")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          compressedBlob => {
            resolve(compressedBlob || blob)
          },
          "image/jpeg",
          this.quality
        )
      }

      img.src = URL.createObjectURL(blob)
    })
  }
}

export class WebPCompressionStrategy implements CompressionStrategy {
  async compress(blob: Blob): Promise<Blob> {
    // Современный формат, меньше размер
    return new Promise(resolve => {
      const canvas = document.createElement("canvas")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          compressedBlob => {
            resolve(compressedBlob || blob)
          },
          "image/webp",
          0.8
        )
      }

      img.src = URL.createObjectURL(blob)
    })
  }
}

// Использование
export const usePhotoCompression = () => {
  const [strategy, setStrategy] = useState<CompressionStrategy>(
    new JPEGCompressionStrategy()
  )

  const compress = async (blob: Blob): Promise<Blob> => {
    return strategy.compress(blob)
  }

  return { compress, setStrategy }
}
```

---

### 3. OBSERVER PATTERN (Real-time обновления)

**Когда использовать:** Для синхронизации состояния между компонентами (canvas updates, WebSocket)

#### Frontend: Canvas Observer

```typescript
// src/features/camera/observers/canvasObserver.ts
export interface CanvasObserver {
  onPolygonsUpdate(polygons: Polygon[]): void
  onCanvasResize(size: { width: number; height: number }): void
}

/**
 * Observable для управления canvas drawing
 */
export class CanvasSubject {
  private observers: Set<CanvasObserver> = new Set()
  private polygons: Polygon[] = []

  addObserver(observer: CanvasObserver) {
    this.observers.add(observer)
  }

  removeObserver(observer: CanvasObserver) {
    this.observers.delete(observer)
  }

  updatePolygons(polygons: Polygon[]) {
    this.polygons = polygons
    this.notifyPolygonsUpdate()
  }

  resizeCanvas(size: { width: number; height: number }) {
    this.notifyCanvasResize(size)
  }

  private notifyPolygonsUpdate() {
    this.observers.forEach(observer => {
      observer.onPolygonsUpdate(this.polygons)
    })
  }

  private notifyCanvasResize(size: { width: number; height: number }) {
    this.observers.forEach(observer => {
      observer.onCanvasResize(size)
    })
  }
}

// Конкретный observer
class PolygonDrawer implements CanvasObserver {
  constructor(private canvas: HTMLCanvasElement) {}

  onPolygonsUpdate(polygons: Polygon[]): void {
    const ctx = this.canvas.getContext("2d")!
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    polygons.forEach(polygon => this.drawPolygon(polygon))
  }

  onCanvasResize(size: { width: number; height: number }): void {
    this.canvas.width = size.width
    this.canvas.height = size.height
  }

  private drawPolygon(polygon: Polygon): void {
    // Drawing logic
  }
}

// Использование в компоненте
export const CameraCapture: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const subjectRef = useRef(new CanvasSubject())

  useEffect(() => {
    if (!canvasRef.current) return

    const drawer = new PolygonDrawer(canvasRef.current)
    subjectRef.current.addObserver(drawer)

    return () => {
      subjectRef.current.removeObserver(drawer)
    }
  }, [])

  // When polygons change, notify all observers
  useEffect(() => {
    subjectRef.current.updatePolygons(polygons)
  }, [polygons])

  return <canvas ref={canvasRef} />
}
```

#### Backend: WebSocket Observer

```typescript
// src/modules/challenge/observers/challengeObserver.ts
export interface ChallengeObserver {
  onChallengeExpiring(challengeId: string): void
  onChallengeUsed(challengeId: string): void
  onChallengeValidated(challengeId: string): void
}

@Injectable()
export class ChallengeSubject {
  private observers: Set<ChallengeObserver> = new Set()
  private challenges: Map<string, Challenge> = new Map()

  addObserver(observer: ChallengeObserver) {
    this.observers.add(observer)
  }

  removeObserver(observer: ChallengeObserver) {
    this.observers.delete(observer)
  }

  createChallenge(challengeId: string, ttl: number) {
    this.challenges.set(challengeId, {
      id: challengeId,
      used: false,
      createdAt: Date.now(),
    })

    // Notify expiry after TTL
    setTimeout(() => {
      this.observers.forEach(obs => {
        obs.onChallengeExpiring(challengeId)
      })
      this.challenges.delete(challengeId)
    }, ttl)
  }

  validateChallenge(challengeId: string) {
    this.observers.forEach(obs => {
      obs.onChallengeValidated(challengeId)
    })
  }

  markChallengeAsUsed(challengeId: string) {
    this.observers.forEach(obs => {
      obs.onChallengeUsed(challengeId)
    })
  }
}

// Logger observer
@Injectable()
export class ChallengeLogger implements ChallengeObserver {
  constructor(private logger: LoggerService) {}

  onChallengeExpiring(challengeId: string): void {
    this.logger.warn(`Challenge expired: ${challengeId}`)
  }

  onChallengeUsed(challengeId: string): void {
    this.logger.log(`Challenge used: ${challengeId}`)
  }

  onChallengeValidated(challengeId: string): void {
    this.logger.debug(`Challenge validated: ${challengeId}`)
  }
}

// WebSocket broadcast observer
@Injectable()
export class ChallengeBroadcaster implements ChallengeObserver {
  constructor(@Inject("WebSocketGateway") private gateway: WebSocketGateway) {}

  onChallengeValidated(challengeId: string): void {
    this.gateway.broadcast("challenge:validated", { challengeId })
  }

  onChallengeExpiring(challengeId: string): void {
    this.gateway.broadcast("challenge:expired", { challengeId })
  }

  onChallengeUsed(challengeId: string): void {
    // Don't broadcast on use
  }
}
```

---

### 4. REPOSITORY PATTERN (Data Access Layer)

**Когда использовать:** Для абстрактного доступа к данным (файловая система, БД, cache)

#### Backend: Repository Pattern

```typescript
// src/shared/repositories/repository.interface.ts
export interface IRepository<T> {
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  create(data: Partial<T>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}

// Photo entity
export interface Photo {
  id: string
  clientId: string
  message: string
  photoPath: string
  videohash: string
  verified: boolean
  createdAt: Date
  expiresAt: Date
}

// Repository implementation
@Injectable()
export class PhotoRepository implements IRepository<Photo> {
  async findById(id: string): Promise<Photo | null> {
    const data = await fs.promises.readFile(
      `./photos/metadata/${id}.json`,
      "utf-8"
    )
    return JSON.parse(data)
  }

  async findAll(): Promise<Photo[]> {
    const files = await fs.promises.readdir("./photos/metadata/")
    const photos = await Promise.all(
      files.map(file =>
        fs.promises.readFile(`./photos/metadata/${file}`, "utf-8")
      )
    )
    return photos.map(data => JSON.parse(data))
  }

  async create(data: Partial<Photo>): Promise<Photo> {
    const photo: Photo = {
      id: uuid(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      verified: false,
      ...data,
    } as Photo

    await fs.promises.writeFile(
      `./photos/metadata/${photo.id}.json`,
      JSON.stringify(photo, null, 2)
    )

    return photo
  }

  async update(id: string, data: Partial<Photo>): Promise<Photo> {
    const existing = await this.findById(id)
    if (!existing) throw new NotFoundException()

    const updated = { ...existing, ...data }
    await fs.promises.writeFile(
      `./photos/metadata/${id}.json`,
      JSON.stringify(updated, null, 2)
    )

    return updated
  }

  async delete(id: string): Promise<void> {
    await fs.promises.unlink(`./photos/metadata/${id}.json`)
  }
}

// Использование в service
@Injectable()
export class PhotoService {
  constructor(private photoRepository: PhotoRepository) {}

  async getPhoto(id: string): Promise<Photo> {
    const photo = await this.photoRepository.findById(id)
    if (!photo) {
      throw new NotFoundException(`Photo ${id} not found`)
    }
    return photo
  }

  async createPhoto(data: CreatePhotoDto): Promise<Photo> {
    return this.photoRepository.create(data)
  }
}
```

#### Frontend: Query Repository

```typescript
// src/shared/repositories/queryRepository.ts
export interface IQueryRepository<T> {
  query(params: QueryParams): Promise<T[]>
  queryOne(params: QueryParams): Promise<T | null>
  cache(key: string, data: T[], ttl?: number): void
  getCached(key: string): T[] | null
}

@Injectable()
export class PhotoQueryRepository implements IQueryRepository<Photo> {
  private cache = new Map<string, { data: Photo[]; expiry: number }>()

  constructor(private api: ApiClient) {}

  async query(params: QueryParams): Promise<Photo[]> {
    const cacheKey = JSON.stringify(params)
    const cached = this.getCached(cacheKey)

    if (cached) return cached

    const response = await this.api.get("/photos", { params })
    this.cache(cacheKey, response.data)

    return response.data
  }

  async queryOne(params: QueryParams): Promise<Photo | null> {
    const results = await this.query(params)
    return results[0] || null
  }

  cache(key: string, data: Photo[], ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    })
  }

  getCached(key: string): Photo[] | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() > cached.expiry) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }
}

// Использование в компоненте
export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const repository = useRef(new PhotoQueryRepository(api))

  const fetchPhotos = useCallback(async (clientId: string) => {
    const result = await repository.current.query({ clientId })
    setPhotos(result)
  }, [])

  return { photos, fetchPhotos }
}
```

---

### 5. DEPENDENCY INJECTION PATTERN

**Когда использовать:** Для loose coupling между компонентами

#### Backend: NestJS DI (built-in)

```typescript
// src/modules/challenge/challenge.module.ts
import { Module } from "@nestjs/common"
import { ChallengeService } from "./challenge.service"
import { ChallengeController } from "./challenge.controller"
import { SharedModule } from "@shared/shared.module"

@Module({
  imports: [SharedModule],
  controllers: [ChallengeController],
  providers: [ChallengeService],
  exports: [ChallengeService], // Export for other modules
})
export class ChallengeModule {}

// Использование
@Injectable()
export class ChallengeService {
  constructor(
    private cryptoService: CryptoService, // Автоматически инжектится
    private cacheService: CacheService,
    private loggerService: LoggerService,
    private config: ConfigService
  ) {}
}
```

#### Frontend: Context + Custom Hook (React)

```typescript
// src/shared/contexts/api.context.ts
import React, { createContext, useMemo } from "react"
import { ApiClient } from "../services/api"

export const ApiContext = createContext<ApiClient | null>(null)

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const apiClient = useMemo(() => new ApiClient(), [])

  return <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
}

// Custom hook для использования
export const useApi = () => {
  const api = useContext(ApiContext)
  if (!api) {
    throw new Error("useApi must be used within ApiProvider")
  }
  return api
}

// Использование в компоненте
export const CameraCapture: React.FC = () => {
  const api = useApi() // DI via hook

  const fetchChallenge = async () => {
    const challenge = await api.getChallenge()
    // ...
  }

  return <div onClick={fetchChallenge}>Fetch Challenge</div>
}

// В App.tsx
;<ApiProvider>
  <CameraCapture />
</ApiProvider>
```

---

### 6. ADAPTER PATTERN (Интеграция несовместимых интерфейсов)

**Когда использовать:** Для работы с legacy кодом или внешними APIs

#### Backend: API Adapter

```typescript
// src/shared/adapters/c2pa.adapter.ts
/**
 * Adapter для интеграции C2PA API
 * Адаптирует внешний C2PA интерфейс под нашу систему
 */
export interface C2PAxternalAPI {
  addMetadata(image: Buffer): Promise<{ manifest: string }>
}

export interface IC2PAdapter {
  embedMetadata(image: Buffer, metadata: PhotoMetadata): Promise<Buffer>
}

@Injectable()
export class C2PAAdapter implements IC2PAdapter {
  constructor(
    @Inject("C2PA_API") private c2paApi: C2PAExternalAPI,
    private logger: LoggerService
  ) {}

  async embedMetadata(image: Buffer, metadata: PhotoMetadata): Promise<Buffer> {
    try {
      const result = await this.c2paApi.addMetadata(image)

      // Transform external API response to our format
      this.logger.log(`C2PA metadata embedded: ${result.manifest}`)

      return image // Return modified image
    } catch (error) {
      this.logger.error("C2PA embedding failed", error)
      throw new Error("Failed to embed C2PA metadata")
    }
  }
}

// Использование
@Injectable()
export class CaptureService {
  constructor(
    private c2paAdapter: C2PAAdapter,
    private storage: StorageService
  ) {}

  async capturePhoto(
    photoBuffer: Buffer,
    metadata: PhotoMetadata
  ): Promise<string> {
    // Use adapter transparently
    const enrichedPhoto = await this.c2paAdapter.embedMetadata(
      photoBuffer,
      metadata
    )
    return this.storage.save(enrichedPhoto)
  }
}
```

---

### 7. DECORATOR PATTERN (Динамическое расширение функциональности)

**Когда использовать:** Для добавления функциональности к функциям/классам

#### Backend: NestJS Decorators

```typescript
// src/common/decorators/log-execution.decorator.ts
export const LogExecution = () => {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const start = Date.now()
      console.log(`Executing ${propertyName}...`)

      try {
        const result = await originalMethod.apply(this, args)
        const duration = Date.now() - start
        console.log(`${propertyName} completed in ${duration}ms`)
        return result
      } catch (error) {
        console.error(`${propertyName} failed:`, error)
        throw error
      }
    }

    return descriptor
  }
}

// Использование
@Injectable()
export class ChallengeService {
  @LogExecution()
  async generateChallenge(clientId: string): Promise<Challenge> {
    // Logic here
  }
}
```

#### Frontend: React HOC Decorator

```typescript
// src/shared/decorators/withErrorBoundary.tsx
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
): React.FC<P> => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
}

// Использование
const SafeCameraCapture = withErrorBoundary(CameraCapture, <ErrorScreen />)
```

---

## 🔌 EXTENSIBILITY POINTS

### Где легко добавлять новые функции

```
НОВОЕ ТРЕБОВАНИЕ → ГДЕ ДОБАВЛЯТЬ

1. Новый способ хранения фото
   → Создать новый класс в StorageService, используя Factory

2. Новая валидация фото
   → Добавить новый ValidationStrategy класс

3. Новый способ сжатия
   → Добавить CompressionStrategy реализацию

4. Отслеживание событий
   → Добавить новый Observer и регистрировать его в Subject

5. Новое API хранилище (БД вместо FS)
   → Создать новую Repository реализацию IRepository

6. Интеграция с новым сервисом
   → Создать новый Adapter класс

7. Новая валидация входных данных
   → Добавить новый DTO класс с @IsX() decorators
```

---

## ✅ SUMMARY

| Паттерн                  | Цель                         | Используется для                 |
| ------------------------ | ---------------------------- | -------------------------------- |
| **Factory**              | Создание объектов            | Storage, Components, Services    |
| **Strategy**             | Разные алгоритмы             | Валидация, сжатие, обработка     |
| **Observer**             | Real-time обновления         | Canvas drawing, WebSocket events |
| **Repository**           | Абстракция доступа к данным  | Photo storage, queries           |
| **Dependency Injection** | Loose coupling               | NestJS, React Context            |
| **Adapter**              | Интеграция несовместимых API | C2PA, S3, external services      |
| **Decorator**            | Расширение функциональности  | Error boundaries, logging        |

Эти паттерны обеспечат **легкую расширяемость** без переписывания существующего кода.
