import { CommonService } from '../common/common.service';
export declare const GRACE_SECONDS = 10;
export type SubmitClass = 'submitted' | 'submitted_late';
export declare class TimerService {
    private readonly clock;
    constructor(clock: CommonService);
    computeExpiry(durationMinutes: number): Date;
    isExpired(expiresAt: Date): boolean;
    classifySubmit(expiresAt: Date): SubmitClass;
    remainingSeconds(expiresAt: Date): number;
}
