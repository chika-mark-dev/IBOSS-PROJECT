import { Injectable } from '@nestjs/common';

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

@Injectable()
export class GradingService {
  grade(
    questions: GradingQuestion[],
    answers: Map<string, number>,
    passMarkPercent: number,
  ): GradingResult {
    const total = questions.length;
    if (total === 0) {
      throw new Error('Cannot grade an exam with no questions');
    }

    const breakdown: BreakdownItem[] = questions.map((question) => {
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
}
