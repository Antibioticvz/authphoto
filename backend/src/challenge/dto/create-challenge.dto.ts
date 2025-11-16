import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

/**
 * DTO for creating a new challenge
 */
export class CreateChallengeDto {
  @IsString()
  clientId!: string;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(10)
  polygonCount?: number = 7;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(120)
  ttlSeconds?: number = 30;
}
