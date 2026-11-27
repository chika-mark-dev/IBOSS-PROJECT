import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { StudentExamsController } from './student-exams.controller';
import { AdminExamsController } from './admin-exams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exams.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  providers: [ExamsService],
  controllers: [StudentExamsController, AdminExamsController],
  exports: [ExamsService],
})
export class ExamsModule {}
