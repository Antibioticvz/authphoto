/**
 * Response DTO for photo capture
 */
export class CaptureResponseDto {
  photoId!: string;
  photoUrl!: string;
  message!: string;
  verified!: boolean;
  timestamp!: string;
  clientId!: string;
}
