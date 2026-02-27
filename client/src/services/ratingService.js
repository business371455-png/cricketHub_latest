import api from './api.js';

export const submitRating = async (ratingData) => {
    const response = await api.post('/ratings', ratingData);
    return response.data;
};

export const getGroundRatings = async (groundId) => {
    const response = await api.get(`/ratings/ground/${groundId}`);
    return response.data;
};
