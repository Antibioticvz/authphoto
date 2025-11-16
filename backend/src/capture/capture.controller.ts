import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CaptureService } from './capture.service';
import { CapturePhotoDto } from './dto/capture-photo.dto';
import { CaptureResponseDto } from './dto/capture-response.dto';
import { promises as fs } from 'fs';

/**
 * Controller for photo capture and retrieval
 */
@Controller('capture')
export class CaptureController {
  constructor(private readonly captureService: CaptureService) {}

  /**
   * Capture and verify a photo
   * POST /api/v1/capture
   */
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async capturePhoto(
    @UploadedFile() photo: any,
    @Body() dto: CapturePhotoDto,
  ): Promise<CaptureResponseDto> {
    if (!photo) {
      throw new HttpException('Photo file is required', HttpStatus.BAD_REQUEST);
    }

    return await this.captureService.capturePhoto(photo, dto);
  }

  /**
   * Get photo metadata
   * GET /api/v1/capture/:photoId/metadata
   */
  @Get(':photoId/metadata')
  async getPhotoMetadata(@Param('photoId') photoId: string) {
    const metadata = await this.captureService.getPhoto(photoId);

    if (!metadata) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }

    return metadata;
  }

  /**
   * Get photo file
   * GET /api/v1/capture/:photoId/file
   */
  @Get(':photoId/file')
  async getPhotoFile(@Param('photoId') photoId: string, @Res() res: Response) {
    const metadata = await this.captureService.getPhoto(photoId);

    if (!metadata) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }

    try {
      const fileBuffer = await fs.readFile(metadata.filePath);
      res.set({
        'Content-Type': metadata.mimeType,
        'Content-Length': metadata.fileSize,
        'Cache-Control': 'public, max-age=31536000',
      });
      res.send(fileBuffer);
    } catch (error) {
      throw new HttpException('Failed to read photo file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
