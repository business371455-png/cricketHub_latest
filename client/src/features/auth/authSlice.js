import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user')) || null;
const token = localStorage.getItem('token') || null;

const initialState = {
    user: user,
    token: token,
    isAuthenticated: !!user && !!token,
    isLoading: false,
    isError: false,
    message: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    },
});

export const { resetAuth, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
