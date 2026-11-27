"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSummaryDto = void 0;
class ExamSummaryDto {
    id;
    title;
    durationMinutes;
    passMarkPercent;
    static from(exam) {
        const dto = new ExamSummaryDto();
        dto.id = exam.id;
        dto.title = exam.title;
        dto.durationMinutes = exam.durationMinutes;
        dto.passMarkPercent = exam.passMarkPercent;
        return dto;
    }
}
exports.ExamSummaryDto = ExamSummaryDto;
//# sourceMappingURL=exam-summary.dto.js.map