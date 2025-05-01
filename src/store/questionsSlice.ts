import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  test: {
    id: number;
    title: string;
  };
}

interface QuestionsState {
  questions: Question[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  status: 'idle',
  error: null,
};

export const fetchTestQuestions = createAsyncThunk(
  'questions/fetchTestQuestions',
  async (testId: number) => {
    const response = await api.get(`/questions/${testId}`);
    return response.data;
  }
);

export const addQuestion = createAsyncThunk(
  'questions/addQuestion',
  async ({ testId, questionData }: { 
    testId: number; 
    questionData: {
      text: string;
      options: string[];
      correctAnswer: string;
    }
  }) => {
    const response = await api.post(`/questions/${testId}`, questionData);
    return response.data;
  }
);

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    clearQuestions: (state) => {
      state.questions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Test Questions
      .addCase(fetchTestQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTestQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchTestQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch questions';
      })
      // Add Question
      .addCase(addQuestion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addQuestion.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add question';
      });
  },
});

export const { clearQuestions } = questionsSlice.actions;
export default questionsSlice.reducer; 