"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_service_1 = require("../common/common.service");
const exams_service_1 = require("../exams/exams.service");
const grading_service_1 = require("../grading/grading.service");
const questions_service_1 = require("../questions/questions.service");
const timer_service_1 = require("../timer/timer.service");
const answer_entity_1 = require("./entities/answer.entity");
const exam_session_entity_1 = require("./entities/exam-session.entity");
const shuffle_utils_1 = require("./shuffle.utils");
const users_service_1 = require("../users/users.service");
const UNIQUE_VIOLATION = '23505';
let SessionsService = class SessionsService {
    sessions;
    answers;
    dataSource;
    clock;
    timer;
    grading;
    exams;
    questions;
    users;
    constructor(sessions, answers, dataSource, clock, timer, grading, exams, questions, users) {
        this.sessions = sessions;
        this.answers = answers;
        this.dataSource = dataSource;
        this.clock = clock;
        this.timer = timer;
        this.grading = grading;
        this.exams = exams;
        this.questions = questions;
        this.users = users;
    }
    async start(userId, examId) {
        const existing = await this.sessions.findOne({ where: { userId, examId } });
        if (existing)
            return this.toResponse(await this.closeIfOverdue(existing));
        try {
            const created = await this.dataSource.transaction(async (manager) => {
                const exam = await this.exams.findReleasedOrFail(examId, manager);
                const examQuestions = await this.questions.findAllForExam(examId, manager);
                if (examQuestions.length === 0) {
                    throw new common_1.BadRequestException('Exam has no questions');
                }
                await this.exams.lock(examId, manager);
                return manager.save(manager.create(exam_session_entity_1.ExamSession, {
                    userId,
                    examId,
                    status: exam_session_entity_1.EXAM_SESSION_STATUS.inProgress,
                    startedAt: this.clock.now(),
                    expiresAt: this.timer.computeExpiry(exam.durationMinutes),
                    questionOrder: (0, shuffle_utils_1.shuffle)(examQuestions.map((q) => q.id)),
                    totalQuestions: examQuestions.length,
                }));
            });
            return this.toResponse(created);
        }
        catch (error) {
            if (this.isUniqueViolation(error)) {
                const winner = await this.sessions.findOne({
                    where: { userId, examId },
                });
                if (winner)
                    return this.toResponse(winner);
            }
            throw error;
        }
    }
    async getForUser(sessionId, userId) {
        return this.toResponse(await this.findOwned(sessionId, userId));
    }
    async saveAnswer(sessionId, userId, questionId, dto) {
        return this.dataSource.transaction(async (manager) => {
            const session = await manager.findOne(exam_session_entity_1.ExamSession, {
                where: { id: sessionId, userId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!session)
                throw new common_1.NotFoundException('Session not found');
            if (session.status !== exam_session_entity_1.EXAM_SESSION_STATUS.inProgress) {
                throw new common_1.ConflictException('Session is already closed');
            }
            if (session.expiresAt && this.timer.isExpired(session.expiresAt)) {
                throw new common_1.ConflictException('Time is up');
            }
            if (!session.questionOrder.includes(questionId)) {
                throw new common_1.NotFoundException('Question not found in this session');
            }
            const [question] = await this.questions.findManyByIds([questionId], manager);
            if (!question)
                throw new common_1.NotFoundException('Question not found');
            if (dto.selectedIndex >= question.options.length) {
                throw new common_1.BadRequestException('selectedIndex must point to one of the options');
            }
            await manager.upsert(answer_entity_1.Answer, {
                sessionId,
                questionId,
                selectedIndex: dto.selectedIndex,
                answeredAt: this.clock.now(),
            }, ['sessionId', 'questionId']);
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
    async submit(sessionId, userId) {
        const session = await this.dataSource.transaction(async (manager) => {
            const locked = await manager.findOne(exam_session_entity_1.ExamSession, {
                where: { id: sessionId, userId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!locked)
                throw new common_1.NotFoundException('Session not found');
            if (locked.status !== exam_session_entity_1.EXAM_SESSION_STATUS.inProgress)
                return locked;
            if (!locked.expiresAt) {
                throw new common_1.ConflictException('Session has no expiry');
            }
            locked.status =
                this.timer.classifySubmit(locked.expiresAt) === 'submitted'
                    ? exam_session_entity_1.EXAM_SESSION_STATUS.submitted
                    : exam_session_entity_1.EXAM_SESSION_STATUS.expired;
            locked.submittedAt = this.clock.now();
            return manager.save(locked);
        });
        return this.computeResult(session);
    }
    async getResult(sessionId, userId) {
        const session = await this.findOwned(sessionId, userId);
        if (session.status === exam_session_entity_1.EXAM_SESSION_STATUS.inProgress) {
            throw new common_1.ConflictException('Session is still in progress');
        }
        return this.computeResult(session);
    }
    async findOwned(sessionId, userId) {
        const session = await this.sessions.findOne({
            where: { id: sessionId, userId },
        });
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        return this.closeIfOverdue(session);
    }
    async closeIfOverdue(session) {
        const overdue = session.status === exam_session_entity_1.EXAM_SESSION_STATUS.inProgress &&
            !!session.expiresAt &&
            this.timer.classifySubmit(session.expiresAt) === 'submitted_late';
        if (!overdue)
            return session;
        await this.sessions.update({ id: session.id, status: exam_session_entity_1.EXAM_SESSION_STATUS.inProgress }, { status: exam_session_entity_1.EXAM_SESSION_STATUS.expired });
        return this.sessions.findOneByOrFail({ id: session.id });
    }
    async computeResult(session) {
        const [exam, questionRows, answerRows] = await Promise.all([
            this.exams.findById(session.examId),
            this.questions.findManyByIds(session.questionOrder),
            this.answers.find({ where: { sessionId: session.id } }),
        ]);
        const byId = new Map(questionRows.map((q) => [q.id, q]));
        const graded = session.questionOrder.flatMap((id) => {
            const q = byId.get(id);
            return q ? [{ id: q.id, correctIndex: q.correctIndex }] : [];
        });
        const selected = new Map(answerRows.map((row) => [row.questionId, row.selectedIndex]));
        const result = this.grading.grade(graded, selected, exam.passMarkPercent);
        return {
            sessionId: session.id,
            status: session.status,
            submittedAt: session.submittedAt,
            ...result,
        };
    }
    async toResponse(session) {
        const [questionList, answerRows] = await Promise.all([
            this.questions.findForStudent(session.questionOrder),
            this.answers.find({ where: { sessionId: session.id } }),
        ]);
        const answers = {};
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
    isUniqueViolation(error) {
        const e = error;
        return (e?.driverError?.code ?? e?.code) === UNIQUE_VIOLATION;
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exam_session_entity_1.ExamSession)),
    __param(1, (0, typeorm_1.InjectRepository)(answer_entity_1.Answer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        common_service_1.CommonService,
        timer_service_1.TimerService,
        grading_service_1.GradingService,
        exams_service_1.ExamsService,
        questions_service_1.QuestionsService,
        users_service_1.UsersService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map