"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentQuestionDto = void 0;
class StudentQuestionDto {
    id;
    text;
    options;
    static from(question) {
        const dto = new StudentQuestionDto();
        dto.id = question.id;
        dto.text = question.text;
        dto.options = [...question.options];
        return dto;
    }
}
exports.StudentQuestionDto = StudentQuestionDto;
//# sourceMappingURL=student-question.dto.js.map