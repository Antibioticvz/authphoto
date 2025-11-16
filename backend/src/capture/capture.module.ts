import { Module } from '@nestjs/common';
import { CaptureController } from './capture.controller';
import { CaptureService } from './capture.service';
import { ChallengeModule } from '../challenge/challenge.module';

/**
 * Capture module for photo capture and verification
 */
@Module({
  imports: [ChallengeModule],
  controllers: [CaptureController],
  providers: [CaptureService],
  exports: [CaptureService],
})
export class CaptureModule {}
