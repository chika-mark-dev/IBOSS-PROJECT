import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { StudentExamsController } from './student-exams.controller';
import { AdminExamsController } from './admin-exams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exams.entity';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([Exam]), AuthModule],
  providers: [ExamsService],
  controllers: [StudentExamsController, AdminExamsController],
  exports: [ExamsService],
})
export class ExamsModule {}
