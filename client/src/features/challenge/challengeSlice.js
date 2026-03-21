import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    challenges: [],
    myChallenges: [],
    currentChallenge: null,
    isLoading: false,
    isError: false,
    message: '',
};

const challengeSlice = createSlice({
    name: 'challenges',
    initialState,
    reducers: {
        setChallenges: (state, action) => {
            state.challenges = action.payload;
        },
        setMyChallenges: (state, action) => {
            state.myChallenges = action.payload;
        },
        setCurrentChallenge: (state, action) => {
            state.currentChallenge = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.isError = true;
            state.message = action.payload;
        },
        resetChallengeState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
    },
});

export const {
    setChallenges,
    setMyChallenges,
    setCurrentChallenge,
    setLoading,
    setError,
    resetChallengeState,
} = challengeSlice.actions;

export default challengeSlice.reducer;
