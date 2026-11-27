import { CreateExamDto } from './dto/create-exam.dto';
import { ExamDetailDto } from './dto/exam-detail.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamsService } from './exams.service';
export declare class AdminExamsController {
    private readonly exams;
    constructor(exams: ExamsService);
    create(dto: CreateExamDto): Promise<ExamDetailDto>;
    listAll(): Promise<ExamDetailDto[]>;
    detail(id: string): Promise<ExamDetailDto>;
    update(id: string, dto: UpdateExamDto): Promise<ExamDetailDto>;
    release(id: string): Promise<ExamDetailDto>;
    remove(id: string): Promise<void>;
}
