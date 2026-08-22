import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    selectedTopicId: null,
    // `loading` is ONLY for the initial full-list fetch — this is the only
    // case that should show the big "Loading topics..." skeleton.
    loading: false,
    // `mutatingId` is the _id of the topic currently being saved/deleted
    // (or the special 'new' value while a brand-new topic is being created).
    // The UI uses this to show a small inline spinner on just that one
    // topic/row instead of re-rendering/hiding the whole topic list.
    mutatingId: null,
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
    // tempId is a client-only optimistic id, never sent to the server.
    const { tempId, ...body } = topic;
    const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Unable to create topic');
    }
    const data = await response.json();
    return { ...data, tempId };
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
        },
        clearError(state) {
            state.error = null;
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

            // ---- Add topic (optimistic) ----
            .addCase(addTopic.pending, (state, action) => {
                state.error = null;
                const { tempId, ...body } = action.meta.arg;
                if (tempId) {
                    state.mutatingId = tempId;
                    const now = new Date().toISOString();
                    state.items.unshift({
                        ...body,
                        _id: tempId,
                        createdAt: now,
                        updatedAt: now,
                        _optimistic: true,
                    });
                    state.selectedTopicId = tempId;
                } else {
                    state.mutatingId = 'new';
                }
            })
            .addCase(addTopic.fulfilled, (state, action) => {
                const { tempId, ...topic } = action.payload;
                state.mutatingId = null;
                if (tempId) {
                    const idx = state.items.findIndex((item) => item._id === tempId);
                    if (idx !== -1) {
                        state.items[idx] = topic;
                    } else {
                        state.items.unshift(topic);
                    }
                    if (state.selectedTopicId === tempId) {
                        state.selectedTopicId = topic._id;
                    }
                } else {
                    state.items.unshift(topic);
                    state.selectedTopicId = topic._id;
                }
            })
            .addCase(addTopic.rejected, (state, action) => {
                state.mutatingId = null;
                const { tempId } = action.meta.arg || {};
                if (tempId) {
                    state.items = state.items.filter((item) => item._id !== tempId);
                    if (state.selectedTopicId === tempId) {
                        state.selectedTopicId = null;
                    }
                }
                state.error = action.error.message || 'Unable to create topic';
            })

            // ---- Update topic (optimistic, with rollback on failure) ----
            .addCase(updateTopic.pending, (state, action) => {
                state.error = null;
                const { id } = action.meta.arg;
                state.mutatingId = id;
                const idx = state.items.findIndex((item) => item._id === id);
                if (idx !== -1) {
                    state.updateSnapshot = { id, previous: state.items[idx] };
                    state.items[idx] = {
                        ...state.items[idx],
                        ...action.meta.arg,
                        _optimistic: true,
                    };
                }
            })
            .addCase(updateTopic.fulfilled, (state, action) => {
                state.mutatingId = null;
                state.updateSnapshot = null;
                const idx = state.items.findIndex((item) => item._id === action.payload._id);
                if (idx !== -1) {
                    state.items[idx] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
                state.selectedTopicId = action.payload._id;
            })
            .addCase(updateTopic.rejected, (state, action) => {
                state.mutatingId = null;
                state.error = action.error.message || 'Unable to update topic';
                const { id } = action.meta.arg || {};
                if (state.updateSnapshot?.id === id) {
                    const idx = state.items.findIndex((item) => item._id === id);
                    if (idx !== -1) {
                        state.items[idx] = state.updateSnapshot.previous;
                    }
                }
                state.updateSnapshot = null;
            })

            // ---- Delete topic ----
            .addCase(deleteTopic.pending, (state, action) => {
                state.error = null;
                state.mutatingId = action.meta.arg;
            })
            .addCase(deleteTopic.fulfilled, (state, action) => {
                state.mutatingId = null;
                state.items = state.items.filter((topic) => topic._id !== action.payload);
                if (state.selectedTopicId === action.payload) {
                    state.selectedTopicId = null;
                }
            })
            .addCase(deleteTopic.rejected, (state, action) => {
                state.mutatingId = null;
                state.error = action.error.message || 'Unable to delete topic';
            });
    },
});

export const { selectTopic, clearSelection, setError, clearError } = topicsSlice.actions;
export default topicsSlice.reducer;
