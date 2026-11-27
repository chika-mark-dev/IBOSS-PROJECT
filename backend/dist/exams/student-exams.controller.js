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
exports.StudentExamsController = void 0;
const common_1 = require("@nestjs/common");
const exam_summary_dto_1 = require("./dto/exam-summary.dto");
const exams_service_1 = require("./exams.service");
const user_entity_1 = require("../users/entities/user.entity");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let StudentExamsController = class StudentExamsController {
    exams;
    constructor(exams) {
        this.exams = exams;
    }
    async list() {
        const exams = await this.exams.findReleased();
        return exams.map((exam) => exam_summary_dto_1.ExamSummaryDto.from(exam));
    }
};
exports.StudentExamsController = StudentExamsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentExamsController.prototype, "list", null);
exports.StudentExamsController = StudentExamsController = __decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.ROLE.student),
    (0, common_1.Controller)('exams'),
    __metadata("design:paramtypes", [exams_service_1.ExamsService])
], StudentExamsController);
//# sourceMappingURL=student-exams.controller.js.map