import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSession } from './entities/exam-session.entity';
import { Answer } from './entities/answer.entity';
import { ExamsModule } from 'src/exams/exams.module';
import { UsersModule } from 'src/users/users.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { GradingModule } from 'src/grading/grading.module';
import { CommonModule } from 'src/common/common.module';
import { TimerModule } from 'src/timer/timer.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamSession, Answer]),
    ExamsModule,
    UsersModule,
    QuestionsModule,
    GradingModule,
    CommonModule,
    TimerModule,
    AuthModule,
  ],
  providers: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
