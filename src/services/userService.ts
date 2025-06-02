import axiosInstance from '../api/axiosInstance';
import type { PaginatedResponse, User } from '../types/user';

export const getUsers = async (page: number = 1, pageSize: number = 10) => {
  const response = await axiosInstance.get<PaginatedResponse<User>>(`/users?page=${page}&pageSize=${pageSize}`);
  return response.data;
}; 