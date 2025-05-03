import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import groupsReducer from './groupsSlice';
import testsReducer from './testsSlice';
import questionsReducer from './questionsSlice';
import usersReducer from './usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
    tests: testsReducer,
    questions: questionsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 