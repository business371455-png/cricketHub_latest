import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    grounds: [],
    currentGround: null,
    isLoading: false,
    isError: false,
    message: '',
};

const groundSlice = createSlice({
    name: 'grounds',
    initialState,
    reducers: {
        setGrounds: (state, action) => {
            state.grounds = action.payload;
        },
        setCurrentGround: (state, action) => {
            state.currentGround = action.payload;
        },
        resetGroundState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        }
    },
});

export const { setGrounds, setCurrentGround, resetGroundState } = groundSlice.actions;
export default groundSlice.reducer;
