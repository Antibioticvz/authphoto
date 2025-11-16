import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * CacheService provides in-memory caching with TTL (Time To Live) support.
 * Automatically removes expired entries on access.
 */
@Injectable()
export class CacheService {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  /**
   * Sets a value in the cache with an optional TTL.
   * @param key - The cache key
   * @param value - The value to cache
   * @param ttlSeconds - Time to live in seconds (default: 30)
   */
  set<T>(key: string, value: T, ttlSeconds: number = 30): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Gets a value from the cache.
   * Returns null if the key doesn't exist or has expired.
   * @param key - The cache key
   * @returns The cached value or null
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Deletes a value from the cache.
   * @param key - The cache key
   * @returns True if the key existed and was deleted, false otherwise
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Checks if a key exists in the cache and is not expired.
   * @param key - The cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const value = this.get(key);
    return value !== null;
  }

  /**
   * Clears all entries from the cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Gets the number of entries in the cache (including expired ones).
   * @returns The number of cache entries
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Removes all expired entries from the cache.
   * @returns The number of entries removed
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }
}
