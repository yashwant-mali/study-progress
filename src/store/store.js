import { configureStore } from '@reduxjs/toolkit';
import topicsReducer from './topicsSlice';

export const store = configureStore({
    reducer: {
        topics: topicsReducer,
    },
});
