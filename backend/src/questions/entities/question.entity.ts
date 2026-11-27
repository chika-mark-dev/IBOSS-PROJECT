import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from 'src/exams/entities/exams.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'exam_id', type: 'uuid' })
  @Index()
  examId!: string;

  @ManyToOne(() => Exam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam!: Exam;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'jsonb' })
  options!: string[];

  @Column({ type: 'int' })
  correctIndex!: number;

  @Column({ type: 'int' })
  position!: number;
}
