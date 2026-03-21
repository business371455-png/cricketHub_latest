import api from './api.js';

export const getChallenges = async (params) => {
    const response = await api.get('/challenges', { params });
    return response.data;
};

export const getMyChallenges = async () => {
    const response = await api.get('/challenges/my');
    return response.data;
};

export const getChallengeById = async (id) => {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
};

export const createChallenge = async (data) => {
    const response = await api.post('/challenges', data);
    return response.data;
};

export const requestToJoin = async (id, data) => {
    const response = await api.put(`/challenges/${id}/request`, data);
    return response.data;
};

export const selectOpponent = async (challengeId, requestId) => {
    const response = await api.put(`/challenges/${challengeId}/accept/${requestId}`);
    return response.data;
};

export const rejectRequest = async (challengeId, requestId) => {
    const response = await api.put(`/challenges/${challengeId}/reject/${requestId}`);
    return response.data;
};

export const cancelChallenge = async (id) => {
    const response = await api.delete(`/challenges/${id}`);
    return response.data;
};
