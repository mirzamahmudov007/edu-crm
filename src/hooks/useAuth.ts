import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authService";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    },
  });
};
