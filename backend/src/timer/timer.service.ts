import { Injectable } from '@nestjs/common';
import { CommonService } from '../common/common.service';

export const GRACE_SECONDS = 10;

export type SubmitClass = 'submitted' | 'submitted_late';

@Injectable()
export class TimerService {
  constructor(private readonly clock: CommonService) {}

  computeExpiry(durationMinutes: number): Date {
    return new Date(this.clock.now().getTime() + durationMinutes * 60_000);
  }

  isExpired(expiresAt: Date): boolean {
    return this.clock.now().getTime() >= expiresAt.getTime();
  }

  classifySubmit(expiresAt: Date): SubmitClass {
    const deadline = expiresAt.getTime() + GRACE_SECONDS * 1000;
    return this.clock.now().getTime() <= deadline
      ? 'submitted'
      : 'submitted_late';
  }

  remainingSeconds(expiresAt: Date): number {
    const ms = expiresAt.getTime() - this.clock.now().getTime();
    return Math.max(0, Math.ceil(ms / 1000));
  }
}
