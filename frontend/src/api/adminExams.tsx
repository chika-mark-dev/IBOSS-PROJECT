import { request } from './client';
import type { AdminExam, CreateExamInput, UpdateExamInput } from './types';

export function listAdminExams(): Promise<AdminExam[]> {
  return request<AdminExam[]>('GET', '/exams/admin');
}

export function getAdminExam(examId: string): Promise<AdminExam> {
  return request<AdminExam>('GET', `/exams/${examId}/admin`);
}

export function createExam(input: CreateExamInput): Promise<AdminExam> {
  return request<AdminExam>('POST', '/exams', input);
}

// ASSUMED: partial update, returns 409 once the exam is locked
export function updateExam(
  examId: string,
  input: UpdateExamInput,
): Promise<unknown> {
  return request<unknown>('PATCH', `/exams/${examId}`, input);
}

// Makes the exam visible to students. ASSUMED: there is no way to undo this.
export function releaseExam(examId: string): Promise<unknown> {
  return request<unknown>('PATCH', `/exams/${examId}/release`);
}

// ASSUMED: returns 204
export function deleteExam(examId: string): Promise<void> {
  return request<void>('DELETE', `/exams/${examId}`);
}
