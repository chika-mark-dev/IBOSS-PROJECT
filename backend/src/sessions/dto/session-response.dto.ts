import { StudentQuestionDto } from 'src/questions/dto/student-question.dto';
import { ExamSessionStatus } from '../entities/exam-session.entity';

export class SessionResponseDto {
  id!: string;
  status!: ExamSessionStatus;
  expiresAt!: Date;
  serverTime!: Date;
  remainingSeconds!: number;
  questions!: StudentQuestionDto[];
  answers!: Record<string, number>;
}
