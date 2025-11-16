# Мобильная оптимизация — AuthPhoto

## Mobile-First проектирование, адаптивность, производительность

**Версия:** 1.0  
**Платформы:** iOS, Android, мобильные браузеры  
**Target:** 95%+ Lighthouse score на мобильных устройствах

---

## 📱 MOBILE-FIRST DESIGN SYSTEM

### 1. Viewport и базовые метатеги

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="ru">
  <head>
    <!-- Контролируем viewport для мобильных -->
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no"
    />

    <!-- Поддержка fullscreen для iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <meta name="apple-mobile-web-app-title" content="AuthPhoto" />

    <!-- Цвет адресной строки -->
    <meta name="theme-color" content="#1f2937" />

    <!-- Поддержка light/dark mode -->
    <meta name="color-scheme" content="light dark" />

    <!-- Отключаем синий outline при фокусе (iOS) -->
    <meta name="format-detection" content="telephone=no,email=no" />

    <title>AuthPhoto</title>
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/favicon.ico" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 2. Breakpoint система (Tailwind)

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      // Mobile-first approach
      xs: "320px", // Small phones
      sm: "375px", // Standard phones (iPhone SE, Samsung A)
      md: "425px", // Larger phones (iPhone 12 Pro)
      lg: "768px", // Tablets in portrait
      xl: "1024px", // Tablets in landscape
      "2xl": "1280px", // Desktops
    },
    extend: {
      spacing: {
        // Safe area for notched devices
        safe: "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },
      fontSize: {
        // Prevent iOS zoom on input focus
        // Set to 16px or higher
        base: "16px",
      },
    },
  },
  plugins: [],
} satisfies Config
```

### 3. CSS переменные и токены (Design Tokens)

```css
/* src/shared/styles/variables.css */

:root {
  /* Safe area support */
  --safe-area-inset-top: env(safe-area-inset-top, 0);
  --safe-area-inset-right: env(safe-area-inset-right, 0);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0);
  --safe-area-inset-left: env(safe-area-inset-left, 0);

  /* Typography */
  --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", monospace;

  /* Colors */
  --color-primary: #2563eb;
  --color-primary-dark: #1e40af;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  /* Touch target (min 44x44px for iOS) */
  --touch-target: 44px;
  --touch-target-sm: 40px;

  /* Z-index stack */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal: 400;

  /* Motion */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;

  /* Motion preference */
  @media (prefers-reduced-motion: reduce) {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 0ms;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-text: #f3f4f6;
  }
}
```

### 4. Layout компоненты (Mobile-first)

```typescript
// src/layouts/MobileLayout.tsx
import React from "react"

/**
 * Основной layout для мобильных устройств
 * - Full screen height
 * - Respects safe areas
 * - Touch-friendly
 */
export const MobileLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header with safe area top */}
      <header className="pt-[var(--safe-area-inset-top)] px-4 py-3 bg-white dark:bg-gray-900 border-b">
        {/* Content */}
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Footer button area with safe area bottom */}
      <footer className="pb-[var(--safe-area-inset-bottom)] px-4 py-4 bg-white dark:bg-gray-900 border-t">
        {/* Fixed buttons */}
      </footer>
    </div>
  )
}
```

---

## 🎯 TOUCH TARGETS И GESTURES

### 1. Touch-friendly компоненты

```typescript
// src/shared/components/Button/Button.tsx
import React from "react"
import styles from "./Button.module.css"

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  fullWidth?: boolean
  size?: "sm" | "md" | "lg"
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled,
  fullWidth,
  size = "md",
}) => {
  // Touch target size: 44x44px minimum (iOS standard)
  const sizes = {
    sm: "h-10 px-3 text-sm", // 40px
    md: "h-11 px-4 text-base", // 44px
    lg: "h-12 px-6 text-lg", // 48px
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        min-h-[var(--touch-target)]
        min-w-[var(--touch-target)]
        rounded-lg
        font-semibold
        transition-colors duration-[var(--transition-fast)]
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        active:scale-95
      `}
    >
      {children}
    </button>
  )
}
```

### 2. Gesture-friendly интерактивные элементы

```typescript
// src/shared/hooks/useGestures.ts
import { useRef, useEffect, useState } from "react"

export interface GestureHandlers {
  onTap?: () => void
  onDoubleTap?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onLongPress?: () => void
}

export const useGestures = (
  ref: React.RefObject<HTMLElement>,
  handlers: GestureHandlers
) => {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  )

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    let longPressTimer: ReturnType<typeof setTimeout>

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }

      // Long press (500ms)
      longPressTimer = setTimeout(() => {
        handlers.onLongPress?.()
      }, 500)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      clearTimeout(longPressTimer)

      if (!touchStartRef.current) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      const deltaTime = Date.now() - touchStartRef.current.time

      // Swipe detection (> 50px, < 300ms)
      if (deltaTime < 300 && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 50) {
        if (deltaX > 0) handlers.onSwipeRight?.()
        else handlers.onSwipeLeft?.()
      }

      if (deltaTime < 300 && Math.abs(deltaY) > 50 && Math.abs(deltaX) < 50) {
        if (deltaY > 0) handlers.onSwipeDown?.()
        else handlers.onSwipeUp?.()
      }

      // Tap
      if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        handlers.onTap?.()
      }

      touchStartRef.current = null
    }

    element.addEventListener("touchstart", handleTouchStart, { passive: true })
    element.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchend", handleTouchEnd)
      clearTimeout(longPressTimer)
    }
  }, [handlers, ref])
}

// Использование
export const CameraCapture: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGestures(containerRef, {
    onTap: () => console.log("Tapped"),
    onSwipeLeft: () => console.log("Swiped left"),
    onLongPress: () => console.log("Long pressed"),
  })

  return <div ref={containerRef}>Camera</div>
}
```

---

## ⚡ ПРОИЗВОДИТЕЛЬНОСТЬ

### 1. Image Optimization

```typescript
// src/shared/utils/image.ts
export const optimizeImage = async (
  blob: Blob,
  maxWidth: number = 1280,
  maxHeight: number = 720,
  quality: number = 0.85
): Promise<Blob> => {
  return new Promise(resolve => {
    const canvas = document.createElement("canvas")
    const img = new Image()

    img.onload = () => {
      let { width, height } = img

      // Calculate new dimensions maintaining aspect ratio
      const maxDimension = Math.max(width, height)
      if (maxDimension > maxWidth) {
        const ratio = maxWidth / maxDimension
        width *= ratio
        height *= ratio
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        optimized => {
          resolve(optimized || blob)
        },
        "image/jpeg",
        quality
      )
    }

    img.src = URL.createObjectURL(blob)
  })
}

// Использование
const photo = await camera.takePhoto()
const optimized = await optimizeImage(photo)
const compressed = new File([optimized], "photo.jpg")
```

### 2. Code Splitting (Vite)

```typescript
// src/App.tsx
import { lazy, Suspense } from "react"
import { Spinner } from "@shared/components/Spinner"

// Lazy load routes - код загружается только при навигации
const CameraPage = lazy(() => import("@pages/CameraPage"))
const ResultPage = lazy(() => import("@pages/ResultPage"))
const SettingsPage = lazy(() => import("@pages/SettingsPage"))

export const App: React.FC = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Router>
        <Routes>
          <Route path="/" element={<CameraPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </Suspense>
  )
}
```

### 3. Сaching Strategy

```typescript
// src/shared/hooks/useCachedData.ts
export const useCachedData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes
) => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check localStorage first
    const cached = localStorage.getItem(key)
    const cachedData = cached ? JSON.parse(cached) : null

    if (cachedData && cachedData.expiry > Date.now()) {
      setData(cachedData.data)
      return
    }

    // Fetch from server
    setIsLoading(true)
    fetcher()
      .then(result => {
        setData(result)
        // Store in localStorage with expiry
        localStorage.setItem(
          key,
          JSON.stringify({
            data: result,
            expiry: Date.now() + ttl,
          })
        )
      })
      .finally(() => setIsLoading(false))
  }, [key])

  return { data, isLoading }
}
```

### 4. Bundle Size Analysis (Vite)

```bash
# package.json scripts
{
  "scripts": {
    "analyze": "vite-plugin-visualizer --open"
  }
}
```

```typescript
// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          vendor: ["react", "react-dom", "axios"],
          // Split utilities
          utils: ["@shared/utils", "@shared/hooks"],
        },
      },
    },
    // Target modern browsers
    target: "ES2020",
    // CSS code split
    cssCodeSplit: true,
    // Sourcemaps for debugging (disable in production)
    sourcemap: false,
    // Minify aggressively
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
```

---

## 🌐 RESPONSIVE DESIGN PATTERNS

### 1. Responsive Canvas

```typescript
// src/features/camera/hooks/useResponsiveCanvas.ts
export const useResponsiveCanvas = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const resizeCanvas = () => {
      if (!videoRef.current || !canvasRef.current) return

      const video = videoRef.current
      const canvas = canvasRef.current

      // Get device pixel ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1

      // Set display size
      const width = video.videoWidth
      const height = video.videoHeight

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Set actual size with DPR
      canvas.width = width * dpr
      canvas.height = height * dpr

      // Scale context for DPR
      const ctx = canvas.getContext("2d")!
      ctx.scale(dpr, dpr)

      setCanvasSize({ width, height })
    }

    window.addEventListener("resize", resizeCanvas)
    video.addEventListener("loadedmetadata", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      video.removeEventListener("loadedmetadata", resizeCanvas)
    }
  }, [videoRef, canvasRef])

  return canvasSize
}
```

### 2. Responsive Grid Layout

```typescript
// src/shared/components/ResponsiveGrid.tsx
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode
  columns?: "auto" | "fixed"
}> = ({ children, columns = "auto" }) => {
  const gridClasses = {
    // Mobile: 1 column
    xs: "grid-cols-1",
    // Small phone: 2 columns
    sm: "sm:grid-cols-2",
    // Tablet: 3 columns
    lg: "lg:grid-cols-3",
    // Desktop: 4 columns
    xl: "xl:grid-cols-4",
  }

  return (
    <div
      className={`
        grid gap-4
        ${gridClasses.xs}
        ${gridClasses.sm}
        ${gridClasses.lg}
        ${gridClasses.xl}
      `}
    >
      {children}
    </div>
  )
}
```

### 3. Media Query Hook

```typescript
// src/shared/hooks/useMediaQuery.ts
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [query])

  return matches
}

// Использование
export const ResponsiveHeader: React.FC = () => {
  const isTablet = useMediaQuery("(min-width: 768px)")
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  return (
    <header>
      {isDesktop && <DesktopNav />}
      {!isDesktop && isTablet && <TabletNav />}
      {!isTablet && <MobileNav />}
    </header>
  )
}
```

---

## 🚀 PERFORMANCE CHECKLIST

### Mobile Performance Targets

```typescript
// Performance budget
const PERFORMANCE_BUDGET = {
  // First Contentful Paint < 2s
  fcp: 2000,
  // Largest Contentful Paint < 2.5s
  lcp: 2500,
  // Cumulative Layout Shift < 0.1
  cls: 0.1,
  // First Input Delay < 100ms
  fid: 100,
  // Total bundle size < 200KB (gzipped)
  bundleSize: 200 * 1024,
}

// Monitor performance
if ("PerformanceObserver" in window) {
  // Monitor Core Web Vitals
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      console.log("Performance:", {
        name: entry.name,
        value: entry.value,
      })
    }
  })

  observer.observe({ entryTypes: ["largest-contentful-paint", "layout-shift"] })
}
```

### Pre-launch Checklist

- ✅ Lighthouse score >= 90 (all metrics)
- ✅ Bundle size <= 200KB (gzipped)
- ✅ FCP < 2 seconds
- ✅ LCP < 2.5 seconds
- ✅ CLS < 0.1
- ✅ All touch targets >= 44px
- ✅ Tested on iPhone SE, iPhone 14, Samsung Galaxy A50
- ✅ Works offline (service worker)
- ✅ No console errors
- ✅ 100% type coverage
- ✅ Mobile-first CSS (no desktop-first breakpoints)
- ✅ Respects prefers-reduced-motion
- ✅ Dark mode support
- ✅ Accessible (WCAG AA)
- ✅ WebP with fallbacks for images
- ✅ HTTPS only
- ✅ CORS properly configured
- ✅ CSP headers set
- ✅ No hardcoded mobile/tablet checks
- ✅ Tested on 3G/4G networks

---

## 📊 TESTING ON MOBILE

### Chrome DevTools Mobile Simulation

```javascript
// Эмуляция медленного 4G
// Chrome DevTools → Network → Slow 4G
// CPU Throttling 4x

// Or via code:
navigator.connection?.downlink // Mbps
navigator.connection?.effectiveType // 4g, 3g, 2g
navigator.connection?.rtt // milliseconds

// Адаптируем качество под сеть
const quality = {
  "4g": 0.85,
  "3g": 0.65,
  "2g": 0.5,
}[navigator.connection?.effectiveType || "4g"]
```

### Real Device Testing

```bash
# Запускаем локальный сервер
npm run dev

# На мобильном устройстве в одной сети:
# http://[YOUR_IP]:5173

# Или используем ngrok для remote testing
npx ngrok http 5173
```

---

## ✅ SUMMARY

**Mobile-first optimizations:**

| Аспект             | Оптимизация            | Результат              |
| ------------------ | ---------------------- | ---------------------- |
| **Viewport**       | Правильные meta tags   | Полный контроль layout |
| **Breakpoints**    | Mobile-first CSS       | Меньше кода, быстрее   |
| **Touch targets**  | min 44x44px            | Удобство использования |
| **Images**         | Оптимизация, WebP      | Меньше bandwidth       |
| **Code splitting** | Lazy routes            | Быстрей initial load   |
| **Caching**        | LocalStorage + TTL     | Offline support        |
| **Performance**    | Bundle < 200KB         | Быстрей загрузка       |
| **Gestures**       | Swipe, tap, long-press | Интуитивный UX         |
| **Accessibility**  | Dark mode, motion      | Доступно для всех      |

Этим подходом достигнете **Lighthouse 95+** на мобильных.
