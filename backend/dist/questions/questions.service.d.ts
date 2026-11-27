import { Repository } from 'typeorm';
import { ExamsService } from '../exams/exams.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
export declare class QuestionsService {
    private readonly questions;
    private readonly exams;
    constructor(questions: Repository<Question>, exams: ExamsService);
    create(examId: string, dto: CreateQuestionDto): Promise<Question>;
    listForExam(examId: string): Promise<Question[]>;
    update(id: string, dto: UpdateQuestionDto): Promise<Question>;
    remove(id: string): Promise<void>;
    private findById;
    private assertConsistent;
}
