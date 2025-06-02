import { getUsers } from './userService';
import { getGroups } from './groupService';

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalGroups: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [usersResponse, groupsResponse] = await Promise.all([
    getUsers(1, 10), // Get all users
    getGroups(1, 10) // Get all groups
  ]);

  const users = usersResponse.data;

  // Use meta.total for total counts
  const totalUsers = usersResponse.meta.total;
  const totalGroups = groupsResponse.meta.total;

  // Calculate role-based counts from data
  const totalStudents = users.filter(user => user.role === 'STUDENT').length;
  const totalTeachers = users.filter(user => user.role === 'TEACHER').length;

  return {
    totalUsers,
    totalStudents,
    totalTeachers,
    totalGroups
  };
}; 