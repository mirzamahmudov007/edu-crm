import axiosInstance from '../api/axiosInstance';
import type { Group, PaginatedResponse } from '../types/group';

export const getGroups = async (page: number = 1, pageSize: number = 10) => {
  const response = await axiosInstance.get<PaginatedResponse<Group>>(`/group?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const getGroupById = async (id: string) => {
  const response = await axiosInstance.get<Group>(`/group/${id}`);
  return response.data;
};

export const createGroup = async (data: { name: string; teacherId: string }) => {
  const response = await axiosInstance.post<Group>('/group', data);
  return response.data;
};

export const deleteGroup = async (id: string) => {
  const response = await axiosInstance.delete(`/group/${id}`);
  return response.data;
};

export const updateGroup = async (id: string, data: { name: string; teacherId: string }) => {
  const response = await axiosInstance.put<Group>(`/group/${id}`, data);
  return response.data;
};