export interface GradingQuestion {
    id: string;
    correctIndex: number;
}
export interface BreakdownItem {
    questionId: string;
    selectedIndex: number | null;
    correctIndex: number;
    isCorrect: boolean;
}
export interface GradingResult {
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    breakdown: BreakdownItem[];
}
export declare class GradingService {
    grade(questions: GradingQuestion[], answers: Map<string, number>, passMarkPercent: number): GradingResult;
}
