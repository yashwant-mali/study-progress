import { configureStore } from '@reduxjs/toolkit';
import topicsReducer from './topicsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    topics: topicsReducer,
    auth: authReducer,
  },
});
