import api from './api';

export interface Group {
  id: number;
  name: string;
  teacher: {
    id: number;
    fullName: string;
  };
}

export const getAllGroups = async () => {
  const response = await api.get<Group[]>('/groups/admin');
  return response.data;
};

export const getGroupById = async (id: number) => {
  const response = await api.get<Group>(`/groups/${id}`);
  return response.data;
};

export const createGroup = async (data: any) => {
  const response = await api.post<Group>('/groups', data);
  return response.data;
};

export const updateGroup = async (id: number, data: { name: string; teacherId: number }) => {
  const response = await api.put<Group>(`/groups/${id}`, data);
  return response.data;
};

export const deleteGroup = async (id: number) => {
  await api.delete(`/groups/${id}`);
};

export const groupsService = {
  getTeacherGroups: async () => {
    const response = await api.get<Group[]>('/groups/teacher');
    return response.data;
  },

  getStudentGroups: async () => {
    const response = await api.get<Group[]>('/groups/student');
    return response.data;
  },

  getAllGroups: getAllGroups,

  createGroup: createGroup,

  updateGroup: updateGroup,

  deleteGroup: deleteGroup,

  addStudent: async (groupId: number, username: string) => {
    const response = await api.post(`/groups/${groupId}/students`, { username });
    return response.data;
  },

  removeStudent: async (groupId: number, studentId: number) => {
    const response = await api.delete(`/groups/${groupId}/students/${studentId}`);
    return response.data;
  }
};

export default groupsService; 