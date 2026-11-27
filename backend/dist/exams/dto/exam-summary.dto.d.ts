import { Exam } from '../entities/exams.entity';
export declare class ExamSummaryDto {
    id: string;
    title: string;
    durationMinutes: number;
    passMarkPercent: number;
    static from(exam: Exam): ExamSummaryDto;
}
