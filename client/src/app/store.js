import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import matchReducer from '../features/match/matchSlice.js';
import groundReducer from '../features/ground/groundSlice.js';
import bookingReducer from '../features/booking/bookingSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        matches: matchReducer,
        grounds: groundReducer,
        bookings: bookingReducer,
    },
});
