import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './../services/api';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  status: 'ACTIVE' | 'DELETED';
}

interface UsersState {
  users: User[];
  deletedUsers: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  deletedUsers: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await api.get('/users');
  return response.data;
});

export const fetchDeletedUsers = createAsyncThunk('users/fetchDeletedUsers', async () => {
  const response = await api.get('/users/deleted');
  return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (userData: Partial<User>) => {
  const response = await api.post( '/users', userData);
  return response.data;
});

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: number; userData: Partial<User> }) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }
);

export const softDeleteUser = createAsyncThunk('users/softDeleteUser', async (id: number) => {
  await api.put(`/users/${id}/soft-delete`);
  return id;
});

export const restoreUser = createAsyncThunk('users/restoreUser', async (id: number) => {
  await api.put(`/users/${id}/restore`);
  return id;
});

export const hardDeleteUser = createAsyncThunk('users/hardDeleteUser', async (id: number) => {
  await api.delete(`/users/${id}`);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchDeletedUsers.fulfilled, (state, action) => {
        state.deletedUsers = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(softDeleteUser.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload);
        if (user) {
          state.users = state.users.filter((u) => u.id !== action.payload);
          state.deletedUsers.push({ ...user, status: 'DELETED' });
        }
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        const user = state.deletedUsers.find((u) => u.id === action.payload);
        if (user) {
          state.deletedUsers = state.deletedUsers.filter((u) => u.id !== action.payload);
          state.users.push({ ...user, status: 'ACTIVE' });
        }
      })
      .addCase(hardDeleteUser.fulfilled, (state, action) => {
        state.deletedUsers = state.deletedUsers.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer; 