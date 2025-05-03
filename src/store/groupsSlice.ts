import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import groupsService from '../services/groups.service';

export interface Group {
  id: number;
  name: string;
  teacher: {
    id: number;
    username: string;
    fullName: string;
  };
  students: {
    id: number;
    username: string;
    fullName: string;
  }[];
}

interface GroupsState {
  groups: any;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  status: 'idle',
  error: null,
};

export const fetchAllGroups = createAsyncThunk(
  'groups/fetchAllGroups',
  async () => {
    const response = await groupsService.getAllGroups();
    return response;
  }
);

export const fetchTeacherGroups = createAsyncThunk(
  'groups/fetchTeacherGroups',
  async () => {
    const response = await groupsService.getTeacherGroups();
    return response;
  }
);

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData: { name: string; teacherUsername: string }) => {
    const response = await groupsService.createGroup(groupData);
    return response;
  }
);

export const addStudentToGroup = createAsyncThunk(
  'groups/addStudent',
  async ({ groupId, username }: { groupId: number; username: string }) => {
    const response = await groupsService.addStudent(groupId, username);
    return response;
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Groups
      .addCase(fetchAllGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.status = 'idle';
        state.groups = action.payload;
      })
      .addCase(fetchAllGroups.rejected, (state) => {
        state.status = 'failed';
      })
      // Fetch Teacher Groups
      .addCase(fetchTeacherGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeacherGroups.fulfilled, (state, action) => {
        state.status = 'idle';
        state.groups = action.payload;
      })
      .addCase(fetchTeacherGroups.rejected, (state) => {
        state.status = 'failed';
      })
      // Create Group
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      // Add Student
      .addCase(addStudentToGroup.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        const index = state.groups.findIndex((group:any) => group.id === updatedGroup.id);
        if (index !== -1) {
          state.groups[index] = updatedGroup;
        }
      });
  },
});

export default groupsSlice.reducer; 