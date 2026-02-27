import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    teams: [],
    currentTeam: null,
    isLoading: false,
    isError: false,
    message: '',
};

const teamSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        setTeams: (state, action) => {
            state.teams = action.payload;
        },
        setCurrentTeam: (state, action) => {
            state.currentTeam = action.payload;
        },
        setTeamLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setTeamError: (state, action) => {
            state.isError = true;
            state.message = action.payload;
        },
        resetTeamState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
    },
});

export const { setTeams, setCurrentTeam, setTeamLoading, setTeamError, resetTeamState } = teamSlice.actions;
export default teamSlice.reducer;
