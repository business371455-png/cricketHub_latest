import api from './api.js';

export const createTeam = async (teamData) => {
    const response = await api.post('/teams', teamData);
    return response.data;
};

export const getMyTeams = async () => {
    const response = await api.get('/teams/my');
    return response.data;
};

export const getTeamById = async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
};

export const joinTeam = async (id) => {
    const response = await api.put(`/teams/${id}/join`);
    return response.data;
};

export const leaveTeam = async (id) => {
    const response = await api.put(`/teams/${id}/leave`);
    return response.data;
};

export const disbandTeam = async (id) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
};
