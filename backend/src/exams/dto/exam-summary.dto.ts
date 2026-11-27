import { Exam } from '../entities/exams.entity';

export class ExamSummaryDto {
  id!: string;
  title!: string;
  durationMinutes!: number;
  passMarkPercent!: number;

  static from(exam: Exam): ExamSummaryDto {
    const dto = new ExamSummaryDto();
    dto.id = exam.id;
    dto.title = exam.title;
    dto.durationMinutes = exam.durationMinutes;
    dto.passMarkPercent = exam.passMarkPercent;
    return dto;
  }
}
