import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    bookings: [],
    currentBooking: null,
    bookingFlowState: {
        step: 1, // 1: Select slot, 2: Confirm, 3: Payment
        selectedSlot: null,
    },
    isLoading: false,
    isError: false,
    message: '',
};

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        setBookings: (state, action) => {
            state.bookings = action.payload;
        },
        setCurrentBooking: (state, action) => {
            state.currentBooking = action.payload;
        },
        setBookingFlow: (state, action) => {
            state.bookingFlowState = { ...state.bookingFlowState, ...action.payload };
        },
        resetBookingState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
            state.bookingFlowState = { step: 1, selectedSlot: null };
        }
    },
});

export const { setBookings, setCurrentBooking, setBookingFlow, resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
