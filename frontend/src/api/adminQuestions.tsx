import { request } from './client';
import type { Question, QuestionInput } from './types';

// ASSUMED: returns an array of questions for this exam, correct answers included
export function listQuestions(examId: string): Promise<Question[]> {
  return request<Question[]>('GET', `/exams/${examId}/questions`);
}

export function createQuestion(
  examId: string,
  input: QuestionInput,
): Promise<Question> {
  return request<Question>('POST', `/exams/${examId}/questions`, input);
}

// Uses the QUESTION's id, not the exam's. ASSUMED: partial update
export function updateQuestion(
  questionId: string,
  input: Partial<QuestionInput>,
): Promise<unknown> {
  return request<unknown>('PATCH', `/questions/${questionId}`, input);
}

// ASSUMED: returns 204
export function deleteQuestion(questionId: string): Promise<void> {
  return request<void>('DELETE', `/questions/${questionId}`);
}
