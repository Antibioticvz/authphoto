import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * CryptoService provides cryptographic utilities for the application.
 * Handles SHA-256 hashing, UUID generation, and nonce generation.
 */
@Injectable()
export class CryptoService {
  /**
   * Generates a SHA-256 hash of the input data.
   * @param data - The data to hash
   * @returns A 64-character hexadecimal string
   */
  generateHash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generates a UUID v4 (random UUID).
   * @returns A UUID string in the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   */
  generateUUID(): string {
    return uuidv4();
  }

  /**
   * Generates a cryptographically secure random nonce.
   * @param length - The length of the nonce in bytes (default: 32)
   * @returns A hexadecimal string of the specified length
   */
  generateNonce(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * Verifies if a hash matches the expected hash of the data.
   * @param data - The data to hash
   * @param expectedHash - The expected hash value
   * @returns True if the hashes match, false otherwise
   */
  verifyHash(data: string, expectedHash: string): boolean {
    const actualHash = this.generateHash(data);
    return actualHash === expectedHash;
  }
}
