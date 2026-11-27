import { Exam } from '../entities/exams.entity';
import { ExamSummaryDto } from './exam-summary.dto';

export class ExamDetailDto extends ExamSummaryDto {
  isLocked!: boolean;
  isReleased!: boolean;
  createdAt!: Date;

  static from(exam: Exam): ExamDetailDto {
    const dto = new ExamDetailDto();
    Object.assign(dto, ExamSummaryDto.from(exam));
    dto.isLocked = exam.isLocked;
    dto.isReleased = exam.isReleased;
    dto.createdAt = exam.createdAt;
    return dto;
  }
}
