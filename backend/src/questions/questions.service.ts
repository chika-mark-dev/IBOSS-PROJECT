import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamsService } from '../exams/exams.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questions: Repository<Question>,
    private readonly exams: ExamsService,
  ) {}

  async create(examId: string, dto: CreateQuestionDto): Promise<Question> {
    await this.exams.findEditableById(examId);
    this.assertConsistent(dto.options, dto.correctIndex);
    const last = await this.questions.maximum('position', { examId });
    return this.questions.save(
      this.questions.create({ ...dto, examId, position: (last ?? 0) + 1 }),
    );
  }

  async listForExam(examId: string): Promise<Question[]> {
    await this.exams.findById(examId);
    return this.questions.find({
      where: { examId },
      order: { position: 'ASC' },
    });
  }

  async update(id: string, dto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findById(id);
    await this.exams.findEditableById(question.examId);
    this.assertConsistent(
      dto.options ?? question.options,
      dto.correctIndex ?? question.correctIndex,
    );
    Object.assign(question, dto);
    return this.questions.save(question);
  }

  async remove(id: string): Promise<void> {
    const question = await this.findById(id);
    await this.exams.findEditableById(question.examId);
    await this.questions.remove(question);
  }

  private async findById(id: string): Promise<Question> {
    const question = await this.questions.findOne({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  private assertConsistent(options: string[], correctIndex: number): void {
    if (correctIndex >= options.length) {
      throw new BadRequestException(
        'correctIndex must point to one of the options',
      );
    }
    const distinct = new Set(options.map((option) => option.toLowerCase()));
    if (distinct.size !== options.length) {
      throw new BadRequestException(
        'Options must be different from each other',
      );
    }
  }
}
