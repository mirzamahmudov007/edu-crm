import axiosInstance from "../api/axiosInstance";

export const startQuiz = (quizId: string | number) => {
  return axiosInstance.get(`/quiz/${quizId}/start`).then((res) => res.data);
};
