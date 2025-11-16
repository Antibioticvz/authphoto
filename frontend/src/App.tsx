/**
 * AuthPhoto App
 * Main application component for photo capture with polygon challenges
 */

import { useState, useRef, useEffect } from "react"
import "./App.css"
import {
  Camera,
  CanvasOverlay,
  CaptureButton,
  MessageInput,
  ResultDisplay,
} from "./components"
import { useCamera, useChallenge, useCapture } from "./hooks"
import { cryptoService } from "./services"
import { recordCanvasVideo, captureCanvasFrame } from "./utils"

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

  const {
    videoRef,
    stream,
    error: cameraError,
    startCamera,
    stopCamera,
  } = useCamera()
  const { challenge, error: challengeError, requestChallenge } = useChallenge()
  const { result, error: captureError, capturePhoto } = useCapture()

  const compositeCanvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)

  const canvasWidth = 640
  const canvasHeight = 480

  // Initialize: request challenge and start camera
  useEffect(() => {
    if (state === "idle") {
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
  }, [state, requestChallenge, startCamera, clientId])

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
      await capturePhoto(
        photoBlob,
        challenge.challengeId,
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
    if (state === "idle" || state === "requesting") {
      return (
        <div className="loading">
          <h2>🔄 Initializing...</h2>
          <p>Requesting challenge and starting camera...</p>
        </div>
      )
    }

    if (cameraError) {
      return (
        <div className="error">
          <h2>❌ Camera Error</h2>
          <p>{cameraError}</p>
          <button onClick={handleStart}>Try Again</button>
        </div>
      )
    }

    if (challengeError) {
      return (
        <div className="error">
          <h2>❌ Challenge Error</h2>
          <p>{challengeError}</p>
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
          {challenge && (
            <CanvasOverlay
              polygons={challenge.polygons}
              width={canvasWidth}
              height={canvasHeight}
            />
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
            <p>Polygons: {challenge.polygons.length}</p>
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
