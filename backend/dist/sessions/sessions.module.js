"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsModule = void 0;
const common_1 = require("@nestjs/common");
const sessions_service_1 = require("./sessions.service");
const sessions_controller_1 = require("./sessions.controller");
const typeorm_1 = require("@nestjs/typeorm");
const exam_session_entity_1 = require("./entities/exam-session.entity");
const answer_entity_1 = require("./entities/answer.entity");
const exams_module_1 = require("../exams/exams.module");
const users_module_1 = require("../users/users.module");
const questions_module_1 = require("../questions/questions.module");
const grading_module_1 = require("../grading/grading.module");
const common_module_1 = require("../common/common.module");
const timer_module_1 = require("../timer/timer.module");
const auth_module_1 = require("../auth/auth.module");
let SessionsModule = class SessionsModule {
};
exports.SessionsModule = SessionsModule;
exports.SessionsModule = SessionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([exam_session_entity_1.ExamSession, answer_entity_1.Answer]),
            exams_module_1.ExamsModule,
            users_module_1.UsersModule,
            questions_module_1.QuestionsModule,
            grading_module_1.GradingModule,
            common_module_1.CommonModule,
            timer_module_1.TimerModule,
            auth_module_1.AuthModule,
        ],
        providers: [sessions_service_1.SessionsService],
        controllers: [sessions_controller_1.SessionsController],
    })
], SessionsModule);
//# sourceMappingURL=sessions.module.js.map