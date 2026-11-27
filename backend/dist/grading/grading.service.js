"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradingService = void 0;
const common_1 = require("@nestjs/common");
let GradingService = class GradingService {
    grade(questions, answers, passMarkPercent) {
        const total = questions.length;
        if (total === 0) {
            throw new Error('Cannot grade an exam with no questions');
        }
        const breakdown = questions.map((question) => {
            const selectedIndex = answers.get(question.id) ?? null;
            return {
                questionId: question.id,
                selectedIndex,
                correctIndex: question.correctIndex,
                isCorrect: selectedIndex === question.correctIndex,
            };
        });
        const score = breakdown.filter((item) => item.isCorrect).length;
        const percentage = Math.round((score * 10000) / total) / 100;
        const passed = score * 100 >= passMarkPercent * total;
        return { score, total, percentage, passed, breakdown };
    }
};
exports.GradingService = GradingService;
exports.GradingService = GradingService = __decorate([
    (0, common_1.Injectable)()
], GradingService);
//# sourceMappingURL=grading.service.js.map