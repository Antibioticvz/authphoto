# AuthPhoto — Руководство по разработке и запуску прототипа

**Версия:** 1.0  
**Дата:** 16 ноября 2025

---

## 1. Подготовка окружения

### Требования

- **Node.js:** v18+ (проверить: `node --version`)
- **npm или yarn:** v9+
- **Docker & Docker Compose:** (для контейнеризации)
- **Git:** для контроля версий
- **TypeScript:** понимание синтаксиса

### Установка зависимостей (глобально)

```bash
# Если нет NestJS CLI
npm install -g @nestjs/cli

# Если нет Vite
npm install -g create-vite
```

---

## 2. Структура проекта (как мы её создадим)

```
authphoto-demo/
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── challenge/
│   │   │   ├── challenge.module.ts
│   │   │   ├── challenge.service.ts
│   │   │   ├── challenge.controller.ts
│   │   │   └── entities/
│   │   │       └── challenge.entity.ts
│   │   ├── capture/
│   │   │   ├── capture.module.ts
│   │   │   ├── capture.service.ts
│   │   │   ├── capture.controller.ts
│   │   │   └── dto/
│   │   │       └── capture.dto.ts
│   │   ├── photos/ (сохранённые фото и JSON)
│   │   └── common/
│   │       ├── filters/
│   │       └── interceptors/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── CameraCapture.tsx
│   │   │   ├── ChallengeOverlay.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── ResultScreen.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── crypto.ts
│   │   │   └── polygon-drawer.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 3. Пошаговая разработка

### Фаза 1: Инициализация проектов

#### 3.1 Создаём папку проекта

```bash
mkdir authphoto-demo
cd authphoto-demo
git init

# Создаём .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
build/
*.log
.env
.env.local
.DS_Store
.vscode/
photos/
EOF

git add .gitignore
git commit -m "Initial commit: setup"
```

---

#### 3.2 Создаём бэкенд (NestJS)

```bash
# Создаём NestJS проект
mkdir backend
cd backend

# Инициализируем NestJS
nest new . --skip-git --package-manager npm

# Должны получиться стандартные файлы
# package.json, src/app.module.ts, src/main.ts и т.д.

# Добавляем нужные зависимости
npm install @nestjs/platform-express multer uuid
npm install --save-dev @types/multer @types/node

cd ..
```

**package.json (backend):**

```json
{
  "name": "authphoto-backend",
  "version": "1.0.0",
  "description": "AuthPhoto Backend",
  "main": "dist/main.js",
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^10.x.x",
    "@nestjs/core": "^10.x.x",
    "@nestjs/platform-express": "^10.x.x",
    "reflect-metadata": "^0.1.x",
    "rxjs": "^7.x.x",
    "uuid": "^9.x.x",
    "multer": "^1.4.x"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.x.x",
    "@types/express": "^4.x.x",
    "@types/node": "^20.x.x",
    "@types/multer": "^1.4.x",
    "typescript": "^5.x.x"
  }
}
```

---

#### 3.3 Создаём фронтенд (React + Vite)

```bash
# Создаём React + Vite проект
npm create vite@latest frontend -- --template react-ts

cd frontend

# Установим Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Установим нужные зависимости
npm install axios

cd ..
```

**vite.config.ts (frontend):**

```typescript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
```

---

### Фаза 2: Реализация бэкенда

#### 3.4 Создаём Challenge модуль

```bash
cd backend
nest g module challenge
nest g service challenge
nest g controller challenge
```

**src/challenge/challenge.entity.ts:**

```typescript
export interface Polygon {
  id: number
  points: [number, number][]
  color: string
  opacity: number
  animation?: "pulse" | "rotate" | "none"
  duration?: number
  rotationCenter?: [number, number]
}

export interface Challenge {
  challengeId: string
  nonce: string
  polygons: Polygon[]
  expiry: number
  createdAt: number
}
```

**src/challenge/challenge.service.ts:**

```typescript
import { Injectable } from "@nestjs/common"
import { v4 as uuidv4 } from "uuid"
import * as crypto from "crypto"
import { Challenge, Polygon } from "./challenge.entity"

@Injectable()
export class ChallengeService {
  private challenges = new Map<string, Challenge>()
  private readonly CHALLENGE_DURATION_MS = 30000 // 30 сек

  create(): Challenge {
    const challengeId = uuidv4()
    const nonce = crypto.randomBytes(32).toString("hex")
    const now = Date.now()
    const expiry = now + this.CHALLENGE_DURATION_MS

    const polygons = this.generateRandomPolygons()

    const challenge: Challenge = {
      challengeId,
      nonce,
      polygons,
      expiry,
      createdAt: now,
    }

    this.challenges.set(challengeId, challenge)

    // Автоматически удалить через 30 сек
    setTimeout(() => {
      this.challenges.delete(challengeId)
    }, this.CHALLENGE_DURATION_MS)

    return challenge
  }

  get(challengeId: string): Challenge | null {
    const challenge = this.challenges.get(challengeId)

    if (!challenge) return null

    // Проверить expiry
    if (challenge.expiry < Date.now()) {
      this.challenges.delete(challengeId)
      return null
    }

    return challenge
  }

  delete(challengeId: string): void {
    this.challenges.delete(challengeId)
  }

  private generateRandomPolygons(): Polygon[] {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#F5FF33"]
    const animations: ("pulse" | "rotate" | "none")[] = [
      "pulse",
      "rotate",
      "none",
    ]
    const durations = [1200, 1500, 1800, 2000]

    const polygons: Polygon[] = []

    for (let i = 0; i < 5; i++) {
      const type = Math.random()
      let points: [number, number][] = []

      if (type < 0.4) {
        // Прямоугольник
        const x = Math.random() * 0.7
        const y = Math.random() * 0.7
        const w = Math.random() * 0.2 + 0.1
        const h = Math.random() * 0.15 + 0.1
        points = [
          [x, y],
          [x + w, y],
          [x + w, y + h],
          [x, y + h],
        ]
      } else if (type < 0.7) {
        // Треугольник
        const x = Math.random() * 0.7
        const y = Math.random() * 0.7
        const size = Math.random() * 0.15 + 0.1
        points = [
          [x, y],
          [x + size, y + size],
          [x - size, y + size],
        ]
      } else {
        // Произвольный четырёхугольник
        const points_raw = Array(4)
          .fill(null)
          .map(
            () => [Math.random() * 0.8, Math.random() * 0.8] as [number, number]
          )
        points = points_raw
      }

      const animation =
        animations[Math.floor(Math.random() * animations.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const duration = durations[Math.floor(Math.random() * durations.length)]
      const opacity = Math.random() * 0.3 + 0.4

      polygons.push({
        id: i,
        points,
        color,
        opacity,
        animation: animation === "none" ? undefined : animation,
        duration,
        rotationCenter:
          animation === "rotate" ? this.getPolygonCenter(points) : undefined,
      })
    }

    return polygons
  }

  private getPolygonCenter(points: [number, number][]): [number, number] {
    const avgX = points.reduce((sum, p) => sum + p[0], 0) / points.length
    const avgY = points.reduce((sum, p) => sum + p[1], 0) / points.length
    return [avgX, avgY]
  }
}
```

**src/challenge/challenge.controller.ts:**

```typescript
import { Controller, Get, Query, BadRequestException } from "@nestjs/common"
import { ChallengeService } from "./challenge.service"

@Controller("api/v1")
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get("challenge")
  getChallenge(@Query("clientId") clientId: string) {
    if (!clientId) {
      throw new BadRequestException("clientId required")
    }

    const challenge = this.challengeService.create()

    return {
      challengeId: challenge.challengeId,
      nonce: challenge.nonce,
      polygons: challenge.polygons,
      expiry: challenge.expiry,
      createdAt: challenge.createdAt,
    }
  }
}
```

**src/challenge/challenge.module.ts:**

```typescript
import { Module } from "@nestjs/common"
import { ChallengeService } from "./challenge.service"
import { ChallengeController } from "./challenge.controller"

@Module({
  controllers: [ChallengeController],
  providers: [ChallengeService],
  exports: [ChallengeService],
})
export class ChallengeModule {}
```

---

#### 3.5 Создаём Capture модуль

```bash
nest g module capture
nest g service capture
nest g controller capture
```

**src/capture/capture.service.ts:**

```typescript
import { Injectable } from "@nestjs/common"
import * as crypto from "crypto"
import * as fs from "fs"

@Injectable()
export class CaptureService {
  async calculateVideoHash(buffer: Buffer): Promise<string> {
    const hash = crypto.createHash("sha256")
    hash.update(buffer)
    return hash.digest("hex")
  }

  async calculatePhotoHash(buffer: Buffer): Promise<string> {
    const hash = crypto.createHash("sha256")
    hash.update(buffer)
    return hash.digest("hex")
  }

  ensurePhotosDir(): void {
    if (!fs.existsSync("./photos")) {
      fs.mkdirSync("./photos", { recursive: true })
    }
  }

  savePhoto(photoId: string, buffer: Buffer): string {
    this.ensurePhotosDir()
    const path = `./photos/${photoId}.jpg`
    fs.writeFileSync(path, buffer)
    return path
  }

  saveMetadata(photoId: string, metadata: any): string {
    this.ensurePhotosDir()
    const path = `./photos/${photoId}.json`
    fs.writeFileSync(path, JSON.stringify(metadata, null, 2))
    return path
  }
}
```

**src/capture/capture.controller.ts:**

```typescript
import {
  Controller,
  Post,
  BadRequestException,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpCode,
  Body,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { CaptureService } from "./capture.service"
import { ChallengeService } from "../challenge/challenge.service"
import { Request } from "express"
import { v4 as uuidv4 } from "uuid"

@Controller("api/v1")
export class CaptureController {
  constructor(
    private readonly captureService: CaptureService,
    private readonly challengeService: ChallengeService
  ) {}

  @Post("capture")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("photo", { dest: "/tmp" }))
  async capture(
    @UploadedFile() photo: Express.Multer.File,
    @Body() body: any,
    @Req() req: Request
  ) {
    // Валидация
    if (!photo) throw new BadRequestException("Фото не загружено")
    if (!body.videoBase64) throw new BadRequestException("Видео не загружено")
    if (!body.videoHash) throw new BadRequestException("Хэш видео не загружен")
    if (!body.challengeId)
      throw new BadRequestException("Challenge ID не передан")
    if (!body.clientId) throw new BadRequestException("Client ID не передан")
    if (body.message && body.message.length > 500) {
      throw new BadRequestException(
        "Сообщение слишком длинное (макс 500 символов)"
      )
    }

    // 1. Получить челлендж
    const challenge = this.challengeService.get(body.challengeId)
    if (!challenge) {
      throw new ForbiddenException({
        status: "error",
        reason: "challenge_expired",
        message: "Челлендж истёк или не найден.",
      })
    }

    // 2. Проверить видео-хэш
    try {
      const videoBuffer = Buffer.from(body.videoBase64.split(",")[1], "base64")
      const calculatedHash = await this.captureService.calculateVideoHash(
        videoBuffer
      )

      if (calculatedHash !== body.videoHash) {
        // Удаляем временный файл
        require("fs").unlinkSync(photo.path)

        throw new ForbiddenException({
          status: "error",
          reason: "video_proof_failed",
          message: "Фото не прошло проверку. Полигоны не совпадают.",
        })
      }
    } catch (err: any) {
      if (err.status === 403) throw err
      throw new BadRequestException("Ошибка при проверке видео")
    }

    // 3. Сохранить фото
    const photoId = `photo_${uuidv4().slice(0, 16)}`
    this.captureService.savePhoto(photoId, photo.buffer)

    // 4. Сохранить метаданные
    const metadata = {
      photoId,
      clientId: body.clientId,
      message: body.message || "",
      timestamp: new Date().toISOString(),
      verified: true,
      challengeId: body.challengeId,
      nonce: challenge.nonce,
    }
    this.captureService.saveMetadata(photoId, metadata)

    // 5. Удалить челлендж
    this.challengeService.delete(body.challengeId)

    // 6. Удалить временный файл (если всё ок)
    require("fs").unlinkSync(photo.path)

    // 7. Вернуть ответ
    return {
      status: "success",
      photoId,
      photoUrl: `${
        process.env.BASE_URL || "http://localhost:3000"
      }/photos/${photoId}.jpg`,
      message: body.message || "",
      verified: true,
      timestamp: metadata.timestamp,
      clientId: body.clientId,
    }
  }
}
```

**src/capture/capture.module.ts:**

```typescript
import { Module } from "@nestjs/common"
import { CaptureService } from "./capture.service"
import { CaptureController } from "./capture.controller"
import { ChallengeModule } from "../challenge/challenge.module"

@Module({
  imports: [ChallengeModule],
  controllers: [CaptureController],
  providers: [CaptureService],
})
export class CaptureModule {}
```

---

#### 3.6 Добавляем Verification контроллер

**src/app.controller.ts:**

```typescript
import { Controller, Get, Param, Res } from "@nestjs/common"
import * as fs from "fs"
import { Response } from "express"

@Controller()
export class AppController {
  @Get("photos/:photoId.jpg")
  getPhoto(@Param("photoId") photoId: string, @Res() res: Response) {
    const photoPath = `./photos/${photoId}.jpg`

    if (!fs.existsSync(photoPath)) {
      return res.status(404).json({ error: "Photo not found" })
    }

    const fileContent = fs.readFileSync(photoPath)
    res.setHeader("Content-Type", "image/jpeg")
    res.send(fileContent)
  }

  @Get("api/v1/photos/:photoId")
  getPhotoMetadata(@Param("photoId") photoId: string) {
    const metadataPath = `./photos/${photoId}.json`

    if (!fs.existsSync(metadataPath)) {
      return { status: "error", message: "Photo not found" }
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"))
    return {
      ...metadata,
      photoUrl: `${
        process.env.BASE_URL || "http://localhost:3000"
      }/photos/${photoId}.jpg`,
    }
  }
}
```

**src/app.module.ts:**

```typescript
import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { ChallengeModule } from "./challenge/challenge.module"
import { CaptureModule } from "./capture/capture.module"

@Module({
  imports: [ChallengeModule, CaptureModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
```

---

#### 3.7 Конфигурируем основной файл

**src/main.ts:**

```typescript
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // CORS для локальной разработки
  app.enableCors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })

  await app.listen(3000)
  console.log(`Server running on http://localhost:3000`)
}

bootstrap()
```

---

### Фаза 3: Реализация фронтенда

#### 3.8 Создаём компоненты React

**frontend/src/services/api.ts:**

```typescript
import axios from "axios"

export const api = axios.create({
  baseURL: process.env.VITE_API_URL || "http://localhost:3000/api/v1",
  timeout: 30000,
})

export default api
```

**frontend/src/services/crypto.ts:**

```typescript
export async function sha256(data: Blob | string): Promise<string> {
  let buffer: ArrayBuffer

  if (data instanceof Blob) {
    buffer = await data.arrayBuffer()
  } else {
    buffer = new TextEncoder().encode(data)
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}
```

**frontend/src/components/CameraCapture.tsx:**

```typescript
import React, { useEffect, useRef, useState } from "react"
import { api } from "../services/api"
import { sha256, blobToBase64 } from "../services/crypto"

interface Challenge {
  challengeId: string
  nonce: string
  polygons: any[]
  expiry: number
}

export const CameraCapture: React.FC<{ clientId: string }> = ({ clientId }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    fetchChallenge()
  }, [clientId])

  const fetchChallenge = async () => {
    try {
      const response = await api.get("/challenge", { params: { clientId } })
      setChallenge(response.data)
      startCamera()
    } catch (err) {
      setError("Ошибка при получении челленджа")
      console.error(err)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      drawLoop()
    } catch (err) {
      setError("Не удалось получить доступ к камере")
      console.error(err)
    }
  }

  const drawLoop = () => {
    if (!canvasRef.current || !videoRef.current || !challenge) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720

    const draw = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      challenge.polygons.forEach(polygon => {
        drawPolygon(ctx, polygon, canvas.width, canvas.height)
      })

      requestAnimationFrame(draw)
    }

    draw()
  }

  const drawPolygon = (
    ctx: CanvasRenderingContext2D,
    polygon: any,
    width: number,
    height: number
  ) => {
    const elapsed = Date.now() % (polygon.duration || 2000)
    const progress = elapsed / (polygon.duration || 2000)

    ctx.save()
    ctx.globalAlpha = polygon.opacity

    if (polygon.points && polygon.points.length > 0) {
      ctx.beginPath()
      ctx.moveTo(polygon.points[0][0] * width, polygon.points[0][1] * height)

      for (let i = 1; i < polygon.points.length; i++) {
        ctx.lineTo(polygon.points[i][0] * width, polygon.points[i][1] * height)
      }

      ctx.closePath()

      ctx.fillStyle = polygon.color
      ctx.fill()
      ctx.strokeStyle = polygon.color
      ctx.lineWidth = 2
      ctx.stroke()
    }

    ctx.restore()
  }

  const handleCapture = async () => {
    if (!canvasRef.current || !challenge) return

    setLoading(true)
    setError("")

    try {
      // Делаем фото
      const photoCanvas = canvasRef.current
      const photoBlob = await new Promise<Blob>(resolve => {
        photoCanvas.toBlob(
          blob => {
            if (blob) resolve(blob)
          },
          "image/jpeg",
          0.95
        )
      })

      // Записываем видео (2 сек)
      chunksRef.current = []
      const stream = photoCanvas.captureStream(30)
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.ondataavailable = event => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.start()

      await new Promise(resolve => setTimeout(resolve, 2000))
      mediaRecorder.stop()

      const videoBlob = new Blob(chunksRef.current, { type: "video/webm" })
      const videoBase64 = await blobToBase64(videoBlob)
      const videoHash = await sha256(videoBlob)

      // Отправляем на сервер
      const formData = new FormData()
      formData.append("photo", photoBlob, "photo.jpg")
      formData.append("videoBase64", videoBase64)
      formData.append("videoHash", videoHash)
      formData.append("message", message)
      formData.append("challengeId", challenge.challengeId)
      formData.append("clientId", clientId)

      const response = await api.post("/capture", formData)

      console.log("Успех:", response.data)
      // Редирект на результат
      window.location.href = `/?photoId=${response.data.photoId}&status=success`
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при отправке фото")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-white mb-4">📷 AuthPhoto</h1>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-4">{error}</div>
        )}

        <div className="relative bg-black rounded overflow-hidden mb-4">
          <video ref={videoRef} autoPlay playsInline muted className="hidden" />
          <canvas ref={canvasRef} className="w-full" />
        </div>

        <textarea
          value={message}
          onChange={e => setMessage(e.target.value.slice(0, 500))}
          placeholder="Описание фото (опционально, макс 500 символов)"
          className="w-full p-3 border border-gray-300 rounded mb-4 text-sm"
          rows={3}
        />

        <p className="text-xs text-gray-400 mb-4">
          Символов: {message.length}/500
        </p>

        <button
          onClick={handleCapture}
          disabled={loading || !challenge}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded"
        >
          {loading ? "Обработка..." : "Снять фото"}
        </button>
      </div>
    </div>
  )
}
```

**frontend/src/components/ResultScreen.tsx:**

```typescript
import React, { useEffect, useState } from "react"
import { api } from "../services/api"

interface PhotoData {
  photoId: string
  photoUrl: string
  message: string
  verified: boolean
  timestamp: string
  clientId: string
}

export const ResultScreen: React.FC<{ photoId: string }> = ({ photoId }) => {
  const [data, setData] = useState<PhotoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await api.get(`/photos/${photoId}`)
        setData(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Ошибка при получении фото")
      } finally {
        setLoading(false)
      }
    }

    fetchPhoto()
  }, [photoId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="text-4xl">✅</div>
          <h1 className="text-3xl font-bold text-green-400 ml-2">
            Фото подтверждено!
          </h1>
        </div>

        <img
          src={data.photoUrl}
          alt="Подписанное фото"
          className="w-full rounded mb-4 max-h-96 object-contain"
        />

        <div className="bg-gray-700 p-4 rounded mb-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-2">
            Сообщение:
          </h2>
          <p className="text-white">{data.message}</p>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(data.photoUrl)
            alert("Ссылка скопирована!")
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          📋 Скопировать ссылку
        </button>
      </div>
    </div>
  )
}
```

**frontend/src/App.tsx:**

```typescript
import React, { useMemo } from "react"
import { CameraCapture } from "./components/CameraCapture"
import { ResultScreen } from "./components/ResultScreen"
import "./styles/globals.css"

function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const photoId = params.get("photoId")
  const clientId = params.get("clientId") || "demo"

  if (photoId) {
    return <ResultScreen photoId={photoId} />
  }

  return <CameraCapture clientId={clientId} />
}

export default App
```

---

### Фаза 4: Запуск и тестирование

#### 3.9 Запускаем бэкенд

```bash
cd backend

# Первый запуск (разработка)
npm run start:dev

# Должно появиться:
# Server running on http://localhost:3000
```

#### 3.10 Запускаем фронтенд (в другом терминале)

```bash
cd frontend

npm run dev

# Должно появиться:
# VITE v... ready in ... ms
# ➜  Local:   http://localhost:5173/
```

---

#### 3.11 Тестируем полный поток

1. **Открыть** http://localhost:5173/?clientId=demo

2. **Нажимаем** на разрешение камеры

3. **Видим** живое видео с полигонами

4. **Пишем сообщение:** "Тестовое фото"

5. **Нажимаем** "Снять фото"

6. **Ждём** 2-3 сек

7. **Видим результат:** ✅ Фото подтверждено!

---

## 4. Docker Compose (для производства)

**docker-compose.yml:**

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - BASE_URL=http://localhost:3000
    volumes:
      - ./backend/photos:/app/photos
    networks:
      - authphoto-net

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    environment:
      - VITE_API_URL=http://localhost:3000/api/v1
    depends_on:
      - backend
    networks:
      - authphoto-net

networks:
  authphoto-net:
    driver: bridge
```

**backend/Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

**frontend/Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf:**

```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }
}
```

**Запуск:**

```bash
docker-compose up -d

# Проверить
curl http://localhost:3000/api/v1/challenge?clientId=demo
```

---

## 5. Дебаг и логирование

**Проверить логи:**

```bash
# Бэкенд
curl http://localhost:3000/api/v1/challenge?clientId=test

# Проверить сохранённые фото
ls -la backend/photos/

# Посмотреть метаданные
cat backend/photos/photo_*.json
```

**Включить debug mode (frontend):**

```typescript
// Добавить в CameraCapture.tsx
console.log("Challenge:", challenge)
console.log("Video hash:", videoHash)
console.log("Photo size:", photoBlob.size)
```

---

## 6. Дорожная карта следующих шагов

- ✅ **Week 1:** Бэкенд (Challenge + Capture)
- ✅ **Week 2:** Фронтенд (Camera + Components)
- ⬜ **Week 3:** Docker & CI/CD
- ⬜ **Week 4:** Интеграция C2PA (опционально)
- ⬜ **Week 5:** Мобильная версия (PWA)
- ⬜ **Week 6:** Деплой в production

---

## 7. Частые проблемы и решения

| Проблема                      | Решение                                            |
| ----------------------------- | -------------------------------------------------- |
| "Cannot find module 'multer'" | `npm install @nestjs/platform-express multer`      |
| "Port 3000 already in use"    | `lsof -i :3000` и убить процесс                    |
| "Camera permission denied"    | Проверить разрешения браузера (Settings → Privacy) |
| "CORS error"                  | Убедиться, что CORS включен в main.ts              |
| "Photos not saving"           | Проверить директорию `backend/photos/` существует  |

---

Всё готово к разработке! 🚀
