# GitHub Issues Template — AuthPhoto
## Экспортируй эти issue в GitHub для отслеживания

---

## 📋 PHASE 1: BACKEND INFRASTRUCTURE

### Issue 1.1.1: NestJS Project Initialization
```
Title: [Setup] Initialize NestJS project with TypeScript & Docker
Labels: setup, backend, critical, week-1
Assignee: Backend Lead
Milestone: Week 1
Priority: 🔴 CRITICAL

Description:
Initialize NestJS project with TypeScript strict mode, configure linting, formatting, Docker, and development environment.

Acceptance Criteria:
- [ ] npm run dev starts server on localhost:3000
- [ ] TypeScript strict mode enabled
- [ ] ESLint passing without warnings
- [ ] Docker image builds successfully
- [ ] Health check endpoint works: GET /api/v1/health

Time Estimate: 2.5 hours

Related Docs:
- DEVELOPMENT_GUIDE.md
- constitution.md

Files to Create:
- src/main.ts
- src/app.module.ts
- Dockerfile
- docker-compose.yml
- .env.example
```

### Issue 1.1.2: Shared Services & Utilities
```
Title: [Setup] Create shared services (Crypto, Logger, Cache, Config)
Labels: setup, backend, critical, week-1
Assignee: Backend Lead
Depends on: #1.1.1
Milestone: Week 1
Priority: 🔴 CRITICAL

Description:
Create shared services layer with CryptoService, LoggerService, CacheService, and global error handling.

Acceptance Criteria:
- [ ] CryptoService generates valid SHA-256 hashes
- [ ] LoggerService outputs structured JSON logs
- [ ] CacheService TTL works correctly
- [ ] Global error handling returns consistent format
- [ ] All services fully typed with TypeScript
- [ ] 90%+ test coverage for all services

Time Estimate: 3.5 hours

Tests:
- crypto.service.spec.ts (10 tests)
- logger.service.spec.ts (5 tests)
- cache.service.spec.ts (8 tests)
```

### Issue 1.2.1: Challenge Service Implementation
```
Title: [Feature] Implement Challenge Service with polygon generation
Labels: feature, backend, critical, week-1
Assignee: Backend Lead
Depends on: #1.1.2
Milestone: Week 1
Priority: 🔴 CRITICAL

Description:
Create Challenge module and service with polygon generation, challenge validation, and TTL management using Observer pattern.

Acceptance Criteria:
- [ ] generateChallenge() returns challenge with 5-7 random polygons
- [ ] Challenge expires after 30 seconds
- [ ] Cannot reuse same challenge
- [ ] 90%+ test coverage
- [ ] Observer pattern implemented for lifecycle events

Implementation Details:
- Polygon: { x: 0-1, y: 0-1, size: 0-0.5 }
- 5-7 random polygons per challenge
- Nonce for verification
- Cache TTL: 30 seconds

Tests Required:
- Challenge generation (5 tests)
- Challenge validation (5 tests)
- Challenge expiry (3 tests)
- Observer notifications (2 tests)

Time Estimate: 4.5 hours

Related Patterns:
- Factory Pattern (service creation)
- Observer Pattern (lifecycle)
```

### Issue 1.2.2: Challenge Controller & API Endpoint
```
Title: [Feature] Create GET /api/v1/challenge endpoint with rate limiting
Labels: feature, backend, critical, week-1
Assignee: Backend Lead
Depends on: #1.2.1
Milestone: Week 1
Priority: 🔴 CRITICAL

Description:
Implement ChallengeController with GET /challenge endpoint, input validation, rate limiting, and API documentation.

Acceptance Criteria:
- [ ] GET /api/v1/challenge?clientId=test returns 200
- [ ] Response format matches spec
- [ ] Rate limiting: max 10 req/min per clientId
- [ ] Invalid clientId returns 400
- [ ] Response time < 200ms
- [ ] Swagger documentation complete

Response Format:
{
  "status": "success",
  "data": {
    "challengeId": "uuid-xxx",
    "nonce": "random-nonce",
    "polygons": [...],
    "expiresAt": "2025-11-16T10:05:00Z"
  },
  "timestamp": "2025-11-16T10:00:00Z"
}

Time Estimate: 2.5 hours

Tests:
- Valid request (2 tests)
- Rate limiting (2 tests)
- Invalid input (2 tests)
```

### Issue 1.2.3: Capture & Verification Services
```
Title: [Feature] Implement photo capture, hash validation, and verification
Labels: feature, backend, critical, week-1
Assignee: Backend Lead
Depends on: #1.2.1
Milestone: Week 1
Priority: 🟠 HIGH

Description:
Create Capture and Verification modules with photo validation, video hash comparison, file storage, and fraud detection.

Features:
1. CaptureService
   - Validate video hash against challenge nonce
   - Store photo with metadata
   - Reject fraudulent attempts

2. VerificationService
   - Retrieve photo by ID
   - Validate photo integrity
   - Return verification status

3. StorageService (File-based MVP)
   - Save photos to /photos/{id}.jpg
   - Save metadata to /photos/metadata/{id}.json
   - Support 30-day TTL

Acceptance Criteria:
- [ ] Photo stored with correct hash validation
- [ ] Invalid video hash returns 400
- [ ] Photo metadata retrievable
- [ ] 30-day TTL enforced
- [ ] 85%+ test coverage

Algorithm:
1. Client records video during challenge display
2. Server: SHA256(video_frames) === challenge.hash
3. If match: Save photo ✅
4. If mismatch: Fraud detected ❌

Storage Structure:
/photos
├── {photoId}.jpg (photo file)
└── metadata
    └── {photoId}.json (metadata)

Time Estimate: 4.5 hours
```

### Issue 1.3.1: Backend Unit Tests & Coverage
```
Title: [Testing] Write unit tests for all backend services (80%+ coverage)
Labels: testing, backend, high, week-1
Assignee: Backend Lead
Depends on: #1.2.3
Milestone: Week 1
Priority: 🟠 HIGH

Description:
Comprehensive unit tests for all services with mocked dependencies and edge cases.

Test Coverage:
- CryptoService: 100% (10 tests)
- ChallengeService: 90% (15 tests)
- CaptureService: 85% (12 tests)
- VerificationService: 80% (10 tests)
- Overall: 80%+ coverage

Acceptance Criteria:
- [ ] npm run test passes all tests
- [ ] Coverage report: 80%+ overall
- [ ] No skipped tests
- [ ] Tests run in < 5 seconds
- [ ] CI/CD pipeline integration

Test Data:
- Create fixtures for reusable test data
- Mock axios for API tests
- Mock file system for storage tests

Time Estimate: 3.5 hours
```

### Issue 1.3.2: API Documentation & Swagger Setup
```
Title: [Documentation] Setup Swagger/OpenAPI with full endpoint documentation
Labels: documentation, backend, medium, week-1
Assignee: Backend Lead
Depends on: #1.2.2, #1.2.3
Milestone: Week 1
Priority: 🟡 MEDIUM

Description:
Setup Swagger/OpenAPI documentation for all three endpoints with examples and error codes.

Endpoints to Document:
1. GET /api/v1/challenge
2. POST /api/v1/capture
3. GET /api/v1/photos/:photoId

Acceptance Criteria:
- [ ] Swagger UI accessible at /api/docs
- [ ] All endpoints documented
- [ ] Request/response examples included
- [ ] Error codes documented (400, 404, 429, 500)
- [ ] Authentication notes (if applicable)

Error Codes:
- 200: Success
- 400: Bad Request (invalid input)
- 404: Not Found
- 429: Too Many Requests (rate limited)
- 500: Internal Server Error

Time Estimate: 2 hours
```

---

## 🎨 PHASE 2: FRONTEND + INTEGRATION

### Issue 2.1.1: React + Vite Project Initialization
```
Title: [Setup] Initialize React 18 + Vite + TypeScript + Tailwind
Labels: setup, frontend, critical, week-2
Assignee: Frontend Lead
Milestone: Week 2
Priority: 🔴 CRITICAL

Description:
Setup complete React + Vite development environment with TypeScript strict mode, Tailwind CSS, testing framework, and development tools.

Acceptance Criteria:
- [ ] npm run dev starts dev server on localhost:5173
- [ ] TypeScript strict mode enabled
- [ ] Tailwind CSS working
- [ ] ESLint passing
- [ ] Vite HMR working (fast refresh)
- [ ] Path aliases working (@features, @shared, etc)

Dev Tools:
- Vitest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests (future)
- ESLint + Prettier

Time Estimate: 2.5 hours
```

### Issue 2.1.2: Shared Components & Utilities Foundation
```
Title: [Setup] Create shared components library and utility functions
Labels: setup, frontend, critical, week-2
Assignee: Frontend Lead
Depends on: #2.1.1
Milestone: Week 2
Priority: 🔴 CRITICAL

Description:
Build reusable component library and utility hooks for use across features.

Components to Build:
1. Button (44px touch target)
2. Spinner/Loading
3. Card
4. Modal
5. Input
6. Error Boundary

Custom Hooks:
- useMediaQuery (responsive)
- useLocalStorage
- useDebounce
- useAsync
- useCachedData

Utilities:
- API client (axios singleton)
- Crypto utilities (SHA-256)
- Formatters
- Validators

Acceptance Criteria:
- [ ] All components fully typed
- [ ] 44px minimum touch targets
- [ ] Dark mode support
- [ ] TypeScript interfaces exported
- [ ] Component documentation

Time Estimate: 3.5 hours
```

### Issue 2.2.1: Camera Component with Polygon Overlay
```
Title: [Feature] Build camera component with live polygon overlay
Labels: feature, frontend, critical, week-2
Assignee: Frontend Lead
Depends on: #2.1.2
Milestone: Week 2
Priority: 🔴 CRITICAL

Description:
Create CameraCapture component with live video stream and animated polygon overlay for challenge display.

Features:
1. CameraCapture Component
   - Access device camera (getUserMedia)
   - Display live video stream
   - Handle permissions gracefully
   - Full-screen layout for mobile

2. PolygonOverlay Component
   - Draw 5-7 random polygons on canvas
   - Overlay on video stream
   - Responsive to video size
   - Optional animations

3. Error Handling
   - No camera permission
   - Camera not available
   - Browser not supported
   - Graceful fallbacks

Acceptance Criteria:
- [ ] Camera streams live video
- [ ] Polygons render on canvas
- [ ] Works on iOS Safari & Android Chrome
- [ ] Handles permission denied
- [ ] Responsive mobile layout
- [ ] No console errors

Browser Compatibility:
- iOS Safari 14+
- Android Chrome 90+
- Desktop Chrome/Firefox

Time Estimate: 5.5 hours
```

### Issue 2.2.2: Photo Capture & Upload with Video Hash
```
Title: [Feature] Implement photo capture, compression, and server upload
Labels: feature, frontend, critical, week-2
Assignee: Frontend Lead
Depends on: #2.2.1
Milestone: Week 2
Priority: 🔴 CRITICAL

Description:
Capture photo from video, compress to JPEG, record 2-second verification video, calculate hash, and upload to server.

Technical Requirements:
1. Photo Capture
   - Extract from canvas (1280x720 default)
   - Compress to JPEG (quality 0.85)
   - Size: < 300KB

2. Video Capture
   - Record 2 seconds at 30fps
   - Calculate SHA-256 hash
   - Send with form data

3. Upload
   - MultipartFormData POST
   - Include photo, video, message
   - Handle upload progress
   - Retry on network error

Acceptance Criteria:
- [ ] Photo captured and optimized
- [ ] Video hash calculated correctly
- [ ] Upload succeeds
- [ ] Error handling works
- [ ] Message field optional (max 500 chars)
- [ ] Response time < 5 seconds

Compression Algorithm:
1. Canvas.toBlob(blob, 'image/jpeg', 0.85)
2. Resulting size: ~50-150KB
3. Dimensions: max 1280x720

Time Estimate: 4.5 hours
```

### Issue 2.3.1: Frontend-Backend Integration Testing
```
Title: [Integration] Connect frontend to backend and test full flow
Labels: testing, integration, critical, week-2
Assignee: Full-Stack
Depends on: #1.2.2, #2.2.2
Milestone: Week 2
Priority: 🔴 CRITICAL

Description:
Integrate frontend API client with backend endpoints and test complete user flow end-to-end.

Integration Test Scenarios:
1. ✅ Full Success Flow
   - Get challenge
   - Display polygons
   - Capture photo
   - Upload with valid hash
   - Verify success response

2. ✅ Fraud Detection Flow
   - Get challenge
   - Capture photo
   - Wrong video hash
   - Upload returns 400
   - Show error message

3. ✅ Network Error Flow
   - Get challenge
   - Network error during upload
   - Show retry option
   - Retry succeeds

4. ✅ Rate Limiting Flow
   - Send 11 requests
   - 11th returns 429
   - Show rate limit message

Acceptance Criteria:
- [ ] All scenarios pass
- [ ] API endpoints return correct status codes
- [ ] Error messages user-friendly
- [ ] No CORS errors
- [ ] Response times acceptable

Time Estimate: 3.5 hours
```

### Issue 2.3.2: Frontend Unit Tests (70%+ coverage)
```
Title: [Testing] Write frontend unit and component tests
Labels: testing, frontend, high, week-2
Assignee: Frontend Lead
Depends on: #2.2.2
Milestone: Week 2
Priority: 🟠 HIGH

Description:
Comprehensive unit and component tests using Vitest and React Testing Library.

Test Coverage:
- useCamera hook: 90% (8 tests)
- CameraCapture component: 80% (10 tests)
- captureService: 85% (12 tests)
- useChallengePolygons: 85% (8 tests)
- Overall: 70%+ coverage

Acceptance Criteria:
- [ ] npm run test passes
- [ ] Coverage > 70%
- [ ] No flaky tests
- [ ] Tests run < 10 seconds
- [ ] No skipped tests

Test Examples:
- Test camera initialization success
- Test camera permission denied
- Test polygon drawing
- Test photo capture
- Test error handling

Time Estimate: 3.5 hours
```

### Issue 2.3.3: Result Screen & Photo Verification UI
```
Title: [Feature] Build result screen showing verification status
Labels: feature, frontend, high, week-2
Assignee: Frontend Lead
Depends on: #2.3.1
Milestone: Week 2
Priority: 🟠 HIGH

Description:
Create result display component showing photo verification status, metadata, and share options.

UI States:
1. Loading State
   - Spinner animation
   - "Verifying photo..."

2. Success State
   - ✅ Green checkmark
   - Photo preview
   - Metadata (timestamp, message)
   - "This photo is authentic"

3. Fraud State
   - ❌ Red X
   - Error message
   - "This photo is a forgery"
   - Retry button

4. Share State
   - Copy link button
   - QR code (optional)
   - Share via social (optional)

Acceptance Criteria:
- [ ] All states render correctly
- [ ] Share functionality works
- [ ] Links generate correctly
- [ ] Mobile responsive
- [ ] Error messages clear

Time Estimate: 2.5 hours
```

---

## ⚡ PHASE 3: OPTIMIZATION & POLISH

### Issue 3.1.1: Bundle Size Optimization
```
Title: [Performance] Optimize bundle size to < 200KB gzipped
Labels: performance, frontend, high, week-3
Assignee: Frontend Lead
Depends on: #2.3.3
Milestone: Week 3
Priority: 🟠 HIGH

Description:
Analyze and optimize bundle size through code splitting, tree shaking, and dependency optimization.

Optimization Checklist:
- [ ] Analyze bundle with npm run analyze
- [ ] Lazy load routes
- [ ] Tree shake unused code
- [ ] Optimize vendor chunks
- [ ] Remove unused dependencies
- [ ] Min CSS

Targets:
- Bundle size: < 200KB gzipped
- FCP: < 2 seconds
- LCP: < 2.5 seconds
- Lighthouse: > 90

Time Estimate: 2.5 hours
```

### Issue 3.1.2: Backend Query & Response Optimization
```
Title: [Performance] Optimize API responses and add caching
Labels: performance, backend, high, week-3
Assignee: Backend Lead
Depends on: #1.3.1
Milestone: Week 3
Priority: 🟠 HIGH

Description:
Optimize backend queries, add response caching, and monitor performance metrics.

Optimizations:
1. Response Caching
   - Cache challenges 30 seconds
   - Cache photos 5 minutes

2. Query Optimization
   - Only fetch needed fields
   - Index cache lookups

3. Performance Monitoring
   - Log response times
   - Alert on slow responses
   - Track P95, P99 metrics

Targets:
- GET /challenge: < 100ms
- POST /capture: < 500ms
- GET /photos/:id: < 200ms
- P95 response: < 500ms

Time Estimate: 2.5 hours
```

### Issue 3.2.1: Mobile Device Testing
```
Title: [QA] Test on real devices (iPhone, Samsung, etc.)
Labels: qa, testing, high, week-3
Assignee: QA/Frontend Lead
Depends on: #2.3.3
Milestone: Week 3
Priority: 🟠 HIGH

Description:
Comprehensive testing on real mobile devices across different sizes and OS versions.

Test Devices:
- iPhone SE (4.7") - iOS 16+
- iPhone 14 Pro (6.1") - iOS 17+
- Samsung Galaxy A50 (6.4") - Android 11+
- Pixel 6a (6.1") - Android 13+

Test Scenarios:
- ✅ Full flow end-to-end
- ✅ Camera permission denied
- ✅ Network error (simulate 3G)
- ✅ Low battery mode
- ✅ Dark mode
- ✅ Rotation (portrait/landscape)
- ✅ Notch handling

Acceptance Criteria:
- [ ] Works on all devices
- [ ] No console errors
- [ ] Touch targets >= 44px
- [ ] Load time < 3 seconds on 4G
- [ ] No layout shifts

Time Estimate: 3.5 hours
```

### Issue 3.2.2: UI/UX Polish & Error Messages
```
Title: [UX] Improve UI polish, animations, and error messages
Labels: ux, frontend, medium, week-3
Assignee: Frontend Lead
Depends on: #2.3.3
Milestone: Week 3
Priority: 🟡 MEDIUM

Description:
Refine UI/UX with better animations, loading states, and user-friendly error messages.

Polish Items:
1. Animations
   - Loading spinner
   - State transitions
   - Respect prefers-reduced-motion

2. Error Messages (user-friendly)
   - "Camera access denied"
   - "Network error - try again"
   - "Upload failed - invalid video"
   - "This photo is a forgery"
   - "Success! Photo authenticated"

3. UI Refinements
   - Skeleton screens
   - Toast notifications
   - Proper disabled states
   - Hover/active states
   - Smooth transitions

Acceptance Criteria:
- [ ] Loading states smooth
- [ ] Error messages helpful
- [ ] No jarring transitions
- [ ] Accessible (WCAG AA)

Time Estimate: 2.5 hours
```

### Issue 3.3.1: Security Audit & Hardening
```
Title: [Security] Complete security audit and vulnerability check
Labels: security, critical, week-3
Assignee: Full-Stack
Depends on: All previous tasks
Milestone: Week 3
Priority: 🔴 CRITICAL

Description:
Comprehensive security audit addressing OWASP top 10 and best practices.

Security Checklist:
- [ ] No hardcoded secrets
- [ ] CORS whitelist configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforcement
- [ ] Input validation everywhere
- [ ] Error messages sanitized
- [ ] No sensitive data in logs
- [ ] Dependencies audited (npm audit)
- [ ] TypeScript strict mode
- [ ] No eval() or innerHTML

Acceptance Criteria:
- [ ] npm audit clean
- [ ] No security warnings
- [ ] CORS working correctly
- [ ] Rate limiting active
- [ ] All validations in place

Tools:
- npm audit
- TypeScript strict mode
- OWASP ZAP scanning (optional)

Time Estimate: 2.5 hours
```

### Issue 3.3.2: Documentation & Knowledge Transfer
```
Title: [Documentation] Complete all documentation for developers
Labels: documentation, high, week-3
Assignee: Full-Stack
Depends on: All previous tasks
Milestone: Week 3
Priority: 🟠 HIGH

Description:
Update and create documentation for setup, API, architecture, and troubleshooting.

Documentation Checklist:
- [ ] README.md with full setup
- [ ] Swagger docs accessible
- [ ] Architecture documented
- [ ] Deployment guide written
- [ ] Troubleshooting FAQ
- [ ] Contributing guidelines

Files to Update:
- README.md
- DEPLOYMENT.md
- CONTRIBUTING.md
- ARCHITECTURE.md
- API.md

Acceptance Criteria:
- [ ] New developer can setup in 30 min
- [ ] All commands documented
- [ ] Examples provided
- [ ] Troubleshooting covers common issues

Time Estimate: 2 hours
```

### Issue 3.3.3: Staging Deployment & E2E Testing
```
Title: [DevOps] Setup CI/CD pipeline and deploy to staging
Labels: devops, high, week-3
Assignee: DevOps / Full-Stack
Depends on: All previous tasks
Milestone: Week 3
Priority: 🟠 HIGH

Description:
Create CI/CD pipeline, deploy to staging, and run comprehensive E2E tests.

CI/CD Pipeline:
1. On PR
   - npm run lint
   - npm run test
   - npm run build
   - Report status

2. On Merge to Main
   - Deploy to staging
   - Run E2E tests
   - Health checks

3. Manual Approval
   - Review staging environment
   - Approve production deployment

Acceptance Criteria:
- [ ] GitHub Actions configured
- [ ] Docker images build
- [ ] docker-compose deploys
- [ ] Health check passes
- [ ] All tests pass
- [ ] No critical errors

Files to Create:
- .github/workflows/ci.yml
- .github/workflows/deploy.yml
- DEPLOYMENT.md

Time Estimate: 3.5 hours
```

---

## 🎯 HOW TO IMPORT INTO GITHUB

### Option 1: Manual Creation
1. Go to GitHub Issues
2. Create new issue
3. Copy content from above
4. Add labels, assignee, milestone
5. Link issues with "Depends on" comments

### Option 2: Using CLI
```bash
# Using GitHub CLI (gh)
gh issue create --title "Issue Title" --body "Issue body" --label "label1,label2" --assignee @username

# Or use API
curl -X POST https://api.github.com/repos/USERNAME/REPO/issues \
  -H "Authorization: token YOUR_TOKEN" \
  -d '{"title":"...","body":"...","labels":["setup"]}'
```

### Option 3: Project Template
Create GitHub Project with columns:
- 📋 Backlog (all new issues)
- 🔨 In Progress (assigned + started)
- 👀 In Review (PR opened)
- ✅ Done (merged)

---

## 📊 METRICS TEMPLATE

Track these metrics weekly:

```
Week 1 Progress:
- Backend tasks completed: X/7
- Frontend tasks completed: 0/7
- Tests passing: 85%
- Bundle size: 250KB

Week 2 Progress:
- Backend tasks completed: 7/7
- Frontend tasks completed: X/7
- Tests passing: 95%
- Bundle size: 220KB

Week 3 Progress:
- All tasks: X/22
- Tests passing: 100%
- Bundle size: 185KB
- Lighthouse score: 92
- Deployment: Ready
```

---

**Total: 22 Issues across 3 Phases**
**Estimated effort: 94 person-hours**
**For 2 developers: ~3 weeks**
