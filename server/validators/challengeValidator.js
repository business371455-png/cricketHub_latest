import Joi from 'joi';

export const createChallengeSchema = Joi.object({
    teamName: Joi.string().min(2).max(50).required(),
    teamId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null, ''),
    groundId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    bookingId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    matchType: Joi.string().valid('Tennis', 'Leather', 'Box').required(),
    overs: Joi.number().integer().min(1).max(50).required(),
    playersRequired: Joi.number().integer().min(1).max(22).required(),
    notes: Joi.string().max(500).allow(''),
});

export const requestToJoinSchema = Joi.object({
    teamId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null, ''),
    teamName: Joi.string().min(2).max(50).required(),
    message: Joi.string().max(300).allow(''),
});
