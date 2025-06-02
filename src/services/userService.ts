import axiosInstance from '../api/axiosInstance';
import type { PaginatedResponse, User } from '../types/user';

export const getUsers = async (page: number = 1, pageSize: number = 10) => {
  const response = await axiosInstance.get<PaginatedResponse<User>>(`/users?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const getTeachers = async () => {
  const response = await axiosInstance.get<PaginatedResponse<User>>('/teacher?page=1&pageSize=100');
  return response.data;
};

export const createTeacher = async (data: { phone: string; firstName: string; lastName: string; password: string }) => {
  const response = await axiosInstance.post<User>('/teacher', data);
  return response.data;
};

export const createStudent = async (data: { phone: string; firstName: string; lastName: string; password: string; groupId: string }) => {
  const response = await axiosInstance.post<User>('/student', data);
  return response.data;
};

export const deleteTeacher = async (id: string) => {
  const response = await axiosInstance.delete(`/teacher/${id}`);
  return response.data;
};

export const deleteStudent = async (id: string) => {
  const response = await axiosInstance.delete(`/student/${id}`);
  return response.data;
};

export const updateTeacher = async (id: string, data: User) => {
  const response = await axiosInstance.put(`/teacher/${id}`, data);
  return response.data;
};

export const updateStudent = async (id: string, data: User) => {
  const response = await axiosInstance.put(`/student/${id}`, data);
  return response.data;
};


