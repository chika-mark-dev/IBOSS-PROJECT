import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exams.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam) private readonly exams: Repository<Exam>,
  ) {}

  create(dto: CreateExamDto): Promise<Exam> {
    return this.exams.save(this.exams.create(dto));
  }

  findReleased(): Promise<Exam[]> {
    return this.exams.find({
      where: { isReleased: true },
      order: { createdAt: 'DESC' },
    });
  }
  async findReleasedOrFail(id: string, manager?: EntityManager): Promise<Exam> {
    const exam = manager
      ? await manager.findOne(Exam, { where: { id, isReleased: true } })
      : await this.exams.findOne({ where: { id, isReleased: true } });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async findEditableById(id: string): Promise<Exam> {
    const exam = await this.findById(id);
    this.assertEditable(exam);
    return exam;
  }

  async findById(id: string): Promise<Exam> {
    const exam = await this.exams.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async update(id: string, dto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findById(id);
    this.assertEditable(exam);
    Object.assign(exam, dto);
    return this.exams.save(exam);
  }

  async remove(id: string): Promise<void> {
    const exam = await this.findById(id);
    this.assertEditable(exam);
    await this.exams.remove(exam);
  }

  async release(id: string): Promise<Exam> {
    const exam = await this.findById(id);
    exam.isReleased = true;
    return this.exams.save(exam);
  }

  async lock(id: string, manager?: EntityManager): Promise<void> {
    if (manager) {
      await manager.update(Exam, { id }, { isLocked: true });
      return;
    }
    await this.exams.update({ id }, { isLocked: true });
  }

  findAll(): Promise<Exam[]> {
    return this.exams.find({ order: { createdAt: 'DESC' } });
  }

  private assertEditable(exam: Exam): void {
    if (exam.isLocked) {
      throw new ConflictException(
        'Exam has started and can no longer be changed',
      );
    }
  }
}
