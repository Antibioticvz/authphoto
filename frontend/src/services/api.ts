/**
 * API Client
 * Axios configuration and base client
 */

import axios, { type AxiosInstance } from 'axios';

const DEFAULT_FALLBACK_URL = 'http://localhost:3000';
const DEFAULT_API_PORT = import.meta.env.VITE_API_PORT || '3000';

function resolveApiBaseUrl(): string {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol || 'http:';
    const hostname = window.location.hostname || 'localhost';
    const portSuffix = DEFAULT_API_PORT ? `:${DEFAULT_API_PORT}` : '';
    return `${protocol}//${hostname}${portSuffix}`;
  }

  return DEFAULT_FALLBACK_URL;
}

export const API_BASE_URL = resolveApiBaseUrl();

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();
