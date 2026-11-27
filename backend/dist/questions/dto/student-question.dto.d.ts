import { Question } from '../entities/question.entity';
export declare class StudentQuestionDto {
    id: string;
    text: string;
    options: string[];
    static from(question: Question): StudentQuestionDto;
}
