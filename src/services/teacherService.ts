import axiosInstance from '../api/axiosInstance';
import type { Teacher, PaginatedResponse } from '../types/teacher';

export const getTeachers = async (page: number = 1, pageSize: number = 10) => {
  const response = await axiosInstance.get<PaginatedResponse<Teacher>>(`/teacher?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const createTeacher = async (data: { firstName: string; lastName: string; phone: string }) => {
  const response = await axiosInstance.post<Teacher>('/teacher', data);
  return response.data;
};

export const updateTeacher = async (id: number, data: { firstName: string; lastName: string; phone: string }) => {
  const response = await axiosInstance.put<Teacher>(`/teacher/${id}`, data);
  return response.data;
};

export const deleteTeacher = async (id: number) => {
  await axiosInstance.delete(`/teacher/${id}`);
}; 