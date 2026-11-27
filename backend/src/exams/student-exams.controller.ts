import { Controller, Get } from '@nestjs/common';
import { ExamSummaryDto } from './dto/exam-summary.dto';
import { ExamsService } from './exams.service';

@Controller('exams')
export class StudentExamsController {
  constructor(private readonly exams: ExamsService) {}

  @Get()
  async list(): Promise<ExamSummaryDto[]> {
    const exams = await this.exams.findReleased();
    return exams.map((exam) => ExamSummaryDto.from(exam));
  }
}
