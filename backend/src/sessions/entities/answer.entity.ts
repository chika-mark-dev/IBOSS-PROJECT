import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { ExamSession } from './exam-session.entity';
import { Question } from 'src/questions/entities/question.entity';

@Entity('answers')
@Unique(['sessionId', 'questionId'])
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId!: string;

  @ManyToOne(() => ExamSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session!: ExamSession;

  @Index()
  @Column({ name: 'question_id', type: 'uuid' })
  questionId!: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question;

  @Column({ name: 'selected_index', type: 'int' })
  selectedIndex!: number;

  @Column({ name: 'answered_at', type: 'timestamptz' })
  answeredAt!: Date;
}
