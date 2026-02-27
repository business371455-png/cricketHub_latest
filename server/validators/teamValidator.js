import Joi from 'joi';

export const createTeamSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    matchType: Joi.string().valid('Tennis', 'Leather', 'Box').required(),
    maxSize: Joi.number().integer().min(2).max(22).default(11),
    whatsappLink: Joi.string().uri().allow('').optional(),
});
