import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export interface Test {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  group: {
    id: number;
    name: string;
  };
}

export interface TestResult {
  id: number;
  test: Test;
  student: {
    id: number;
    username: string;
    fullName: string;
  };
  score: number;
  submissionTime: string | null;
  testAccessId: string;
}

interface TestsState {
  tests: Test[];
  testResults: TestResult[];
  currentTest: Test | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TestsState = {
  tests: [],
  testResults: [],
  currentTest: null,
  status: 'idle',
  error: null,
};

export const fetchGroupTests = createAsyncThunk(
  'tests/fetchGroupTests',
  async (groupId: number) => {
    const response = await api.get(`/tests/group/${groupId}`);
    return response.data;
  }
);

export const fetchStudentTests = createAsyncThunk(
  'tests/fetchStudentTests',
  async () => {
    const response = await api.get('/tests/student');
    return response.data;
  }
);

export const fetchTestByAccessId = createAsyncThunk(
  'tests/fetchTestByAccessId',
  async (testAccessId: string) => {
    const response = await api.get(`/tests/${testAccessId}`);
    return response.data;
  }
);

export const createTest = createAsyncThunk(
  'tests/createTest',
  async (testData: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    groupId: number;
  }) => {
    const response = await api.post('/tests', testData);
    return response.data;
  }
);

export const submitTest = createAsyncThunk(
  'tests/submitTest',
  async ({ testAccessId, answers }: { testAccessId: string; answers: Record<string, string> }) => {
    const response = await api.post(`/test-results/submit/${testAccessId}`, answers);
    return response.data;
  }
);

const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    setCurrentTest: (state, action) => {
      state.currentTest = action.payload;
    },
    clearCurrentTest: (state) => {
      state.currentTest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Group Tests
      .addCase(fetchGroupTests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroupTests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tests = action.payload;
      })
      .addCase(fetchGroupTests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tests';
      })
      // Fetch Student Tests
      .addCase(fetchStudentTests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudentTests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.testResults = action.payload;
      })
      .addCase(fetchStudentTests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tests';
      })
      // Fetch Test By Access ID
      .addCase(fetchTestByAccessId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTestByAccessId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTest = action.payload;
      })
      .addCase(fetchTestByAccessId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch test';
      })
      // Create Test
      .addCase(createTest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTest.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createTest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create test';
      })
      // Submit Test
      .addCase(submitTest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitTest.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitTest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to submit test';
      });
  },
});

export const { setCurrentTest, clearCurrentTest } = testsSlice.actions;
export default testsSlice.reducer;
 