import { StudentQuestionDto } from "../../questions/dto/student-question.dto";
import { ExamSessionStatus } from '../entities/exam-session.entity';
export declare class SessionResponseDto {
    id: string;
    status: ExamSessionStatus;
    expiresAt: Date;
    serverTime: Date;
    remainingSeconds: number;
    questions: StudentQuestionDto[];
    answers: Record<string, number>;
}
