/**
 * Crypto Service
 * Client-side cryptographic operations
 */

export class CryptoService {
  /**
   * Calculate SHA-256 hash of a blob
   * @param blob - Blob to hash
   * @returns Hex string of SHA-256 hash
   */
  async calculateSHA256(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate a random client ID
   * @returns Random client ID string
   */
  generateClientId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export const cryptoService = new CryptoService();
