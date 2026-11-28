import { request } from './client';
import type { SaveAnswerResponse, Session, Result } from './types';

// Start a session, or resume the student's existing one for this exam
export function startSession(id: string): Promise<Session> {
  return request<Session>('POST', `/exams/${id}/sessions`);
}
// Load a session by id. Also the call a page refresh makes.
export function getSession(id: string): Promise<Session> {
  return request<Session>('GET', `/sessions/${id}`);
}
// Save one answer. selectedIndex is a 0-based number.
export function saveAnswer(
  sessionId: string,
  questionId: string,
  selectedIndex: number,
): Promise<SaveAnswerResponse> {
  return request<SaveAnswerResponse>(
    'PUT',
    `/sessions/${sessionId}/answers/${questionId}`,
    { selectedIndex },
  );
}
// Submit the exam. Submitting twice returns the same result.
export function submitSession(id: string): Promise<Result> {
  return request<Result>('POST', `/sessions/${id}/submit`);
}

// Result of a closed session. Returns 409 if the session is not submitted yet.
export function getResult(id: string): Promise<Result> {
  return request<Result>('GET', `/sessions/${id}/result`);
}
