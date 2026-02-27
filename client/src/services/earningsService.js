import api from './api.js';

export const getEarningsSummary = async () => {
    const response = await api.get('/earnings/summary');
    return response.data;
};
