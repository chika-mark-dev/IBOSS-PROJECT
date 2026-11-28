import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { ExamsService } from '../exams/exams.service';
import { GradingQuestion, GradingService } from '../grading/grading.service';
import { QuestionsService } from '../questions/questions.service';
import { TimerService } from '../timer/timer.service';
import { ResultResponseDto } from './dto/result-response.dto';
import { SaveAnswerResponseDto } from './dto/save-answer-response.dto';
import { SaveAnswerDto } from './dto/save-answer.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { Answer } from './entities/answer.entity';
import {
  EXAM_SESSION_STATUS,
  ExamSession,
} from './entities/exam-session.entity';
import { shuffle } from './shuffle.utils';
import { UsersService } from '../users/users.service';
import {
  AdminResultDetail,
  AdminResultListItem,
} from './dto/admin-results.types';

const UNIQUE_VIOLATION = '23505';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(ExamSession)
    private readonly sessions: Repository<ExamSession>,
    @InjectRepository(Answer)
    private readonly answers: Repository<Answer>,
    private readonly dataSource: DataSource,
    private readonly clock: CommonService,
    private readonly timer: TimerService,
    private readonly grading: GradingService,
    private readonly exams: ExamsService,
    private readonly questions: QuestionsService,
    private readonly users: UsersService,
  ) {}

  async start(userId: string, examId: string): Promise<SessionResponseDto> {
    const existing = await this.sessions.findOne({ where: { userId, examId } });
    if (existing) return this.toResponse(await this.closeIfOverdue(existing));

    try {
      const created = await this.dataSource.transaction(async (manager) => {
        const exam = await this.exams.findReleasedOrFail(examId, manager);

        const examQuestions = await this.questions.findAllForExam(
          examId,
          manager,
        );
        if (examQuestions.length === 0) {
          throw new BadRequestException('Exam has no questions');
        }

        await this.exams.lock(examId, manager);

        return manager.save(
          manager.create(ExamSession, {
            userId,
            examId,
            status: EXAM_SESSION_STATUS.inProgress,
            startedAt: this.clock.now(),
            expiresAt: this.timer.computeExpiry(exam.durationMinutes),
            questionOrder: shuffle(examQuestions.map((q) => q.id)),
            totalQuestions: examQuestions.length,
          }),
        );
      });
      return this.toResponse(created);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        const winner = await this.sessions.findOne({
          where: { userId, examId },
        });
        if (winner) return this.toResponse(winner);
      }
      throw error;
    }
  }

  async getForUser(
    sessionId: string,
    userId: string,
  ): Promise<SessionResponseDto> {
    return this.toResponse(await this.findOwned(sessionId, userId));
  }

  async saveAnswer(
    sessionId: string,
    userId: string,
    questionId: string,
    dto: SaveAnswerDto,
  ): Promise<SaveAnswerResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const session = await manager.findOne(ExamSession, {
        where: { id: sessionId, userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!session) throw new NotFoundException('Session not found');

      if (session.status !== EXAM_SESSION_STATUS.inProgress) {
        throw new ConflictException('Session is already closed');
      }
      if (session.expiresAt && this.timer.isExpired(session.expiresAt)) {
        throw new ConflictException('Time is up');
      }
      if (!session.questionOrder.includes(questionId)) {
        throw new NotFoundException('Question not found in this session');
      }

      const [question] = await this.questions.findManyByIds(
        [questionId],
        manager,
      );
      if (!question) throw new NotFoundException('Question not found');
      if (dto.selectedIndex >= question.options.length) {
        throw new BadRequestException(
          'selectedIndex must point to one of the options',
        );
      }

      await manager.upsert(
        Answer,
        {
          sessionId,
          questionId,
          selectedIndex: dto.selectedIndex,
          answeredAt: this.clock.now(),
        },
        ['sessionId', 'questionId'],
      );

      return {
        questionId,
        selectedIndex: dto.selectedIndex,
        serverTime: this.clock.now(),
        remainingSeconds: session.expiresAt
          ? this.timer.remainingSeconds(session.expiresAt)
          : 0,
      };
    });
  }

  async submit(sessionId: string, userId: string): Promise<ResultResponseDto> {
    const session = await this.dataSource.transaction(async (manager) => {
      const locked = await manager.findOne(ExamSession, {
        where: { id: sessionId, userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!locked) throw new NotFoundException('Session not found');

      if (locked.status !== EXAM_SESSION_STATUS.inProgress) return locked;
      if (!locked.expiresAt) {
        throw new ConflictException('Session has no expiry');
      }

      locked.status =
        this.timer.classifySubmit(locked.expiresAt) === 'submitted'
          ? EXAM_SESSION_STATUS.submitted
          : EXAM_SESSION_STATUS.expired;
      locked.submittedAt = this.clock.now();
      return manager.save(locked);
    });
    return this.computeResult(session);
  }

  async getResult(
    sessionId: string,
    userId: string,
  ): Promise<ResultResponseDto> {
    const session = await this.findOwned(sessionId, userId);
    if (session.status === EXAM_SESSION_STATUS.inProgress) {
      throw new ConflictException('Session is still in progress');
    }
    return this.computeResult(session);
  }

  private async findOwned(
    sessionId: string,
    userId: string,
  ): Promise<ExamSession> {
    const session = await this.sessions.findOne({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Session not found');
    return this.closeIfOverdue(session);
  }

  // A session left open past expiry + grace is closed as "expired".
  // classifySubmit says "late" exactly when now is past the grace window.
  private async closeIfOverdue(session: ExamSession): Promise<ExamSession> {
    const overdue =
      session.status === EXAM_SESSION_STATUS.inProgress &&
      !!session.expiresAt &&
      this.timer.classifySubmit(session.expiresAt) === 'submitted_late';
    if (!overdue) return session;

    await this.sessions.update(
      { id: session.id, status: EXAM_SESSION_STATUS.inProgress },
      { status: EXAM_SESSION_STATUS.expired },
    );
    return this.sessions.findOneByOrFail({ id: session.id });
  }

  private async computeResult(
    session: ExamSession,
  ): Promise<ResultResponseDto> {
    const [exam, questionRows, answerRows] = await Promise.all([
      this.exams.findById(session.examId),
      this.questions.findManyByIds(session.questionOrder),
      this.answers.find({ where: { sessionId: session.id } }),
    ]);

    const byId = new Map(questionRows.map((q) => [q.id, q]));
    const graded: GradingQuestion[] = session.questionOrder.flatMap((id) => {
      const q = byId.get(id);
      return q ? [{ id: q.id, correctIndex: q.correctIndex }] : [];
    });
    const selected = new Map(
      answerRows.map((row) => [row.questionId, row.selectedIndex]),
    );

    const result = this.grading.grade(graded, selected, exam.passMarkPercent);

    return {
      sessionId: session.id,
      status: session.status,
      submittedAt: session.submittedAt,
      ...result,
    };
  }

  private async toResponse(session: ExamSession): Promise<SessionResponseDto> {
    const [questionList, answerRows] = await Promise.all([
      this.questions.findForStudent(session.questionOrder),
      this.answers.find({ where: { sessionId: session.id } }),
    ]);

    const answers: Record<string, number> = {};
    for (const row of answerRows) {
      answers[row.questionId] = row.selectedIndex;
    }

    return {
      id: session.id,
      status: session.status,
      expiresAt: session.expiresAt ?? this.clock.now(),
      serverTime: this.clock.now(),
      remainingSeconds: session.expiresAt
        ? this.timer.remainingSeconds(session.expiresAt)
        : 0,
      questions: questionList,
      answers,
    };
  }

  private isUniqueViolation(error: unknown): boolean {
    const e = error as { code?: string; driverError?: { code?: string } };
    return (e?.driverError?.code ?? e?.code) === UNIQUE_VIOLATION;
  }
}
