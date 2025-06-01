import axiosInstance from "../api/axiosInstance";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosInstance.post("/upload/", formData);
  return res.data;
};
