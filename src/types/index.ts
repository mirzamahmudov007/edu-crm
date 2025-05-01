export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: Role;
}

export interface Group {
  id: number;
  name: string;
  teacher: User;
  students: User[];
}

export interface Test {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  group: Group;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  test: Test;
}

export interface TestResult {
  id: number;
  test: Test;
  student: User;
  score: number;
  submissionTime: string | null;
  testAccessId: string;
  answers: Record<string, string>;
  totalQuestions: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
} 