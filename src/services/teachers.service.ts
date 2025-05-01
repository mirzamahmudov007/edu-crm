import api from './api';

export interface Teacher {
  id: number;
  username: string;
  fullName: string;
  email: string;
}

export const getAllTeachers = async () => {
  const response = await api.get<Teacher[]>('/users/teachers');
  return response.data;
};

export const getTeacherById = async (id: number) => {
  const response = await api.get<Teacher>(`/users/${id}`);
  return response.data;
};

export const createTeacher = async (data: { username: string; fullName: string; email: string; password: string }) => {
  const response = await api.post<Teacher>('/users', { ...data, role: 'TEACHER' });
  return response.data;
};

export const updateTeacher = async (id: number, data: { fullName: string; email: string }) => {
  const response = await api.put<Teacher>(`/users/${id}`, data);
  return response.data;
};

export const deleteTeacher = async (id: number) => {
  await api.delete(`/users/${id}`);
}; 