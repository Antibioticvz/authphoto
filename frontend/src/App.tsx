/**
 * AuthPhoto App
 * Main application component for photo capture with polygon challenges
 */

import { useEffect, useMemo, useRef, useState } from "react"
import "./App.css"
import {
  Camera,
  CaptureButton,
  MessageInput,
  PolygonLinesOverlay,
  ResultDisplay,
} from "./components"
import { useCamera, useCapture, useChallenge } from "./hooks"
import { API_BASE_URL, cryptoService } from "./services"
import {
  applyAnimation,
  captureCanvasFrame,
  drawPolygon,
  recordCanvasVideo,
} from "./utils"

// Check if HTTPS is required and redirect if needed
function checkAndRedirectToHTTPS() {
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  const isHTTPS = window.location.protocol === "https:"

  // If not localhost and not HTTPS, we need to redirect
  if (!isLocalhost && !isHTTPS) {
    const httpsUrl = window.location.href.replace("http://", "https://")
    console.warn("Camera API requires HTTPS. Redirecting to:", httpsUrl)
    window.location.href = httpsUrl
    return true // Redirecting
  }

  return false // No redirect needed
}

type AppState =
  | "idle"
  | "requesting"
  | "ready"
  | "recording"
  | "capturing"
  | "uploading"
  | "complete"

function App() {
  const [state, setState] = useState<AppState>("idle")
  const [message, setMessage] = useState("")
  const [clientId] = useState(() => cryptoService.generateClientId())
  const [videoHash, setVideoHash] = useState<string>("")
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [showPolygonLines, setShowPolygonLines] = useState(false)

  const {
    videoRef,
    stream,
    error: cameraError,
    startCamera,
    stopCamera,
  } = useCamera()
  const { challenge, error: challengeError, requestChallenge } = useChallenge()
  const { result, error: captureError, capturePhoto } = useCapture()

  const polygons = useMemo(() => challenge?.polygons ?? [], [challenge])

  const compositeCanvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)

  const canvasWidth = 640
  const canvasHeight = 480

  // Check HTTPS requirement first
  useEffect(() => {
    if (checkAndRedirectToHTTPS()) {
      setIsRedirecting(true)
    }
  }, [])

  // Initialize: request challenge and start camera
  useEffect(() => {
    if (state === "idle" && !isRedirecting) {
      const start = async () => {
        setState("requesting")

        try {
          await requestChallenge(clientId)
          await startCamera()
          setState("ready")
        } catch (err) {
          console.error("Failed to start:", err)
          setState("idle")
        }
      }

      start()
    }
  }, [state, requestChallenge, startCamera, clientId, isRedirecting])

  // Draw polygons to hidden overlay canvas for composite rendering
  useEffect(() => {
    if (!challenge || polygons.length === 0 || !overlayCanvasRef.current) return

    const canvas = overlayCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const startTime = Date.now()
    let animationFrameId: number

    const animate = () => {
      const elapsed = Date.now() - startTime

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Draw all polygons with animations
      polygons?.forEach(polygon => {
        const animatedPolygon = applyAnimation(polygon, elapsed)
        drawPolygon(ctx, animatedPolygon, canvasWidth, canvasHeight)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [challenge, polygons, canvasWidth, canvasHeight])

  const handleStart = async () => {
    setState("requesting")

    try {
      await requestChallenge(clientId)
      await startCamera()
      setState("ready")
    } catch (err) {
      console.error("Failed to start:", err)
      setState("idle")
    }
  }

  const handleCapture = async () => {
    if (!challenge || !videoRef.current || !compositeCanvasRef.current) {
      console.error("Missing required elements")
      return
    }

    setState("recording")

    try {
      // Create composite canvas with video + polygons
      const compositeCanvas = compositeCanvasRef.current
      const ctx = compositeCanvas.getContext("2d")
      if (!ctx) throw new Error("Failed to get canvas context")

      // Animation loop for composite canvas
      const drawComposite = () => {
        if (!videoRef.current) return

        // Draw video frame (mirrored)
        ctx.save()
        ctx.scale(-1, 1)
        ctx.drawImage(
          videoRef.current,
          -canvasWidth,
          0,
          canvasWidth,
          canvasHeight
        )
        ctx.restore()

        // Draw polygons overlay
        if (overlayCanvasRef.current) {
          ctx.drawImage(overlayCanvasRef.current, 0, 0)
        }
      }

      // Start drawing loop
      const drawInterval = setInterval(drawComposite, 1000 / 30) // 30 FPS

      // Record 2-second video
      const videoBlob = await recordCanvasVideo(compositeCanvas, 2000)
      clearInterval(drawInterval)

      // Calculate video hash
      const hash = await cryptoService.calculateSHA256(videoBlob)
      setVideoHash(hash)

      setState("capturing")

      // Capture final frame as photo
      const photoBlob = await captureCanvasFrame(compositeCanvas)

      setState("uploading")

      // Upload to server
      console.log("🔍 App - About to capture photo with:", {
        challengeId: challenge.challengeId,
        clientId: clientId,
        hash: hash,
        message: message || undefined,
      })

      await capturePhoto(
        photoBlob,
        challenge.challengeId,
        clientId,
        hash,
        message || undefined
      )

      setState("complete")
    } catch (err) {
      console.error("Capture failed:", err)
      setState("ready")
    }
  }

  const handleReset = () => {
    setState("idle")
    setMessage("")
    setVideoHash("")
    stopCamera()
    window.location.reload()
  }

  const renderContent = () => {
    if (isRedirecting) {
      return (
        <div className="loading">
          <h2>🔒 Redirecting to HTTPS...</h2>
          <p>Camera access requires a secure connection.</p>
          <p style={{ fontSize: "12px", color: "#666" }}>
            You'll need to accept the security warning.
          </p>
        </div>
      )
    }

    if (state === "idle" || state === "requesting") {
      return (
        <div className="loading">
          <h2>🔄 Initializing...</h2>
          <p>Requesting challenge and starting camera...</p>
          {state === "requesting" && (
            <p style={{ fontSize: "12px", color: "#666" }}>Please wait...</p>
          )}
        </div>
      )
    }

    if (cameraError) {
      const isHttpsError =
        cameraError.includes("not supported") || cameraError.includes("HTTPS")

      return (
        <div className="error">
          <h2>❌ Camera Error</h2>
          <p>{cameraError}</p>
          {isHttpsError && (
            <div
              style={{
                marginTop: "15px",
                padding: "15px",
                backgroundColor: "#fff3cd",
                borderRadius: "5px",
                textAlign: "left",
              }}
            >
              <h3 style={{ marginTop: 0 }}>💡 Solution:</h3>
              <p>Camera access requires HTTPS when not on localhost.</p>
              <ol style={{ marginLeft: "20px" }}>
                <li>
                  Make sure you're accessing via HTTPS:{" "}
                  <code>https://192.168.100.4:5173</code>
                </li>
                <li>
                  Accept the self-signed certificate warning in your browser
                </li>
                <li>Grant camera permission when prompted</li>
              </ol>
              <p>
                Current URL: <code>{window.location.href}</code>
              </p>
            </div>
          )}
          <button onClick={handleStart} style={{ marginTop: "15px" }}>
            Try Again
          </button>
        </div>
      )
    }

    if (challengeError) {
      return (
        <div className="error">
          <h2>❌ Challenge Error</h2>
          <p>{challengeError}</p>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
            API URL: {API_BASE_URL}
          </p>
          <button onClick={handleStart}>Try Again</button>
        </div>
      )
    }

    if (state === "complete") {
      return (
        <div className="complete">
          <h2>Photo Captured!</h2>
          <ResultDisplay result={result} error={captureError} />
          <div style={{ marginTop: "20px" }}>
            <button onClick={handleReset} style={{ padding: "10px 20px" }}>
              Capture Another Photo
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="capture-flow">
        <h2>📸 AuthPhoto Capture</h2>
        <p>Position yourself so the colored polygons are visible</p>

        <div
          className="camera-container"
          style={{ position: "relative", display: "inline-block" }}
        >
          <Camera
            videoRef={videoRef}
            width={canvasWidth}
            height={canvasHeight}
          />
          {challenge && polygons.length > 0 && (
            <>
              {/* Demo mode: Show polygon detection lines */}
              <PolygonLinesOverlay
                polygons={polygons}
                width={canvasWidth}
                height={canvasHeight}
                visible={showPolygonLines}
              />
              {/* Challenge polygons are always rendered to composite canvas for photo capture,
                  but they are NOT shown in live preview to the user */}
            </>
          )}
          {/* Hidden canvas for overlay rendering */}
          <canvas
            ref={overlayCanvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ display: "none" }}
          />
        </div>

        <div className="controls" style={{ marginTop: "20px" }}>
          {/* Toggle button for polygon lines */}
          <div style={{ marginBottom: "10px" }}>
            <button
              onClick={() => setShowPolygonLines(!showPolygonLines)}
              style={{
                padding: "8px 16px",
                backgroundColor: showPolygonLines ? "#4CAF50" : "#666",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background-color 0.3s",
              }}
            >
              {showPolygonLines ? "🔆 Hide Lines" : "🔅 Show Lines"} (Demo)
            </button>
            <span
              style={{ marginLeft: "10px", fontSize: "12px", color: "#666" }}
            >
              {showPolygonLines
                ? "Neon lines show how algorithm detects polygons"
                : "Toggle to see polygon detection lines"}
            </span>
          </div>

          <MessageInput
            value={message}
            onChange={setMessage}
            disabled={state !== "ready"}
            placeholder="Optional message..."
          />
        </div>

        <div className="actions" style={{ marginTop: "20px" }}>
          <CaptureButton
            onClick={handleCapture}
            disabled={state !== "ready" || !challenge || !stream}
            isLoading={
              state === "recording" ||
              state === "capturing" ||
              state === "uploading"
            }
          />
        </div>

        {state === "recording" && <p>🎥 Recording video...</p>}
        {state === "capturing" && <p>📸 Capturing photo...</p>}
        {state === "uploading" && <p>☁️ Uploading...</p>}

        {challenge && (
          <div
            className="challenge-info"
            style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}
          >
            <p>Challenge ID: {challenge.challengeId}</p>
            <p>Polygons: {polygons.length}</p>
            <p>Expires: {new Date(challenge.expiresAt).toLocaleTimeString()}</p>
            {videoHash && <p>Video Hash: {videoHash.substring(0, 16)}...</p>}
          </div>
        )}
      </div>
    )
  }

  // Hidden composite canvas for recording
  return (
    <div className="app">
      <header>
        <h1>🔐 AuthPhoto</h1>
        <p>Secure Photo Capture with Visual Challenge</p>
      </header>

      <main>{renderContent()}</main>

      {/* Hidden canvas for composite rendering (video + polygons) */}
      <canvas
        ref={compositeCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ display: "none" }}
      />
    </div>
  )
}

export default App
