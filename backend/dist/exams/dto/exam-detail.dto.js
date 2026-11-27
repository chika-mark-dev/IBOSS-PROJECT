"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamDetailDto = void 0;
const exam_summary_dto_1 = require("./exam-summary.dto");
class ExamDetailDto extends exam_summary_dto_1.ExamSummaryDto {
    isLocked;
    isReleased;
    createdAt;
    static from(exam) {
        const dto = new ExamDetailDto();
        Object.assign(dto, exam_summary_dto_1.ExamSummaryDto.from(exam));
        dto.isLocked = exam.isLocked;
        dto.isReleased = exam.isReleased;
        dto.createdAt = exam.createdAt;
        return dto;
    }
}
exports.ExamDetailDto = ExamDetailDto;
//# sourceMappingURL=exam-detail.dto.js.map