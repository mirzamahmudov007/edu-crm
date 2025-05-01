import api from './api';

const API_URL = '/users';

export const usersService = {
  getAllUsers: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },

  getAllTeachers: async () => {
    const response = await api.get(`${API_URL}/teachers`);
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  createUser: async (userData: { username: string; password: string; fullName: string; role: string }) => {
    const response = await api.post(API_URL, userData);
    return response.data;
  },

  updateUser: async (id: number, userData: any) => {
    const response = await api.put(`${API_URL}/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    await api.delete(`${API_URL}/${id}`);
    return id;
  },
}; 