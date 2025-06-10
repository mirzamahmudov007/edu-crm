
export interface Quiz {
  id: string;
  title: string;
  questionCount: number;
  file: string;
  startDate: string;
  duration: number;
  teacherId: string;
  groupId: string;
  status: 'pending' | 'active' | 'completed';
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