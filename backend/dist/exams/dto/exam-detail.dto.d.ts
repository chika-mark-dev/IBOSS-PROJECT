import { Exam } from '../entities/exams.entity';
import { ExamSummaryDto } from './exam-summary.dto';
export declare class ExamDetailDto extends ExamSummaryDto {
    isLocked: boolean;
    isReleased: boolean;
    createdAt: Date;
    static from(exam: Exam): ExamDetailDto;
}
