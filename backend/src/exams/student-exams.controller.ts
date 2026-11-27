import { Controller, Get } from '@nestjs/common';
import { ExamSummaryDto } from './dto/exam-summary.dto';
import { ExamsService } from './exams.service';
import { ROLE } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
//import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLE.student)
@Controller('exams')
export class StudentExamsController {
  constructor(private readonly exams: ExamsService) {}

  @Get()
  async list(): Promise<ExamSummaryDto[]> {
    const exams = await this.exams.findReleased();
    return exams.map((exam) => ExamSummaryDto.from(exam));
  }
}
