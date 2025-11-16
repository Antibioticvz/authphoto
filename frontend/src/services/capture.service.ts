/**
 * Capture Service
 * API methods for photo capture and retrieval
 */

import { apiClient } from './api';
import type { CaptureResponse, PhotoMetadata } from '../types';

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
    videoHash: string,
    message?: string
  ): Promise<CaptureResponse> {
    const formData = new FormData();
    formData.append('photo', photo, 'photo.jpg');
    formData.append('challengeId', challengeId);
    formData.append('videoHash', videoHash);
    if (message) {
      formData.append('message', message);
    }

    const response = await apiClient.post<CaptureResponse>(
      '/api/v1/capture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Get photo metadata
   * @param photoId - Photo ID
   * @returns Photo metadata
   */
  async getPhotoMetadata(photoId: string): Promise<PhotoMetadata> {
    const response = await apiClient.get<PhotoMetadata>(
      `/api/v1/capture/${photoId}/metadata`
    );
    return response.data;
  }

  /**
   * Get photo file URL
   * @param photoId - Photo ID
   * @returns Photo file URL
   */
  getPhotoUrl(photoId: string): string {
    return `${apiClient.defaults.baseURL}/api/v1/capture/${photoId}/file`;
  }
}

export const captureService = new CaptureService();
