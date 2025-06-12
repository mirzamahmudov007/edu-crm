export interface Test {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export interface Option {
  id: string;
  text: string;
} 