import type { User } from './user';
import type { Test } from './test';

export interface Group {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  teacher?: User;
  students?: User[];
  tests?: Test[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
}