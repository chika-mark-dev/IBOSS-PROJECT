import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export const ROLE = {
  admin: 'ADMIN',
  student: 'STUDENT',
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, nullable: true })
  student_school_id!: string | null;

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.student,
  })
  role!: Role;

//   @Column({ nullable: true })
//   refresh_token!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date | null;
}
