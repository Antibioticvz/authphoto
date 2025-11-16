import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChallengeService } from '../challenge/challenge.service';
import { CryptoService } from '../shared/services/crypto.service';
import { LoggerService } from '../shared/services/logger.service';
import { CapturePhotoDto } from './dto/capture-photo.dto';
import { CaptureResponseDto } from './dto/capture-response.dto';
import { PhotoMetadata } from './entities/photo.entity';
import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Service for handling photo capture and verification
 */
@Injectable()
export class CaptureService {
  private readonly photosDir: string;
  private readonly baseUrl: string;
  private readonly photoMetadataCache = new Map<string, PhotoMetadata>();

  constructor(
    private readonly challengeService: ChallengeService,
    private readonly cryptoService: CryptoService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.photosDir = this.configService.get('PHOTOS_DIR') || './photos';
    this.baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
    this.loggerService.setContext('CaptureService');
    this.ensurePhotosDirectory();
  }

  /**
   * Captures and verifies a photo
   * @param photo - Uploaded photo file
   * @param dto - Capture request data
   * @returns Capture response with verification result
   */
  async capturePhoto(photo: any, dto: CapturePhotoDto): Promise<CaptureResponseDto> {
    // 1. Validate photo file
    this.validatePhotoFile(photo);

    // 2. Validate video hash format
    this.verifyVideoHash(dto.videoHash);

    // 3. Verify challenge exists and is valid
    const challenge = this.challengeService.getChallenge(dto.challengeId);
    if (!challenge) {
      throw new BadRequestException('Challenge not found or expired');
    }

    // 4. Verify client ID matches
    if (challenge.clientId !== dto.clientId) {
      throw new BadRequestException('Client ID mismatch');
    }

    // 5. Generate photo ID
    const photoId = this.generatePhotoId();
    const timestamp = new Date().toISOString();

    // 6. Save photo to disk
    const fileName = `${photoId}.jpg`;
    const filePath = path.join(this.photosDir, fileName);
    await fs.writeFile(filePath, photo.buffer);

    // 7. Generate photo URL
    const photoUrl = `${this.baseUrl}/api/v1/photos/${photoId}`;

    // 8. Create metadata
    const metadata: PhotoMetadata = {
      photoId,
      challengeId: dto.challengeId,
      clientId: dto.clientId,
      message: dto.message || '',
      verified: true, // For MVP, always true if challenge is valid
      videoHash: dto.videoHash,
      timestamp,
      filePath,
      photoUrl,
      fileSize: photo.size,
      mimeType: photo.mimetype,
    };

    // 9. Save metadata
    await this.savePhotoMetadata(metadata);

    // 10. Delete used challenge
    this.challengeService.deleteChallenge(dto.challengeId);

    this.loggerService.log(`Photo captured: ${photoId} for client: ${dto.clientId}`);

    // 11. Return response
    return {
      photoId,
      photoUrl,
      message: metadata.message,
      verified: metadata.verified,
      timestamp,
      clientId: dto.clientId,
    };
  }

  /**
   * Validates video hash format (SHA-256)
   * @param hash - Video hash to validate
   * @throws BadRequestException if hash is invalid
   */
  verifyVideoHash(hash: string): void {
    // SHA-256 hash should be 64 hexadecimal characters
    const sha256Regex = /^[a-f0-9]{64}$/;

    if (!sha256Regex.test(hash)) {
      throw new BadRequestException(
        'Invalid video hash format. Expected 64-character SHA-256 hex string',
      );
    }
  }

  /**
   * Generates unique photo ID
   * @returns Photo ID with format: photo_<16-hex-chars>
   */
  generatePhotoId(): string {
    const randomPart = this.cryptoService.generateNonce(8).substring(0, 16);
    return `photo_${randomPart}`;
  }

  /**
   * Validates uploaded photo file
   * @param file - Uploaded file
   * @throws BadRequestException if file is invalid
   */
  validatePhotoFile(file: any): void {
    if (!file) {
      throw new BadRequestException('No photo file provided');
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size === 0) {
      throw new BadRequestException('Photo file is empty');
    }
    if (file.size > maxSize) {
      throw new BadRequestException('Photo file too large (max 10MB)');
    }

    // Check MIME type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid photo format. Only JPEG and PNG are allowed');
    }
  }

  /**
   * Saves photo metadata to disk
   * @param metadata - Photo metadata
   */
  async savePhotoMetadata(metadata: PhotoMetadata): Promise<void> {
    // Save to in-memory cache
    this.photoMetadataCache.set(metadata.photoId, metadata);

    // Also save to disk as JSON
    const metadataPath = path.join(this.photosDir, `${metadata.photoId}.json`);
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    this.loggerService.log(`Metadata saved for photo: ${metadata.photoId}`);
  }

  /**
   * Retrieves photo metadata
   * @param photoId - Photo identifier
   * @returns Photo metadata or null if not found
   */
  async getPhoto(photoId: string): Promise<PhotoMetadata | null> {
    // Check cache first
    if (this.photoMetadataCache.has(photoId)) {
      return this.photoMetadataCache.get(photoId) || null;
    }

    // Try to load from disk
    const metadataPath = path.join(this.photosDir, `${photoId}.json`);

    try {
      const data = await fs.readFile(metadataPath, 'utf-8');
      const metadata: PhotoMetadata = JSON.parse(data);
      this.photoMetadataCache.set(photoId, metadata);
      return metadata;
    } catch (error) {
      return null;
    }
  }

  /**
   * Ensures photos directory exists
   */
  private async ensurePhotosDirectory(): Promise<void> {
    try {
      await fs.access(this.photosDir);
    } catch {
      await fs.mkdir(this.photosDir, { recursive: true });
      this.loggerService.log(`Created photos directory: ${this.photosDir}`);
    }
  }
}
