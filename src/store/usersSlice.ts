import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersService } from '../services/users.service';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

interface UsersState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await usersService.getAllUsers();
  return response;
});

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: { username: string; password: string; fullName: string; role: string }) => {
    const response = await usersService.createUser(userData);
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: number; userData: { fullName: string; role: string } }) => {
    const response = await usersService.updateUser(id, userData);
    return response;
  }
);

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: number) => {
  await usersService.deleteUser(id);
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
        state.error = action.error.message || 'Failed to fetch users';
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
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer; 