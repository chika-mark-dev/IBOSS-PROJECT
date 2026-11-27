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
exports.AdminExamsController = void 0;
const common_1 = require("@nestjs/common");
const create_exam_dto_1 = require("./dto/create-exam.dto");
const exam_detail_dto_1 = require("./dto/exam-detail.dto");
const update_exam_dto_1 = require("./dto/update-exam.dto");
const exams_service_1 = require("./exams.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const common_2 = require("@nestjs/common");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let AdminExamsController = class AdminExamsController {
    exams;
    constructor(exams) {
        this.exams = exams;
    }
    async create(dto) {
        return exam_detail_dto_1.ExamDetailDto.from(await this.exams.create(dto));
    }
    async listAll() {
        const exams = await this.exams.findAll();
        return exams.map((exam) => exam_detail_dto_1.ExamDetailDto.from(exam));
    }
    async detail(id) {
        return exam_detail_dto_1.ExamDetailDto.from(await this.exams.findById(id));
    }
    async update(id, dto) {
        return exam_detail_dto_1.ExamDetailDto.from(await this.exams.update(id, dto));
    }
    async release(id) {
        return exam_detail_dto_1.ExamDetailDto.from(await this.exams.release(id));
    }
    async remove(id) {
        await this.exams.remove(id);
    }
};
exports.AdminExamsController = AdminExamsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", Promise)
], AdminExamsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminExamsController.prototype, "listAll", null);
__decorate([
    (0, common_1.Get)(':id/admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminExamsController.prototype, "detail", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_exam_dto_1.UpdateExamDto]),
    __metadata("design:returntype", Promise)
], AdminExamsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/release'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminExamsController.prototype, "release", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminExamsController.prototype, "remove", null);
exports.AdminExamsController = AdminExamsController = __decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.ROLE.admin),
    (0, common_1.Controller)('exams'),
    __metadata("design:paramtypes", [exams_service_1.ExamsService])
], AdminExamsController);
//# sourceMappingURL=admin-exams.controller.js.map