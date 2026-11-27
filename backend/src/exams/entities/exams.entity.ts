import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'int' })
  durationMinutes!: number;

  @Column({ type: 'int' })
  passMarkPercent!: number;

  @Column({ type: 'boolean', default: false })
  isLocked!: boolean;

  @Column({ type: 'boolean', default: false })
  isReleased!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
