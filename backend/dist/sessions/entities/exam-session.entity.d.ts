import { User } from '../../users/entities/user.entity';
import { Exam } from "../../exams/entities/exams.entity";
export declare const EXAM_SESSION_STATUS: {
    readonly inProgress: "IN_PROGRESS";
    readonly submitted: "SUBMITTED";
    readonly expired: "EXPIRED";
    readonly abandoned: "ABANDONED";
};
export type ExamSessionStatus = (typeof EXAM_SESSION_STATUS)[keyof typeof EXAM_SESSION_STATUS];
export declare class ExamSession {
    id: string;
    userId: string;
    user: User;
    examId: string;
    exam: Exam;
    status: ExamSessionStatus;
    startedAt: Date;
    expiresAt: Date | null;
    submittedAt: Date | null;
    questionOrder: string[];
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}
