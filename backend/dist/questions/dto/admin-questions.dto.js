"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminQuestionDto = void 0;
class AdminQuestionDto {
    id;
    examId;
    text;
    options;
    correctIndex;
    position;
    static from(question) {
        const dto = new AdminQuestionDto();
        dto.id = question.id;
        dto.examId = question.examId;
        dto.text = question.text;
        dto.options = [...question.options];
        dto.correctIndex = question.correctIndex;
        dto.position = question.position;
        return dto;
    }
}
exports.AdminQuestionDto = AdminQuestionDto;
//# sourceMappingURL=admin-questions.dto.js.map