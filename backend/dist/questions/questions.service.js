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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exams_service_1 = require("../exams/exams.service");
const question_entity_1 = require("./entities/question.entity");
let QuestionsService = class QuestionsService {
    questions;
    exams;
    constructor(questions, exams) {
        this.questions = questions;
        this.exams = exams;
    }
    async create(examId, dto) {
        await this.exams.findEditableById(examId);
        this.assertConsistent(dto.options, dto.correctIndex);
        const last = await this.questions.maximum('position', { examId });
        return this.questions.save(this.questions.create({ ...dto, examId, position: (last ?? 0) + 1 }));
    }
    async listForExam(examId) {
        await this.exams.findById(examId);
        return this.questions.find({
            where: { examId },
            order: { position: 'ASC' },
        });
    }
    async update(id, dto) {
        const question = await this.findById(id);
        await this.exams.findEditableById(question.examId);
        this.assertConsistent(dto.options ?? question.options, dto.correctIndex ?? question.correctIndex);
        Object.assign(question, dto);
        return this.questions.save(question);
    }
    async remove(id) {
        const question = await this.findById(id);
        await this.exams.findEditableById(question.examId);
        await this.questions.remove(question);
    }
    async findById(id) {
        const question = await this.questions.findOne({ where: { id } });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        return question;
    }
    assertConsistent(options, correctIndex) {
        if (correctIndex >= options.length) {
            throw new common_1.BadRequestException('correctIndex must point to one of the options');
        }
        const distinct = new Set(options.map((option) => option.toLowerCase()));
        if (distinct.size !== options.length) {
            throw new common_1.BadRequestException('Options must be different from each other');
        }
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        exams_service_1.ExamsService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map