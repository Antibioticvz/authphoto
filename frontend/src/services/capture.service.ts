/**
 * Capture Service
 * API methods for photo capture and retrieval
 */

import type { CaptureResponse, PhotoMetadata } from "../types"
import { apiClient } from "./api"

export class CaptureService {
  /**
   * Upload photo with challenge data
   * @param photo - Photo blob
   * @param challengeId - Challenge ID
   * @param videoHash - SHA-256 hash of video
   * @param message - Optional message
   * @returns Capture response with photoId
   */
  async capturePhoto(
    photo: Blob,
    challengeId: string,
    clientId: string,
    videoHash: string,
    message?: string
  ): Promise<CaptureResponse> {
    const formData = new FormData()
    formData.append("photo", photo, "photo.jpg")
    formData.append("challengeId", challengeId)
    formData.append("clientId", clientId)
    formData.append("videoHash", videoHash)
    if (message) {
      formData.append("message", message)
    }

    console.log(
      "🔍 Capture Service - FormData contents:",
      Array.from(formData.entries())
    )
    console.log("🔍 Capture Service - challengeId being sent:", challengeId)

    const response = await apiClient.post<{
      status: string
      data: CaptureResponse
      timestamp: string
    }>("/api/v1/capture", formData)

    // Backend wraps response in { status, data, timestamp }, extract the actual data
    const captureData = response.data.data || response.data
    console.log("🔍 Capture Service - Extracted capture data:", captureData)
    return captureData
  }

  /**
   * Get photo metadata
   * @param photoId - Photo ID
   * @returns Photo metadata
   */
  async getPhotoMetadata(photoId: string): Promise<PhotoMetadata> {
    const response = await apiClient.get<PhotoMetadata>(
      `/api/v1/capture/${photoId}/metadata`
    )
    return response.data
  }

  /**
   * Get photo file URL
   * @param photoId - Photo ID
   * @returns Photo file URL
   */
  getPhotoUrl(photoId: string): string {
    return `${apiClient.defaults.baseURL}/api/v1/capture/${photoId}/file`
  }
}

export const captureService = new CaptureService()
