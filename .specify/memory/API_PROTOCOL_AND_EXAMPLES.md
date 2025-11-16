# AuthPhoto — Протокол обмена данных и примеры

**Версия:** 1.0 (Прототип)  
**Дата:** 16 ноября 2025

---

## 1. Диаграмма последовательности (Sequence Diagram)

```
Браузер (клиент)          Наш сервер              Диск/Память
     |                          |                      |
     |--- GET /challenge ------->|                      |
     |                          |                      |
     |<--- Challenge JSON -------|                      |
     |  (nonce, polygons,        |                      |
     |   expiry, challengeId)    |                      |
     |                          |                      |
     |  [Рисует полигоны поверх видео в реальном времени]
     |  [Записывает 2 сек видео с полигонами]
     |  [Делает фото]
     |  [Вычисляет SHA-256 видео]
     |                          |                      |
     |--- POST /capture -------->|                      |
     |  (photo, video,           |                      |
     |   videoHash, message,     |                      |
     |   challengeId, clientId)  |                      |
     |                          |                      |
     |                 [Пересчитывает видео-хэш]      |
     |                 [Сравнивает с полученным]      |
     |                 [Если совпадает: ОК]           |
     |                 [Если не совпадает: ОШИБКА]    |
     |                          |                      |
     |            (если ОК)      |                      |
     |                 [Создаёт C2PA манифест]        |
     |                 [Встраивает в JPEG]            |
     |                          |--- Сохранить ----->|
     |                          |   photo_xxx.jpg     |
     |                          |   photo_xxx.json    |
     |                          |                    |
     |<--- 200 OK JSON ---------|                      |
     |  (photoId, photoUrl,      |                      |
     |   verified: true,         |                      |
     |   message, timestamp)     |                      |
     |                          |                      |
     [Редирект на ваш сайт или показать результат]
```

---

## 2. Примеры данных (Request/Response)

### 2.1 Получение челленджа

**Request:**

```http
GET /api/v1/challenge?clientId=insurance_123 HTTP/1.1
Host: authphoto.ge
Accept: application/json
```

**Response (200 OK):**

```json
{
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "nonce": "a3f2b8c9e1d5a7f6b4c2d8e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9",
  "polygons": [
    {
      "id": 0,
      "points": [
        [0.15, 0.1],
        [0.35, 0.1],
        [0.35, 0.3],
        [0.15, 0.3]
      ],
      "color": "#FF5733",
      "opacity": 0.6,
      "animation": "pulse",
      "duration": 1500
    },
    {
      "id": 1,
      "points": [
        [0.55, 0.4],
        [0.75, 0.4],
        [0.65, 0.6]
      ],
      "color": "#33FF57",
      "opacity": 0.5,
      "animation": "rotate",
      "duration": 2000,
      "rotationCenter": [0.65, 0.5]
    },
    {
      "id": 2,
      "points": [
        [0.1, 0.6],
        [0.3, 0.5],
        [0.4, 0.7],
        [0.2, 0.8]
      ],
      "color": "#3357FF",
      "opacity": 0.4,
      "animation": "none"
    },
    {
      "id": 3,
      "points": [
        [0.6, 0.1],
        [0.9, 0.2],
        [0.8, 0.4],
        [0.5, 0.3]
      ],
      "color": "#FF33F5",
      "opacity": 0.55,
      "animation": "pulse",
      "duration": 1200
    },
    {
      "id": 4,
      "points": [
        [0.4, 0.7],
        [0.6, 0.65],
        [0.65, 0.85],
        [0.45, 0.9]
      ],
      "color": "#F5FF33",
      "opacity": 0.5,
      "animation": "rotate",
      "duration": 1800,
      "rotationCenter": [0.525, 0.775]
    }
  ],
  "expiry": 1731785430000,
  "createdAt": 1731785400000,
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALRiMLAA...\n-----END PUBLIC KEY-----"
}
```

---

### 2.2 Отправка фото для проверки

**Request:**

```http
POST /api/v1/capture HTTP/1.1
Host: authphoto.ge
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="photo"; filename="photo.jpg"
Content-Type: image/jpeg

[JPEG binary data]
------FormBoundary
Content-Disposition: form-data; name="videoBase64"

data:video/webm;base64,GkXfo59Ch13EjwJ...
------FormBoundary
Content-Disposition: form-data; name="videoHash"

e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
------FormBoundary
Content-Disposition: form-data; name="message"

Фото повреждения на левом крыле автомобиля, ул. Шота Руставели, Тбилиси
------FormBoundary
Content-Disposition: form-data; name="challengeId"

550e8400-e29b-41d4-a716-446655440000
------FormBoundary
Content-Disposition: form-data; name="clientId"

insurance_123
------FormBoundary--
```

**Response (200 OK — успех):**

```json
{
  "status": "success",
  "photoId": "photo_d8e3f5a7b9c1d3e5",
  "photoUrl": "https://authphoto.ge/photos/photo_d8e3f5a7b9c1d3e5.jpg",
  "message": "Фото повреждения на левом крыле автомобиля, ул. Шота Руставели, Тбилиси",
  "verified": true,
  "timestamp": "2025-11-16T17:30:45.123+04:00",
  "clientId": "insurance_123",
  "c2paManifest": {
    "title": "AuthPhoto — Защищённое фото",
    "assertions": [
      {
        "label": "com.authphoto.challenge",
        "data": {
          "challengeId": "550e8400-e29b-41d4-a716-446655440000",
          "nonce": "a3f2b8c9e1d5a7f6b4c2d8e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9",
          "polygonsCount": 5
        }
      }
    ],
    "signature": "304502206d8c3e5a7f2b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f..."
  }
}
```

**Response (400 BAD REQUEST — ошибка):**

```json
{
  "status": "error",
  "reason": "video_proof_failed",
  "message": "Фото не прошло проверку. Полигоны не совпадают. Убедитесь, что вы снимаете с камеры, а не используете скриншоты или загруженные файлы.",
  "details": {
    "expectedVideoHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "receivedVideoHash": "d3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b854",
    "match": false
  }
}
```

**Response (403 FORBIDDEN — другие ошибки):**

```json
{
  "status": "error",
  "reason": "challenge_expired",
  "message": "Челлендж истёк. Челленджи действуют 30 секунд. Пожалуйста, получите новый челлендж и попробуйте снова.",
  "expiredAt": "2025-11-16T17:30:30.123+04:00"
}
```

---

### 2.3 Получение сохранённого фото (из вашего сайта)

**Request:**

```http
GET /api/v1/photos/photo_d8e3f5a7b9c1d3e5 HTTP/1.1
Host: authphoto.ge
Authorization: Bearer sk_live_51H3E5pKxZf5wZkC1Y2...
Accept: application/json
```

**Response (200 OK):**

```json
{
  "photoId": "photo_d8e3f5a7b9c1d3e5",
  "photoUrl": "https://authphoto.ge/photos/photo_d8e3f5a7b9c1d3e5.jpg",
  "message": "Фото повреждения на левом крыле автомобиля, ул. Шота Руставели, Тбилиси",
  "verified": true,
  "timestamp": "2025-11-16T17:30:45.123+04:00",
  "clientId": "insurance_123",
  "metadata": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "ipAddress": "192.168.1.100",
    "browserFingerprint": "5a7f2b9c1d3e5a7b9c1d3e5a7b9c1d3e",
    "deviceType": "desktop"
  }
}
```

**Response (404 NOT FOUND):**

```json
{
  "status": "error",
  "reason": "photo_not_found",
  "message": "Фото не найдено или у вас нет доступа к нему."
}
```

---

## 3. Примеры фронтенд-кода (React + TypeScript)

### 3.1 Компонент для получения челленджа и рисования полигонов

```typescript
// CameraCapture.tsx
import React, { useEffect, useRef, useState } from "react"
import { ChallengeOverlay } from "./ChallengeOverlay"
import { api } from "../services/api"

interface Challenge {
  challengeId: string
  nonce: string
  polygons: Polygon[]
  expiry: number
  createdAt: number
}

interface Polygon {
  id: number
  points: [number, number][]
  color: string
  opacity: number
  animation?: "pulse" | "rotate" | "none"
  duration?: number
  rotationCenter?: [number, number]
}

export const CameraCapture: React.FC<{ clientId: string }> = ({ clientId }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const chunksRef = useRef<Blob[]>([])

  // 1. Загрузить челлендж при инициализации
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await api.get("/challenge", {
          params: { clientId },
        })
        setChallenge(response.data)
        startCamera()
      } catch (err) {
        setError("Ошибка при получении челленджа")
        console.error(err)
      }
    }

    fetchChallenge()
  }, [clientId])

  // 2. Запустить камеру и рисовать полигоны
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

  // 3. Цикл рисования: видео + полигоны
  const drawLoop = () => {
    if (!canvasRef.current || !videoRef.current || !challenge) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Установить размер canvas
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720

    const draw = () => {
      // Рисуем видео
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Рисуем полигоны поверх видео (с анимацией)
      challenge.polygons.forEach(polygon => {
        drawPolygon(ctx, polygon, canvas.width, canvas.height)
      })

      requestAnimationFrame(draw)
    }

    draw()
  }

  // 4. Рисование одного полигона (с анимацией)
  const drawPolygon = (
    ctx: CanvasRenderingContext2D,
    polygon: Polygon,
    width: number,
    height: number
  ) => {
    const elapsed = Date.now() % (polygon.duration || 2000)
    const progress = elapsed / (polygon.duration || 2000)

    ctx.save()

    // Определить центр полигона для вращения
    let centerX = width / 2
    let centerY = height / 2

    if (polygon.rotationCenter) {
      centerX = polygon.rotationCenter[0] * width
      centerY = polygon.rotationCenter[1] * height
    } else if (polygon.points.length > 0) {
      // Среднее значение координат
      centerX =
        (polygon.points.reduce((sum, p) => sum + p[0], 0) /
          polygon.points.length) *
        width
      centerY =
        (polygon.points.reduce((sum, p) => sum + p[1], 0) /
          polygon.points.length) *
        height
    }

    // Применить трансформацию для анимации
    ctx.translate(centerX, centerY)

    if (polygon.animation === "rotate") {
      ctx.rotate(progress * Math.PI * 2 * -1) // Обратное вращение для эффекта
    }

    ctx.translate(-centerX, -centerY)

    // Рисовать путь полигона
    ctx.beginPath()
    const firstPoint = polygon.points[0]
    ctx.moveTo(firstPoint[0] * width, firstPoint[1] * height)

    for (let i = 1; i < polygon.points.length; i++) {
      const point = polygon.points[i]
      ctx.lineTo(point[0] * width, point[1] * height)
    }

    ctx.closePath()

    // Применить opacity (с пульсацией, если включена)
    let opacity = polygon.opacity
    if (polygon.animation === "pulse") {
      opacity = polygon.opacity * (0.6 + 0.4 * Math.sin(progress * Math.PI * 2))
    }

    ctx.fillStyle = `${polygon.color}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`
    ctx.strokeStyle = polygon.color
    ctx.lineWidth = 2

    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }

  // 5. Обработка клика "Снять фото"
  const handleCapture = async () => {
    if (!canvasRef.current || !challenge) return

    setLoading(true)
    setError("")

    try {
      // Остановить цикл рисования (canvas замирает)
      // Сделать фото
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

      // Записать 2 сек видео
      chunksRef.current = []
      const stream = photoCanvas.captureStream(30) // 30 FPS
      const mimeType = "video/webm;codecs=vp9"
      const mediaRecorder = new MediaRecorder(stream, { mimeType })

      mediaRecorder.ondataavailable = event => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.start()

      // Записывать 2 сек
      await new Promise(resolve => setTimeout(resolve, 2000))
      mediaRecorder.stop()

      // Дождаться окончания записи
      await new Promise(resolve => {
        mediaRecorder.onstart = () => {
          mediaRecorder.onstop = resolve
        }
      })

      // Получить видео как Blob
      const videoBlob = new Blob(chunksRef.current, { type: "video/webm" })
      const videoBase64 = await blobToBase64(videoBlob)

      // Вычислить хэш видео
      const videoHash = await sha256(videoBlob)

      // Отправить на сервер
      const formData = new FormData()
      formData.append("photo", photoBlob, "photo.jpg")
      formData.append("videoBase64", videoBase64)
      formData.append("videoHash", videoHash)
      formData.append("message", message)
      formData.append("challengeId", challenge.challengeId)
      formData.append("clientId", clientId)

      const response = await api.post("/capture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Успех!
      console.log("Фото подтверждено:", response.data)
      // Редирект или показать результат
      window.location.href = response.data.photoUrl // Или custom обработка
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

// Вспомогательные функции
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

async function sha256(data: Blob | string): Promise<string> {
  let buffer: ArrayBuffer

  if (data instanceof Blob) {
    buffer = await data.arrayBuffer()
  } else {
    buffer = new TextEncoder().encode(data)
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}
```

---

### 3.2 Компонент результата (ResultScreen.tsx)

```typescript
// ResultScreen.tsx
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

export const ResultScreen: React.FC<{ photoId: string; clientId: string }> = ({
  photoId,
  clientId,
}) => {
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

        <div className="bg-gray-700 p-4 rounded mb-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-2">
            Информация:
          </h2>
          <ul className="text-sm text-gray-300">
            <li>
              📝 ID:{" "}
              <code className="bg-gray-900 px-2 py-1 rounded">
                {data.photoId}
              </code>
            </li>
            <li>
              ✓ Статус: <span className="text-green-400">Аутентично</span>
            </li>
            <li>
              🕐 Время: {new Date(data.timestamp).toLocaleString("ru-GE")}
            </li>
            <li>
              🔗 Ссылка:{" "}
              <a
                href={data.photoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Открыть
              </a>
            </li>
          </ul>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(data.photoUrl)
            alert("Ссылка скопирована в буфер обмена!")
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
        >
          📋 Скопировать ссылку на фото
        </button>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          📷 Сделать ещё одно фото
        </button>
      </div>
    </div>
  )
}
```

---

## 4. Примеры бэкенд-кода (NestJS + TypeScript)

### 4.1 ChallengeService

```typescript
// challenge.service.ts
import { Injectable } from "@nestjs/common"
import { v4 as uuidv4 } from "uuid"
import * as crypto from "crypto"

interface Polygon {
  id: number
  points: [number, number][]
  color: string
  opacity: number
  animation?: "pulse" | "rotate" | "none"
  duration?: number
  rotationCenter?: [number, number]
}

interface Challenge {
  challengeId: string
  nonce: string
  polygons: Polygon[]
  expiry: number
  createdAt: number
}

@Injectable()
export class ChallengeService {
  private challenges = new Map<string, Challenge>()
  private CHALLENGE_DURATION_MS = 30000 // 30 сек

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
    const colors = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#FF33F5",
      "#F5FF33",
      "#FF8C33",
    ]
    const animations: ("pulse" | "rotate" | "none")[] = [
      "pulse",
      "rotate",
      "none",
    ]
    const durations = [1200, 1500, 1800, 2000]

    const polygons: Polygon[] = []

    for (let i = 0; i < 5; i++) {
      const polygonType = Math.random()
      let points: [number, number][] = []

      if (polygonType < 0.4) {
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
      } else if (polygonType < 0.7) {
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
        const x1 = Math.random() * 0.7
        const y1 = Math.random() * 0.7
        const x2 = x1 + Math.random() * 0.2
        const y2 = y1 + Math.random() * 0.1
        const x3 = x1 + Math.random() * 0.15
        const y3 = y1 + Math.random() * 0.2
        const x4 = x1 - Math.random() * 0.1
        const y4 = y1 + Math.random() * 0.15
        points = [
          [x1, y1],
          [x2, y2],
          [x3, y3],
          [x4, y4],
        ]
      }

      const animation =
        animations[Math.floor(Math.random() * animations.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const duration = durations[Math.floor(Math.random() * durations.length)]
      const opacity = Math.random() * 0.3 + 0.4 // 0.4 - 0.7

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

---

### 4.2 CaptureController

```typescript
// capture.controller.ts
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpCode,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { CaptureService } from "./capture.service"
import { ChallengeService } from "../challenge/challenge.service"
import { Request } from "express"
import * as fs from "fs"
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
    // Парсить JSON из body
    let payload: any
    try {
      payload = {
        videoBase64: body.videoBase64,
        videoHash: body.videoHash,
        message: body.message,
        challengeId: body.challengeId,
        clientId: body.clientId,
      }
    } catch {
      throw new BadRequestException("Неверный формат данных")
    }

    const { videoBase64, videoHash, message, challengeId, clientId } = payload

    // Валидация
    if (!photo) throw new BadRequestException("Фото не загружено")
    if (!videoBase64) throw new BadRequestException("Видео не загружено")
    if (!videoHash) throw new BadRequestException("Хэш видео не загружен")
    if (!challengeId) throw new BadRequestException("Challenge ID не передан")
    if (!clientId) throw new BadRequestException("Client ID не передан")
    if (message && message.length > 500) {
      throw new BadRequestException(
        "Сообщение слишком длинное (макс 500 символов)"
      )
    }

    // 1. Получить челлендж
    const challenge = this.challengeService.get(challengeId)
    if (!challenge) {
      throw new ForbiddenException({
        status: "error",
        reason: "challenge_expired",
        message:
          "Челлендж истёк или не найден. Получите новый челлендж и попробуйте снова.",
      })
    }

    // 2. Пересчитать видео-хэш и сравнить
    try {
      // Декодировать videoBase64
      const videoBuffer = Buffer.from(videoBase64.split(",")[1], "base64")

      // Пересчитать хэш
      const expectedVideoHash = await this.captureService.calculateVideoHash(
        videoBuffer
      )

      if (expectedVideoHash !== videoHash) {
        throw new ForbiddenException({
          status: "error",
          reason: "video_proof_failed",
          message:
            "Фото не прошло проверку. Полигоны не совпадают. Убедитесь, что вы снимаете с камеры, а не используете скриншоты или загруженные файлы.",
        })
      }
    } catch (err: any) {
      if (err.status === 403) throw err
      throw new BadRequestException("Ошибка при проверке видео")
    }

    // 3. Сохранить фото и метаданные
    const photoId = `photo_${uuidv4().slice(0, 16)}`
    const photoPath = `./photos/${photoId}.jpg`
    const metadataPath = `./photos/${photoId}.json`

    fs.mkdirSync("./photos", { recursive: true })
    fs.copyFileSync(photo.path, photoPath)
    fs.unlinkSync(photo.path) // Удалить временный файл

    const metadata = {
      photoId,
      clientId,
      message: message || "",
      timestamp: new Date().toISOString(),
      verified: true,
      challengeId,
      nonce: challenge.nonce,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    }

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))

    // 4. Удалить челлендж
    this.challengeService.delete(challengeId)

    // 5. Вернуть ответ
    return {
      status: "success",
      photoId,
      photoUrl: `${
        process.env.BASE_URL || "http://localhost:3000"
      }/photos/${photoId}.jpg`,
      message: message || "",
      verified: true,
      timestamp: metadata.timestamp,
      clientId,
    }
  }
}
```

---

## 5. Примеры ошибок и как их обработать

| Ошибка                    | Код      | Сообщение                                           | Действие пользователя                       |
| ------------------------- | -------- | --------------------------------------------------- | ------------------------------------------- |
| Челлендж истёк            | 403      | "Челлендж истёк (30 сек). Получите новый челлендж." | Обновить страницу / получить новый челлендж |
| Видео-хэш не совпадает    | 403      | "Полигоны не совпадают. Снимайте с камеры."         | Попробовать снова (новое фото)              |
| Фото не загружено         | 400      | "Фото не загружено"                                 | Выбрать фото                                |
| Видео не загружено        | 400      | "Видео не загружено"                                | Техническая ошибка — обновить страницу      |
| Сообщение слишком длинное | 400      | "Сообщение слишком длинное (макс 500 символов)"     | Сократить сообщение                         |
| Камера недоступна         | JS Error | "Не удалось получить доступ к камере"               | Проверить разрешения браузера               |

---

## 6. Итоговый поток (краткое резюме)

```
ПОЛЬЗОВАТЕЛЬ                БРАУЗЕР                НАШ СЕРВЕР              ДИСК
     |                         |                       |                      |
     |--- Нажимает кнопку ----->|                       |                      |
     |                         |--- GET /challenge ---->|                      |
     |                         |<--- Challenge ---------|                      |
     |                    [Рисует полигоны]             |                      |
     |                     [Записывает видео]           |                      |
     |--- Нажимает "Снять" -->|                       |                      |
     |                    [Берёт фото + видео]         |                      |
     |                    [Вычисляет хэш]              |                      |
     |                         |--- POST /capture ----->|                      |
     |                         |   (фото, видео, хэш)  |                      |
     |                         |  [Проверяет хэш]      |                      |
     |                         |  [Если ОК: сохраняет] |--- Сохранить ----->|
     |                         |                       |  photo_xxx.jpg      |
     |                         |<--- 200 OK -----------|  photo_xxx.json     |
     |                    [Показывает результат]       |                      |
     |--- Может копировать ссылку и делиться ---|----->|                      |
```

**Ваше интегрирование:**

```
Ваш сайт (example.ge)
     |
     |--- Встраиваете кнопку с нашей ссылкой
     |--- Пользователь нажимает → AuthPhoto открывается
     |--- После успеха: получаете photoId и photoUrl
     |--- Можете проверить фото API запросом
```

---

Этот документ содержит всё необходимое для разработки и интеграции. 🚀
