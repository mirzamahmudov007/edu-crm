import axiosInstance from "../api/axiosInstance";

type Entity = "users" | "teacher" | "student" | "quiz";

export const fetchList = (entity: Entity, params?: any) => {
  return axiosInstance.get(`/${entity}`, { params }).then((res) => res.data);
};

export const fetchOne = (entity: Entity, id: number | string) => {
  return axiosInstance.get(`/${entity}/${id}`).then((res) => res.data);
};

export const createItem = (entity: Entity, data: any) => {
  return axiosInstance.post(`/${entity}`, data).then((res) => res.data);
};

export const updateItem = (entity: Entity, id: string | number, data: any) => {
  return axiosInstance.put(`/${entity}/${id}`, data).then((res) => res.data);
};

export const deleteItem = (entity: Entity, id: string | number) => {
  return axiosInstance.delete(`/${entity}/${id}`).then((res) => res.data);
};
