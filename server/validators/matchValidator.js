import Joi from 'joi';

export const createMatchSchema = Joi.object({
    teamName: Joi.string().min(2).max(50).required(),
    matchType: Joi.string().valid('Tennis', 'Leather', 'Box').required(),
    playersNeeded: Joi.number().min(1).max(11).required(),
    overs: Joi.number().integer().min(1).max(50).required(),
    groundId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null, ''),
    whatsappLink: Joi.string().uri().allow(''),
    startTime: Joi.date().iso().required(),
});
