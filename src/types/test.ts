export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Test {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  group?: {
    id: number;
    name: string;
  };
  teacher?: {
    id: number;
    fullName: string;
  };
  questions: Question[];
  totalQuestions: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
}

export interface TestResult {
  id: number;
  test: Test;
  student: {
    id: number;
    fullName: string;
  };
  score: number;
  submissionTime: string;
  timeSpent: number;
  totalQuestions: number;
}

export interface TestSubmission {
  testId: number;
  answers: Record<string, string>; // questionId -> selectedAnswer
} 