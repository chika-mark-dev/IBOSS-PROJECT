import { ExamSummaryDto } from './dto/exam-summary.dto';
import { ExamsService } from './exams.service';
export declare class StudentExamsController {
    private readonly exams;
    constructor(exams: ExamsService);
    list(): Promise<ExamSummaryDto[]>;
}
