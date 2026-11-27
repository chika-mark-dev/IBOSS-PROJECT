import { ExamSession } from './exam-session.entity';
import { Question } from "../../questions/entities/question.entity";
export declare class Answer {
    id: string;
    sessionId: string;
    session: ExamSession;
    questionId: string;
    question: Question;
    selectedIndex: number;
    answeredAt: Date;
}
