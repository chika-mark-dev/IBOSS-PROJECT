import { Exam } from "../../exams/entities/exams.entity";
export declare class Question {
    id: string;
    examId: string;
    exam: Exam;
    text: string;
    options: string[];
    correctIndex: number;
    position: number;
}
