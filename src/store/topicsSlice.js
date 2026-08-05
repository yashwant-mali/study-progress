import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    selectedTopicId: null,
    loading: false,
    error: null,
};

export const fetchTopics = createAsyncThunk('topics/fetchTopics', async () => {
    const response = await fetch('/api/topics', { cache: 'no-store' });
    if (!response.ok) {
        throw new Error('Unable to load topics');
    }
    return response.json();
});

export const addTopic = createAsyncThunk('topics/addTopic', async (topic) => {
    const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topic),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Unable to create topic');
    }
    return response.json();
});

export const updateTopic = createAsyncThunk('topics/updateTopic', async (topic) => {
    const response = await fetch('/api/topics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topic),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Unable to update topic');
    }
    return response.json();
});

export const deleteTopic = createAsyncThunk('topics/deleteTopic', async (id) => {
    const response = await fetch('/api/topics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Unable to delete topic');
    }
    return id;
});

const topicsSlice = createSlice({
    name: 'topics',
    initialState,
    reducers: {
        selectTopic(state, action) {
            state.selectedTopicId = action.payload;
            state.error = null;
        },
        clearSelection(state) {
            state.selectedTopicId = null;
            state.error = null;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopics.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTopics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unable to load topics';
            })
            .addCase(addTopic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTopic.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.selectedTopicId = action.payload._id;
            })
            .addCase(addTopic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unable to create topic';
            })
            .addCase(updateTopic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTopic.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.map((topic) =>
                    topic._id === action.payload._id ? action.payload : topic,
                );
                state.selectedTopicId = action.payload._id;
            })
            .addCase(updateTopic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unable to update topic';
            })
            .addCase(deleteTopic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTopic.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((topic) => topic._id !== action.payload);
                if (state.selectedTopicId === action.payload) {
                    state.selectedTopicId = null;
                }
            })
            .addCase(deleteTopic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unable to delete topic';
            });
    },
});

export const { selectTopic, clearSelection, setError } = topicsSlice.actions;
export default topicsSlice.reducer;
