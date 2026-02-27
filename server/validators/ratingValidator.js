import Joi from 'joi';

export const createRatingSchema = Joi.object({
    toUser: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null),
    toGround: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null),
    matchId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null),
    score: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(500).allow(''),
}).or('toUser', 'toGround');
