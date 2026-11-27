import { Question } from '../entities/question.entity';
export declare class AdminQuestionDto {
    id: string;
    examId: string;
    text: string;
    options: string[];
    correctIndex: number;
    position: number;
    static from(question: Question): AdminQuestionDto;
}
