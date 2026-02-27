import api from './api.js';

export const sendOtp = async (phone) => {
    const response = await api.post('/auth/send-otp', { phone });
    return response.data;
};

export const verifyOtpToken = async (phone, otp) => {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    return response.data;
};
