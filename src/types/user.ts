export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
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