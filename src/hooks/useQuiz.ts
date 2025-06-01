import { useQuery } from "@tanstack/react-query";
import { startQuiz } from "../services/quizService";

export const useStartQuiz = (quizId: string | number) => {
  return useQuery({
    queryKey: ["quizStart", quizId],
    queryFn: () => startQuiz(quizId),
  });
};
