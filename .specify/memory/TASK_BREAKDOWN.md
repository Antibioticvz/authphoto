# Разбор проекта на задачи разработки
## AuthPhoto MVP — Полный план с GitHub Issues

**Версия:** 1.0  
**Всего задач:** 47  
**Estimated timeline:** 3 недели  
**Team:** 2 разработчика (1 frontend, 1 backend) + 1 full-stack (опционально)

---

## 📊 СТРУКТУРА ЗАДАЧ

```
WEEK 1: Backend Infrastructure
├── WEEK 1.1: Project Setup (2 дня)
├── WEEK 1.2: Challenge Service (2 дня)
├── WEEK 1.3: Testing & CI/CD (1 день)

WEEK 2: Frontend + Integration
├── WEEK 2.1: Frontend Setup (1 день)
├── WEEK 2.2: Camera & Capture (2 дня)
├── WEEK 2.3: Integration & Testing (1 день)

WEEK 3: Optimization & Polish
├── WEEK 3.1: Performance (1 день)
├── WEEK 3.2: Mobile Testing (1 день)
├── WEEK 3.3: Production Ready (1 день)
```

---

## 🎯 PHASE 1: BACKEND INFRASTRUCTURE (5 дней)

### WEEK 1.1: Project Setup & Architecture (2 дня)

#### Task 1.1.1: NestJS Project Initialization
**Priority:** 🔴 CRITICAL  
**Assigned:** Backend Lead  
**Depends on:** None  
**Time estimate:** 2-3 hours  
**Status:** Not Started

**Description:**
- Initialize NestJS project with TypeScript strict mode
- Setup .env configuration
- Setup development & production environments
- Configure linting (ESLint) and formatting (Prettier)
- Setup Docker & docker-compose
- Configure package.json scripts

**Acceptance Criteria:**
- ✅ `npm run dev` запускает сервер на localhost:3000
- ✅ TypeScript strict mode enabled
- ✅ ESLint passing without warnings
- ✅ Docker image builds successfully
- ✅ Health check endpoint работает: GET /api/v1/health

**Files to create:**
```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   └── app.service.ts
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── tsconfig.json
├── eslintrc.json
├── prettierrc
└── nest-cli.json
```

**Related docs:** DEVELOPMENT_GUIDE.md, constitution.md

---

#### Task 1.1.2: Shared Services & Utilities
**Priority:** 🔴 CRITICAL  
**Assigned:** Backend Lead  
**Depends on:** 1.1.1  
**Time estimate:** 3-4 hours  
**Status:** Not Started

**Description:**
- CryptoService (SHA-256 hashing, UUID generation, nonce generation)
- LoggerService (structured logging)
- CacheService (in-memory cache with TTL)
- Configuration service
- Global exception filter
- Global response interceptor

**Acceptance Criteria:**
- ✅ CryptoService generates valid SHA-256 hashes
- ✅ LoggerService outputs structured JSON logs
- ✅ CacheService TTL works correctly
- ✅ Global error handling returns consistent format
- ✅ All 4 services fully typed with TypeScript

**Files to create:**
```
src/
├── shared/
│   ├── shared.module.ts
│   ├── services/
│   │   ├── crypto.service.ts
│   │   ├── logger.service.ts
│   │   ├── cache.service.ts
│   │   └── __tests__/
│   │       ├── crypto.service.spec.ts
│   │       ├── logger.service.spec.ts
│   │       └── cache.service.spec.ts
│   └── types/
│       └── shared.types.ts
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   ├── transform.interceptor.ts
│   │   └── performance.interceptor.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── decorators/
│       └── api-response.decorator.ts
└── config/
    ├── configuration.ts
    ├── database.config.ts
    └── logger.config.ts
```

**Related docs:** DEVELOPMENT_PLAN.md (Backend section)

---

### WEEK 1.2: Challenge Service Development (2 дня)

#### Task 1.2.1: Challenge Module & Service
**Priority:** 🔴 CRITICAL  
**Assigned:** Backend Lead  
**Depends on:** 1.1.2  
**Time estimate:** 4-5 hours  
**Status:** Not Started

**Description:**
- Create ChallengeModule
- Implement ChallengeService (business logic)
  - `generateChallenge()` - create random polygons + nonce
  - `validateChallenge()` - verify challenge exists & not expired
  - `markChallengeAsUsed()` - mark for single-use
- Polygon generation algorithm (5-7 random polygons)
- Store challenges in cache (30-second TTL)
- Event/Observer pattern for challenge lifecycle

**Acceptance Criteria:**
- ✅ Challenge generated with unique ID, nonce, 5-7 polygons
- ✅ Challenge expires after 30 seconds
- ✅ Cannot use same challenge twice
- ✅ ChallengeService fully typed
- ✅ Unit tests: 90%+ coverage

**Code outline:**
```typescript
// src/modules/challenge/challenge.service.ts
@Injectable()
export class ChallengeService {
  generateChallenge(clientId: string): Challenge;
  validateChallenge(challengeId: string): Promise<Challenge>;
  markChallengeAsUsed(challengeId: string): Promise<void>;
  private generateRandomPolygons(): Polygon[];
}
```

**Files to create:**
```
src/modules/challenge/
├── challenge.module.ts
├── challenge.service.ts
├── challenge.controller.ts (empty for now)
├── dto/
│   └── create-challenge.dto.ts
├── entities/
│   └── challenge.entity.ts
├── types/
│   └── challenge.types.ts
└── __tests__/
    └── challenge.service.spec.ts
```

**Related docs:** ARCHITECTURE_PATTERNS.md (Factory pattern), TECHNICAL_SPECIFICATION.md (section 2)

---

#### Task 1.2.2: Challenge Controller & API
**Priority:** 🔴 CRITICAL  
**Assigned:** Backend Lead  
**Depends on:** 1.2.1  
**Time estimate:** 2-3 hours  
**Status:** Not Started

**Description:**
- Create ChallengeController with GET /challenge endpoint
- Input validation (clientId parameter)
- Response mapping to DTO
- API versioning (v1)
- Rate limiting decorator
- Swagger/OpenAPI documentation

**Acceptance Criteria:**
- ✅ GET /api/v1/challenge?clientId=test returns 200
- ✅ Response format matches API spec
- ✅ Rate limiting works (max 10 req/min per clientId)
- ✅ Invalid clientId returns 400
- ✅ Response time < 200ms

**API Response example:**
```json
{
  "status": "success",
  "data": {
    "challengeId": "uuid-xxx",
    "nonce": "random-nonce",
    "polygons": [
      { "x": 0.1, "y": 0.2, "size": 0.15 },
      ...
    ],
    "expiresAt": "2025-11-16T10:05:00Z"
  },
  "timestamp": "2025-11-16T10:00:00Z"
}
```

**Files to create/modify:**
```
src/modules/challenge/
├── challenge.controller.ts (new)
├── dto/
│   └── challenge-response.dto.ts (new)
└── __tests__/
    └── challenge.controller.spec.ts (new)
```

**Related docs:** API_PROTOCOL_AND_EXAMPLES.md

---

#### Task 1.2.3: Capture & Verification Services
**Priority:** 🟠 HIGH  
**Assigned:** Backend Lead  
**Depends on:** 1.2.1  
**Time estimate:** 4-5 hours  
**Status:** Not Started

**Description:**
- Create CaptureModule & CaptureService
  - `capturePhoto()` - validate & store photo
  - `verifyPhoto()` - compare video hash with challenge nonce
- Create VerificationModule & VerificationService
  - `getPhotoStatus()` - retrieve photo with metadata
  - `validatePhotoIntegrity()` - verify no tampering
- Storage strategy (file-based for MVP)
- Photo metadata storage (JSON files)
- Error handling for fraud attempts

**Acceptance Criteria:**
- ✅ Photo stored with correct hash validation
- ✅ Invalid video hash rejects upload (returns 400)
- ✅ Photo metadata retrievable by ID
- ✅ 30-day TTL on stored photos
- ✅ Unit tests: 80%+ coverage

**Algorithms:**
1. **Video Hash Validation:**
   - Client records video during 2-second capture window
   - Server recalculates expected hash from nonce
   - Compares: `SHA256(video_frames) === challenge.hash`
   - If mismatch: Fraud detected ❌

2. **Photo Storage:**
   - Save photo file: `/photos/{photoId}.jpg`
   - Save metadata: `/photos/metadata/{photoId}.json`
   - Include: timestamp, clientId, message, hash, status

**Files to create:**
```
src/modules/capture/
├── capture.module.ts
├── capture.service.ts
├── capture.controller.ts
├── dto/
│   ├── capture-photo.dto.ts
│   └── capture-response.dto.ts
├── entities/
│   └── photo.entity.ts
└── __tests__/
    └── capture.service.spec.ts

src/modules/verification/
├── verification.module.ts
├── verification.service.ts
├── verification.controller.ts
├── types/
│   └── verification.types.ts
└── __tests__/
    └── verification.service.spec.ts

src/modules/storage/
├── storage.module.ts
├── storage.service.ts (abstract)
├── file-storage.service.ts (implementation)
└── types/
    └── storage.types.ts
```

**Related docs:** ARCHITECTURE_PATTERNS.md (Strategy, Repository patterns)

---

### WEEK 1.3: Testing & Documentation (1 день)

#### Task 1.3.1: Unit Tests for Backend Services
**Priority:** 🟠 HIGH  
**Assigned:** Backend Lead  
**Depends on:** 1.2.3  
**Time estimate:** 3-4 hours  
**Status:** Not Started

**Description:**
- Write unit tests for all services (Jest)
- Mock external dependencies
- Test happy paths + error cases
- Aim for 80%+ code coverage
- Test data factories

**Test coverage:**
- CryptoService: 100% (10 tests)
- ChallengeService: 90% (15 tests)
- CaptureService: 85% (12 tests)
- VerificationService: 80% (10 tests)

**Acceptance Criteria:**
- ✅ `npm run test` passes all tests
- ✅ Coverage report: 80%+ overall
- ✅ No skipped tests (.skip)
- ✅ Tests run in < 5 seconds
- ✅ CI/CD pipeline configured

**Files to create:**
```
src/**/__tests__/
├── *.spec.ts (for each service)
└── fixtures/
    ├── challenge.fixture.ts
    ├── photo.fixture.ts
    └── crypto.fixture.ts
```

**Related docs:** DEVELOPMENT_GUIDE.md (Testing section)

---

#### Task 1.3.2: API Documentation & Swagger
**Priority:** 🟡 MEDIUM  
**Assigned:** Backend Lead  
**Depends on:** 1.2.2, 1.2.3  
**Time estimate:** 2 hours  
**Status:** Not Started

**Description:**
- Setup Swagger/OpenAPI documentation
- Document all 3 endpoints:
  - GET /api/v1/challenge
  - POST /api/v1/capture
  - GET /api/v1/photos/:photoId
- Add request/response examples
- Add error codes documentation

**Acceptance Criteria:**
- ✅ Swagger UI accessible at /api/docs
- ✅ All endpoints documented
- ✅ Request/response examples included
- ✅ Error codes documented (400, 404, 429, 500)

**Files to create/modify:**
```
src/
├── main.ts (add Swagger setup)
└── swagger.ts (new)
```

**Related docs:** API_PROTOCOL_AND_EXAMPLES.md

---

## 🎨 PHASE 2: FRONTEND + INTEGRATION (4 дня)

### WEEK 2.1: Frontend Project Setup (1 день)

#### Task 2.1.1: React + Vite Project Initialization
**Priority:** 🔴 CRITICAL  
**Assigned:** Frontend Lead  
**Depends on:** None  
**Time estimate:** 2-3 hours  
**Status:** Not Started

**Description:**
- Initialize React 18 + Vite + TypeScript project
- Setup Tailwind CSS
- Configure linting (ESLint + Prettier)
- Setup testing framework (Vitest + React Testing Library)
- Configure path aliases (@features, @shared, etc)
- Setup .env configuration

**Acceptance Criteria:**
- ✅ `npm run dev` starts dev server on localhost:5173
- ✅ TypeScript strict mode enabled
- ✅ Tailwind CSS working
- ✅ ESLint passing
- ✅ Vite HMR working (fast refresh)

**Files to create:**
```
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.cjs
├── vitest.config.ts
├── .env.example
├── package.json
└── index.html
```

**Related docs:** DEVELOPMENT_PLAN.md (Frontend section), PERFORMANCE_OPTIMIZATION.md (Vite config)

---

#### Task 2.1.2: Shared Components & Utilities
**Priority:** 🔴 CRITICAL  
**Assigned:** Frontend Lead  
**Depends on:** 2.1.1  
**Time estimate:** 3-4 hours  
**Status:** Not Started

**Description:**
- Create folder structure (features, shared, pages, layouts)
- Build reusable components:
  - Button
  - Spinner/Loading
  - Card
  - Modal
  - Input
  - Error Boundary
- Create utility functions:
  - API client (axios instance)
  - Crypto utilities (SHA-256)
  - Formatters
  - Validators
- Setup shared hooks:
  - useMediaQuery (responsive)
  - useLocalStorage
  - useDebounce
  - useAsync

**Acceptance Criteria:**
- ✅ All shared components fully typed
- ✅ Components work on mobile (44px touch targets)
- ✅ Dark mode support
- ✅ Components have TypeScript interface exports
- ✅ Stories/documentation for components

**Files to create:**
```
src/shared/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── Button.types.ts
│   ├── Spinner/
│   ├── Card/
│   ├── Modal/
│   ├── ErrorBoundary/
│   └── Input/
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useAsync.ts
├── services/
│   ├── api.ts
│   ├── crypto.ts
│   └── logger.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
├── types/
│   └── common.types.ts
└── styles/
    └── globals.css
```

**Related docs:** DEVELOPMENT_PLAN.md (React components), MOBILE_FIRST_DESIGN.md

---

### WEEK 2.2: Camera & Capture Feature (2 дня)

#### Task 2.2.1: Camera Component & Polygon Overlay
**Priority:** 🔴 CRITICAL  
**Assigned:** Frontend Lead  
**Depends on:** 2.1.2  
**Time estimate:** 5-6 hours  
**Status:** Not Started

**Description:**
- Create CameraCapture component
  - Access device camera (getUserMedia)
  - Display live video stream
  - Handle camera permissions
- Create PolygonOverlay component
  - Draw random polygons on canvas overlay
  - Support 5-7 polygons
  - Animate polygons (optional)
- Handle edge cases:
  - No camera permission
  - Camera not available
  - Browser not supported
- Mobile-friendly (full screen, portrait mode)

**Acceptance Criteria:**
- ✅ Camera streams live video
- ✅ Polygons render correctly on canvas
- ✅ Works on iOS Safari & Android Chrome
- ✅ Handles permission denied gracefully
- ✅ Layout responsive (mobile-first)
- ✅ No console errors

**Code outline:**
```typescript
// src/features/camera/components/CameraCapture.tsx
export const CameraCapture: React.FC<CameraCaptureProps> = ({ clientId, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { initCamera, takePhoto, captureVideo } = useCamera(videoRef, canvasRef);
  const { challenge, drawPolygons } = useChallengePolygons(clientId);
  // Implementation
};
```

**Files to create:**
```
src/features/camera/
├── components/
│   ├── CameraCapture.tsx
│   ├── PolygonOverlay.tsx
│   ├── CameraPreview.tsx
│   └── CameraCapture.module.css
├── hooks/
│   ├── useCamera.ts
│   ├── useChallengePolygons.ts
│   └── useVideoCapture.ts
├── types/
│   └── camera.types.ts
└── __tests__/
    ├── CameraCapture.test.tsx
    └── useCamera.test.ts
```

**Related docs:** ARCHITECTURE_PATTERNS.md (Observer pattern), MOBILE_FIRST_DESIGN.md

---

#### Task 2.2.2: Photo Capture & Upload
**Priority:** 🔴 CRITICAL  
**Assigned:** Frontend Lead  
**Depends on:** 2.2.1  
**Time estimate:** 4-5 hours  
**Status:** Not Started

**Description:**
- Capture photo from video stream
- Compress/optimize photo before upload
- Capture 2-second video for verification
- Upload photo + video + message to backend
- Handle upload progress
- Handle errors & retries
- Store challenge locally during upload

**Technical:**
- Canvas -> JPEG blob (quality 0.85)
- Video recording from canvas (2 seconds, 30fps)
- MultipartFormData POST with files
- Calculate SHA-256 of video
- Rate limiting (prevent spam)

**Acceptance Criteria:**
- ✅ Photo captured and uploaded successfully
- ✅ Video hash calculated correctly
- ✅ Upload progress shown to user
- ✅ Errors handled gracefully
- ✅ Message optional field (max 500 chars)
- ✅ Response time < 5 seconds

**Code outline:**
```typescript
// src/features/camera/services/captureService.ts
export const capturePhoto = async (
  canvas: HTMLCanvasElement,
  video: Blob,
  message: string,
  challenge: Challenge
): Promise<CaptureResult> => {
  const photo = await extractAndCompress(canvas);
  const videoHash = await calculateHash(video);
  const formData = new FormData();
  // Upload
};
```

**Files to create:**
```
src/features/camera/
├── services/
│   ├── captureService.ts
│   ├── photoOptimization.ts
│   └── hashCalculation.ts
├── store/
│   └── cameraStore.ts (Zustand)
└── types/
    └── capture.types.ts
```

**Related docs:** PERFORMANCE_OPTIMIZATION.md (Image optimization), API_PROTOCOL_AND_EXAMPLES.md

---

### WEEK 2.3: Integration & Testing (1 день)

#### Task 2.3.1: Frontend-Backend Integration
**Priority:** 🔴 CRITICAL  
**Assigned:** Full-Stack  
**Depends on:** 1.2.2, 2.2.2  
**Time estimate:** 3-4 hours  
**Status:** Not Started

**Description:**
- Connect frontend API client to backend endpoints
- Test GET /challenge flow
- Test POST /capture flow with real backend
- Test GET /photos/:photoId flow
- Handle API errors gracefully
- CORS configuration verification

**Test scenarios:**
1. ✅ Get challenge -> Display polygons -> Capture photo -> Upload -> Success
2. ✅ Get challenge -> Wrong video hash -> Upload -> 400 error
3. ✅ Network error during upload -> Retry -> Success
4. ✅ Rate limit hit -> 429 error -> Show message

**Files to modify:**
```
src/shared/services/
├── api.ts (update endpoints)
└── env.ts (add API_URL config)
```

**Related docs:** API_PROTOCOL_AND_EXAMPLES.md

---

#### Task 2.3.2: Frontend Unit & Integration Tests
**Priority:** 🟠 HIGH  
**Assigned:** Frontend Lead  
**Depends on:** 2.2.2  
**Time estimate:** 3-4 hours  
**Status:** Not Started

**Description:**
- Write unit tests for custom hooks
- Write component tests (Vitest + React Testing Library)
- Write integration tests for full flows
- Test error states
- Aim for 70%+ coverage

**Test coverage:**
- useCamera hook: 90% (8 tests)
- CameraCapture component: 80% (10 tests)
- captureService: 85% (12 tests)
- useChallengePolygons: 85% (8 tests)

**Acceptance Criteria:**
- ✅ `npm run test` passes all tests
- ✅ Coverage > 70%
- ✅ No flaky tests
- ✅ Tests run < 10 seconds

**Files to create:**
```
src/features/camera/__tests__/
├── CameraCapture.test.tsx
├── useCamera.test.ts
├── useChallengePolygons.test.ts
└── fixtures/
```

**Related docs:** DEVELOPMENT_GUIDE.md (Testing section)

---

#### Task 2.3.3: Result Display & Photo Verification
**Priority:** 🟠 HIGH  
**Assigned:** Frontend Lead  
**Depends on:** 2.3.1  
**Time estimate:** 2-3 hours  
**Status:** Not Started

**Description:**
- Create ResultScreen component
- Display photo with verification status:
  - ✅ Verified & Authentic
  - ❌ Fraud Detected
  - ⚠️ Pending Verification
- Show metadata (timestamp, client message)
- Show shareable link
- QR code for embedded link (optional)
- Copy/Share buttons

**UI States:**
1. Loading (spinner)
2. Success (green checkmark, photo, metadata)
3. Error (red X, error message, retry button)
4. Share (copy link, QR code)

**Files to create:**
```
src/features/verification/
├── components/
│   ├── ResultScreen.tsx
│   ├── VerificationStatus.tsx
│   └── ResultScreen.module.css
├── hooks/
│   └── usePhotoVerification.ts
├── types/
│   └── verification.types.ts
└── __tests__/
    └── ResultScreen.test.tsx
```

**Related docs:** MOBILE_FIRST_DESIGN.md

---

## ⚡ PHASE 3: OPTIMIZATION & POLISH (3 дня)

### WEEK 3.1: Performance Optimization (1 день)

#### Task 3.1.1: Bundle Size Optimization
**Priority:** 🟠 HIGH  
**Assigned:** Frontend Lead  
**Depends on:** 2.3.3  
**Time estimate:** 2-3 hours  
**Status:** Not Started

**Description:**
- Analyze bundle size with `npm run analyze`
- Code splitting (lazy load routes)
- Tree shaking & dead code elimination
- Optimize dependencies
- Target: < 200KB gzipped

**Optimization checklist:**
- [ ] Lazy load Result page
- [ ] Tree shake unused utilities
- [ ] Use dynamic imports for heavy libs
- [ ] Check vendor chunk sizes
- [ ] Remove dev dependencies from prod

**Acceptance Criteria:**
- ✅ Bundle size < 200KB gzipped
- ✅ FCP < 2 seconds
- ✅ LCP < 2.5 seconds
- ✅ Lighthouse score > 90

**Files to modify:**
```
frontend/
├── vite.config.ts (chunking strategy)
└── src/
    └── App.tsx (lazy routes)
```

**Related docs:** PERFORMANCE_OPTIMIZATION.md

---

#### Task 3.1.2: Backend Query Optimization & Caching
**Priority:** 🟠 HIGH  
**Assigned:** Backend Lead  
**Depends on:** 1.3.1  
**Time estimate:** 2-3 hours  
**Status:** Not Started

**Description:**
- Optimize ChallengeService queries
- Add response caching (30 seconds)
- Optimize photo retrieval
- Add performance monitoring logs
- Monitor response times

**Optimization:**
- Cache challenge lookups
- Index cache by clientId
- Remove unnecessary fields from responses
- Compress JSON responses

**Acceptance Criteria:**
- ✅ GET /challenge response < 100ms
- ✅ POST /capture response < 500ms
- ✅ GET /photos/:id response < 200ms
- ✅ P95 response time < 500ms

**Files to modify:**
```
src/
├── shared/services/cache.service.ts (optimize)
├── modules/challenge/challenge.service.ts (add caching)
└── common/interceptors/performance.interceptor.ts (new)
```

**Related docs:** PERFORMANCE_OPTIMIZATION.md (Backend section)

---

#### Task 3.1.3: Frontend Performance Metrics
**Priority:** 🟡 MEDIUM  
**Assigned:** Frontend Lead  
**Depends on:** 2.3.3  
**Time estimate:** 2 hours  
**Status:** Not Started

**Description:**
- Setup Core Web Vitals monitoring
- Track FCP, LCP, CLS, FID
- Add performance observer
- Log metrics to console in dev
- Send to monitoring service in prod (optional)

**Metrics to track:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
- Time to Interactive (TTI)

**Files to create:**
```
src/shared/utils/
├── performanceMonitoring.ts (new)
└── metricsLogger.ts (new)
```

**Related docs:** PERFORMANCE_OPTIMIZATION.md (Monitoring section)

---

### WEEK 3.2: Mobile Testing & Polish (1 день)

#### Task 3.2.1: Mobile Device Testing
**Priority:** 🟠 HIGH  
**Assigned:** QA Lead or Frontend Lead  
**Depends on:** 2.3.3  
**Time estimate:** 3-4 hours  
**Status:** Not Started

**Description:**
- Test on real devices:
  - iPhone SE (4.7") - iOS 16+
  - iPhone 14 Pro (6.1") - iOS 17+
  - Samsung Galaxy A50 (6.4") - Android 11+
  - Pixel 6a (6.1") - Android 13+
- Test scenarios:
  - Full flow: Get challenge -> Capture -> Upload
  - Permission denied for camera
  - Network error (simulate 3G)
  - Low battery/power saving mode
  - Dark mode
  - Portrait/landscape rotation

**Acceptance Criteria:**
- ✅ Works on all tested devices
- ✅ No console errors
- ✅ Touch targets >= 44px
- ✅ Load time < 3 seconds on 4G
- ✅ Works offline (basic fallback)

**Testing checklist:**
- [ ] Portrait orientation works
- [ ] Landscape orientation works
- [ ] Notch/safe area respected
- [ ] Camera permission flow works
- [ ] Upload on 3G doesn't timeout
- [ ] Buttons easily tappable
- [ ] Text readable in dark mode
- [ ] No horizontal scrolling

**Files to check:**
```
src/
├── shared/styles/variables.css (safe area)
├── tailwind.config.ts (breakpoints)
└── shared/components/ (touch targets)
```

**Related docs:** MOBILE_FIRST_DESIGN.md

---

#### Task 3.2.2: Polish UI/UX & Error Messages
**Priority:** 🟡 MEDIUM  
**Assigned:** Frontend Lead  
**Depends on:** 2.3.3  
**Time estimate:** 2-3 hours  
**Status:** Not Started

**Description:**
- Improve loading states
- Better error messages (user-friendly)
- Add animations/transitions (respect prefers-reduced-motion)
- Polish typography & spacing
- Add empty states
- Improve accessibility

**UI Polish:**
- Loading spinners
- Skeleton screens
- Toast notifications for feedback
- Proper disabled states
- Hover/active states on touch
- Smooth transitions

**Error Messages:**
- "Camera not accessible - please check permissions"
- "Network error - please try again"
- "Upload failed - invalid video"
- "This photo is a forgery"
- "Success! Photo authenticated"

**Files to modify:**
```
src/features/
├── camera/components/CameraCapture.module.css
└── verification/components/ResultScreen.module.css
```

**Related docs:** MOBILE_FIRST_DESIGN.md, BEST_PRACTICES_CHECKLIST.md

---

### WEEK 3.3: Production Ready (1 день)

#### Task 3.3.1: Security Audit & Hardening
**Priority:** 🔴 CRITICAL  
**Assigned:** Full-Stack  
**Depends on:** All previous tasks  
**Time estimate:** 2-3 hours  
**Status:** Not Started

**Description:**
- Security audit checklist
- Check for vulnerabilities
- CORS configuration review
- Rate limiting verification
- HTTPS enforcement
- Input validation verification
- Environment variables check
- Secrets not in code

**Security Checklist:**
- [ ] No hardcoded API keys
- [ ] CORS origin whitelist
- [ ] Rate limiting enabled
- [ ] HTTPS in production
- [ ] Input validation everywhere
- [ ] Error messages don't leak info
- [ ] No sensitive data in logs
- [ ] Dependencies updated (`npm audit`)
- [ ] TypeScript strict mode
- [ ] No direct eval() or innerHTML

**Files to audit:**
```
backend/src/
├── main.ts (security headers)
├── shared/services/ (no secrets)
└── modules/challenge/challenge.controller.ts (validation)

frontend/src/
├── shared/services/api.ts (CORS)
└── .env.example (no secrets)
```

**Related docs:** BEST_PRACTICES_CHECKLIST.md (Security section), DEVELOPMENT_PLAN.md

---

#### Task 3.3.2: Documentation & Knowledge Transfer
**Priority:** 🟠 HIGH  
**Assigned:** Full-Stack  
**Depends on:** All previous tasks  
**Time estimate:** 2 hours  
**Status:** Not Started

**Description:**
- Update README.md with setup instructions
- Add API documentation (Swagger link)
- Document architecture decisions
- Add deployment instructions
- Create troubleshooting guide
- Add contributing guidelines

**Documentation checklist:**
- [ ] README.md complete
- [ ] API docs (Swagger) accessible
- [ ] Architecture documented
- [ ] Deployment guide written
- [ ] Local setup works (tested)
- [ ] Troubleshooting FAQ added
- [ ] Contributing guidelines clear

**Files to create/update:**
```
├── README.md (update)
├── DEPLOYMENT.md (new)
├── CONTRIBUTING.md (new)
├── ARCHITECTURE.md (new)
├── TROUBLESHOOTING.md (new)
└── docs/
    ├── API.md (new)
    └── DEPLOYMENT_CHECKLIST.md (new)
```

**Related docs:** Existing docs in `.specify/memory/`

---

#### Task 3.3.3: Staging Deployment & E2E Testing
**Priority:** 🟠 HIGH  
**Assigned:** DevOps / Full-Stack  
**Depends on:** All previous tasks  
**Time estimate:** 3-4 hours  
**Status:** Not Started

**Description:**
- Deploy to staging environment
- Setup CI/CD pipeline (GitHub Actions)
- Automated tests on PR
- Automated E2E tests
- Test full production flow
- Performance testing (load testing)
- Smoke tests

**Deployment Checklist:**
- [ ] Docker images build
- [ ] docker-compose up works
- [ ] Database migrations run
- [ ] Environment variables set
- [ ] Health check passes
- [ ] All endpoints respond
- [ ] Tests pass
- [ ] No critical errors

**CI/CD Pipeline:**
1. On PR: Run linting, tests, build
2. On merge: Deploy to staging
3. Manual approval for production

**Files to create:**
```
.github/
├── workflows/
│   ├── ci.yml (lint, test, build)
│   ├── deploy-staging.yml
│   └── deploy-production.yml
└── DEPLOYMENT.md (instructions)
```

**Related docs:** DEVELOPMENT_GUIDE.md (Docker section)

---

## 📋 SUMMARY TABLE

| Task | Priority | Est. Hours | Assigned | Status | Depends |
|---|---|---|---|---|---|
| 1.1.1 | 🔴 | 2.5 | Backend | ⬜ | - |
| 1.1.2 | 🔴 | 3.5 | Backend | ⬜ | 1.1.1 |
| 1.2.1 | 🔴 | 4.5 | Backend | ⬜ | 1.1.2 |
| 1.2.2 | 🔴 | 2.5 | Backend | ⬜ | 1.2.1 |
| 1.2.3 | 🟠 | 4.5 | Backend | ⬜ | 1.2.1 |
| 1.3.1 | 🟠 | 3.5 | Backend | ⬜ | 1.2.3 |
| 1.3.2 | 🟡 | 2 | Backend | ⬜ | 1.2.2, 1.2.3 |
| 2.1.1 | 🔴 | 2.5 | Frontend | ⬜ | - |
| 2.1.2 | 🔴 | 3.5 | Frontend | ⬜ | 2.1.1 |
| 2.2.1 | 🔴 | 5.5 | Frontend | ⬜ | 2.1.2 |
| 2.2.2 | 🔴 | 4.5 | Frontend | ⬜ | 2.2.1 |
| 2.3.1 | 🔴 | 3.5 | Full-Stack | ⬜ | 1.2.2, 2.2.2 |
| 2.3.2 | 🟠 | 3.5 | Frontend | ⬜ | 2.2.2 |
| 2.3.3 | 🟠 | 2.5 | Frontend | ⬜ | 2.3.1 |
| 3.1.1 | 🟠 | 2.5 | Frontend | ⬜ | 2.3.3 |
| 3.1.2 | 🟠 | 2.5 | Backend | ⬜ | 1.3.1 |
| 3.1.3 | 🟡 | 2 | Frontend | ⬜ | 2.3.3 |
| 3.2.1 | 🟠 | 3.5 | QA/Frontend | ⬜ | 2.3.3 |
| 3.2.2 | 🟡 | 2.5 | Frontend | ⬜ | 2.3.3 |
| 3.3.1 | 🔴 | 2.5 | Full-Stack | ⬜ | All |
| 3.3.2 | 🟠 | 2 | Full-Stack | ⬜ | All |
| 3.3.3 | 🟠 | 3.5 | DevOps | ⬜ | All |

---

## 🎯 CRITICAL PATH

**Fastest route to MVP (21 days):**

```
Week 1 (Backend):
  Day 1-2: 1.1.1, 1.1.2 (setup)
  Day 3-4: 1.2.1, 1.2.2 (challenge API)
  Day 5: 1.2.3, 1.3.1 (capture + tests)

Week 2 (Frontend + Integration):
  Day 1: 2.1.1, 2.1.2 (setup)
  Day 2-3: 2.2.1, 2.2.2 (camera)
  Day 4-5: 2.3.1, 2.3.3 (integration + result)

Week 3 (Polish + Deploy):
  Day 1: 3.1.1, 3.1.2 (optimization)
  Day 2: 3.2.1, 3.2.2 (mobile + polish)
  Day 3: 3.3.1, 3.3.3 (security + deploy)
```

---

## 🚀 HOW TO USE THIS PLAN

### For Project Managers
- Create GitHub Issues from each task
- Set milestones for Week 1, 2, 3
- Track progress with Project board
- Use this as estimation guide

### For Developers
- Pick task from your priority queue
- Read description & acceptance criteria
- Follow code structure from "Files to create"
- Reference related docs
- Complete checklist before pushing

### For Code Reviewers
- Use BEST_PRACTICES_CHECKLIST.md for PR review
- Check acceptance criteria are met
- Verify related tests are passing
- Ensure TypeScript strict mode

---

## 📞 NEXT STEPS

1. ✅ Export this to GitHub Issues
2. ✅ Assign tasks to team members
3. ✅ Set up Project board with columns:
   - 📋 Backlog
   - 🔨 In Progress
   - 👀 In Review
   - ✅ Done
4. ✅ Daily standup to discuss blockers
5. ✅ Weekly retrospective to adjust estimates

**Total estimated effort: 94 person-hours (47 tasks)**

**For 2 developers working in parallel: ~3 weeks to MVP**

**For 1 developer: ~6-8 weeks**

---

**Last updated:** 16 November 2025  
**Version:** 1.0  
**Author:** AI Developer (speckit.tasks)
