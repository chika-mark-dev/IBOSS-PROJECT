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
    (0, common_1.Controller)('exams'),
    __metadata("design:paramtypes", [exams_service_1.ExamsService])
], StudentExamsController);
//# sourceMappingURL=student-exams.controller.js.map