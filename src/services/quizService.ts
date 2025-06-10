import axiosInstance from "../api/axiosInstance";

export const getQuizzes = (page: number = 1, pageSize: number = 10) => {
  return axiosInstance.get(`/quiz?page=${page}&pageSize=${pageSize}`).then((res) => res.data);
};

export const getQuizById = (id: string) => {
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

export const createQuiz = (data: {
  title: string;
  questionCount: number;
  file: string;
  startDate: string;
  duration: number;
  teacherId: string;
  groupId: string;
}) => {
  return axiosInstance.post('/quiz', data).then((res) => res.data);
};

export const updateQuiz = (id: string, data: {
  title: string;
  questionCount: number;
  file: string;
  startDate: string;
  duration: number;
  teacherId: string;
  groupId: string;
}) => {
  return axiosInstance.put(`/quiz/${id}`, data).then((res) => res.data);
};

export const deleteQuiz = (id: string) => {
  return axiosInstance.delete(`/quiz/${id}`).then((res) => res.data);
};
