import axiosInstance from "../api/axiosInstance";
import type { Quiz } from '../types/quiz';

export const getQuizzes = async (page: number = 1, pageSize: number = 10) => {
  const response = await axiosInstance.get(`/quiz`, {
    params: { page, pageSize },
  });
  return response.data;
};

export const getQuizById = (id: string) => {
  return axiosInstance.get(`/quiz/${id}/questions`).then((res) => res.data);
};
export const getQuizByDId = (id: string) => {
  return axiosInstance.get(`/quiz/${id}`).then((res) => res.data);
};

export const startQuiz = (quizId: string | number) => {
  return axiosInstance.get(`/quiz/${quizId}/start`).then((res) => res.data);
};

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => res.data);
};

export const getQuizQuestions = async (id: string, params?: { page?: number; pageSize?: number }) => {
  const response = await axiosInstance.get(`/quiz/${id}/questions`, { params });
  return response.data;
};

export const createQuiz = async (data: any) => {
  const response = await axiosInstance.post<Quiz>('/quiz', data);
  return response.data;
};

export const updateQuiz = async (id: string, data: any) => {
  const response = await axiosInstance.put<Quiz>(`/quiz/${id}`, data);
  return response.data;
};

export const deleteQuiz = async (id: string) => {
  await axiosInstance.delete(`/quiz/${id}`);
};
