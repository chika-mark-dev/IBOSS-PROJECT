import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamDetailDto } from './dto/exam-detail.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamsService } from './exams.service';

@Controller('exams')
export class AdminExamsController {
  constructor(private readonly exams: ExamsService) {}

  @Post()
  async create(@Body() dto: CreateExamDto): Promise<ExamDetailDto> {
    return ExamDetailDto.from(await this.exams.create(dto));
  }

  @Get('admin')
  async listAll(): Promise<ExamDetailDto[]> {
    const exams = await this.exams.findAll();
    return exams.map((exam) => ExamDetailDto.from(exam));
  }

  @Get(':id/admin')
  async detail(@Param('id', ParseUUIDPipe) id: string): Promise<ExamDetailDto> {
    return ExamDetailDto.from(await this.exams.findById(id));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExamDto,
  ): Promise<ExamDetailDto> {
    return ExamDetailDto.from(await this.exams.update(id, dto));
  }

  @Patch(':id/release')
  async release(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ExamDetailDto> {
    return ExamDetailDto.from(await this.exams.release(id));
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.exams.remove(id);
  }
}
