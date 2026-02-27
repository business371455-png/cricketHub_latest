import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    matches: [],
    currentMatch: null,
    filters: {
        type: '',
        date: '',
        radius: 10,
    },
    isLoading: false,
    isError: false,
    message: '',
};

const matchSlice = createSlice({
    name: 'matches',
    initialState,
    reducers: {
        setMatches: (state, action) => {
            state.matches = action.payload;
        },
        setCurrentMatch: (state, action) => {
            state.currentMatch = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetMatchState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        }
    },
});

export const { setMatches, setCurrentMatch, setFilters, resetMatchState } = matchSlice.actions;
export default matchSlice.reducer;
