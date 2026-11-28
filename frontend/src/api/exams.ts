import { request } from './client';
import type { ExamSummary } from './types';

// Student list: released exams only
export function listExams(): Promise<ExamSummary[]> {
  return request<ExamSummary[]>('GET', '/exams');
}
