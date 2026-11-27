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
import { AdminQuestionDto } from './dto/admin-questions.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';

@Controller()
export class QuestionsController {
  constructor(private readonly questions: QuestionsService) {}

  @Post('exams/:examId/questions')
  async create(
    @Param('examId', ParseUUIDPipe) examId: string,
    @Body() dto: CreateQuestionDto,
  ): Promise<AdminQuestionDto> {
    return AdminQuestionDto.from(await this.questions.create(examId, dto));
  }

  @Get('exams/:examId/questions')
  async list(
    @Param('examId', ParseUUIDPipe) examId: string,
  ): Promise<AdminQuestionDto[]> {
    const questions = await this.questions.listForExam(examId);
    return questions.map((question) => AdminQuestionDto.from(question));
  }

  @Patch('questions/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuestionDto,
  ): Promise<AdminQuestionDto> {
    return AdminQuestionDto.from(await this.questions.update(id, dto));
  }

  @Delete('questions/:id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.questions.remove(id);
  }
}
