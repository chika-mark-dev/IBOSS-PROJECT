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
  UseGuards,
} from '@nestjs/common';
import { AdminQuestionDto } from './dto/admin-questions.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ROLE } from 'src/users/entities/user.entity';

@Controller()
export class QuestionsController {
  constructor(private readonly questions: QuestionsService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.admin)
  @Post('exams/:examId/questions')
  async create(
    @Param('examId', ParseUUIDPipe) examId: string,
    @Body() dto: CreateQuestionDto,
  ): Promise<AdminQuestionDto> {
    return AdminQuestionDto.from(await this.questions.create(examId, dto));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.admin)
  @Get('exams/:examId/questions')
  async list(
    @Param('examId', ParseUUIDPipe) examId: string,
  ): Promise<AdminQuestionDto[]> {
    const questions = await this.questions.listForExam(examId);
    return questions.map((question) => AdminQuestionDto.from(question));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.admin)
  @Patch('questions/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuestionDto,
  ): Promise<AdminQuestionDto> {
    return AdminQuestionDto.from(await this.questions.update(id, dto));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.admin)
  @Delete('questions/:id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.questions.remove(id);
  }
}
