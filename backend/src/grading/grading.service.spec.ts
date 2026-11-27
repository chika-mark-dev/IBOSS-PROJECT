import { beforeEach, describe, expect, it } from '@jest/globals';
import { GradingQuestion, GradingService } from './grading.service';

function makeQuestions(count: number): GradingQuestion[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `q${i + 1}`,
    correctIndex: 1,
  }));
}

function answersFor(
  questions: GradingQuestion[],
  correctCount: number,
): Map<string, number> {
  const answers = new Map<string, number>();
  questions.forEach((question, i) => {
    answers.set(
      question.id,
      i < correctCount ? question.correctIndex : question.correctIndex + 1,
    );
  });
  return answers;
}

describe('GradingService', () => {
  let grading: GradingService;

  beforeEach(() => {
    grading = new GradingService();
  });

  it('scores all correct answers', () => {
    const questions = makeQuestions(4);
    const result = grading.grade(questions, answersFor(questions, 4), 50);

    expect(result.score).toBe(4);
    expect(result.total).toBe(4);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('scores zero when every answer is wrong', () => {
    const questions = makeQuestions(4);
    const result = grading.grade(questions, answersFor(questions, 0), 50);

    expect(result.score).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.passed).toBe(false);
  });

  it('counts unanswered questions as wrong', () => {
    const questions = makeQuestions(4);
    const answers = new Map<string, number>([['q1', 1]]);
    const result = grading.grade(questions, answers, 50);

    expect(result.score).toBe(1);
    expect(result.percentage).toBe(25);
    expect(result.passed).toBe(false);
  });

  it('returns the breakdown in question order with null for unanswered', () => {
    const questions: GradingQuestion[] = [
      { id: 'a', correctIndex: 2 },
      { id: 'b', correctIndex: 0 },
      { id: 'c', correctIndex: 3 },
    ];
    const answers = new Map<string, number>([
      ['a', 2],
      ['b', 1],
    ]);
    const result = grading.grade(questions, answers, 50);

    expect(result.breakdown).toEqual([
      { questionId: 'a', selectedIndex: 2, correctIndex: 2, isCorrect: true },
      { questionId: 'b', selectedIndex: 1, correctIndex: 0, isCorrect: false },
      {
        questionId: 'c',
        selectedIndex: null,
        correctIndex: 3,
        isCorrect: false,
      },
    ]);
  });

  it('passes when the score is exactly on the pass mark', () => {
    const questions = makeQuestions(10);
    const result = grading.grade(questions, answersFor(questions, 7), 70);

    expect(result.passed).toBe(true);
  });

  it('fails when the score is one point under the pass mark', () => {
    const questions = makeQuestions(10);
    const result = grading.grade(questions, answersFor(questions, 6), 70);

    expect(result.passed).toBe(false);
  });

  it('passes on the pass mark where float math would fail (57 of 100)', () => {
    const questions = makeQuestions(100);
    const result = grading.grade(questions, answersFor(questions, 57), 57);

    expect(result.passed).toBe(true);
  });

  it('requires every question when the pass mark is 100', () => {
    const questions = makeQuestions(5);

    expect(grading.grade(questions, answersFor(questions, 5), 100).passed).toBe(
      true,
    );
    expect(grading.grade(questions, answersFor(questions, 4), 100).passed).toBe(
      false,
    );
  });

  it('rounds the percentage to two decimals', () => {
    const questions = makeQuestions(3);
    const result = grading.grade(questions, answersFor(questions, 1), 30);

    expect(result.percentage).toBe(33.33);
  });

  it('throws when there are no questions', () => {
    expect(() => grading.grade([], new Map(), 50)).toThrow();
  });
});
