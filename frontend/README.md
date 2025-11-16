# AuthPhoto Frontend

React + TypeScript frontend application for AuthPhoto secure photo capture system.

## Features

- 📸 **WebRTC Camera Access** - Real-time camera preview
- 🎨 **Canvas Polygon Rendering** - Animated polygons overlay on camera
- 🎥 **Video Recording** - 2-second video capture with polygons
- 🔐 **SHA-256 Hashing** - Client-side video hash calculation
- ☁️ **Photo Upload** - Secure upload to backend API
- ✅ **Challenge Verification** - Visual challenge-based authentication

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **WebRTC** - Camera access
- **Canvas API** - Polygon rendering
- **Web Crypto API** - SHA-256 hashing

## Architecture

```
src/
├── components/        # React components
│   ├── Camera.tsx            # WebRTC camera preview
│   ├── CanvasOverlay.tsx     # Polygon rendering
│   ├── CaptureButton.tsx     # Capture trigger
│   ├── MessageInput.tsx      # Message input
│   └── ResultDisplay.tsx     # Result/error display
├── hooks/             # Custom React hooks
│   ├── useCamera.ts          # Camera management
│   ├── useChallenge.ts       # Challenge requests
│   └── useCapture.ts         # Photo capture
├── services/          # API services
│   ├── api.ts                # Axios client
│   ├── challenge.service.ts  # Challenge API
│   ├── capture.service.ts    # Capture API
│   └── crypto.service.ts     # Crypto utilities
├── utils/             # Utility functions
│   ├── polygon.ts            # Polygon drawing
│   ├── animation.ts          # Animation engine
│   └── video.ts              # Video recording
├── types/             # TypeScript types
│   ├── polygon.ts
│   ├── challenge.ts
│   └── capture.ts
└── App.tsx            # Main application
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:3000

### Installation

```bash
npm install
```

### Configuration

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage Flow

1. **Initialize**
   - App requests challenge from API
   - Camera permission requested
   - Challenge polygons received

2. **Camera View**
   - Live camera preview
   - Animated polygons overlay
   - User positions themselves

3. **Capture**
   - Click "Capture Photo" button
   - 2-second video recorded with polygons
   - SHA-256 hash calculated
   - Final frame captured as photo

4. **Upload**
   - Photo + video hash sent to API
   - Server verifies challenge
   - Result displayed

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required APIs:**
- MediaDevices (WebRTC)
- Canvas 2D
- MediaRecorder
- Web Crypto (SubtleCrypto)

## License

Private - Insurance Corp

## Author

Developed by GitHub Copilot CLI
