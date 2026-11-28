export type SessionStatus =
  | 'in_progress'
  | 'submitted'
  | 'submitted_late'
  | 'expired';

// A question as the student sees it. No correct answer here, on purpose.
export interface SessionQuestion {
  id: string;
  text: string;
  options: string[];
}

// Response of POST /exams/:id/sessions and GET /sessions/:id
export interface Session {
  id: string;
  status: SessionStatus;
  expiresAt: string;
  serverTime: string;
  remainingSeconds: number;
  questions: SessionQuestion[];
  answers: Record<string, number>;
}

// Response of PUT /sessions/:id/answers/:questionId
export interface SaveAnswerResponse {
  questionId: string;
  selectedIndex: number;
  serverTime: string;
  remainingSeconds: number;
}

export interface BreakdownItem {
  questionId: string;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
}

// Response of POST /sessions/:id/submit and GET /sessions/:id/result
export interface Result {
  sessionId: string;
  status: SessionStatus;
  submittedAt: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  breakdown: BreakdownItem[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export type Role = 'STUDENT' | 'ADMIN';
export interface ExamSummary {
  id: string;
  title: string;
  durationMinutes: number;
  passMarkPercent: number;
}

// One item of GET /exams/admin (needed Sunday)
export interface AdminExam extends ExamSummary {
  isLocked: boolean;
  isReleased: boolean;
  createdAt: string; // ISO string
}

// Response of GET /users/me
export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Body of POST /exams
// ASSUMED: field names match the list response (title, durationMinutes, passMarkPercent)
export interface CreateExamInput {
  title: string;
  durationMinutes: number;
  passMarkPercent: number;
}

// One question as the admin sees it (includes the correct answer)
export interface Question {
  id: string;
  examId: string;
  text: string;
  options: string[];
  correctIndex: number; // 0-based
  position: number;
}

// Body of POST /exams/:examId/questions
export interface QuestionInput {
  text: string;
  options: string[];
  correctIndex: number; // 0-based
  position: number;
}

// Body of PATCH /exams/:id. ASSUMED: partial update
export type UpdateExamInput = Partial<CreateExamInput>;
