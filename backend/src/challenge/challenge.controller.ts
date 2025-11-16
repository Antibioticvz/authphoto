import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { ChallengeResponseDto } from './dto/challenge-response.dto';

/**
 * Controller for challenge generation endpoints
 */
@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  /**
   * Generate a new challenge
   * GET /api/v1/challenge?clientId=xxx&polygonCount=7&ttl=30
   */
  @Get()
  createChallenge(@Query() dto: CreateChallengeDto): ChallengeResponseDto {
    if (!dto.clientId) {
      throw new HttpException('clientId is required', HttpStatus.BAD_REQUEST);
    }

    const challenge = this.challengeService.createChallenge(
      dto.clientId,
      dto.polygonCount,
      dto.ttlSeconds,
    );

    return challenge;
  }

  /**
   * Verify a challenge exists and is valid
   * GET /api/v1/challenge/verify?challengeId=xxx
   */
  @Get('verify')
  verifyChallenge(@Query('challengeId') challengeId: string): { valid: boolean; message?: string } {
    if (!challengeId) {
      throw new HttpException('challengeId is required', HttpStatus.BAD_REQUEST);
    }

    const isValid = this.challengeService.verifyChallenge(challengeId);

    if (!isValid) {
      return {
        valid: false,
        message: 'Challenge not found or expired',
      };
    }

    return {
      valid: true,
    };
  }
}
