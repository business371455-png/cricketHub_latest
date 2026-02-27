import api from './api.js';

export const getUserProfile = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
};

export const updateProfile = async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
};

export const toggleRole = async () => {
    const response = await api.put('/users/me/toggle-role');
    return response.data;
};
