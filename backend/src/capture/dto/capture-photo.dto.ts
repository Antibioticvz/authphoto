import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO for photo capture request
 */
export class CapturePhotoDto {
  @IsString()
  @IsNotEmpty()
  challengeId!: string;

  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsString()
  @IsNotEmpty()
  videoHash!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  message?: string;

  @IsString()
  @IsOptional()
  videoBase64?: string;
}
