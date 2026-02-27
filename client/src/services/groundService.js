import api from './api.js';

export const createGround = async (groundData) => {
    const response = await api.post('/grounds', groundData);
    return response.data;
};

export const getNearbyGrounds = async (params) => {
    const response = await api.get('/grounds/nearby', { params });
    return response.data;
};

export const getMyGrounds = async () => {
    const response = await api.get('/grounds/my');
    return response.data;
};

export const getGroundById = async (id) => {
    const response = await api.get(`/grounds/${id}`);
    return response.data;
};

export const updateGroundSlots = async (id, slotsData) => {
    const response = await api.put(`/grounds/${id}/slots`, slotsData);
    return response.data;
};
