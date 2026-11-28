import { ExamSession } from '../entities/exam-session.entity';

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
}

export interface AdminResultListItem {
  sessionId: string;
  student: AdminStudent;
  status: ExamSession['status'];
  submittedAt: ExamSession['submittedAt'];
  score: number | null;
  total: number;
  percentage: number | null;
  passed: boolean | null;
}

export interface AdminBreakdownItem {
  questionId: string;
  text: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
}

export interface AdminResultDetail {
  sessionId: string;
  status: ExamSession['status'];
  submittedAt: ExamSession['submittedAt'];
  student: AdminStudent;
  exam: { id: string; title: string; passMarkPercent: number };
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  breakdown: AdminBreakdownItem[];
}
