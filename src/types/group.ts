import type { User } from './user';

export interface Group {
  id: string;
  name: string;
  teacherId: string;
  teacher?: User;
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