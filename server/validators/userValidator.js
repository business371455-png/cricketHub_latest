import Joi from 'joi';

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    role: Joi.string().valid('Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'),
    isOwner: Joi.boolean(),
    profileImage: Joi.string().uri().allow(''),
    location: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required(),
    })
});
