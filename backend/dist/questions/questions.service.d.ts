import { ExamsService } from '../exams/exams.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { EntityManager, Repository } from 'typeorm';
import { StudentQuestionDto } from './dto/student-question.dto';
export declare class QuestionsService {
    private readonly questions;
    private readonly exams;
    constructor(questions: Repository<Question>, exams: ExamsService);
    create(examId: string, dto: CreateQuestionDto): Promise<Question>;
    listForExam(examId: string): Promise<Question[]>;
    findAllForExam(examId: string, manager: EntityManager): Promise<Question[]>;
    findForStudent(questionIds: string[]): Promise<StudentQuestionDto[]>;
    update(id: string, dto: UpdateQuestionDto): Promise<Question>;
    remove(id: string): Promise<void>;
    findManyByIds(ids: string[], manager?: EntityManager): Promise<Question[]>;
    private findById;
    private assertConsistent;
}
