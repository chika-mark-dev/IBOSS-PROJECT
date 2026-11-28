import { BreakdownItem } from '../../grading/grading.service';
import { ExamSessionStatus } from '../entities/exam-session.entity';
export declare class ResultResponseDto {
    sessionId: string;
    status: ExamSessionStatus;
    submittedAt: Date | null;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    breakdown: BreakdownItem[];
}
