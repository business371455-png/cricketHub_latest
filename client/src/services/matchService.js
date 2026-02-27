import api from './api.js';

export const createMatch = async (matchData) => {
    const response = await api.post('/matches', matchData);
    return response.data;
};

export const getNearbyMatches = async (params) => {
    const response = await api.get('/matches/nearby', { params });
    return response.data;
};

export const getMatchById = async (id) => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
};

export const joinMatch = async (id) => {
    const response = await api.put(`/matches/${id}/join`);
    return response.data;
};

export const leaveMatch = async (id) => {
    const response = await api.put(`/matches/${id}/leave`);
    return response.data;
};

export const getMyMatches = async () => {
    const response = await api.get('/matches/my');
    return response.data;
};

export const confirmMatch = async (id) => {
    const response = await api.put(`/matches/${id}/confirm`);
    return response.data;
};

export const cancelMatch = async (id) => {
    const response = await api.put(`/matches/${id}/cancel`);
    return response.data;
};
