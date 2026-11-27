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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = void 0;
const typeorm_1 = require("typeorm");
const exam_session_entity_1 = require("./exam-session.entity");
const question_entity_1 = require("../../questions/entities/question.entity");
let Answer = class Answer {
    id;
    sessionId;
    session;
    questionId;
    question;
    selectedIndex;
    answeredAt;
};
exports.Answer = Answer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Answer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', type: 'uuid' }),
    __metadata("design:type", String)
], Answer.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exam_session_entity_1.ExamSession, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", exam_session_entity_1.ExamSession)
], Answer.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'question_id', type: 'uuid' }),
    __metadata("design:type", String)
], Answer.prototype, "questionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'question_id' }),
    __metadata("design:type", question_entity_1.Question)
], Answer.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'selected_index', type: 'int' }),
    __metadata("design:type", Number)
], Answer.prototype, "selectedIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'answered_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Answer.prototype, "answeredAt", void 0);
exports.Answer = Answer = __decorate([
    (0, typeorm_1.Entity)('answers'),
    (0, typeorm_1.Unique)(['sessionId', 'questionId'])
], Answer);
//# sourceMappingURL=answer.entity.js.map