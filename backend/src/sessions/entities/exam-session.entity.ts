import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Exam } from 'src/exams/entities/exams.entity';

export const EXAM_SESSION_STATUS = {
  inProgress: 'IN_PROGRESS',
  submitted: 'SUBMITTED',
  expired: 'EXPIRED',
  abandoned: 'ABANDONED',
} as const;

export type ExamSessionStatus =
  (typeof EXAM_SESSION_STATUS)[keyof typeof EXAM_SESSION_STATUS];

@Entity()
@Unique(['userId', 'examId'])
export class ExamSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Index()
  @Column({ name: 'exam_id', type: 'uuid' })
  examId!: string;

  @ManyToOne(() => Exam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam!: Exam;

  @Column({
    type: 'enum',
    enum: EXAM_SESSION_STATUS,
    default: EXAM_SESSION_STATUS.inProgress,
  })
  status!: ExamSessionStatus;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt!: Date | null;

  @Column({ name: 'question_order', type: 'jsonb' })
  questionOrder!: string[];

  @Column({ name: 'total_questions', type: 'int' })
  totalQuestions!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
