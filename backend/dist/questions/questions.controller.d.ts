import { AdminQuestionDto } from './dto/admin-questions.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';
export declare class QuestionsController {
    private readonly questions;
    constructor(questions: QuestionsService);
    create(examId: string, dto: CreateQuestionDto): Promise<AdminQuestionDto>;
    list(examId: string): Promise<AdminQuestionDto[]>;
    update(id: string, dto: UpdateQuestionDto): Promise<AdminQuestionDto>;
    remove(id: string): Promise<void>;
}
