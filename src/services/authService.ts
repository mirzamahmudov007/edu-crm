import axiosInstance from "../api/axiosInstance";

export const login = async (data: { phone: string; password: string }) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};
