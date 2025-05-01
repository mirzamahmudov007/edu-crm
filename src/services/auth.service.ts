import api from './api';

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (data: {
  username: string;
  password: string;
  fullName: string;
  role: 'TEACHER' | 'STUDENT';
}) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
}; 