import api from './api.js';

export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/bookings/verify-payment', paymentData);
    return response.data;
};

export const getMyBookings = async () => {
    const response = await api.get('/bookings/my');
    return response.data;
};

export const getGroundBookings = async (groundId) => {
    const response = await api.get(`/bookings/ground/${groundId}`);
    return response.data;
};
