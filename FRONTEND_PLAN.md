# Frontend Implementation Plan

**Дата:** 16 ноября 2025  
**Фича:** Frontend React Application  
**Статус:** 🚧 В ПРОЦЕССЕ

---

## 📊 Задачи (MVP версия)

### ✅ Выполнено
- [x] Frontend проект создан (Vite + React + TypeScript)
- [x] Зависимости установлены (axios для API)
- [x] Git ветка создана (003-frontend)

### 🚧 В процессе / TODO

#### 1. API Service Layer
- [ ] API client (axios configuration)
- [ ] Challenge API methods
- [ ] Capture API methods
- [ ] Error handling
- [ ] Types/interfaces for API responses

#### 2. WebRTC Camera Component
- [ ] Camera permissions request
- [ ] Video stream initialization
- [ ] Camera preview component
- [ ] Error handling (no camera, denied)
- [ ] Mobile compatibility

#### 3. Canvas Polygon Rendering
- [ ] Canvas overlay component
- [ ] Polygon drawing utilities
- [ ] Animation engine:
  - [ ] Pulse animation
  - [ ] Rotate animation
  - [ ] Fade animation
- [ ] Coordinate normalization (0-1 to canvas pixels)
- [ ] Performance optimization

#### 4. Video Recording
- [ ] MediaRecorder API integration
- [ ] 2-second video capture with polygons
- [ ] Video to Base64 conversion
- [ ] SHA-256 hash calculation (client-side)
- [ ] VideoHash utility с Web Crypto API

#### 5. Photo Capture Flow
- [ ] Main App component structure
- [ ] State management (useState/useReducer)
- [ ] Flow states:
  - [ ] Request Challenge
  - [ ] Show Camera + Polygons
  - [ ] Capture Photo
  - [ ] Upload to Server
  - [ ] Show Result
- [ ] Error states
- [ ] Loading states

#### 6. UI Components
- [ ] Header/Title
- [ ] Camera preview with polygons
- [ ] Capture button
- [ ] Message input field
- [ ] Result display (success/error)
- [ ] Photo preview
- [ ] Styling (CSS/Tailwind/styled-components)

#### 7. Integration & Testing
- [ ] Integration with backend API
- [ ] End-to-end flow testing
- [ ] Cross-browser testing
- [ ] Mobile responsive design
- [ ] Error scenarios testing

---

## 🎯 Architecture

### Component Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Camera.tsx              # WebRTC camera component
│   │   ├── CanvasOverlay.tsx       # Polygon rendering
│   │   ├── CaptureButton.tsx       # Photo capture trigger
│   │   ├── MessageInput.tsx        # User message input
│   │   └── ResultDisplay.tsx       # Success/error display
│   ├── services/
│   │   ├── api.ts                  # API client (axios)
│   │   ├── challenge.service.ts    # Challenge API methods
│   │   ├── capture.service.ts      # Capture API methods
│   │   └── crypto.service.ts       # SHA-256 hashing
│   ├── utils/
│   │   ├── polygon.ts              # Polygon rendering utils
│   │   ├── animation.ts            # Animation engine
│   │   └── video.ts                # Video capture & conversion
│   ├── types/
│   │   ├── challenge.ts            # Challenge types
│   │   ├── polygon.ts              # Polygon types
│   │   └── capture.ts              # Capture types
│   ├── hooks/
│   │   ├── useCamera.ts            # Camera hook
│   │   ├── useChallenge.ts         # Challenge management
│   │   └── useCapture.ts           # Capture flow hook
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
```

### Data Flow

```
1. User opens app
   ↓
2. Request Challenge from API
   → GET /api/v1/challenge?clientId=xxx
   ← challengeId, nonce, polygons[]
   ↓
3. Initialize Camera (WebRTC)
   → navigator.mediaDevices.getUserMedia()
   ← videoStream
   ↓
4. Render Polygons on Canvas
   → Draw polygons with animations
   → Overlay canvas on video
   ↓
5. Record Video (2 seconds)
   → MediaRecorder API
   → Capture with polygons visible
   ↓
6. User clicks "Capture Photo"
   → Capture video frame as photo
   → Calculate SHA-256(video)
   ↓
7. Upload to Server
   → POST /api/v1/capture
   → FormData: photo, challengeId, videoHash, message
   ← photoId, photoUrl, verified
   ↓
8. Display Result
   → Show success + photo URL
   OR
   → Show error message
```

---

## 🔧 Technical Implementation Details

### 1. WebRTC Camera Setup

\`\`\`typescript
const constraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  },
  audio: false
};

const stream = await navigator.mediaDevices.getUserMedia(constraints);
videoElement.srcObject = stream;
\`\`\`

### 2. Canvas Polygon Rendering

\`\`\`typescript
// Normalize coordinates from 0-1 to canvas pixels
function drawPolygon(ctx: CanvasRenderingContext2D, polygon: Polygon) {
  const { points, color, opacity } = polygon;
  
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  
  points.forEach(([x, y], i) => {
    const px = x * canvas.width;
    const py = y * canvas.height;
    
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  
  ctx.closePath();
  ctx.fill();
}
\`\`\`

### 3. Animation Loop

\`\`\`typescript
function animate(polygons: Polygon[]) {
  const startTime = Date.now();
  
  function loop() {
    const elapsed = Date.now() - startTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    polygons.forEach(polygon => {
      applyAnimation(polygon, elapsed);
      drawPolygon(ctx, polygon);
    });
    
    requestAnimationFrame(loop);
  }
  
  loop();
}
\`\`\`

### 4. Video Recording

\`\`\`typescript
const mediaRecorder = new MediaRecorder(canvasStream, {
  mimeType: 'video/webm',
  videoBitsPerSecond: 2500000
});

const chunks: Blob[] = [];

mediaRecorder.ondataavailable = (e) => {
  if (e.data.size > 0) chunks.push(e.data);
};

mediaRecorder.onstop = async () => {
  const videoBlob = new Blob(chunks, { type: 'video/webm' });
  const videoHash = await calculateSHA256(videoBlob);
  // Upload...
};

// Record for 2 seconds
mediaRecorder.start();
setTimeout(() => mediaRecorder.stop(), 2000);
\`\`\`

### 5. SHA-256 Hashing (Web Crypto API)

\`\`\`typescript
async function calculateSHA256(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
\`\`\`

### 6. Photo Upload

\`\`\`typescript
async function uploadPhoto(
  photo: Blob,
  challengeId: string,
  videoHash: string,
  message?: string
) {
  const formData = new FormData();
  formData.append('photo', photo, 'photo.jpg');
  formData.append('challengeId', challengeId);
  formData.append('videoHash', videoHash);
  if (message) formData.append('message', message);
  
  const response = await axios.post('/api/v1/capture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data;
}
\`\`\`

---

## 📝 Implementation Order (Recommended)

1. **API Layer** (1 hour)
   - Setup axios client
   - Implement challenge & capture services
   - Add TypeScript types

2. **Camera Component** (1 hour)
   - WebRTC initialization
   - Camera preview
   - Error handling

3. **Canvas + Polygons** (2 hours)
   - Canvas overlay setup
   - Polygon drawing
   - Animation engine (pulse, rotate, fade)

4. **Video Recording** (1 hour)
   - MediaRecorder integration
   - SHA-256 calculation
   - Video capture workflow

5. **Main Flow Integration** (2 hours)
   - State management
   - Component integration
   - Error/loading states
   - UI polish

6. **Testing & Debugging** (1 hour)
   - End-to-end testing
   - Cross-browser testing
   - Bug fixes

**Total Estimated Time:** 8 hours

---

## 🚀 Quick Start (MVP Version)

For MVP, we can simplify:

1. **Skip video recording** - Just use static challenge validation
2. **Simplified animations** - Use CSS animations instead of canvas
3. **Basic UI** - Minimal styling
4. **Desktop only** - Skip mobile optimization

This reduces time to ~3-4 hours for a working prototype.

---

## 📚 Dependencies

\`\`\`json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "axios": "^1.7.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
\`\`\`

---

## 🎯 Success Criteria

- [ ] User can request a challenge
- [ ] Camera stream displays
- [ ] Polygons render over camera
- [ ] Polygons animate correctly
- [ ] Photo can be captured
- [ ] Video hash calculated correctly
- [ ] Upload to backend works
- [ ] Success/error messages display
- [ ] Result includes photoId and URL

---

## 📊 Current Status

**Phase:** Infrastructure Setup Complete  
**Next:** API Service Layer Implementation  
**Blockers:** None  
**ETA:** 3-4 hours for MVP

---

**Developer:** GitHub Copilot CLI  
**Last Updated:** 16 ноября 2025, 20:35

